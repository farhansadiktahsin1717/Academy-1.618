import { Link } from 'react-router-dom'
import Icon from './Icon'

const footerLinks = [
  { label: 'Home', to: '/' },
  { label: 'About', to: '/about' },
  { label: 'Contact', to: '/contact' },
  { label: 'Dashboard', to: '/dashboard' },
]

function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="footer-grid">
        <div className="footer-brand">
          <div className="brand-mark">
            <Icon name="sparkle" />
          </div>
          <div>
            <strong>Academy 1.618</strong>
            <p>
              A modern academy platform that brings discovery, enrollment, payments, and role-based dashboards into one
              polished experience.
            </p>
          </div>
        </div>

        <div>
          <h3>Explore</h3>
          <div className="footer-links">
            {footerLinks.map((link) => (
              <Link key={link.to} to={link.to}>
                {link.label}
              </Link>
            ))}
          </div>
        </div>

        <div>
          <h3>Contact</h3>
          <div className="footer-links">
            <a href="mailto:hello@academy1618.edu">hello@academy1618.edu</a>
            <a href="tel:+8801900618618">+880 1900-618-618</a>
            <span>Dhaka, Bangladesh</span>
          </div>
        </div>
      </div>

      <div className="footer-bar">
        <p>(c) {new Date().getFullYear()} Academy 1.618. Built with React, Django, and a strong focus on learner flow.</p>
      </div>
    </footer>
  )
}

export default SiteFooter
