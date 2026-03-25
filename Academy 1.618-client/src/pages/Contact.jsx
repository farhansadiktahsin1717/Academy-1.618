import { useState } from 'react'
import Icon from '../components/Icon'

const contactCards = [
  {
    icon: 'mail',
    label: 'Email',
    value: 'hello@academy1618.edu',
    href: 'mailto:hello@academy1618.edu',
  },
  {
    icon: 'phone',
    label: 'Phone',
    value: '+880 1900-618-618',
    href: 'tel:+8801900618618',
  },
  {
    icon: 'mapPin',
    label: 'Location',
    value: 'Dhaka, Bangladesh',
    href: 'https://maps.google.com/?q=Dhaka',
  },
]

function Contact() {
  const [form, setForm] = useState({
    name: '',
    email: '',
    message: '',
  })
  const [status, setStatus] = useState({ type: '', text: '' })
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleChange = (event) => {
    const { name, value } = event.target
    setForm((current) => ({ ...current, [name]: value }))
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    setStatus({ type: '', text: '' })

    if (!form.name.trim() || !form.email.trim() || !form.message.trim()) {
      setStatus({ type: 'error', text: 'Please complete all contact fields before sending your message.' })
      return
    }

    setIsSubmitting(true)

    try {
      await new Promise((resolve) => {
        window.setTimeout(resolve, 900)
      })

      localStorage.setItem(
        'academy_contact_last_submission',
        JSON.stringify({
          ...form,
          submittedAt: new Date().toISOString(),
        }),
      )

      setStatus({
        type: 'success',
        text: 'Message captured successfully. This demo stores the latest inquiry locally so the UX stays complete without a separate contact API.',
      })
      setForm({ name: '', email: '', message: '' })
    } catch {
      setStatus({ type: 'error', text: 'Something went wrong while saving your message. Please try again.' })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <main className="page-stack">
      <section className="content-hero">
        <p className="eyebrow">Contact</p>
        <h1>Reach out for a product walkthrough, collaboration, or feedback.</h1>
        <p>
          This page rounds out the marketing surface with real contact details, a working form state, and clear success and
          error feedback so the project feels complete.
        </p>
      </section>

      <section>
        <div className="contact-grid">
          <div className="contact-list">
            {contactCards.map((card) => (
              <a key={card.label} className="contact-card" href={card.href} rel="noreferrer" target="_blank">
                <div className="feature-icon">
                  <Icon name={card.icon} />
                </div>
                <div>
                  <p className="eyebrow">{card.label}</p>
                  <h3>{card.value}</h3>
                </div>
              </a>
            ))}
          </div>

          <div className="contact-form-card">
            <h2>Send a message</h2>
            <p>
              Use this form to test a polished contact flow with disabled loading states and meaningful status messaging.
            </p>

            {status.text && <div className={`inline-notice ${status.type}`}>{status.text}</div>}

            <form className="surface-form" onSubmit={handleSubmit}>
              <label className="field">
                <span>Name</span>
                <input name="name" onChange={handleChange} placeholder="Your name" value={form.name} />
              </label>
              <label className="field">
                <span>Email</span>
                <input name="email" onChange={handleChange} placeholder="Your email" type="email" value={form.email} />
              </label>
              <label className="field">
                <span>Message</span>
                <textarea
                  name="message"
                  onChange={handleChange}
                  placeholder="Tell me what you'd like to discuss"
                  rows="6"
                  value={form.message}
                />
              </label>
              <button className="primary" disabled={isSubmitting} type="submit">
                {isSubmitting ? 'Sending...' : 'Send Message'}
              </button>
            </form>
          </div>
        </div>
      </section>
    </main>
  )
}

export default Contact
