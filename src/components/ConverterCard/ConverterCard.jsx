import { useEffect, useMemo, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { classifyHandlerResult } from '../../lib/converterHandlers'
import './ConverterCard.css'

function ConverterCard({
  fromUnit,
  toUnit,
  convert,
  allowSwap = true,
  inputKind = 'numeric',
  inputPlaceholder = 'Enter value',
  inputHelp = '',
  exampleInputs = [],
  validateInput,
  resultSummary,
  emptyStateMessage = 'Enter a value to convert.',
  validationPatternDescription = '',
}) {
  const [searchParams, setSearchParams] = useSearchParams()
  const [fromValue, setFromValue] = useState(() => searchParams.get('value') || '')
  const [toValue, setToValue] = useState('')
  const [swapped, setSwapped] = useState(false)
  const [copied, setCopied] = useState(false)
  const [shared, setShared] = useState(false)
  const [status, setStatus] = useState({ state: 'empty', message: emptyStateMessage })

  const currentFrom = swapped ? toUnit : fromUnit
  const currentTo = swapped ? fromUnit : toUnit

  useEffect(() => {
    const existingValue = searchParams.get('value') || ''
    if (existingValue === fromValue) return
    const next = new URLSearchParams(searchParams)
    if (fromValue) {
      next.set('value', fromValue)
      setSearchParams(next, { replace: true })
      return
    }
    next.delete('value')
    setSearchParams(next, { replace: true })
  }, [fromValue, searchParams, setSearchParams])

  useEffect(() => {
    if (!fromValue) {
      setToValue('')
      setStatus({ state: 'empty', message: emptyStateMessage })
      return
    }

    const validation = validateInput?.(fromValue, currentFrom.id, currentTo.id) || { state: 'valid' }
    if (validation.state === 'invalid') {
      setToValue('')
      setStatus(validation)
      return
    }

    const rawResult = convert(fromValue, currentFrom.id, currentTo.id)
    const classification = classifyHandlerResult(rawResult)
    setToValue(rawResult || '')
    setStatus(
      classification.state === 'empty'
        ? { state: 'empty', message: emptyStateMessage }
        : classification,
    )
  }, [convert, currentFrom.id, currentTo.id, emptyStateMessage, fromValue, validateInput])

  const canCopy = status.state === 'success' && Boolean(toValue)
  const summaryText = useMemo(() => {
    if (status.state !== 'success') return ''
    return resultSummary?.(fromValue, toValue, currentFrom, currentTo) || `${fromValue} ${currentFrom.symbol} equals ${toValue} ${currentTo.symbol}`.trim()
  }, [currentFrom, currentTo, fromValue, resultSummary, status.state, toValue])

  const handleSwap = () => {
    if (!allowSwap) return
    const nextValue = status.state === 'success' ? String(toValue) : fromValue
    setSwapped((current) => !current)
    setFromValue(nextValue)
  }

  const handleCopy = async () => {
    if (!canCopy) return
    try {
      await navigator.clipboard.writeText(String(toValue))
      setCopied(true)
      window.setTimeout(() => setCopied(false), 1800)
    } catch {
      setCopied(false)
    }
  }

  const handleShare = async () => {
    if (!summaryText) return
    const url = new URL(window.location.href)
    if (fromValue) url.searchParams.set('value', fromValue)

    try {
      if (navigator.share) {
        await navigator.share({
          title: `${currentFrom.name} to ${currentTo.name}`,
          text: summaryText,
          url: url.toString(),
        })
      } else {
        await navigator.clipboard.writeText(url.toString())
      }
      setShared(true)
      window.setTimeout(() => setShared(false), 1800)
    } catch {
      setShared(false)
    }
  }

  return (
    <section className="converter-card" aria-label={`${currentFrom.name} to ${currentTo.name} converter`}>
      <div className="converter-grid">
        <div className="converter-panel">
          <div className="converter-label-row">
            <label className="converter-label" htmlFor="converter-input">From</label>
            <span className="converter-unit-pill">{currentFrom.name}</span>
          </div>
          <div className="converter-input-wrapper">
            <input
              id="converter-input"
              className="converter-input"
              type="text"
              inputMode={inputKind === 'numeric' ? 'decimal' : 'text'}
              value={fromValue}
              onChange={(event) => setFromValue(event.target.value)}
              placeholder={inputPlaceholder}
              autoFocus
              aria-describedby="converter-help converter-status"
            />
            {currentFrom.symbol && <span className="converter-input-symbol">{currentFrom.symbol}</span>}
          </div>
          {(inputHelp || validationPatternDescription) && (
            <p className="converter-help" id="converter-help">
              {inputHelp}
              {inputHelp && validationPatternDescription ? ' ' : ''}
              {validationPatternDescription}
            </p>
          )}
          {exampleInputs.length > 0 && (
            <div className="converter-examples">
              {exampleInputs.map((example) => (
                <button
                  key={example}
                  type="button"
                  className="converter-example-chip"
                  onClick={() => setFromValue(example)}
                >
                  {example}
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="converter-swap-column">
          <button
            className="converter-swap"
            type="button"
            onClick={handleSwap}
            disabled={!allowSwap}
            aria-label={allowSwap ? 'Swap conversion direction' : 'Swap is not available for this tool'}
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polyline points="17 1 21 5 17 9" />
              <path d="M3 11V9a4 4 0 0 1 4-4h14" />
              <polyline points="7 23 3 19 7 15" />
              <path d="M21 13v2a4 4 0 0 1-4 4H3" />
            </svg>
          </button>
          {!allowSwap && <span className="converter-swap-note">One-way tool</span>}
        </div>

        <div className="converter-panel converter-panel-output">
          <div className="converter-label-row">
            <label className="converter-label" htmlFor="converter-output">To</label>
            <span className="converter-unit-pill">{currentTo.name}</span>
          </div>
          <div className={`converter-output-wrapper converter-output-${status.state}`}>
            <input
              id="converter-output"
              className="converter-output"
              type="text"
              value={status.state === 'success' ? toValue : ''}
              readOnly
              placeholder={status.state === 'success' ? '' : 'Result'}
            />
            {currentTo.symbol && <span className="converter-input-symbol">{currentTo.symbol}</span>}
          </div>
          <div id="converter-status" className={`converter-status converter-status-${status.state}`} aria-live="polite">
            {status.message}
          </div>
          {summaryText && <p className="converter-summary">{summaryText}</p>}
        </div>
      </div>

      <div className="converter-actions">
        <button className={`converter-action ${copied ? 'is-active' : ''}`} type="button" onClick={handleCopy} disabled={!canCopy}>
          {copied ? 'Copied' : 'Copy result'}
        </button>
        <button className={`converter-action ${shared ? 'is-active' : ''}`} type="button" onClick={handleShare} disabled={!summaryText}>
          {shared ? 'Shared' : 'Share link'}
        </button>
      </div>
    </section>
  )
}

export default ConverterCard
