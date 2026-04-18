import type { Metadata } from 'next'
import './globals.css'
import './guides/guides.css'
import { validateEnv } from '@/lib/env'
import { ErrorBoundary } from '@/components/ErrorBoundary'
import { Toaster } from 'react-hot-toast'
import { AuthProvider } from '@/context/AuthContext'

validateEnv()

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || 'https://roamind.app'),
  title: {
    default: 'Roamind — AI Travel Brain',
    template: '%s | Roamind',
  },
  description: 'Your AI-powered travel intelligence platform. Plan trips, discover restaurants, find hotels, check weather, and get AI-powered travel advice for destinations worldwide.',
  keywords: [
    'travel planner',
    'AI travel assistant',
    'trip itinerary',
    'restaurant recommendations',
    'hotel booking',
    'flight search',
    'visa requirements',
    'travel budget',
    'packing list',
    'travel guide',
  ],
  authors: [{ name: 'Roamind Team' }],
  creator: 'Roamind',
  publisher: 'Roamind',
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://roamind.app',
    siteName: 'Roamind',
    title: 'Roamind — AI Travel Brain',
    description: 'Your AI-powered travel intelligence platform. Plan trips, discover restaurants, find hotels, and get AI-powered travel advice.',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Roamind - AI Travel Platform',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Roamind — AI Travel Brain',
    description: 'Your AI-powered travel intelligence platform',
    images: ['/og-image.png'],
    creator: '@RoamindAI',
  },
  alternates: {
    canonical: 'https://roamind.app',
  },
  category: 'Travel',
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
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="manifest" href="/manifest.json" />
        <script type="application/ld+json" dangerouslySetInnerHTML={{__html: JSON.stringify({ "@context": "https://schema.org", "@type": "TravelAgency", name: "Roamind", description: "AI-powered travel planning platform", url: "https://roamind.app", potentialAction: { "@type": "SearchAction", target: "https://roamind.app/search?q={search_term_string}", "query-input": "required name=search_term_string" } })}} />
        <script async src="https://www.googletagmanager.com/gtag/js?id=GA_MEASUREMENT_ID" />
        <script dangerouslySetInnerHTML={{__html: `window.dataLayer = window.dataLayer || []; function gtag(){dataLayer.push(arguments);} gtag('js', new Date()); gtag('config', 'GA_MEASUREMENT_ID');`}} />
      </head>
      <body suppressHydrationWarning={true}>
        <ErrorBoundary>
          <AuthProvider>
            {children}
          </AuthProvider>
        </ErrorBoundary>
        <Toaster position="top-right" />
      </body>
    </html>
  )
}
