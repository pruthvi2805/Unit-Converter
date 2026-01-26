import { Link } from 'react-router-dom'
import SEOHead from '../components/SEOHead/SEOHead'
import './NotFound.css'

function NotFound() {
  return (
    <>
      <SEOHead
        title="Page Not Found - 404"
        description="The page you're looking for doesn't exist. Browse our converters to find what you need."
        canonicalPath="/404"
      />

      <div className="not-found container">
        <div className="not-found-content">
          <div className="not-found-icon">
            <svg width="80" height="80" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <circle cx="12" cy="12" r="10" />
              <path d="M16 16s-1.5-2-4-2-4 2-4 2" />
              <line x1="9" y1="9" x2="9.01" y2="9" />
              <line x1="15" y1="9" x2="15.01" y2="9" />
            </svg>
          </div>
          <h1 className="not-found-title">404</h1>
          <p className="not-found-subtitle">Page Not Found</p>
          <p className="not-found-description">
            The converter you're looking for doesn't exist or may have been moved.
          </p>
          <div className="not-found-actions">
            <Link to="/" className="not-found-button primary">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                <polyline points="9 22 9 12 15 12 15 22" />
              </svg>
              Go Home
            </Link>
            <Link to="/categories" className="not-found-button">
              Browse Converters
            </Link>
          </div>
        </div>
      </div>
    </>
  )
}

export default NotFound
