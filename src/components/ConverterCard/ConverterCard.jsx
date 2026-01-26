import { useState, useEffect, useCallback } from 'react'
import { useSearchParams } from 'react-router-dom'
import './ConverterCard.css'

function ConverterCard({
  fromUnit,
  toUnit,
  convert,
  allowSwap = true,
  additionalUnits = null,
  renderCustomInput = null,
  renderCustomOutput = null,
  inputType = 'numeric', // NEW: 'numeric' | 'text' | 'hex' | 'time' | 'ratio'
}) {
  const [searchParams, setSearchParams] = useSearchParams()
  const [fromValue, setFromValue] = useState(() => searchParams.get('value') || '')
  const [toValue, setToValue] = useState('')
  const [swapped, setSwapped] = useState(false)
  const [copied, setCopied] = useState(false)

  const currentFrom = swapped ? toUnit : fromUnit
  const currentTo = swapped ? fromUnit : toUnit

  // Perform conversion
  const doConvert = useCallback((value) => {
    if (!value || value === '') {
      setToValue('')
      return
    }
    const result = convert(value, currentFrom.id, currentTo.id)
    setToValue(result)
  }, [convert, currentFrom.id, currentTo.id])

  // Convert on value or unit change
  useEffect(() => {
    doConvert(fromValue)
  }, [fromValue, doConvert])

  // Get validation pattern based on input type
  const getValidationPattern = (type) => {
    switch(type) {
      case 'numeric':
        // Numbers, decimal point, negative sign, scientific notation
        return /^-?\d*\.?\d*([eE][-+]?\d*)?$/
      case 'text':
        // Allow any text (for base64, ASCII converter, etc.)
        return /^[\s\S]*$/
      case 'hex':
        // Hexadecimal values (with optional # prefix)
        return /^#?[0-9A-Fa-f]*$/
      case 'time':
        // Time format (HH:MM or MM:SS with colons)
        return /^[\d:]*$/
      case 'ratio':
        // Ratios and fractions (4:8 or 1/2)
        return /^[\d:\/\s]*$/
      case 'formula':
        // Math expressions (for calculators)
        return /^[\d\s+\-*/().=a-zA-Z]*$/
      default:
        // Default to numeric
        return /^-?\d*\.?\d*([eE][-+]?\d*)?$/
    }
  }

  // Handle input change
  const handleFromChange = (e) => {
    const value = e.target.value
    // Limit input length based on type (text types can be longer)
    const maxLength = inputType === 'text' ? 1000 : 50
    if (value.length > maxLength) return
    
    const pattern = getValidationPattern(inputType)
    if (value === '' || pattern.test(value)) {
      setFromValue(value)
    }
  }

  // Swap units
  const handleSwap = () => {
    if (!allowSwap) return
    setSwapped(s => !s)
    // Remove commas from toValue before setting as input (formatResult uses toLocaleString)
    const cleanValue = toValue ? toValue.toString().replace(/,/g, '') : ''
    setFromValue(cleanValue)
  }

  // Copy result
  const handleCopy = async () => {
    if (!toValue) return
    try {
      await navigator.clipboard.writeText(toValue)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error('Failed to copy:', err)
    }
  }

  // Share link
  const handleShare = async () => {
    const url = new URL(window.location.href)
    if (fromValue) {
      url.searchParams.set('value', fromValue)
    }
    try {
      if (navigator.share) {
        await navigator.share({
          title: `${currentFrom.name} to ${currentTo.name}`,
          text: `${fromValue} ${currentFrom.symbol} = ${toValue} ${currentTo.symbol}`,
          url: url.toString(),
        })
      } else {
        await navigator.clipboard.writeText(url.toString())
        setCopied(true)
        setTimeout(() => setCopied(false), 2000)
      }
    } catch (err) {
      console.error('Failed to share:', err)
    }
  }

  return (
    <div className="converter-card">
      {/* From Input */}
      <div className="converter-field">
        <label className="converter-label">
          From
          <span className="converter-unit-name">{currentFrom.name}</span>
        </label>
        {renderCustomInput ? (
          renderCustomInput(fromValue, setFromValue)
        ) : (
          <div className="converter-input-wrapper">
            <input
              type="text"
              inputMode="decimal"
              className="converter-input"
              value={fromValue}
              onChange={handleFromChange}
              placeholder="Enter value"
              aria-label={`Value in ${currentFrom.name}`}
              autoFocus
            />
            <span className="converter-input-symbol">{currentFrom.symbol}</span>
          </div>
        )}
      </div>

      {/* Swap Button */}
      {allowSwap && (
        <button
          className="converter-swap"
          onClick={handleSwap}
          aria-label="Swap units"
          title="Swap units"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <polyline points="17 1 21 5 17 9" />
            <path d="M3 11V9a4 4 0 0 1 4-4h14" />
            <polyline points="7 23 3 19 7 15" />
            <path d="M21 13v2a4 4 0 0 1-4 4H3" />
          </svg>
        </button>
      )}

      {/* To Output */}
      <div className="converter-field">
        <label className="converter-label">
          To
          <span className="converter-unit-name">{currentTo.name}</span>
        </label>
        {renderCustomOutput ? (
          renderCustomOutput(toValue)
        ) : (
          <div className="converter-input-wrapper converter-output-wrapper">
            <input
              type="text"
              className="converter-input converter-output"
              value={toValue}
              readOnly
              aria-label={`Result in ${currentTo.name}`}
              placeholder="Result"
            />
            <span className="converter-input-symbol">{currentTo.symbol}</span>
          </div>
        )}
      </div>

      {/* Actions */}
      <div className="converter-actions">
        <button
          className={`converter-action ${copied ? 'copied' : ''}`}
          onClick={handleCopy}
          disabled={!toValue}
          title="Copy result"
          aria-label={copied ? 'Copied to clipboard' : 'Copy result to clipboard'}
        >
          {copied ? (
            <>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polyline points="20 6 9 17 4 12" />
              </svg>
              Copied
            </>
          ) : (
            <>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
                <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
              </svg>
              Copy
            </>
          )}
        </button>
        <button
          className="converter-action"
          onClick={handleShare}
          disabled={!toValue}
          title="Share conversion"
          aria-label="Share this conversion"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="18" cy="5" r="3" />
            <circle cx="6" cy="12" r="3" />
            <circle cx="18" cy="19" r="3" />
            <line x1="8.59" y1="13.51" x2="15.42" y2="17.49" />
            <line x1="15.41" y1="6.51" x2="8.59" y2="10.49" />
          </svg>
          Share
        </button>
      </div>
    </div>
  )
}

export default ConverterCard
