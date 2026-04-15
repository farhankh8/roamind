import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: [
        '/api/',
        '/dashboard/',
        '/settings/',
        '/saved/',
        '/packing/',
        '/budget/',
        '/chat/',
        '/passport/',
        '/auth/',
      ],
    },
    sitemap: 'https://roamind.app/sitemap.xml',
  }
}
