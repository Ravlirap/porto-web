import { useState, useEffect, useCallback, memo, useMemo } from 'react';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000';

// ─── Helpers ──────────────────────────────────────────────────
const authHeader = () => ({
  'Content-Type': 'application/json',
  Authorization: `Bearer ${localStorage.getItem('token')}`,
});

const fmt = (n) => Number(n).toLocaleString('id-ID');

// ─── Stat Card ────────────────────────────────────────────────
const StatCard = memo(function StatCard({ label, value, sub, color = '#fff' }) {
  return (
    <div className="admin-stat-card" style={{ '--card-accent': color }}>
      <p className="admin-stat-label">{label}</p>
      <p className="admin-stat-value" style={{ color }}>{value}</p>
      {sub && <p className="admin-stat-sub">{sub}</p>}
    </div>
  );
});

// ─── Mini Bar Chart (native SVG, no library) ─────────────────
const BarChart = memo(function BarChart({ data }) {
  if (!data || data.length === 0) return null;

  const W = 600, H = 160, PAD = { top: 16, right: 16, bottom: 40, left: 48 };
  const innerW = W - PAD.left - PAD.right;
  const innerH = H - PAD.top  - PAD.bottom;

  const maxVal = Math.max(...data.map(d => parseInt(d.count)), 1);
  const barW   = innerW / data.length - 4;

  return (
    <svg
      viewBox={`0 0 ${W} ${H}`}
      style={{ width: '100%', height: 'auto', overflow: 'visible' }}
    >
      {/* Y-axis gridlines */}
      {[0, 0.25, 0.5, 0.75, 1].map((frac) => {
        const y = PAD.top + innerH * (1 - frac);
        return (
          <g key={frac}>
            <line x1={PAD.left} y1={y} x2={PAD.left + innerW} y2={y}
              stroke="rgba(255,255,255,0.05)" strokeWidth="1" />
            <text x={PAD.left - 8} y={y + 4} textAnchor="end"
              fill="#555" fontSize="10" fontFamily="monospace">
              {fmt(Math.round(maxVal * frac))}
            </text>
          </g>
        );
      })}

      {/* Bars */}
      {data.map((d, i) => {
        const barH   = Math.max((parseInt(d.count) / maxVal) * innerH, 2);
        const x      = PAD.left + i * (innerW / data.length) + 2;
        const y      = PAD.top + innerH - barH;
        const isLast = i === data.length - 1;

        return (
          <g key={i}>
            <rect
              className="admin-chart-bar"
              x={x} y={y} width={barW} height={barH}
              rx="3"
              fill={isLast ? 'var(--accent-cyan)' : 'rgba(255,255,255,0.12)'}
            />
            <text
              x={x + barW / 2}
              y={PAD.top + innerH + 18}
              textAnchor="middle"
              fill="#555"
              fontSize="9"
              fontFamily="monospace"
            >
              {d.month.split(' ')[0]}
            </text>
          </g>
        );
      })}
    </svg>
  );
});

// ─── Role Badge ───────────────────────────────────────────────
const RoleBadge = memo(function RoleBadge({ role }) {
  const map = {
    admin:  { color: '#f43f5e', bg: 'rgba(244,63,94,0.08)',   border: 'rgba(244,63,94,0.2)' },
    editor: { color: '#f59e0b', bg: 'rgba(245,158,11,0.08)',  border: 'rgba(245,158,11,0.2)' },
    user:   { color: '#a1a1aa', bg: 'rgba(161,161,170,0.08)', border: 'rgba(161,161,170,0.2)' },
  };
  const s = map[role] || map.user;
  return (
    <span style={{
      fontFamily: 'var(--font-mono)',
      fontSize: '0.68rem',
      padding: '2px 8px',
      borderRadius: '6px',
      color: s.color,
      background: s.bg,
      border: `1px solid ${s.border}`,
      textTransform: 'uppercase',
      letterSpacing: '0.05em',
      fontWeight: 500,
      display: 'inline-block',
    }}>
      {role}
    </span>
  );
});

// ─── Pagination ───────────────────────────────────────────────
function Pagination({ meta, onChange }) {
  const { page, totalPages } = meta;
  const pages = [];
  const delta = 2;
  const left  = Math.max(2, page - delta);
  const right = Math.min(totalPages - 1, page + delta);

  pages.push(1);
  if (left > 2) pages.push('…');
  for (let i = left; i <= right; i++) pages.push(i);
  if (right < totalPages - 1) pages.push('…');
  if (totalPages > 1) pages.push(totalPages);

  const btn = (content, targetPage, disabled = false, active = false) => (
    <button
      key={`${content}-${targetPage}`}
      disabled={disabled || content === '…'}
      onClick={() => content !== '…' && onChange(targetPage)}
      className={`admin-btn-page ${active ? 'active' : ''}`}
    >
      {content}
    </button>
  );

  return (
    <div className="admin-pagination-controls">
      {btn('←', page - 1, !meta.hasPrevPage)}
      {pages.map((p, i) => btn(p, p, false, p === page))}
      {btn('→', page + 1, !meta.hasNextPage)}
    </div>
  );
}

// ─── Main Admin Dashboard ─────────────────────────────────────
function AdminDashboard({ user, onLogout }) {
  const [stats,   setStats]   = useState(null);
  const [monthly, setMonthly] = useState([]);
  const [users,   setUsers]   = useState([]);
  const [meta,    setMeta]    = useState(null);
  const [loading, setLoading] = useState(true);
  const [uLoading,setULoading]= useState(true);
  const [error,   setError]   = useState('');

  // Filter state
  const [page,     setPage]     = useState(1);
  const [search,   setSearch]   = useState('');
  const [inputVal, setInputVal] = useState('');
  const [roleF,    setRoleF]    = useState('');
  const [activeF,  setActiveF]  = useState('');

  // ── Fetch stats ─────────────────────────────────────────────
  useEffect(() => {
    (async () => {
      try {
        const res  = await fetch(`${API_BASE}/api/admin/stats`, { headers: authHeader() });
        const json = await res.json();
        if (!res.ok) throw new Error(json.message);
        setStats(json.stats);
        setMonthly(json.monthly);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  // ── Fetch users ─────────────────────────────────────────────
  const fetchUsers = useCallback(async (signal) => {
    setULoading(true);
    try {
      const params = new URLSearchParams({ page, limit: 20 });
      if (search)  params.append('search',    search);
      if (roleF)   params.append('role',      roleF);
      if (activeF) params.append('is_active', activeF);

      const res  = await fetch(`${API_BASE}/api/admin/users?${params}`, { 
        headers: authHeader(),
        signal 
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.message);
      setUsers(json.data);
      setMeta(json.meta);
    } catch (err) {
      if (err.name !== 'AbortError') {
        setError(err.message);
      }
    } finally {
      if (!signal || !signal.aborted) {
        setULoading(false);
      }
    }
  }, [page, search, roleF, activeF]);

  // Handle fetch trigger with AbortController cancellation
  useEffect(() => {
    const controller = new AbortController();
    fetchUsers(controller.signal);
    return () => controller.abort();
  }, [fetchUsers]);

  // Debounce search input typing to search automatically
  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      setSearch(inputVal.trim());
      setPage(1);
    }, 300);

    return () => clearTimeout(delayDebounceFn);
  }, [inputVal]);

  const handleSearch = (e) => {
    e.preventDefault();
    setPage(1);
    setSearch(inputVal.trim());
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    onLogout();
  };

  // ── Layout helpers ──────────────────────────────────────────
  const filterBtn = (label, val, current, setter) => (
    <button
      key={val}
      onClick={() => { setter(val); setPage(1); }}
      className={`admin-btn-filter ${current === val ? 'active' : ''}`}
    >
      {label}
    </button>
  );

  // Memoized stats cards section
  const statsSection = useMemo(() => {
    if (loading) {
      return (
        <div className="admin-stats-grid">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="admin-stat-card" style={{ height: 110, animation: 'skeleton-pulse 1.4s ease infinite' }} />
          ))}
        </div>
      );
    }
    if (!stats) return null;
    return (
      <div className="admin-stats-grid">
        <StatCard label="Total Users"    value={fmt(stats.total)}          sub={`+${fmt(stats.new_this_month)} bulan ini`} color="var(--accent-cyan)" />
        <StatCard label="Aktif"          value={fmt(stats.active)}         color="#10b981" />
        <StatCard label="Nonaktif"       value={fmt(stats.inactive)}       color="#f43f5e" />
        <StatCard label="Admin"          value={fmt(stats.admins)}         color="#f59e0b" />
        <StatCard label="Editor"         value={fmt(stats.editors)}        color="#3b82f6" />
        <StatCard label="Minggu ini"     value={`+${fmt(stats.new_this_week)}`} color="#a78bfa" />
      </div>
    );
  }, [loading, stats]);

  // Memoized monthly chart section
  const chartSection = useMemo(() => {
    if (monthly.length === 0) return null;
    return (
      <div className="admin-chart-card">
        <div className="admin-chart-header">
          <div>
            <h2 className="admin-chart-title">Registrasi Users</h2>
            <p className="admin-chart-subtitle">12 bulan terakhir</p>
          </div>
        </div>
        <div className="admin-chart-svg-container">
          <BarChart data={monthly} />
        </div>
      </div>
    );
  }, [monthly]);

  return (
    <div className="admin-dashboard-container">
      {/* Background Glowing Blobs for Depth */}
      <div className="bg-glow top-left" />
      <div className="bg-glow bottom-right" />

      {/* ── Topbar ── */}
      <header className="admin-header">
        <div className="admin-header-left">
          <div className="admin-logo">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <polygon points="12 2 2 22 22 22" />
            </svg>
            <span>Rav.dev</span>
          </div>
          <span style={{ color: 'rgba(255,255,255,0.15)', fontSize: '1rem' }}>/</span>
          <span style={{ color: 'var(--text-muted)', fontSize: '0.85rem', fontFamily: 'var(--font-mono)' }}>admin</span>
        </div>

        <div className="admin-header-right">
          <span className="admin-email">{user?.email}</span>
          <RoleBadge role={user?.role || 'admin'} />
          <button onClick={handleLogout} className="admin-btn-logout">
            Logout
          </button>
        </div>
      </header>

      <main className="admin-main">

        {/* ── Page Title ── */}
        <div className="admin-title-section">
          <h1>Dashboard</h1>
          <p>Overview data users dan statistik platform.</p>
        </div>

        {error && (
          <div style={{ marginBottom: 24, padding: '14px 18px', background: 'rgba(244,63,94,0.06)', border: '1px solid rgba(244,63,94,0.2)', borderRadius: 8, color: '#f43f5e', fontSize: '0.85rem', fontFamily: 'var(--font-mono)' }}>
            ⚠ {error}
          </div>
        )}

        {/* ── Stat Cards ── */}
        {statsSection}

        {/* ── Bar Chart ── */}
        {chartSection}

        {/* ── Users Table ── */}
        <div className="admin-table-card">
          {/* Table Header */}
          <div className="admin-table-header">
            <div className="admin-table-header-top">
              <div className="admin-table-title-group">
                <h2>Manajemen Users</h2>
                {meta && (
                  <p>
                    {meta.totalData === 10000 ? '10.000+' : fmt(meta.totalData)} users · Hal. {meta.page}/{meta.totalData === 10000 ? '500+' : fmt(meta.totalPages)}
                  </p>
                )}
              </div>

              {/* Search */}
              <form onSubmit={handleSearch} className="admin-search-form">
                <input
                  type="text"
                  value={inputVal}
                  onChange={e => setInputVal(e.target.value)}
                  placeholder="Cari nama / email..."
                  className="admin-search-input"
                />
                <button type="submit" className="admin-search-btn">
                  Cari
                </button>
              </form>
            </div>

            {/* Filters */}
            <div className="admin-filters-wrapper">
              <div className="admin-filter-group">
                {filterBtn('Semua Role', '',       roleF, setRoleF)}
                {filterBtn('Admin',      'admin',  roleF, setRoleF)}
                {filterBtn('Editor',     'editor', roleF, setRoleF)}
                {filterBtn('User',       'user',   roleF, setRoleF)}
              </div>
              <div className="admin-filter-divider" />
              <div className="admin-filter-group">
                {filterBtn('Semua Status', '',      activeF, setActiveF)}
                {filterBtn('Aktif',        'true',  activeF, setActiveF)}
                {filterBtn('Nonaktif',     'false', activeF, setActiveF)}
              </div>
            </div>
          </div>

          {/* Table Body */}
          <div className="admin-table-container">
            <table className="admin-table">
              <thead>
                <tr>
                  {['ID', 'Nama', 'Email', 'Role', 'Status', 'Bergabung'].map(h => (
                    <th key={h} className="admin-th">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {uLoading ? (
                  Array.from({ length: 10 }).map((_, i) => (
                    <tr key={i} className="admin-tr">
                      {Array.from({ length: 6 }).map((_, j) => (
                        <td key={j} className="admin-td">
                          <div style={{ height: 12, width: `${[30,80,100,40,40,50][j]}%`, background: 'rgba(255,255,255,0.05)', borderRadius: 4, animation: 'skeleton-pulse 1.4s ease infinite' }} />
                        </td>
                      ))}
                    </tr>
                  ))
                ) : users.length === 0 ? (
                  <tr>
                    <td colSpan={6} style={{ padding: '48px', textAlign: 'center', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)', fontSize: '0.82rem' }}>
                      Tidak ada data ditemukan.
                    </td>
                  </tr>
                ) : users.map((u) => (
                  <tr key={u.id} className="admin-tr">
                    <td className="admin-td" style={{ color: 'var(--text-muted)', fontFamily: 'var(--font-mono)', fontSize: '0.75rem' }}>
                      #{u.id}
                    </td>
                    <td className="admin-td" style={{ fontWeight: 500, color: 'var(--text-primary)', whiteSpace: 'nowrap' }}>
                      {u.name}
                    </td>
                    <td className="admin-td" style={{ color: 'var(--text-secondary)', fontFamily: 'var(--font-mono)', fontSize: '0.78rem' }}>
                      {u.email}
                    </td>
                    <td className="admin-td">
                      <RoleBadge role={u.role} />
                    </td>
                    <td className="admin-td">
                      <span className={`admin-badge-status ${u.is_active ? 'active' : 'inactive'}`}>
                        {u.is_active ? 'Aktif' : 'Nonaktif'}
                      </span>
                    </td>
                    <td className="admin-td" style={{ color: 'var(--text-muted)', fontFamily: 'var(--font-mono)', fontSize: '0.75rem', whiteSpace: 'nowrap' }}>
                      {new Date(u.created_at).toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' })}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {meta && meta.totalPages > 1 && (
            <div className="admin-pagination-container">
              <p className="admin-pagination-info">
                {fmt((meta.page - 1) * meta.limit + 1)}–{fmt(Math.min(meta.page * meta.limit, meta.totalData))} dari {meta.totalData === 10000 ? '10.000+' : fmt(meta.totalData)}
              </p>
              <Pagination meta={meta} onChange={(p) => { setPage(p); window.scrollTo({ top: 0 }); }} />
            </div>
          )}
        </div>
      </main>

      <style>{`
        @keyframes skeleton-pulse {
          0%, 100% { opacity: 0.4; }
          50%       { opacity: 0.8; }
        }
      `}</style>
    </div>
  );
}

export default AdminDashboard;