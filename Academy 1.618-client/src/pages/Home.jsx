import { useState } from 'react'
import { Link } from 'react-router-dom'
import PropTypes from 'prop-types'

const heroStats = [
  { value: '4.2k+', label: 'Learners Online', hint: 'Across cohorts in 12 timezones' },
  { value: '68', label: 'Industry Mentors', hint: 'Weekly reviews and office hours' },
  { value: '95%', label: 'Completion Rate', hint: 'Studio-based, outcome focused' },
]

const serviceCards = [
  {
    title: 'Skilled Instructors',
    body: 'Learn with mentors who have built products at scale in fintech, AI, and edtech.',
  },
  {
    title: 'Online Classes',
    body: 'Live classes plus deep work sprints with recordings and structured notes.',
  },
  {
    title: 'International Certification',
    body: 'Earn credential pathways mapped to global hiring standards.',
  },
  {
    title: 'Career Support',
    body: 'Mock interviews, project feedback, and employer showcases every month.',
  },
]

const campusPillars = [
  { title: 'Innovation Sprints', body: 'Weekly studio challenges anchored on real briefs.' },
  { title: 'Career Concierge', body: 'Portfolio reviews, interview prep, and employer showcases.' },
  { title: 'Global Community', body: 'Peer pods across 12 timezones keep momentum high.' },
  { title: 'Scholarships', body: 'Need-based grants plus rolling corporate sponsorships.' },
]

const eventHighlights = [
  {
    title: 'Product Narrative Residency',
    date: 'April 18 � Virtual Studio',
    focus: 'Craft launch stories with venture-backed founders.',
  },
  {
    title: 'AI in Production Lab',
    date: 'May 02 � Dhaka Campus',
    focus: 'Ship reliable ML hand-offs with MLOps coaches.',
  },
  {
    title: 'Future Campus Open House',
    date: 'May 24 � Hybrid',
    focus: 'Meet faculty, explore dashboards, and preview labs.',
  },
]

const facultyShowcase = [
  {
    name: 'Dr. Farzan Rahim',
    badge: 'AI Research Lead',
    bio: 'Previously at DeepMind and Meta FAIR, now designing our ML lab.',
    portrait: 'https://images.unsplash.com/photo-1544723795-3fb6469f5b39?auto=format&w=500&q=80',
  },
  {
    name: 'Rayan Chowdhury',
    badge: 'Principal Product Engineer',
    bio: 'Helps teams build reliable cloud-native systems with React + Django.',
    portrait: 'https://images.unsplash.com/photo-1544723795-432537f90837?auto=format&w=500&q=80',
  },
  {
    name: 'Anika Karim',
    badge: 'Design Systems Mentor',
    bio: 'Former IDEO designer bringing storytelling into digital classrooms.',
    portrait: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&w=500&q=80',
  },
]

const insightStories = [
  {
    title: 'How Studio-Based Learning Boosted Completion Rates',
    date: 'March 03, 2026',
    tag: 'Academics',
  },
  {
    title: 'Payment Cohorts + SSLCOMMERZ: Scaling Trusted Checkout',
    date: 'February 18, 2026',
    tag: 'Operations',
  },
  {
    title: 'Teacher Playbooks For Mixed Reality Workshops',
    date: 'January 29, 2026',
    tag: 'Faculty',
  },
]

const testimonials = [
  {
    name: 'Nazia Ahmed',
    role: 'Frontend Developer',
    quote: 'Project-driven modules helped me move from tutorial fatigue to production confidence.',
  },
  {
    name: 'Shadman Raihan',
    role: 'Data Analyst',
    quote: 'The learning path is structured. I always know what to learn next and why.',
  },
  {
    name: 'Tania Sultana',
    role: 'CSE Student',
    quote: 'The class resources and quizzes made revision much faster before my exams.',
  },
]

function Home({
  checkoutCourse,
  checkoutForm,
  courses,
  enrollmentByCourse,
  featuredCourses,
  isAuthenticated,
  loading,
  onAuthFormChange,
  onCheckoutFormChange,
  onLogin,
  onLogout,
  onPaymentInit,
  onRegister,
  onSearchChange,
  onOrderingChange,
  openCheckout,
  ordering,
  search,
  setCheckoutCourse,
  user,
}) {
  const [authMode, setAuthMode] = useState('login')

  return (
    <main>
      <section className="hero" id="home">
        <div className="hero-copy">
          <p className="eyebrow">Inspired by Colorlib Academia</p>
          <h1>Education that feels human, ambitious, and beautifully structured.</h1>
          <p>
            Academy 1.618 blends studio learning, transparent tuition, and modern dashboards for students, teachers, and
            admins. Explore future-ready tracks and apply for the next cohort.
          </p>
          <div className="hero-actions">
            <a className="primary" href="#courses">
              Explore Programs
            </a>
            <Link className="ghost" to="/dashboard">View Dashboards</Link>
          </div>
          <div className="stat-ribbon">
            {heroStats.map((stat) => (
              <article key={stat.label}>
                <strong>{stat.value}</strong>
                <span>{stat.label}</span>
                <p>{stat.hint}</p>
              </article>
            ))}
          </div>
        </div>
        <aside className="hero-visual">
          <img
            src="https://images.unsplash.com/photo-1523580846011-d3a5bc25702b?auto=format&w=900&q=80"
            alt="Students collaborating"
          />
          <div className="hero-card">
            <p className="eyebrow">Next Cohort</p>
            <h3>June 2026 Intake</h3>
            <p>Apply early to reserve a seat, get counseling, and secure scholarships.</p>
            <a className="primary" href="#apply">
              Start Application
            </a>
          </div>
        </aside>
      </section>

      <section className="services" id="about">
        <header>
          <p className="eyebrow">Why Us</p>
          <h2>Everything you need to scale your career.</h2>
        </header>
        <div className="service-grid">
          {serviceCards.map((service) => (
            <article key={service.title}>
              <h3>{service.title}</h3>
              <p>{service.body}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="about">
        <div className="about-image">
          <img
            src="https://images.unsplash.com/photo-1509062522246-3755977927d7?auto=format&w=900&q=80"
            alt="Mentor session"
          />
          <div className="about-badge">
            <strong>12+</strong>
            <span>Years of learning design</span>
          </div>
        </div>
        <div className="about-copy">
          <p className="eyebrow">Our Story</p>
          <h2>We pair world-class education with modern delivery.</h2>
          <p>
            From live workshops to self-paced labs, every program is structured to move learners from fundamentals to
            portfolio-ready outcomes. We obsess over clarity, mentorship, and momentum.
          </p>
          <div className="pillar-grid">
            {campusPillars.map((pillar) => (
              <article key={pillar.title}>
                <h3>{pillar.title}</h3>
                <p>{pillar.body}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="featured" id="featured">
        <header>
          <div>
            <p className="eyebrow">Flagship Programs</p>
            <h2>Spotlight courses for the upcoming cohort.</h2>
          </div>
          <a className="ghost" href="#courses">
            View catalog
          </a>
        </header>
        <div className="featured-grid">
          {featuredCourses.length === 0 && <p>No courses published yet.</p>}
          {featuredCourses.map((course) => (
            <article key={course.id}>
              <p className="eyebrow">{course.department || 'Discipline'}</p>
              <h3>{course.title}</h3>
              <p>{course.description}</p>
              <div className="card-foot">
                <strong>BDT {Number(course.price || 0).toFixed(2)}</strong>
                {enrollmentByCourse[course.id] ? (
                  <span className="pill success">Enrolled</span>
                ) : (
                  <button onClick={() => openCheckout(course)}>Enroll</button>
                )}
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="catalog" id="courses">
        <header>
          <div>
            <p className="eyebrow">All Courses</p>
            <h2>Curate your own path.</h2>
          </div>
          <div className="filters">
            <input
              type="search"
              placeholder="Search course"
              value={search}
              onChange={(e) => onSearchChange(e.target.value)}
            />
            <select value={ordering} onChange={(e) => onOrderingChange(e.target.value)}>
              <option value="-created_at">Newest</option>
              <option value="price">Price: Low to High</option>
              <option value="-price">Price: High to Low</option>
              <option value="title">Title A-Z</option>
            </select>
          </div>
        </header>
        {loading && <p className="muted">Loading courses...</p>}
        <div className="course-grid">
          {courses.map((course) => {
            const alreadyEnrolled = Boolean(enrollmentByCourse[course.id])
            return (
              <article key={course.id}>
                <h3>{course.title}</h3>
                <p>{course.description}</p>
                <div className="meta">
                  <span>{course.department}</span>
                  <span>{course.level || 'Mixed Level'}</span>
                </div>
                <div className="card-foot">
                  <strong>BDT {Number(course.price || 0).toFixed(2)}</strong>
                  {alreadyEnrolled ? (
                    <span className="pill success">Enrolled</span>
                  ) : (
                    <button onClick={() => openCheckout(course)}>Buy</button>
                  )}
                </div>
              </article>
            )
          })}
        </div>
      </section>

      {checkoutCourse && (
        <section className="checkout">
          <header>
            <div>
              <p className="eyebrow">Secure Checkout</p>
              <h2>{checkoutCourse.title}</h2>
            </div>
            <button className="ghost" onClick={() => setCheckoutCourse(null)}>
              Back to Courses
            </button>
          </header>
          <div className="checkout-grid">
            <div className="summary">
              <p>{checkoutCourse.description}</p>
              <p>
                <strong>Total: BDT {Number(checkoutCourse.price || 0).toFixed(2)}</strong>
              </p>
            </div>
            <form onSubmit={onPaymentInit}>
              <input
                name="customer_name"
                placeholder="Full Name"
                value={checkoutForm.customer_name}
                onChange={onCheckoutFormChange}
                required
              />
              <input
                name="customer_phone"
                placeholder="Phone Number"
                value={checkoutForm.customer_phone}
                onChange={onCheckoutFormChange}
                required
              />
              <textarea
                name="customer_address"
                placeholder="Address"
                value={checkoutForm.customer_address}
                onChange={onCheckoutFormChange}
                required
              />
              <button type="submit">Proceed to SSLCOMMERZ</button>
            </form>
          </div>
        </section>
      )}

      <section className="events" id="events">
        <header>
          <div>
            <p className="eyebrow">Calendar</p>
            <h2>Upcoming studios & open houses.</h2>
          </div>
        </header>
        <div className="event-grid">
          {eventHighlights.map((event) => (
            <article key={event.title}>
              <p className="eyebrow">{event.date}</p>
              <h3>{event.title}</h3>
              <p>{event.focus}</p>
              <button>Save Seat</button>
            </article>
          ))}
        </div>
      </section>

      <section className="faculty" id="faculty">
        <header>
          <div>
            <p className="eyebrow">Faculty</p>
            <h2>Mentors who blend research with execution.</h2>
          </div>
        </header>
        <div className="faculty-grid">
          {facultyShowcase.map((mentor) => (
            <article key={mentor.name}>
              <img src={mentor.portrait} alt={mentor.name} loading="lazy" />
              <h3>{mentor.name}</h3>
              <p className="eyebrow">{mentor.badge}</p>
              <p>{mentor.bio}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="testimonials">
        <header>
          <div>
            <p className="eyebrow">Learner Stories</p>
            <h2>Proof from the community.</h2>
          </div>
        </header>
        <div className="testimonial-grid">
          {testimonials.map((item) => (
            <article key={item.name}>
              <p>�{item.quote}�</p>
              <h4>{item.name}</h4>
              <span>{item.role}</span>
            </article>
          ))}
        </div>
      </section>

      <section className="insights" id="insights">
        <header>
          <div>
            <p className="eyebrow">Insights</p>
            <h2>News from Academy 1.618</h2>
          </div>
        </header>
        <div className="insight-grid">
          {insightStories.map((story) => (
            <article key={story.title}>
              <p className="eyebrow">{story.tag}</p>
              <h3>{story.title}</h3>
              <p className="muted">{story.date}</p>
              <button>Read Story</button>
            </article>
          ))}
        </div>
      </section>

      <section className="apply" id="apply">
        <div className="apply-copy">
          <p className="eyebrow">Admissions 2026</p>
          <h2>Secure your seat for the June cohort.</h2>
          <p>Apply now and preview the dashboards built for your role.</p>
          {isAuthenticated && (
            <button className="ghost" onClick={onLogout}>
              Sign Out
            </button>
          )}
        </div>
        <aside className="apply-card">
          <div className="tabs">
            <button className={authMode === 'login' ? 'active' : ''} onClick={() => setAuthMode('login')}>
              Login
            </button>
            <button className={authMode === 'register' ? 'active' : ''} onClick={() => setAuthMode('register')}>
              Register
            </button>
          </div>
          <form onSubmit={authMode === 'login' ? onLogin : onRegister}>
            <input name="email" type="email" placeholder="Email" onChange={onAuthFormChange} required />
            <input name="password" type="password" placeholder="Password" onChange={onAuthFormChange} required />
            {authMode === 'register' && (
              <>
                <input
                  name="re_password"
                  type="password"
                  placeholder="Confirm password"
                  onChange={onAuthFormChange}
                  required
                />
                <div className="split">
                  <input name="first_name" type="text" placeholder="First Name" onChange={onAuthFormChange} />
                  <input name="last_name" type="text" placeholder="Last Name" onChange={onAuthFormChange} />
                </div>
                <select name="role" onChange={onAuthFormChange}>
                  <option value="student">Student</option>
                  <option value="teacher">Teacher</option>
                </select>
              </>
            )}
            <button type="submit">{authMode === 'login' ? 'Access Dashboard' : 'Create Account'}</button>
          </form>
          {user && (
            <div className="apply-user">
              <p className="muted">Signed in as {user.email}</p>
            </div>
          )}
        </aside>
      </section>
    </main>
  )
}

Home.propTypes = {
  checkoutCourse: PropTypes.shape({
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    title: PropTypes.string,
    description: PropTypes.string,
    price: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    department: PropTypes.string,
    level: PropTypes.string,
  }),
  checkoutForm: PropTypes.shape({
    customer_name: PropTypes.string,
    customer_phone: PropTypes.string,
    customer_address: PropTypes.string,
  }).isRequired,
  courses: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
      title: PropTypes.string,
      description: PropTypes.string,
      department: PropTypes.string,
      level: PropTypes.string,
      price: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    }),
  ).isRequired,
  enrollmentByCourse: PropTypes.objectOf(PropTypes.object).isRequired,
  featuredCourses: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
      title: PropTypes.string,
      description: PropTypes.string,
      department: PropTypes.string,
      price: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    }),
  ).isRequired,
  isAuthenticated: PropTypes.bool.isRequired,
  loading: PropTypes.bool.isRequired,
  onAuthFormChange: PropTypes.func.isRequired,
  onCheckoutFormChange: PropTypes.func.isRequired,
  onLogin: PropTypes.func.isRequired,
  onLogout: PropTypes.func.isRequired,
  onPaymentInit: PropTypes.func.isRequired,
  onRegister: PropTypes.func.isRequired,
  onSearchChange: PropTypes.func.isRequired,
  onOrderingChange: PropTypes.func.isRequired,
  openCheckout: PropTypes.func.isRequired,
  ordering: PropTypes.string.isRequired,
  search: PropTypes.string.isRequired,
  setCheckoutCourse: PropTypes.func.isRequired,
  user: PropTypes.shape({
    email: PropTypes.string,
    first_name: PropTypes.string,
    last_name: PropTypes.string,
  }),
}
export default Home



