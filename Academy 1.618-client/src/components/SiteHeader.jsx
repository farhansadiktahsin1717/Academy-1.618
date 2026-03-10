import { Link } from 'react-router-dom'
import PropTypes from 'prop-types'

function SiteHeader({ isAuthenticated, onLogout }) {
  return (
    <header className="site-header">
      <div className="top-bar">
        <p>Call Us: +880 1900-618-618</p>
        <p>Email: hello@academy1618.edu</p>
      </div>
      <div className="nav-bar">
        <Link className="logo" to="/">
          <span>Academy 1.618</span>
          <small>Education Hub</small>
        </Link>
        <nav>
          <a href="/#home">Home</a>
          <a href="/#about">About</a>
          <a href="/#courses">Courses</a>
          <a href="/#events">Events</a>
          <a href="/#insights">Stories</a>
          <Link to="/dashboard">Dashboards</Link>
        </nav>
        <div className="header-actions">
          {isAuthenticated ? (
            <button className="ghost" onClick={onLogout}>
              Logout
            </button>
          ) : (
            <a className="ghost" href="/#apply">
              Login
            </a>
          )}
          <a className="primary" href="/#apply">
            Apply Now
          </a>
        </div>
      </div>
    </header>
  )
}

SiteHeader.propTypes = {
  isAuthenticated: PropTypes.bool.isRequired,
  onLogout: PropTypes.func.isRequired,
}
export default SiteHeader

