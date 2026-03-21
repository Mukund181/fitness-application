import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
import { Link } from 'react-router-dom';

export default function Register() {
  const { register } = useAuth();
  const [form, setForm] = useState({ name: '', email: '', password: '', confirm: '' });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.password) return toast.error('Please fill all fields');
    if (form.password.length < 6) return toast.error('Password must be at least 6 characters');
    if (form.password !== form.confirm) return toast.error('Passwords do not match');
    setLoading(true);
    try {
      await register(form.name, form.email, form.password);
      toast.success('Account created! Let\'s set up your profile 🎉');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-logo">
          <div className="auth-logo-icon">🏋️</div>
          <h1 className="auth-title">Join FitTrack Pro</h1>
          <p className="auth-subtitle">Start your fitness journey today for free</p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Full Name</label>
            <input id="reg-name" type="text" className="form-input" placeholder="John Doe"
              value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} />
          </div>
          <div className="form-group">
            <label className="form-label">Email Address</label>
            <input id="reg-email" type="email" className="form-input" placeholder="you@example.com"
              value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} />
          </div>
          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Password</label>
              <input id="reg-password" type="password" className="form-input" placeholder="Min 6 chars"
                value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} />
            </div>
            <div className="form-group">
              <label className="form-label">Confirm Password</label>
              <input id="reg-confirm" type="password" className="form-input" placeholder="Repeat password"
                value={form.confirm} onChange={e => setForm({ ...form, confirm: e.target.value })} />
            </div>
          </div>

          <button id="reg-submit" type="submit" className="btn btn-gradient btn-full btn-lg" disabled={loading} style={{ marginTop: 8 }}>
            {loading ? 'Creating account…' : '✨ Create Free Account'}
          </button>
        </form>

        <div className="auth-switch">
          Already have an account? <Link to="/login">Sign in</Link>
        </div>

        <div style={{ display: 'flex', gap: 12, marginTop: 20, justifyContent: 'center', flexWrap: 'wrap' }}>
          {['🔥 Calorie Tracking', '💪 Workout Logs', '📈 Progress Charts'].map(f => (
            <span key={f} style={{ fontSize: 11, color: 'var(--text-muted)', background: 'var(--bg-input)', padding: '4px 8px', borderRadius: 'var(--radius-full)' }}>{f}</span>
          ))}
        </div>
      </div>
    </div>
  );
}
