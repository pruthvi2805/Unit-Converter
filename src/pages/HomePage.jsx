import { Link } from 'react-router-dom'
import CategoryIcon from '../components/CategoryIcon'
import SearchBar from '../components/SearchBar/SearchBar'
import SEOHead, { generateOrganizationSchema, generateWebSiteSchema } from '../components/SEOHead/SEOHead'
import { categoryGroups, featuredCategorySlugs } from '../data/categoryGroups'
import { allConverters, categories, popularConverters, siteStats } from '../data/converterRegistry'
import './HomePage.css'

function HomePage() {
  const featuredCategories = featuredCategorySlugs
    .map((slug) => categories.find((category) => category.slug === slug))
    .filter(Boolean)

  const popularTasks = popularConverters
    .map((path) => allConverters.find((converter) => converter.path === `/${path}`))
    .filter(Boolean)
    .slice(0, 8)

  const structuredData = [generateOrganizationSchema(), generateWebSiteSchema()]

  return (
    <>
      <SEOHead
        title="Private, browser-based unit converter"
        description={`Convert ${siteStats.converterCount}+ tools across ${siteStats.categoryCount} categories. Fast, privacy-first, and built for everyday, technical, and scientific conversions.`}
        keywords="unit converter, private converter, browser based converter, km to miles, kg to lbs, temperature converter, programmer converter"
        canonicalPath="/"
        structuredData={structuredData}
      />

      <div className="home-page">
        <section className="home-hero">
          <div className="container home-hero-inner">
            <div className="home-hero-copy">
              <span className="home-hero-kicker">Search-first conversion tools</span>
              <h1 className="home-hero-title">Fast conversions you can trust, without sending your data anywhere.</h1>
              <p className="home-hero-subtitle">
                Convert supports everyday units, developer tools, calculators, and scientific workflows in one clean browser experience.
              </p>
            </div>

            <div className="home-search-shell">
              <SearchBar variant="hero" placeholder="Type what you want to convert, like km to miles or decimal to hex" />
              <div className="home-trust-row" aria-label="Trust indicators">
                <span>Browser-only calculations</span>
                <span>{siteStats.converterCount}+ tools</span>
                <span>No ads or tracking</span>
              </div>
            </div>

            <div className="home-popular">
              <div className="home-section-label">Popular tasks</div>
              <div className="home-chip-grid">
                {popularTasks.map((converter) => (
                  <Link key={converter.path} to={converter.path} className="home-task-chip">
                    <span>{converter.name}</span>
                    <small>{converter.fromUnit.symbol} to {converter.toUnit.symbol}</small>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="home-section container">
          <div className="home-section-heading">
            <div>
              <div className="home-section-label">Featured categories</div>
              <h2>Start with the tools people use most</h2>
            </div>
            <Link to="/categories" className="home-section-link">Browse all categories</Link>
          </div>

          <div className="home-featured-grid">
            {featuredCategories.map((category) => (
              <Link key={category.slug} to={`/${category.slug}`} className="home-category-card">
                <div className="home-category-icon">
                  <CategoryIcon name={category.icon} />
                </div>
                <div className="home-category-copy">
                  <h3>{category.name}</h3>
                  <p>{category.description}</p>
                  <span>{category.converters.length} tools</span>
                </div>
              </Link>
            ))}
          </div>
        </section>

        <section className="home-section container">
          <div className="home-section-heading">
            <div>
              <div className="home-section-label">Browse by workflow</div>
              <h2>Find the right converter family faster</h2>
            </div>
          </div>

          <div className="home-groups">
            {categoryGroups.map((group) => (
              <section key={group.name} className="home-group-card">
                <h3>{group.name}</h3>
                <div className="home-group-list">
                  {group.slugs.map((slug) => {
                    const category = categories.find((item) => item.slug === slug)
                    if (!category) return null
                    return (
                      <Link key={slug} to={`/${category.slug}`} className="home-group-link">
                        <CategoryIcon name={category.icon} />
                        <span>{category.name}</span>
                        <small>{category.converters.length}</small>
                      </Link>
                    )
                  })}
                </div>
              </section>
            ))}
          </div>
        </section>
      </div>
    </>
  )
}

export default HomePage
