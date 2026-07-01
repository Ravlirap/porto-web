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
    <div style={{
      background: '#0a0a0a',
      border: '1px solid rgba(255,255,255,0.08)',
      borderRadius: 8,
      padding: '24px 28px',
    }}>
      <p style={{ fontFamily: 'var(--font-mono)', fontSize: '0.7rem', color: '#555', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 10 }}>
        {label}
      </p>
      <p style={{ fontSize: '2rem', fontWeight: 700, color, letterSpacing: '-0.03em', lineHeight: 1 }}>
        {value}
      </p>
      {sub && <p style={{ fontSize: '0.78rem', color: '#555', marginTop: 6 }}>{sub}</p>}
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
              x={x} y={y} width={barW} height={barH}
              rx="3"
              fill={isLast ? '#fff' : 'rgba(255,255,255,0.12)'}
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
    admin:  { color: '#f43f5e', bg: 'rgba(244,63,94,0.1)',   border: 'rgba(244,63,94,0.3)' },
    editor: { color: '#f59e0b', bg: 'rgba(245,158,11,0.1)',  border: 'rgba(245,158,11,0.3)' },
    user:   { color: '#6b7280', bg: 'rgba(107,114,128,0.1)', border: 'rgba(107,114,128,0.3)' },
  };
  const s = map[role] || map.user;
  return (
    <span style={{
      fontFamily: 'var(--font-mono)',
      fontSize: '0.68rem',
      padding: '2px 8px',
      borderRadius: 9999,
      color: s.color,
      background: s.bg,
      border: `1px solid ${s.border}`,
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
      style={{
        minWidth: 34, height: 34, padding: '0 8px',
        borderRadius: 6,
        border: active ? '1px solid rgba(255,255,255,0.3)' : '1px solid rgba(255,255,255,0.08)',
        background: active ? 'rgba(255,255,255,0.08)' : 'transparent',
        color: disabled || content === '…' ? '#444' : active ? '#fff' : '#888',
        fontSize: '0.78rem', fontFamily: 'var(--font-mono)',
        cursor: disabled || content === '…' ? 'default' : 'pointer',
      }}
    >
      {content}
    </button>
  );

  return (
    <div style={{ display: 'flex', gap: 4, alignItems: 'center', flexWrap: 'wrap' }}>
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
      style={{
        padding: '6px 12px', borderRadius: 6, fontSize: '0.78rem',
        fontFamily: 'var(--font-mono)',
        border: current === val ? '1px solid rgba(255,255,255,0.3)' : '1px solid rgba(255,255,255,0.08)',
        background: current === val ? 'rgba(255,255,255,0.07)' : 'transparent',
        color: current === val ? '#fff' : '#666',
        cursor: 'pointer',
      }}
    >
      {label}
    </button>
  );

  // Memoized stats cards section
  const statsSection = useMemo(() => {
    if (loading) {
      return (
        <div className="admin-stats-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(150px,1fr))', gap: 12, marginBottom: 32 }}>
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} style={{ background: '#0a0a0a', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 8, padding: '24px 28px', height: 90, animation: 'skeleton-pulse 1.4s ease infinite' }} />
          ))}
        </div>
      );
    }
    if (!stats) return null;
    return (
      <div className="admin-stats-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(150px,1fr))', gap: 12, marginBottom: 32 }}>
        <StatCard label="Total Users"    value={fmt(stats.total)}          sub={`+${fmt(stats.new_this_month)} bulan ini`} />
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
      <div style={{
        background: '#0a0a0a',
        border: '1px solid rgba(255,255,255,0.08)',
        borderRadius: 8,
        padding: 28,
        marginBottom: 40,
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
          <div>
            <h2 style={{ fontSize: '1rem', fontWeight: 600, marginBottom: 2 }}>Registrasi Users</h2>
            <p style={{ color: '#555', fontSize: '0.78rem', fontFamily: 'var(--font-mono)' }}>12 bulan terakhir</p>
          </div>
        </div>
        <BarChart data={monthly} />
      </div>
    );
  }, [monthly]);

  return (
    <div style={{ minHeight: '100vh', background: '#000', color: '#fff', fontFamily: 'var(--font-sans)' }}>

      {/* ── Topbar ── */}
      <header style={{
        position: 'sticky', top: 0, zIndex: 100,
        background: 'rgba(0,0,0,0.8)',
        backdropFilter: 'blur(12px)',
        borderBottom: '1px solid rgba(255,255,255,0.08)',
        padding: '0 16px', height: 56,
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <polygon points="12 2 2 22 22 22" />
            </svg>
            <span style={{ fontWeight: 600, fontSize: '0.95rem' }}>Rav.dev</span>
          </div>
          <span style={{ color: 'rgba(255,255,255,0.15)', fontSize: '1rem' }}>/</span>
          <span style={{ color: '#888', fontSize: '0.85rem', fontFamily: 'var(--font-mono)' }}>admin</span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <span style={{ fontSize: '0.78rem', color: '#666', display: 'none', maxWidth: 140, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }} className="admin-email">{user?.email}</span>
          <RoleBadge role={user?.role || 'admin'} />
          <button
            onClick={handleLogout}
            style={{
              padding: '6px 12px', borderRadius: 6, fontSize: '0.78rem',
              border: '1px solid rgba(255,255,255,0.1)',
              background: 'transparent', color: '#888', cursor: 'pointer',
            }}
          >
            Logout
          </button>
        </div>
      </header>

      <main style={{ maxWidth: 1200, margin: '0 auto', padding: 'clamp(16px, 4vw, 40px) clamp(16px, 4vw, 32px)' }}>

        {/* ── Page Title ── */}
        <div style={{ marginBottom: 28 }}>
          <h1 style={{ fontSize: '1.4rem', fontWeight: 700, letterSpacing: '-0.03em', marginBottom: 4 }}>
            Dashboard
          </h1>
          <p style={{ color: '#555', fontSize: '0.875rem' }}>
            Overview data users dan statistik platform.
          </p>
        </div>

        {error && (
          <div style={{ marginBottom: 24, padding: '14px 18px', background: 'rgba(244,63,94,0.08)', border: '1px solid rgba(244,63,94,0.25)', borderRadius: 8, color: '#f43f5e', fontSize: '0.85rem', fontFamily: 'var(--font-mono)' }}>
            ⚠ {error}
          </div>
        )}

        {/* ── Stat Cards ── */}
        {statsSection}

        {/* ── Bar Chart ── */}
        {chartSection}

        {/* ── Users Table ── */}
        <div style={{
          background: '#0a0a0a',
          border: '1px solid rgba(255,255,255,0.08)',
          borderRadius: 8,
          overflow: 'hidden',
        }}>
          {/* Table Header */}
          <div style={{ padding: '16px', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 12, marginBottom: 16 }}>
              <div>
                <h2 style={{ fontSize: '1rem', fontWeight: 600 }}>Manajemen Users</h2>
                {meta && (
                  <p style={{ color: '#555', fontSize: '0.72rem', fontFamily: 'var(--font-mono)', marginTop: 2 }}>
                    {fmt(meta.totalData)} users · Hal. {meta.page}/{fmt(meta.totalPages)}
                  </p>
                )}
              </div>

              {/* Search */}
              <form onSubmit={handleSearch} style={{ display: 'flex', gap: 8, flex: 1, minWidth: 0 }}>
                <input
                  type="text"
                  value={inputVal}
                  onChange={e => setInputVal(e.target.value)}
                  placeholder="Cari nama / email..."
                  style={{
                    padding: '7px 12px', background: '#030303',
                    border: '1px solid rgba(255,255,255,0.08)', borderRadius: 6,
                    color: '#fff', fontSize: '0.82rem', outline: 'none', flex: 1, minWidth: 0,
                    fontFamily: 'var(--font-sans)',
                  }}
                />
                <button type="submit" style={{
                  padding: '7px 14px', background: '#fff', color: '#000',
                  border: 'none', borderRadius: 6, fontSize: '0.82rem',
                  fontWeight: 600, cursor: 'pointer', whiteSpace: 'nowrap', flexShrink: 0,
                }}>
                  Cari
                </button>
              </form>
            </div>

            {/* Filters */}
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
              <div style={{ display: 'flex', gap: 6 }}>
                {filterBtn('Semua Role', '',       roleF, setRoleF)}
                {filterBtn('Admin',      'admin',  roleF, setRoleF)}
                {filterBtn('Editor',     'editor', roleF, setRoleF)}
                {filterBtn('User',       'user',   roleF, setRoleF)}
              </div>
              <div style={{ width: 1, background: 'rgba(255,255,255,0.08)' }} />
              <div style={{ display: 'flex', gap: 6 }}>
                {filterBtn('Semua Status', '',      activeF, setActiveF)}
                {filterBtn('Aktif',        'true',  activeF, setActiveF)}
                {filterBtn('Nonaktif',     'false', activeF, setActiveF)}
              </div>
            </div>
          </div>

          {/* Table Body */}
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                  {['ID', 'Nama', 'Email', 'Role', 'Status', 'Bergabung'].map(h => (
                    <th key={h} style={{
                      padding: '12px 16px', textAlign: 'left',
                      fontFamily: 'var(--font-mono)', fontSize: '0.7rem',
                      color: '#555', textTransform: 'uppercase', letterSpacing: '0.08em',
                      fontWeight: 500, whiteSpace: 'nowrap',
                    }}>
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {uLoading ? (
                  Array.from({ length: 10 }).map((_, i) => (
                    <tr key={i} style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                      {Array.from({ length: 6 }).map((_, j) => (
                        <td key={j} style={{ padding: '14px 16px' }}>
                          <div style={{ height: 12, width: `${[30,80,100,40,40,50][j]}%`, background: 'rgba(255,255,255,0.05)', borderRadius: 4, animation: 'skeleton-pulse 1.4s ease infinite' }} />
                        </td>
                      ))}
                    </tr>
                  ))
                ) : users.length === 0 ? (
                  <tr>
                    <td colSpan={6} style={{ padding: '48px', textAlign: 'center', color: '#444', fontFamily: 'var(--font-mono)', fontSize: '0.82rem' }}>
                      Tidak ada data ditemukan.
                    </td>
                  </tr>
                ) : users.map((u) => (
                  <tr
                    key={u.id}
                    style={{ borderBottom: '1px solid rgba(255,255,255,0.04)', transition: 'background 0.1s' }}
                    onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.02)'}
                    onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                  >
                    <td style={{ padding: '13px 16px', color: '#555', fontFamily: 'var(--font-mono)', fontSize: '0.75rem' }}>
                      #{u.id}
                    </td>
                    <td style={{ padding: '13px 16px', fontWeight: 500, color: '#e5e5e5', whiteSpace: 'nowrap' }}>
                      {u.name}
                    </td>
                    <td style={{ padding: '13px 16px', color: '#888', fontFamily: 'var(--font-mono)', fontSize: '0.78rem' }}>
                      {u.email}
                    </td>
                    <td style={{ padding: '13px 16px' }}>
                      <RoleBadge role={u.role} />
                    </td>
                    <td style={{ padding: '13px 16px' }}>
                      <span style={{
                        fontFamily: 'var(--font-mono)', fontSize: '0.68rem',
                        padding: '2px 8px', borderRadius: 9999,
                        color:      u.is_active ? '#10b981' : '#6b7280',
                        background: u.is_active ? 'rgba(16,185,129,0.1)' : 'rgba(107,114,128,0.1)',
                        border:     u.is_active ? '1px solid rgba(16,185,129,0.3)' : '1px solid rgba(107,114,128,0.3)',
                      }}>
                        {u.is_active ? 'Aktif' : 'Nonaktif'}
                      </span>
                    </td>
                    <td style={{ padding: '13px 16px', color: '#555', fontFamily: 'var(--font-mono)', fontSize: '0.75rem', whiteSpace: 'nowrap' }}>
                      {new Date(u.created_at).toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' })}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {meta && meta.totalPages > 1 && (
            <div style={{
              padding: '16px 24px',
              borderTop: '1px solid rgba(255,255,255,0.06)',
              display: 'flex', justifyContent: 'space-between', alignItems: 'center',
              flexWrap: 'wrap', gap: 12,
            }}>
              <p style={{ fontFamily: 'var(--font-mono)', fontSize: '0.72rem', color: '#555' }}>
                {fmt((meta.page - 1) * meta.limit + 1)}–{fmt(Math.min(meta.page * meta.limit, meta.totalData))} dari {fmt(meta.totalData)}
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