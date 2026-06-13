function Hero() {
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
    <section id="hero" className="section hero-section">
      <div className="container">
        <div className="hero-grid">
          <div className="hero-content">
            <div className="hero-status-pill">
              <span className="status-dot"></span>
              <span>Available for Fullstack Internship</span>
            </div>
            
            <h1 className="hero-title">
              Crafting premium<br />web experiences.
            </h1>
            
            <p className="hero-description">
              Informatics Engineering student focused on building high-performance frontend interfaces, robust API backends, and elegant user-centric software.
            </p>
            
            <div className="hero-actions">
              <a href="#projects" onClick={(e) => handleScroll(e, 'projects')} className="btn-vercel">
                Explore Projects
              </a>
              <a href="#contact" onClick={(e) => handleScroll(e, 'contact')} className="btn-vercel-outline">
                Contact Me
              </a>
            </div>
          </div>
          
          <div className="hero-visual">
            <div className="dashboard-mockup">
              <div className="mockup-header">
                <div className="mockup-dots">
                  <span className="mockup-dot"></span>
                  <span className="mockup-dot"></span>
                  <span className="mockup-dot"></span>
                </div>
                <div className="mockup-title">developer.js</div>
              </div>
              <div className="mockup-body">
                <div className="code-line">
                  <span className="code-num">1</span>
                  <span className="code-text"><span className="code-keyword">const</span> developer = &#123;</span>
                </div>
                <div className="code-line">
                  <span className="code-num">2</span>
                  <span className="code-text">&nbsp;&nbsp;name: <span className="code-string">'Rav'</span>,</span>
                </div>
                <div className="code-line">
                  <span className="code-num">3</span>
                  <span className="code-text">&nbsp;&nbsp;focus: <span className="code-string">'Fullstack Web Development'</span>,</span>
                </div>
                <div className="code-line">
                  <span className="code-num">4</span>
                  <span className="code-text">&nbsp;&nbsp;coreStack: [<span className="code-string">'React'</span>, <span className="code-string">'Node'</span>, <span className="code-string">'Laravel'</span>],</span>
                </div>
                <div className="code-line">
                  <span className="code-num">5</span>
                  <span className="code-text">&nbsp;&nbsp;passion: <span className="code-string">'Clean Code & Performance'</span></span>
                </div>
                <div className="code-line">
                  <span className="code-num">6</span>
                  <span className="code-text">&#125;;</span>
                </div>
                <div className="code-line">
                  <span className="code-num">7</span>
                  <span className="code-text"></span>
                </div>
                <div className="code-line">
                  <span className="code-num">8</span>
                  <span className="code-text"><span className="code-keyword">export default</span> <span className="code-function">initPortfolio</span>(developer);</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Hero;
