import { Link } from 'react-router-dom'
import Breadcrumbs from '../components/Breadcrumbs/Breadcrumbs'
import CategoryIcon from '../components/CategoryIcon'
import SEOHead from '../components/SEOHead/SEOHead'
import { categories, siteStats } from '../data/converterRegistry'
import { categoryGroups } from '../data/categoryGroups'
import './AllCategoriesPage.css'

function AllCategoriesPage() {
  const breadcrumbs = [
    { label: 'Home', href: '/' },
    { label: 'All Categories' },
  ]

  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: 'All converter categories',
    url: 'https://convert.kpruthvi.com/categories',
    description: `Browse ${siteStats.categoryCount} categories and ${siteStats.converterCount}+ browser-based conversion tools.`,
  }

  return (
    <>
      <SEOHead
        title="All categories"
        description={`Browse ${siteStats.categoryCount} categories and ${siteStats.converterCount}+ tools for everyday, technical, and scientific conversions.`}
        canonicalPath="/categories"
        structuredData={structuredData}
        breadcrumbs={breadcrumbs}
      />

      <div className="all-categories-page container">
        <Breadcrumbs items={breadcrumbs} />

        <header className="all-categories-header">
          <span className="all-categories-kicker">Full library</span>
          <h1>All categories</h1>
          <p>{siteStats.categoryCount} categories and {siteStats.converterCount}+ tools, all powered by the same browser-only conversion engine.</p>
        </header>

        <div className="all-category-groups">
          {categoryGroups.map((group) => (
            <section key={group.name} className="all-category-group">
              <div className="all-category-group-heading">
                <h2>{group.name}</h2>
              </div>
              <div className="all-category-grid">
                {group.slugs.map((slug) => {
                  const category = categories.find((item) => item.slug === slug)
                  if (!category) return null

                  return (
                    <Link key={slug} to={`/${slug}`} className="all-category-card">
                      <div className="all-category-icon">
                        <CategoryIcon name={category.icon} />
                      </div>
                      <div className="all-category-copy">
                        <h3>{category.name}</h3>
                        <p>{category.description}</p>
                        <span>{category.converters.length} tools</span>
                      </div>
                    </Link>
                  )
                })}
              </div>
            </section>
          ))}
        </div>
      </div>
    </>
  )
}

export default AllCategoriesPage
