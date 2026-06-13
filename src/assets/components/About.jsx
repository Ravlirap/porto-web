function About() {
  return (
    <section id="about" className="section">
      <div className="container">
        <div className="section-header">
          <span className="section-label">01. Background</span>
          <h2 className="section-title">About Me</h2>
          <p className="section-subtitle">A brief look into my background, academic path, and professional objectives.</p>
        </div>
        
        <div className="about-grid">
          <div className="about-content">
            <h3 className="about-intro-title">Engineering with intent and precision.</h3>
            <p className="about-paragraph">
              I am an Informatics Engineering student dedicated to mastering fullstack development. I am deeply interested in constructing performant APIs, responsive web interfaces, and maintaining clean code practices.
            </p>
            <p className="about-paragraph">
              My goal is to secure a Fullstack Developer internship. I am prepared to contribute to codebases, collaborate with product teams, and apply my understanding of modern frameworks to build stable, scalable features.
            </p>
          </div>
          
          <div className="about-education">
            <h3 className="about-intro-title">Education</h3>
            <div className="timeline">
              <div className="timeline-item">
                <span className="timeline-date">2023 — Present</span>
                <h4 className="timeline-title">Bachelor of Informatics Engineering</h4>
                <p className="timeline-subtitle">Software Engineering, Databases & Algorithms</p>
              </div>
              
              <div className="timeline-item">
                <span className="timeline-date">2020 — 2023</span>
                <h4 className="timeline-title">High School Diploma</h4>
                <p className="timeline-subtitle">Science & Technology Major</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default About;
