import type { Metadata } from 'next'
import './globals.css'
import './guides/guides.css'
import { validateEnv } from '@/lib/env'
import { ErrorBoundary } from '@/components/ErrorBoundary'
import { Toaster } from 'react-hot-toast'

validateEnv()

export const metadata: Metadata = {
  title: 'Roamind — AI Travel Brain',
  description: 'Your AI-powered travel intelligence platform. Plan, discover and explore the world smarter.',
  keywords: 'travel, AI, itinerary, hotels, flights, visa, weather, roamind',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" data-scroll-behavior="smooth">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,700;0,900;1,700&family=Outfit:wght@300;400;500;600;700&display=swap"
          rel="stylesheet"
        />
        <meta name="theme-color" content="#000814" />
      </head>
      <body suppressHydrationWarning={true}>
        <ErrorBoundary>{children}</ErrorBoundary>
        <Toaster position="top-right" />
      </body>
    </html>
  )
}