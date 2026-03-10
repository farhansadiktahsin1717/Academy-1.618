import { useEffect, useMemo, useState } from 'react'
import PropTypes from 'prop-types'
import { Link } from 'react-router-dom'

function Dashboard({ adminStats, courses, enrollments, isAdmin, isAuthenticated, isTeacher, onProgressUpdate, user }) {
  const [dashboardTab, setDashboardTab] = useState(() => {
    if (isAdmin) return 'admin'
    if (isTeacher) return 'teacher'
    if (isAuthenticated) return 'student'
    return 'student'
  })

  useEffect(() => {
    if (isAdmin) {
      setDashboardTab('admin')
      return
    }
    if (isTeacher) {
      setDashboardTab('teacher')
      return
    }
    if (isAuthenticated) {
      setDashboardTab('student')
      return
    }
    setDashboardTab('student')
  }, [isAdmin, isTeacher, isAuthenticated])
  const myTeachingCourses = useMemo(() => {
    if (!user) return []
    const userEmail = user.email ? user.email.toLowerCase() : ''
    const userId = user?.id?.toString() || ''
    return courses.filter((course) => {
      const hints = [
        course?.teacher_email,
        course?.instructor_email,
        course?.teacher?.email,
        course?.instructor?.email,
        course?.owner,
        course?.created_by,
        course?.teacher_id,
      ]
      return hints.some((hint) => {
        if (!hint) return false
        const normalized = typeof hint === 'string' ? hint.toLowerCase() : String(hint)
        return normalized === userEmail || normalized === userId
      })
    })
  }, [courses, user])

  const totalRevenue = useMemo(() => {
    return enrollments.reduce((sum, enrollment) => sum + Number(enrollment.amount_paid || 0), 0)
  }, [enrollments])

  const averageProgress = useMemo(() => {
    if (!enrollments.length) return 0
    const total = enrollments.reduce((sum, enrollment) => sum + Number(enrollment.progress || 0), 0)
    return Math.round(total / enrollments.length)
  }, [enrollments])

  const topDepartments = useMemo(() => {
    const map = courses.reduce((acc, course) => {
      const key = course.department || 'General'
      acc[key] = (acc[key] || 0) + 1
      return acc
    }, {})
    return Object.entries(map)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 3)
  }, [courses])

  const isDashboardUnlocked = (tabKey) => {
    if (tabKey === 'admin') return isAdmin
    if (tabKey === 'teacher') return isTeacher || isAdmin
    if (tabKey === 'student') return isAuthenticated
    return false
  }

  const renderDashboardPanel = () => {
    if (!isDashboardUnlocked(dashboardTab)) {
      return (
        <div className="dashboard-locked">
          <p>Login with the matching role to explore this workspace.</p>
          {!isAuthenticated && (
            <p>
              Need an account? <Link to="/#apply">Register on the home page.</Link>
            </p>
          )}
        </div>
      )
    }

    if (dashboardTab === 'student') {
      return (
        <div className="student-panel">
          <header>
            <div>
              <p className="eyebrow">Average Progress</p>
              <h3>{averageProgress}%</h3>
            </div>
            <div>
              <p className="eyebrow">Active Enrollments</p>
              <h3>{enrollments.length}</h3>
            </div>
            <div>
              <p className="eyebrow">Tuition Paid</p>
              <h3>BDT {totalRevenue.toFixed(2)}</h3>
            </div>
          </header>
          <div className="enrollment-grid">
            {enrollments.length === 0 && <p className="muted">No enrollments yet. Pick a course to start.</p>}
            {enrollments.map((enrollment) => (
              <article key={enrollment.id}>
                <div>
                  <p className="eyebrow">{enrollment.course_department || 'Cohort'}</p>
                  <h4>{enrollment.course_title}</h4>
                  <p className="muted">BDT {Number(enrollment.amount_paid || 0).toFixed(2)}</p>
                </div>
                <div className="range-row">
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={enrollment.progress || 0}
                    onChange={(e) => onProgressUpdate(enrollment.id, e.target.value)}
                  />
                  <span>{enrollment.progress || 0}%</span>
                </div>
              </article>
            ))}
          </div>
        </div>
      )
    }

    if (dashboardTab === 'teacher') {
      const potential = myTeachingCourses.reduce((sum, course) => sum + Number(course.price || 0), 0)
      return (
        <div className="teacher-panel">
          <header>
            <div>
              <p className="eyebrow">Live Courses</p>
              <h3>{myTeachingCourses.length}</h3>
            </div>
            <div>
              <p className="eyebrow">Potential Tuition</p>
              <h3>BDT {potential.toFixed(2)}</h3>
            </div>
            <div>
              <p className="eyebrow">Avg Price</p>
              <h3>BDT {myTeachingCourses.length ? (potential / myTeachingCourses.length).toFixed(2) : '0.00'}</h3>
            </div>
          </header>
          <div className="teaching-list">
            {myTeachingCourses.length === 0 && (
              <p className="muted">
                No courses are mapped to your profile yet. Coordinate with an admin to be added as an instructor.
              </p>
            )}
            {myTeachingCourses.map((course) => (
              <article key={course.id}>
                <div>
                  <p className="eyebrow">{course.department || 'Discipline'}</p>
                  <h4>{course.title}</h4>
                  <p className="muted">{course.description}</p>
                </div>
                <div className="teacher-meta">
                  <strong>BDT {Number(course.price || 0).toFixed(2)}</strong>
                  <span>{course.level || 'Mixed Level'}</span>
                  {course.published ? <span className="pill success">Published</span> : <span className="pill">Draft</span>}
                </div>
              </article>
            ))}
          </div>
        </div>
      )
    }

    const purchases7 = adminStats?.purchases_last_week ?? 0
    const purchases30 = adminStats?.purchases_last_month ?? 0
    const sellCurrent = Number(adminStats?.total_sell_current_month || 0)
    const sellPrev = Number(adminStats?.total_sell_previous_month || 0)

    return (
      <div className="admin-panel">
        <div className="stat-grid">
          <article>
            <p className="eyebrow">Purchases · 7 days</p>
            <h3>{purchases7}</h3>
          </article>
          <article>
            <p className="eyebrow">Purchases · 30 days</p>
            <h3>{purchases30}</h3>
          </article>
          <article>
            <p className="eyebrow">Current Month</p>
            <h3>BDT {sellCurrent.toFixed(2)}</h3>
          </article>
          <article>
            <p className="eyebrow">Previous Month</p>
            <h3>BDT {sellPrev.toFixed(2)}</h3>
          </article>
        </div>
        <div className="admin-lists">
          <div>
            <h4>Top Departments</h4>
            <ul>
              {topDepartments.map(([dept, count]) => (
                <li key={dept}>
                  <span>{dept}</span>
                  <strong>{count}</strong>
                </li>
              ))}
              {topDepartments.length === 0 && <li>No course data yet.</li>}
            </ul>
          </div>
          <div>
            <h4>Recent Payments</h4>
            <ul>
              {enrollments.slice(0, 4).map((entry) => (
                <li key={entry.id}>
                  <div>
                    <p className="eyebrow">{entry.course_title}</p>
                    <p className="muted">{entry.customer_name || entry.student_email}</p>
                  </div>
                  <strong>BDT {Number(entry.amount_paid || 0).toFixed(2)}</strong>
                </li>
              ))}
              {enrollments.length === 0 && <li>No payments recorded.</li>}
            </ul>
          </div>
        </div>
      </div>
    )
  }

  return (
    <main>
      <section className="dashboard-hero">
        <div>
          <p className="eyebrow">Role-Based Workspace</p>
          <h1>Dashboards for students, teachers, and admins.</h1>
          <p>
            Monitor progress, manage cohorts, and track revenue using the same platform. Switch roles to explore how the
            experience changes across the academy.
          </p>
          <Link className="ghost" to="/dashboard">
            Back to Overview
          </Link>
        </div>
        <div className="dashboard-hero-card">
          <h3>Quick Snapshot</h3>
          <ul>
            <li>
              <span>Active Enrollments</span>
              <strong>{enrollments.length}</strong>
            </li>
            <li>
              <span>Published Courses</span>
              <strong>{courses.filter((course) => course.published).length}</strong>
            </li>
            <li>
              <span>Admin Access</span>
              <strong>{isAdmin ? 'Enabled' : 'Locked'}</strong>
            </li>
          </ul>
        </div>
      </section>

      <section className="dashboards" id="dashboards">
        <header>
          <div>
            <p className="eyebrow">Role Switcher</p>
            <h2>Dashboards tailored for admin, teacher, and student journeys.</h2>
          </div>
        </header>
        <div className="dashboard-tabs">
          {['student', 'teacher', 'admin'].map((tab) => {
            const locked = !isDashboardUnlocked(tab)
            return (
              <button
                key={tab}
                className={`${dashboardTab === tab ? 'active' : ''} ${locked ? 'locked' : ''}`}
                onClick={() => setDashboardTab(tab)}
              >
                {tab === 'student' && 'Student Hub'}
                {tab === 'teacher' && 'Teacher Studio'}
                {tab === 'admin' && 'Admin Control'}
                {locked && <span className="lock">LOCK</span>}
              </button>
            )
          })}
        </div>
        <div className="dashboard-panel">{renderDashboardPanel()}</div>
      </section>

      <section className="dashboard-cards">
        <article>
          <h3>Student Lens</h3>
          <p>Track progress, payment history, and course milestones in one place.</p>
        </article>
        <article>
          <h3>Teacher Lens</h3>
          <p>Manage cohorts, view enrollments, and publish course updates quickly.</p>
        </article>
        <article>
          <h3>Admin Lens</h3>
          <p>Monitor revenue, enrollment spikes, and operational metrics across programs.</p>
        </article>
      </section>
    </main>
  )
}

Dashboard.propTypes = {
  adminStats: PropTypes.shape({
    purchases_last_week: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    purchases_last_month: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    total_sell_current_month: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    total_sell_previous_month: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  }),
  courses: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
      department: PropTypes.string,
      title: PropTypes.string,
      description: PropTypes.string,
      price: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
      level: PropTypes.string,
      published: PropTypes.bool,
      teacher_email: PropTypes.string,
      instructor_email: PropTypes.string,
      teacher: PropTypes.shape({
        email: PropTypes.string,
      }),
      instructor: PropTypes.shape({
        email: PropTypes.string,
      }),
      owner: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
      created_by: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
      teacher_id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    }),
  ).isRequired,
  enrollments: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
      progress: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
      amount_paid: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
      course_title: PropTypes.string,
      course_department: PropTypes.string,
      customer_name: PropTypes.string,
      student_email: PropTypes.string,
    }),
  ).isRequired,
  isAdmin: PropTypes.bool.isRequired,
  isAuthenticated: PropTypes.bool.isRequired,
  isTeacher: PropTypes.bool.isRequired,
  onProgressUpdate: PropTypes.func.isRequired,
  user: PropTypes.shape({
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    email: PropTypes.string,
  }),
}
export default Dashboard





