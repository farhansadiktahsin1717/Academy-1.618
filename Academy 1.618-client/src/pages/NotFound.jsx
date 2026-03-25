import { Link } from 'react-router-dom'

function NotFound() {
  return (
    <main className="page-stack">
      <section className="not-found-card">
        <p className="eyebrow">404</p>
        <h1>The page you requested does not exist.</h1>
        <p>
          The route may have changed during the redesign. Use the navigation to get back to the main experience or jump
          straight to the homepage.
        </p>
        <div className="hero-actions">
          <Link className="primary" to="/">
            Return Home
          </Link>
          <Link className="ghost" to="/contact">
            Contact
          </Link>
        </div>
      </section>
    </main>
  )
}

export default NotFound
