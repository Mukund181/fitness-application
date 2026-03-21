import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider, useAuth } from './context/AuthContext';
import Layout from './components/Layout';
import Login from './pages/Login';
import Register from './pages/Register';
import Onboarding from './pages/Onboarding';
import Dashboard from './pages/Dashboard';
import FoodLog from './pages/FoodLog';
import NutritionFacts from './pages/NutritionFacts';
import WorkoutSplit from './pages/WorkoutSplit';
import ActivityLog from './pages/ActivityLog';
import Progress from './pages/Progress';
import Recipes from './pages/Recipes';
import Supplements from './pages/Supplements';
import MythBuster from './pages/MythBuster';
import Profile from './pages/Profile';
import './index.css';

const PrivateRoute = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading) return <div className="loading-page"><div className="loading-spinner"/><p>Loading FitTrack Pro…</p></div>;
  if (!user) return <Navigate to="/login" replace />;
  if (!user.onboardingComplete) return <Navigate to="/onboarding" replace />;
  return children;
};

const OnboardingRoute = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading) return <div className="loading-page"><div className="loading-spinner"/></div>;
  if (!user) return <Navigate to="/login" replace />;
  if (user.onboardingComplete) return <Navigate to="/dashboard" replace />;
  return children;
};

const PublicRoute = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading) return <div className="loading-page"><div className="loading-spinner"/></div>;
  if (user && !user.onboardingComplete) return <Navigate to="/onboarding" replace />;
  if (user) return <Navigate to="/dashboard" replace />;
  return children;
};

const AppRoutes = () => (
  <Routes>
    <Route path="/" element={<Navigate to="/dashboard" replace />} />
    <Route path="/login" element={<PublicRoute><Login /></PublicRoute>} />
    <Route path="/register" element={<PublicRoute><Register /></PublicRoute>} />
    <Route path="/onboarding" element={<OnboardingRoute><Onboarding /></OnboardingRoute>} />
    <Route path="/" element={<PrivateRoute><Layout /></PrivateRoute>}>
      <Route path="dashboard" element={<Dashboard />} />
      <Route path="food-log" element={<FoodLog />} />
      <Route path="nutrition" element={<NutritionFacts />} />
      <Route path="workout-split" element={<WorkoutSplit />} />
      <Route path="activity-log" element={<ActivityLog />} />
      <Route path="progress" element={<Progress />} />
      <Route path="recipes" element={<Recipes />} />
      <Route path="supplements" element={<Supplements />} />
      <Route path="myths" element={<MythBuster />} />
      <Route path="profile" element={<Profile />} />
    </Route>
    <Route path="*" element={<Navigate to="/dashboard" replace />} />
  </Routes>
);

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppRoutes />
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 3000,
            style: {
              background: '#27272a',
              color: '#fafafa',
              border: '1px solid rgba(255,255,255,0.08)',
              borderRadius: '12px',
              fontSize: '14px',
              fontWeight: '500',
            },
            success: { iconTheme: { primary: '#34d399', secondary: '#27272a' } },
            error: { iconTheme: { primary: '#f87171', secondary: '#27272a' } },
          }}
        />
      </AuthProvider>
    </BrowserRouter>
  );
}
