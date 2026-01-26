import { useState, useEffect, useRef } from 'react'
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom'
import { categories } from '../../data/converterRoutes'
import SearchBar from '../SearchBar/SearchBar'
import ThemeToggle from '../ThemeToggle/ThemeToggle'
import InstallPrompt from '../InstallPrompt/InstallPrompt'
import './Layout.css'

// Simple SVG icons
const Icons = {
  menu: (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <line x1="3" y1="6" x2="21" y2="6" />
      <line x1="3" y1="12" x2="21" y2="12" />
      <line x1="3" y1="18" x2="21" y2="18" />
    </svg>
  ),
  close: (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <line x1="18" y1="6" x2="6" y2="18" />
      <line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  ),
  home: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
      <polyline points="9 22 9 12 15 12 15 22" />
    </svg>
  ),
  search: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="11" cy="11" r="8" />
      <line x1="21" y1="21" x2="16.65" y2="16.65" />
    </svg>
  ),
  grid: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <rect x="3" y="3" width="7" height="7" />
      <rect x="14" y="3" width="7" height="7" />
      <rect x="14" y="14" width="7" height="7" />
      <rect x="3" y="14" width="7" height="7" />
    </svg>
  ),
  star: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
    </svg>
  ),
};

// Category groupings for organized display
const categoryGroups = [
  {
    name: 'Essential',
    slugs: ['length', 'weight', 'temperature', 'volume', 'time', 'area', 'speed']
  },
  {
    name: 'Cooking & Lifestyle',
    slugs: ['cooking', 'clothing', 'fitness', 'miscellaneous']
  },
  {
    name: 'Technical',
    slugs: ['engineering', 'electrical', 'thermal', 'pressure', 'energy', 'fuel-economy']
  },
  {
    name: 'Digital & Math',
    slugs: ['programmer', 'digital-storage', 'css-units', 'numbers', 'calculators', 'angles']
  },
  {
    name: 'Scientific',
    slugs: ['scientific', 'light', 'sound', 'magnetism', 'radiation']
  }
]

function Layout() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  const [expandedCategory, setExpandedCategory] = useState(null)
  const [hoveredCategory, setHoveredCategory] = useState(null)
  const [megaMenuOpen, setMegaMenuOpen] = useState(false)
  const [isInConvertersPanel, setIsInConvertersPanel] = useState(false)
  const [mobileSearchQuery, setMobileSearchQuery] = useState('')
  const leaveTimeoutRef = useRef(null)
  const categoryHoverRef = useRef(null)
  const mobileSearchRef = useRef(null)
  const location = useLocation()
  const navigate = useNavigate()

  // Filter categories based on mobile search
  const filteredCategories = mobileSearchQuery.trim()
    ? categories.filter(cat => {
        const query = mobileSearchQuery.toLowerCase()
        // Match category name
        if (cat.name.toLowerCase().includes(query)) return true
        // Match any converter in the category
        return cat.converters.some(conv =>
          conv.name.toLowerCase().includes(query) ||
          conv.fromUnit.name.toLowerCase().includes(query) ||
          conv.toUnit.name.toLowerCase().includes(query) ||
          conv.fromUnit.symbol.toLowerCase() === query ||
          conv.toUnit.symbol.toLowerCase() === query
        )
      })
    : categories

  // Handle Home button click - navigate and scroll to top
  const handleHomeClick = (e) => {
    e.preventDefault()
    setMenuOpen(false)
    setSearchOpen(false)
    if (location.pathname === '/') {
      // Already on home, just scroll to top
      window.scrollTo({ top: 0, behavior: 'smooth' })
    } else {
      navigate('/')
    }
  }

  // Handle category hover - with smart delay
  const handleCategoryHover = (slug) => {
    // If we're in converters panel, don't switch categories
    if (isInConvertersPanel) return

    // Clear any pending hover
    if (categoryHoverRef.current) {
      clearTimeout(categoryHoverRef.current)
    }

    // If no category selected yet, switch immediately
    if (!hoveredCategory) {
      setHoveredCategory(slug)
      return
    }

    // Otherwise use a small delay to prevent accidental switches
    categoryHoverRef.current = setTimeout(() => {
      setHoveredCategory(slug)
    }, 80)
  }

  // Handle entering converters panel - lock current category
  const handleConvertersEnter = () => {
    setIsInConvertersPanel(true)
    if (categoryHoverRef.current) {
      clearTimeout(categoryHoverRef.current)
    }
  }

  // Handle leaving converters panel
  const handleConvertersLeave = () => {
    setIsInConvertersPanel(false)
  }

  // Handle menu leave with delay to prevent accidental closure
  const handleMenuLeave = () => {
    if (leaveTimeoutRef.current) {
      clearTimeout(leaveTimeoutRef.current)
    }
    if (categoryHoverRef.current) {
      clearTimeout(categoryHoverRef.current)
    }
    leaveTimeoutRef.current = setTimeout(() => {
      setMegaMenuOpen(false)
      setHoveredCategory(null)
      setIsInConvertersPanel(false)
    }, 150)
  }

  // Cancel menu close when re-entering
  const handleMenuEnter = () => {
    if (leaveTimeoutRef.current) {
      clearTimeout(leaveTimeoutRef.current)
    }
    setMegaMenuOpen(true)
  }

  // Close mega menu (called when clicking a link)
  const closeMegaMenu = () => {
    if (categoryHoverRef.current) {
      clearTimeout(categoryHoverRef.current)
    }
    setMegaMenuOpen(false)
    setHoveredCategory(null)
    setIsInConvertersPanel(false)
  }

  // Clear timeouts on unmount
  useEffect(() => {
    return () => {
      if (leaveTimeoutRef.current) {
        clearTimeout(leaveTimeoutRef.current)
      }
      if (categoryHoverRef.current) {
        clearTimeout(categoryHoverRef.current)
      }
    }
  }, [])

  // Close menu on route change
  useEffect(() => {
    setMenuOpen(false)
    setSearchOpen(false)
    setExpandedCategory(null)
    setHoveredCategory(null)
    setMegaMenuOpen(false)
    setIsInConvertersPanel(false)
    setMobileSearchQuery('')
    // Blur any focused element to prevent highlight persistence
    if (document.activeElement instanceof HTMLElement) {
      document.activeElement.blur()
    }
  }, [location])

  // Handle keyboard shortcut for search
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === '/' && !e.ctrlKey && !e.metaKey) {
        const activeElement = document.activeElement
        const isInput = activeElement.tagName === 'INPUT' || activeElement.tagName === 'TEXTAREA'
        if (!isInput) {
          e.preventDefault()
          setSearchOpen(true)
        }
      }
      if (e.key === 'Escape') {
        setSearchOpen(false)
        setMenuOpen(false)
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [])

  return (
    <div className="layout">
      <a href="#main-content" className="skip-link">
        Skip to content
      </a>

      {/* Header */}
      <header className="header">
        <div className="header-inner container">
          <Link to="/" className="logo">
            <span className="logo-icon">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polyline points="17 1 21 5 17 9" />
                <path d="M3 11V9a4 4 0 0 1 4-4h14" />
                <polyline points="7 23 3 19 7 15" />
                <path d="M21 13v2a4 4 0 0 1-4 4H3" />
              </svg>
            </span>
            <span className="logo-text">Convert</span>
          </Link>

          <nav className="nav-desktop">
            <Link to="/" className="nav-link">Home</Link>
            <div className="nav-mega-dropdown" onMouseEnter={handleMenuEnter} onMouseLeave={handleMenuLeave}>
              <Link to="/categories" className="nav-link nav-dropdown-trigger" onClick={closeMegaMenu}>
                Categories
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <polyline points="6 9 12 15 18 9" />
                </svg>
              </Link>
              {megaMenuOpen && (
                <div className="nav-mega-content">
                  <div className="mega-categories">
                    {categoryGroups.map(group => {
                      const groupCategories = group.slugs
                        .map(slug => categories.find(c => c.slug === slug))
                        .filter(Boolean)

                      if (groupCategories.length === 0) return null

                      return (
                        <div key={group.name} className="mega-category-group">
                          <div className="mega-group-label">{group.name}</div>
                          {groupCategories.map(cat => (
                            <div
                              key={cat.slug}
                              className={`mega-category ${hoveredCategory === cat.slug ? 'active' : ''}`}
                              onMouseEnter={() => handleCategoryHover(cat.slug)}
                            >
                              <Link to={`/${cat.slug}`} className="mega-category-link" onClick={closeMegaMenu}>
                                <span className="mega-category-name">{cat.name}</span>
                                <span className="mega-category-count">{cat.converters.length}</span>
                              </Link>
                            </div>
                          ))}
                        </div>
                      )
                    })}
                  </div>
                  <div className="mega-converters" onMouseEnter={handleConvertersEnter} onMouseLeave={handleConvertersLeave}>
                    {hoveredCategory ? (
                      <>
                        <div className="mega-converters-header">
                          <span>{categories.find(c => c.slug === hoveredCategory)?.name}</span>
                          <Link to={`/${hoveredCategory}`} className="mega-view-all" onClick={closeMegaMenu}>View all →</Link>
                        </div>
                        <div className="mega-converters-list">
                          {categories.find(c => c.slug === hoveredCategory)?.converters.map(conv => (
                            <Link
                              key={conv.slug}
                              to={`/${hoveredCategory}/${conv.slug}`}
                              className="mega-converter-item"
                              onClick={closeMegaMenu}
                            >
                              <span className="mega-converter-name">{conv.name}</span>
                              <span className="mega-converter-units">{conv.fromUnit.symbol} → {conv.toUnit.symbol}</span>
                            </Link>
                          ))}
                        </div>
                      </>
                    ) : (
                      <div className="mega-converters-placeholder">
                        <p>Hover over a category to see converters</p>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </nav>

          <div className="header-actions">
            <span className="privacy-badge">
              <span className="privacy-dot"></span>
              100% Private
            </span>
            <button
              className="icon-button"
              onClick={() => setSearchOpen(true)}
              aria-label="Open search"
              title="Search (press /)"
            >
              {Icons.search}
            </button>
            <ThemeToggle />
            <button
              className="icon-button menu-button"
              onClick={() => setMenuOpen(!menuOpen)}
              aria-label={menuOpen ? 'Close menu' : 'Open menu'}
              aria-expanded={menuOpen}
            >
              {menuOpen ? Icons.close : Icons.menu}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Menu */}
      <div className={`mobile-menu ${menuOpen ? 'open' : ''}`}>
        <nav className="mobile-nav">
          {/* Mobile Search */}
          <div className="mobile-search-wrapper">
            <svg className="mobile-search-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="11" cy="11" r="8" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
            <input
              ref={mobileSearchRef}
              type="text"
              className="mobile-search-input"
              placeholder="Search converters..."
              value={mobileSearchQuery}
              onChange={(e) => setMobileSearchQuery(e.target.value)}
              aria-label="Search converters"
            />
            {mobileSearchQuery && (
              <button
                className="mobile-search-clear"
                onClick={() => {
                  setMobileSearchQuery('')
                  mobileSearchRef.current?.focus()
                }}
                aria-label="Clear search"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            )}
          </div>

          <Link to="/" className="mobile-nav-link">
            {Icons.home}
            <span>Home</span>
          </Link>
          <div className="mobile-nav-divider" />
          <p className="mobile-nav-label">
            {mobileSearchQuery ? `Results (${filteredCategories.length})` : 'Categories'}
          </p>
          {filteredCategories.map(cat => (
            <div key={cat.slug} className="mobile-category">
              <button
                className={`mobile-category-header ${expandedCategory === cat.slug ? 'expanded' : ''}`}
                onClick={() => setExpandedCategory(expandedCategory === cat.slug ? null : cat.slug)}
              >
                <span>{cat.name}</span>
                <svg
                  className="mobile-category-chevron"
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <polyline points="6 9 12 15 18 9" />
                </svg>
              </button>
              <div className={`mobile-category-content ${expandedCategory === cat.slug ? 'expanded' : ''}`}>
                <Link to={`/${cat.slug}`} className="mobile-converter-link mobile-view-all">
                  View all {cat.name} →
                </Link>
                {cat.converters.slice(0, 5).map(conv => (
                  <Link
                    key={conv.slug}
                    to={`/${cat.slug}/${conv.slug}`}
                    className="mobile-converter-link"
                  >
                    <span>{conv.name}</span>
                    <span className="mobile-converter-units">{conv.fromUnit.symbol} → {conv.toUnit.symbol}</span>
                  </Link>
                ))}
              </div>
            </div>
          ))}
          {mobileSearchQuery && filteredCategories.length === 0 && (
            <div className="mobile-no-results">
              <p>No converters found for "{mobileSearchQuery}"</p>
              <button
                className="mobile-no-results-clear"
                onClick={() => setMobileSearchQuery('')}
              >
                Clear search
              </button>
            </div>
          )}
        </nav>
      </div>

      {/* Search Modal */}
      {searchOpen && (
        <div className="search-modal" onClick={() => setSearchOpen(false)}>
          <div className="search-modal-content" onClick={e => e.stopPropagation()}>
            <SearchBar autoFocus onClose={() => setSearchOpen(false)} />
          </div>
        </div>
      )}

      {/* Main Content */}
      <main id="main-content" className="main">
        <Outlet />
      </main>

      {/* Footer */}
      <footer className="footer">
        <div className="container">
          <div className="footer-simple">
            <p>
              <span className="footer-copyright">&copy; 2026 Pruthvi Kauticwar</span>
              <span className="footer-separator">&middot;</span>
              <a href="https://kpruthvi.com" target="_blank" rel="noopener noreferrer">kpruthvi.com</a>
              <span className="footer-separator">&middot;</span>
              <Link to="/privacy">Privacy</Link>
              <span className="footer-separator">&middot;</span>
              <a href="https://github.com/pruthvi2805/convert" target="_blank" rel="noopener noreferrer">GitHub</a>
              <span className="footer-separator">&middot;</span>
              <a href="https://kpruthvi.com/contact" target="_blank" rel="noopener noreferrer">Contact</a>
            </p>
          </div>
        </div>
      </footer>

      {/* Install Prompt */}
      <InstallPrompt />

      {/* Mobile Bottom Nav */}
      <nav className="mobile-bottom-nav" aria-label="Mobile navigation">
        <a
          href="/"
          className={`bottom-nav-item ${location.pathname === '/' ? 'active' : ''}`}
          onClick={handleHomeClick}
        >
          {Icons.home}
          <span>Home</span>
        </a>
        <button
          className="bottom-nav-item"
          onClick={() => setSearchOpen(true)}
          aria-label="Search"
        >
          {Icons.search}
          <span>Search</span>
        </button>
        <button
          className={`bottom-nav-item ${menuOpen ? 'active' : ''}`}
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Categories"
        >
          {Icons.grid}
          <span>Categories</span>
        </button>
      </nav>
    </div>
  )
}

export default Layout
