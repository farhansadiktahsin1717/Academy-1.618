import { useEffect } from 'react'
import PropTypes from 'prop-types'
import { Outlet, useLocation } from 'react-router-dom'
import SiteFooter from './SiteFooter'
import SiteHeader from './SiteHeader'

function SiteLayout({ isAuthenticated, notice, onClearNotice, onLogout, onToggleTheme, theme }) {
  const location = useLocation()

  useEffect(() => {
    if (location.hash) {
      const id = location.hash.replace('#', '')
      const element = document.getElementById(id)
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'start' })
        return
      }
    }

    window.scrollTo({ top: 0, behavior: 'smooth' })
  }, [location])

  return (
    <div className="app-shell">
      <SiteHeader
        isAuthenticated={isAuthenticated}
        onLogout={onLogout}
        onToggleTheme={onToggleTheme}
        theme={theme}
      />

      {notice.text && (
        <div className={`global-notice ${notice.type}`}>
          <p>{notice.text}</p>
          <button aria-label="Dismiss notice" onClick={onClearNotice} type="button">
            Close
          </button>
        </div>
      )}

      <Outlet />
      <SiteFooter />
    </div>
  )
}

SiteLayout.propTypes = {
  isAuthenticated: PropTypes.bool.isRequired,
  notice: PropTypes.shape({
    text: PropTypes.string,
    type: PropTypes.string,
  }).isRequired,
  onClearNotice: PropTypes.func.isRequired,
  onLogout: PropTypes.func.isRequired,
  onToggleTheme: PropTypes.func.isRequired,
  theme: PropTypes.oneOf(['light', 'dark']).isRequired,
}

export default SiteLayout
