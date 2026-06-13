function Skills() {
  const skillCategories = [
    {
      title: 'Frontend Development',
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ color: 'var(--accent-primary)' }}>
          <polygon points="12 2 2 7 12 12 22 7 12 2"></polygon>
          <polyline points="2 17 12 22 22 17"></polyline>
          <polyline points="2 12 12 17 22 12"></polyline>
        </svg>
      ),
      skills: [
        { name: 'HTML5 & CSS3', level: '90%' },
        { name: 'JavaScript (ES6+)', level: '85%' },
        { name: 'React.js', level: '80%' },
        { name: 'Vite', level: '80%' },
        { name: 'Tailwind CSS', level: '75%' }
      ]
    },
    {
      title: 'Backend Development',
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ color: 'var(--accent-secondary)' }}>
          <rect x="2" y="2" width="20" height="8" rx="2" ry="2"></rect>
          <rect x="2" y="14" width="20" height="8" rx="2" ry="2"></rect>
          <line x1="6" y1="6" x2="6.01" y2="6"></line>
          <line x1="6" y1="18" x2="6.01" y2="18"></line>
        </svg>
      ),
      skills: [
        { name: 'Node.js', level: '70%' },
        { name: 'Express.js', level: '75%' },
        { name: 'PHP', level: '80%' },
        { name: 'Laravel', level: '75%' }
      ]
    },
    {
      title: 'Database Management',
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ color: 'var(--accent-primary)' }}>
          <ellipse cx="12" cy="5" rx="9" ry="3"></ellipse>
          <path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5"></path>
          <path d="M3 12c0 1.66 4 3 9 3s9-1.34 9-3"></path>
        </svg>
      ),
      skills: [
        { name: 'MySQL', level: '85%' },
        { name: 'PostgreSQL', level: '70%' },
        { name: 'MongoDB', level: '65%' }
      ]
    },
    {
      title: 'Tools & DevOps',
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ color: 'var(--accent-secondary)' }}>
          <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path>
          <polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline>
          <line x1="12" y1="22.08" x2="12" y2="12"></line>
        </svg>
      ),
      skills: [
        { name: 'Git & GitHub', level: '85%' },
        { name: 'VS Code', level: '90%' },
        { name: 'Postman', level: '80%' },
        { name: 'Laragon', level: '85%' },
        { name: 'Figma', level: '65%' }
      ]
    }
  ];

  return (
    <section id="skills" className="section skills-section">
      <div className="glow-blob" style={{ right: '5%', bottom: '20%' }}></div>
      
      <div className="container">
        <h2 className="section-title">My Skills</h2>
        <p className="section-subtitle">A comprehensive breakdown of my technical toolkit and proficiency levels.</p>
        
        <div className="grid grid-cols-2" style={{ gap: '32px' }}>
          {skillCategories.map((category, catIndex) => (
            <div key={catIndex} className="glass-card skill-card animate-fade-in">
              <div className="skill-category-header">
                <div className="skill-category-icon-wrapper">
                  {category.icon}
                </div>
                <h3 className="skill-category-title">{category.title}</h3>
              </div>
              
              <div className="skills-list">
                {category.skills.map((skill, skillIndex) => (
                  <div key={skillIndex} className="skill-item">
                    <div className="skill-info">
                      <span className="skill-name">{skill.name}</span>
                      <span className="skill-percentage">{skill.level}</span>
                    </div>
                    <div className="skill-bar-bg">
                      <div 
                        className="skill-bar-fill" 
                        style={{ 
                          width: skill.level,
                          background: catIndex % 2 === 0 
                            ? 'linear-gradient(90deg, var(--accent-primary) 0%, #818cf8 100%)'
                            : 'linear-gradient(90deg, var(--accent-secondary) 0%, #2dd4bf 100%)'
                        }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default Skills;
