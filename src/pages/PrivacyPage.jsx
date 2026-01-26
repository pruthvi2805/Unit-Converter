import { Link } from 'react-router-dom'
import SEOHead from '../components/SEOHead/SEOHead'
import './PrivacyPage.css'

function PrivacyPage() {
  const breadcrumbs = [
    { label: 'Home', href: '/' },
    { label: 'Privacy' },
  ]

  return (
    <>
      <SEOHead
        title="Privacy Policy - Convert"
        description="Convert processes all data locally in your browser. Nothing is ever sent to any server. Learn about our privacy practices."
        keywords="privacy policy, data protection, local processing, no tracking"
        canonicalPath="/privacy"
        breadcrumbs={breadcrumbs}
      />

      <div className="privacy-page container">
        <div className="privacy-header">
          <div className="privacy-icon">
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
              <path d="M9 12l2 2 4-4" />
            </svg>
          </div>
          <h1 className="privacy-title">Privacy Policy</h1>
          <p className="privacy-subtitle">Your data stays on your device</p>
        </div>

        <div className="privacy-content">
          <section className="privacy-highlight">
            <p>
              <strong>The Short Version:</strong> Convert processes all data locally in your browser.
              Nothing is ever sent to any server.
            </p>
          </section>

          <section className="privacy-section">
            <h2>What We Don't Collect</h2>
            <ul className="privacy-list">
              <li>
                <svg className="check-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
                <span>Your input values and conversion results</span>
              </li>
              <li>
                <svg className="check-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
                <span>Personal information of any kind</span>
              </li>
              <li>
                <svg className="check-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
                <span>Analytics, telemetry, or tracking cookies</span>
              </li>
              <li>
                <svg className="check-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
                <span>IP addresses or location data</span>
              </li>
              <li>
                <svg className="check-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
                <span>Usage patterns or behavior data</span>
              </li>
            </ul>
          </section>

          <section className="privacy-section">
            <h2>How It Works</h2>
            <p>
              Convert is a static website that runs entirely in your browser. When you enter values
              for conversion, the calculations happen locally using JavaScript on your device.
              No data is transmitted to any server.
            </p>
            <p>
              Whether you're converting kilometers to miles, calculating BMI, or encoding Base64,
              all processing stays on your machine. The site works offline too - once loaded,
              you don't even need an internet connection.
            </p>
          </section>

          <section className="privacy-section">
            <h2>Local Storage</h2>
            <p>
              We use browser local storage only for:
            </p>
            <ul className="privacy-list simple">
              <li>Remembering your theme preference (dark/light mode)</li>
              <li>Storing recent search history (stays on your device)</li>
              <li>PWA install prompt dismissal state</li>
            </ul>
            <p>
              This data never leaves your browser and can be cleared at any time through
              your browser settings.
            </p>
          </section>

          <section className="privacy-section">
            <h2>Third-Party Services</h2>
            <p>
              The only external resources loaded are:
            </p>
            <ul className="privacy-list simple">
              <li><strong>Google Fonts</strong> - For typography (Inter font family)</li>
              <li><strong>Cloudflare Pages</strong> - Hosts the website files</li>
            </ul>
            <p>
              No analytics, no tracking pixels, no advertising scripts.
            </p>
          </section>

          <section className="privacy-section">
            <h2>Open Source</h2>
            <p>
              Convert is open source. You can review the code yourself on{' '}
              <a
                href="https://github.com/pruthvi2805/convert"
                target="_blank"
                rel="noopener noreferrer"
              >
                GitHub
              </a>
              {' '}to verify these privacy practices.
            </p>
          </section>

          <section className="privacy-section">
            <h2>Questions?</h2>
            <p>
              If you have any questions about this privacy policy, feel free to{' '}
              <a
                href="https://kpruthvi.com/contact"
                target="_blank"
                rel="noopener noreferrer"
              >
                contact me
              </a>.
            </p>
          </section>

          <div className="privacy-back">
            <Link to="/" className="back-link">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="19" y1="12" x2="5" y2="12" />
                <polyline points="12 19 5 12 12 5" />
              </svg>
              Back to Convert
            </Link>
          </div>
        </div>
      </div>
    </>
  )
}

export default PrivacyPage
