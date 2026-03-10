import PropTypes from 'prop-types'
import { Link } from 'react-router-dom'

function DashboardOverview({ adminStats, courses, enrollments, isAdmin, isAuthenticated, isTeacher, user }) {
  const totalCourses = courses.length
  const activeEnrollments = enrollments.length
  const averageProgress = activeEnrollments
    ? Math.round(enrollments.reduce((sum, item) => sum + Number(item.progress || 0), 0) / activeEnrollments)
    : 0
  const weeklyPurchases = adminStats?.purchases_last_week ?? 0
  const monthlyPurchases = adminStats?.purchases_last_month ?? 0
  const monthlyRevenue = Number(adminStats?.total_sell_current_month || 0)
  const roleLabel = isAdmin ? 'Admin' : isTeacher ? 'Teacher' : isAuthenticated ? 'Student' : 'Guest'
  const spotlightCourse = courses[0]
  const recentEnrollments = enrollments.slice(0, 4)

  return (
    <main className="dashboard-overview">
      <section className="dash-overview-hero">
        <div className="dash-hero-copy">
          <p className="eyebrow">Dashboard Overview</p>
          <h1>Welcome back{user?.first_name ? `, ${user.first_name}` : ''}.</h1>
          <p>
            Your workspace is ready. Track enrollments, monitor revenue, and switch roles for the full academy
            experience.
          </p>
          <div className="dash-cta-row">
            <Link className="primary" to="/dashboard/workspace">
              Open Workspace
            </Link>
            {isAuthenticated ? (
              <Link className="ghost" to="/">
                Back to Home
              </Link>
            ) : (
              <a className="ghost" href="/#apply">
                Sign in to unlock
              </a>
            )}
          </div>
        </div>
        <div className="dash-hero-panel">
          <div className="dash-kpi-grid">
            <article className="dash-kpi">
              <p className="eyebrow">Active Enrollments</p>
              <strong>{activeEnrollments}</strong>
              <span className="muted">Avg progress {averageProgress}%</span>
            </article>
            <article className="dash-kpi">
              <p className="eyebrow">Total Courses</p>
              <strong>{totalCourses}</strong>
              <span className="muted">Published and draft</span>
            </article>
            <article className="dash-kpi">
              <p className="eyebrow">Monthly Revenue</p>
              <strong>BDT {monthlyRevenue.toFixed(2)}</strong>
              <span className="muted">Current month</span>
            </article>
            <article className="dash-kpi">
              <p className="eyebrow">Purchases 7 Days</p>
              <strong>{weeklyPurchases}</strong>
              <span className="muted">30 days: {monthlyPurchases}</span>
            </article>
          </div>
          <div className="dash-role-row">
            <span className="dash-role-pill">Role: {roleLabel}</span>
            <span className={`dash-role-pill ${isAuthenticated ? 'active' : ''}`}>
              {isAuthenticated ? 'Access enabled' : 'Access locked'}
            </span>
          </div>
        </div>
      </section>

      <section className="dash-overview-grid">
        <article className="dash-card">
          <div className="dash-card-head">
            <h3>Enrollment Pulse</h3>
            <span className="pill success">Live</span>
          </div>
          <p className="muted">
            {activeEnrollments
              ? `${averageProgress}% average progress across active cohorts.`
              : 'No enrollments yet. Publish a course or apply to get started.'}
          </p>
          <div className="dash-metric-row">
            <div>
              <p className="eyebrow">Avg Progress</p>
              <strong>{averageProgress}%</strong>
            </div>
            <div>
              <p className="eyebrow">Active</p>
              <strong>{activeEnrollments}</strong>
            </div>
          </div>
          <div className="dash-sparkline">
            <span />
            <span />
            <span />
            <span />
            <span />
            <span />
          </div>
        </article>

        <article className="dash-card">
          <div className="dash-card-head">
            <h3>Spotlight Course</h3>
            <span className="pill">Featured</span>
          </div>
          {spotlightCourse ? (
            <>
              <p className="eyebrow">{spotlightCourse.department || 'Discipline'}</p>
              <h4>{spotlightCourse.title}</h4>
              <p className="muted">{spotlightCourse.description}</p>
              <div className="dash-metric-row">
                <div>
                  <p className="eyebrow">Price</p>
                  <strong>BDT {Number(spotlightCourse.price || 0).toFixed(2)}</strong>
                </div>
                <div>
                  <p className="eyebrow">Level</p>
                  <strong>{spotlightCourse.level || 'Mixed'}</strong>
                </div>
              </div>
            </>
          ) : (
            <p className="muted">No courses yet. Create your first program to highlight it here.</p>
          )}
        </article>

        <article className="dash-card">
          <div className="dash-card-head">
            <h3>Recent Enrollments</h3>
            <Link className="ghost" to="/dashboard/workspace">
              Manage
            </Link>
          </div>
          <ul className="dash-list">
            {recentEnrollments.map((entry) => (
              <li key={entry.id}>
                <div>
                  <p className="eyebrow">{entry.course_title}</p>
                  <p className="muted">{entry.customer_name || entry.student_email}</p>
                </div>
                <strong>BDT {Number(entry.amount_paid || 0).toFixed(2)}</strong>
              </li>
            ))}
            {recentEnrollments.length === 0 && <li className="muted">No enrollment activity yet.</li>}
          </ul>
        </article>
      </section>
    </main>
  )
}

DashboardOverview.propTypes = {
  adminStats: PropTypes.shape({
    purchases_last_week: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    purchases_last_month: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    total_sell_current_month: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  }),
  courses: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
      department: PropTypes.string,
      title: PropTypes.string,
      description: PropTypes.string,
      level: PropTypes.string,
      price: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    }),
  ).isRequired,
  enrollments: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
      course_title: PropTypes.string,
      customer_name: PropTypes.string,
      student_email: PropTypes.string,
      amount_paid: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
      progress: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    }),
  ).isRequired,
  isAdmin: PropTypes.bool.isRequired,
  isAuthenticated: PropTypes.bool.isRequired,
  isTeacher: PropTypes.bool.isRequired,
  user: PropTypes.shape({
    first_name: PropTypes.string,
  }),
}

export default DashboardOverview
