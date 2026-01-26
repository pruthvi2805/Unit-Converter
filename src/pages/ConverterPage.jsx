import { Link } from 'react-router-dom'
import SEOHead, { generateConverterStructuredData } from '../components/SEOHead/SEOHead'
import Breadcrumbs from '../components/Breadcrumbs/Breadcrumbs'
import ConverterCard from '../components/ConverterCard/ConverterCard'
import {
  convertLength,
  convertWeight,
  convertTemperature,
  convertVolume,
  convertSpeed,
  convertArea,
  convertDigital,
  convertPressure,
  convertEnergy,
  convertPower,
  convertAngle,
  convertCSS,
  convertFuel,
  convertPace,
  convertSteps,
  convertButterOil,
  calculatePercentage,
  calculateTip,
  toRoman,
  charToAscii,
  calculateBMI,
  calculateCaloriesBurned,
  calculateEMI,
  calculateDiscount,
  calculateAge,
  convertForce,
  convertFrequency,
  convertDataRate,
  convertLumensToWatts,
  decimalToHex,
  hexToDecimal,
  decimalToBinary,
  binaryToDecimal,
  decimalToOctal,
  encodeBase64,
  decodeBase64,
  hexToRgb,
  rgbToHex,
  rgbToHsl,
  // Cooking conversions
  convertCookingVolume,
  convertButter,
  convertEggs,
  convertYeast,
  convertSugar,
  cupsToGramsForIngredient,
  // Clothing conversions
  convertMensShoeSize,
  convertWomensShoeSize,
  convertClothingSize,
  convertRingSize,
  // Calculator functions
  calculatePercentageAdvanced,
  simplifyRatio,
  scaleRatio,
  solveProportions,
  calculateCompoundInterest,
  calculateSalesTax,
  calculateCircle,
  calculateTriangle,
  calculateBMIExtended,
  calculateSleepCycles,
  // Engineering conversions
  convertAcceleration,
  convertAngularVelocity,
  convertDensity,
  convertTorque,
  convertFlowRate,
  convertMassFlow,
  convertViscosityDynamic,
  convertViscosityKinematic,
  convertConcentration,
  // Electrical conversions
  convertCharge,
  convertCurrent,
  convertVoltage,
  convertResistance,
  convertCapacitance,
  convertInductance,
  convertConductance,
  convertElectricField,
  // Thermal conversions
  convertTemperatureInterval,
  convertThermalConductivity,
  convertSpecificHeat,
  convertHeatFlux,
  convertThermalResistance,
  convertHeatTransfer,
  // Light & Optics conversions
  convertLuminance,
  convertIlluminance,
  convertResolution,
  convertLightWavelength,
  // Sound conversions
  convertSoundFrequency,
  frequencyToNote,
  convertSoundWavelength,
  convertDecibel,
  // Magnetism conversions
  convertMagneticFlux,
  convertFluxDensity,
  convertMagneticField,
  // Radiation conversions
  convertRadioactivity,
  convertAbsorbedDose,
  convertEquivalentDose,
  // Numbers & Math
  convertFractionDecimal,
  convertScientificNotation,
  roundToSigFigs,
} from '../utils/conversions'
import { allConverters } from '../data/converterRoutes'
import './ConverterPage.css'

// Get conversion function by category
const getConvertFunction = (category, fromUnit, toUnit) => {
  const converters = {
    length: convertLength,
    weight: convertWeight,
    temperature: convertTemperature,
    volume: convertVolume,
    speed: convertSpeed,
    area: convertArea,
    digital: convertDigital,
    pressure: convertPressure,
    energy: convertEnergy,
    angles: convertAngle,
    css: convertCSS,
  }
  return converters[category] || null
}

// Get programmer conversion function
const getProgrammerConvert = (slug) => {
  switch (slug) {
    case 'decimal-to-hex':
      return (value) => decimalToHex(value)
    case 'hex-to-decimal':
      return (value) => hexToDecimal(value)
    case 'binary-converter':
      return (value) => decimalToBinary(value)
    case 'octal-converter':
      return (value) => decimalToOctal(value)
    case 'base64':
      return (value) => encodeBase64(value)
    case 'ascii-converter':
      return (value) => charToAscii(value)
    case 'color-converter':
      return (value) => {
        const rgb = hexToRgb(value)
        if (!rgb) return 'Invalid'
        return `rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`
      }
    default:
      return null
  }
}

// Get special conversion function for categories with unique formulas
const getSpecialConvert = (category, slug, fromUnit, toUnit) => {
  // Fuel economy conversions
  if (category === 'fuel') {
    return (value, from, to) => convertFuel(value, from, to)
  }

  // Fitness conversions
  if (category === 'fitness') {
    if (slug === 'pace-min-km-to-min-mile') {
      return (value) => convertPace(value, 'minkm', 'minmi')
    }
    if (slug === 'steps-to-km') {
      return (value) => convertSteps(value, 'steps', 'km')
    }
    if (slug === 'bmi-calculator') {
      return (value) => calculateBMI(value)
    }
    if (slug === 'calories-burned') {
      return (value) => calculateCaloriesBurned(value)
    }
  }

  // Cooking conversions
  if (category === 'cooking') {
    if (slug === 'butter-to-oil') {
      return (value) => convertButterOil(value, 'butter', 'oil')
    }
    if (slug === 'oven-temperature') {
      return (value) => convertTemperature(value, 'f', 'c')
    }
    if (slug === 'cups-to-grams') {
      // Default to all-purpose flour (125g per cup)
      return (value) => cupsToGramsForIngredient(value, 'all-purpose-flour')
    }
    if (slug === 'cooking-volume') {
      return (value) => convertCookingVolume(value, 'cup', 'ml')
    }
    if (slug === 'weight-to-volume') {
      // Default to flour - grams to cups
      return (value) => {
        if (isNaN(value) || value === '') return ''
        return (parseFloat(value) / 125).toFixed(2)
      }
    }
    if (slug === 'butter-conversions') {
      return (value) => convertButter(value, 'stick', 'g')
    }
    if (slug === 'egg-conversions') {
      return (value) => convertEggs(value, 'whole', 'white')
    }
    if (slug === 'yeast-conversions') {
      return (value) => convertYeast(value, 'active-dry', 'instant')
    }
    if (slug === 'sugar-conversions') {
      return (value) => convertSugar(value, 'granulated', 'brown-packed')
    }
  }

  // Clothing conversions
  if (category === 'clothing') {
    if (slug === 'shoe-sizes-mens') {
      return (value) => convertMensShoeSize(value, 'US', 'EU')
    }
    if (slug === 'shoe-sizes-womens') {
      return (value) => convertWomensShoeSize(value, 'US', 'EU')
    }
    if (slug === 'clothing-sizes') {
      return (value) => convertClothingSize(value, 'USNum', 'EU')
    }
    if (slug === 'ring-sizes') {
      return (value) => convertRingSize(value, 'US', 'EU')
    }
  }

  // Calculator conversions
  if (category === 'calculators') {
    if (slug === 'percentage-advanced') {
      // Default: calculate X% of 100
      return (value) => calculatePercentageAdvanced(100, 'of', value)
    }
    if (slug === 'ratio-calculator') {
      // Input format: "a:b" - simplify it
      return (value) => {
        if (!value || value === '') return ''
        const parts = value.toString().split(':')
        if (parts.length === 2) {
          return simplifyRatio(parts[0], parts[1])
        }
        return value
      }
    }
    if (slug === 'proportion-solver') {
      // Default: solve for x where 1/2 = value/x
      return (value) => solveProportions(1, 2, value)
    }
    if (slug === 'compound-interest') {
      // Default: 5% annual rate, 10 years, monthly compounding
      return (value) => calculateCompoundInterest(value, 5, 10, 12)
    }
    if (slug === 'sales-tax') {
      // Default: 8% tax
      return (value) => calculateSalesTax(value, 8)
    }
    if (slug === 'circle-calculator') {
      return (value) => {
        const result = calculateCircle(value, 'radius')
        if (!result.radius) return ''
        return `d=${result.diameter}, C=${result.circumference}, A=${result.area}`
      }
    }
    if (slug === 'triangle-calculator') {
      // Default assumes equilateral with input as side length
      return (value) => {
        const result = calculateTriangle(value, value, value)
        if (!result.valid) return result.error || 'Invalid'
        return `P=${result.perimeter}, A=${result.area}`
      }
    }
    if (slug === 'bmi-extended') {
      // Default height 1.7m
      return (value) => {
        const result = calculateBMIExtended(value, 1.7)
        if (!result) return ''
        return `${result.bmi} (${result.category})`
      }
    }
    if (slug === 'sleep-calculator') {
      return (value) => {
        // Expect time in HH:MM format
        const cycles = calculateSleepCycles(value)
        if (!cycles.length) return 'Enter time as HH:MM'
        return cycles.map(c => c.time).join(', ')
      }
    }
  }

  // Misc conversions
  if (category === 'misc') {
    if (slug === 'percentage-calculator') {
      return (value) => calculatePercentage(value)
    }
    if (slug === 'tip-calculator') {
      return (value) => calculateTip(value)
    }
    if (slug === 'roman-numerals') {
      return (value) => toRoman(value)
    }
    if (slug === 'loan-emi-calculator') {
      return (value) => calculateEMI(value)
    }
    if (slug === 'discount-calculator') {
      return (value) => calculateDiscount(value)
    }
    if (slug === 'age-calculator') {
      return (value) => calculateAge(value)
    }
  }

  // Scientific conversions
  if (category === 'scientific') {
    if (slug === 'newtons-to-pounds-force') {
      return (value) => convertForce(value, 'n', 'lbf')
    }
    if (slug === 'hertz-to-rpm') {
      return (value) => convertFrequency(value, 'hz', 'rpm')
    }
    if (slug === 'mbps-to-gbps') {
      return (value) => convertDataRate(value, 'mbps', 'gbps')
    }
    if (slug === 'lumens-to-watts') {
      return (value) => convertLumensToWatts(value)
    }
  }

  // Energy category - watts to horsepower uses power conversion
  if (category === 'energy' && slug === 'watts-to-horsepower') {
    return (value) => convertPower(value, 'w', 'hp')
  }

  // Engineering conversions
  if (category === 'engineering') {
    if (slug === 'acceleration') {
      return (value, from, to) => convertAcceleration(value, from, to)
    }
    if (slug === 'angular-velocity') {
      return (value, from, to) => convertAngularVelocity(value, from, to)
    }
    if (slug === 'density') {
      return (value, from, to) => convertDensity(value, from, to)
    }
    if (slug === 'torque') {
      return (value, from, to) => convertTorque(value, from, to)
    }
    if (slug === 'flow-rate') {
      return (value, from, to) => convertFlowRate(value, from, to)
    }
    if (slug === 'mass-flow') {
      return (value, from, to) => convertMassFlow(value, from, to)
    }
    if (slug === 'viscosity-dynamic') {
      return (value, from, to) => convertViscosityDynamic(value, from, to)
    }
    if (slug === 'viscosity-kinematic') {
      return (value, from, to) => convertViscosityKinematic(value, from, to)
    }
    if (slug === 'concentration') {
      return (value, from, to) => convertConcentration(value, from, to)
    }
  }

  // Electrical conversions
  if (category === 'electrical') {
    if (slug === 'charge') {
      return (value, from, to) => convertCharge(value, from, to)
    }
    if (slug === 'current') {
      return (value, from, to) => convertCurrent(value, from, to)
    }
    if (slug === 'voltage') {
      return (value, from, to) => convertVoltage(value, from, to)
    }
    if (slug === 'resistance') {
      return (value, from, to) => convertResistance(value, from, to)
    }
    if (slug === 'capacitance') {
      return (value, from, to) => convertCapacitance(value, from, to)
    }
    if (slug === 'inductance') {
      return (value, from, to) => convertInductance(value, from, to)
    }
    if (slug === 'conductance') {
      return (value, from, to) => convertConductance(value, from, to)
    }
    if (slug === 'electric-field') {
      return (value, from, to) => convertElectricField(value, from, to)
    }
  }

  // Thermal conversions
  if (category === 'thermal') {
    if (slug === 'temperature-interval') {
      return (value, from, to) => convertTemperatureInterval(value, from, to)
    }
    if (slug === 'thermal-conductivity') {
      return (value, from, to) => convertThermalConductivity(value, from, to)
    }
    if (slug === 'specific-heat') {
      return (value, from, to) => convertSpecificHeat(value, from, to)
    }
    if (slug === 'heat-flux') {
      return (value, from, to) => convertHeatFlux(value, from, to)
    }
    if (slug === 'thermal-resistance') {
      return (value, from, to) => convertThermalResistance(value, from, to)
    }
    if (slug === 'heat-transfer-coefficient') {
      return (value, from, to) => convertHeatTransfer(value, from, to)
    }
  }

  // Light & Optics conversions
  if (category === 'light') {
    if (slug === 'luminance') {
      return (value, from, to) => convertLuminance(value, from, to)
    }
    if (slug === 'illuminance') {
      return (value, from, to) => convertIlluminance(value, from, to)
    }
    if (slug === 'image-resolution') {
      return (value, from, to) => convertResolution(value, from, to)
    }
    if (slug === 'wavelength-frequency') {
      return (value, from, to) => convertLightWavelength(value, from, to)
    }
  }

  // Sound conversions
  if (category === 'sound') {
    if (slug === 'frequency') {
      return (value, from, to) => {
        const converted = convertSoundFrequency(value, from, to)
        const note = frequencyToNote(value)
        return note ? `${converted} (${note})` : converted
      }
    }
    if (slug === 'sound-wavelength') {
      return (value, from, to) => convertSoundWavelength(value, from, to)
    }
    if (slug === 'decibel-converter') {
      return (value, from, to) => convertDecibel(value, from, to)
    }
  }

  // Magnetism conversions
  if (category === 'magnetism') {
    if (slug === 'magnetic-flux') {
      return (value, from, to) => convertMagneticFlux(value, from, to)
    }
    if (slug === 'flux-density') {
      return (value, from, to) => convertFluxDensity(value, from, to)
    }
    if (slug === 'magnetic-field') {
      return (value, from, to) => convertMagneticField(value, from, to)
    }
  }

  // Radiation conversions
  if (category === 'radiation') {
    if (slug === 'radioactivity') {
      return (value, from, to) => convertRadioactivity(value, from, to)
    }
    if (slug === 'absorbed-dose') {
      return (value, from, to) => convertAbsorbedDose(value, from, to)
    }
    if (slug === 'equivalent-dose') {
      return (value, from, to) => convertEquivalentDose(value, from, to)
    }
  }

  // Numbers & Math conversions
  if (category === 'numbers') {
    if (slug === 'fractions-decimals') {
      return (value, from, to) => convertFractionDecimal(value, from, to)
    }
    if (slug === 'scientific-notation') {
      return (value, from, to) => convertScientificNotation(value, to)
    }
    if (slug === 'significant-figures') {
      // Default to 3 sig figs
      return (value) => roundToSigFigs(value, 3)
    }
  }

  return null
}

function ConverterPage({ converter, category }) {
  const breadcrumbs = [
    { label: 'Home', href: '/' },
    { label: category.name, href: `/${category.slug}` },
    { label: converter.name },
  ]

  const structuredData = generateConverterStructuredData(converter, category.name)

  // Get the appropriate conversion function
  let convertFn
  if (category.slug === 'programmer') {
    convertFn = getProgrammerConvert(converter.slug)
  } else {
    // First check for special converters (fuel, fitness, cooking, misc)
    convertFn = getSpecialConvert(category.slug, converter.slug, converter.fromUnit.id, converter.toUnit.id)

    // If no special converter, use the standard category converter
    if (!convertFn) {
      const baseFn = getConvertFunction(category.slug, converter.fromUnit.id, converter.toUnit.id)
      if (baseFn) {
        // IMPORTANT: Must accept from/to parameters from ConverterCard for swap to work
        convertFn = (value, from, to) => baseFn(value, from, to)
      }
    }
  }

  // Find related converters
  const relatedConverters = allConverters
    .filter(c =>
      c.categorySlug === category.slug &&
      c.slug !== converter.slug
    )
    .slice(0, 4)

  return (
    <>
      <SEOHead
        title={`${converter.name} - Fast & Accurate | convert.kpruthvi.com`}
        description={converter.description}
        keywords={`${converter.fromUnit.name.toLowerCase()} to ${converter.toUnit.name.toLowerCase()}, ${converter.name.toLowerCase()}, unit converter, convert ${converter.fromUnit.symbol} to ${converter.toUnit.symbol}`}
        canonicalPath={`/${category.slug}/${converter.slug}`}
        structuredData={structuredData}
        breadcrumbs={breadcrumbs}
      />

      <div className="converter-page container">
        <Breadcrumbs items={breadcrumbs} />

        <header className="converter-header">
          <h1 className="converter-title">{converter.name}</h1>
          <p className="converter-description">{converter.description}</p>
        </header>

        {/* Main Converter */}
        <ConverterCard
          fromUnit={converter.fromUnit}
          toUnit={converter.toUnit}
          convert={convertFn || (() => '')}
        />

        {/* How to Convert */}
        <section className="converter-section">
          <h2>How to Convert {converter.fromUnit.name} to {converter.toUnit.name}</h2>
          <p>
            To convert {converter.fromUnit.name.toLowerCase()} to {converter.toUnit.name.toLowerCase()}, use the following formula:
          </p>
          <div className="formula-box">
            <code>{converter.formula}</code>
          </div>
        </section>

        {/* Common Conversions */}
        <section className="converter-section">
          <h2>Common {converter.fromUnit.name} to {converter.toUnit.name} Conversions</h2>
          <div className="common-conversions">
            <table className="conversions-table">
              <thead>
                <tr>
                  <th>{converter.fromUnit.name} ({converter.fromUnit.symbol})</th>
                  <th>{converter.toUnit.name} ({converter.toUnit.symbol})</th>
                </tr>
              </thead>
              <tbody>
                {converter.commonConversions.map((item, index) => (
                  <tr key={index}>
                    <td>{item.from}</td>
                    <td>{item.to}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* Related Converters */}
        {relatedConverters.length > 0 && (
          <section className="converter-section">
            <h2>Related Converters</h2>
            <div className="related-grid">
              {relatedConverters.map(related => (
                <Link
                  key={related.path}
                  to={related.path}
                  className="related-card"
                >
                  <span className="related-name">{related.name}</span>
                  <span className="related-units">
                    {related.fromUnit.symbol} → {related.toUnit.symbol}
                  </span>
                </Link>
              ))}
            </div>
          </section>
        )}
      </div>
    </>
  )
}

export default ConverterPage
