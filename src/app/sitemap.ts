import { MetadataRoute } from 'next'

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://fenaquery.fenaxra.com'
  const routes = [
    '',
    '/sql-to-mongo',
    '/json-to-types',
    '/json-to-sql',
    '/json-beautifier',
    '/json-minifier',
    '/encrypt',
    '/json-repair',
    '/json-to-lang',
    '/sql-visualizer',
  ]

  return routes.map(route => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date().toISOString().split('T')[0],
    changeFrequency: 'weekly' as const,
    priority: route === '' ? 1.0 : 0.8,
  }))
}
