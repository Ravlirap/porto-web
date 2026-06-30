import { useState } from 'react';
import { Link } from 'react-router-dom';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000';

function Register({ onRegisterSuccess }) {
  const [form, setForm]       = useState({ name: '', email: '', password: '' });
  const [error, setError]     = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (form.password.length < 6) {
      setError('Password minimal 6 karakter.');
      return;
    }
    setLoading(true);
    try {
      const res  = await fetch(`${API_BASE}/api/auth/register`, {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify(form),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.message);

      localStorage.setItem('token', json.token);
      localStorage.setItem('user', JSON.stringify(json.user));
      onRegisterSuccess(json.user);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const inputStyle = {
    padding: '11px 14px',
    background: '#030303',
    border: '1px solid rgba(255,255,255,0.08)',
    borderRadius: 6,
    color: '#fff',
    fontSize: '0.9rem',
    outline: 'none',
    transition: 'border-color 0.15s',
    fontFamily: 'var(--font-sans)',
    width: '100%',
    boxSizing: 'border-box',
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #1a1a2e, #16213e)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontFamily: 'var(--font-sans)',
      padding: '24px',
    }}>
      <div style={{ width: '100%', maxWidth: 420 }}>
        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: 40 }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <polygon points="12 2 2 22 22 22" />
            </svg>
            <span style={{ fontSize: '1rem', fontWeight: 600, color: '#fff' }}>Rav.dev</span>
          </div>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 700, color: '#fff', letterSpacing: '-0.03em', marginBottom: 8 }}>
            Buat Akun
          </h1>
          <p style={{ color: '#aaa', fontSize: '0.875rem' }}>
            Daftarkan diri kamu untuk memulai.
          </p>
        </div>

        <div style={{
          background: '#0a0a0a',
          border: '1px solid rgba(255,255,255,0.08)',
          borderRadius: 10,
          padding: 36,
          boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
        }}>
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            {[
              { label: 'Nama Lengkap', name: 'name',     type: 'text',     placeholder: 'Andi Santoso' },
              { label: 'Email',        name: 'email',    type: 'email',    placeholder: 'andi@example.com' },
              { label: 'Password',     name: 'password', type: 'password', placeholder: '••••••••' },
            ].map(({ label, name, type, placeholder }) => (
              <div key={name} style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                <label style={{ fontFamily: 'var(--font-mono)', fontSize: '0.72rem', color: '#888', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  {label}
                </label>
                <input
                  type={type}
                  name={name}
                  value={form[name]}
                  onChange={handleChange}
                  placeholder={placeholder}
                  required
                  style={inputStyle}
                  onFocus={e => e.target.style.borderColor = 'rgba(255,255,255,0.25)'}
                  onBlur={e  => e.target.style.borderColor = 'rgba(255,255,255,0.08)'}
                />
              </div>
            ))}

            {error && (
              <p style={{ fontFamily: 'var(--font-mono)', fontSize: '0.8rem', color: '#f43f5e', margin: 0 }}>
                ⚠ {error}
              </p>
            )}

            <button
              type="submit"
              disabled={loading}
              style={{
                padding: '11px',
                background: loading ? '#333' : '#fff',
                color: loading ? '#888' : '#000',
                border:     'none',
                borderRadius: 6,
                fontSize: '0.875rem',
                fontWeight: 600,
                cursor: loading ? 'not-allowed' : 'pointer',
                fontFamily: 'var(--font-sans)',
              }}
            >
              {loading ? 'Mendaftar...' : 'Buat Akun'}
            </button>
          </form>

          <p style={{ textAlign: 'center', marginTop: 12, fontSize: '0.85rem', color: '#bbb' }}>
            <Link to="/" style={{ color: '#fff', textDecoration: 'underline' }}>
              ← Kembali ke Home
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Register;