import { Link } from 'react-router-dom'
import SEOHead from '../components/SEOHead/SEOHead'
import Breadcrumbs from '../components/Breadcrumbs/Breadcrumbs'
import './CategoryPage.css'

function CategoryPage({ category }) {
  const breadcrumbs = [
    { label: 'Home', href: '/' },
    { label: category.name },
  ]

  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: `${category.name} Converters`,
    url: `https://convert.kpruthvi.com/${category.slug}`,
    description: category.description,
    mainEntity: {
      '@type': 'ItemList',
      numberOfItems: category.converters.length,
      itemListElement: category.converters.map((converter, index) => ({
        '@type': 'ListItem',
        position: index + 1,
        name: converter.name,
        url: `https://convert.kpruthvi.com/${category.slug}/${converter.slug}`,
      })),
    },
  }

  return (
    <>
      <SEOHead
        title={`${category.name} Converters - Free Online Tools`}
        description={category.description}
        keywords={`${category.name.toLowerCase()} converter, ${category.converters.map(c => c.name.toLowerCase()).join(', ')}`}
        canonicalPath={`/${category.slug}`}
        structuredData={structuredData}
        breadcrumbs={breadcrumbs}
      />

      <div className="category-page container">
        <Breadcrumbs items={breadcrumbs} />

        <header className="category-header">
          <h1 className="category-title">{category.name} Converters</h1>
          <p className="category-description">{category.description}</p>
        </header>

        <div className="converters-grid">
          {category.converters.map(converter => (
            <Link
              key={converter.slug}
              to={`/${category.slug}/${converter.slug}`}
              className="converter-link-card"
            >
              <div className="converter-link-content">
                <h2 className="converter-link-title">{converter.name}</h2>
                <p className="converter-link-description">{converter.description}</p>
                <p className="converter-link-formula">
                  <strong>Formula:</strong> {converter.formula}
                </p>
              </div>
              <div className="converter-link-units">
                <span className="unit-badge">{converter.fromUnit.symbol}</span>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <polyline points="17 1 21 5 17 9" />
                  <path d="M3 11V9a4 4 0 0 1 4-4h14" />
                  <polyline points="7 23 3 19 7 15" />
                  <path d="M21 13v2a4 4 0 0 1-4 4H3" />
                </svg>
                <span className="unit-badge">{converter.toUnit.symbol}</span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </>
  )
}

export default CategoryPage
