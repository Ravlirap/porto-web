import { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import Navbar         from './layouts/Navbar.jsx';
import Home           from './assets/pages/home/Home.jsx';
import Login          from './assets/pages/auth/Login.jsx';
import Register       from './assets/pages/auth/Register.jsx';
import AdminDashboard from './assets/pages/admin/AdminDashboard.jsx';

// ─── Auth Guard: redirect ke /login jika belum login ─────────
function PrivateRoute({ user, role, children }) {
  if (!user) return <Navigate to="/login" replace />;
  if (role && user.role !== role) return <Navigate to="/" replace />;
  return children;
}

// ─── Auth redirect: jika sudah login, skip halaman auth ──────
function GuestRoute({ user, children }) {
  if (user) return <Navigate to="/" replace />;
  return children;
}

function AppRoutes() {
  const navigate = useNavigate();
  const [user, setUser] = useState(() => {
    try { return JSON.parse(localStorage.getItem('user')); }
    catch { return null; }
  });

  const handleLoginSuccess = (u) => {
    setUser(u);
    navigate(u.role === 'admin' ? '/admin' : '/');
  };

  const handleLogout = () => {
    setUser(null);
    navigate('/login');
  };

  return (
    <Routes>
      {/* ── Public: Home ── */}
      <Route path="/" element={
        <>
          <Navbar user={user} onLogout={handleLogout} />
          <Home />
        </>
      } />

      {/* ── Guest only: Login & Register ── */}
      <Route path="/login" element={
        <GuestRoute user={user}>
          <Login onLoginSuccess={handleLoginSuccess} />
        </GuestRoute>
      } />
      <Route path="/register" element={
        <GuestRoute user={user}>
          <Register onRegisterSuccess={handleLoginSuccess} />
        </GuestRoute>
      } />

      {/* ── Protected: Admin only ── */}
      <Route path="/admin" element={
        <PrivateRoute user={user} role="admin">
          <AdminDashboard user={user} onLogout={handleLogout} />
        </PrivateRoute>
      } />

      {/* ── 404 fallback ── */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AppRoutes />
    </BrowserRouter>
  );
}

export default App;