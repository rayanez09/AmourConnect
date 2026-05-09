import type { Metadata } from 'next'
import { Outfit } from 'next/font/google'
import './globals.css'
import { ToastProvider } from '@/components/ui/Toast'
import { ThemeProvider } from '@/components/providers/ThemeProvider'

const outfit = Outfit({
  subsets: ['latin'],
  variable: '--font-outfit',
  display: 'swap',
})

export const metadata: Metadata = {
  title: {
    default: 'AmourConnect – Rencontres sérieuses en ligne',
    template: '%s | AmourConnect',
  },
  description:
    "Rejoignez AmourConnect, la plateforme de rencontres sérieuses pour adultes. Créez votre profil, rencontrez des personnes compatibles et échangez en toute sécurité.",
  keywords: ['rencontre', 'site de rencontre', 'célibataire', 'amour', 'relation sérieuse'],
  authors: [{ name: 'AmourConnect' }],
  creator: 'AmourConnect',
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    type: 'website',
    locale: 'fr_FR',
    title: 'AmourConnect – Rencontres sérieuses en ligne',
    description: 'Trouvez votre âme sœur sur AmourConnect.',
    siteName: 'AmourConnect',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'AmourConnect – Rencontres sérieuses en ligne',
    description: 'Trouvez votre âme sœur sur AmourConnect.',
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
    <html lang="fr" suppressHydrationWarning>
      <body className={`${outfit.variable} font-sans antialiased transition-colors duration-300`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem={false}
          disableTransitionOnChange
        >
          <ToastProvider>
            {children}
          </ToastProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
