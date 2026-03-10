import { useCallback, useEffect, useMemo, useState } from 'react'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import SiteHeader from './components/SiteHeader'
import Dashboard from './pages/Dashboard'
import DashboardOverview from './pages/DashboardOverview'
import Home from './pages/Home'
import './App.css'

const API_BASE = import.meta.env.VITE_API_BASE || '/api/v1'

const storage = {
  get access() {
    return localStorage.getItem('academy_access') || ''
  },
  get refresh() {
    return localStorage.getItem('academy_refresh') || ''
  },
  setTokens(access, refresh) {
    localStorage.setItem('academy_access', access)
    localStorage.setItem('academy_refresh', refresh)
  },
  clear() {
    localStorage.removeItem('academy_access')
    localStorage.removeItem('academy_refresh')
  },
}

async function apiFetch(path, options = {}, accessToken = '') {
  const headers = {
    'Content-Type': 'application/json',
    ...(options.headers || {}),
  }
  if (accessToken) headers.Authorization = `Bearer ${accessToken}`

  const response = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers,
  })

  if (!response.ok) {
    const payload = await response.json().catch(() => ({}))
    const firstError = Object.values(payload || {})[0]
    const message = Array.isArray(firstError) ? firstError[0] : payload.detail || firstError
    throw new Error(message || 'Request failed')
  }

  if (response.status === 204 || response.status === 205) return null
  return response.json()
}

function App() {
  const [accessToken, setAccessToken] = useState(storage.access)
  const [refreshToken, setRefreshToken] = useState(storage.refresh)
  const [user, setUser] = useState(null)
  const [courses, setCourses] = useState([])
  const [enrollments, setEnrollments] = useState([])
  const [adminStats, setAdminStats] = useState(null)
  const [error, setError] = useState('')
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(false)
  const [search, setSearch] = useState('')
  const [ordering, setOrdering] = useState('-created_at')
  const [checkoutCourse, setCheckoutCourse] = useState(null)
  const [authForm, setAuthForm] = useState({
    email: '',
    password: '',
    re_password: '',
    first_name: '',
    last_name: '',
    role: 'student',
  })
  const [checkoutForm, setCheckoutForm] = useState({
    customer_name: '',
    customer_phone: '',
    customer_address: '',
  })

  const isAuthenticated = Boolean(accessToken)
  const isAdmin = Boolean(user?.is_staff)
  const isTeacher = user?.role === 'teacher'

  const enrollmentByCourse = useMemo(() => {
    const map = {}
    enrollments.forEach((item) => {
      map[item.course] = item
    })
    return map
  }, [enrollments])

  const featuredCourses = useMemo(() => courses.slice(0, 3), [courses])

  const handleAuthFormChange = (event) => {
    const { name, value } = event.target
    setAuthForm((prev) => ({ ...prev, [name]: value }))
  }

  const handleCheckoutFormChange = (event) => {
    const { name, value } = event.target
    setCheckoutForm((prev) => ({ ...prev, [name]: value }))
  }

  const loadCourses = useCallback(async () => {
    setLoading(true)
    try {
      const query = new URLSearchParams()
      if (search.trim()) query.set('search', search.trim())
      if (ordering) query.set('ordering', ordering)
      const data = await apiFetch(`/courses/?${query.toString()}`, {}, accessToken)
      setCourses(data.results || data)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }, [accessToken, ordering, search])

  const loadUserContext = useCallback(async () => {
    if (!accessToken) return
    try {
      const me = await apiFetch('/auth/users/me/', {}, accessToken)
      setUser(me)

      const myEnrollments = await apiFetch('/enrollments/', {}, accessToken)
      setEnrollments(myEnrollments.results || myEnrollments)

      if (me.is_staff) {
        const stats = await apiFetch('/dashboard/admin/stats/', {}, accessToken)
        setAdminStats(stats)
      } else {
        setAdminStats(null)
      }
    } catch (err) {
      setError(err.message)
    }
  }, [accessToken])

  useEffect(() => {
    loadCourses()
  }, [loadCourses])

  useEffect(() => {
    loadUserContext()
  }, [loadUserContext])

  const handleRegister = async (event) => {
    event.preventDefault()
    setError('')
    setMessage('')
    try {
      await apiFetch('/auth/users/', {
        method: 'POST',
        body: JSON.stringify({
          email: authForm.email,
          password: authForm.password,
          re_password: authForm.re_password,
          first_name: authForm.first_name,
          last_name: authForm.last_name,
          role: authForm.role,
        }),
      })
      setMessage('Registration successful. Please activate account from your email.')
    } catch (err) {
      setError(err.message)
    }
  }

  const handleLogin = async (event) => {
    event.preventDefault()
    setError('')
    setMessage('')
    try {
      const tokenData = await apiFetch('/auth/jwt/create/', {
        method: 'POST',
        body: JSON.stringify({
          email: authForm.email,
          password: authForm.password,
        }),
      })
      storage.setTokens(tokenData.access, tokenData.refresh)
      setAccessToken(tokenData.access)
      setRefreshToken(tokenData.refresh)
      setMessage('Logged in successfully.')
    } catch (err) {
      setError(err.message)
    }
  }

  const handleLogout = async () => {
    setError('')
    setMessage('')
    try {
      if (refreshToken) {
        await apiFetch(
          '/auth/logout/',
          {
            method: 'POST',
            body: JSON.stringify({ refresh: refreshToken }),
          },
          accessToken,
        )
      }
    } catch (err) {
      setError(err.message)
    } finally {
      storage.clear()
      setAccessToken('')
      setRefreshToken('')
      setUser(null)
      setEnrollments([])
      setAdminStats(null)
      setCheckoutCourse(null)
      setMessage('Logged out.')
    }
  }

  const handleEnrollProgressUpdate = async (enrollmentId, progress) => {
    try {
      await apiFetch(
        `/enrollments/${enrollmentId}/`,
        {
          method: 'PATCH',
          body: JSON.stringify({ progress: Number(progress) }),
        },
        accessToken,
      )
      await loadUserContext()
    } catch (err) {
      setError(err.message)
    }
  }

  const openCheckout = (course) => {
    if (!isAuthenticated) {
      setError('Please login first, then click Buy.')
      return
    }
    setError('')
    setMessage('')
    setCheckoutCourse(course)
    setCheckoutForm((prev) => ({
      ...prev,
      customer_name: user ? `${user.first_name || ''} ${user.last_name || ''}`.trim() : '',
    }))
  }

  const handlePaymentInit = async (event) => {
    event.preventDefault()
    if (!checkoutCourse) return
    setError('')
    setMessage('')
    try {
      const data = await apiFetch(
        '/payments/initiate/',
        {
          method: 'POST',
          body: JSON.stringify({
            course_id: checkoutCourse.id,
            customer_name: checkoutForm.customer_name,
            customer_phone: checkoutForm.customer_phone,
            customer_address: checkoutForm.customer_address,
          }),
        },
        accessToken,
      )

      if (data.payment_url) {
        window.location.href = data.payment_url
        return
      }
      setMessage('Payment initialized.')
    } catch (err) {
      setError(err.message)
    }
  }

  return (
    <BrowserRouter>
      <div className="app-shell">
        <SiteHeader isAuthenticated={isAuthenticated} onLogout={handleLogout} />
        {(error || message) && (
          <div className="alerts">
            {error && <div className="alert error">{error}</div>}
            {message && <div className="alert success">{message}</div>}
          </div>
        )}
        <Routes>
          <Route
            path="/"
            element={
              <Home
                checkoutCourse={checkoutCourse}
                checkoutForm={checkoutForm}
                courses={courses}
                enrollmentByCourse={enrollmentByCourse}
                featuredCourses={featuredCourses}
                isAuthenticated={isAuthenticated}
                loading={loading}
                onAuthFormChange={handleAuthFormChange}
                onCheckoutFormChange={handleCheckoutFormChange}
                onLogin={handleLogin}
                onLogout={handleLogout}
                onPaymentInit={handlePaymentInit}
                onRegister={handleRegister}
                onSearchChange={setSearch}
                onOrderingChange={setOrdering}
                openCheckout={openCheckout}
                ordering={ordering}
                search={search}
                setCheckoutCourse={setCheckoutCourse}
                user={user}
              />
            }
          />
          <Route
            path="/dashboard"
            element={
              <DashboardOverview
                adminStats={adminStats}
                courses={courses}
                enrollments={enrollments}
                isAdmin={isAdmin}
                isAuthenticated={isAuthenticated}
                isTeacher={isTeacher}
                user={user}
              />
            }
          />
          <Route
            path="/dashboard/workspace"
            element={
              <Dashboard
                adminStats={adminStats}
                courses={courses}
                enrollments={enrollments}
                isAdmin={isAdmin}
                isAuthenticated={isAuthenticated}
                isTeacher={isTeacher}
                onProgressUpdate={handleEnrollProgressUpdate}
                user={user}
              />
            }
          />
        </Routes>
        <footer className="site-footer">
          <p>(c) {new Date().getFullYear()} Academy 1.618</p>
        </footer>
      </div>
    </BrowserRouter>
  )
}

export default App









