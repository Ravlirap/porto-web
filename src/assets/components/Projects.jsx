import { useState, useEffect, useCallback } from 'react';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000';

// ─── Status Badge ──────────────────────────────────────────────────────────
function StatusBadge({ status }) {
  const map = {
    active:      { label: 'Active',      color: '#10b981' },
    in_progress: { label: 'In Progress', color: '#f59e0b' },
    archived:    { label: 'Archived',    color: '#6b7280' },
  };
  const { label, color } = map[status] || map.archived;
  return (
    <span style={{
      fontFamily: 'var(--font-mono)',
      fontSize: '0.65rem',
      padding: '2px 8px',
      borderRadius: '9999px',
      border: `1px solid ${color}33`,
      color,
      backgroundColor: `${color}11`,
    }}>
      {label}
    </span>
  );
}

// ─── Skeleton Card ─────────────────────────────────────────────────────────
function SkeletonCard() {
  return (
    <div className="premium-card project-card" style={{ gap: 12 }}>
      {[80, 140, 100, 60].map((w, i) => (
        <div key={i} style={{
          height: i === 0 ? 14 : i === 2 ? 60 : 14,
          width: `${w}%`,
          background: 'rgba(255,255,255,0.05)',
          borderRadius: 4,
          animation: 'skeleton-pulse 1.4s ease infinite',
        }} />
      ))}
    </div>
  );
}

// ─── Pagination Controls ───────────────────────────────────────────────────
function PaginationBar({ meta, onPageChange }) {
  const { page, totalPages, hasNextPage, hasPrevPage } = meta;

  // Kalkulasi range nomor halaman yang ditampilkan (max 5 tombol)
  const getPageRange = () => {
    const delta  = 2;
    const range  = [];
    const left   = Math.max(2, page - delta);
    const right  = Math.min(totalPages - 1, page + delta);

    range.push(1);
    if (left > 2) range.push('...');
    for (let i = left; i <= right; i++) range.push(i);
    if (right < totalPages - 1) range.push('...');
    if (totalPages > 1) range.push(totalPages);

    return range;
  };

  const btnStyle = (active, disabled) => ({
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: 36,
    height: 36,
    padding: '0 10px',
    borderRadius: 6,
    border: active
      ? '1px solid rgba(255,255,255,0.3)'
      : '1px solid var(--border-color)',
    background: active
      ? 'rgba(255,255,255,0.08)'
      : 'transparent',
    color: disabled
      ? 'var(--text-muted)'
      : active
        ? 'var(--text-primary)'
        : 'var(--text-secondary)',
    fontSize: '0.8rem',
    fontFamily: 'var(--font-mono)',
    cursor: disabled ? 'not-allowed' : 'pointer',
    transition: 'all 0.15s ease',
    opacity: disabled ? 0.4 : 1,
  });

  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 6,
      marginTop: 48,
      flexWrap: 'wrap',
    }}>
      {/* Prev */}
      <button
        style={btnStyle(false, !hasPrevPage)}
        disabled={!hasPrevPage}
        onClick={() => onPageChange(page - 1)}
      >
        ← Prev
      </button>

      {/* Page Numbers */}
      {getPageRange().map((p, idx) =>
        p === '...'
          ? <span key={`ellipsis-${idx}`} style={{ color: 'var(--text-muted)', padding: '0 4px', fontSize: '0.8rem' }}>…</span>
          : <button
              key={p}
              style={btnStyle(p === page, false)}
              onClick={() => onPageChange(p)}
            >
              {p}
            </button>
      )}

      {/* Next */}
      <button
        style={btnStyle(false, !hasNextPage)}
        disabled={!hasNextPage}
        onClick={() => onPageChange(page + 1)}
      >
        Next →
      </button>
    </div>
  );
}

// ─── Main Component ────────────────────────────────────────────────────────
function Projects() {
  const [projects, setProjects]   = useState([]);
  const [meta, setMeta]           = useState(null);
  const [loading, setLoading]     = useState(true);
  const [error, setError]         = useState(null);

  // Filter & pagination state
  const [page, setPage]           = useState(1);
  const [search, setSearch]       = useState('');
  const [searchInput, setSearchInput] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  const LIMIT = 9;

  // ── Fetch data dari backend ──
  const fetchProjects = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams({ page, limit: LIMIT });
      if (search)       params.append('search', search);
      if (statusFilter) params.append('status', statusFilter);

      const res  = await fetch(`${API_BASE}/api/projects?${params}`);
      if (!res.ok) throw new Error(`Server error: ${res.status}`);
      const json = await res.json();

      setProjects(json.data);
      setMeta(json.meta);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [page, search, statusFilter]);

  useEffect(() => {
    fetchProjects();
  }, [fetchProjects]);

  // Reset ke page 1 saat filter berubah
  const handleSearch = (e) => {
    e.preventDefault();
    setPage(1);
    setSearch(searchInput.trim());
  };

  const handleStatusChange = (val) => {
    setPage(1);
    setStatusFilter(val);
  };

  const handlePageChange = (newPage) => {
    setPage(newPage);
    // Scroll ke section projects
    document.getElementById('projects')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <>
      {/* Skeleton pulse keyframes */}
      <style>{`
        @keyframes skeleton-pulse {
          0%, 100% { opacity: 0.4; }
          50%       { opacity: 0.8; }
        }
      `}</style>

      <section id="projects" className="section">
        <div className="container">

          {/* ── Section Header ── */}
          <div className="section-header">
            <span className="section-label">03. Selected Work</span>
            <h2 className="section-title">Featured Projects</h2>
            <p className="section-subtitle">
              A collection of systems and applications engineered with high performance and clean architectures.
            </p>
          </div>

          {/* ── Filter Bar ── */}
          <div className="projects-filter-bar">
            {/* Search */}
            <form onSubmit={handleSearch} style={{ display: 'flex', gap: 8, flex: 1, minWidth: 0 }}>
              <input
                type="text"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                placeholder="Search projects..."
                className="form-input"
                style={{ flex: 1, padding: '8px 14px', fontSize: '0.85rem', minWidth: 0 }}
              />
              <button type="submit" className="btn-vercel" style={{ padding: '8px 16px', whiteSpace: 'nowrap' }}>
                Search
              </button>
            </form>

            {/* Status Filter */}
            <div className="projects-status-filters">
              {['', 'active', 'in_progress', 'archived'].map((s) => (
                <button
                  key={s || 'all'}
                  onClick={() => handleStatusChange(s)}
                  style={{
                    padding: '7px 12px',
                    borderRadius: 6,
                    border: statusFilter === s
                      ? '1px solid rgba(255,255,255,0.3)'
                      : '1px solid var(--border-color)',
                    background: statusFilter === s
                      ? 'rgba(255,255,255,0.07)'
                      : 'transparent',
                    color: statusFilter === s ? 'var(--text-primary)' : 'var(--text-secondary)',
                    fontSize: '0.8rem',
                    cursor: 'pointer',
                    transition: 'all 0.15s ease',
                    fontFamily: 'var(--font-mono)',
                    whiteSpace: 'nowrap',
                  }}
                >
                  {s === '' ? 'All' : s === 'in_progress' ? 'In Progress' : s.charAt(0).toUpperCase() + s.slice(1)}
                </button>
              ))}
            </div>
          </div>

          {/* ── Meta Info ── */}
          {meta && !loading && (
            <p style={{
              fontFamily: 'var(--font-mono)',
              fontSize: '0.72rem',
              color: 'var(--text-muted)',
              marginBottom: 24,
            }}>
              Showing {((meta.page - 1) * meta.limit) + 1}–{Math.min(meta.page * meta.limit, meta.totalData)} of {meta.totalData.toLocaleString()} projects
              &nbsp;·&nbsp; Page {meta.page} / {meta.totalPages.toLocaleString()}
            </p>
          )}

          {/* ── Error State ── */}
          {error && (
            <div style={{
              padding: '24px',
              border: '1px solid rgba(244, 63, 94, 0.3)',
              borderRadius: 8,
              background: 'rgba(244, 63, 94, 0.05)',
              color: '#f43f5e',
              fontFamily: 'var(--font-mono)',
              fontSize: '0.85rem',
              marginBottom: 32,
            }}>
              ⚠ Failed to load projects: {error}
            </div>
          )}

          {/* ── Projects Grid ── */}
          <div className="projects-grid">
            {loading
              ? Array.from({ length: LIMIT }).map((_, i) => <SkeletonCard key={i} />)
              : projects.length === 0
                ? (
                  <div style={{
                    gridColumn: '1 / -1',
                    textAlign: 'center',
                    padding: '60px 0',
                    color: 'var(--text-muted)',
                    fontFamily: 'var(--font-mono)',
                    fontSize: '0.85rem',
                  }}>
                    No projects found.
                  </div>
                )
                : projects.map((project) => (
                  <div key={project.id} className="premium-card project-card">
                    <div className="project-meta">
                      <span className="project-tag">{project.tag}</span>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <StatusBadge status={project.status} />
                        <a
                          href={project.github_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="project-link-icon"
                          aria-label={`View ${project.title} on GitHub`}
                        >
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <line x1="7" y1="17" x2="17" y2="7" />
                            <polyline points="7 7 17 7 17 17" />
                          </svg>
                        </a>
                      </div>
                    </div>

                    <h3 className="project-name">{project.title}</h3>
                    <p className="project-desc">{project.description}</p>

                    {/* Stars */}
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 4,
                      marginBottom: 16,
                      color: 'var(--text-muted)',
                      fontSize: '0.78rem',
                      fontFamily: 'var(--font-mono)',
                    }}>
                      <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor" stroke="none">
                        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                      </svg>
                      {project.stars.toLocaleString()}
                    </div>

                    <div className="project-tech-list">
                      {(project.tech_stack || []).map((tech, idx) => (
                        <span key={idx} className="project-tech-tag">{tech}</span>
                      ))}
                    </div>
                  </div>
                ))
            }
          </div>

          {/* ── Pagination ── */}
          {meta && !loading && meta.totalPages > 1 && (
            <PaginationBar meta={meta} onPageChange={handlePageChange} />
          )}

        </div>
      </section>
    </>
  );
}

export default Projects;