import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'
import type { Database } from '@/types/database.types'

export async function updateSession(request: NextRequest) {
    let supabaseResponse = NextResponse.next({ request })

    const supabase = createServerClient<Database>(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        {
            cookies: {
                getAll() {
                    return request.cookies.getAll()
                },
                setAll(cookiesToSet) {
                    cookiesToSet.forEach(({ name, value }) =>
                        request.cookies.set(name, value)
                    )
                    supabaseResponse = NextResponse.next({ request })
                    cookiesToSet.forEach(({ name, value, options }) =>
                        supabaseResponse.cookies.set(name, value, options)
                    )
                },
            },
        }
    )

    // Refresh session if expired
    const {
        data: { user },
    } = await supabase.auth.getUser()

    // Protected routes
    const protectedPaths = ['/dashboard', '/profile', '/search', '/messages', '/matches']
    const adminPaths = ['/admin']
    const authPaths = ['/auth/login', '/auth/register', '/auth/forgot-password']

    const isProtectedPath = protectedPaths.some((path) =>
        request.nextUrl.pathname.startsWith(path)
    )
    const isAdminPath = adminPaths.some((path) =>
        request.nextUrl.pathname.startsWith(path)
    )
    const isAuthPath = authPaths.some((path) =>
        request.nextUrl.pathname.startsWith(path)
    )

    // Redirect unauthenticated users from protected routes
    if (!user && (isProtectedPath || isAdminPath)) {
        const url = request.nextUrl.clone()
        url.pathname = '/auth/login'
        url.searchParams.set('redirectedFrom', request.nextUrl.pathname)
        return NextResponse.redirect(url)
    }

    // Redirect authenticated users from auth routes
    if (user && isAuthPath) {
        const url = request.nextUrl.clone()
        url.pathname = '/dashboard'
        return NextResponse.redirect(url)
    }

    return supabaseResponse
}
