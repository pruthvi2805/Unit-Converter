import { useState, useEffect, useCallback, useMemo, useRef } from 'react'
import { useParams } from 'react-router-dom'
import SEOHead from '../components/SEOHead/SEOHead'
import Breadcrumbs from '../components/Breadcrumbs/Breadcrumbs'
import './CurrencyPage.css'

// Country code to flag image URL mapping
const getFlagUrl = (code) => {
  // Map currency codes to country codes for flags
  const currencyToCountry = {
    USD: 'us', EUR: 'eu', GBP: 'gb', JPY: 'jp', CNY: 'cn', INR: 'in',
    CAD: 'ca', AUD: 'au', CHF: 'ch', NZD: 'nz', SGD: 'sg', HKD: 'hk',
    KRW: 'kr', SEK: 'se', NOK: 'no', DKK: 'dk', MXN: 'mx', BRL: 'br',
    ZAR: 'za', RUB: 'ru', TRY: 'tr', AED: 'ae', SAR: 'sa', THB: 'th',
    IDR: 'id', MYR: 'my', PHP: 'ph', VND: 'vn', PLN: 'pl', CZK: 'cz',
    HUF: 'hu', PKR: 'pk', BDT: 'bd', NGN: 'ng', UAH: 'ua', TWD: 'tw',
    ILS: 'il', EGP: 'eg', CLP: 'cl', COP: 'co', PEN: 'pe', ARS: 'ar',
    RON: 'ro', BGN: 'bg', HRK: 'hr', ISK: 'is', KES: 'ke', GHS: 'gh',
    LKR: 'lk', NPR: 'np', QAR: 'qa', KWD: 'kw', BHD: 'bh', OMR: 'om',
    JOD: 'jo', MAD: 'ma', TND: 'tn', DZD: 'dz'
  }
  const country = currencyToCountry[code]
  if (country) {
    return `https://flagcdn.com/24x18/${country}.png`
  }
  return null // For crypto
}

const currencies = [
  { code: 'USD', name: 'US Dollar', country: 'us' },
  { code: 'EUR', name: 'Euro', country: 'eu' },
  { code: 'GBP', name: 'British Pound', country: 'gb' },
  { code: 'JPY', name: 'Japanese Yen', country: 'jp' },
  { code: 'CNY', name: 'Chinese Yuan', country: 'cn' },
  { code: 'INR', name: 'Indian Rupee', country: 'in' },
  { code: 'CAD', name: 'Canadian Dollar', country: 'ca' },
  { code: 'AUD', name: 'Australian Dollar', country: 'au' },
  { code: 'CHF', name: 'Swiss Franc', country: 'ch' },
  { code: 'NZD', name: 'NZ Dollar', country: 'nz' },
  { code: 'SGD', name: 'Singapore Dollar', country: 'sg' },
  { code: 'HKD', name: 'HK Dollar', country: 'hk' },
  { code: 'KRW', name: 'Korean Won', country: 'kr' },
  { code: 'SEK', name: 'Swedish Krona', country: 'se' },
  { code: 'NOK', name: 'Norwegian Krone', country: 'no' },
  { code: 'DKK', name: 'Danish Krone', country: 'dk' },
  { code: 'MXN', name: 'Mexican Peso', country: 'mx' },
  { code: 'BRL', name: 'Brazilian Real', country: 'br' },
  { code: 'ZAR', name: 'South African Rand', country: 'za' },
  { code: 'RUB', name: 'Russian Ruble', country: 'ru' },
  { code: 'TRY', name: 'Turkish Lira', country: 'tr' },
  { code: 'AED', name: 'UAE Dirham', country: 'ae' },
  { code: 'SAR', name: 'Saudi Riyal', country: 'sa' },
  { code: 'THB', name: 'Thai Baht', country: 'th' },
  { code: 'IDR', name: 'Indonesian Rupiah', country: 'id' },
  { code: 'MYR', name: 'Malaysian Ringgit', country: 'my' },
  { code: 'PHP', name: 'Philippine Peso', country: 'ph' },
  { code: 'VND', name: 'Vietnamese Dong', country: 'vn' },
  { code: 'PLN', name: 'Polish Zloty', country: 'pl' },
  { code: 'CZK', name: 'Czech Koruna', country: 'cz' },
  { code: 'HUF', name: 'Hungarian Forint', country: 'hu' },
  { code: 'PKR', name: 'Pakistani Rupee', country: 'pk' },
  { code: 'BDT', name: 'Bangladeshi Taka', country: 'bd' },
  { code: 'NGN', name: 'Nigerian Naira', country: 'ng' },
  { code: 'UAH', name: 'Ukrainian Hryvnia', country: 'ua' },
  { code: 'TWD', name: 'Taiwan Dollar', country: 'tw' },
  { code: 'ILS', name: 'Israeli Shekel', country: 'il' },
  { code: 'EGP', name: 'Egyptian Pound', country: 'eg' },
  { code: 'CLP', name: 'Chilean Peso', country: 'cl' },
  { code: 'COP', name: 'Colombian Peso', country: 'co' },
  { code: 'PEN', name: 'Peruvian Sol', country: 'pe' },
  { code: 'ARS', name: 'Argentine Peso', country: 'ar' },
  { code: 'RON', name: 'Romanian Leu', country: 'ro' },
  { code: 'BGN', name: 'Bulgarian Lev', country: 'bg' },
  { code: 'HRK', name: 'Croatian Kuna', country: 'hr' },
  { code: 'ISK', name: 'Icelandic Krona', country: 'is' },
  { code: 'BTC', name: 'Bitcoin', symbol: '₿' },
  { code: 'ETH', name: 'Ethereum', symbol: 'Ξ' },
]

const CACHE_KEY = 'currency_rates_cache'
const CACHE_DURATION = 3600000


function CurrencyFlag({ currency, size = 24 }) {
  if (currency.symbol) {
    // Crypto currencies use symbols
    return <span className="currency-symbol">{currency.symbol}</span>
  }
  if (currency.country) {
    return (
      <img
        src={`https://flagcdn.com/${size}x${Math.round(size * 0.75)}/${currency.country}.png`}
        srcSet={`https://flagcdn.com/${size * 2}x${Math.round(size * 1.5)}/${currency.country}.png 2x`}
        alt={currency.name}
        className="currency-flag-img"
      />
    )
  }
  return <span className="currency-symbol">?</span>
}

function CurrencyDropdown({ value, onChange, currencies, search, setSearch, isOpen, setIsOpen, dropdownRef }) {
  const selected = currencies.find(c => c.code === value) || { code: value, name: value }
  const [shouldRender, setShouldRender] = useState(false)

  // Handle delayed unmount for fade-out animation
  useEffect(() => {
    if (isOpen) {
      setShouldRender(true)
    } else {
      const timer = setTimeout(() => setShouldRender(false), 150)
      return () => clearTimeout(timer)
    }
  }, [isOpen])

  const filtered = search
    ? currencies.filter(c =>
        c.code.toLowerCase().includes(search.toLowerCase()) ||
        c.name.toLowerCase().includes(search.toLowerCase())
      )
    : currencies

  return (
    <div className="currency-dropdown-wrapper" ref={dropdownRef}>
      <button
        type="button"
        className="currency-dropdown-btn"
        onClick={() => setIsOpen(!isOpen)}
      >
        <CurrencyFlag currency={selected} size={24} />
        <span className="currency-code">{selected.code}</span>
        <svg className="dropdown-chevron" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <polyline points="6 9 12 15 18 9" />
        </svg>
      </button>

      {shouldRender && (
        <div className={`currency-dropdown-menu ${isOpen ? 'open' : 'closing'}`}>
          <input
            type="text"
            className="currency-dropdown-search"
            placeholder="Search currency..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onClick={(e) => e.stopPropagation()}
            autoFocus
          />
          <div className="currency-dropdown-list">
            {filtered.map(c => (
              <button
                key={c.code}
                type="button"
                className={`currency-dropdown-item ${c.code === value ? 'selected' : ''}`}
                onClick={() => {
                  onChange(c.code)
                  setIsOpen(false)
                  setSearch('')
                }}
              >
                <CurrencyFlag currency={c} size={20} />
                <span className="currency-code">{c.code}</span>
                <span className="currency-name">{c.name}</span>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

function CurrencyPage() {
  const { pair } = useParams()
  const [amount, setAmount] = useState('1')
  const [fromCurrency, setFromCurrency] = useState('USD')
  const [toCurrency, setToCurrency] = useState('EUR')
  const [rates, setRates] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [lastUpdated, setLastUpdated] = useState(null)

  const [fromOpen, setFromOpen] = useState(false)
  const [toOpen, setToOpen] = useState(false)
  const [fromSearch, setFromSearch] = useState('')
  const [toSearch, setToSearch] = useState('')

  const fromRef = useRef(null)
  const toRef = useRef(null)

  // Click outside to close dropdowns
  useEffect(() => {
    const handleClick = (e) => {
      if (fromRef.current && !fromRef.current.contains(e.target)) {
        setFromOpen(false)
        setFromSearch('')
      }
      if (toRef.current && !toRef.current.contains(e.target)) {
        setToOpen(false)
        setToSearch('')
      }
    }
    document.addEventListener('click', handleClick)
    return () => document.removeEventListener('click', handleClick)
  }, [])

  // Parse URL pair
  useEffect(() => {
    if (pair) {
      const parts = pair.toUpperCase().split('-')
      if (parts.length === 2) {
        const [from, to] = parts
        if (currencies.find(c => c.code === from) && currencies.find(c => c.code === to)) {
          setFromCurrency(from)
          setToCurrency(to)
        }
      }
    }
  }, [pair])

  // Fetch rates
  const fetchRates = useCallback(async () => {
    const cached = localStorage.getItem(CACHE_KEY)
    if (cached) {
      try {
        const { data, timestamp } = JSON.parse(cached)
        if (Date.now() - timestamp < CACHE_DURATION) {
          setRates(data)
          setLastUpdated(new Date(timestamp))
          setLoading(false)
          return
        }
      } catch (e) {
        localStorage.removeItem(CACHE_KEY)
      }
    }

    setLoading(true)
    setError(null)

    try {
      const res = await fetch('https://cdn.jsdelivr.net/npm/@fawazahmed0/currency-api@latest/v1/currencies/usd.json')
      if (!res.ok) throw new Error('Failed')
      const data = await res.json()
      localStorage.setItem(CACHE_KEY, JSON.stringify({ data: data.usd, timestamp: Date.now() }))
      setRates(data.usd)
      setLastUpdated(new Date())
    } catch {
      try {
        const backup = await fetch('https://latest.currency-api.pages.dev/v1/currencies/usd.json')
        if (!backup.ok) throw new Error('Backup failed')
        const data = await backup.json()
        localStorage.setItem(CACHE_KEY, JSON.stringify({ data: data.usd, timestamp: Date.now() }))
        setRates(data.usd)
        setLastUpdated(new Date())
      } catch {
        const cached = localStorage.getItem(CACHE_KEY)
        if (cached) {
          try {
            const { data, timestamp } = JSON.parse(cached)
            setRates(data)
            setLastUpdated(new Date(timestamp))
            setError('Using cached rates')
          } catch {
            setError('Unable to fetch rates')
          }
        } else {
          setError('Unable to fetch rates')
        }
      }
    }
    setLoading(false)
  }, [])

  useEffect(() => { fetchRates() }, [fetchRates])

  // Calculate result
  const result = useMemo(() => {
    if (!rates || !amount || isNaN(parseFloat(amount))) return ''
    const num = parseFloat(amount)
    const fromRate = rates[fromCurrency.toLowerCase()] || 1
    const toRate = rates[toCurrency.toLowerCase()] || 1
    const converted = (num / fromRate) * toRate
    if (converted === 0) return '0'
    if (Math.abs(converted) < 0.01) return converted.toFixed(6)
    if (Math.abs(converted) < 1000) return converted.toFixed(4)
    return converted.toLocaleString('en-US', { maximumFractionDigits: 2 })
  }, [amount, fromCurrency, toCurrency, rates])

  const rate = useMemo(() => {
    if (!rates) return null
    const fromRate = rates[fromCurrency.toLowerCase()] || 1
    const toRate = rates[toCurrency.toLowerCase()] || 1
    return (toRate / fromRate).toFixed(6)
  }, [rates, fromCurrency, toCurrency])

  const handleSwap = () => {
    setFromCurrency(toCurrency)
    setToCurrency(fromCurrency)
  }

  const getCurrency = (code) => currencies.find(c => c.code === code) || { code, name: code }
  const fromData = getCurrency(fromCurrency)
  const toData = getCurrency(toCurrency)

  const breadcrumbs = [
    { label: 'Home', href: '/' },
    { label: 'Currency', href: '/currency' },
    ...(pair ? [{ label: `${fromCurrency} to ${toCurrency}` }] : []),
  ]

  return (
    <>
      <SEOHead
        title={`${pair ? `${fromCurrency} to ${toCurrency}` : 'Currency Converter'} | convert.kpruthvi.com`}
        description={`Convert ${fromData.name} to ${toData.name} with live exchange rates.`}
        canonicalPath={pair ? `/currency/${pair}` : '/currency'}
      />

      <div className="currency-page container">
        <Breadcrumbs items={breadcrumbs} />

        <header className="currency-header">
          <h1>{pair ? `${fromCurrency} to ${toCurrency}` : 'Currency Converter'}</h1>
          <p>Live exchange rates for {currencies.length} currencies</p>
        </header>

        <div className="currency-converter">
          <div className="currency-row">
            {/* From Field */}
            <div className="currency-field">
              <label className="currency-label">Amount</label>
              <div className="currency-input-row">
                <input
                  type="text"
                  inputMode="decimal"
                  className="currency-amount"
                  value={amount}
                  onChange={(e) => {
                    if (e.target.value === '' || /^[\d.]*$/.test(e.target.value)) {
                      setAmount(e.target.value)
                    }
                  }}
                  placeholder="0"
                />
                <CurrencyDropdown
                  value={fromCurrency}
                  onChange={setFromCurrency}
                  currencies={currencies}
                  search={fromSearch}
                  setSearch={setFromSearch}
                  isOpen={fromOpen}
                  setIsOpen={(v) => { setFromOpen(v); if (v) setToOpen(false) }}
                  dropdownRef={fromRef}
                />
              </div>
            </div>

            {/* Swap Button */}
            <div className="currency-swap-container">
              <button className="currency-swap-btn" onClick={handleSwap} type="button" aria-label="Swap currencies">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M8 7h12M20 7l-4-4M20 7l-4 4M16 17H4M4 17l4-4M4 17l4 4" />
                </svg>
              </button>
            </div>

            {/* To Field */}
            <div className="currency-field">
              <label className="currency-label">Converted To</label>
              <div className="currency-input-row">
                <div className="currency-result">
                  {loading ? '...' : result || '0'}
                </div>
                <CurrencyDropdown
                  value={toCurrency}
                  onChange={setToCurrency}
                  currencies={currencies}
                  search={toSearch}
                  setSearch={setToSearch}
                  isOpen={toOpen}
                  setIsOpen={(v) => { setToOpen(v); if (v) setFromOpen(false) }}
                  dropdownRef={toRef}
                />
              </div>
            </div>
          </div>

          {/* Rate Display */}
          <div className="currency-rate">
            {loading ? (
              <span>Loading rates...</span>
            ) : (
              <>
                <span className="rate-text">1 {fromCurrency} = {rate} {toCurrency}</span>
                {lastUpdated && (
                  <span className="rate-updated">
                    Updated {lastUpdated.toLocaleTimeString()}
                    {error && <span className="rate-cached"> ({error})</span>}
                  </span>
                )}
              </>
            )}
          </div>
        </div>

        {/* Disclaimer */}
        <div className="currency-disclaimer">
          <p>
            <strong>For informational purposes only.</strong> Exchange rates are sourced from
            open market data and may differ from official bank rates. Rates are updated periodically
            and cached for performance. Always verify with your financial institution before making
            transactions. We do not guarantee accuracy and are not liable for any decisions made
            based on this data.
          </p>
        </div>
      </div>
    </>
  )
}

export default CurrencyPage
