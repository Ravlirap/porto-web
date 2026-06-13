function About() {
  return (
    <section id="about" className="section about-section">
      <div className="glow-blob glow-blob-secondary" style={{ left: '5%', bottom: '10%' }}></div>
      
      <div className="container">
        <h2 className="section-title">About Me</h2>
        <p className="section-subtitle">Get to know my background, education, and career goals.</p>
        
        <div className="grid grid-cols-2">
          {/* Personal Introduction & Career Objective */}
          <div className="about-content animate-fade-in">
            <div className="glass-card about-card">
              <h3 className="about-card-title">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ color: 'var(--accent-primary)' }}>
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                  <circle cx="12" cy="7" r="4"></circle>
                </svg>
                Who I Am
              </h3>
              <p className="about-text">
                Hi, I'm <strong>Keyzol</strong>. I am an enthusiastic and motivated Informatics Engineering (Teknik Informatika) student with a deep passion for web development. I love building clean, functional, and visually appealing applications that solve real-world problems.
              </p>
              <p className="about-text">
                My journey in tech is driven by constant learning and experimentation. I thrive on diving into new frameworks, optimizing performance, and crafting smooth user experiences.
              </p>
            </div>
            
            <div className="glass-card about-card" style={{ marginTop: '24px' }}>
              <h3 className="about-card-title">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ color: 'var(--accent-secondary)' }}>
                  <circle cx="12" cy="12" r="10"></circle>
                  <circle cx="12" cy="12" r="6"></circle>
                  <circle cx="12" cy="12" r="2"></circle>
                </svg>
                Career Objective
              </h3>
              <p className="about-text">
                My objective is to secure a Fullstack Developer internship where I can apply my academic foundation, build production-grade web applications, and collaborate with experienced engineers. I aim to write clean, maintainable code and bridge the gap between stunning user interfaces and robust server architectures.
              </p>
            </div>
          </div>
          
          {/* Education Timeline */}
          <div className="about-education animate-fade-in">
            <div className="glass-card education-card h-full">
              <h3 className="about-card-title">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ color: 'var(--accent-primary)' }}>
                  <path d="M22 10v6M2 10l10-5 10 5-10 5z"></path>
                  <path d="M6 12v5c0 2 2 3 6 3s6-1 6-3v-5"></path>
                </svg>
                Education
              </h3>
              
              <div className="timeline">
                <div className="timeline-item">
                  <div className="timeline-marker"></div>
                  <div className="timeline-content">
                    <span className="timeline-date">2023 - Present</span>
                    <h4 className="timeline-degree">Bachelor of Informatics Engineering</h4>
                    <p className="timeline-institution">University / College</p>
                    <p className="timeline-desc">
                      Focusing on software engineering, database management, algorithms, web technologies, and systems design. Maintaining a strong academic performance while working on personal fullstack projects.
                    </p>
                  </div>
                </div>
                
                <div className="timeline-item">
                  <div className="timeline-marker"></div>
                  <div className="timeline-content">
                    <span className="timeline-date">2020 - 2023</span>
                    <h4 className="timeline-degree">High School Diploma</h4>
                    <p className="timeline-institution">Science & Technology Major</p>
                    <p className="timeline-desc">
                      Gained an early foundation in logic, mathematics, and basic programming logic. Active member of computer club activities.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default About;
