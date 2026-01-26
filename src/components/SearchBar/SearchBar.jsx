import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { allConverters, popularConverters } from '../../data/converterRoutes'
import './SearchBar.css'

// Simple fuzzy match - checks if all chars of pattern appear in text in order
function fuzzyMatch(text, pattern) {
  text = text.toLowerCase()
  pattern = pattern.toLowerCase()
  let patternIdx = 0
  for (let i = 0; i < text.length && patternIdx < pattern.length; i++) {
    if (text[i] === pattern[patternIdx]) {
      patternIdx++
    }
  }
  return patternIdx === pattern.length
}

// Score a match - higher is better
function scoreMatch(converter, searchTerm) {
  const name = converter.name.toLowerCase()
  const category = converter.categoryName.toLowerCase()
  const fromUnit = converter.fromUnit.name.toLowerCase()
  const toUnit = converter.toUnit.name.toLowerCase()
  const fromSymbol = converter.fromUnit.symbol.toLowerCase()
  const toSymbol = converter.toUnit.symbol.toLowerCase()

  let score = 0

  // Exact matches score highest
  if (name.includes(searchTerm)) score += 100
  if (name.startsWith(searchTerm)) score += 50
  if (fromUnit.includes(searchTerm) || toUnit.includes(searchTerm)) score += 40
  if (fromSymbol === searchTerm || toSymbol === searchTerm) score += 60
  if (category.includes(searchTerm)) score += 20

  // Word boundary matches (e.g., "km miles" matches "km to miles")
  const words = searchTerm.split(/\s+/)
  if (words.length > 1) {
    const allWordsMatch = words.every(word =>
      name.includes(word) || fromUnit.includes(word) || toUnit.includes(word) ||
      fromSymbol.includes(word) || toSymbol.includes(word)
    )
    if (allWordsMatch) score += 80
  }

  // Fuzzy match as fallback
  if (score === 0 && fuzzyMatch(name, searchTerm)) score += 10

  return score
}

// Recent searches storage
const RECENT_SEARCHES_KEY = 'convert-recent-searches'
const MAX_RECENT_SEARCHES = 5

function getRecentSearches() {
  try {
    const stored = localStorage.getItem(RECENT_SEARCHES_KEY)
    return stored ? JSON.parse(stored) : []
  } catch {
    return []
  }
}

function addRecentSearch(path) {
  try {
    let recent = getRecentSearches()
    recent = recent.filter(p => p !== path)
    recent.unshift(path)
    recent = recent.slice(0, MAX_RECENT_SEARCHES)
    localStorage.setItem(RECENT_SEARCHES_KEY, JSON.stringify(recent))
  } catch {
    // Ignore storage errors
  }
}

function SearchBar({ autoFocus = false, onClose }) {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState([])
  const [selectedIndex, setSelectedIndex] = useState(0)
  const [recentSearches, setRecentSearches] = useState([])
  const inputRef = useRef(null)
  const navigate = useNavigate()

  // Load recent searches on mount
  useEffect(() => {
    const recent = getRecentSearches()
      .map(path => allConverters.find(c => c.path === path))
      .filter(Boolean)
    setRecentSearches(recent)
  }, [])

  // Get popular converters for suggestions
  const popularSuggestions = popularConverters.map(path => {
    return allConverters.find(c => c.path === `/${path}`)
  }).filter(Boolean).slice(0, 6)

  useEffect(() => {
    if (autoFocus && inputRef.current) {
      inputRef.current.focus()
    }
  }, [autoFocus])

  useEffect(() => {
    if (!query.trim()) {
      setResults([])
      setSelectedIndex(0)
      return
    }

    const searchTerm = query.toLowerCase().trim()

    // Score and filter converters
    const scored = allConverters
      .map(converter => ({
        converter,
        score: scoreMatch(converter, searchTerm)
      }))
      .filter(item => item.score > 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, 8)
      .map(item => item.converter)

    setResults(scored)
    setSelectedIndex(0)
  }, [query])

  // Show recent searches, then popular, then search results
  const displayResults = query.trim()
    ? results
    : recentSearches.length > 0
      ? recentSearches
      : popularSuggestions

  const sectionLabel = query.trim()
    ? null
    : recentSearches.length > 0
      ? 'Recent searches'
      : 'Popular converters'

  const handleKeyDown = (e) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault()
      setSelectedIndex(i => Math.min(i + 1, displayResults.length - 1))
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      setSelectedIndex(i => Math.max(i - 1, 0))
    } else if (e.key === 'Enter' && displayResults[selectedIndex]) {
      navigate(displayResults[selectedIndex].path)
      onClose?.()
    } else if (e.key === 'Escape') {
      onClose?.()
    }
  }

  const handleSelect = (converter) => {
    addRecentSearch(converter.path)
    navigate(converter.path)
    onClose?.()
  }

  return (
    <div className="search-bar">
      <div className="search-input-wrapper">
        <svg className="search-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="11" cy="11" r="8" />
          <line x1="21" y1="21" x2="16.65" y2="16.65" />
        </svg>
        <input
          ref={inputRef}
          type="text"
          className="search-input"
          placeholder="Search converters..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={handleKeyDown}
          aria-label="Search converters"
          aria-autocomplete="list"
          aria-controls="search-results"
        />
        {query && (
          <button
            className="search-clear"
            onClick={() => setQuery('')}
            aria-label="Clear search"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        )}
        <kbd className="search-shortcut">/</kbd>
        <button
          className="search-cancel"
          onClick={onClose}
          aria-label="Close search"
        >
          Cancel
        </button>
      </div>

      {/* Show recent/popular suggestions when empty, search results when typing */}
      {displayResults.length > 0 && (
        <div className="search-results-wrapper">
          {sectionLabel && (
            <div className="search-section-label">{sectionLabel}</div>
          )}
          <ul id="search-results" className="search-results" role="listbox">
            {displayResults.map((converter, index) => (
              <li
                key={converter.path}
                className={`search-result ${index === selectedIndex ? 'selected' : ''}`}
                role="option"
                aria-selected={index === selectedIndex}
                onClick={() => handleSelect(converter)}
                onMouseEnter={() => setSelectedIndex(index)}
              >
                <div className="search-result-main">
                  <span className="search-result-name">{converter.name}</span>
                  <span className="search-result-category">{converter.categoryName}</span>
                </div>
                <span className="search-result-units">
                  {converter.fromUnit.symbol} → {converter.toUnit.symbol}
                </span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {query && results.length === 0 && (
        <div className="search-no-results">
          <p>No converters found for "{query}"</p>
          <p className="search-hint">Try "meters", "pounds", or "celsius"</p>
        </div>
      )}
    </div>
  )
}

export default SearchBar
