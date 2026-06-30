import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

const navItems = [
  { label: 'Home',         target: 'hero' },
  { label: 'About',        target: 'about' },
  { label: 'Skills',       target: 'skills' },
  { label: 'Projects',     target: 'projects' },
  { label: 'Certificates', target: 'certificates' },
  { label: 'Contact',      target: 'contact' },
];

function Navbar({ user, onLogout }) {
  const navigate = useNavigate();
  const [isMenuOpen,    setIsMenuOpen]    = useState(false);
  const [activeSection, setActiveSection] = useState('hero');
  const [showDropdown,  setShowDropdown]  = useState(false);

  /* ── Intersection Observer for active section ── */
  useEffect(() => {
    const observerOptions = {
      root: null,
      rootMargin: '-64px 0px -60% 0px',
      threshold: 0.1,
    };
    const handleIntersection = (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) setActiveSection(entry.target.id);
      });
    };
    const observer = new IntersectionObserver(handleIntersection, observerOptions);
    navItems.forEach(({ target }) => {
      const el = document.getElementById(target);
      if (el) observer.observe(el);
    });
    return () => {
      navItems.forEach(({ target }) => {
        const el = document.getElementById(target);
        if (el) observer.unobserve(el);
      });
    };
  }, []);

  /* ── Close dropdown on outside click ── */
  useEffect(() => {
    if (!showDropdown) return;
    const handler = () => setShowDropdown(false);
    document.addEventListener('click', handler);
    return () => document.removeEventListener('click', handler);
  }, [showDropdown]);

  const handleLinkClick = (e, targetId) => {
    e.preventDefault();
    setIsMenuOpen(false);
    const element = document.getElementById(targetId);
    if (element) {
      const offset = 72;
      const bodyRect    = document.body.getBoundingClientRect().top;
      const elementRect = element.getBoundingClientRect().top;
      window.scrollTo({ top: elementRect - bodyRect - offset, behavior: 'smooth' });
      setActiveSection(targetId);
    }
  };

  const handleLogoutClick = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setShowDropdown(false);
    setIsMenuOpen(false);
    onLogout?.();
  };

  /* Initials avatar */
  const initials = user?.name
    ? user.name.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2)
    : user?.email?.[0]?.toUpperCase() ?? '?';

  return (
    <motion.header
      className="navbar-wrapper"
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
    >
      <div className="navbar-container">
        {/* Logo */}
        <a href="#hero" className="logo" onClick={(e) => handleLinkClick(e, 'hero')}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor"
            strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"
            style={{ color: 'var(--text-primary)' }}>
            <polygon points="12 2 2 22 22 22" />
          </svg>
          <span>Rav.dev</span>
        </a>

        {/* Desktop Nav */}
        <nav>
          <ul className={`nav-links ${isMenuOpen ? 'open' : ''}`}>
            {navItems.map((item) => (
              <li key={item.target}>
                <a
                  href={`#${item.target}`}
                  className={`nav-link ${activeSection === item.target ? 'active' : ''}`}
                  onClick={(e) => handleLinkClick(e, item.target)}
                >
                  {item.label}
                </a>
              </li>
            ))}

            {/* ── Auth area (mobile – inside drawer) ── */}
            <li className="nav-auth-mobile">
              {user ? (
                <>
                  {user.role === 'admin' && (
                    <button className="nav-auth-btn nav-admin-btn" onClick={() => { navigate('/admin'); setIsMenuOpen(false); }}>
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/>
                        <rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/>
                      </svg>
                      Dashboard
                    </button>
                  )}
                  <button className="nav-auth-btn nav-logout-btn" onClick={handleLogoutClick}>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
                      <polyline points="16 17 21 12 16 7"/>
                      <line x1="21" y1="12" x2="9" y2="12"/>
                    </svg>
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <button className="nav-auth-btn nav-login-btn" onClick={() => { navigate('/login'); setIsMenuOpen(false); }}>
                    Login
                  </button>
                  <button className="nav-auth-btn nav-register-btn" onClick={() => { navigate('/register'); setIsMenuOpen(false); }}>
                    Register
                  </button>
                </>
              )}
            </li>
          </ul>
        </nav>

        {/* ── Desktop Auth / User Area ── */}
        <div className="navbar-actions">
          {user ? (
            /* User is logged in → avatar + dropdown */
            <div className="nav-user-wrapper" onClick={(e) => { e.stopPropagation(); setShowDropdown((p) => !p); }}>
              <div className="nav-avatar" title={user.name || user.email}>
                {initials}
              </div>

              <AnimatePresence>
                {showDropdown && (
                  <motion.div
                    className="nav-dropdown"
                    initial={{ opacity: 0, y: -8, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0,  scale: 1    }}
                    exit={{   opacity: 0, y: -8, scale: 0.95 }}
                    transition={{ duration: 0.15 }}
                    onClick={(e) => e.stopPropagation()}
                  >
                    {/* User info */}
                    <div className="nav-dropdown-info">
                      <div className="nav-dropdown-avatar">{initials}</div>
                      <div>
                        <p className="nav-dropdown-name">{user.name || 'User'}</p>
                        <p className="nav-dropdown-email">{user.email}</p>
                      </div>
                    </div>

                    <div className="nav-dropdown-divider" />

                    {user.role === 'admin' && (
                      <button
                        className="nav-dropdown-item"
                        onClick={() => { navigate('/admin'); setShowDropdown(false); }}
                      >
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/>
                          <rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/>
                        </svg>
                        Admin Dashboard
                      </button>
                    )}

                    <button className="nav-dropdown-item nav-dropdown-logout" onClick={handleLogoutClick}>
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
                        <polyline points="16 17 21 12 16 7"/>
                        <line x1="21" y1="12" x2="9" y2="12"/>
                      </svg>
                      Logout
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ) : (
            /* Guest → Login + Register buttons */
            <div className="nav-guest-btns">
              <button className="nav-auth-btn nav-login-btn" onClick={() => navigate('/login')}>
                Login
              </button>
              <button className="nav-auth-btn nav-register-btn" onClick={() => navigate('/register')}>
                Register
              </button>
            </div>
          )}

          {/* Mobile hamburger */}
          <button
            className="mobile-menu-toggle"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="Toggle navigation menu"
          >
            {isMenuOpen ? (
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <line x1="18" y1="6"  x2="6"  y2="18" />
                <line x1="6"  y1="6"  x2="18" y2="18" />
              </svg>
            ) : (
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <line x1="4"  y1="12" x2="20" y2="12" />
                <line x1="4"  y1="6"  x2="20" y2="6"  />
                <line x1="4"  y1="18" x2="20" y2="18" />
              </svg>
            )}
          </button>
        </div>
      </div>
    </motion.header>
  );
}

export default Navbar;