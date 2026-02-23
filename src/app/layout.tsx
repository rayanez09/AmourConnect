import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { ToastProvider } from '@/components/ui/Toast'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
})

export const metadata: Metadata = {
  title: {
    default: 'Ecoute et Orientation – Rencontres sérieuses en ligne',
    template: '%s | Ecoute et Orientation',
  },
  description:
    "Rejoignez Ecoute et Orientation, la plateforme de rencontres sérieuses pour adultes. Créez votre profil, rencontrez des personnes compatibles et échangez en toute sécurité.",
  keywords: ['rencontre', 'site de rencontre', 'célibataire', 'amour', 'relation sérieuse'],
  authors: [{ name: 'Ecoute et Orientation' }],
  creator: 'Ecoute et Orientation',
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    type: 'website',
    locale: 'fr_FR',
    title: 'Ecoute et Orientation – Rencontres sérieuses en ligne',
    description: 'Trouvez votre âme sœur sur Ecoute et Orientation.',
    siteName: 'Ecoute et Orientation',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Ecoute et Orientation – Rencontres sérieuses en ligne',
    description: 'Trouvez votre âme sœur sur Ecoute et Orientation.',
  },
  verification: {
    google: '',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="fr" className="dark">
      <body className={`${inter.variable} font-sans antialiased bg-slate-950 text-white`}>
        <ToastProvider>
          {children}
        </ToastProvider>
      </body>
    </html>
  )
}
