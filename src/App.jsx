import { lazy, Suspense } from 'react'
import { Routes, Route } from 'react-router-dom'
import Layout from './components/Layout/Layout'
import HomePage from './pages/HomePage'
import CategoryPage from './pages/CategoryPage'
import ConverterPage from './pages/ConverterPage'
import ErrorBoundary from './components/ErrorBoundary'
import { categories } from './data/converterRoutes'

// Lazy load less frequently accessed pages
const AllCategoriesPage = lazy(() => import('./pages/AllCategoriesPage'))
const PrivacyPage = lazy(() => import('./pages/PrivacyPage'))
const NotFound = lazy(() => import('./pages/NotFound'))

// Lazy load special pages (custom UIs)
const CurrencyPage = lazy(() => import('./pages/CurrencyPage'))

// Loading fallback
const PageLoader = () => (
  <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--color-text-muted)' }}>
    Loading...
  </div>
)

function App() {
  return (
    <ErrorBoundary>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<HomePage />} />
          <Route path="categories" element={<Suspense fallback={<PageLoader />}><AllCategoriesPage /></Suspense>} />
          <Route path="privacy" element={<Suspense fallback={<PageLoader />}><PrivacyPage /></Suspense>} />

          {/* Special pages with custom UIs */}
          <Route path="currency" element={<Suspense fallback={<PageLoader />}><CurrencyPage /></Suspense>} />
          <Route path="currency/:pair" element={<Suspense fallback={<PageLoader />}><CurrencyPage /></Suspense>} />

          {/* Dynamic category and converter routes */}
          {categories.map(category => (
            <Route key={category.slug} path={category.slug}>
              <Route index element={<CategoryPage category={category} />} />
              {category.converters.map(converter => (
                <Route
                  key={converter.slug}
                  path={converter.slug}
                  element={<ConverterPage converter={converter} category={category} />}
                />
              ))}
            </Route>
          ))}

          <Route path="*" element={<Suspense fallback={<PageLoader />}><NotFound /></Suspense>} />
        </Route>
      </Routes>
    </ErrorBoundary>
  )
}

export default App
