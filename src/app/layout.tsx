import type { Metadata } from 'next'
import { DM_Serif_Text } from 'next/font/google'
import './globals.css'

const dmSerifText = DM_Serif_Text({ 
  weight: ['400'],
  subsets: ['latin'],
  style: ['normal', 'italic']
})

export const metadata: Metadata = {
  title: 'Cultural Events Platform',
  description: 'Discover and book cultural events that match your taste. Find theater, opera, concerts, and more.',
  keywords: ['cultural events', 'theater', 'opera', 'concerts', 'Vienna', 'events'],
  authors: [{ name: 'Cultural Events Platform' }],
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://your-domain.com',
    title: 'Cultural Events Platform',
    description: 'Discover cultural events that match your taste',
    siteName: 'Cultural Events Platform',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Cultural Events Platform',
    description: 'Discover cultural events that match your taste',
  },
  robots: {
    index: true,
    follow: true,
  },
  viewport: {
    width: 'device-width',
    initialScale: 1,
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={dmSerifText.className}>
        <div className="min-h-screen bg-white">
          {children}
        </div>
      </body>
    </html>
  )
}