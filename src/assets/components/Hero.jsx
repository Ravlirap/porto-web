import heroImg from '../hero.png';

function Hero() {
  const handleScroll = (e, targetId) => {
    e.preventDefault();
    const element = document.getElementById(targetId);
    if (element) {
      const offset = 80;
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
    <section id="hero" className="section hero-section flex-center">
      <div className="glow-blob"></div>
      <div className="glow-blob glow-blob-secondary" style={{ right: '10%', top: '20%' }}></div>
      
      <div className="container hero-grid animate-fade-in">
        <div className="hero-content">
          <span className="hero-welcome">Hi, I'm</span>
          <h1 className="hero-name">Keyzol</h1>
          <h2 className="hero-tagline">Building High-Performance Fullstack Web Apps</h2>
          <p className="hero-desc">
            I'm a Computer Science student preparing myself for a Fullstack Developer career. 
            Passionate about building responsive, high-performance web applications and mastering modern web technologies.
          </p>
          <div className="hero-ctas">
            <a href="#skills" onClick={(e) => handleScroll(e, 'skills')} className="btn btn-primary">
              View Skills
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <line x1="5" y1="12" x2="19" y2="12"></line>
                <polyline points="12 5 19 12 12 19"></polyline>
              </svg>
            </a>
            <a href="#footer" onClick={(e) => handleScroll(e, 'footer')} className="btn btn-secondary">
              Contact Me
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                <polyline points="22,6 12,13 2,6"></polyline>
              </svg>
            </a>
          </div>
        </div>
        
        <div className="hero-visual">
          <div className="hero-image-wrapper animate-float">
            <div className="hero-image-glow animate-glow"></div>
            {heroImg ? (
              <img 
                src={heroImg} 
                alt="Keyzol Profile" 
                className="hero-image" 
                onError={(e) => { 
                  e.target.style.display = 'none'; 
                }} 
              />
            ) : null}
            <div className="hero-image-placeholder">
              <svg width="100" height="100" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" style={{ color: 'var(--accent-primary)', opacity: 0.8 }}>
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                <circle cx="12" cy="7" r="4"></circle>
              </svg>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Hero;
