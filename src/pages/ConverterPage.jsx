import { Link } from 'react-router-dom'
import Breadcrumbs from '../components/Breadcrumbs/Breadcrumbs'
import ConverterCard from '../components/ConverterCard/ConverterCard'
import SEOHead, { generateConverterStructuredData } from '../components/SEOHead/SEOHead'
import { getConverterHandler } from '../lib/converterHandlers'
import './ConverterPage.css'

function ConverterPage({ converter, category }) {
  const breadcrumbs = [
    { label: 'Home', href: '/' },
    { label: category.name, href: `/${category.slug}` },
    { label: converter.name },
  ]

  const handler = getConverterHandler(converter.handlerKey)
  const relatedConverters = category.converters
    .filter((item) => item.slug !== converter.slug)
    .slice(0, 4)

  const structuredData = generateConverterStructuredData(converter, category.name)
  const keywords = [
    converter.name,
    `${converter.fromUnit.name} to ${converter.toUnit.name}`,
    converter.categoryName,
    ...converter.searchAliases.slice(0, 6),
  ].join(', ')

  return (
    <>
      <SEOHead
        title={converter.name}
        description={converter.description}
        keywords={keywords}
        canonicalPath={converter.path}
        structuredData={structuredData}
        breadcrumbs={breadcrumbs}
      />

      <div className="converter-page container">
        <Breadcrumbs items={breadcrumbs} />

        <header className="converter-hero">
          <div className="converter-hero-copy">
            <span className="converter-kicker">{category.name}</span>
            <h1 className="converter-title">{converter.name}</h1>
            <p className="converter-description">{converter.description}</p>
          </div>
          <div className="converter-hero-meta">
            <span className="converter-meta-pill">{converter.kind.replace(/_/g, ' ')}</span>
            <span className="converter-meta-pill">{converter.fromUnit.symbol} to {converter.toUnit.symbol || converter.toUnit.name}</span>
          </div>
        </header>

        <ConverterCard
          fromUnit={converter.fromUnit}
          toUnit={converter.toUnit}
          convert={handler?.convert || (() => '')}
          allowSwap={converter.supportsSwap}
          inputKind={converter.inputKind}
          inputPlaceholder={converter.inputPlaceholder}
          inputHelp={converter.inputHelp}
          exampleInputs={converter.inputExamples}
          validateInput={handler?.validate}
          resultSummary={handler?.resultSummary}
          emptyStateMessage={converter.emptyStateMessage}
          validationPatternDescription={converter.validationPatternDescription}
        />

        <section className="converter-section-grid">
          <section className="converter-panel-card">
            <h2>How this works</h2>
            <p>{converter.description}</p>
            <p>
              Start with <strong>{converter.fromUnit.name}</strong>, review the live result in{' '}
              <strong>{converter.toUnit.name}</strong>, then use the formula below to double-check the math.
            </p>
          </section>

          <section className="converter-panel-card">
            <h2>Formula</h2>
            <code className="converter-formula">{converter.formula}</code>
          </section>
        </section>

        <section className="converter-panel-card">
          <h2>Worked examples</h2>
          <div className="converter-examples-list">
            {converter.commonConversions.map((item) => (
              <div key={`${item.from}-${item.to}`} className="converter-example-row">
                <span>{item.from}</span>
                <span>{item.to}</span>
              </div>
            ))}
          </div>
        </section>

        {relatedConverters.length > 0 && (
          <section className="converter-panel-card">
            <div className="converter-section-heading">
              <h2>Related converters</h2>
              <Link to={`/${category.slug}`} className="converter-section-link">View all {category.name}</Link>
            </div>
            <div className="related-grid">
              {relatedConverters.map((item) => (
                <Link key={item.slug} to={item.path} className="related-card">
                  <span className="related-name">{item.name}</span>
                  <span className="related-copy">{item.description}</span>
                  <span className="related-units">{item.fromUnit.symbol} to {item.toUnit.symbol}</span>
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
