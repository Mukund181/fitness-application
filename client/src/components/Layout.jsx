import { Outlet, NavLink, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useState } from 'react';
import { getGoalLabel } from '../utils/fitness';

const navItems = [
  { path: '/dashboard', icon: '🏠', label: 'Dashboard' },
  { section: 'Nutrition' },
  { path: '/food-log', icon: '📝', label: 'Food Log' },
  { path: '/nutrition', icon: '🥦', label: 'Nutrition Facts' },
  { path: '/recipes', icon: '🍳', label: 'Recipes' },
  { section: 'Training' },
  { path: '/workout-split', icon: '🏋️', label: 'Workout Split' },
  { path: '/activity-log', icon: '⚡', label: 'Activity Log' },
  { section: 'Progress' },
  { path: '/progress', icon: '📈', label: 'Progress' },
  { section: 'Knowledge' },
  { path: '/supplements', icon: '💊', label: 'Supplements' },
  { path: '/myths', icon: '🔬', label: 'Myth Buster' },
];

export default function Layout() {
  const { user, logout } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();

  const pageTitle = navItems.find(n => n.path === location.pathname)?.label || 'FitTrack Pro';

  return (
    <div className="app-layout">
      {/* Sidebar */}
      <aside className={`sidebar ${sidebarOpen ? 'open' : ''}`}>
        <div className="sidebar-logo">
          <div className="sidebar-logo-icon">💪</div>
          <span className="sidebar-logo-text">FitTrack Pro</span>
        </div>

        <nav className="sidebar-nav">
          {navItems.map((item, i) =>
            item.section ? (
              <div key={i} className="sidebar-section-label">{item.section}</div>
            ) : (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}
                onClick={() => setSidebarOpen(false)}
              >
                <span className="link-icon">{item.icon}</span>
                {item.label}
              </NavLink>
            )
          )}
        </nav>

        <div className="sidebar-bottom">
          <NavLink to="/profile" className={({ isActive }) => `user-mini ${isActive ? 'active' : ''}`} onClick={() => setSidebarOpen(false)}>
            <div className="user-avatar">{user?.name?.[0]?.toUpperCase()}</div>
            <div>
              <div className="user-name">{user?.name}</div>
              <div className="user-goal">{user?.goal ? getGoalLabel(user.goal) : 'Set your goal'}</div>
            </div>
          </NavLink>
          <button className="btn btn-secondary btn-full btn-sm" style={{ marginTop: 8 }} onClick={logout}>
            🚪 Sign Out
          </button>
        </div>
      </aside>

      {/* Main */}
      <div className="main-content">
        <header className="topbar">
          <div>
            <div className="topbar-title">{pageTitle}</div>
            <div className="topbar-date">{new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}</div>
          </div>
          <div className="topbar-right">
            <button
              className="btn btn-secondary btn-sm"
              style={{ display: 'none' }}
              onClick={() => setSidebarOpen(!sidebarOpen)}
            >
              ☰
            </button>
          </div>
        </header>

        <div className="page-wrapper">
          <Outlet />
        </div>
      </div>
    </div>
  );
}
