import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import { allConverters, categories } from '../src/data/converterRegistry.js'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const baseUrl = 'https://convert.kpruthvi.com'
const today = new Date().toISOString().split('T')[0]

const staticPages = [
  { url: '/', priority: '1.0', changefreq: 'weekly' },
  { url: '/categories', priority: '0.9', changefreq: 'weekly' },
  { url: '/privacy', priority: '0.3', changefreq: 'yearly' },
]

const urls = [
  ...staticPages,
  ...categories.map((category) => ({ url: `/${category.slug}`, priority: '0.8', changefreq: 'weekly' })),
  ...allConverters.map((converter) => ({ url: converter.path, priority: '0.6', changefreq: 'monthly' })),
]

const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map((page) => `  <url>
    <loc>${baseUrl}${page.url}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>${page.changefreq}</changefreq>
    <priority>${page.priority}</priority>
  </url>`).join('\n')}
</urlset>`

const sitemapPath = path.join(__dirname, '../public/sitemap.xml')
fs.writeFileSync(sitemapPath, sitemap)

console.log(`Generated sitemap.xml with ${urls.length} URLs`)
