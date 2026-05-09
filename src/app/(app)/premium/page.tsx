import { Metadata } from 'next'
import PremiumClient from './PremiumClient'

export const metadata: Metadata = { title: 'Premium – AmourConnect' }

export default function PremiumPage() {
    return <PremiumClient />
}
