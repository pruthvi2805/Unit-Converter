import { describe, expect, it } from 'vitest'
import { allConverters, categories, siteStats } from '../src/data/converterRegistry.js'
import { classifyHandlerResult, getConverterHandler } from '../src/lib/converterHandlers.js'

describe('converter registry', () => {
  it('keeps site stats and category counts in sync', () => {
    expect(siteStats.categoryCount).toBe(categories.length)
    expect(siteStats.converterCount).toBe(allConverters.length)
  })

  it('gives every converter the metadata required by the UI contract', () => {
    const paths = new Set()

    for (const converter of allConverters) {
      expect(converter.path).toMatch(/^\/[a-z0-9-]+\/[a-z0-9-]+$/)
      expect(paths.has(converter.path)).toBe(false)
      paths.add(converter.path)

      expect(converter.handlerKey).toBeTruthy()
      expect(converter.kind).toBeTruthy()
      expect(converter.description).toBeTruthy()
      expect(converter.formula).toBeTruthy()
      expect(converter.inputExamples.length).toBeGreaterThan(0)
      expect(converter.searchAliases.length).toBeGreaterThan(0)
      expect(converter.emptyStateMessage).toBeTruthy()
      expect(converter.path.startsWith('/currency')).toBe(false)
    }
  })

  it('covers every registered converter with a working handler sample', () => {
    for (const converter of allConverters) {
      const handler = getConverterHandler(converter.handlerKey)
      expect(handler, converter.id).toBeTruthy()

      const sample = converter.inputExamples[0]
      const validation = handler.validate?.(sample, converter.fromUnit.id, converter.toUnit.id)
      expect(validation?.state, `${converter.id} validation`).not.toBe('invalid')

      const result = handler.convert(sample, converter.fromUnit.id, converter.toUnit.id)
      const classification = classifyHandlerResult(result)
      expect(classification.state, `${converter.id} conversion`).toBe('success')
    }
  })
})
