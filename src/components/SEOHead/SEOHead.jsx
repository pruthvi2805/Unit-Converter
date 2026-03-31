import { useEffect } from 'react'

const SITE_URL = 'https://convert.kpruthvi.com'
const DEFAULT_OG_IMAGE = `${SITE_URL}/favicon.svg`
const SITE_NAME = 'Convert'

function SEOHead({
  title,
  description,
  keywords,
  canonicalPath,
  type = 'website',
  structuredData,
  breadcrumbs,
  noindex = false,
}) {
  const fullTitle = title.includes('convert.kpruthvi.com')
    ? title
    : `${title} | convert.kpruthvi.com`
  const canonicalUrl = canonicalPath ? `${SITE_URL}${canonicalPath}` : SITE_URL

  useEffect(() => {
    document.title = fullTitle

    const updateMeta = (selector, content, attr = 'content') => {
      let element = document.querySelector(selector)
      if (!element) {
        element = document.createElement('meta')
        const property = selector.match(/property="([^"]+)"/)?.[1]
        const name = selector.match(/name="([^"]+)"/)?.[1]
        if (property) element.setAttribute('property', property)
        if (name) element.setAttribute('name', name)
        document.head.appendChild(element)
      }
      element.setAttribute(attr, content)
    }

    updateMeta('meta[name="description"]', description)
    if (keywords) updateMeta('meta[name="keywords"]', keywords)
    updateMeta('meta[name="robots"]', noindex ? 'noindex, nofollow' : 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1')

    updateMeta('meta[property="og:title"]', fullTitle)
    updateMeta('meta[property="og:description"]', description)
    updateMeta('meta[property="og:url"]', canonicalUrl)
    updateMeta('meta[property="og:type"]', type)
    updateMeta('meta[property="og:site_name"]', SITE_NAME)
    updateMeta('meta[property="og:image"]', DEFAULT_OG_IMAGE)
    updateMeta('meta[property="og:image:width"]', '1200')
    updateMeta('meta[property="og:image:height"]', '630')
    updateMeta('meta[property="og:image:alt"]', title)
    updateMeta('meta[property="og:locale"]', 'en_US')

    updateMeta('meta[name="twitter:card"]', 'summary_large_image')
    updateMeta('meta[name="twitter:title"]', fullTitle)
    updateMeta('meta[name="twitter:description"]', description)
    updateMeta('meta[name="twitter:image"]', DEFAULT_OG_IMAGE)

    let canonicalEl = document.querySelector('link[rel="canonical"]')
    if (!canonicalEl) {
      canonicalEl = document.createElement('link')
      canonicalEl.setAttribute('rel', 'canonical')
      document.head.appendChild(canonicalEl)
    }
    canonicalEl.setAttribute('href', canonicalUrl)

    const structuredDataArray = []
    if (breadcrumbs?.length) {
      structuredDataArray.push({
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: breadcrumbs.map((item, index) => ({
          '@type': 'ListItem',
          position: index + 1,
          name: item.label,
          item: item.href ? `${SITE_URL}${item.href}` : undefined,
        })),
      })
    }
    if (structuredData) {
      structuredDataArray.push(...(Array.isArray(structuredData) ? structuredData : [structuredData]))
    }

    let scriptEl = document.querySelector('script[data-seo="structured-data"]')
    if (structuredDataArray.length === 0) {
      scriptEl?.remove()
      return
    }

    if (!scriptEl) {
      scriptEl = document.createElement('script')
      scriptEl.setAttribute('type', 'application/ld+json')
      scriptEl.setAttribute('data-seo', 'structured-data')
      document.head.appendChild(scriptEl)
    }

    scriptEl.textContent = JSON.stringify(structuredDataArray.length === 1 ? structuredDataArray[0] : structuredDataArray)
  }, [breadcrumbs, canonicalUrl, description, fullTitle, keywords, noindex, structuredData, title, type])

  return null
}

export function generateConverterStructuredData(converter, categoryName) {
  const structuredData = [
    {
      '@context': 'https://schema.org',
      '@type': 'WebApplication',
      name: converter.name,
      url: `${SITE_URL}/${converter.categorySlug}/${converter.slug}`,
      description: converter.description,
      applicationCategory: 'UtilityApplication',
      operatingSystem: 'Any',
      browserRequirements: 'Requires JavaScript',
      offers: {
        '@type': 'Offer',
        price: '0',
        priceCurrency: 'USD',
      },
      publisher: {
        '@type': 'Organization',
        name: SITE_NAME,
        url: SITE_URL,
      },
    },
    {
      '@context': 'https://schema.org',
      '@type': 'HowTo',
      name: `How to use the ${converter.name}`,
      description: converter.description,
      step: [
        { '@type': 'HowToStep', name: 'Enter a value', text: `Enter a value in ${converter.fromUnit.name}.` },
        { '@type': 'HowToStep', name: 'Review the result', text: `Convert will instantly show the matching ${converter.toUnit.name.toLowerCase()} result.` },
        { '@type': 'HowToStep', name: 'Check the formula', text: `Use the formula reference and examples to verify the conversion.` },
      ],
      tool: { '@type': 'HowToTool', name: `${categoryName} converter` },
    },
  ]

  if (converter.commonConversions?.length) {
    structuredData.push({
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: converter.commonConversions.slice(0, 4).map((item) => ({
        '@type': 'Question',
        name: `What is ${item.from} in ${converter.toUnit.name.toLowerCase()}?`,
        acceptedAnswer: {
          '@type': 'Answer',
          text: `${item.from} equals ${item.to}.`,
        },
      })),
    })
  }

  return structuredData
}

export function generateOrganizationSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: SITE_NAME,
    url: SITE_URL,
    logo: `${SITE_URL}/pwa-192x192.svg`,
    sameAs: ['https://kpruthvi.com'],
  }
}

export function generateWebSiteSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: SITE_NAME,
    alternateName: 'Convert unit converter',
    url: SITE_URL,
    description: 'Private, browser-based converters for everyday, technical, and scientific units.',
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: `${SITE_URL}/?q={search_term_string}`,
      },
      'query-input': 'required name=search_term_string',
    },
    publisher: {
      '@type': 'Organization',
      name: SITE_NAME,
      url: SITE_URL,
    },
  }
}

export default SEOHead
