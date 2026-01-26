// Conversion factors and functions for all unit types

// ============================================
// INPUT VALIDATION CONSTANTS
// ============================================
// Maximum safe value to prevent Infinity results
const MAX_SAFE_VALUE = 1e15; // 1 quadrillion - reasonable for any real-world conversion
const MIN_SAFE_VALUE = 1e-15; // Smallest meaningful value
const MAX_INPUT_VALUE = 1e100; // Absolute maximum input before rejection

// Validate and sanitize numeric input
export const validateInput = (value) => {
  if (value === '' || value === null || value === undefined) return { valid: false, value: '' };

  const num = parseFloat(value);

  // Check for NaN
  if (isNaN(num)) return { valid: false, value: '', error: 'Invalid number' };

  // Check for Infinity
  if (!isFinite(num)) return { valid: false, value: '', error: 'Number too large' };

  // Check for absurdly large inputs
  if (Math.abs(num) > MAX_INPUT_VALUE) return { valid: false, value: '', error: 'Number too large' };

  return { valid: true, value: num };
};

// Length conversion factors (to meters)
const lengthToMeters = {
  mm: 0.001,
  cm: 0.01,
  m: 1,
  km: 1000,
  in: 0.0254,
  ft: 0.3048,
  yd: 0.9144,
  miles: 1609.344,
  nmi: 1852, // nautical miles
};

// Weight conversion factors (to grams)
const weightToGrams = {
  mg: 0.001,
  g: 1,
  kg: 1000,
  oz: 28.3495,
  lbs: 453.592,
  st: 6350.29, // stone
  ton: 1000000, // metric ton
  ct: 0.2, // carat
};

// Volume conversion factors (to milliliters)
const volumeToMl = {
  ml: 1,
  l: 1000,
  tsp: 4.92892,
  tbsp: 14.7868,
  cup: 236.588,
  pt: 473.176, // US pint
  qt: 946.353, // US quart
  gal: 3785.41, // US gallon
  floz: 29.5735, // US fluid ounce
};

// Speed conversion factors (to m/s)
const speedToMs = {
  ms: 1, // meters per second
  kmh: 0.277778, // km/h
  mph: 0.44704, // miles per hour
  knot: 0.514444, // knots
  fps: 0.3048, // feet per second
};

// Area conversion factors (to square meters)
const areaToSqm = {
  sqmm: 0.000001,
  sqcm: 0.0001,
  sqm: 1,
  sqkm: 1000000,
  sqin: 0.00064516,
  sqft: 0.092903,
  sqyd: 0.836127,
  sqmi: 2590000,
  acre: 4046.86,
  ha: 10000, // hectare
};

// Digital storage conversion factors (to bytes)
const digitalToBytes = {
  bit: 0.125,
  byte: 1,
  kb: 1000,
  mb: 1000000,
  gb: 1000000000,
  tb: 1000000000000,
  kib: 1024, // kibibyte
  mib: 1048576, // mebibyte
  gib: 1073741824, // gibibyte
};

// Pressure conversion factors (to pascals)
const pressureToPascal = {
  pa: 1,
  kpa: 1000,
  bar: 100000,
  psi: 6894.76,
  atm: 101325,
  mmhg: 133.322,
};

// Energy conversion factors (to joules)
const energyToJoules = {
  j: 1,
  kj: 1000,
  cal: 4.184,
  kcal: 4184,
  kwh: 3600000,
  btu: 1055.06,
  wh: 3600,
};

// Power conversion factors (to watts)
const powerToWatts = {
  w: 1,
  kw: 1000,
  hp: 745.7,
  mw: 1000000,
};

// Angle conversion factors (to degrees)
const angleToDegrees = {
  deg: 1,
  rad: 180 / Math.PI,
  grad: 0.9, // gradian
  turn: 360,
};

// CSS unit conversion factors (to pixels, assuming 16px base)
const cssToPixels = {
  px: 1,
  rem: 16,
  em: 16, // assuming default
  pt: 1.333333, // 96/72
  pc: 16, // pica = 12pt
};

// Generic converter function
export const convert = (value, fromUnit, toUnit, conversionTable, baseUnit) => {
  if (isNaN(value) || value === '') return '';
  const num = parseFloat(value);

  // Validate input isn't too extreme
  if (!isFinite(num)) return 'Invalid input';
  if (Math.abs(num) > MAX_INPUT_VALUE) return 'Number too large';

  // Convert to base unit, then to target unit
  const inBase = num * conversionTable[fromUnit];
  const result = inBase / conversionTable[toUnit];

  return formatResult(result);
};

// Format result with appropriate precision
export const formatResult = (num) => {
  // Handle invalid inputs
  if (typeof num !== 'number' || isNaN(num)) return 'Invalid result';
  
  // Handle zero
  if (num === 0) return '0';

  // Handle Infinity
  if (!isFinite(num)) return 'Result too large';

  const absNum = Math.abs(num);

  // Handle extremely large results
  if (absNum > MAX_SAFE_VALUE) {
    // Still show result but in scientific notation with warning-like format
    return num.toExponential(4);
  }

  // Handle extremely small results (effectively zero for practical purposes)
  if (absNum < MIN_SAFE_VALUE && absNum !== 0) {
    return '≈ 0';
  }

  // For very small or very large numbers, use scientific notation
  if (absNum < 0.0001 || absNum >= 1e10) {
    return num.toExponential(6);
  }

  // For numbers close to integers, show fewer decimals
  if (Math.abs(num - Math.round(num)) < 0.0001) {
    return Math.round(num).toLocaleString();
  }

  // Smart decimal places based on magnitude
  let decimals = 6;
  if (absNum >= 1000) decimals = 2;
  else if (absNum >= 100) decimals = 3;
  else if (absNum >= 10) decimals = 4;
  else if (absNum >= 1) decimals = 5;

  // Remove trailing zeros
  return parseFloat(num.toFixed(decimals)).toString();
};

// Length conversions
export const convertLength = (value, from, to) => {
  return convert(value, from, to, lengthToMeters);
};

// Weight conversions
export const convertWeight = (value, from, to) => {
  return convert(value, from, to, weightToGrams);
};

// Volume conversions
export const convertVolume = (value, from, to) => {
  return convert(value, from, to, volumeToMl);
};

// Speed conversions
export const convertSpeed = (value, from, to) => {
  return convert(value, from, to, speedToMs);
};

// Area conversions
export const convertArea = (value, from, to) => {
  return convert(value, from, to, areaToSqm);
};

// Digital storage conversions
export const convertDigital = (value, from, to) => {
  return convert(value, from, to, digitalToBytes);
};

// Pressure conversions
export const convertPressure = (value, from, to) => {
  return convert(value, from, to, pressureToPascal);
};

// Energy conversions
export const convertEnergy = (value, from, to) => {
  return convert(value, from, to, energyToJoules);
};

// Power conversions
export const convertPower = (value, from, to) => {
  return convert(value, from, to, powerToWatts);
};

// Angle conversions
export const convertAngle = (value, from, to) => {
  return convert(value, from, to, angleToDegrees);
};

// CSS unit conversions
export const convertCSS = (value, from, to) => {
  return convert(value, from, to, cssToPixels);
};

// Fuel economy conversions (special - inverse relationship)
export const convertFuel = (value, from, to) => {
  if (isNaN(value) || value === '' || parseFloat(value) === 0) return '';
  const num = parseFloat(value);

  // Validate input
  if (!isFinite(num)) return 'Invalid input';
  if (Math.abs(num) > MAX_INPUT_VALUE) return 'Number too large';

  // MPG to L/100km: 235.215 / mpg
  // L/100km to MPG: 235.215 / l100km
  if ((from === 'mpg' && to === 'l100km') || (from === 'l100km' && to === 'mpg')) {
    return formatResult(235.215 / num);
  }
  return '';
};

// Fitness: pace conversion (min/km to min/mile)
export const convertPace = (value, from, to) => {
  if (isNaN(value) || value === '') return '';
  const num = parseFloat(value);

  if (from === 'minkm' && to === 'minmi') {
    return formatResult(num * 1.60934);
  }
  if (from === 'minmi' && to === 'minkm') {
    return formatResult(num / 1.60934);
  }
  return '';
};

// Fitness: steps to distance
export const convertSteps = (value, from, to) => {
  if (isNaN(value) || value === '') return '';
  const num = parseFloat(value);
  const avgStrideKm = 0.000762; // average stride length in km

  if (from === 'steps' && to === 'km') {
    return formatResult(num * avgStrideKm);
  }
  if (from === 'km' && to === 'steps') {
    return formatResult(num / avgStrideKm);
  }
  return '';
};

// Cooking: butter to oil conversion
export const convertButterOil = (value, from, to) => {
  if (isNaN(value) || value === '') return '';
  const num = parseFloat(value);

  if (from === 'butter' && to === 'oil') {
    return formatResult(num * 0.75);
  }
  if (from === 'oil' && to === 'butter') {
    return formatResult(num / 0.75);
  }
  return '';
};

// Percentage calculator - parse "X of Y" or "X/Y" format
export const calculatePercentage = (value) => {
  if (!value || value === '') return '';
  
  // Try to parse "X of Y" format (e.g., "25 of 100")
  const ofMatch = value.match(/^\s*(\d+\.?\d*)\s+of\s+(\d+\.?\d*)\s*$/i);
  if (ofMatch) {
    const part = parseFloat(ofMatch[1]);
    const whole = parseFloat(ofMatch[2]);
    if (whole === 0) return 'Cannot divide by zero';
    const percentage = (part / whole) * 100;
    return formatResult(percentage);
  }
  
  // Try to parse "X/Y" format (e.g., "25/100")
  const slashMatch = value.match(/^\s*(\d+\.?\d*)\s*\/\s*(\d+\.?\d*)\s*$/);
  if (slashMatch) {
    const part = parseFloat(slashMatch[1]);
    const whole = parseFloat(slashMatch[2]);
    if (whole === 0) return 'Cannot divide by zero';
    const percentage = (part / whole) * 100;
    return formatResult(percentage);
  }
  
  // If just a single number, return it as-is (for simple percentage display)
  if (!isNaN(parseFloat(value))) {
    return formatResult(parseFloat(value));
  }
  
  return 'Enter format: "25 of 100" or "25/100"';
};

// Tip calculator (calculates 15% tip by default)
export const calculateTip = (value) => {
  if (isNaN(value) || value === '') return '';
  const num = parseFloat(value);
  return formatResult(num * 0.15);
};

// Roman numeral conversion
export const toRoman = (value) => {
  if (!value || value === '') return '';
  const num = parseInt(value, 10);
  if (isNaN(num) || num < 1 || num > 3999) return 'Invalid (1-3999)';

  const romanNumerals = [
    ['M', 1000], ['CM', 900], ['D', 500], ['CD', 400],
    ['C', 100], ['XC', 90], ['L', 50], ['XL', 40],
    ['X', 10], ['IX', 9], ['V', 5], ['IV', 4], ['I', 1]
  ];

  let result = '';
  let remaining = num;

  for (const [numeral, val] of romanNumerals) {
    while (remaining >= val) {
      result += numeral;
      remaining -= val;
    }
  }

  return result;
};

// ASCII/Character converter
export const charToAscii = (value) => {
  if (!value || value === '') return '';
  const char = value.charAt(0);
  return char.charCodeAt(0).toString();
};

export const asciiToChar = (value) => {
  if (!value || value === '') return '';
  const code = parseInt(value, 10);
  if (isNaN(code) || code < 0 || code > 127) return 'Invalid (0-127)';
  return String.fromCharCode(code);
};

// BMI calculator (assumes 1.7m height for simple conversion)
export const calculateBMI = (value) => {
  if (isNaN(value) || value === '') return '';
  const weight = parseFloat(value);
  const height = 1.7; // default height in meters
  const bmi = weight / (height * height);
  return formatResult(bmi);
};

// Calories burned walking (approx 60 kcal per km for 70kg person)
export const calculateCaloriesBurned = (value) => {
  if (isNaN(value) || value === '') return '';
  const km = parseFloat(value);
  return formatResult(km * 60);
};

// Loan EMI calculator (simplified - assumes 5% annual rate, 3 year term)
export const calculateEMI = (value) => {
  if (isNaN(value) || value === '') return '';
  const principal = parseFloat(value);
  const annualRate = 0.05;
  const months = 36;
  const monthlyRate = annualRate / 12;
  const emi = principal * monthlyRate * Math.pow(1 + monthlyRate, months) / (Math.pow(1 + monthlyRate, months) - 1);
  return formatResult(emi);
};

// Discount calculator (assumes 20% discount)
export const calculateDiscount = (value) => {
  if (isNaN(value) || value === '') return '';
  const price = parseFloat(value);
  return formatResult(price * 0.80);
};

// Age calculator
export const calculateAge = (value) => {
  if (isNaN(value) || value === '') return '';
  const birthYear = parseInt(value, 10);
  const currentYear = new Date().getFullYear();
  const age = currentYear - birthYear;
  if (age < 0 || age > 150) return 'Invalid year';
  return age.toString();
};

// Scientific: Force conversion (Newtons to pounds-force)
export const convertForce = (value, from, to) => {
  if (isNaN(value) || value === '') return '';
  const num = parseFloat(value);

  if (from === 'n' && to === 'lbf') {
    return formatResult(num * 0.224809);
  }
  if (from === 'lbf' && to === 'n') {
    return formatResult(num / 0.224809);
  }
  return '';
};

// Scientific: Frequency (Hz to RPM)
export const convertFrequency = (value, from, to) => {
  if (isNaN(value) || value === '') return '';
  const num = parseFloat(value);

  if (from === 'hz' && to === 'rpm') {
    return formatResult(num * 60);
  }
  if (from === 'rpm' && to === 'hz') {
    return formatResult(num / 60);
  }
  return '';
};

// Scientific: Data rate (Mbps to Gbps)
export const convertDataRate = (value, from, to) => {
  if (isNaN(value) || value === '') return '';
  const num = parseFloat(value);

  if (from === 'mbps' && to === 'gbps') {
    return formatResult(num / 1000);
  }
  if (from === 'gbps' && to === 'mbps') {
    return formatResult(num * 1000);
  }
  return '';
};

// Scientific: Lumens to Watts (LED approximation)
export const convertLumensToWatts = (value) => {
  if (isNaN(value) || value === '') return '';
  const lumens = parseFloat(value);
  return formatResult(lumens / 80); // ~80 lm/W for LED
};

// Temperature conversions (special formulas)
export const convertTemperature = (value, from, to) => {
  if (isNaN(value) || value === '') return '';
  const num = parseFloat(value);

  // Validate input
  if (!isFinite(num)) return 'Invalid input';
  if (Math.abs(num) > MAX_INPUT_VALUE) return 'Number too large';

  // First convert to Celsius
  let celsius;
  switch (from) {
    case 'c':
      celsius = num;
      break;
    case 'f':
      celsius = (num - 32) * 5 / 9;
      break;
    case 'k':
      celsius = num - 273.15;
      break;
    default:
      return '';
  }

  // Then convert from Celsius to target
  let result;
  switch (to) {
    case 'c':
      result = celsius;
      break;
    case 'f':
      result = (celsius * 9 / 5) + 32;
      break;
    case 'k':
      result = celsius + 273.15;
      break;
    default:
      return '';
  }

  return formatResult(result);
};

// Programmer conversions
export const convertBase = (value, fromBase, toBase) => {
  if (!value || value.trim() === '') return '';

  // Limit input length to prevent performance issues with very large numbers
  if (value.trim().length > 50) return 'Input too long';

  try {
    // Parse input in source base
    const decimal = parseInt(value.trim(), fromBase);
    if (isNaN(decimal)) return 'Invalid';

    // Check for safe integer range (JavaScript limitation)
    if (!Number.isSafeInteger(decimal)) return 'Number too large';

    // Convert to target base
    return decimal.toString(toBase).toUpperCase();
  } catch {
    return 'Invalid';
  }
};

export const decimalToHex = (value) => convertBase(value, 10, 16);
export const hexToDecimal = (value) => convertBase(value, 16, 10);
export const decimalToBinary = (value) => convertBase(value, 10, 2);
export const binaryToDecimal = (value) => convertBase(value, 2, 10);
export const decimalToOctal = (value) => convertBase(value, 10, 8);
export const octalToDecimal = (value) => convertBase(value, 8, 10);

// Base64 encoding/decoding
export const encodeBase64 = (text) => {
  try {
    return btoa(unescape(encodeURIComponent(text)));
  } catch {
    return 'Invalid input';
  }
};

export const decodeBase64 = (encoded) => {
  try {
    return decodeURIComponent(escape(atob(encoded)));
  } catch {
    return 'Invalid Base64';
  }
};

// Color conversions
export const hexToRgb = (hex) => {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  if (!result) return null;
  return {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16),
  };
};

export const rgbToHex = (r, g, b) => {
  return '#' + [r, g, b].map(x => {
    const hex = Math.max(0, Math.min(255, Math.round(x))).toString(16);
    return hex.length === 1 ? '0' + hex : hex;
  }).join('').toUpperCase();
};

export const rgbToHsl = (r, g, b) => {
  r /= 255;
  g /= 255;
  b /= 255;
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  let h, s, l = (max + min) / 2;

  if (max === min) {
    h = s = 0;
  } else {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r: h = ((g - b) / d + (g < b ? 6 : 0)) / 6; break;
      case g: h = ((b - r) / d + 2) / 6; break;
      case b: h = ((r - g) / d + 4) / 6; break;
    }
  }

  return {
    h: Math.round(h * 360),
    s: Math.round(s * 100),
    l: Math.round(l * 100),
  };
};

// Unix timestamp conversions
export const unixToDate = (timestamp) => {
  const num = parseInt(timestamp, 10);
  if (isNaN(num)) return 'Invalid timestamp';

  const date = new Date(num * 1000);
  return date.toLocaleString('en-US', {
    weekday: 'short',
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    timeZoneName: 'short',
  });
};

export const dateToUnix = (date) => {
  return Math.floor(date.getTime() / 1000);
};

// Get converter function by category
export const getConverterFunction = (category) => {
  const converters = {
    length: convertLength,
    weight: convertWeight,
    volume: convertVolume,
    speed: convertSpeed,
    area: convertArea,
    digital: convertDigital,
    temperature: convertTemperature,
    pressure: convertPressure,
    energy: convertEnergy,
    angles: convertAngle,
    css: convertCSS,
  };
  return converters[category] || null;
};

// ============================================
// COOKING CONVERSIONS - Ingredient Database
// ============================================

// Density database: grams per cup for common ingredients
export const ingredientDensity = {
  'all-purpose-flour': { name: 'All-Purpose Flour', gramsPerCup: 125 },
  'bread-flour': { name: 'Bread Flour', gramsPerCup: 127 },
  'cake-flour': { name: 'Cake Flour', gramsPerCup: 114 },
  'whole-wheat-flour': { name: 'Whole Wheat Flour', gramsPerCup: 120 },
  'granulated-sugar': { name: 'Granulated Sugar', gramsPerCup: 200 },
  'brown-sugar-packed': { name: 'Brown Sugar (packed)', gramsPerCup: 220 },
  'powdered-sugar': { name: 'Powdered Sugar', gramsPerCup: 120 },
  'butter': { name: 'Butter', gramsPerCup: 227 },
  'vegetable-oil': { name: 'Vegetable Oil', gramsPerCup: 218 },
  'milk': { name: 'Milk', gramsPerCup: 245 },
  'heavy-cream': { name: 'Heavy Cream', gramsPerCup: 238 },
  'honey': { name: 'Honey', gramsPerCup: 340 },
  'maple-syrup': { name: 'Maple Syrup', gramsPerCup: 322 },
  'white-rice': { name: 'White Rice (uncooked)', gramsPerCup: 185 },
  'oats': { name: 'Rolled Oats', gramsPerCup: 90 },
  'cocoa-powder': { name: 'Cocoa Powder', gramsPerCup: 85 },
  'cornstarch': { name: 'Cornstarch', gramsPerCup: 128 },
  'salt': { name: 'Table Salt', gramsPerCup: 288 },
  'baking-powder': { name: 'Baking Powder', gramsPerCup: 230 },
  'almonds-sliced': { name: 'Almonds (sliced)', gramsPerCup: 92 },
  'walnuts-chopped': { name: 'Walnuts (chopped)', gramsPerCup: 120 },
  'chocolate-chips': { name: 'Chocolate Chips', gramsPerCup: 170 },
  'raisins': { name: 'Raisins', gramsPerCup: 165 },
  'peanut-butter': { name: 'Peanut Butter', gramsPerCup: 258 },
  'cream-cheese': { name: 'Cream Cheese', gramsPerCup: 232 },
  'sour-cream': { name: 'Sour Cream', gramsPerCup: 242 },
  'yogurt': { name: 'Plain Yogurt', gramsPerCup: 245 },
  'water': { name: 'Water', gramsPerCup: 237 },
};

// Convert cups to grams for any ingredient
export const cupsToGramsForIngredient = (cups, ingredientKey) => {
  if (isNaN(cups) || cups === '') return '';
  const num = parseFloat(cups);
  const ingredient = ingredientDensity[ingredientKey];
  if (!ingredient) return '';
  return formatResult(num * ingredient.gramsPerCup);
};

// Convert grams to cups for any ingredient
export const gramsToCupsForIngredient = (grams, ingredientKey) => {
  if (isNaN(grams) || grams === '') return '';
  const num = parseFloat(grams);
  const ingredient = ingredientDensity[ingredientKey];
  if (!ingredient) return '';
  return formatResult(num / ingredient.gramsPerCup);
};

// Cooking volume conversions (comprehensive)
export const convertCookingVolume = (value, from, to) => {
  // All units in ml
  const cookingVolumes = {
    tsp: 4.92892,
    tbsp: 14.7868,
    floz: 29.5735,
    cup: 236.588,
    ml: 1,
    l: 1000,
    pt: 473.176, // US pint
    qt: 946.353, // US quart
  };

  if (isNaN(value) || value === '') return '';
  const num = parseFloat(value);
  const inMl = num * cookingVolumes[from];
  const result = inMl / cookingVolumes[to];
  return formatResult(result);
};

// Butter conversions (sticks, grams, cups, tablespoons)
export const convertButter = (value, from, to) => {
  // All in grams
  const butterUnits = {
    stick: 113.4,      // 1 US stick = 113.4g (1/2 cup)
    g: 1,
    cup: 227,          // 2 sticks
    tbsp: 14.175,      // 1 tbsp butter ≈ 14.175g
  };

  if (isNaN(value) || value === '') return '';
  const num = parseFloat(value);
  const inGrams = num * butterUnits[from];
  const result = inGrams / butterUnits[to];
  return formatResult(result);
};

// Egg conversions (whole, whites, yolks)
export const convertEggs = (value, from, to) => {
  // All in terms of "whole egg equivalents"
  // 1 whole egg ≈ 50g total (33g white + 17g yolk)
  const eggUnits = {
    whole: 1,
    white: 1,       // 1 white = can replace roughly 1 whole in some recipes
    yolk: 2,        // 2 yolks ≈ 1 whole for richness
    g: 0.02,        // 1g = 0.02 whole eggs (50g per egg)
  };

  if (isNaN(value) || value === '') return '';
  const num = parseFloat(value);

  // Special conversions
  if (from === 'whole' && to === 'white') {
    // 1 whole = 2 whites for binding
    return formatResult(num * 2);
  }
  if (from === 'whole' && to === 'yolk') {
    // 1 whole = 2 yolks for richness
    return formatResult(num * 2);
  }
  if (from === 'white' && to === 'whole') {
    return formatResult(num / 2);
  }
  if (from === 'yolk' && to === 'whole') {
    return formatResult(num / 2);
  }
  if (from === 'whole' && to === 'g') {
    return formatResult(num * 50);
  }
  if (from === 'g' && to === 'whole') {
    return formatResult(num / 50);
  }

  return '';
};

// Yeast conversions (active dry, instant, fresh)
export const convertYeast = (value, from, to) => {
  // Conversion ratios (all relative to active dry)
  // Active dry = 1, Instant = 0.75, Fresh = 3
  const yeastRatios = {
    'active-dry': 1,
    'instant': 0.75,    // Use 25% less instant than active dry
    'fresh': 3,         // Use 3x fresh compared to active dry
  };

  if (isNaN(value) || value === '') return '';
  const num = parseFloat(value);

  // Convert to active dry equivalent, then to target
  const inActiveDry = num / yeastRatios[from];
  const result = inActiveDry * yeastRatios[to];
  return formatResult(result);
};

// Sugar conversions (granulated, brown, powdered)
export const convertSugar = (value, from, to) => {
  // Cup equivalents (how many cups of each equal 1 cup granulated sweetness)
  // These are approximate substitution ratios
  const sugarRatios = {
    'granulated': 1,
    'brown-packed': 1,        // 1:1 by volume, packed
    'powdered': 1.75,         // 1¾ cups powdered = 1 cup granulated
    'honey': 0.75,            // ¾ cup honey = 1 cup sugar (reduce liquid)
    'maple-syrup': 0.75,      // ¾ cup maple = 1 cup sugar
  };

  if (isNaN(value) || value === '') return '';
  const num = parseFloat(value);

  // Convert to granulated equivalent, then to target
  const inGranulated = num / sugarRatios[from];
  const result = inGranulated * sugarRatios[to];
  return formatResult(result);
};

// ============================================
// CLOTHING & SIZING CONVERSIONS
// ============================================

// Men's shoe size conversion tables
const mensShoeSizes = {
  US: [6, 6.5, 7, 7.5, 8, 8.5, 9, 9.5, 10, 10.5, 11, 11.5, 12, 13, 14, 15],
  UK: [5.5, 6, 6.5, 7, 7.5, 8, 8.5, 9, 9.5, 10, 10.5, 11, 11.5, 12.5, 13.5, 14.5],
  EU: [39, 39.5, 40, 40.5, 41, 42, 42.5, 43, 44, 44.5, 45, 45.5, 46, 47, 48, 49],
  CM: [24, 24.5, 25, 25.5, 26, 26.5, 27, 27.5, 28, 28.5, 29, 29.5, 30, 31, 32, 33],
  JP: [24, 24.5, 25, 25.5, 26, 26.5, 27, 27.5, 28, 28.5, 29, 29.5, 30, 31, 32, 33],
};

// Women's shoe size conversion tables
const womensShoeSizes = {
  US: [5, 5.5, 6, 6.5, 7, 7.5, 8, 8.5, 9, 9.5, 10, 10.5, 11, 12],
  UK: [2.5, 3, 3.5, 4, 4.5, 5, 5.5, 6, 6.5, 7, 7.5, 8, 8.5, 9.5],
  EU: [35, 35.5, 36, 36.5, 37, 38, 38.5, 39, 40, 40.5, 41, 42, 42.5, 44],
  CM: [22, 22.5, 23, 23.5, 24, 24.5, 25, 25.5, 26, 26.5, 27, 27.5, 28, 29],
};

// Find closest index in size array
const findClosestSizeIndex = (sizes, value) => {
  let minDiff = Infinity;
  let closestIdx = 0;
  sizes.forEach((size, idx) => {
    const diff = Math.abs(size - value);
    if (diff < minDiff) {
      minDiff = diff;
      closestIdx = idx;
    }
  });
  return closestIdx;
};

// Men's shoe size converter
export const convertMensShoeSize = (value, from, to) => {
  if (isNaN(value) || value === '') return '';
  const num = parseFloat(value);

  const fromSizes = mensShoeSizes[from];
  const toSizes = mensShoeSizes[to];

  if (!fromSizes || !toSizes) return '';

  const idx = findClosestSizeIndex(fromSizes, num);
  return toSizes[idx].toString();
};

// Women's shoe size converter
export const convertWomensShoeSize = (value, from, to) => {
  if (isNaN(value) || value === '') return '';
  const num = parseFloat(value);

  const fromSizes = womensShoeSizes[from];
  const toSizes = womensShoeSizes[to];

  if (!fromSizes || !toSizes) return '';

  const idx = findClosestSizeIndex(fromSizes, num);
  return toSizes[idx].toString();
};

// Ring size conversions
const ringSizes = {
  US: [3, 3.5, 4, 4.5, 5, 5.5, 6, 6.5, 7, 7.5, 8, 8.5, 9, 9.5, 10, 10.5, 11, 11.5, 12, 12.5, 13],
  UK: ['F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'],
  EU: [44, 45, 46.5, 47.5, 49, 50, 51.5, 52.5, 54, 55, 57, 58, 59.5, 61, 62, 63, 64.5, 65.5, 67, 68, 69.5],
  MM: [14.1, 14.5, 14.9, 15.3, 15.7, 16.1, 16.5, 16.9, 17.3, 17.7, 18.1, 18.5, 18.9, 19.4, 19.8, 20.2, 20.6, 21, 21.4, 21.8, 22.2],
};

export const convertRingSize = (value, from, to) => {
  if (value === '' || value === null) return '';

  // Handle string input for UK sizes
  let idx;
  if (from === 'UK') {
    idx = ringSizes.UK.indexOf(value.toUpperCase());
    if (idx === -1) return 'Invalid';
  } else {
    const num = parseFloat(value);
    if (isNaN(num)) return '';
    idx = findClosestSizeIndex(ringSizes[from], num);
  }

  const result = ringSizes[to][idx];
  return result.toString();
};

// Clothing size conversions (general)
const clothingSizes = {
  US: ['XXS', 'XS', 'S', 'M', 'L', 'XL', 'XXL', 'XXXL'],
  USNum: [0, 2, 4, 6, 8, 10, 12, 14],      // US numeric (women's)
  UK: [4, 6, 8, 10, 12, 14, 16, 18],
  EU: [32, 34, 36, 38, 40, 42, 44, 46],
  JP: ['XXS', 'XS', 'S', 'M', 'L', 'LL', '3L', '4L'],
};

export const convertClothingSize = (value, from, to) => {
  if (value === '' || value === null) return '';

  let idx;
  if (from === 'US' || from === 'JP') {
    idx = clothingSizes[from].indexOf(value.toUpperCase());
    if (idx === -1) return 'Invalid';
  } else {
    const num = parseFloat(value);
    if (isNaN(num)) return '';
    idx = findClosestSizeIndex(clothingSizes[from], num);
  }

  if (idx === -1 || idx >= clothingSizes[to].length) return 'Invalid';

  const result = clothingSizes[to][idx];
  return result.toString();
};

// ============================================
// ENHANCED CALCULATORS
// ============================================

// Advanced percentage calculations
export const calculatePercentageAdvanced = (value, operation, percent) => {
  if (isNaN(value) || value === '') return '';
  const num = parseFloat(value);
  const pct = parseFloat(percent) || 0;

  switch (operation) {
    case 'of':
      // What is X% of Y?
      return formatResult((pct / 100) * num);
    case 'increase':
      // X increased by Y%
      return formatResult(num * (1 + pct / 100));
    case 'decrease':
      // X decreased by Y%
      return formatResult(num * (1 - pct / 100));
    case 'whatPercent':
      // X is what % of Y? (value=X, percent=Y)
      return formatResult((num / pct) * 100);
    case 'percentChange':
      // % change from X to Y (value=old, percent=new)
      return formatResult(((pct - num) / num) * 100);
    default:
      return '';
  }
};

// Ratio calculator
export const simplifyRatio = (a, b) => {
  if (isNaN(a) || isNaN(b) || a === '' || b === '' || b === 0) return '';
  const numA = parseFloat(a);
  const numB = parseFloat(b);

  // Find GCD
  const gcd = (x, y) => (y === 0 ? x : gcd(y, x % y));
  const divisor = gcd(Math.abs(numA), Math.abs(numB));

  return `${numA / divisor}:${numB / divisor}`;
};

// Scale ratio
export const scaleRatio = (a, b, targetA) => {
  if (isNaN(a) || isNaN(b) || isNaN(targetA) || a === 0) return '';
  const ratio = parseFloat(b) / parseFloat(a);
  return formatResult(parseFloat(targetA) * ratio);
};

// Proportion solver: a/b = c/x, solve for x
export const solveProportions = (a, b, c) => {
  if (isNaN(a) || isNaN(b) || isNaN(c) || a === 0) return '';
  // a/b = c/x => x = (b * c) / a
  return formatResult((parseFloat(b) * parseFloat(c)) / parseFloat(a));
};

// Compound interest calculator
export const calculateCompoundInterest = (principal, rate, years, compoundsPerYear = 12) => {
  if (isNaN(principal) || isNaN(rate) || isNaN(years)) return '';
  const p = parseFloat(principal);
  const r = parseFloat(rate) / 100;
  const n = parseFloat(compoundsPerYear);
  const t = parseFloat(years);

  // Reasonable limits for financial calculations
  if (p > 1e12) return 'Principal too large'; // Max 1 trillion
  if (r > 1) return 'Rate exceeds 100%'; // Max 100% annual rate
  if (t > 100) return 'Period too long'; // Max 100 years

  const amount = p * Math.pow(1 + r / n, n * t);
  return formatResult(amount);
};

// Sales tax calculator
export const calculateSalesTax = (price, taxRate) => {
  if (isNaN(price) || isNaN(taxRate)) return '';
  const p = parseFloat(price);
  const tax = parseFloat(taxRate) / 100;
  const total = p * (1 + tax);
  return formatResult(total);
};

// Circle calculator
export const calculateCircle = (value, from) => {
  if (isNaN(value) || value === '') return { radius: '', diameter: '', circumference: '', area: '' };
  const num = parseFloat(value);

  let radius;
  switch (from) {
    case 'radius':
      radius = num;
      break;
    case 'diameter':
      radius = num / 2;
      break;
    case 'circumference':
      radius = num / (2 * Math.PI);
      break;
    case 'area':
      radius = Math.sqrt(num / Math.PI);
      break;
    default:
      return { radius: '', diameter: '', circumference: '', area: '' };
  }

  return {
    radius: formatResult(radius),
    diameter: formatResult(radius * 2),
    circumference: formatResult(2 * Math.PI * radius),
    area: formatResult(Math.PI * radius * radius),
  };
};

// Triangle calculator (given 3 sides)
export const calculateTriangle = (a, b, c) => {
  if (isNaN(a) || isNaN(b) || isNaN(c)) return { perimeter: '', area: '', valid: false };
  const sideA = parseFloat(a);
  const sideB = parseFloat(b);
  const sideC = parseFloat(c);

  // Check triangle inequality
  if (sideA + sideB <= sideC || sideB + sideC <= sideA || sideA + sideC <= sideB) {
    return { perimeter: '', area: '', valid: false, error: 'Invalid triangle' };
  }

  const perimeter = sideA + sideB + sideC;
  const s = perimeter / 2; // semi-perimeter

  // Heron's formula
  const area = Math.sqrt(s * (s - sideA) * (s - sideB) * (s - sideC));

  return {
    perimeter: formatResult(perimeter),
    area: formatResult(area),
    valid: true,
  };
};

// BMI extended with ideal weight range
export const calculateBMIExtended = (weight, height) => {
  if (isNaN(weight) || isNaN(height) || height === 0) return null;
  const w = parseFloat(weight);
  const h = parseFloat(height);

  const bmi = w / (h * h);

  // Ideal weight range (BMI 18.5-24.9)
  const minIdealWeight = 18.5 * h * h;
  const maxIdealWeight = 24.9 * h * h;

  let category;
  if (bmi < 18.5) category = 'Underweight';
  else if (bmi < 25) category = 'Normal';
  else if (bmi < 30) category = 'Overweight';
  else category = 'Obese';

  return {
    bmi: formatResult(bmi),
    category,
    minIdealWeight: formatResult(minIdealWeight),
    maxIdealWeight: formatResult(maxIdealWeight),
  };
};

// Pregnancy due date calculator
export const calculateDueDate = (lastPeriodDate) => {
  if (!lastPeriodDate) return null;
  const lmp = new Date(lastPeriodDate);
  if (isNaN(lmp.getTime())) return null;

  // Naegele's rule: LMP + 280 days
  const dueDate = new Date(lmp);
  dueDate.setDate(dueDate.getDate() + 280);

  const today = new Date();
  const daysPregnant = Math.floor((today - lmp) / (1000 * 60 * 60 * 24));
  const weeksPregnant = Math.floor(daysPregnant / 7);
  const daysRemaining = daysPregnant % 7;

  let trimester;
  if (weeksPregnant < 13) trimester = 1;
  else if (weeksPregnant < 27) trimester = 2;
  else trimester = 3;

  return {
    dueDate: dueDate.toLocaleDateString(),
    weeksPregnant,
    daysRemaining,
    trimester,
  };
};

// Sleep cycle calculator
export const calculateSleepCycles = (wakeTime) => {
  if (!wakeTime) return [];

  // Each sleep cycle is ~90 minutes
  const cycleMinutes = 90;
  const fallAsleepMinutes = 15; // Average time to fall asleep

  const [hours, minutes] = wakeTime.split(':').map(Number);
  if (isNaN(hours) || isNaN(minutes)) return [];

  const wakeDate = new Date();
  wakeDate.setHours(hours, minutes, 0, 0);

  const bedtimes = [];
  // Calculate 6 cycles back (9 hours), 5 cycles (7.5 hours), 4 cycles (6 hours)
  for (let cycles = 6; cycles >= 4; cycles--) {
    const sleepTime = new Date(wakeDate);
    sleepTime.setMinutes(sleepTime.getMinutes() - (cycles * cycleMinutes) - fallAsleepMinutes);
    bedtimes.push({
      cycles,
      time: sleepTime.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
      hours: (cycles * cycleMinutes) / 60,
    });
  }

  return bedtimes;
};

// ============================================
// ENGINEERING & MECHANICS CONVERSIONS
// ============================================

// Acceleration conversion factors (to m/s²)
const accelerationToMps2 = {
  'mps2': 1,              // m/s²
  'fps2': 0.3048,         // ft/s²
  'g': 9.80665,           // g-force
  'gal': 0.01,            // galileo (cm/s²)
};

export const convertAcceleration = (value, from, to) => {
  return convert(value, from, to, accelerationToMps2);
};

// Angular velocity conversion factors (to rad/s)
const angularVelocityToRads = {
  'rads': 1,              // rad/s
  'degs': Math.PI / 180,  // deg/s
  'rpm': Math.PI / 30,    // revolutions per minute
  'rph': Math.PI / 1800,  // revolutions per hour
};

export const convertAngularVelocity = (value, from, to) => {
  return convert(value, from, to, angularVelocityToRads);
};

// Density conversion factors (to kg/m³)
const densityToKgm3 = {
  'kgm3': 1,              // kg/m³
  'gcm3': 1000,           // g/cm³
  'lbft3': 16.0185,       // lb/ft³
  'lbgal': 119.826,       // lb/gal (US)
  'kgl': 1,               // kg/L (same as g/cm³ numerically for water)
};

export const convertDensity = (value, from, to) => {
  return convert(value, from, to, densityToKgm3);
};

// Torque conversion factors (to N·m)
const torqueToNm = {
  'nm': 1,                // Newton-meter
  'lbft': 1.35582,        // pound-foot
  'lbin': 0.112985,       // pound-inch
  'kgfm': 9.80665,        // kilogram-force meter
  'ozin': 0.00706155,     // ounce-inch
};

export const convertTorque = (value, from, to) => {
  return convert(value, from, to, torqueToNm);
};

// Flow rate (volume) conversion factors (to m³/s)
const flowRateToM3s = {
  'm3s': 1,               // m³/s
  'lmin': 1.66667e-5,     // L/min
  'lh': 2.77778e-7,       // L/h
  'gpm': 6.30902e-5,      // gallons per minute (US)
  'cfm': 4.71947e-4,      // cubic feet per minute
  'cfs': 0.0283168,       // cubic feet per second
};

export const convertFlowRate = (value, from, to) => {
  return convert(value, from, to, flowRateToM3s);
};

// Mass flow rate conversion factors (to kg/s)
const massFlowToKgs = {
  'kgs': 1,               // kg/s
  'kgmin': 1 / 60,        // kg/min
  'kgh': 1 / 3600,        // kg/h
  'lbs': 0.453592,        // lb/s
  'lbmin': 0.00755987,    // lb/min
  'lbh': 0.000125998,     // lb/h
  'tonh': 0.277778,       // metric ton/h
};

export const convertMassFlow = (value, from, to) => {
  return convert(value, from, to, massFlowToKgs);
};

// Dynamic viscosity conversion factors (to Pa·s)
const viscosityDynamicToPas = {
  'pas': 1,               // Pascal-second
  'poise': 0.1,           // poise
  'cp': 0.001,            // centipoise
  'lbfts': 47.8803,       // lb/(ft·s)
};

export const convertViscosityDynamic = (value, from, to) => {
  return convert(value, from, to, viscosityDynamicToPas);
};

// Kinematic viscosity conversion factors (to m²/s)
const viscosityKinematicToM2s = {
  'm2s': 1,               // m²/s
  'stokes': 0.0001,       // stokes
  'cst': 0.000001,        // centistokes
  'ft2s': 0.092903,       // ft²/s
};

export const convertViscosityKinematic = (value, from, to) => {
  return convert(value, from, to, viscosityKinematicToM2s);
};

// Surface tension conversion factors (to N/m)
const surfaceTensionToNm = {
  'nm': 1,                // N/m
  'dyncm': 0.001,         // dyn/cm
  'mnm': 0.001,           // mN/m
  'lbfft': 14.5939,       // lbf/ft
};

export const convertSurfaceTension = (value, from, to) => {
  return convert(value, from, to, surfaceTensionToNm);
};

// Concentration conversions
export const convertConcentration = (value, from, to) => {
  if (isNaN(value) || value === '') return '';
  const num = parseFloat(value);

  // Convert to ppm first
  let ppm;
  switch (from) {
    case 'ppm': ppm = num; break;
    case 'ppb': ppm = num / 1000; break;
    case 'ppt': ppm = num / 1000000; break;
    case 'percent': ppm = num * 10000; break;
    case 'mgl': ppm = num; break; // mg/L ≈ ppm for water
    default: return '';
  }

  // Convert from ppm to target
  let result;
  switch (to) {
    case 'ppm': result = ppm; break;
    case 'ppb': result = ppm * 1000; break;
    case 'ppt': result = ppm * 1000000; break;
    case 'percent': result = ppm / 10000; break;
    case 'mgl': result = ppm; break;
    default: return '';
  }

  return formatResult(result);
};

// ============================================
// ELECTRICAL CONVERSIONS
// ============================================

// Electric charge conversion factors (to Coulombs)
const chargeToColumb = {
  'c': 1,                 // Coulomb
  'mc': 0.001,            // milliCoulomb
  'uc': 0.000001,         // microCoulomb
  'ah': 3600,             // Ampere-hour
  'mah': 3.6,             // milliAmpere-hour
  'faraday': 96485.33,    // Faraday constant
};

export const convertCharge = (value, from, to) => {
  return convert(value, from, to, chargeToColumb);
};

// Electric current conversion factors (to Amperes)
const currentToAmpere = {
  'a': 1,                 // Ampere
  'ma': 0.001,            // milliAmpere
  'ua': 0.000001,         // microAmpere
  'na': 0.000000001,      // nanoAmpere
  'ka': 1000,             // kiloAmpere
};

export const convertCurrent = (value, from, to) => {
  return convert(value, from, to, currentToAmpere);
};

// Voltage conversion factors (to Volts)
const voltageToVolt = {
  'v': 1,                 // Volt
  'mv': 0.001,            // milliVolt
  'uv': 0.000001,         // microVolt
  'kv': 1000,             // kiloVolt
  'mv2': 1000000,         // MegaVolt (using mv2 to avoid conflict)
};

export const convertVoltage = (value, from, to) => {
  return convert(value, from, to, voltageToVolt);
};

// Resistance conversion factors (to Ohms)
const resistanceToOhm = {
  'ohm': 1,               // Ohm
  'mohm': 0.001,          // milliOhm
  'kohm': 1000,           // kiloOhm
  'megohm': 1000000,      // MegaOhm
};

export const convertResistance = (value, from, to) => {
  return convert(value, from, to, resistanceToOhm);
};

// Capacitance conversion factors (to Farads)
const capacitanceToFarad = {
  'f': 1,                 // Farad
  'mf': 0.001,            // milliFarad
  'uf': 0.000001,         // microFarad
  'nf': 0.000000001,      // nanoFarad
  'pf': 0.000000000001,   // picoFarad
};

export const convertCapacitance = (value, from, to) => {
  return convert(value, from, to, capacitanceToFarad);
};

// Inductance conversion factors (to Henrys)
const inductanceToHenry = {
  'h': 1,                 // Henry
  'mh': 0.001,            // milliHenry
  'uh': 0.000001,         // microHenry
  'nh': 0.000000001,      // nanoHenry
};

export const convertInductance = (value, from, to) => {
  return convert(value, from, to, inductanceToHenry);
};

// Conductance conversion factors (to Siemens)
const conductanceToSiemens = {
  's': 1,                 // Siemens
  'ms': 0.001,            // milliSiemens
  'us': 0.000001,         // microSiemens
  'mho': 1,               // mho (same as Siemens)
};

export const convertConductance = (value, from, to) => {
  return convert(value, from, to, conductanceToSiemens);
};

// Electric field conversion factors (to V/m)
const electricFieldToVm = {
  'vm': 1,                // V/m
  'vcm': 100,             // V/cm
  'kvmm': 1000000,        // kV/mm
  'kvm': 1000,            // kV/m
  'mvm': 0.001,           // mV/m
};

export const convertElectricField = (value, from, to) => {
  return convert(value, from, to, electricFieldToVm);
};

// ============================================
// THERMAL & HEAT CONVERSIONS
// ============================================

// Temperature interval (difference) conversion
export const convertTemperatureInterval = (value, from, to) => {
  if (isNaN(value) || value === '') return '';
  const num = parseFloat(value);

  // For temperature differences:
  // 1°C change = 1K change = 1.8°F change

  let celsius;
  switch (from) {
    case 'c': celsius = num; break;
    case 'f': celsius = num / 1.8; break;
    case 'k': celsius = num; break; // Same as Celsius for intervals
    default: return '';
  }

  let result;
  switch (to) {
    case 'c': result = celsius; break;
    case 'f': result = celsius * 1.8; break;
    case 'k': result = celsius; break;
    default: return '';
  }

  return formatResult(result);
};

// Thermal conductivity conversion factors (to W/(m·K))
const thermalConductivityToWmK = {
  'wmk': 1,                           // W/(m·K)
  'btuhftf': 1.73073,                 // BTU/(hr·ft·°F)
  'calmscmk': 418.4,                  // cal/(s·cm·°C)
  'kcalmhrmk': 1.163,                 // kcal/(m·hr·K)
};

export const convertThermalConductivity = (value, from, to) => {
  return convert(value, from, to, thermalConductivityToWmK);
};

// Specific heat conversion factors (to J/(kg·K))
const specificHeatToJkgK = {
  'jkgk': 1,                          // J/(kg·K)
  'kjkgk': 1000,                      // kJ/(kg·K)
  'btulbf': 4186.8,                   // BTU/(lb·°F)
  'calgc': 4184,                      // cal/(g·°C)
  'kcalkgc': 4184,                    // kcal/(kg·°C)
};

export const convertSpecificHeat = (value, from, to) => {
  return convert(value, from, to, specificHeatToJkgK);
};

// Heat flux conversion factors (to W/m²)
const heatFluxToWm2 = {
  'wm2': 1,                           // W/m²
  'kwm2': 1000,                       // kW/m²
  'btuhft2': 3.15459,                 // BTU/(hr·ft²)
  'calm2s': 41840,                    // cal/(m²·s)
  'kcalm2h': 1.163,                   // kcal/(m²·h)
};

export const convertHeatFlux = (value, from, to) => {
  return convert(value, from, to, heatFluxToWm2);
};

// Thermal resistance conversion factors (to K/W)
const thermalResistanceToKW = {
  'kw': 1,                            // K/W
  'cw': 1,                            // °C/W (same as K/W)
  'fhrbtu': 1.8956,                   // °F·hr/BTU
};

export const convertThermalResistance = (value, from, to) => {
  return convert(value, from, to, thermalResistanceToKW);
};

// Heat transfer coefficient conversion factors (to W/(m²·K))
const heatTransferToWm2K = {
  'wm2k': 1,                          // W/(m²·K)
  'btuhft2f': 5.67826,                // BTU/(hr·ft²·°F)
  'kcalhm2c': 1.163,                  // kcal/(h·m²·°C)
  'calm2sc': 41840,                   // cal/(m²·s·°C)
};

export const convertHeatTransfer = (value, from, to) => {
  return convert(value, from, to, heatTransferToWm2K);
};

// ============================================
// LIGHT & OPTICS CONVERSIONS
// ============================================

// Luminance conversion factors (to cd/m²)
const luminanceToCdm2 = {
  'cdm2': 1,                          // candela per square meter (nit)
  'nit': 1,                           // same as cd/m²
  'footlambert': 3.426,               // foot-lambert
  'lambert': 3183.1,                  // lambert
  'stilb': 10000,                     // stilb (cd/cm²)
};

export const convertLuminance = (value, from, to) => {
  return convert(value, from, to, luminanceToCdm2);
};

// Illuminance conversion factors (to lux)
const illuminanceToLux = {
  'lux': 1,                           // lux (lm/m²)
  'footcandle': 10.764,               // foot-candle (lm/ft²)
  'phot': 10000,                      // phot (lm/cm²)
  'nox': 0.001,                       // nox (milllux)
};

export const convertIlluminance = (value, from, to) => {
  return convert(value, from, to, illuminanceToLux);
};

// Image resolution conversion factors (to DPI)
const resolutionToDpi = {
  'dpi': 1,                           // dots per inch
  'ppi': 1,                           // pixels per inch (same as DPI for screens)
  'dpcm': 2.54,                       // dots per cm
  'ppcm': 2.54,                       // pixels per cm
};

export const convertResolution = (value, from, to) => {
  return convert(value, from, to, resolutionToDpi);
};

// Light wavelength to frequency (c = λf)
export const convertLightWavelength = (value, from, to) => {
  if (isNaN(value) || value === '' || parseFloat(value) === 0) return '';
  const num = parseFloat(value);
  const speedOfLight = 299792458; // m/s

  // Convert input to meters (wavelength)
  let wavelengthM;
  if (from === 'nm') {
    wavelengthM = num * 1e-9;
  } else if (from === 'um') {
    wavelengthM = num * 1e-6;
  } else if (from === 'hz') {
    // Input is frequency, convert to wavelength first
    wavelengthM = speedOfLight / num;
  } else if (from === 'thz') {
    wavelengthM = speedOfLight / (num * 1e12);
  } else {
    return '';
  }

  // Convert to target
  let result;
  if (to === 'nm') {
    result = wavelengthM * 1e9;
  } else if (to === 'um') {
    result = wavelengthM * 1e6;
  } else if (to === 'hz') {
    result = speedOfLight / wavelengthM;
  } else if (to === 'thz') {
    result = speedOfLight / wavelengthM / 1e12;
  } else {
    return '';
  }

  return formatResult(result);
};

// ============================================
// SOUND & ACOUSTICS CONVERSIONS
// ============================================

// Sound frequency conversion factors (to Hz)
const frequencyToHz = {
  'hz': 1,                            // Hertz
  'khz': 1000,                        // kiloHertz
  'mhz': 1000000,                     // MegaHertz
  'ghz': 1000000000,                  // GigaHertz
};

export const convertSoundFrequency = (value, from, to) => {
  return convert(value, from, to, frequencyToHz);
};

// Frequency to musical note (A4 = 440 Hz)
export const frequencyToNote = (freq) => {
  if (isNaN(freq) || freq <= 0) return '';
  const num = parseFloat(freq);
  const A4 = 440;
  const noteNames = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];

  // Calculate semitones from A4
  const semitones = 12 * Math.log2(num / A4);
  const roundedSemitones = Math.round(semitones);

  // A4 is the 9th note (index) in octave 4
  const noteIndex = (9 + roundedSemitones % 12 + 12) % 12;
  const octave = 4 + Math.floor((9 + roundedSemitones) / 12);

  const cents = Math.round((semitones - roundedSemitones) * 100);
  const centsStr = cents >= 0 ? `+${cents}` : `${cents}`;

  return `${noteNames[noteIndex]}${octave} (${centsStr} cents)`;
};

// Sound wavelength in air (speed = 343 m/s at 20°C)
export const convertSoundWavelength = (value, from, to) => {
  if (isNaN(value) || value === '' || parseFloat(value) === 0) return '';
  const num = parseFloat(value);
  const speedOfSound = 343; // m/s at 20°C

  // Convert to wavelength in meters
  let wavelengthM;
  if (from === 'm') {
    wavelengthM = num;
  } else if (from === 'cm') {
    wavelengthM = num / 100;
  } else if (from === 'hz') {
    wavelengthM = speedOfSound / num;
  } else if (from === 'khz') {
    wavelengthM = speedOfSound / (num * 1000);
  } else {
    return '';
  }

  // Convert to target
  let result;
  if (to === 'm') {
    result = wavelengthM;
  } else if (to === 'cm') {
    result = wavelengthM * 100;
  } else if (to === 'hz') {
    result = speedOfSound / wavelengthM;
  } else if (to === 'khz') {
    result = speedOfSound / wavelengthM / 1000;
  } else {
    return '';
  }

  return formatResult(result);
};

// Decibel calculations
export const convertDecibel = (value, from, to) => {
  if (isNaN(value) || value === '') return '';
  const num = parseFloat(value);

  // SPL reference = 20 µPa
  const refPressure = 20e-6; // Pa

  let pascals;
  if (from === 'dbspl') {
    pascals = refPressure * Math.pow(10, num / 20);
  } else if (from === 'pa') {
    pascals = num;
  } else if (from === 'upa') {
    pascals = num * 1e-6;
  } else {
    return '';
  }

  let result;
  if (to === 'dbspl') {
    if (pascals <= 0) return '';
    result = 20 * Math.log10(pascals / refPressure);
  } else if (to === 'pa') {
    result = pascals;
  } else if (to === 'upa') {
    result = pascals * 1e6;
  } else {
    return '';
  }

  return formatResult(result);
};

// ============================================
// MAGNETISM CONVERSIONS
// ============================================

// Magnetic flux conversion factors (to Weber)
const magneticFluxToWeber = {
  'wb': 1,                            // Weber
  'mwb': 0.001,                       // milliWeber
  'uwb': 0.000001,                    // microWeber
  'maxwell': 1e-8,                    // Maxwell
  'vxs': 1,                           // Volt-second (same as Weber)
};

export const convertMagneticFlux = (value, from, to) => {
  return convert(value, from, to, magneticFluxToWeber);
};

// Magnetic flux density conversion factors (to Tesla)
const fluxDensityToTesla = {
  'tesla': 1,                         // Tesla
  'mt': 0.001,                        // milliTesla
  'ut': 0.000001,                     // microTesla
  'gauss': 0.0001,                    // Gauss
  'mgauss': 0.0000001,                // milliGauss
};

export const convertFluxDensity = (value, from, to) => {
  return convert(value, from, to, fluxDensityToTesla);
};

// Magnetic field strength conversion factors (to A/m)
const magneticFieldToAm = {
  'am': 1,                            // Ampere per meter
  'kam': 1000,                        // kiloAmpere per meter
  'oersted': 79.5775,                 // Oersted
};

export const convertMagneticField = (value, from, to) => {
  return convert(value, from, to, magneticFieldToAm);
};

// ============================================
// RADIATION CONVERSIONS
// ============================================

// Radioactivity conversion factors (to Becquerel)
const radioactivityToBq = {
  'bq': 1,                            // Becquerel
  'kbq': 1000,                        // kiloBecquerel
  'mbq': 1000000,                     // MegaBecquerel
  'gbq': 1e9,                         // GigaBecquerel
  'curie': 3.7e10,                    // Curie
  'mci': 3.7e7,                       // milliCurie
  'uci': 3.7e4,                       // microCurie
};

export const convertRadioactivity = (value, from, to) => {
  return convert(value, from, to, radioactivityToBq);
};

// Absorbed dose conversion factors (to Gray)
const absorbedDoseToGray = {
  'gray': 1,                          // Gray
  'mgy': 0.001,                       // milliGray
  'ugy': 0.000001,                    // microGray
  'rad': 0.01,                        // rad
  'mrad': 0.00001,                    // millirad
};

export const convertAbsorbedDose = (value, from, to) => {
  return convert(value, from, to, absorbedDoseToGray);
};

// Equivalent dose conversion factors (to Sievert)
const equivalentDoseToSv = {
  'sv': 1,                            // Sievert
  'msv': 0.001,                       // milliSievert
  'usv': 0.000001,                    // microSievert
  'rem': 0.01,                        // rem
  'mrem': 0.00001,                    // millirem
};

export const convertEquivalentDose = (value, from, to) => {
  return convert(value, from, to, equivalentDoseToSv);
};

// ============================================
// NUMBERS & MATH CONVERSIONS
// ============================================

// Fraction to decimal/percentage
export const convertFractionDecimal = (value, from, to) => {
  if (!value || value === '') return '';

  let decimal;

  if (from === 'fraction') {
    // Parse fraction like "1/3" or "3/4"
    const parts = value.toString().split('/');
    if (parts.length === 2) {
      const num = parseFloat(parts[0]);
      const denom = parseFloat(parts[1]);
      if (isNaN(num) || isNaN(denom) || denom === 0) return 'Invalid';
      decimal = num / denom;
    } else {
      decimal = parseFloat(value);
    }
  } else if (from === 'decimal') {
    decimal = parseFloat(value);
  } else if (from === 'percent') {
    decimal = parseFloat(value) / 100;
  } else {
    return '';
  }

  if (isNaN(decimal)) return 'Invalid';

  if (to === 'decimal') {
    return formatResult(decimal);
  } else if (to === 'percent') {
    return formatResult(decimal * 100);
  } else if (to === 'fraction') {
    // Convert to simple fraction
    return decimalToFraction(decimal);
  }

  return '';
};

// Helper: decimal to fraction
const decimalToFraction = (decimal) => {
  const tolerance = 1e-10;
  let num = 1;
  let denom = 1;
  let fraction = num / denom;

  while (Math.abs(fraction - decimal) > tolerance && denom < 10000) {
    if (fraction < decimal) {
      num++;
    } else {
      denom++;
      num = Math.round(decimal * denom);
    }
    fraction = num / denom;
  }

  // Simplify the fraction
  const gcd = (a, b) => (b === 0 ? a : gcd(b, a % b));
  const divisor = gcd(num, denom);

  return `${num / divisor}/${denom / divisor}`;
};

// Scientific notation conversion
export const convertScientificNotation = (value, to) => {
  if (!value || value === '') return '';

  const num = parseFloat(value);
  if (isNaN(num)) return 'Invalid';

  if (to === 'scientific') {
    return num.toExponential(6);
  } else if (to === 'engineering') {
    // Engineering notation: exponent multiple of 3
    if (num === 0) return '0';
    const exp = Math.floor(Math.log10(Math.abs(num)));
    const engExp = Math.floor(exp / 3) * 3;
    const mantissa = num / Math.pow(10, engExp);
    return `${formatResult(mantissa)}e${engExp >= 0 ? '+' : ''}${engExp}`;
  } else if (to === 'standard') {
    return formatResult(num);
  }

  return '';
};

// Round to significant figures
export const roundToSigFigs = (value, sigFigs) => {
  if (!value || value === '' || isNaN(value)) return '';
  const num = parseFloat(value);
  const sf = parseInt(sigFigs) || 3;

  if (num === 0) return '0';

  const magnitude = Math.floor(Math.log10(Math.abs(num)));
  const factor = Math.pow(10, sf - magnitude - 1);
  const rounded = Math.round(num * factor) / factor;

  return rounded.toString();
};

// ============================================
// RUNNING PACE & RACE PREDICTIONS
// ============================================

// Convert pace (min/km <-> min/mile)
export const convertPaceUnits = (value, from, to) => {
  if (!value || value === '') return '';

  // Parse time format (MM:SS or just minutes as decimal)
  let totalMinutes;
  if (typeof value === 'string' && value.includes(':')) {
    const [mins, secs] = value.split(':').map(Number);
    totalMinutes = mins + (secs || 0) / 60;
  } else {
    totalMinutes = parseFloat(value);
  }

  if (isNaN(totalMinutes)) return 'Invalid';

  const kmToMile = 1.60934;
  let result;

  if (from === 'minkm' && to === 'minmi') {
    result = totalMinutes * kmToMile;
  } else if (from === 'minmi' && to === 'minkm') {
    result = totalMinutes / kmToMile;
  } else {
    result = totalMinutes;
  }

  // Format as MM:SS
  const mins = Math.floor(result);
  const secs = Math.round((result - mins) * 60);
  return `${mins}:${secs.toString().padStart(2, '0')}`;
};

// Convert pace to speed and vice versa
export const paceToSpeed = (paceMinPerKm) => {
  if (!paceMinPerKm || paceMinPerKm <= 0) return 0;
  return 60 / paceMinPerKm; // km/h
};

export const speedToPace = (speedKmh) => {
  if (!speedKmh || speedKmh <= 0) return 0;
  return 60 / speedKmh; // min/km
};

// Predict race time using Riegel formula: T2 = T1 × (D2/D1)^1.06
export const predictRaceTime = (knownTime, knownDistance, targetDistance) => {
  if (!knownTime || !knownDistance || !targetDistance) return '';

  // Parse time (HH:MM:SS or MM:SS)
  let totalSeconds;
  const parts = knownTime.toString().split(':').map(Number);
  if (parts.length === 3) {
    totalSeconds = parts[0] * 3600 + parts[1] * 60 + parts[2];
  } else if (parts.length === 2) {
    totalSeconds = parts[0] * 60 + parts[1];
  } else {
    totalSeconds = parseFloat(knownTime) * 60; // Assume minutes
  }

  if (isNaN(totalSeconds)) return 'Invalid time';

  // Riegel formula
  const predictedSeconds = totalSeconds * Math.pow(targetDistance / knownDistance, 1.06);

  // Format output
  const hours = Math.floor(predictedSeconds / 3600);
  const mins = Math.floor((predictedSeconds % 3600) / 60);
  const secs = Math.round(predictedSeconds % 60);

  if (hours > 0) {
    return `${hours}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  }
  return `${mins}:${secs.toString().padStart(2, '0')}`;
};

// Standard race distances in km
export const raceDistances = {
  '1mile': 1.60934,
  '5k': 5,
  '10k': 10,
  '15k': 15,
  'half': 21.0975,
  'marathon': 42.195,
};

// ============================================
// TRIP COST CALCULATOR
// ============================================

export const calculateTripCost = (distance, fuelEfficiency, fuelPrice, efficiencyUnit = 'mpg', distanceUnit = 'miles') => {
  if (!distance || !fuelEfficiency || !fuelPrice) return null;

  const dist = parseFloat(distance);
  const eff = parseFloat(fuelEfficiency);
  const price = parseFloat(fuelPrice);

  if (isNaN(dist) || isNaN(eff) || isNaN(price) || eff <= 0) return null;

  let fuelNeeded;

  if (efficiencyUnit === 'mpg') {
    // Miles per gallon (US)
    const distInMiles = distanceUnit === 'km' ? dist * 0.621371 : dist;
    fuelNeeded = distInMiles / eff; // gallons
  } else if (efficiencyUnit === 'l100km') {
    // Liters per 100km
    const distInKm = distanceUnit === 'miles' ? dist * 1.60934 : dist;
    fuelNeeded = (eff * distInKm) / 100; // liters
  } else if (efficiencyUnit === 'kmpl') {
    // Kilometers per liter
    const distInKm = distanceUnit === 'miles' ? dist * 1.60934 : dist;
    fuelNeeded = distInKm / eff; // liters
  }

  const totalCost = fuelNeeded * price;
  const costPerUnit = totalCost / dist;

  return {
    fuelNeeded: formatResult(fuelNeeded),
    totalCost: formatResult(totalCost),
    costPerUnit: formatResult(costPerUnit),
  };
};

// ============================================
// DURATION CALCULATOR
// ============================================

// Parse duration string to seconds
export const parseDuration = (value) => {
  if (!value) return 0;

  // Handle HH:MM:SS or MM:SS format
  if (typeof value === 'string' && value.includes(':')) {
    const parts = value.split(':').map(Number);
    if (parts.length === 3) {
      return parts[0] * 3600 + parts[1] * 60 + parts[2];
    } else if (parts.length === 2) {
      return parts[0] * 60 + parts[1];
    }
  }

  // Handle decimal hours
  const num = parseFloat(value);
  return isNaN(num) ? 0 : num * 3600;
};

// Format seconds to HH:MM:SS
export const formatDuration = (seconds) => {
  if (isNaN(seconds)) return '0:00:00';

  const negative = seconds < 0;
  seconds = Math.abs(seconds);

  const hours = Math.floor(seconds / 3600);
  const mins = Math.floor((seconds % 3600) / 60);
  const secs = Math.round(seconds % 60);

  const formatted = `${hours}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  return negative ? `-${formatted}` : formatted;
};

// Add/subtract durations
export const addDurations = (time1, time2) => {
  const seconds1 = parseDuration(time1);
  const seconds2 = parseDuration(time2);
  return formatDuration(seconds1 + seconds2);
};

export const subtractDurations = (time1, time2) => {
  const seconds1 = parseDuration(time1);
  const seconds2 = parseDuration(time2);
  return formatDuration(seconds1 - seconds2);
};

export const multiplyDuration = (time, multiplier) => {
  const seconds = parseDuration(time);
  const mult = parseFloat(multiplier) || 1;
  return formatDuration(seconds * mult);
};

// Convert duration to different units
export const convertDuration = (value, toUnit) => {
  const seconds = parseDuration(value);

  switch (toUnit) {
    case 'seconds': return formatResult(seconds);
    case 'minutes': return formatResult(seconds / 60);
    case 'hours': return formatResult(seconds / 3600);
    case 'days': return formatResult(seconds / 86400);
    case 'formatted': return formatDuration(seconds);
    default: return formatDuration(seconds);
  }
};

// ============================================
// DOWNLOAD TIME CALCULATOR
// ============================================

export const calculateDownloadTime = (fileSize, downloadSpeed, sizeUnit = 'GB', speedUnit = 'Mbps') => {
  if (!fileSize || !downloadSpeed) return null;

  const size = parseFloat(fileSize);
  const speed = parseFloat(downloadSpeed);

  if (isNaN(size) || isNaN(speed) || speed <= 0) return null;

  // Convert file size to bits
  const sizeMultipliers = {
    'B': 8,
    'KB': 8 * 1000,
    'MB': 8 * 1000 * 1000,
    'GB': 8 * 1000 * 1000 * 1000,
    'TB': 8 * 1000 * 1000 * 1000 * 1000,
  };

  // Convert speed to bits per second
  const speedMultipliers = {
    'bps': 1,
    'Kbps': 1000,
    'Mbps': 1000 * 1000,
    'Gbps': 1000 * 1000 * 1000,
    'MBps': 8 * 1000 * 1000, // Bytes per second
  };

  const sizeInBits = size * (sizeMultipliers[sizeUnit] || sizeMultipliers['GB']);
  const speedInBps = speed * (speedMultipliers[speedUnit] || speedMultipliers['Mbps']);

  const timeInSeconds = sizeInBits / speedInBps;

  return {
    seconds: Math.round(timeInSeconds),
    formatted: formatDuration(timeInSeconds),
    minutes: formatResult(timeInSeconds / 60),
    hours: formatResult(timeInSeconds / 3600),
  };
};

// ============================================
// ENHANCED LOAN CALCULATOR
// ============================================

export const calculateLoan = (principal, annualRate, termYears, paymentFrequency = 12) => {
  if (!principal || !annualRate || !termYears) return null;

  const P = parseFloat(principal);
  const r = parseFloat(annualRate) / 100 / paymentFrequency; // Period rate
  const n = parseFloat(termYears) * paymentFrequency; // Total payments

  if (isNaN(P) || isNaN(r) || isNaN(n) || P <= 0 || r < 0 || n <= 0) return null;

  // Monthly payment formula: M = P * [r(1+r)^n] / [(1+r)^n - 1]
  let payment;
  if (r === 0) {
    payment = P / n;
  } else {
    payment = P * (r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
  }

  const totalPaid = payment * n;
  const totalInterest = totalPaid - P;

  // Generate amortization schedule (first 12 periods)
  const schedule = [];
  let balance = P;
  for (let i = 1; i <= Math.min(n, 12); i++) {
    const interestPayment = balance * r;
    const principalPayment = payment - interestPayment;
    balance -= principalPayment;
    schedule.push({
      period: i,
      payment: formatResult(payment),
      principal: formatResult(principalPayment),
      interest: formatResult(interestPayment),
      balance: formatResult(Math.max(0, balance)),
    });
  }

  return {
    payment: formatResult(payment),
    totalPaid: formatResult(totalPaid),
    totalInterest: formatResult(totalInterest),
    schedule,
  };
};

// ============================================
// GRADE CALCULATOR
// ============================================

// Calculate grade from points
export const calculateGrade = (earned, total) => {
  if (!earned || !total) return null;

  const e = parseFloat(earned);
  const t = parseFloat(total);

  if (isNaN(e) || isNaN(t) || t <= 0) return null;

  const percentage = (e / t) * 100;

  // Standard US grading scale
  let letter;
  if (percentage >= 93) letter = 'A';
  else if (percentage >= 90) letter = 'A-';
  else if (percentage >= 87) letter = 'B+';
  else if (percentage >= 83) letter = 'B';
  else if (percentage >= 80) letter = 'B-';
  else if (percentage >= 77) letter = 'C+';
  else if (percentage >= 73) letter = 'C';
  else if (percentage >= 70) letter = 'C-';
  else if (percentage >= 67) letter = 'D+';
  else if (percentage >= 63) letter = 'D';
  else if (percentage >= 60) letter = 'D-';
  else letter = 'F';

  return {
    percentage: formatResult(percentage),
    letter,
  };
};

// Calculate needed score to achieve target grade
export const calculateNeededScore = (currentGrade, currentWeight, finalWeight, targetGrade) => {
  if (currentGrade === '' || !currentWeight || !finalWeight || !targetGrade) return null;

  const current = parseFloat(currentGrade);
  const cWeight = parseFloat(currentWeight) / 100;
  const fWeight = parseFloat(finalWeight) / 100;
  const target = parseFloat(targetGrade);

  if (isNaN(current) || isNaN(cWeight) || isNaN(fWeight) || isNaN(target)) return null;

  // Target = (current * cWeight) + (needed * fWeight)
  // needed = (target - current * cWeight) / fWeight
  const needed = (target - current * cWeight) / fWeight;

  return {
    needed: formatResult(needed),
    possible: needed <= 100,
    message: needed > 100
      ? `Not achievable (would need ${formatResult(needed)}%)`
      : `You need ${formatResult(needed)}% on the final`,
  };
};

// Calculate GPA
export const calculateGPA = (grades) => {
  // grades = [{ letter: 'A', credits: 3 }, ...]
  if (!grades || !grades.length) return null;

  const gradePoints = {
    'A+': 4.0, 'A': 4.0, 'A-': 3.7,
    'B+': 3.3, 'B': 3.0, 'B-': 2.7,
    'C+': 2.3, 'C': 2.0, 'C-': 1.7,
    'D+': 1.3, 'D': 1.0, 'D-': 0.7,
    'F': 0.0,
  };

  let totalPoints = 0;
  let totalCredits = 0;

  grades.forEach(({ letter, credits }) => {
    const points = gradePoints[letter.toUpperCase()] ?? 0;
    const creds = parseFloat(credits) || 0;
    totalPoints += points * creds;
    totalCredits += creds;
  });

  if (totalCredits === 0) return null;

  return {
    gpa: formatResult(totalPoints / totalCredits),
    totalCredits,
  };
};

// ============================================
// ENHANCED DISCOUNT CALCULATOR
// ============================================

export const calculateDiscountAdvanced = (originalPrice, discounts) => {
  // discounts = array of discount percentages applied sequentially
  if (!originalPrice || !discounts || !discounts.length) return null;

  let price = parseFloat(originalPrice);
  if (isNaN(price) || price <= 0) return null;

  const steps = [];
  let totalDiscountPercent = 0;

  discounts.forEach((discount, i) => {
    const d = parseFloat(discount);
    if (isNaN(d)) return;

    const discountAmount = price * (d / 100);
    const newPrice = price - discountAmount;

    steps.push({
      step: i + 1,
      discount: d,
      discountAmount: formatResult(discountAmount),
      priceAfter: formatResult(newPrice),
    });

    price = newPrice;
  });

  const original = parseFloat(originalPrice);
  const totalSaved = original - price;
  totalDiscountPercent = (totalSaved / original) * 100;

  return {
    finalPrice: formatResult(price),
    totalSaved: formatResult(totalSaved),
    effectiveDiscount: formatResult(totalDiscountPercent),
    steps,
  };
};

// Reverse discount: find original price given final price and discount
export const reverseDiscount = (finalPrice, discountPercent) => {
  if (!finalPrice || !discountPercent) return null;

  const final = parseFloat(finalPrice);
  const discount = parseFloat(discountPercent);

  if (isNaN(final) || isNaN(discount) || discount >= 100) return null;

  const original = final / (1 - discount / 100);

  return {
    originalPrice: formatResult(original),
    discountAmount: formatResult(original - final),
  };
};
