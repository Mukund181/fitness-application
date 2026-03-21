import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
import { Link } from 'react-router-dom';

export default function Login() {
  const { login } = useAuth();
  const [form, setForm] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [showPass, setShowPass] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.email || !form.password) return toast.error('Please fill all fields');
    setLoading(true);
    try {
      await login(form.email, form.password);
      toast.success('Welcome back! 💪');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-logo">
          <div className="auth-logo-icon">💪</div>
          <h1 className="auth-title">FitTrack Pro</h1>
          <p className="auth-subtitle">Your complete fitness companion</p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Email Address</label>
            <input
              id="login-email"
              type="email"
              className="form-input"
              placeholder="you@example.com"
              value={form.email}
              onChange={e => setForm({ ...form, email: e.target.value })}
              autoComplete="email"
            />
          </div>
          <div className="form-group">
            <label className="form-label">Password</label>
            <div style={{ position: 'relative' }}>
              <input
                id="login-password"
                type={showPass ? 'text' : 'password'}
                className="form-input"
                placeholder="••••••••"
                value={form.password}
                onChange={e => setForm({ ...form, password: e.target.value })}
                autoComplete="current-password"
              />
              <button
                type="button"
                onClick={() => setShowPass(!showPass)}
                style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: 'var(--text-muted)', fontSize: 16, cursor: 'pointer' }}
              >
                {showPass ? '🙈' : '👁️'}
              </button>
            </div>
          </div>

          <button id="login-submit" type="submit" className="btn btn-gradient btn-full btn-lg" disabled={loading} style={{ marginTop: 8 }}>
            {loading ? 'Signing in…' : '🚀 Sign In'}
          </button>
        </form>

        <div className="auth-switch">
          Don't have an account? <Link to="/register">Create one free</Link>
        </div>
        
        <div style={{ marginTop: 20, padding: 12, background: 'rgba(249,115,22,0.08)', borderRadius: 'var(--radius-md)', border: '1px solid rgba(249,115,22,0.15)' }}>
          <p style={{ fontSize: 12, color: 'var(--text-muted)', textAlign: 'center' }}>
            🔐 Secure authentication with JWT tokens
          </p>
        </div>
      </div>
    </div>
  );
}
