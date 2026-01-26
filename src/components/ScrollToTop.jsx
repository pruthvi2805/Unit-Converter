import { useEffect, useLayoutEffect } from 'react'
import { useLocation } from 'react-router-dom'

function ScrollToTop() {
  const { pathname } = useLocation()

  // Use useLayoutEffect to scroll before browser paints
  useLayoutEffect(() => {
    // Multiple scroll methods for better mobile compatibility
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' })
    document.documentElement.scrollTop = 0
    document.body.scrollTop = 0 // For Safari
  }, [pathname])

  return null
}

export default ScrollToTop
