import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export async function POST(req: Request) {
    try {
        const body = await req.json()
        const { transaction_id, user_id, plan } = body

        if (!transaction_id || !user_id || !plan) {
            return NextResponse.json({ error: 'Missing required parameters' }, { status: 400 })
        }

        // Verify transaction with FedaPay API
        const fedapayEnv = process.env.NEXT_PUBLIC_FEDAPAY_ENVIRONMENT || 'sandbox'
        const apiUrl = fedapayEnv === 'live' 
            ? 'https://api.fedapay.com/v1/transactions/'
            : 'https://sandbox-api.fedapay.com/v1/transactions/'

        const response = await fetch(`${apiUrl}${transaction_id}`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${process.env.FEDAPAY_SECRET_KEY}`,
                'Accept': 'application/json'
            }
        })

        if (!response.ok) {
            console.error('FedaPay API error:', await response.text())
            return NextResponse.json({ error: 'Failed to verify transaction with FedaPay' }, { status: 400 })
        }

        const data = await response.json()
        const transaction = data.v1 ? data.v1.transaction : data.transaction

        if (transaction.status !== 'approved') {
            return NextResponse.json({ error: 'Transaction is not approved' }, { status: 400 })
        }

        // Verify that the amount matches expected (optional but recommended)
        // Here we just update the database since we trust the transaction_id was approved

        // Initialize Supabase admin client to bypass RLS
        const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
        const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY!
        
        const supabaseAdmin = createClient(supabaseUrl, supabaseServiceRoleKey)

        // 1. Update user's profile to is_premium
        const { error: profileError } = await supabaseAdmin
            .from('profiles')
            .update({ is_premium: true })
            .eq('user_id', user_id)

        if (profileError) {
            console.error('Error updating profile:', profileError)
            return NextResponse.json({ error: 'Failed to update profile' }, { status: 500 })
        }

        // 2. Create or update subscription
        // First check if a subscription exists
        const { data: existingSub } = await supabaseAdmin
            .from('subscriptions')
            .select('*')
            .eq('user_id', user_id)
            .single()

        let subError
        if (existingSub) {
            const { error } = await supabaseAdmin
                .from('subscriptions')
                .update({ 
                    status: 'active',
                    plan: plan,
                    stripe_subscription_id: transaction_id.toString(), // Using this field for FedaPay ID for now
                })
                .eq('user_id', user_id)
            subError = error
        } else {
            const { error } = await supabaseAdmin
                .from('subscriptions')
                .insert({
                    user_id: user_id,
                    status: 'active',
                    plan: plan,
                    stripe_subscription_id: transaction_id.toString()
                })
            subError = error
        }

        if (subError) {
            console.error('Error updating subscription:', subError)
            // Even if sub fails, profile is premium now, which is the main flag
        }

        return NextResponse.json({ success: true, message: 'Payment verified and profile updated' })
    } catch (error: any) {
        console.error('Verify endpoint error:', error)
        return NextResponse.json({ error: error.message || 'Internal server error' }, { status: 500 })
    }
}
