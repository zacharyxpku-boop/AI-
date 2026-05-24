import type { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: ['/', '/pricing', '/factory', '/poc', '/poc/report', '/docs', '/inquire', '/enterprise', '/product/*', '/report/*', '/invite', '/settings/kuaizi', '/privacy', '/terms', '/legal/*'],
        disallow: [
          '/api/*',
          '/admin/*',
          '/settings',
          '/modules/*',
          '/pipelines/*',
          '/tools/*',
          '/cases/*',
          '/product/*',
          '/me/*',
          '/benchmark/*',
          '/pricing/checkout*',
        ],
      },
    ],
    sitemap: 'https://wenai-one.vercel.app/sitemap.xml',
  };
}
