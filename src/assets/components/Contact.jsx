import { useState } from 'react';
import { motion } from 'framer-motion';

function Contact() {
  const [formState, setFormState] = useState({ name: '', email: '', message: '' });
  const [status, setStatus] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formState.name || !formState.email || !formState.message) {
      setStatus('Please fill in all fields.');
      return;
    }
    // Simulate submission
    setStatus('Message sent successfully. Thank you!');
    setFormState({ name: '', email: '', message: '' });
  };

  const handleChange = (e) => {
    setFormState({
      ...formState,
      [e.target.name]: e.target.value
    });
  };

  return (
    <section id="contact" className="section">
      <div className="container">
        <motion.div 
          className="section-header"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <span className="section-label">05. Contact</span>
          <h2 className="section-title">Get In Touch</h2>
          <p className="section-subtitle">Have an internship opening, a project idea, or just want to connect? Drop a message.</p>
        </motion.div>
        
        <div className="grid grid-2">
          <motion.div 
            className="contact-info"
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <div>
              <h3 className="contact-info-title" style={{ fontSize: '1.5rem', fontWeight: '700', marginBottom: '16px', color: 'var(--text-primary)' }}>Let's build something.</h3>
              <p className="contact-info-desc" style={{ color: 'var(--text-secondary)', marginBottom: '32px' }}>
                I am actively seeking internship opportunities starting in 2026. If you are looking for a motivated developer who values performance, clean code, and solid engineering, I would love to hear from you.
              </p>
            </div>
            
            <ul className="contact-details" style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <li className="contact-detail-item" style={{ display: 'flex', alignItems: 'center', gap: '12px', color: 'var(--text-secondary)' }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ color: 'var(--accent-cyan)' }}>
                  <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                  <polyline points="22,6 12,13 2,6"></polyline>
                </svg>
                <span>Rav@example.com</span>
              </li>
              <li className="contact-detail-item" style={{ display: 'flex', alignItems: 'center', gap: '12px', color: 'var(--text-secondary)' }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ color: 'var(--accent-cyan)' }}>
                  <path d="M12 2a10 10 0 0 0-10 10c0 5.25 10 12 10 12s10-6.75 10-12a10 10 0 0 0-10-10z"></path>
                  <circle cx="12" cy="10" r="3"></circle>
                </svg>
                <span>Indonesia (WIB / UTC+7)</span>
              </li>
            </ul>
          </motion.div>
          
          <motion.div 
            className="glass-card"
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <form onSubmit={handleSubmit} className="contact-form">
              <div className="form-group-row">
                <div className="form-group">
                  <label htmlFor="name" className="form-label">Name</label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formState.name}
                    onChange={handleChange}
                    className="form-input"
                    placeholder="Jane Doe"
                    required
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="email" className="form-label">Email</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formState.email}
                    onChange={handleChange}
                    className="form-input"
                    placeholder="jane@example.com"
                    required
                  />
                </div>
              </div>
              
              <div className="form-group">
                <label htmlFor="message" className="form-label">Message</label>
                <textarea
                  id="message"
                  name="message"
                  value={formState.message}
                  onChange={handleChange}
                  className="form-input form-textarea"
                  placeholder="Your message details..."
                  required
                ></textarea>
              </div>
              
              <div style={{ marginTop: '24px' }}>
                <button type="submit" className="btn btn-primary" style={{ width: '100%' }}>
                  Send Message
                </button>
              </div>

              {status && (
                <p style={{ 
                  fontSize: '0.85rem', 
                  fontFamily: 'var(--font-mono)', 
                  color: status.includes('successfully') ? '#10b981' : '#f43f5e', 
                  marginTop: '12px' 
                }}>
                  {status}
                </p>
              )}
            </form>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

export default Contact;
