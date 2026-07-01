import { motion } from 'framer-motion';

function Footer() {
  const currentYear = new Date().getFullYear();

  const handleScroll = (e, targetId) => {
    e.preventDefault();
    const element = document.getElementById(targetId);
    if (element) {
      const offset = 64; // height of fixed navbar
      const bodyRect = document.body.getBoundingClientRect().top;
      const elementRect = element.getBoundingClientRect().top;
      const elementPosition = elementRect - bodyRect;
      const offsetPosition = elementPosition - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
  };

  return (
    <motion.footer 
      id="footer" 
      className="footer-wrapper"
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.8 }}
    >
      <div className="container">
        <div className="footer-top">
          <div>
            <a href="#hero" className="logo" onClick={(e) => handleScroll(e, 'hero')} style={{ marginBottom: '12px' }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" style={{ color: 'var(--text-primary)' }}>
                <polygon points="12 2 2 22 22 22"></polygon>
              </svg>
              <span>Rav.dev</span>
            </a>
            <p className="footer-tagline" style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', maxWidth: '300px' }}>Engineered with focus, minimalism, and speed.</p>
          </div>
          
          <ul className="footer-nav">
            <li><a href="#about" onClick={(e) => handleScroll(e, 'about')} className="nav-link" style={{ padding: '0' }}>About</a></li>
            <li><a href="#skills" onClick={(e) => handleScroll(e, 'skills')} className="nav-link" style={{ padding: '0' }}>Skills</a></li>
            <li><a href="#projects" onClick={(e) => handleScroll(e, 'projects')} className="nav-link" style={{ padding: '0' }}>Projects</a></li>
            <li><a href="#certificates" onClick={(e) => handleScroll(e, 'certificates')} className="nav-link" style={{ padding: '0' }}>Certificates</a></li>
          </ul>
        </div>
        
        <div className="footer-bottom">
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>&copy; {currentYear} Rav.dev. All rights reserved.</p>
          
          <div className="social-links" style={{ display: 'flex', gap: '16px' }}>
            <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="project-link-icon" aria-label="GitHub">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path>
              </svg>
            </a>
            <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="project-link-icon" aria-label="LinkedIn">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path>
                <rect x="2" y="9" width="4" height="12"></rect>
                <circle cx="4" cy="4" r="2"></circle>
              </svg>
            </a>
            <a href="mailto:Rav@example.com" className="project-link-icon" aria-label="Email">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                <polyline points="22,6 12,13 2,6"></polyline>
              </svg>
            </a>
          </div>
        </div>
      </div>
    </motion.footer>
  );
}

export default Footer;
