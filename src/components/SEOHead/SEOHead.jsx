import { useEffect } from 'react'

const SITE_URL = 'https://convert.kpruthvi.com'
const DEFAULT_OG_IMAGE = `${SITE_URL}/favicon.svg`
const SITE_NAME = 'Convert - Free Unit Converter'

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
    // Update document title
    document.title = fullTitle

    // Helper to update or create meta tag
    const updateMeta = (selector, content, attr = 'content') => {
      let el = document.querySelector(selector)
      if (el) {
        el.setAttribute(attr, content)
      } else {
        el = document.createElement('meta')
        if (selector.includes('property=')) {
          const prop = selector.match(/property="([^"]+)"/)?.[1]
          if (prop) el.setAttribute('property', prop)
        } else if (selector.includes('name=')) {
          const name = selector.match(/name="([^"]+)"/)?.[1]
          if (name) el.setAttribute('name', name)
        }
        el.setAttribute(attr, content)
        document.head.appendChild(el)
      }
    }

    // Helper to remove meta tag
    const removeMeta = (selector) => {
      const el = document.querySelector(selector)
      if (el) el.remove()
    }

    // Update meta tags
    updateMeta('meta[name="description"]', description)
    if (keywords) {
      updateMeta('meta[name="keywords"]', keywords)
    }

    // Robots meta
    if (noindex) {
      updateMeta('meta[name="robots"]', 'noindex, nofollow')
    } else {
      updateMeta('meta[name="robots"]', 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1')
    }

    // OpenGraph
    updateMeta('meta[property="og:title"]', title)
    updateMeta('meta[property="og:description"]', description)
    updateMeta('meta[property="og:url"]', canonicalUrl)
    updateMeta('meta[property="og:type"]', type)
    updateMeta('meta[property="og:site_name"]', SITE_NAME)
    updateMeta('meta[property="og:image"]', DEFAULT_OG_IMAGE)
    updateMeta('meta[property="og:image:width"]', '1200')
    updateMeta('meta[property="og:image:height"]', '630')
    updateMeta('meta[property="og:image:alt"]', title)
    updateMeta('meta[property="og:locale"]', 'en_US')

    // Twitter Card
    updateMeta('meta[name="twitter:card"]', 'summary_large_image')
    updateMeta('meta[name="twitter:title"]', title)
    updateMeta('meta[name="twitter:description"]', description)
    updateMeta('meta[name="twitter:image"]', DEFAULT_OG_IMAGE)

    // Canonical URL
    let canonicalEl = document.querySelector('link[rel="canonical"]')
    if (canonicalEl) {
      canonicalEl.setAttribute('href', canonicalUrl)
    } else {
      canonicalEl = document.createElement('link')
      canonicalEl.setAttribute('rel', 'canonical')
      canonicalEl.setAttribute('href', canonicalUrl)
      document.head.appendChild(canonicalEl)
    }

    // Build combined structured data array
    const structuredDataArray = []

    // Add breadcrumbs structured data if provided
    if (breadcrumbs && breadcrumbs.length > 0) {
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

    // Add page-specific structured data
    if (structuredData) {
      if (Array.isArray(structuredData)) {
        structuredDataArray.push(...structuredData)
      } else {
        structuredDataArray.push(structuredData)
      }
    }

    // Update structured data script
    if (structuredDataArray.length > 0) {
      let scriptEl = document.querySelector('script[data-seo="structured-data"]')
      const jsonContent = structuredDataArray.length === 1
        ? JSON.stringify(structuredDataArray[0])
        : JSON.stringify(structuredDataArray)

      if (scriptEl) {
        scriptEl.textContent = jsonContent
      } else {
        scriptEl = document.createElement('script')
        scriptEl.setAttribute('type', 'application/ld+json')
        scriptEl.setAttribute('data-seo', 'structured-data')
        scriptEl.textContent = jsonContent
        document.head.appendChild(scriptEl)
      }
    }
  }, [fullTitle, title, description, keywords, canonicalUrl, type, structuredData, breadcrumbs, noindex])

  return null
}

// Generate structured data for a converter page
export function generateConverterStructuredData(converter, categoryName) {
  const structuredData = []

  // WebApplication schema
  structuredData.push({
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    name: converter.name,
    url: `${SITE_URL}/${converter.category}/${converter.slug}`,
    description: converter.description,
    applicationCategory: 'UtilityApplication',
    operatingSystem: 'Any',
    browserRequirements: 'Requires JavaScript',
    softwareVersion: '1.0',
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'USD',
    },
    author: {
      '@type': 'Person',
      name: 'kpruthvi',
      url: 'https://kpruthvi.com',
    },
    publisher: {
      '@type': 'Organization',
      name: SITE_NAME,
      url: SITE_URL,
    },
  })

  // HowTo schema for conversion instructions
  structuredData.push({
    '@context': 'https://schema.org',
    '@type': 'HowTo',
    name: `How to Convert ${converter.fromUnit.name} to ${converter.toUnit.name}`,
    description: converter.description,
    step: [
      {
        '@type': 'HowToStep',
        name: 'Enter the value',
        text: `Enter the value in ${converter.fromUnit.name} (${converter.fromUnit.symbol}) that you want to convert.`,
      },
      {
        '@type': 'HowToStep',
        name: 'Apply the formula',
        text: `Use the formula: ${converter.formula}`,
      },
      {
        '@type': 'HowToStep',
        name: 'Get the result',
        text: `The converter will instantly show the result in ${converter.toUnit.name} (${converter.toUnit.symbol}).`,
      },
    ],
    tool: {
      '@type': 'HowToTool',
      name: 'Online Unit Converter',
    },
  })

  // FAQ schema from common conversions
  if (converter.commonConversions && converter.commonConversions.length > 0) {
    structuredData.push({
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: converter.commonConversions.map(conv => ({
        '@type': 'Question',
        name: `How much is ${conv.from} in ${converter.toUnit.name.toLowerCase()}?`,
        acceptedAnswer: {
          '@type': 'Answer',
          text: `${conv.from} is equal to ${conv.to}.`,
        },
      })),
    })
  }

  return structuredData
}

// Generate Organization schema
export function generateOrganizationSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: SITE_NAME,
    url: SITE_URL,
    logo: `${SITE_URL}/icon-512.png`,
    sameAs: ['https://kpruthvi.com'],
    contactPoint: {
      '@type': 'ContactPoint',
      contactType: 'customer support',
      url: SITE_URL,
    },
  }
}

// Generate WebSite schema with search action
export function generateWebSiteSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: SITE_NAME,
    alternateName: 'Convert - Free Online Unit Converter',
    url: SITE_URL,
    description: 'Free online unit converter with 500+ conversions. Convert length, weight, temperature, currency with live rates, volume, area, and more. Works offline.',
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
