import { Metadata } from 'next'
import PremiumClient from '@/app/(app)/premium/PremiumClient'

export const metadata: Metadata = { title: 'Premium – AmourConnect' }

export default function PremiumPage() {
    return <PremiumClient />
}
