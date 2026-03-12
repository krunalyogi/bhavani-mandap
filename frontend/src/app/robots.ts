import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.FRONTEND_URL || 'https://bhavani-mandap.vercel.app';

  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: [
        '/dashboard/',
        '/api/',
        '/_next/',
      ],
    },
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
