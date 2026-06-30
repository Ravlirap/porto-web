import { motion } from 'framer-motion';

function Certificates() {
  const certifications = [
    {
      name: 'AWS Certified Cloud Practitioner',
      issuer: 'Amazon Web Services',
      date: 'Issued Dec 2025',
      link: 'https://aws.amazon.com'
    },
    {
      name: 'Meta Front-End Developer',
      issuer: 'Coursera / Meta',
      date: 'Issued Jul 2024',
      link: 'https://coursera.org'
    },
    {
      name: 'Responsive Web Design',
      issuer: 'freeCodeCamp',
      date: 'Issued Feb 2024',
      link: 'https://freecodecamp.org'
    }
  ];

  return (
    <section id="certificates" className="section">
      <div className="container">
        <motion.div 
          className="section-header"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <span className="section-label">04. Verification</span>
          <h2 className="section-title">Certifications</h2>
          <p className="section-subtitle">Verified credentials, courses, and honors validating my software engineering skills.</p>
        </motion.div>
        
        <div className="grid grid-3">
          {certifications.map((cert, index) => (
            <motion.div 
              key={index} 
              className="glass-card cert-card"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <div>
                <div className="project-tag" style={{ marginBottom: '12px', display: 'inline-block' }}>{cert.issuer}</div>
                <h3 className="cert-name" style={{ fontSize: '1.2rem', fontWeight: '700', color: 'var(--text-primary)' }}>{cert.name}</h3>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '24px' }}>
                <span className="cert-date" style={{ fontFamily: 'var(--font-mono)', fontSize: '0.8rem', color: 'var(--text-secondary)' }}>{cert.date}</span>
                <a href={cert.link} target="_blank" rel="noopener noreferrer" className="project-link-icon" aria-label={`Verify ${cert.name}`}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
                    <polyline points="15 3 21 3 21 9"></polyline>
                    <line x1="10" y1="14" x2="21" y2="3"></line>
                  </svg>
                </a>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default Certificates;
