/**
 * Contact page.
 *
 * Two-column layout on desktop (contact info + form). Stacks on
 * mobile, with contact details preserved (the previous CSS hid them
 * below 820px).
 *
 * Submissions go to POST /api/contact on the Render backend. The
 * Cloudflare Function at functions/api/send-email.js should be
 * removed only after the Render endpoint is verified in production.
 */

import { useState, useRef } from 'react';
import ReCAPTCHA from 'react-google-recaptcha';
import Swal from 'sweetalert2';
import { MapPin, Phone, Mail, Send, AlertCircle } from 'lucide-react';
import './contact.css';

const API_BASE = import.meta.env.VITE_API_URL;

const CONTACT = {
  address1: 'MWR6+GPW, Embakasi Village Market',
  address2: 'Opposite Posta, Embakasi Road, Nairobi',
  address3: 'Nairobi County 00521, Kenya',
  phone: '0202495785',
  phoneDisplay: '020 249 5785',
  email: 'ctkcatholicparishemba@gmail.com',
};

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function ContactUs() {
  const [form, setForm] = useState({ name: '', email: '', message: '' });
  const [captchaValue, setCaptchaValue] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const recaptchaRef = useRef();

  const siteKey = import.meta.env.VITE_RECAPTCHA_SITE_KEY;

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const fail = (title, text) => {
    Swal.fire({
      icon: 'error',
      title,
      text,
      confirmButtonColor: '#800000',
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isLoading) return;

    const name = form.name.trim();
    const email = form.email.trim();
    const message = form.message.trim();

    if (!name) return fail('Name Required', 'Please enter your name.');
    if (!EMAIL_RE.test(email))
      return fail('Invalid Email', 'Please enter a valid email address.');
    if (!message)
      return fail('Message Required', 'Please enter your message.');
    if (!captchaValue)
      return fail(
        'Verification Required',
        "Please complete the reCAPTCHA to prove you're not a robot."
      );

    if (!API_BASE || !siteKey) {
      return fail(
        'Configuration Error',
        'The contact form is not configured. Please email or call the parish office directly.'
      );
    }

    setIsLoading(true);

    try {
      const response = await fetch(`${API_BASE}/contact`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, message, token: captchaValue }),
      });

      const data = await response.json().catch(() => ({}));

      if (response.ok && data.success) {
        Swal.fire({
          icon: 'success',
          title: 'Message Sent!',
          text: "Thank you for contacting Christ the King Parish. We'll get back to you shortly.",
          confirmButtonColor: '#800000',
        });
        setForm({ name: '', email: '', message: '' });
        setCaptchaValue(null);
        recaptchaRef.current?.reset();
        return;
      }

      if (response.status === 403) {
        fail(
          'Verification Failed',
          'reCAPTCHA verification failed. Please complete the challenge and try again.'
        );
        recaptchaRef.current?.reset();
        setCaptchaValue(null);
        return;
      }
      if (response.status === 429) {
        fail(
          'Too Many Requests',
          'You have submitted a message recently. Please wait a few minutes before trying again.'
        );
        return;
      }
      if (response.status >= 500) {
        fail(
          'Server Error',
          'The message could not be sent right now. Please try again in a few minutes, or call the parish office.'
        );
        return;
      }

      fail(
        'Submission Failed',
        data.message || 'Something went wrong. Please try again.'
      );
    } catch (err) {
      console.error('Contact submission failed:', err);
      fail(
        'Network Error',
        'We could not reach the server. Please check your connection and try again.'
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="contact-page">
      <div className="contact-page__container">
        <header className="contact-page__header">
          <h1 className="contact-page__title">Contact Us</h1>
          <p className="contact-page__subtitle">
            If you have any questions, feel free to reach out to us.
          </p>
        </header>

        <div className="contact-page__grid">
          <aside className="contact-details">
            <div className="contact-detail">
              <span className="contact-detail__icon" aria-hidden="true">
                <MapPin size={20} />
              </span>
              <div>
                <p className="contact-detail__label">Address</p>
                <address className="contact-detail__value">
                  {CONTACT.address1}
                  <br />
                  {CONTACT.address2}
                  <br />
                  {CONTACT.address3}
                </address>
              </div>
            </div>

            <div className="contact-detail">
              <span className="contact-detail__icon" aria-hidden="true">
                <Phone size={20} />
              </span>
              <div>
                <p className="contact-detail__label">Phone</p>
                <a
                  href={`tel:${CONTACT.phone}`}
                  className="contact-detail__value contact-detail__link"
                >
                  {CONTACT.phoneDisplay}
                </a>
              </div>
            </div>

            <div className="contact-detail">
              <span className="contact-detail__icon" aria-hidden="true">
                <Mail size={20} />
              </span>
              <div>
                <p className="contact-detail__label">Email</p>
                <a
                  href={`mailto:${CONTACT.email}`}
                  className="contact-detail__value contact-detail__link"
                >
                  {CONTACT.email}
                </a>
              </div>
            </div>
          </aside>

          <form className="contact-form" onSubmit={handleSubmit} noValidate>
            <div className="contact-form__field">
              <label htmlFor="name" className="contact-form__label">
                Name <span className="contact-form__required">*</span>
              </label>
              <input
                id="name"
                name="name"
                type="text"
                autoComplete="name"
                maxLength={100}
                value={form.name}
                onChange={handleChange}
                disabled={isLoading}
                required
                className="contact-form__input"
              />
            </div>

            <div className="contact-form__field">
              <label htmlFor="email" className="contact-form__label">
                Email <span className="contact-form__required">*</span>
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                maxLength={254}
                value={form.email}
                onChange={handleChange}
                disabled={isLoading}
                required
                className="contact-form__input"
              />
            </div>

            <div className="contact-form__field">
              <label htmlFor="message" className="contact-form__label">
                Message <span className="contact-form__required">*</span>
              </label>
              <textarea
                id="message"
                name="message"
                rows={6}
                maxLength={5000}
                value={form.message}
                onChange={handleChange}
                disabled={isLoading}
                required
                className="contact-form__input contact-form__textarea"
              />
            </div>

            <div className="contact-form__captcha">
              {siteKey ? (
                <ReCAPTCHA
                  ref={recaptchaRef}
                  sitekey={siteKey}
                  onChange={(val) => setCaptchaValue(val)}
                  onExpired={() => setCaptchaValue(null)}
                  onErrored={() => setCaptchaValue(null)}
                  theme="light"
                />
              ) : (
                <div className="contact-form__config-error">
                  <AlertCircle size={16} aria-hidden="true" />
                  Form is not configured. Please email or call the parish
                  office directly.
                </div>
              )}
            </div>

            <button
              type="submit"
              disabled={isLoading || !siteKey}
              className="contact-form__submit"
            >
              <Send size={16} aria-hidden="true" />
              {isLoading ? 'Sending…' : 'Send Message'}
            </button>
          </form>
        </div>
      </div>
    </main>
  );
}