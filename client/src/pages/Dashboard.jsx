import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import { formatDate, getGoalLabel, calculateBMI, getBMICategory } from '../utils/fitness';
import { Doughnut, Bar, Line } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, PointElement, LineElement, Filler } from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, PointElement, LineElement, Filler);

const chartDefaults = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: { legend: { display: false } },
  scales: {
    x: { grid: { color: 'rgba(255,255,255,0.05)' }, ticks: { color: '#a1a1aa', font: { size: 11 } } },
    y: { grid: { color: 'rgba(255,255,255,0.05)' }, ticks: { color: '#a1a1aa', font: { size: 11 } } }
  }
};

export default function Dashboard() {
  const { user } = useAuth();
  const [todayFood, setTodayFood] = useState({ logs: [], totals: { calories: 0, protein: 0, carbs: 0, fat: 0 } });
  const [weeklyFood, setWeeklyFood] = useState([]);
  const [todayWorkouts, setTodayWorkouts] = useState([]);
  const [recentWorkouts, setRecentWorkouts] = useState([]);
  const [loading, setLoading] = useState(true);

  const today = formatDate();
  const weekStart = (() => {
    const d = new Date();
    const day = d.getDay();
    const diff = d.getDate() - day + (day === 0 ? -6 : 1);
    d.setDate(diff);
    return d.toISOString().split('T')[0];
  })();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [foodRes, weekRes, workRes, allWorkRes] = await Promise.all([
          api.get(`/food/${today}`),
          api.get(`/food/week/${weekStart}`),
          api.get(`/workout/${today}`),
          api.get('/workout?limit=5')
        ]);
        setTodayFood(foodRes.data);
        setWeeklyFood(weekRes.data);
        setTodayWorkouts(workRes.data);
        setRecentWorkouts(allWorkRes.data.logs || []);
      } catch (e) {
        // fail silently on empty data
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [today, weekStart]);

  const calGoal = user?.dailyCalorieGoal || 2000;
  const calConsumed = todayFood.totals.calories;
  const calBurned = todayWorkouts.reduce((s, w) => s + w.caloriesBurned, 0);
  const calNet = calConsumed - calBurned;
  const calRemaining = Math.max(0, calGoal - calNet);
  const calPct = Math.min(100, Math.round((calConsumed / calGoal) * 100));

  const bmi = user?.height && user?.weight ? calculateBMI(user.weight, user.height) : null;
  const bmiCat = bmi ? getBMICategory(Number(bmi)) : null;

  // Macro doughnut
  const macroData = {
    labels: ['Protein', 'Carbs', 'Fat'],
    datasets: [{
      data: [todayFood.totals.protein, todayFood.totals.carbs, todayFood.totals.fat],
      backgroundColor: ['#f97316', '#4facfe', '#eab308'],
      borderColor: ['#ea580c', '#3d8fdd', '#d070e0'],
      borderWidth: 2,
    }]
  };

  // Weekly calories bar
  const weekDays = weeklyFood.map(d => {
    const dd = new Date(d.date + 'T00:00:00');
    return dd.toLocaleDateString('en-US', { weekday: 'short' });
  });
  const weekCalories = weeklyFood.map(d => d.calories);

  const weeklyBarData = {
    labels: weekDays,
    datasets: [{
      label: 'Calories',
      data: weekCalories,
      backgroundColor: weekCalories.map(c => c > calGoal ? 'rgba(248,113,113,0.7)' : 'rgba(249,115,22,0.7)'),
      borderColor: weekCalories.map(c => c > calGoal ? '#f87171' : '#f97316'),
      borderWidth: 2,
      borderRadius: 6,
    }]
  };

  const statsCards = [
    { label: 'Calories Consumed', value: calConsumed, unit: 'kcal', icon: '🔥', gradient: 'linear-gradient(90deg,#f97316,#fb923c)', sub: `of ${calGoal} goal`, color: '#f97316' },
    { label: 'Calories Burned', value: calBurned, unit: 'kcal', icon: '⚡', gradient: 'linear-gradient(90deg,#eab308,#ef4444)', sub: `${todayWorkouts.length} session(s) today`, color: '#eab308' },
    { label: 'Net Calories', value: calNet, unit: 'kcal', icon: '⚖️', gradient: 'linear-gradient(90deg,#4facfe,#00f2fe)', sub: `${calRemaining} remaining`, color: '#4facfe' },
    { label: 'Protein Today', value: Math.round(todayFood.totals.protein), unit: 'g', icon: '💪', gradient: 'linear-gradient(90deg,#43e97b,#38f9d7)', sub: `goal: ${user?.proteinGoal || '—'}g`, color: '#43e97b' },
  ];

  if (loading) return <div className="loading-page"><div className="loading-spinner" /><p>Loading your dashboard…</p></div>;

  return (
    <div>
      {/* Hero */}
      <div className="dashboard-hero">
        <h1>Good {new Date().getHours() < 12 ? 'morning' : new Date().getHours() < 17 ? 'afternoon' : 'evening'}, {user?.name?.split(' ')[0]}! 👋</h1>
        <p>
          {getGoalLabel(user?.goal)} · BMR: <strong>{user?.bmr} kcal</strong> · TDEE: <strong>{user?.tdee} kcal</strong>
          {bmi && <> · BMI: <strong style={{ color: bmiCat.color }}>{bmi} ({bmiCat.label})</strong></>}
        </p>
        <div style={{ marginTop: 16 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, color: 'var(--text-muted)', marginBottom: 6 }}>
            <span>Daily Calorie Progress</span>
            <span>{calPct}% ({calConsumed} / {calGoal} kcal)</span>
          </div>
          <div className="progress-bar-wrap" style={{ height: 10 }}>
            <div className="progress-bar-fill" style={{ width: `${calPct}%`, background: calPct > 100 ? 'linear-gradient(90deg,#f87171,#ff6b6b)' : undefined }} />
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="stats-grid">
        {statsCards.map(s => (
          <div key={s.label} className="stat-card" style={{ '--gradient': s.gradient }}>
            <div className="stat-icon" style={{ background: `${s.color}20` }}>{s.icon}</div>
            <div className="stat-info">
              <div className="stat-value">{s.value}<span style={{ fontSize: 14, fontWeight: 400, color: 'var(--text-muted)', marginLeft: 4 }}>{s.unit}</span></div>
              <div className="stat-label">{s.label}</div>
              <div className="stat-change">{s.sub}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Charts */}
      <div className="charts-grid">
        <div className="card">
          <div className="card-header">
            <div>
              <div className="card-title">Weekly Calories</div>
              <div className="card-subtitle">vs. your daily goal of {calGoal} kcal</div>
            </div>
          </div>
          <div style={{ height: 220 }}>
            {weeklyFood.length > 0 ? (
              <Bar data={weeklyBarData} options={{
                ...chartDefaults,
                plugins: {
                  ...chartDefaults.plugins,
                  tooltip: { callbacks: { label: (c) => ` ${c.raw} kcal` } },
                  annotation: {}
                }
              }} />
            ) : (
              <div className="empty-state" style={{ padding: 24 }}>
                <div className="empty-state-icon">📊</div>
                <p>Log your meals to see weekly trends</p>
              </div>
            )}
          </div>
        </div>

        <div className="card">
          <div className="card-header">
            <div className="card-title">Today's Macros</div>
          </div>
          {calConsumed > 0 ? (
            <div className="macro-ring-container" style={{ justifyContent: 'center' }}>
              <div style={{ width: 160, height: 160, position: 'relative' }}>
                <Doughnut data={macroData} options={{ ...chartDefaults, cutout: '70%', plugins: { legend: { display: false }, tooltip: { callbacks: { label: c => ` ${c.raw}g ${c.label}` } } } }} />
                <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                  <div style={{ fontSize: 18, fontWeight: 800 }}>{calConsumed}</div>
                  <div style={{ fontSize: 10, color: 'var(--text-muted)' }}>kcal</div>
                </div>
              </div>
              <div className="macro-legend">
                {[['Protein', '#f97316', todayFood.totals.protein, 'g'], ['Carbs', '#4facfe', todayFood.totals.carbs, 'g'], ['Fat', '#eab308', todayFood.totals.fat, 'g']].map(([name, color, val, unit]) => (
                  <div key={name} className="macro-legend-item">
                    <div className="macro-dot" style={{ background: color }} />
                    <div>
                      <div style={{ fontWeight: 700, fontSize: 14 }}>{Math.round(val)}{unit}</div>
                      <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>{name}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="empty-state" style={{ padding: 24 }}>
              <div className="empty-state-icon">🍽️</div>
              <p>Log your first meal to see macro breakdown</p>
            </div>
          )}
        </div>
      </div>

      {/* Recent Activity */}
      <div className="recent-grid">
        {/* Recent Meals */}
        <div className="card">
          <div className="card-header">
            <div className="card-title">Today's Meals</div>
            <a href="/food-log" className="btn btn-secondary btn-sm">View All →</a>
          </div>
          {todayFood.logs.length === 0 ? (
            <div className="empty-state" style={{ padding: 24 }}>
              <div className="empty-state-icon">🥗</div>
              <p>No meals logged today</p>
            </div>
          ) : (
            todayFood.logs.slice(0, 4).map(log => (
              <div key={log._id} className="log-item">
                <div className="log-icon-wrap" style={{ background: 'rgba(249,115,22,0.1)' }}>
                  {log.mealType === 'breakfast' ? '☀️' : log.mealType === 'lunch' ? '🌤' : log.mealType === 'dinner' ? '🌙' : '🍟'}
                </div>
                <div className="log-content">
                  <div className="log-title">{log.foodName}</div>
                  <div className="log-sub">{log.quantity}{log.unit} · {log.mealType}</div>
                </div>
                <div>
                  <div className="log-value" style={{ color: 'var(--primary-light)' }}>{log.calories} kcal</div>
                  <div className="log-value-sub">P: {log.protein}g C: {log.carbs}g F: {log.fat}g</div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Recent Workouts */}
        <div className="card">
          <div className="card-header">
            <div className="card-title">Recent Workouts</div>
            <a href="/activity-log" className="btn btn-secondary btn-sm">View All →</a>
          </div>
          {recentWorkouts.length === 0 ? (
            <div className="empty-state" style={{ padding: 24 }}>
              <div className="empty-state-icon">🏋️</div>
              <p>No workouts logged yet</p>
            </div>
          ) : (
            recentWorkouts.slice(0, 4).map(w => (
              <div key={w._id} className="log-item">
                <div className="log-icon-wrap" style={{ background: 'rgba(234,179,8,0.1)' }}>
                  {w.category === 'strength' ? '🏋️' : w.category === 'cardio' ? '🏃' : w.category === 'hiit' ? '🔥' : w.category === 'yoga' ? '🧘' : '⚡'}
                </div>
                <div className="log-content">
                  <div className="log-title">{w.workoutName}</div>
                  <div className="log-sub">{w.duration} min · {w.date}</div>
                </div>
                <div>
                  <div className="log-value" style={{ color: 'var(--accent)' }}>{w.caloriesBurned} kcal</div>
                  <div className="log-value-sub capitalize">{w.category} · {w.intensity}</div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Goal Summary Card */}
      <div className="card" style={{ marginTop: 20 }}>
        <div className="card-header">
          <div className="card-title">Your Personalized Plan</div>
          <span className="badge badge-primary">{getGoalLabel(user?.goal)}</span>
        </div>
        <div className="grid-4">
          {[
            { label: 'Daily Calories', value: user?.dailyCalorieGoal, unit: 'kcal', color: '#f97316', icon: '🎯' },
            { label: 'Protein Goal', value: user?.proteinGoal, unit: 'g/day', color: '#eab308', icon: '🥩' },
            { label: 'Carbs Goal', value: user?.carbsGoal, unit: 'g/day', color: '#4facfe', icon: '🌾' },
            { label: 'Fat Goal', value: user?.fatGoal, unit: 'g/day', color: '#43e97b', icon: '🥑' },
          ].map(item => (
            <div key={item.label} style={{ textAlign: 'center', padding: '16px', background: 'var(--bg-card-2)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)' }}>
              <div style={{ fontSize: 24, marginBottom: 6 }}>{item.icon}</div>
              <div style={{ fontSize: 22, fontWeight: 800, color: item.color, fontFamily: 'Outfit, sans-serif' }}>{item.value || '—'}</div>
              <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 2 }}>{item.unit}</div>
              <div style={{ fontSize: 12, color: 'var(--text-secondary)', marginTop: 4 }}>{item.label}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
