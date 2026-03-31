import { useEffect, useId, useMemo, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { allConverters, popularConverters } from '../../data/converterRegistry'
import './SearchBar.css'

const RECENT_SEARCHES_KEY = 'convert-recent-searches'
const MAX_RECENT_SEARCHES = 6

function getRecentSearches() {
  try {
    return JSON.parse(localStorage.getItem(RECENT_SEARCHES_KEY) || '[]')
  } catch {
    return []
  }
}

function saveRecentSearch(path) {
  try {
    const recent = getRecentSearches().filter((item) => item !== path)
    localStorage.setItem(RECENT_SEARCHES_KEY, JSON.stringify([path, ...recent].slice(0, MAX_RECENT_SEARCHES)))
  } catch {
    // ignore storage failures
  }
}

function scoreConverter(converter, query, recentPaths) {
  const normalized = query.toLowerCase().trim()
  if (!normalized) return 0

  const name = converter.name.toLowerCase()
  const category = converter.categoryName.toLowerCase()
  const slug = converter.slug.replace(/-/g, ' ')
  const fromName = converter.fromUnit.name.toLowerCase()
  const toName = converter.toUnit.name.toLowerCase()
  const fromSymbol = converter.fromUnit.symbol.toLowerCase()
  const toSymbol = converter.toUnit.symbol.toLowerCase()
  const aliases = converter.searchAliases.join(' ').toLowerCase()

  let score = 0

  if (name === normalized) score += 220
  if (name.startsWith(normalized)) score += 160
  if (name.includes(normalized)) score += 120
  if (`${fromName} to ${toName}`.includes(normalized)) score += 100
  if (fromName.includes(normalized) || toName.includes(normalized)) score += 90
  if (fromSymbol === normalized || toSymbol === normalized) score += 120
  if (aliases.includes(normalized)) score += 100
  if (slug.includes(normalized)) score += 70
  if (category.includes(normalized)) score += 40

  const terms = normalized.split(/\s+/).filter(Boolean)
  if (terms.length > 1) {
    const haystack = `${name} ${fromName} ${toName} ${aliases} ${slug} ${fromSymbol} ${toSymbol}`
    if (terms.every((term) => haystack.includes(term))) {
      score += 80
    }
  }

  const recentIndex = recentPaths.indexOf(converter.path)
  if (recentIndex >= 0) {
    score += 30 - recentIndex * 4
  }

  return score
}

function getPopularSuggestions() {
  return popularConverters
    .map((path) => allConverters.find((converter) => converter.path === `/${path}`))
    .filter(Boolean)
    .slice(0, 6)
}

function SearchBar({
  autoFocus = false,
  onClose,
  placeholder = 'Search converters, units, or aliases',
  variant = 'modal',
}) {
  const [query, setQuery] = useState('')
  const [activeIndex, setActiveIndex] = useState(0)
  const [recent, setRecent] = useState([])
  const inputRef = useRef(null)
  const navigate = useNavigate()
  const listId = useId()

  useEffect(() => {
    const recentPaths = getRecentSearches()
    setRecent(recentPaths
      .map((path) => allConverters.find((converter) => converter.path === path))
      .filter(Boolean))
  }, [])

  useEffect(() => {
    if (autoFocus) {
      inputRef.current?.focus()
    }
  }, [autoFocus])

  const recentPaths = useMemo(() => recent.map((item) => item.path), [recent])

  const searchResults = useMemo(() => {
    if (!query.trim()) return []
    return allConverters
      .map((converter) => ({
        converter,
        score: scoreConverter(converter, query, recentPaths),
      }))
      .filter((item) => item.score > 0)
      .sort((left, right) => right.score - left.score)
      .slice(0, 8)
      .map((item) => item.converter)
  }, [query, recentPaths])

  const popularSuggestions = useMemo(() => getPopularSuggestions(), [])

  const sections = useMemo(() => {
    if (query.trim()) {
      return searchResults.length
        ? [{ label: 'Results', items: searchResults, kind: 'results' }]
        : []
    }

    const recentItems = recent.slice(0, MAX_RECENT_SEARCHES)
    const popularItems = popularSuggestions.filter((item) => !recentItems.some((recentItem) => recentItem.path === item.path))
    const result = []
    if (recentItems.length) result.push({ label: 'Recent', items: recentItems, kind: 'recent' })
    if (popularItems.length) result.push({ label: 'Popular', items: popularItems, kind: 'popular' })
    return result
  }, [popularSuggestions, query, recent, searchResults])

  const flatItems = sections.flatMap((section) => section.items)

  useEffect(() => {
    setActiveIndex(0)
  }, [query])

  const activeConverter = flatItems[activeIndex] || null

  const handleSelect = (converter) => {
    saveRecentSearch(converter.path)
    setRecent((current) => {
      const next = [converter, ...current.filter((item) => item.path !== converter.path)]
      return next.slice(0, MAX_RECENT_SEARCHES)
    })
    navigate(converter.path)
    onClose?.()
  }

  const handleKeyDown = (event) => {
    if (event.key === 'ArrowDown') {
      event.preventDefault()
      setActiveIndex((current) => Math.min(current + 1, Math.max(flatItems.length - 1, 0)))
    } else if (event.key === 'ArrowUp') {
      event.preventDefault()
      setActiveIndex((current) => Math.max(current - 1, 0))
    } else if (event.key === 'Enter' && activeConverter) {
      event.preventDefault()
      handleSelect(activeConverter)
    } else if (event.key === 'Escape') {
      onClose?.()
    }
  }

  const rootClassName = `search-bar search-bar-${variant}`

  return (
    <div className={rootClassName}>
      <div className="search-shell">
        <label className="visually-hidden" htmlFor={listId}>Search converters</label>
        <div className="search-input-wrapper">
          <svg className="search-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
          <input
            ref={inputRef}
            id={listId}
            className="search-input"
            type="text"
            value={query}
            placeholder={placeholder}
            role="combobox"
            aria-expanded={flatItems.length > 0}
            aria-controls={`${listId}-results`}
            aria-autocomplete="list"
            aria-activedescendant={activeConverter ? `${listId}-option-${activeConverter.slug}` : undefined}
            onChange={(event) => setQuery(event.target.value)}
            onKeyDown={handleKeyDown}
          />
          {query && (
            <button className="search-clear" type="button" onClick={() => setQuery('')} aria-label="Clear search">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
          )}
          {variant !== 'hero' && <kbd className="search-shortcut">/</kbd>}
          {onClose && (
            <button className="search-close" type="button" onClick={onClose}>
              Close
            </button>
          )}
        </div>

        {query.trim() && searchResults.length === 0 && (
          <div className="search-empty-state">
            <p>No converters matched “{query}”.</p>
            <span>Try unit names like “meters”, symbols like “kg”, or aliases like “base64”.</span>
          </div>
        )}

        {sections.length > 0 && (
          <div className="search-results-shell" id={`${listId}-results`}>
            {sections.map((section) => (
              <div key={section.label} className="search-section">
                <div className="search-section-label">{section.label}</div>
                <ul className="search-results" role="listbox">
                  {section.items.map((converter) => {
                    const flatIndex = flatItems.findIndex((item) => item.path === converter.path)
                    const isActive = flatIndex === activeIndex
                    return (
                      <li key={converter.path} role="presentation">
                        <button
                          id={`${listId}-option-${converter.slug}`}
                          type="button"
                          role="option"
                          aria-selected={isActive}
                          className={`search-result ${isActive ? 'is-active' : ''}`}
                          onMouseEnter={() => setActiveIndex(flatIndex)}
                          onClick={() => handleSelect(converter)}
                        >
                          <span className={`search-result-badge search-result-badge-${section.kind}`}>
                            {section.kind}
                          </span>
                          <span className="search-result-copy">
                            <span className="search-result-name">{converter.name}</span>
                            <span className="search-result-meta">
                              {converter.categoryName} · {converter.fromUnit.symbol} to {converter.toUnit.symbol}
                            </span>
                          </span>
                        </button>
                      </li>
                    )
                  })}
                </ul>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default SearchBar
