// Generate sitemap.xml from converter routes
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Import categories from converterRoutes
const converterRoutesPath = path.join(__dirname, '../src/data/converterRoutes.js');
const converterRoutesContent = fs.readFileSync(converterRoutesPath, 'utf-8');

// Extract category slugs and converter slugs using regex
const categoryRegex = /slug:\s*'([^']+)',\s*\n\s*name:/g;
const converterRegex = /slug:\s*'([^']+)',\s*\n\s*name:\s*'[^']+',\s*\n\s*fromUnit:/g;

const baseUrl = 'https://convert.kpruthvi.com';
const today = new Date().toISOString().split('T')[0];

// Static pages
const staticPages = [
  { url: '/', priority: '1.0', changefreq: 'weekly' },
  { url: '/currency', priority: '0.9', changefreq: 'daily' },
];

// Popular currency pairs for SEO
const currencyPairs = [
  'usd-eur', 'usd-gbp', 'usd-jpy', 'usd-cad', 'usd-aud',
  'eur-usd', 'eur-gbp', 'gbp-usd', 'usd-inr', 'usd-cny',
  'usd-chf', 'usd-mxn', 'eur-jpy', 'gbp-eur', 'aud-usd',
  'usd-krw', 'usd-brl', 'usd-sgd', 'usd-hkd', 'usd-nzd'
];

currencyPairs.forEach(pair => {
  staticPages.push({ url: `/currency/${pair}`, priority: '0.7', changefreq: 'daily' });
});

// Parse categories and converters
let currentCategory = null;
const urls = [...staticPages];

// Simple extraction - read the file and parse
const lines = converterRoutesContent.split('\n');
let inCategory = false;
let inConverter = false;
let categorySlug = '';
let converterSlug = '';

for (let i = 0; i < lines.length; i++) {
  const line = lines[i];

  // Detect category
  if (line.includes("slug: '") && lines[i + 1] && lines[i + 1].includes("name: '") && lines[i + 2] && lines[i + 2].includes("description:")) {
    const match = line.match(/slug:\s*'([^']+)'/);
    if (match) {
      categorySlug = match[1];
      urls.push({ url: `/${categorySlug}`, priority: '0.8', changefreq: 'weekly' });
    }
  }

  // Detect converter (has fromUnit on a nearby line)
  if (line.includes("slug: '") && lines[i + 1] && lines[i + 1].includes("name: '") && lines[i + 2] && lines[i + 2].includes("fromUnit:")) {
    const match = line.match(/slug:\s*'([^']+)'/);
    if (match && categorySlug) {
      converterSlug = match[1];
      urls.push({ url: `/${categorySlug}/${converterSlug}`, priority: '0.6', changefreq: 'monthly' });
    }
  }
}

// Generate XML
const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map(page => `  <url>
    <loc>${baseUrl}${page.url}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>${page.changefreq}</changefreq>
    <priority>${page.priority}</priority>
  </url>`).join('\n')}
</urlset>`;

// Write sitemap
const sitemapPath = path.join(__dirname, '../public/sitemap.xml');
fs.writeFileSync(sitemapPath, sitemap);

console.log(`Generated sitemap.xml with ${urls.length} URLs`);
