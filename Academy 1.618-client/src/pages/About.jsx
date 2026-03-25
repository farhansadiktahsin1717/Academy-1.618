function About() {
  return (
    <main className="page-stack">
      <section className="content-hero">
        <p className="eyebrow">About The Project</p>
        <h1>Academy 1.618 was built to show what a modern learning platform can feel like end to end.</h1>
        <p>
          The idea was to combine a polished marketing surface with useful product depth. Instead of stopping at a single
          landing page, the app carries the same design language into live data, checkout, and role-based dashboards for
          students, teachers, and admins.
        </p>
      </section>

      <section className="story-grid">
        <article className="story-card">
          <p className="eyebrow">Frontend</p>
          <h3>React + React Router + responsive UI system</h3>
          <p>
            The public pages, dark mode, navigation, skeleton loading states, and installable shell all live in the React
            client. The interface is intentionally consistent so each route feels like part of the same product.
          </p>
        </article>
        <article className="story-card">
          <p className="eyebrow">Backend</p>
          <h3>Django APIs for real app behavior</h3>
          <p>
            The project already had strong backend foundations, so this rebuild leans into them. Course data, auth, user
            context, enrollments, and payment initiation remain connected to the API instead of being mocked in the UI.
          </p>
        </article>
      </section>
    </main>
  )
}

export default About
