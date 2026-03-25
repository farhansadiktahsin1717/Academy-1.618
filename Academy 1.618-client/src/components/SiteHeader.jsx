import { useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import { Link, NavLink, useLocation } from 'react-router-dom'
import Icon from './Icon'
import ThemeToggle from './ThemeToggle'

const navLinks = [
  { label: 'Home', to: '/' },
  { label: 'About', to: '/about' },
  { label: 'Contact', to: '/contact' },
  { label: 'Dashboard', to: '/dashboard' },
]

function SiteHeader({ isAuthenticated, onLogout, onToggleTheme, theme }) {
  const location = useLocation()
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  useEffect(() => {
    setIsMenuOpen(false)
  }, [location.pathname, location.hash])

  return (
    <header className="site-header">
      <div className="nav-bar">
        <Link className="logo" to="/">
          <span>Academy 1.618</span>
          <small>Learning Platform</small>
        </Link>

        <button
          aria-expanded={isMenuOpen}
          aria-label="Toggle navigation"
          className="menu-toggle"
          onClick={() => setIsMenuOpen((current) => !current)}
          type="button"
        >
          <Icon name={isMenuOpen ? 'close' : 'menu'} />
        </button>

        <nav className={isMenuOpen ? 'site-nav open' : 'site-nav'}>
          {navLinks.map((link) => (
            <NavLink
              key={link.to}
              className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}
              to={link.to}
            >
              {link.label}
            </NavLink>
          ))}
        </nav>

        <div className={`header-actions ${isMenuOpen ? 'open' : ''}`}>
          <ThemeToggle onToggleTheme={onToggleTheme} theme={theme} />
          {isAuthenticated ? (
            <button className="ghost" onClick={onLogout}>
              Logout
            </button>
          ) : (
            <Link className="ghost" to="/contact">
              Contact
            </Link>
          )}
          <Link className="primary" to="/">
            Start Learning
          </Link>
        </div>
      </div>
    </header>
  )
}

SiteHeader.propTypes = {
  isAuthenticated: PropTypes.bool.isRequired,
  onLogout: PropTypes.func.isRequired,
  onToggleTheme: PropTypes.func.isRequired,
  theme: PropTypes.oneOf(['light', 'dark']).isRequired,
}
export default SiteHeader

