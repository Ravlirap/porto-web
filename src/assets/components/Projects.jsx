function Projects() {
  const featuredProjects = [
    {
      title: 'DevDeploy Console',
      tag: 'Cloud Hosting Platform',
      desc: 'A minimalist cloud deployment dashboard built for serverless functions, static site hosting, and real-time build log streaming.',
      tech: ['React.js', 'Vite', 'Node.js', 'WebSocket'],
      link: 'https://github.com'
    },
    {
      title: 'Payflow SDK Layer',
      tag: 'Payment Processing Integration',
      desc: 'A unified payment orchestration integration layer supporting tokenized checkouts, split merchant transactions, and automated invoices.',
      tech: ['Laravel', 'PHP', 'MySQL', 'REST API'],
      link: 'https://github.com'
    },
    {
      title: 'Linear Task sync',
      tag: 'Productivity Application',
      desc: 'A high-speed task management board optimized for keyboard-first hotkeys, offline syncing, and shared workspaces.',
      tech: ['React.js', 'Express.js', 'MongoDB', 'JWT'],
      link: 'https://github.com'
    }
  ];

  return (
    <section id="projects" className="section">
      <div className="container">
        <div className="section-header">
          <span className="section-label">03. Selected Work</span>
          <h2 className="section-title">Featured Projects</h2>
          <p className="section-subtitle">A collection of systems and applications engineered with high performance and clean architectures.</p>
        </div>
        
        <div className="projects-grid">
          {featuredProjects.map((project, index) => (
            <div key={index} className="premium-card project-card">
              <div className="project-meta">
                <span className="project-tag">{project.tag}</span>
                <a href={project.link} target="_blank" rel="noopener noreferrer" className="project-link-icon" aria-label={`View ${project.title} on GitHub`}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="7" y1="17" x2="17" y2="7"></line>
                    <polyline points="7 7 17 7 17 17"></polyline>
                  </svg>
                </a>
              </div>
              
              <h3 className="project-name">{project.title}</h3>
              <p className="project-desc">{project.desc}</p>
              
              <div className="project-tech-list">
                {project.tech.map((techItem, tIdx) => (
                  <span key={tIdx} className="project-tech-tag">
                    {techItem}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default Projects;
