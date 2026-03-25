import { useMemo, useState } from 'react'
import PropTypes from 'prop-types'
import { Link } from 'react-router-dom'
import Icon from '../components/Icon'

const highlights = [
  {
    icon: 'graduation',
    title: 'Cohort-ready learning',
    description: 'Clear pathways, structured schedules, and mentor-led sessions help learners keep momentum from week one.',
  },
  {
    icon: 'chart',
    title: 'Real operational visibility',
    description: 'Students, teachers, and admins each get a focused dashboard instead of one cluttered experience for everyone.',
  },
  {
    icon: 'shield',
    title: 'Trusted payment flow',
    description: 'Enrollment checkout connects directly to the existing payment API so the public site and platform stay aligned.',
  },
]

const steps = [
  {
    step: '01',
    title: 'Explore the catalog',
    description: 'Browse live course data, filter by priority, and quickly compare pricing, departments, and level.',
  },
  {
    step: '02',
    title: 'Create your account',
    description: 'Register as a student or teacher, then use the same account across admission, dashboards, and checkout.',
  },
  {
    step: '03',
    title: 'Enroll and track progress',
    description: 'Complete payment, access your role-based workspace, and monitor progress through a single interface.',
  },
]

const trustPoints = [
  'Live courses',
  'Role-based dashboards',
  'Integrated payments',
]

function SkeletonCard() {
  return (
    <article className="course-card skeleton-card" aria-hidden="true">
      <span className="skeleton skeleton-line short" />
      <span className="skeleton skeleton-title" />
      <span className="skeleton skeleton-line" />
      <span className="skeleton skeleton-line" />
      <div className="card-foot">
        <span className="skeleton skeleton-chip" />
        <span className="skeleton skeleton-button" />
      </div>
    </article>
  )
}

function Home({
  checkoutCourse,
  checkoutForm,
  courses,
  enrollmentByCourse,
  featuredCourses,
  isAuthenticated,
  isAuthSubmitting,
  isCheckoutSubmitting,
  isCoursesLoading,
  onAuthFormChange,
  onCheckoutFormChange,
  onLogin,
  onLogout,
  onOrderingChange,
  onPaymentInit,
  onRegister,
  onSearchChange,
  openCheckout,
  ordering,
  search,
  setCheckoutCourse,
  user,
}) {
  const [authMode, setAuthMode] = useState('login')

  const emptyState = useMemo(() => {
    if (isCoursesLoading) {
      return ''
    }

    if (search.trim()) {
      return 'No courses match this search yet.'
    }

    return 'Courses will appear here as soon as they are published.'
  }, [isCoursesLoading, search])

  return (
    <main className="page-stack">
      <section className="hero-panel">
        <div className="hero-copy">
          <p className="eyebrow">Academy 1.618</p>
          <h1>Learn, enroll, and manage the entire academy journey from one modern platform.</h1>
          <p className="hero-lead">
            This landing page was rebuilt to present the project like a product, not just a demo. It introduces the
            academy clearly, highlights the full-stack feature set, and connects directly to the live course and payment
            APIs already in the app.
          </p>
          <div className="hero-actions">
            <a className="primary" href="#catalog">
              Explore Courses
            </a>
            <Link className="ghost" to="/about">
              About the Platform
            </Link>
          </div>
          <div className="trust-list">
            {trustPoints.map((point) => (
              <div key={point} className="trust-item">
                <p>{point}</p>
              </div>
            ))}
          </div>
        </div>

        <aside className="hero-card">
          <div className="hero-card-top">
            <p className="eyebrow">Platform Snapshot</p>
            <strong>Full-stack academy management</strong>
          </div>
          <div className="hero-metrics">
            <article>
              <span>{courses.length}</span>
              <p>Live Courses</p>
            </article>
            <article>
              <span>{Object.keys(enrollmentByCourse).length}</span>
              <p>Your Enrollments</p>
            </article>
            <article>
              <span>{isAuthenticated ? 'On' : 'Off'}</span>
              <p>Account Access</p>
            </article>
          </div>
          <div className="hero-card-bottom">
            <p>The public site now leads naturally into dashboards, authentication, and checkout instead of feeling disconnected.</p>
            <Link className="inline-link" to="/dashboard">
              Open dashboard overview
              <Icon name="arrowRight" size={18} />
            </Link>
          </div>
        </aside>
      </section>

      <section>
        <div className="section-head">
          <div className="section-copy">
            <p className="eyebrow">Highlights</p>
            <h2>Focused features with a cleaner product feel.</h2>
          </div>
        </div>
        <div className="feature-grid">
          {highlights.map((item) => (
            <article key={item.title} className="feature-card">
              <div className="feature-icon">
                <Icon name={item.icon} />
              </div>
              <h3>{item.title}</h3>
              <p>{item.description}</p>
            </article>
          ))}
        </div>
      </section>

      <section>
        <div className="section-head">
          <div className="section-copy">
            <p className="eyebrow">How It Works</p>
            <h2>A simple three-step flow from discovery to delivery.</h2>
          </div>
        </div>
        <div className="steps-grid">
          {steps.map((item) => (
            <article key={item.step} className="step-card">
              <span className="step-badge">{item.step}</span>
              <h3>{item.title}</h3>
              <p>{item.description}</p>
            </article>
          ))}
        </div>
      </section>

      <section>
        <div className="section-head">
          <div className="section-copy">
            <p className="eyebrow">Featured</p>
            <h2>Flagship courses pulled from the real backend.</h2>
          </div>
          <Link className="ghost" to="/contact">
            Book a demo
          </Link>
        </div>
        <div className="course-grid featured-grid">
          {featuredCourses.map((course) => (
            <article key={course.id} className="course-card featured-course-card">
              <p className="course-tag">{course.department || 'General Studies'}</p>
              <h3>{course.title}</h3>
              <p>{course.description}</p>
              <div className="card-foot">
                <strong>BDT {Number(course.price || 0).toFixed(2)}</strong>
                {enrollmentByCourse[course.id] ? (
                  <span className="status-pill success">Enrolled</span>
                ) : (
                  <button className="secondary-button" onClick={() => openCheckout(course)} type="button">
                    Enroll
                  </button>
                )}
              </div>
            </article>
          ))}
          {!featuredCourses.length && !isCoursesLoading && <p className="empty-copy">No featured courses are available yet.</p>}
        </div>
      </section>

      <section id="catalog">
        <div className="section-head">
          <div className="section-copy">
            <p className="eyebrow">Live Catalog</p>
            <h2>Search and filter the academy catalog.</h2>
          </div>
          <div className="catalog-filters">
            <label className="field">
              <span>Search</span>
              <input
                aria-label="Search courses"
                onChange={(event) => onSearchChange(event.target.value)}
                placeholder="Search by title or topic"
                type="search"
                value={search}
              />
            </label>
            <label className="field">
              <span>Sort</span>
              <select onChange={(event) => onOrderingChange(event.target.value)} value={ordering}>
                <option value="-created_at">Newest First</option>
                <option value="title">Title A-Z</option>
                <option value="price">Lowest Price</option>
                <option value="-price">Highest Price</option>
              </select>
            </label>
          </div>
        </div>

        <div className="course-grid">
          {isCoursesLoading && Array.from({ length: 6 }, (_, index) => <SkeletonCard key={index} />)}
          {!isCoursesLoading &&
            courses.map((course) => {
              const isEnrolled = Boolean(enrollmentByCourse[course.id])

              return (
                <article key={course.id} className="course-card">
                  <p className="course-tag">{course.department || 'General Studies'}</p>
                  <h3>{course.title}</h3>
                  <p>{course.description}</p>
                  <div className="course-meta">
                    <span>{course.level || 'All Levels'}</span>
                    <span>API Connected</span>
                  </div>
                  <div className="card-foot">
                    <strong>BDT {Number(course.price || 0).toFixed(2)}</strong>
                    {isEnrolled ? (
                      <span className="status-pill success">Enrolled</span>
                    ) : (
                      <button className="secondary-button" onClick={() => openCheckout(course)} type="button">
                        Buy Course
                      </button>
                    )}
                  </div>
                </article>
              )
            })}
        </div>

        {!isCoursesLoading && !courses.length && <p className="empty-copy">{emptyState}</p>}
      </section>

      {checkoutCourse && (
        <section>
          <div className="section-head">
            <div>
              <p className="eyebrow">Checkout</p>
              <h2>{checkoutCourse.title}</h2>
            </div>
            <button className="ghost" onClick={() => setCheckoutCourse(null)} type="button">
              Close
            </button>
          </div>
          <div className="checkout-grid">
            <article className="checkout-summary">
              <p>
                You are about to initiate payment for a real course item in the platform. This keeps the landing page tied
                directly to the backend purchase flow instead of acting like a disconnected mockup.
              </p>
              <div className="summary-total">
                <span>Total</span>
                <strong>BDT {Number(checkoutCourse.price || 0).toFixed(2)}</strong>
              </div>
            </article>

            <form className="surface-form" onSubmit={onPaymentInit}>
              <label className="field">
                <span>Full Name</span>
                <input
                  name="customer_name"
                  onChange={onCheckoutFormChange}
                  placeholder="Your full name"
                  required
                  value={checkoutForm.customer_name}
                />
              </label>
              <label className="field">
                <span>Phone Number</span>
                <input
                  name="customer_phone"
                  onChange={onCheckoutFormChange}
                  placeholder="Your phone number"
                  required
                  value={checkoutForm.customer_phone}
                />
              </label>
              <label className="field">
                <span>Address</span>
                <textarea
                  name="customer_address"
                  onChange={onCheckoutFormChange}
                  placeholder="Billing address"
                  required
                  rows="4"
                  value={checkoutForm.customer_address}
                />
              </label>
              <button className="primary" disabled={isCheckoutSubmitting} type="submit">
                {isCheckoutSubmitting ? 'Preparing payment...' : 'Proceed to Payment'}
              </button>
            </form>
          </div>
        </section>
      )}

      <section id="apply">
        <div className="section-head">
          <div className="section-copy">
            <p className="eyebrow">Access</p>
            <h2>Log in or register to unlock the platform.</h2>
          </div>
          {user && (
            <div className="signed-in-chip">
              <span>Signed in as {user.email}</span>
            </div>
          )}
        </div>

        <div className="auth-grid">
          <article className="auth-copy">
            <h3>One account, multiple roles.</h3>
            <p>
              Students can track progress, teachers can review teaching assignments, and admins can monitor commercial
              performance. The public pages now connect naturally into that same system.
            </p>
            <div className="bullet-list">
              <div>
                <Icon name="graduation" />
                <span>Student dashboard with progress updates</span>
              </div>
              <div>
                <Icon name="chart" />
                <span>Teacher and admin workspaces</span>
              </div>
              <div>
                <Icon name="shield" />
                <span>Token-based authentication and guarded actions</span>
              </div>
            </div>
            {isAuthenticated && (
              <div className="hero-actions">
                <Link className="ghost" to="/dashboard">
                  Open Dashboard
                </Link>
                <button className="secondary-button" onClick={onLogout} type="button">
                  Logout
                </button>
              </div>
            )}
          </article>

          <aside className="auth-card">
            <div className="tabs">
              <button
                className={authMode === 'login' ? 'active' : ''}
                onClick={() => setAuthMode('login')}
                type="button"
              >
                Login
              </button>
              <button
                className={authMode === 'register' ? 'active' : ''}
                onClick={() => setAuthMode('register')}
                type="button"
              >
                Register
              </button>
            </div>
            <form className="surface-form" onSubmit={authMode === 'login' ? onLogin : onRegister}>
              <label className="field">
                <span>Email</span>
                <input name="email" onChange={onAuthFormChange} placeholder="name@example.com" required type="email" />
              </label>
              <label className="field">
                <span>Password</span>
                <input name="password" onChange={onAuthFormChange} placeholder="Enter password" required type="password" />
              </label>
              {authMode === 'register' && (
                <>
                  <label className="field">
                    <span>Confirm Password</span>
                    <input
                      name="re_password"
                      onChange={onAuthFormChange}
                      placeholder="Repeat password"
                      required
                      type="password"
                    />
                  </label>
                  <div className="split-fields">
                    <label className="field">
                      <span>First Name</span>
                      <input name="first_name" onChange={onAuthFormChange} placeholder="First name" type="text" />
                    </label>
                    <label className="field">
                      <span>Last Name</span>
                      <input name="last_name" onChange={onAuthFormChange} placeholder="Last name" type="text" />
                    </label>
                  </div>
                  <label className="field">
                    <span>Role</span>
                    <select defaultValue="student" name="role" onChange={onAuthFormChange}>
                      <option value="student">Student</option>
                      <option value="teacher">Teacher</option>
                    </select>
                  </label>
                </>
              )}
              <button className="primary" disabled={isAuthSubmitting} type="submit">
                {isAuthSubmitting ? 'Submitting...' : authMode === 'login' ? 'Access Dashboard' : 'Create Account'}
              </button>
            </form>
          </aside>
        </div>
      </section>
    </main>
  )
}

Home.propTypes = {
  checkoutCourse: PropTypes.shape({
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    title: PropTypes.string,
    price: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  }),
  checkoutForm: PropTypes.shape({
    customer_address: PropTypes.string,
    customer_name: PropTypes.string,
    customer_phone: PropTypes.string,
  }).isRequired,
  courses: PropTypes.arrayOf(
    PropTypes.shape({
      department: PropTypes.string,
      description: PropTypes.string,
      id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
      level: PropTypes.string,
      price: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
      title: PropTypes.string,
    }),
  ).isRequired,
  enrollmentByCourse: PropTypes.objectOf(PropTypes.object).isRequired,
  featuredCourses: PropTypes.arrayOf(
    PropTypes.shape({
      department: PropTypes.string,
      description: PropTypes.string,
      id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
      price: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
      title: PropTypes.string,
    }),
  ).isRequired,
  isAuthenticated: PropTypes.bool.isRequired,
  isAuthSubmitting: PropTypes.bool.isRequired,
  isCheckoutSubmitting: PropTypes.bool.isRequired,
  isCoursesLoading: PropTypes.bool.isRequired,
  onAuthFormChange: PropTypes.func.isRequired,
  onCheckoutFormChange: PropTypes.func.isRequired,
  onLogin: PropTypes.func.isRequired,
  onLogout: PropTypes.func.isRequired,
  onOrderingChange: PropTypes.func.isRequired,
  onPaymentInit: PropTypes.func.isRequired,
  onRegister: PropTypes.func.isRequired,
  onSearchChange: PropTypes.func.isRequired,
  openCheckout: PropTypes.func.isRequired,
  ordering: PropTypes.string.isRequired,
  search: PropTypes.string.isRequired,
  setCheckoutCourse: PropTypes.func.isRequired,
  user: PropTypes.shape({
    email: PropTypes.string,
  }),
}

export default Home
