import { startTransition, useCallback, useDeferredValue, useEffect, useMemo, useState } from 'react'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import SiteLayout from './components/SiteLayout'
import About from './pages/About'
import Contact from './pages/Contact'
import Dashboard from './pages/Dashboard'
import DashboardOverview from './pages/DashboardOverview'
import Home from './pages/Home'
import NotFound from './pages/NotFound'
import './App.css'

const API_BASE = import.meta.env.VITE_API_BASE || '/api/v1'

const storage = {
  get access() {
    return localStorage.getItem('academy_access') || ''
  },
  get refresh() {
    return localStorage.getItem('academy_refresh') || ''
  },
  get theme() {
    return localStorage.getItem('academy_theme') || 'light'
  },
  setTokens(access, refresh) {
    localStorage.setItem('academy_access', access)
    localStorage.setItem('academy_refresh', refresh)
  },
  clearTokens() {
    localStorage.removeItem('academy_access')
    localStorage.removeItem('academy_refresh')
  },
  setTheme(theme) {
    localStorage.setItem('academy_theme', theme)
  },
}

async function apiFetch(path, options = {}, accessToken = '') {
  const headers = {
    'Content-Type': 'application/json',
    ...(options.headers || {}),
  }

  if (accessToken) {
    headers.Authorization = `Bearer ${accessToken}`
  }

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

  if (response.status === 204 || response.status === 205) {
    return null
  }

  return response.json()
}

function App() {
  const [theme, setTheme] = useState(storage.theme)
  const [accessToken, setAccessToken] = useState(storage.access)
  const [refreshToken, setRefreshToken] = useState(storage.refresh)
  const [user, setUser] = useState(null)
  const [courses, setCourses] = useState([])
  const [enrollments, setEnrollments] = useState([])
  const [adminStats, setAdminStats] = useState(null)
  const [notice, setNotice] = useState({ type: '', text: '' })
  const [search, setSearch] = useState('')
  const [ordering, setOrdering] = useState('-created_at')
  const [checkoutCourse, setCheckoutCourse] = useState(null)
  const [isCoursesLoading, setIsCoursesLoading] = useState(false)
  const [isUserContextLoading, setIsUserContextLoading] = useState(false)
  const [isAuthSubmitting, setIsAuthSubmitting] = useState(false)
  const [isCheckoutSubmitting, setIsCheckoutSubmitting] = useState(false)
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

  const deferredSearch = useDeferredValue(search)
  const isAuthenticated = Boolean(accessToken)
  const isAdmin = Boolean(user?.is_staff)
  const isTeacher = user?.role === 'teacher'

  useEffect(() => {
    document.documentElement.dataset.theme = theme
    storage.setTheme(theme)
  }, [theme])

  const showNotice = useCallback((type, text) => {
    setNotice({ type, text })
  }, [])

  const clearNotice = useCallback(() => {
    setNotice({ type: '', text: '' })
  }, [])

  const enrollmentByCourse = useMemo(() => {
    const map = {}
    enrollments.forEach((item) => {
      map[item.course] = item
    })
    return map
  }, [enrollments])

  const featuredCourses = useMemo(() => {
    return courses.slice(0, 3)
  }, [courses])

  const handleThemeToggle = useCallback(() => {
    setTheme((current) => (current === 'light' ? 'dark' : 'light'))
  }, [])

  const handleAuthFormChange = useCallback((event) => {
    const { name, value } = event.target
    setAuthForm((current) => ({ ...current, [name]: value }))
  }, [])

  const handleCheckoutFormChange = useCallback((event) => {
    const { name, value } = event.target
    setCheckoutForm((current) => ({ ...current, [name]: value }))
  }, [])

  const handleSearchChange = useCallback((value) => {
    startTransition(() => {
      setSearch(value)
    })
  }, [])

  const loadCourses = useCallback(async () => {
    setIsCoursesLoading(true)
    try {
      const query = new URLSearchParams()
      if (deferredSearch.trim()) {
        query.set('search', deferredSearch.trim())
      }
      if (ordering) {
        query.set('ordering', ordering)
      }

      const suffix = query.toString() ? `?${query.toString()}` : ''
      const data = await apiFetch(`/courses/${suffix}`, {}, accessToken)
      setCourses(data.results || data)
    } catch (error) {
      showNotice('error', error.message)
    } finally {
      setIsCoursesLoading(false)
    }
  }, [accessToken, deferredSearch, ordering, showNotice])

  const loadUserContext = useCallback(async () => {
    if (!accessToken) {
      setUser(null)
      setEnrollments([])
      setAdminStats(null)
      return
    }

    setIsUserContextLoading(true)
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
    } catch (error) {
      storage.clearTokens()
      setAccessToken('')
      setRefreshToken('')
      setUser(null)
      setEnrollments([])
      setAdminStats(null)
      showNotice('error', error.message)
    } finally {
      setIsUserContextLoading(false)
    }
  }, [accessToken, showNotice])

  useEffect(() => {
    loadCourses()
  }, [loadCourses])

  useEffect(() => {
    loadUserContext()
  }, [loadUserContext])

  const handleRegister = useCallback(
    async (event) => {
      event.preventDefault()
      clearNotice()
      setIsAuthSubmitting(true)

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
        showNotice('success', 'Registration successful. Check your email to activate the account.')
      } catch (error) {
        showNotice('error', error.message)
      } finally {
        setIsAuthSubmitting(false)
      }
    },
    [authForm, clearNotice, showNotice],
  )

  const handleLogin = useCallback(
    async (event) => {
      event.preventDefault()
      clearNotice()
      setIsAuthSubmitting(true)

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
        showNotice('success', 'Logged in successfully.')
      } catch (error) {
        showNotice('error', error.message)
      } finally {
        setIsAuthSubmitting(false)
      }
    },
    [authForm.email, authForm.password, clearNotice, showNotice],
  )

  const handleLogout = useCallback(async () => {
    clearNotice()

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
    } catch (error) {
      showNotice('error', error.message)
    } finally {
      storage.clearTokens()
      setAccessToken('')
      setRefreshToken('')
      setUser(null)
      setEnrollments([])
      setAdminStats(null)
      setCheckoutCourse(null)
      showNotice('success', 'Logged out.')
    }
  }, [accessToken, clearNotice, refreshToken, showNotice])

  const handleEnrollProgressUpdate = useCallback(
    async (enrollmentId, progress) => {
      clearNotice()

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
        showNotice('success', 'Progress updated.')
      } catch (error) {
        showNotice('error', error.message)
      }
    },
    [accessToken, clearNotice, loadUserContext, showNotice],
  )

  const openCheckout = useCallback(
    (course) => {
      if (!isAuthenticated) {
        showNotice('error', 'Please log in first, then return to complete enrollment.')
        return
      }

      clearNotice()
      setCheckoutCourse(course)
      setCheckoutForm((current) => ({
        ...current,
        customer_name: user ? `${user.first_name || ''} ${user.last_name || ''}`.trim() : '',
      }))
    },
    [clearNotice, isAuthenticated, showNotice, user],
  )

  const handlePaymentInit = useCallback(
    async (event) => {
      event.preventDefault()

      if (!checkoutCourse) {
        return
      }

      clearNotice()
      setIsCheckoutSubmitting(true)

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

        await loadUserContext()
        showNotice('success', 'Payment initialized successfully.')
      } catch (error) {
        showNotice('error', error.message)
      } finally {
        setIsCheckoutSubmitting(false)
      }
    },
    [accessToken, checkoutCourse, checkoutForm, clearNotice, loadUserContext, showNotice],
  )

  return (
    <BrowserRouter>
      <Routes>
        <Route
          element={
            <SiteLayout
              isAuthenticated={isAuthenticated}
              notice={notice}
              onClearNotice={clearNotice}
              onLogout={handleLogout}
              onToggleTheme={handleThemeToggle}
              theme={theme}
            />
          }
        >
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
                isAuthSubmitting={isAuthSubmitting}
                isCheckoutSubmitting={isCheckoutSubmitting}
                isCoursesLoading={isCoursesLoading}
                onAuthFormChange={handleAuthFormChange}
                onCheckoutFormChange={handleCheckoutFormChange}
                onLogin={handleLogin}
                onLogout={handleLogout}
                onOrderingChange={setOrdering}
                onPaymentInit={handlePaymentInit}
                onRegister={handleRegister}
                onSearchChange={handleSearchChange}
                openCheckout={openCheckout}
                ordering={ordering}
                search={search}
                setCheckoutCourse={setCheckoutCourse}
                user={user}
              />
            }
          />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route
            path="/dashboard"
            element={
              <DashboardOverview
                adminStats={adminStats}
                courses={courses}
                enrollments={enrollments}
                isAdmin={isAdmin}
                isAuthenticated={isAuthenticated}
                isLoading={isCoursesLoading || isUserContextLoading}
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
                isLoading={isCoursesLoading || isUserContextLoading}
                isTeacher={isTeacher}
                onProgressUpdate={handleEnrollProgressUpdate}
                user={user}
              />
            }
          />
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App
