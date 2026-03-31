import { categories as catalogCategories, popularConverters as legacyPopularConverters } from './converterRoutes.js'

const HANDLER_FROM_CATEGORY = {
  length: 'length',
  weight: 'weight',
  temperature: 'temperature',
  volume: 'volume',
  speed: 'speed',
  digital: 'digital',
  area: 'area',
  pressure: 'pressure',
  energy: 'energy',
  fuel: 'fuel',
  angles: 'angle',
  css: 'css',
}

const SLUG_HANDLER_CATEGORIES = new Set([
  'cooking',
  'engineering',
  'electrical',
  'scientific',
  'thermal',
  'time',
  'light',
  'misc',
  'calculators',
  'magnetism',
  'radiation',
  'sound',
  'clothing',
  'programmer',
  'numbers',
])

const CATEGORY_KIND = {
  length: 'reversible_conversion',
  weight: 'reversible_conversion',
  temperature: 'reversible_conversion',
  volume: 'reversible_conversion',
  speed: 'reversible_conversion',
  digital: 'reversible_conversion',
  area: 'reversible_conversion',
  pressure: 'reversible_conversion',
  energy: 'reversible_conversion',
  fuel: 'reversible_conversion',
  angles: 'reversible_conversion',
  css: 'reversible_conversion',
  cooking: 'reversible_conversion',
  scientific: 'reversible_conversion',
  time: 'format_transform',
  misc: 'one_way_calculator',
  calculators: 'one_way_calculator',
  engineering: 'reversible_conversion',
  electrical: 'reversible_conversion',
  thermal: 'reversible_conversion',
  light: 'reversible_conversion',
  sound: 'reversible_conversion',
  magnetism: 'reversible_conversion',
  radiation: 'reversible_conversion',
  clothing: 'reversible_conversion',
  programmer: 'format_transform',
  numbers: 'format_transform',
}

const pathMeta = {
  'speed/pace-converter': {
    handlerKey: 'pace-units',
    kind: 'reversible_conversion',
    inputKind: 'text',
    inputPlaceholder: '5:00',
    inputHelp: 'Enter running pace as MM:SS. Swap to convert back.',
    inputExamples: ['5:00', '7:30', '9:45'],
    searchAliases: ['pace converter', 'min per km', 'min per mile', 'running pace'],
    validationPatternDescription: 'Use MM:SS pace values such as 5:00 or 7:30.',
  },
  'digital/download-time': {
    handlerKey: 'download-time',
    kind: 'one_way_calculator',
    inputKind: 'text',
    supportsSwap: false,
    inputPlaceholder: '5 GB @ 100 Mbps',
    inputHelp: 'Enter file size and download speed.',
    inputExamples: ['5 GB @ 100 Mbps', '700 MB @ 50 Mbps', '1.5 GB, 200 Mbps'],
    searchAliases: ['download time calculator', 'file download time', 'internet speed'],
    validationPatternDescription: 'Use a size and speed such as 5 GB @ 100 Mbps.',
  },
  'programmer/decimal-to-hex': {
    inputKind: 'text',
    inputPlaceholder: '255',
    inputHelp: 'Swap to convert hexadecimal back to decimal.',
    inputExamples: ['255', '1024', '4096'],
  },
  'programmer/binary-converter': {
    inputKind: 'text',
    inputPlaceholder: '1010',
    inputHelp: 'Swap to convert binary back to decimal.',
    inputExamples: ['1010', '11111111', '10000000000'],
  },
  'programmer/base64': {
    inputKind: 'text',
    inputPlaceholder: 'Hello world',
    inputHelp: 'Swap to decode Base64 back to plain text.',
    inputExamples: ['Hello world', 'Convert', 'OpenAI'],
    searchAliases: ['encode text', 'decode base64', 'text to base64'],
  },
  'programmer/color-converter': {
    inputKind: 'text',
    inputPlaceholder: '#14B8A6',
    inputHelp: 'Swap to convert RGB text like rgb(20, 184, 166) back to HEX.',
    inputExamples: ['#14B8A6', '#FF5733', 'rgb(20, 184, 166)'],
    searchAliases: ['hex to rgb', 'rgb to hex', 'color code converter'],
  },
  'programmer/ascii-converter': {
    inputKind: 'text',
    inputPlaceholder: 'A',
    inputHelp: 'Swap to convert ASCII codes back to characters.',
    inputExamples: ['A', '65', 'Hello'],
    searchAliases: ['ascii to text', 'text to ascii', 'char code'],
  },
  'programmer/hex-to-decimal': {
    inputKind: 'text',
    inputPlaceholder: 'FF',
    inputHelp: 'Swap to convert decimal back to hexadecimal.',
    inputExamples: ['FF', '1A3', '100'],
  },
  'programmer/octal-converter': {
    inputKind: 'text',
    inputPlaceholder: '755',
    inputHelp: 'Swap to convert octal back to decimal.',
    inputExamples: ['755', '644', '17'],
  },
  'time/unix-timestamp': {
    handlerKey: 'unix-timestamp',
    kind: 'format_transform',
    inputKind: 'text',
    inputPlaceholder: '1700000000',
    inputHelp: 'Swap to convert a date string like 2026-03-31 back to Unix time.',
    inputExamples: ['1700000000', '2026-03-31', '2026-03-31T12:00:00Z'],
    searchAliases: ['epoch converter', 'unix time', 'timestamp to date'],
    validationPatternDescription: 'Use a Unix timestamp or an ISO-style date.',
  },
  'time/hours-to-minutes': {
    handlerKey: 'hours-to-minutes',
    kind: 'reversible_conversion',
    supportsSwap: true,
    inputKind: 'numeric',
  },
  'time/duration-calculator': {
    handlerKey: 'duration-calculator',
    kind: 'one_way_calculator',
    inputKind: 'text',
    supportsSwap: false,
    inputPlaceholder: '1:30:00 + 0:45:00',
    inputHelp: 'Use HH:MM:SS with +, -, or *.',
    inputExamples: ['1:30:00 + 0:45:00', '2:15:00 - 0:30:00', '0:20:00 * 3'],
    searchAliases: ['duration calculator', 'time difference', 'add time'],
    validationPatternDescription: 'Use HH:MM:SS values with +, -, or *.',
  },
  'energy/watts-to-horsepower': {
    handlerKey: 'power',
  },
  'fuel/trip-calculator': {
    handlerKey: 'trip-calculator',
    kind: 'one_way_calculator',
    inputKind: 'text',
    supportsSwap: false,
    inputPlaceholder: '300,30,4',
    inputHelp: 'Use distance, fuel efficiency, and fuel price.',
    inputExamples: ['300,30,4', '120,40,3.8', '500,28,4.5'],
    searchAliases: ['trip cost calculator', 'fuel trip cost', 'road trip fuel'],
    validationPatternDescription: 'Use distance, fuel efficiency, and fuel price.',
  },
  'cooking/cups-to-grams': {
    handlerKey: 'cups-to-grams',
    inputHelp: 'Uses all-purpose flour as the default ingredient.',
    searchAliases: ['cups to grams flour', 'grams to cups flour'],
  },
  'cooking/cooking-volume': {
    handlerKey: 'cooking-volume',
  },
  'cooking/weight-to-volume': {
    handlerKey: 'weight-to-volume',
    inputHelp: 'Uses all-purpose flour as the default ingredient.',
  },
  'cooking/butter-conversions': {
    handlerKey: 'butter',
  },
  'cooking/butter-to-oil': {
    handlerKey: 'butter-oil',
  },
  'cooking/egg-conversions': {
    handlerKey: 'eggs',
  },
  'cooking/yeast-conversions': {
    handlerKey: 'yeast',
  },
  'cooking/sugar-conversions': {
    handlerKey: 'sugar',
  },
  'cooking/oven-temperature': {
    handlerKey: 'temperature',
  },
  'fitness/pace-min-km-to-min-mile': {
    handlerKey: 'pace',
    kind: 'reversible_conversion',
    inputKind: 'numeric',
  },
  'fitness/steps-to-km': {
    handlerKey: 'steps',
    kind: 'reversible_conversion',
  },
  'fitness/bmi-calculator': {
    handlerKey: 'bmi-calculator',
    kind: 'one_way_calculator',
    supportsSwap: false,
    inputPlaceholder: '70',
    inputHelp: 'Single-input quick BMI estimate using the built-in assumptions.',
    inputExamples: ['70', '82', '95'],
    searchAliases: ['bmi estimate', 'body mass index quick'],
  },
  'fitness/calories-burned': {
    handlerKey: 'calories-burned',
    kind: 'one_way_calculator',
    supportsSwap: false,
    inputPlaceholder: '5',
    inputHelp: 'Estimated calories burned from distance in kilometers.',
    inputExamples: ['5', '10', '21.1'],
    searchAliases: ['calories burned walking', 'running calories'],
  },
  'scientific/newtons-to-pounds-force': {
    handlerKey: 'force',
  },
  'scientific/hertz-to-rpm': {
    handlerKey: 'frequency',
  },
  'scientific/mbps-to-gbps': {
    handlerKey: 'data-rate',
  },
  'scientific/lumens-to-watts': {
    handlerKey: 'lumens-to-watts',
    kind: 'one_way_calculator',
    supportsSwap: false,
    inputHelp: 'Uses an 80 lm/W LED approximation for quick estimation.',
  },
  'misc/percentage-calculator': {
    handlerKey: 'percentage-calculator',
    kind: 'one_way_calculator',
    supportsSwap: false,
    inputKind: 'text',
    inputPlaceholder: '25,200',
    inputHelp: 'Enter part,total to calculate the percentage.',
    inputExamples: ['25,200', '18,72', '3,8'],
    searchAliases: ['what percent', 'percentage of total'],
    validationPatternDescription: 'Use part,total such as 25,200.',
  },
  'misc/tip-calculator': {
    handlerKey: 'tip-calculator',
    kind: 'one_way_calculator',
    supportsSwap: false,
    inputKind: 'text',
    inputPlaceholder: '120,18',
    inputHelp: 'Enter bill,total tip percent.',
    inputExamples: ['120,18', '42,15', '250,20'],
    searchAliases: ['tip amount', 'restaurant tip calculator'],
    validationPatternDescription: 'Use bill,total tip percent such as 120,18.',
  },
  'misc/roman-numerals': {
    handlerKey: 'roman-numerals',
    kind: 'format_transform',
    supportsSwap: false,
    inputPlaceholder: '49',
    inputHelp: 'Converts decimal numbers to Roman numerals.',
    inputExamples: ['49', '99', '2026'],
    searchAliases: ['number to roman numerals', 'roman numeral converter'],
  },
  'misc/loan-emi-calculator': {
    handlerKey: 'loan-emi-calculator',
    kind: 'one_way_calculator',
    supportsSwap: false,
    inputKind: 'text',
    inputPlaceholder: '25000,6,5',
    inputHelp: 'Enter principal, annual rate, and years.',
    inputExamples: ['25000,6,5', '150000,7.5,15', '300000,5.9,30'],
    searchAliases: ['emi calculator', 'loan payment calculator'],
    validationPatternDescription: 'Use principal, annual rate, and years.',
  },
  'misc/discount-calculator': {
    handlerKey: 'discount-calculator',
    kind: 'one_way_calculator',
    supportsSwap: false,
    inputKind: 'text',
    inputPlaceholder: '80,25',
    inputHelp: 'Enter price and discount percent.',
    inputExamples: ['80,25', '199,15', '49.99,30'],
    searchAliases: ['sale price calculator', 'discount price'],
    validationPatternDescription: 'Use price and discount percent.',
  },
  'misc/age-calculator': {
    handlerKey: 'age-calculator',
    kind: 'one_way_calculator',
    supportsSwap: false,
    inputPlaceholder: '1995',
    inputHelp: 'Enter a birth year.',
    inputExamples: ['1995', '2000', '1988'],
    searchAliases: ['age from birth year', 'birth year calculator'],
  },
  'clothing/clothing-sizes': {
    inputKind: 'text',
    inputPlaceholder: 'M',
    inputHelp: 'Use a standard US size such as XS, S, M, L, or XL.',
    inputExamples: ['XS', 'M', 'XL'],
    searchAliases: ['shirt size converter', 'clothing size chart'],
  },
  'calculators/percentage-advanced': {
    kind: 'one_way_calculator',
    supportsSwap: false,
    inputKind: 'text',
    inputPlaceholder: '15% of 200',
    inputHelp: 'Also supports: 100 + 20%, 25 is what % of 100, 80 to 100.',
    inputExamples: ['15% of 200', '100 + 20%', '25 is what % of 100'],
    searchAliases: ['percentage increase', 'percentage decrease', 'percent change'],
    validationPatternDescription: 'Use expressions like 15% of 200 or 100 + 20%.',
  },
  'calculators/ratio-calculator': {
    kind: 'one_way_calculator',
    supportsSwap: false,
    inputKind: 'text',
    inputPlaceholder: '4:8',
    inputHelp: 'Use 2:3,6 to scale the ratio to a new first value.',
    inputExamples: ['4:8', '2:3,6', '16:24'],
    searchAliases: ['simplify ratio', 'scale ratio'],
    validationPatternDescription: 'Use 4:8 or 2:3,6.',
  },
  'calculators/proportion-solver': {
    kind: 'one_way_calculator',
    supportsSwap: false,
    inputKind: 'text',
    inputPlaceholder: '2,4,3',
    inputHelp: 'Enter a,b,c to solve a/b = c/x.',
    inputExamples: ['2,4,3', '5,8,10', '12,18,27'],
    searchAliases: ['solve proportion', 'cross multiply'],
    validationPatternDescription: 'Use a,b,c to solve a/b = c/x.',
  },
  'calculators/compound-interest': {
    kind: 'one_way_calculator',
    supportsSwap: false,
    inputKind: 'text',
    inputPlaceholder: '1000,5,10',
    inputHelp: 'Enter principal, annual rate, years, and optional compounds per year.',
    inputExamples: ['1000,5,10', '5000,7,20,12', '25000,4.5,15'],
    searchAliases: ['compound interest calculator', 'investment growth'],
    validationPatternDescription: 'Use principal, rate, years, and optional compounds per year.',
  },
  'calculators/sales-tax': {
    kind: 'one_way_calculator',
    supportsSwap: false,
    inputKind: 'text',
    inputPlaceholder: '100,8',
    inputHelp: 'Enter price and tax rate.',
    inputExamples: ['100,8', '49.99,7.5', '250,5'],
    searchAliases: ['sales tax calculator', 'tax added price'],
    validationPatternDescription: 'Use price and tax rate.',
  },
  'calculators/circle-calculator': {
    kind: 'one_way_calculator',
    supportsSwap: false,
    inputKind: 'text',
    inputPlaceholder: 'r=5',
    inputHelp: 'Use r=, d=, c=, or a=.',
    inputExamples: ['r=5', 'd=12', 'a=78.5'],
    searchAliases: ['circle area calculator', 'circumference calculator'],
    validationPatternDescription: 'Use r=, d=, c=, or a= with a numeric value.',
  },
  'calculators/triangle-calculator': {
    kind: 'one_way_calculator',
    supportsSwap: false,
    inputKind: 'text',
    inputPlaceholder: '3,4,5',
    inputHelp: 'Enter the three sides of the triangle.',
    inputExamples: ['3,4,5', '5,5,8', '6,8,10'],
    searchAliases: ['triangle area calculator', 'triangle sides'],
    validationPatternDescription: 'Use three side lengths like 3,4,5.',
  },
  'calculators/bmi-extended': {
    kind: 'one_way_calculator',
    supportsSwap: false,
    inputKind: 'text',
    inputPlaceholder: '70,1.75',
    inputHelp: 'Enter weight in kilograms and height in meters.',
    inputExamples: ['70,1.75', '82,1.82', '58,1.64'],
    searchAliases: ['body mass index calculator', 'bmi calculator'],
    validationPatternDescription: 'Use weight in kilograms and height in meters.',
  },
  'calculators/sleep-calculator': {
    kind: 'one_way_calculator',
    supportsSwap: false,
    inputKind: 'text',
    inputPlaceholder: '07:00',
    inputHelp: 'Enter the wake-up time as HH:MM.',
    inputExamples: ['07:00', '06:30', '08:15'],
    searchAliases: ['sleep cycle calculator', 'bedtime calculator'],
    validationPatternDescription: 'Use a wake-up time such as 07:00.',
  },
  'calculators/grade-calculator': {
    kind: 'one_way_calculator',
    supportsSwap: false,
    inputKind: 'text',
    inputPlaceholder: '85/100',
    inputHelp: 'Also supports 85,100 or GPA input like A:3,B+:3,A-:4.',
    inputExamples: ['85/100', '85,100', 'A:3,B+:3,A-:4'],
    searchAliases: ['gpa calculator', 'grade percentage'],
    validationPatternDescription: 'Use 85/100, 85,100, or GPA input like A:3,B+:3.',
  },
  'calculators/loan-calculator': {
    kind: 'one_way_calculator',
    supportsSwap: false,
    inputKind: 'text',
    inputPlaceholder: '200000,6,30',
    inputHelp: 'Enter principal, annual rate, years, and optional payments per year.',
    inputExamples: ['200000,6,30', '350000,5.5,30,12', '15000,8,5'],
    searchAliases: ['loan payment calculator', 'mortgage payment'],
    validationPatternDescription: 'Use principal, rate, years, and optional payments per year.',
  },
  'calculators/discount-advanced': {
    kind: 'one_way_calculator',
    supportsSwap: false,
    inputKind: 'text',
    inputPlaceholder: '100,30,20',
    inputHelp: 'Also supports reverse mode: 56,reverse,30.',
    inputExamples: ['100,30,20', '56,reverse,30', '250,10,5'],
    searchAliases: ['stacked discount', 'reverse discount calculator'],
    validationPatternDescription: 'Use price,discount[,discount2] or final,reverse,discount.',
  },
  'sound/frequency': {
    handlerKey: 'sound-frequency',
  },
  'numbers/fractions-decimals': {
    handlerKey: 'fraction-decimal',
    inputKind: 'text',
    inputPlaceholder: '1/2',
    inputHelp: 'Swap to convert decimals back into fractions.',
    inputExamples: ['1/2', '0.75', '3/8'],
    searchAliases: ['fraction to decimal', 'decimal to fraction'],
  },
  'numbers/scientific-notation': {
    inputKind: 'text',
    inputPlaceholder: '1234',
    inputHelp: 'Swap to convert scientific notation back to standard form.',
    inputExamples: ['1234', '6.02e23', '0.00045'],
    searchAliases: ['scientific notation converter', 'standard form'],
  },
  'numbers/significant-figures': {
    kind: 'one_way_calculator',
    supportsSwap: false,
    inputKind: 'text',
    inputPlaceholder: '123.456,3',
    inputHelp: 'Enter a number and optional significant-figure count. Defaults to 3.',
    inputExamples: ['123.456,3', '0.000987,2', '12345,4'],
    searchAliases: ['sig figs calculator', 'significant figures'],
    validationPatternDescription: 'Use a number and optional significant-figure count.',
  },
}

function dedupeStrings(values) {
  return [...new Set(values.filter(Boolean).map((value) => value.trim()).filter(Boolean))]
}

function slugWords(slug) {
  return slug.replace(/-/g, ' ')
}

function extractInputExample(value, inputKind) {
  if (!value) return ''
  if (inputKind === 'text') return ''
  const numericMatch = String(value).match(/-?\d+(?:\.\d+)?(?:e[-+]?\d+)?/i)
  return numericMatch ? numericMatch[0] : ''
}

function buildDefaultExamples(converter, meta) {
  const overrideExamples = meta.inputExamples || []
  const fallbackExamples = converter.commonConversions
    .map((item) => extractInputExample(item.from, meta.inputKind))
    .filter(Boolean)
    .slice(0, 3)
  const placeholderExample = meta.inputPlaceholder && meta.inputPlaceholder !== 'Enter value'
    ? [meta.inputPlaceholder]
    : []
  const examples = meta.inputKind === 'text'
    ? [...overrideExamples, ...placeholderExample]
    : [...overrideExamples, ...fallbackExamples]
  return dedupeStrings(examples).slice(0, 3)
}

function buildSearchAliases(category, converter, meta) {
  const aliases = [
    converter.name,
    category.name,
    slugWords(converter.slug),
    `${converter.fromUnit.name} to ${converter.toUnit.name}`,
    `${converter.fromUnit.symbol} to ${converter.toUnit.symbol}`,
    `${converter.fromUnit.symbol} ${converter.toUnit.symbol}`,
    ...(meta.searchAliases || []),
  ]
  return dedupeStrings(aliases)
}

function buildEmptyStateMessage(converter, meta) {
  if (meta.emptyStateMessage) return meta.emptyStateMessage
  if (meta.kind === 'one_way_calculator') {
    return `Enter ${converter.name.toLowerCase()} input to see the result.`
  }
  if (meta.inputKind === 'text') {
    return `Enter a ${converter.fromUnit.name.toLowerCase()} value to convert.`
  }
  return `Enter a ${converter.fromUnit.name.toLowerCase()} value to convert instantly.`
}

function getDefaultMeta(categorySlug, converterSlug) {
  if (HANDLER_FROM_CATEGORY[categorySlug]) {
    return {
      handlerKey: HANDLER_FROM_CATEGORY[categorySlug],
      kind: CATEGORY_KIND[categorySlug],
      supportsSwap: true,
      inputKind: 'numeric',
    }
  }
  if (SLUG_HANDLER_CATEGORIES.has(categorySlug)) {
    return {
      handlerKey: converterSlug,
      kind: CATEGORY_KIND[categorySlug],
      supportsSwap: true,
      inputKind: categorySlug === 'programmer' || categorySlug === 'numbers' ? 'text' : 'numeric',
    }
  }
  return null
}

function enrichConverter(category, converter) {
  const id = `${category.slug}/${converter.slug}`
  const defaultMeta = getDefaultMeta(category.slug, converter.slug) || {}
  const overrideMeta = pathMeta[id] || {}
  const meta = {
    supportsSwap: true,
    inputKind: 'numeric',
    inputPlaceholder: defaultMeta.inputKind === 'text' ? `Enter ${converter.fromUnit.name}` : 'Enter value',
    ...defaultMeta,
    ...overrideMeta,
  }

  if (!meta.kind || !meta.handlerKey) {
    throw new Error(`Missing registry metadata for ${id}`)
  }

  return {
    ...converter,
    id,
    categorySlug: category.slug,
    categoryName: category.name,
    path: `/${category.slug}/${converter.slug}`,
    handlerKey: meta.handlerKey,
    kind: meta.kind,
    supportsSwap: meta.supportsSwap,
    inputKind: meta.inputKind,
    inputPlaceholder: meta.inputPlaceholder,
    inputHelp: meta.inputHelp || '',
    inputExamples: buildDefaultExamples(converter, meta),
    searchAliases: buildSearchAliases(category, converter, meta),
    emptyStateMessage: buildEmptyStateMessage(converter, meta),
    validationPatternDescription: meta.validationPatternDescription || '',
    units: {
      from: converter.fromUnit,
      to: converter.toUnit,
    },
  }
}

export const categories = catalogCategories.map((category) => ({
  ...category,
  converters: category.converters.map((converter) => enrichConverter(category, converter)),
}))

export const allConverters = categories.flatMap((category) => category.converters)
export const popularConverters = legacyPopularConverters
export const siteStats = {
  categoryCount: categories.length,
  converterCount: allConverters.length,
}

export function getConverterByPath(categorySlug, converterSlug) {
  const category = categories.find((item) => item.slug === categorySlug)
  if (!category) return null
  const converter = category.converters.find((item) => item.slug === converterSlug)
  if (!converter) return null
  return { category, converter }
}
