import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiSend, FiCheck, FiMapPin, FiPhone, FiMail, FiClock } from 'react-icons/fi';
import { submitContact } from '../api/contact';
import './Contact.css';

const contactInfo = [
  { icon: <FiMapPin />, title: 'Address', value: '123 Tech Street, San Francisco, CA 94000' },
  { icon: <FiPhone />, title: 'Phone', value: '+1 (555) 123-4567' },
  { icon: <FiMail />, title: 'Email', value: 'support@electrostore.com' },
  { icon: <FiClock />, title: 'Hours', value: 'Mon - Fri: 9AM - 6PM' },
];

export default function Contact() {
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });
  const [submitted, setSubmitted] = useState(false);
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState('');
  const [sending, setSending] = useState(false);

  const validate = () => {
    const errs = {};
    if (!form.name.trim()) errs.name = 'Name is required';
    if (!form.email.trim()) errs.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(form.email)) errs.email = 'Invalid email';
    if (!form.subject.trim()) errs.subject = 'Subject is required';
    if (!form.message.trim()) errs.message = 'Message is required';
    else if (form.message.trim().length < 10) errs.message = 'Message must be at least 10 characters';
    return errs;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }
    setErrors({});
    setServerError('');
    setSending(true);
    try {
      await submitContact(form);
      setSubmitted(true);
      setTimeout(() => {
        setSubmitted(false);
        setForm({ name: '', email: '', subject: '', message: '' });
      }, 3000);
    } catch (err) {
      setServerError(err.message || 'Failed to send message. Please try again.');
    } finally {
      setSending(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  return (
    <div className="contact-page">
      <section className="page-hero">
        <div className="page-hero__container">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <span className="page-hero__label">Reach Out</span>
            <h1 className="page-hero__title">Get in Touch</h1>
            <p className="page-hero__subtitle">
              Have a question or need help? We'd love to hear from you.
            </p>
          </motion.div>
        </div>
      </section>

      <div className="contact__container">
        {/* Info Cards */}
        <div className="contact-info-grid">
          {contactInfo.map((item, i) => (
            <motion.div
              key={i}
              className="contact-info-card"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
            >
              <div className="contact-info-card__icon">{item.icon}</div>
              <h4>{item.title}</h4>
              <p>{item.value}</p>
            </motion.div>
          ))}
        </div>

        {/* Form Section */}
        <div className="contact-form-section">
          <motion.div
            className="contact-form-wrapper"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2>Send Us a Message</h2>
            <p className="contact-form__subtitle">
              Fill out the form below and we'll get back to you as soon as possible.
            </p>

            <AnimatePresence mode="wait">
              {submitted ? (
                <motion.div
                  className="contact-success"
                  key="success"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                >
                  <div className="contact-success__icon">
                    <FiCheck />
                  </div>
                  <h3>Message Sent!</h3>
                  <p>Thank you for reaching out. We'll respond within 24 hours.</p>
                </motion.div>
              ) : (
                <motion.form
                  key="form"
                  className="contact-form"
                  onSubmit={handleSubmit}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  <div className="contact-form__row">
                    <div className="contact-form__group">
                      <label htmlFor="name">Name *</label>
                      <input
                        type="text"
                        id="name"
                        name="name"
                        value={form.name}
                        onChange={handleChange}
                        placeholder="Your name"
                        className={errors.name ? 'input--error' : ''}
                      />
                      {errors.name && <span className="form-error">{errors.name}</span>}
                    </div>
                    <div className="contact-form__group">
                      <label htmlFor="email">Email *</label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        value={form.email}
                        onChange={handleChange}
                        placeholder="you@example.com"
                        className={errors.email ? 'input--error' : ''}
                      />
                      {errors.email && <span className="form-error">{errors.email}</span>}
                    </div>
                  </div>

                  <div className="contact-form__group">
                    <label htmlFor="subject">Subject</label>
                    <input
                      type="text"
                      id="subject"
                      name="subject"
                      value={form.subject}
                      onChange={handleChange}
                      placeholder="What's this about?"
                    />
                  </div>

                  <div className="contact-form__group">
                    <label htmlFor="message">Message *</label>
                    <textarea
                      id="message"
                      name="message"
                      rows="5"
                      value={form.message}
                      onChange={handleChange}
                      placeholder="Tell us more..."
                      className={errors.message ? 'input--error' : ''}
                    />
                    {errors.message && <span className="form-error">{errors.message}</span>}
                  </div>

                  <button type="submit" className="btn btn--primary btn--lg contact-form__submit" disabled={sending}>
                    <FiSend /> {sending ? 'Sending...' : 'Send Message'}
                  </button>
                  {serverError && <p className="form-error" style={{ marginTop: '0.5rem', textAlign: 'center' }}>{serverError}</p>}
                </motion.form>
              )}
            </AnimatePresence>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
