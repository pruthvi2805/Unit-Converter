import { useEffect, useMemo, useState } from 'react'
import { Link, Outlet, useLocation } from 'react-router-dom'
import { categories } from '../../data/converterRegistry'
import { categoryGroups } from '../../data/categoryGroups'
import InstallPrompt from '../InstallPrompt/InstallPrompt'
import SearchBar from '../SearchBar/SearchBar'
import ThemeToggle from '../ThemeToggle/ThemeToggle'
import './Layout.css'

function Layout() {
  const [searchOpen, setSearchOpen] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [mobileQuery, setMobileQuery] = useState('')
  const [desktopCategoriesOpen, setDesktopCategoriesOpen] = useState(false)
  const location = useLocation()

  useEffect(() => {
    setSearchOpen(false)
    setMobileMenuOpen(false)
    setDesktopCategoriesOpen(false)
    setMobileQuery('')
  }, [location.pathname])

  useEffect(() => {
    const handleKeyDown = (event) => {
      const tagName = document.activeElement?.tagName
      const typingInField = tagName === 'INPUT' || tagName === 'TEXTAREA'
      if (event.key === '/' && !typingInField) {
        event.preventDefault()
        setSearchOpen(true)
      }
      if (event.key === 'Escape') {
        setSearchOpen(false)
        setMobileMenuOpen(false)
        setDesktopCategoriesOpen(false)
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [])

  const filteredCategories = useMemo(() => {
    const query = mobileQuery.trim().toLowerCase()
    if (!query) {
      return { categories, converters: [] }
    }

    const categoryMatches = categories.filter((category) => category.name.toLowerCase().includes(query))
    const converterMatches = categories
      .flatMap((category) => category.converters)
      .filter((converter) => {
        const haystack = [
          converter.name,
          converter.categoryName,
          converter.fromUnit.name,
          converter.toUnit.name,
          converter.fromUnit.symbol,
          converter.toUnit.symbol,
          ...converter.searchAliases,
        ].join(' ').toLowerCase()
        return haystack.includes(query)
      })
      .slice(0, 10)

    return { categories: categoryMatches, converters: converterMatches }
  }, [mobileQuery])

  return (
    <div className="layout">
      <a href="#main-content" className="skip-link">Skip to content</a>

      <header className="header">
        <div className="container header-inner">
          <Link to="/" className="logo">
            <span className="logo-mark">
              <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polyline points="17 1 21 5 17 9" />
                <path d="M3 11V9a4 4 0 0 1 4-4h14" />
                <polyline points="7 23 3 19 7 15" />
                <path d="M21 13v2a4 4 0 0 1-4 4H3" />
              </svg>
            </span>
            <span className="logo-copy">
              <strong>Convert</strong>
              <small>Browser-only tools</small>
            </span>
          </Link>

          <nav className="nav-desktop" aria-label="Primary">
            <Link to="/" className="nav-link">Home</Link>
            <div className="nav-categories">
              <button
                type="button"
                className="nav-link"
                aria-expanded={desktopCategoriesOpen}
                onClick={() => setDesktopCategoriesOpen((current) => !current)}
              >
                Categories
              </button>
              {desktopCategoriesOpen && (
                <div className="desktop-categories-panel">
                  {categoryGroups.map((group) => (
                    <section key={group.name} className="desktop-category-group">
                      <div className="desktop-category-group-label">{group.name}</div>
                      <div className="desktop-category-links">
                        {group.slugs.map((slug) => {
                          const category = categories.find((item) => item.slug === slug)
                          if (!category) return null
                          return (
                            <Link key={slug} to={`/${slug}`} className="desktop-category-link" onClick={() => setDesktopCategoriesOpen(false)}>
                              <span>{category.name}</span>
                              <small>{category.converters.length}</small>
                            </Link>
                          )
                        })}
                      </div>
                    </section>
                  ))}
                </div>
              )}
            </div>
            <Link to="/privacy" className="nav-link">Privacy</Link>
          </nav>

          <div className="header-actions">
            <button type="button" className="search-trigger" onClick={() => setSearchOpen(true)}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="11" cy="11" r="8" />
                <line x1="21" y1="21" x2="16.65" y2="16.65" />
              </svg>
              <span>Search</span>
            </button>
            <ThemeToggle />
            <button type="button" className="mobile-menu-trigger" onClick={() => setMobileMenuOpen(true)} aria-label="Open categories">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="3" y1="6" x2="21" y2="6" />
                <line x1="3" y1="12" x2="21" y2="12" />
                <line x1="3" y1="18" x2="21" y2="18" />
              </svg>
            </button>
          </div>
        </div>
      </header>

      <main id="main-content" className="main-content">
        <Outlet />
      </main>

      <InstallPrompt />

      <nav className="mobile-bottom-nav" aria-label="Mobile">
        <Link to="/" className="mobile-bottom-link">Home</Link>
        <button type="button" className="mobile-bottom-link" onClick={() => setMobileMenuOpen(true)}>Categories</button>
        <button type="button" className="mobile-bottom-link mobile-bottom-link-accent" onClick={() => setSearchOpen(true)}>Search</button>
      </nav>

      {searchOpen && (
        <div className="layout-overlay" role="dialog" aria-modal="true">
          <div className="overlay-panel overlay-panel-search">
            <SearchBar autoFocus onClose={() => setSearchOpen(false)} variant="modal" />
          </div>
        </div>
      )}

      {mobileMenuOpen && (
        <div className="layout-overlay" role="dialog" aria-modal="true">
          <div className="overlay-panel overlay-panel-menu">
            <div className="overlay-header">
              <div>
                <strong>Browse categories</strong>
                <p>Search categories or jump straight to a converter.</p>
              </div>
              <button type="button" className="overlay-close" onClick={() => setMobileMenuOpen(false)}>Close</button>
            </div>

            <div className="mobile-browse-search">
              <input
                type="text"
                value={mobileQuery}
                onChange={(event) => setMobileQuery(event.target.value)}
                placeholder="Search categories or converters"
              />
            </div>

            <div className="mobile-browse-results">
              <section>
                <div className="mobile-browse-label">Categories</div>
                <div className="mobile-browse-list">
                  {filteredCategories.categories.map((category) => (
                    <Link key={category.slug} to={`/${category.slug}`} className="mobile-browse-link">
                      <span>{category.name}</span>
                      <small>{category.converters.length} tools</small>
                    </Link>
                  ))}
                  {filteredCategories.categories.length === 0 && <p className="mobile-browse-empty">No category matches yet.</p>}
                </div>
              </section>

              {filteredCategories.converters.length > 0 && (
                <section>
                  <div className="mobile-browse-label">Converters</div>
                  <div className="mobile-browse-list">
                    {filteredCategories.converters.map((converter) => (
                      <Link key={converter.path} to={converter.path} className="mobile-browse-link mobile-browse-link-converter">
                        <span>{converter.name}</span>
                        <small>{converter.categoryName} · {converter.fromUnit.symbol} to {converter.toUnit.symbol}</small>
                      </Link>
                    ))}
                  </div>
                </section>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Layout
