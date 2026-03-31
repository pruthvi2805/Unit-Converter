import {
  addDurations,
  calculateAge,
  calculateBMI,
  calculateBMIExtended,
  calculateCaloriesBurned,
  calculateCircle,
  calculateCompoundInterest,
  calculateDiscount,
  calculateDiscountAdvanced,
  calculateDownloadTime,
  calculateEMI,
  calculateGrade,
  calculateGPA,
  calculateLoan,
  calculateNeededScore,
  calculatePercentage,
  calculatePercentageAdvanced,
  calculateSalesTax,
  calculateSleepCycles,
  calculateTip,
  calculateTriangle,
  calculateTripCost,
  charToAscii,
  cupsToGramsForIngredient,
  dateToUnix,
  decodeBase64,
  decimalToBinary,
  decimalToHex,
  decimalToOctal,
  encodeBase64,
  formatResult,
  frequencyToNote,
  gramsToCupsForIngredient,
  hexToDecimal,
  hexToRgb,
  octalToDecimal,
  multiplyDuration,
  reverseDiscount,
  rgbToHex,
  roundToSigFigs,
  scaleRatio,
  simplifyRatio,
  solveProportions,
  subtractDurations,
  toRoman,
  unixToDate,
  convertAbsorbedDose,
  convertAcceleration,
  convertAngle,
  convertAngularVelocity,
  convertArea,
  convertBase,
  convertButter,
  convertButterOil,
  convertCapacitance,
  convertCharge,
  convertClothingSize,
  convertConcentration,
  convertConductance,
  convertCookingVolume,
  convertCSS,
  convertCurrent,
  convertDataRate,
  convertDecibel,
  convertDensity,
  convertDigital,
  convertEggs,
  convertElectricField,
  convertEnergy,
  convertEquivalentDose,
  convertFlowRate,
  convertFluxDensity,
  convertForce,
  convertFractionDecimal,
  convertFrequency,
  convertFuel,
  convertHeatFlux,
  convertHeatTransfer,
  convertIlluminance,
  convertInductance,
  convertLength,
  convertLightWavelength,
  convertLuminance,
  convertLumensToWatts,
  convertMagneticField,
  convertMagneticFlux,
  convertMassFlow,
  convertMensShoeSize,
  convertPace,
  convertPaceUnits,
  convertPower,
  convertPressure,
  convertRadioactivity,
  convertResistance,
  convertRingSize,
  convertResolution,
  convertScientificNotation,
  convertSoundFrequency,
  convertSoundWavelength,
  convertSpecificHeat,
  convertSpeed,
  convertSteps,
  convertSugar,
  convertTemperature,
  convertTemperatureInterval,
  convertThermalConductivity,
  convertThermalResistance,
  convertTorque,
  convertViscosityDynamic,
  convertViscosityKinematic,
  convertVoltage,
  convertVolume,
  convertWeight,
  convertWomensShoeSize,
  convertYeast,
} from '../utils/conversions.js'

const INPUT_PATTERNS = {
  numeric: /^-?(?:\d+\.?\d*|\.\d+)(?:e[-+]?\d+)?$/i,
  pace: /^(?:\d+(?::\d{1,2})?|\d*\.?\d+)$/i,
  timestamp: /^(?:-?\d+|\d{4}-\d{2}-\d{2}(?:[tT ][\d:.+-Z]+)?)$/,
}

function toNumber(value) {
  const parsed = Number.parseFloat(value)
  return Number.isFinite(parsed) ? parsed : null
}

function toInputError(message) {
  return { state: 'invalid', message }
}

function normalizeText(value) {
  return String(value ?? '').trim()
}

function formatRange(min, max, unit = '') {
  return `${min}${unit} to ${max}${unit}`.trim()
}

function parseCommaList(value, expectedMinimum) {
  const parts = normalizeText(value).split(',').map((item) => item.trim()).filter(Boolean)
  return parts.length >= expectedMinimum ? parts : null
}

function parseAssignment(value) {
  const match = normalizeText(value).match(/^([rdca])\s*=\s*(-?(?:\d+\.?\d*|\.\d+))$/i)
  return match
    ? { key: match[1].toLowerCase(), value: match[2] }
    : null
}

function parseDownloadInput(value) {
  const match = normalizeText(value).match(/^([\d.]+)\s*([kmgt]?b)\s*(?:@|,)\s*([\d.]+)\s*([kmg]?b(?:ps|\/s)?|mbps|gbps|kbps|bps)$/i)
  if (!match) return null

  const [, size, sizeUnitRaw, speed, speedUnitRaw] = match
  const sizeUnit = sizeUnitRaw.toUpperCase()
  const normalizedSpeedUnit = speedUnitRaw.toLowerCase()
  const speedUnitMap = {
    bps: 'bps',
    kbps: 'Kbps',
    mbps: 'Mbps',
    gbps: 'Gbps',
    'b/s': 'bps',
    'kb/s': 'Kbps',
    'mb/s': 'MBps',
    'mbps': 'Mbps',
    'gbps': 'Gbps',
    'mbps': 'Mbps',
  }

  return {
    fileSize: size,
    sizeUnit,
    downloadSpeed: speed,
    speedUnit: speedUnitMap[normalizedSpeedUnit] || speedUnitMap[normalizedSpeedUnit.replace('/s', 'ps')] || 'Mbps',
  }
}

function validateByPattern(value, pattern, message) {
  const input = normalizeText(value)
  if (!input) return { state: 'empty' }
  if (!pattern.test(input)) return toInputError(message)
  return { state: 'valid' }
}

function classifyStringResult(result) {
  if (result == null || result === '') {
    return { state: 'empty' }
  }

  const text = String(result).trim()
  if (!text) return { state: 'empty' }

  const lower = text.toLowerCase()
  if (
    lower.startsWith('invalid') ||
    lower.startsWith('cannot') ||
    lower.includes('too large') ||
    lower.includes('exceeds') ||
    lower.includes('not achievable')
  ) {
    return { state: 'invalid', message: text }
  }

  if (
    lower.startsWith('enter ') ||
    lower.startsWith('use ') ||
    lower.startsWith('also supports')
  ) {
    return { state: 'guidance', message: text }
  }

  return { state: 'success', message: text }
}

function genericSummary(value, result, fromUnit, toUnit) {
  if (result == null || result === '') return ''
  return `${value} ${fromUnit.symbol} = ${result} ${toUnit.symbol}`
}

function reversibleNumericHandler(convertFn) {
  return {
    convert: (value, fromUnit, toUnit) => convertFn(value, fromUnit, toUnit),
    validate: (value) => {
      const input = normalizeText(value)
      if (!input) return { state: 'empty' }
      if (!INPUT_PATTERNS.numeric.test(input)) {
        return toInputError('Enter a valid number, decimal, or scientific-notation value.')
      }
      return { state: 'valid' }
    },
    resultSummary: genericSummary,
  }
}

const genericHandlers = {
  length: reversibleNumericHandler(convertLength),
  weight: reversibleNumericHandler(convertWeight),
  temperature: reversibleNumericHandler(convertTemperature),
  volume: reversibleNumericHandler(convertVolume),
  speed: reversibleNumericHandler(convertSpeed),
  digital: reversibleNumericHandler(convertDigital),
  area: reversibleNumericHandler(convertArea),
  pressure: reversibleNumericHandler(convertPressure),
  energy: reversibleNumericHandler(convertEnergy),
  fuel: reversibleNumericHandler(convertFuel),
  angle: reversibleNumericHandler(convertAngle),
  css: reversibleNumericHandler(convertCSS),
  power: reversibleNumericHandler(convertPower),
  force: reversibleNumericHandler(convertForce),
  frequency: reversibleNumericHandler(convertFrequency),
  'data-rate': reversibleNumericHandler(convertDataRate),
  acceleration: reversibleNumericHandler(convertAcceleration),
  'angular-velocity': reversibleNumericHandler(convertAngularVelocity),
  density: reversibleNumericHandler(convertDensity),
  torque: reversibleNumericHandler(convertTorque),
  'flow-rate': reversibleNumericHandler(convertFlowRate),
  'mass-flow': reversibleNumericHandler(convertMassFlow),
  'viscosity-dynamic': reversibleNumericHandler(convertViscosityDynamic),
  'viscosity-kinematic': reversibleNumericHandler(convertViscosityKinematic),
  concentration: reversibleNumericHandler(convertConcentration),
  charge: reversibleNumericHandler(convertCharge),
  current: reversibleNumericHandler(convertCurrent),
  voltage: reversibleNumericHandler(convertVoltage),
  resistance: reversibleNumericHandler(convertResistance),
  capacitance: reversibleNumericHandler(convertCapacitance),
  inductance: reversibleNumericHandler(convertInductance),
  conductance: reversibleNumericHandler(convertConductance),
  'electric-field': reversibleNumericHandler(convertElectricField),
  'temperature-interval': reversibleNumericHandler(convertTemperatureInterval),
  'thermal-conductivity': reversibleNumericHandler(convertThermalConductivity),
  'specific-heat': reversibleNumericHandler(convertSpecificHeat),
  'heat-flux': reversibleNumericHandler(convertHeatFlux),
  'thermal-resistance': reversibleNumericHandler(convertThermalResistance),
  'heat-transfer-coefficient': reversibleNumericHandler(convertHeatTransfer),
  luminance: reversibleNumericHandler(convertLuminance),
  illuminance: reversibleNumericHandler(convertIlluminance),
  'image-resolution': reversibleNumericHandler(convertResolution),
  'wavelength-frequency': reversibleNumericHandler(convertLightWavelength),
  'sound-wavelength': reversibleNumericHandler(convertSoundWavelength),
  'decibel-converter': reversibleNumericHandler(convertDecibel),
  'magnetic-flux': reversibleNumericHandler(convertMagneticFlux),
  'flux-density': reversibleNumericHandler(convertFluxDensity),
  'magnetic-field': reversibleNumericHandler(convertMagneticField),
  radioactivity: reversibleNumericHandler(convertRadioactivity),
  'absorbed-dose': reversibleNumericHandler(convertAbsorbedDose),
  'equivalent-dose': reversibleNumericHandler(convertEquivalentDose),
}

export const handlerDefinitions = {
  ...genericHandlers,
  pace: {
    convert: (value, fromUnit, toUnit) => convertPace(value, fromUnit, toUnit),
    validate: (value) => validateByPattern(value, INPUT_PATTERNS.numeric, 'Enter pace as a number, such as 5 or 7.5.'),
    resultSummary: genericSummary,
  },
  steps: reversibleNumericHandler(convertSteps),
  'pace-units': {
    convert: (value, fromUnit, toUnit) => convertPaceUnits(value, fromUnit, toUnit),
    validate: (value) => validateByPattern(value, INPUT_PATTERNS.pace, 'Use minutes or MM:SS pace values such as 5, 5.5, or 5:00.'),
    resultSummary: genericSummary,
  },
  'download-time': {
    convert: (value) => {
      const parsed = parseDownloadInput(value)
      if (!parsed) return 'Use a size and speed such as 5 GB @ 100 Mbps.'
      const result = calculateDownloadTime(parsed.fileSize, parsed.downloadSpeed, parsed.sizeUnit, parsed.speedUnit)
      if (!result) return 'Use a positive file size and download speed.'
      return `~${result.formatted} (${result.minutes} min)`
    },
    validate: (value) => parseDownloadInput(value)
      ? { state: 'valid' }
      : toInputError('Use a size and speed such as 5 GB @ 100 Mbps.'),
    resultSummary: (value, result) => result ? `Estimated download time for ${value}: ${result}` : '',
  },
  'unix-timestamp': {
    convert: (value, fromUnit, toUnit) => {
      const input = normalizeText(value)
      if (!input) return ''
      if (/^-?\d+$/.test(input)) {
        return unixToDate(input)
      }
      const date = new Date(input)
      if (Number.isNaN(date.getTime())) return 'Use a Unix timestamp or an ISO-style date.'
      return String(dateToUnix(date))
    },
    validate: (value) => validateByPattern(value, INPUT_PATTERNS.timestamp, 'Use a Unix timestamp or an ISO-style date.'),
    resultSummary: genericSummary,
  },
  'hours-to-minutes': {
    convert: (value, fromUnit, toUnit) => {
      const numeric = toNumber(value)
      if (numeric == null) return ''
      return fromUnit === 'hr' && toUnit === 'min'
        ? String(numeric * 60)
        : String(numeric / 60)
    },
    validate: (value) => validateByPattern(value, INPUT_PATTERNS.numeric, 'Enter a valid number of hours or minutes.'),
    resultSummary: genericSummary,
  },
  'duration-calculator': {
    convert: (value) => {
      const input = normalizeText(value)
      if (!input) return ''
      const addMatch = input.match(/^(.+)\+(.+)$/)
      const subtractMatch = input.match(/^(.+)-(.+)$/)
      const multiplyMatch = input.match(/^(.+)\*(.+)$/)

      if (addMatch) {
        return addDurations(addMatch[1].trim(), addMatch[2].trim())
      }

      if (subtractMatch) {
        return subtractDurations(subtractMatch[1].trim(), subtractMatch[2].trim())
      }

      if (multiplyMatch) {
        const multiplier = toNumber(multiplyMatch[2].trim())
        if (multiplier == null) return 'Use HH:MM:SS values with +, -, or *.'
        return multiplyDuration(multiplyMatch[1].trim(), multiplier)
      }

      return 'Use HH:MM:SS values with +, -, or *.'
    },
    validate: (value) => {
      const input = normalizeText(value)
      if (!input) return { state: 'empty' }
      return /[:+\-*]/.test(input)
        ? { state: 'valid' }
        : toInputError('Use HH:MM:SS values with +, -, or *.')
    },
    resultSummary: (value, result) => result ? `${value} = ${result}` : '',
  },
  'trip-calculator': {
    convert: (value) => {
      const parts = parseCommaList(value, 3)
      if (!parts) return 'Use distance, fuel efficiency, and fuel price.'
      const result = calculateTripCost(parts[0], parts[1], parts[2])
      if (!result) return 'Use distance, fuel efficiency, and fuel price.'
      return `Fuel needed ${result.fuelNeeded}; total cost ${result.totalCost}; cost per unit ${result.costPerUnit}`
    },
    validate: (value) => parseCommaList(value, 3)
      ? { state: 'valid' }
      : toInputError('Use distance, fuel efficiency, and fuel price.'),
    resultSummary: (value, result) => result ? `Trip estimate for ${value}: ${result}` : '',
  },
  'cups-to-grams': {
    convert: (value, fromUnit, toUnit) => fromUnit === 'cup'
      ? cupsToGramsForIngredient(value, 'all-purpose-flour')
      : gramsToCupsForIngredient(value, 'all-purpose-flour'),
    validate: (value) => validateByPattern(value, INPUT_PATTERNS.numeric, 'Enter a cups or grams value.'),
    resultSummary: genericSummary,
  },
  'cooking-volume': reversibleNumericHandler(convertCookingVolume),
  'weight-to-volume': {
    convert: (value, fromUnit, toUnit) => {
      if (fromUnit === 'g' && toUnit === 'cup') {
        return gramsToCupsForIngredient(value, 'all-purpose-flour')
      }
      return cupsToGramsForIngredient(value, 'all-purpose-flour')
    },
    validate: (value) => validateByPattern(value, INPUT_PATTERNS.numeric, 'Enter a weight or volume value.'),
    resultSummary: genericSummary,
  },
  butter: reversibleNumericHandler(convertButter),
  'butter-oil': reversibleNumericHandler(convertButterOil),
  eggs: reversibleNumericHandler(convertEggs),
  yeast: reversibleNumericHandler(convertYeast),
  sugar: reversibleNumericHandler(convertSugar),
  'bmi-calculator': {
    convert: (value) => {
      const result = calculateBMI(value)
      return result ? `${result}` : ''
    },
    validate: (value) => validateByPattern(value, INPUT_PATTERNS.numeric, 'Enter your weight in kilograms.'),
    resultSummary: (value, result) => result ? `BMI estimate for ${value} kg: ${result}` : '',
  },
  'calories-burned': {
    convert: (value) => {
      const result = calculateCaloriesBurned(value)
      return result ? `${result}` : ''
    },
    validate: (value) => validateByPattern(value, INPUT_PATTERNS.numeric, 'Enter a distance in kilometers.'),
    resultSummary: (value, result) => result ? `Estimated calories for ${value} km: ${result}` : '',
  },
  'percentage-calculator': {
    convert: (value) => {
      const parts = parseCommaList(value, 2)
      if (parts) {
        const part = toNumber(parts[0])
        const total = toNumber(parts[1])
        if (part == null || total == null || total === 0) return 'Use part,total such as 25,200.'
        return formatResult((part / total) * 100)
      }
      return calculatePercentage(value)
    },
    validate: (value) => parseCommaList(value, 2)
      ? { state: 'valid' }
      : toInputError('Use part,total such as 25,200.'),
    resultSummary: (value, result) => result ? `${value} = ${result}%` : '',
  },
  'tip-calculator': {
    convert: (value) => {
      const parts = parseCommaList(value, 2)
      if (!parts) return 'Use bill,total tip percent such as 120,18.'
      const bill = toNumber(parts[0])
      const percent = toNumber(parts[1])
      if (bill == null || percent == null) return 'Use bill,total tip percent such as 120,18.'
      const tip = bill * (percent / 100)
      const total = bill + tip
      return `Tip ${formatResult(tip)}; total ${formatResult(total)}`
    },
    validate: (value) => parseCommaList(value, 2)
      ? { state: 'valid' }
      : toInputError('Use bill,total tip percent such as 120,18.'),
    resultSummary: (value, result) => result ? `Tip result: ${result}` : '',
  },
  'roman-numerals': {
    convert: (value) => toRoman(value),
    validate: (value) => validateByPattern(value, INPUT_PATTERNS.numeric, 'Enter a whole number to convert to Roman numerals.'),
    resultSummary: (value, result) => result ? `${value} = ${result}` : '',
  },
  'loan-emi-calculator': {
    convert: (value) => {
      const parts = parseCommaList(value, 3)
      if (!parts) return 'Use principal, annual rate, and years.'
      const principal = toNumber(parts[0])
      const annualRate = toNumber(parts[1])
      const years = toNumber(parts[2])
      if (principal == null || annualRate == null || years == null) return 'Use principal, annual rate, and years.'
      const monthlyRate = annualRate / 100 / 12
      const months = years * 12
      const emi = monthlyRate === 0
        ? principal / months
        : principal * monthlyRate * Math.pow(1 + monthlyRate, months) / (Math.pow(1 + monthlyRate, months) - 1)
      return formatResult(emi)
    },
    validate: (value) => parseCommaList(value, 3)
      ? { state: 'valid' }
      : toInputError('Use principal, annual rate, and years.'),
    resultSummary: (value, result) => result ? `EMI result: ${result}` : '',
  },
  'discount-calculator': {
    convert: (value) => {
      const parts = parseCommaList(value, 2)
      if (!parts) return 'Use price and discount percent.'
      const price = toNumber(parts[0])
      const percent = toNumber(parts[1])
      if (price == null || percent == null) return 'Use price and discount percent.'
      const finalPrice = price * (1 - percent / 100)
      const savings = price - finalPrice
      return `Final ${formatResult(finalPrice)}; saved ${formatResult(savings)}`
    },
    validate: (value) => parseCommaList(value, 2)
      ? { state: 'valid' }
      : toInputError('Use price and discount percent.'),
    resultSummary: (value, result) => result ? `Discount result: ${result}` : '',
  },
  'age-calculator': {
    convert: (value) => calculateAge(value),
    validate: (value) => validateByPattern(value, /^\d{4}$/, 'Enter a four-digit birth year.'),
    resultSummary: (value, result) => result ? `Age from ${value}: ${result}` : '',
  },
  'shoe-sizes-mens': reversibleNumericHandler(convertMensShoeSize),
  'shoe-sizes-womens': reversibleNumericHandler(convertWomensShoeSize),
  'clothing-sizes': {
    convert: (value, fromUnit, toUnit) => convertClothingSize(value, fromUnit, toUnit),
    validate: (value) => normalizeText(value)
      ? { state: 'valid' }
      : { state: 'empty' },
    resultSummary: genericSummary,
  },
  'ring-sizes': reversibleNumericHandler(convertRingSize),
  'percentage-advanced': {
    convert: (value) => {
      const input = normalizeText(value)
      if (!input) return ''
      let match = input.match(/^([\d.]+)%\s+of\s+([\d.]+)$/i)
      if (match) return calculatePercentageAdvanced(match[2], 'of', match[1])
      match = input.match(/^([\d.]+)\s*\+\s*([\d.]+)%$/)
      if (match) return calculatePercentageAdvanced(match[1], 'increase', match[2])
      match = input.match(/^([\d.]+)\s*-\s*([\d.]+)%$/)
      if (match) return calculatePercentageAdvanced(match[1], 'decrease', match[2])
      match = input.match(/^([\d.]+)\s+is\s+what\s+%\s+of\s+([\d.]+)$/i)
      if (match) return calculatePercentageAdvanced(match[1], 'whatPercent', match[2])
      match = input.match(/^([\d.]+)\s+to\s+([\d.]+)$/i)
      if (match) return calculatePercentageAdvanced(match[1], 'percentChange', match[2])
      return 'Use expressions like 15% of 200 or 100 + 20%.'
    },
    validate: (value) => normalizeText(value)
      ? { state: 'valid' }
      : { state: 'empty' },
    resultSummary: (value, result) => result ? `${value} = ${result}` : '',
  },
  'ratio-calculator': {
    convert: (value) => {
      const input = normalizeText(value)
      if (!input) return ''
      const scaleMatch = input.match(/^([\d.]+):([\d.]+)\s*,\s*([\d.]+)$/)
      if (scaleMatch) {
        const scaled = scaleRatio(scaleMatch[1], scaleMatch[2], scaleMatch[3])
        return scaled ? `${scaleMatch[3]}:${scaled}` : 'Use 4:8 or 2:3,6.'
      }
      const simplifyMatch = input.match(/^([\d.]+):([\d.]+)$/)
      if (simplifyMatch) {
        const simplified = simplifyRatio(simplifyMatch[1], simplifyMatch[2])
        return simplified || 'Use 4:8 or 2:3,6.'
      }
      return 'Use 4:8 or 2:3,6.'
    },
    validate: (value) => normalizeText(value)
      ? { state: 'valid' }
      : { state: 'empty' },
    resultSummary: (value, result) => result ? `${value} = ${result}` : '',
  },
  'proportion-solver': {
    convert: (value) => {
      const parts = parseCommaList(value, 3)
      if (!parts) return 'Use a,b,c to solve a/b = c/x.'
      return solveProportions(parts[0], parts[1], parts[2]) || 'Use a,b,c to solve a/b = c/x.'
    },
    validate: (value) => parseCommaList(value, 3)
      ? { state: 'valid' }
      : toInputError('Use a,b,c to solve a/b = c/x.'),
    resultSummary: (value, result) => result ? `Solved proportion for ${value}: x = ${result}` : '',
  },
  'compound-interest': {
    convert: (value) => {
      const parts = parseCommaList(value, 3)
      if (!parts) return 'Use principal, rate, years, and optional compounds per year.'
      return calculateCompoundInterest(parts[0], parts[1], parts[2], parts[3] || 12)
    },
    validate: (value) => parseCommaList(value, 3)
      ? { state: 'valid' }
      : toInputError('Use principal, rate, years, and optional compounds per year.'),
    resultSummary: (value, result) => result ? `Future value: ${result}` : '',
  },
  'sales-tax': {
    convert: (value) => {
      const parts = parseCommaList(value, 2)
      if (!parts) return 'Use price and tax rate.'
      return calculateSalesTax(parts[0], parts[1])
    },
    validate: (value) => parseCommaList(value, 2)
      ? { state: 'valid' }
      : toInputError('Use price and tax rate.'),
    resultSummary: (value, result) => result ? `Total with tax: ${result}` : '',
  },
  'circle-calculator': {
    convert: (value) => {
      const assignment = parseAssignment(value)
      if (!assignment) return 'Use r=, d=, c=, or a= with a numeric value.'
      const fromMap = { r: 'radius', d: 'diameter', c: 'circumference', a: 'area' }
      const result = calculateCircle(assignment.value, fromMap[assignment.key])
      if (!result.radius) return 'Use r=, d=, c=, or a= with a numeric value.'
      return `Radius ${result.radius}, diameter ${result.diameter}, circumference ${result.circumference}, area ${result.area}`
    },
    validate: (value) => parseAssignment(value)
      ? { state: 'valid' }
      : toInputError('Use r=, d=, c=, or a= with a numeric value.'),
    resultSummary: (value, result) => result ? `${value} -> ${result}` : '',
  },
  'triangle-calculator': {
    convert: (value) => {
      const parts = parseCommaList(value, 3)
      if (!parts) return 'Use three side lengths like 3,4,5.'
      const result = calculateTriangle(parts[0], parts[1], parts[2])
      if (!result.valid) return result.error || 'Invalid triangle'
      return `Perimeter ${result.perimeter}, area ${result.area}`
    },
    validate: (value) => parseCommaList(value, 3)
      ? { state: 'valid' }
      : toInputError('Use three side lengths like 3,4,5.'),
    resultSummary: (value, result) => result ? `${value} -> ${result}` : '',
  },
  'bmi-extended': {
    convert: (value) => {
      const parts = parseCommaList(value, 2)
      if (!parts) return 'Use weight in kilograms and height in meters.'
      const result = calculateBMIExtended(parts[0], parts[1])
      if (!result) return 'Use weight in kilograms and height in meters.'
      return `BMI ${result.bmi} (${result.category}). Ideal range ${formatRange(result.minIdealWeight, result.maxIdealWeight, ' kg')}`
    },
    validate: (value) => parseCommaList(value, 2)
      ? { state: 'valid' }
      : toInputError('Use weight in kilograms and height in meters.'),
    resultSummary: (value, result) => result ? `${value} -> ${result}` : '',
  },
  'sleep-calculator': {
    convert: (value) => {
      const cycles = calculateSleepCycles(value)
      if (!cycles.length) return 'Use a wake-up time such as 07:00.'
      return cycles.map((cycle) => cycle.time).join(', ')
    },
    validate: (value) => validateByPattern(value, /^\d{1,2}:\d{2}$/, 'Use a wake-up time such as 07:00.'),
    resultSummary: (value, result) => result ? `Recommended bedtime slots: ${result}` : '',
  },
  'grade-calculator': {
    convert: (value) => {
      const input = normalizeText(value)
      if (!input) return ''
      if (input.includes('/')) {
        const [earned, total] = input.split('/')
        const result = calculateGrade(earned, total)
        return result ? `${result.percentage}% (${result.letter})` : 'Use 85/100, 85,100, or GPA input like A:3,B+:3.'
      }
      const csv = parseCommaList(input, 2)
      if (csv && csv.length === 2) {
        const result = calculateGrade(csv[0], csv[1])
        return result ? `${result.percentage}% (${result.letter})` : 'Use 85/100, 85,100, or GPA input like A:3,B+:3.'
      }
      if (input.includes(':')) {
        const grades = input.split(',').map((item) => {
          const [letter, credits] = item.split(':').map((part) => part.trim())
          return { letter, credits }
        })
        const result = calculateGPA(grades)
        return result ? `GPA ${result.gpa} across ${result.totalCredits} credits` : 'Use 85/100, 85,100, or GPA input like A:3,B+:3.'
      }
      if (input.toLowerCase().includes('need')) {
        const parts = parseCommaList(input, 4)
        if (!parts) return 'Use 85/100, 85,100, or GPA input like A:3,B+:3.'
        const result = calculateNeededScore(parts[0], parts[1], parts[2], parts[3])
        return result ? result.message : 'Use 85/100, 85,100, or GPA input like A:3,B+:3.'
      }
      return 'Use 85/100, 85,100, or GPA input like A:3,B+:3.'
    },
    validate: (value) => normalizeText(value)
      ? { state: 'valid' }
      : { state: 'empty' },
    resultSummary: (value, result) => result ? `${value} -> ${result}` : '',
  },
  'loan-calculator': {
    convert: (value) => {
      const parts = parseCommaList(value, 3)
      if (!parts) return 'Use principal, rate, years, and optional payments per year.'
      const result = calculateLoan(parts[0], parts[1], parts[2], parts[3] || 12)
      if (!result) return 'Use principal, rate, years, and optional payments per year.'
      return `Payment ${result.payment}; total paid ${result.totalPaid}; total interest ${result.totalInterest}`
    },
    validate: (value) => parseCommaList(value, 3)
      ? { state: 'valid' }
      : toInputError('Use principal, rate, years, and optional payments per year.'),
    resultSummary: (value, result) => result ? `Loan estimate: ${result}` : '',
  },
  'discount-advanced': {
    convert: (value) => {
      const input = normalizeText(value)
      if (!input) return ''
      const reverseParts = parseCommaList(input, 3)
      if (reverseParts && reverseParts[1]?.toLowerCase() === 'reverse') {
        const result = reverseDiscount(reverseParts[0], reverseParts[2])
        return result
          ? `Original price ${result.originalPrice}; discount amount ${result.discountAmount}`
          : 'Use price,discount[,discount2] or final,reverse,discount.'
      }
      const parts = parseCommaList(input, 2)
      if (!parts) return 'Use price,discount[,discount2] or final,reverse,discount.'
      const [price, ...discounts] = parts
      const result = calculateDiscountAdvanced(price, discounts)
      return result
        ? `Final price ${result.finalPrice}; saved ${result.totalSaved}; effective discount ${result.effectiveDiscount}%`
        : 'Use price,discount[,discount2] or final,reverse,discount.'
    },
    validate: (value) => parseCommaList(value, 2)
      ? { state: 'valid' }
      : toInputError('Use price,discount[,discount2] or final,reverse,discount.'),
    resultSummary: (value, result) => result ? `${value} -> ${result}` : '',
  },
  'sound-frequency': {
    convert: (value, fromUnit, toUnit) => {
      const converted = convertSoundFrequency(value, fromUnit, toUnit)
      const note = frequencyToNote(value)
      return note ? `${converted} (${note})` : converted
    },
    validate: (value) => validateByPattern(value, INPUT_PATTERNS.numeric, 'Enter a valid frequency value.'),
    resultSummary: genericSummary,
  },
  'fraction-decimal': {
    convert: (value, fromUnit, toUnit) => convertFractionDecimal(value, fromUnit, toUnit),
    validate: (value) => normalizeText(value)
      ? { state: 'valid' }
      : { state: 'empty' },
    resultSummary: genericSummary,
  },
  'scientific-notation': {
    convert: (value, fromUnit, toUnit) => {
      const target = toUnit === 'sci' ? 'scientific' : toUnit === 'eng' ? 'engineering' : 'standard'
      return convertScientificNotation(value, target)
    },
    validate: (value) => normalizeText(value)
      ? { state: 'valid' }
      : { state: 'empty' },
    resultSummary: genericSummary,
  },
  'significant-figures': {
    convert: (value) => {
      const parts = parseCommaList(value, 1)
      if (!parts) return ''
      return roundToSigFigs(parts[0], parts[1] || 3)
    },
    validate: (value) => normalizeText(value)
      ? { state: 'valid' }
      : { state: 'empty' },
    resultSummary: (value, result) => result ? `Rounded value: ${result}` : '',
  },
  'decimal-to-hex': {
    convert: (value, fromUnit) => fromUnit === 'dec'
      ? decimalToHex(value)
      : hexToDecimal(value),
    validate: (value) => normalizeText(value)
      ? { state: 'valid' }
      : { state: 'empty' },
    resultSummary: genericSummary,
  },
  'hex-to-decimal': {
    convert: (value, fromUnit, toUnit) => fromUnit === 'hex'
      ? hexToDecimal(value)
      : decimalToHex(value),
    validate: (value) => normalizeText(value)
      ? { state: 'valid' }
      : { state: 'empty' },
    resultSummary: genericSummary,
  },
  'binary-converter': {
    convert: (value, fromUnit) => fromUnit === 'bin'
      ? convertBase(value, 2, 10)
      : decimalToBinary(value),
    validate: (value) => normalizeText(value)
      ? { state: 'valid' }
      : { state: 'empty' },
    resultSummary: genericSummary,
  },
  'octal-converter': {
    convert: (value, fromUnit) => fromUnit === 'oct'
      ? octalToDecimal(value)
      : decimalToOctal(value),
    validate: (value) => normalizeText(value)
      ? { state: 'valid' }
      : { state: 'empty' },
    resultSummary: genericSummary,
  },
  base64: {
    convert: (value, fromUnit) => fromUnit === 'text'
      ? encodeBase64(value)
      : decodeBase64(value),
    validate: (value) => normalizeText(value) ? { state: 'valid' } : { state: 'empty' },
    resultSummary: genericSummary,
  },
  'ascii-converter': {
    convert: (value, fromUnit) => {
      if (fromUnit === 'char') return charToAscii(value)
      const codes = normalizeText(value).split(/\s+/).filter(Boolean)
      try {
        return codes.map((code) => String.fromCharCode(Number.parseInt(code, 10))).join('')
      } catch {
        return 'Invalid input'
      }
    },
    validate: (value) => normalizeText(value) ? { state: 'valid' } : { state: 'empty' },
    resultSummary: genericSummary,
  },
  'color-converter': {
    convert: (value, fromUnit) => {
      const input = normalizeText(value)
      if (!input) return ''
      if (fromUnit === 'hex') {
        const rgb = hexToRgb(input)
        return rgb ? `rgb(${rgb.r}, ${rgb.g}, ${rgb.b})` : 'Invalid color'
      }
      const match = input.match(/^rgb\s*\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*\)$/i)
      if (!match) return 'Use HEX like #14B8A6 or RGB like rgb(20, 184, 166).'
      return rgbToHex(match[1], match[2], match[3])
    },
    validate: (value) => normalizeText(value) ? { state: 'valid' } : { state: 'empty' },
    resultSummary: genericSummary,
  },
  'lumens-to-watts': {
    convert: (value) => convertLumensToWatts(value),
    validate: (value) => validateByPattern(value, INPUT_PATTERNS.numeric, 'Enter a lumen value.'),
    resultSummary: (value, result) => result ? `Approximate watts for ${value} lm: ${result}` : '',
  },
}

export function getConverterHandler(handlerKey) {
  return handlerDefinitions[handlerKey] || null
}

export function classifyHandlerResult(result) {
  return classifyStringResult(result)
}
