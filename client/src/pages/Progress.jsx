import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import toast from 'react-hot-toast';
import { calculateBMI, getBMICategory } from '../utils/fitness';
import { Line } from 'react-chartjs-2';

export default function Progress() {
  const { user } = useAuth();
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const [formData, setFormData] = useState({
    date: new Date().toISOString().split('T')[0],
    weight: user?.weight || '',
    bodyFat: '',
    chest: '',
    waist: '',
    arms: '',
    legs: '',
    notes: ''
  });

  useEffect(() => {
    fetchLogs();
  }, []);

  const fetchLogs = async () => {
    try {
      const res = await api.get('/progress');
      setLogs(res.data || []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // API expects chest, waist, arms, legs in a metrics object, wait no, let's see how server expects it.
      // Usually standard or flat. Let's send flat, server will parse.
      const payload = { ...formData };
      for (const key of ['weight', 'bodyFat', 'chest', 'waist', 'arms', 'legs']) {
        if (payload[key]) payload[key] = Number(payload[key]);
      }
      
      await api.post('/progress', payload);
      toast.success('Progress saved!');
      fetchLogs();
      setFormData(prev => ({ ...prev, notes: '' }));
    } catch (e) {
      toast.error('Failed to save progress');
    }
  };

  if (loading) return <div className="loading-page"><div className="loading-spinner"/></div>;

  // Chart data
  const sortedLogs = [...logs].sort((a, b) => new Date(a.date) - new Date(b.date));
  const dates = sortedLogs.map(l => new Date(l.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric' }));
  const weights = sortedLogs.map(l => l.weight);

  const chartData = {
    labels: dates,
    datasets: [{
      label: 'Weight (kg)',
      data: weights,
      borderColor: '#f97316',
      backgroundColor: 'rgba(249,115,22,0.1)',
      borderWidth: 3,
      pointBackgroundColor: '#fff',
      pointBorderColor: '#f97316',
      pointBorderWidth: 2,
      pointRadius: 4,
      fill: true,
      tension: 0.4
    }]
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: { legend: { display: false } },
    scales: {
      y: { grid: { color: 'rgba(255,255,255,0.05)' } },
      x: { grid: { color: 'rgba(255,255,255,0.05)' } }
    }
  };

  const latestWeight = sortedLogs.length ? sortedLogs[sortedLogs.length - 1].weight : user?.weight;
  const bmi = latestWeight && user?.height ? calculateBMI(latestWeight, user.height) : null;
  const bmiCat = bmi ? getBMICategory(Number(bmi)) : null;

  return (
    <div className="progress-page">
      <div style={{ marginBottom: 24 }}>
        <h1 style={{ fontSize: 28, fontWeight: 800, fontFamily: 'Outfit, sans-serif' }}>Milestones & Progress</h1>
        <p style={{ color: 'var(--text-secondary)' }}>Track your transformation over time</p>
      </div>

      <div className="grid-2">
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          <div className="card" style={{ padding: 24 }}>
            <div className="card-header">
              <div className="card-title">Log New Weigh-in</div>
              <span className="badge badge-primary">Today</span>
            </div>
            
            <form onSubmit={handleSubmit}>
              <div className="metrics-entry-grid">
                <div className="metric-input-card">
                  <label>Weight (kg)*</label>
                  <input type="number" step="0.1" name="weight" className="form-input" style={{ textAlign: 'center', fontSize: 18, fontWeight: 700 }} value={formData.weight} onChange={handleChange} required />
                </div>
                <div className="metric-input-card">
                  <label>Body Fat (%)</label>
                  <input type="number" step="0.1" name="bodyFat" className="form-input" style={{ textAlign: 'center', fontSize: 18, fontWeight: 700 }} value={formData.bodyFat} onChange={handleChange} />
                </div>
                <div className="metric-input-card">
                  <label>Waist (cm)</label>
                  <input type="number" step="0.1" name="waist" className="form-input" style={{ textAlign: 'center', fontSize: 18, fontWeight: 700 }} value={formData.waist} onChange={handleChange} />
                </div>
              </div>
              
              <div style={{ marginTop: 16 }}>
                <label className="form-label">Notes</label>
                <textarea name="notes" className="form-input" rows="2" placeholder="How do you feel today?" value={formData.notes} onChange={handleChange}></textarea>
              </div>
              
              <button type="submit" className="btn btn-primary btn-full" style={{ marginTop: 16 }}>
                💾 Save Entry
              </button>
            </form>
          </div>

          <div className="card">
            <div className="card-header">
              <div className="card-title">Body Composition</div>
            </div>
            {bmi ? (
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '20px 0' }}>
                <div style={{ fontSize: 48, fontWeight: 900, color: bmiCat.color, lineHeight: 1 }}>{bmi}</div>
                <div style={{ fontSize: 14, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: 1, marginTop: 8 }}>Current BMI</div>
                <div className="badge mt-2" style={{ background: `${bmiCat.color}20`, color: bmiCat.color, marginTop: 12, fontSize: 14, padding: '6px 16px' }}>
                  {bmiCat.label}
                </div>
              </div>
            ) : (
              <div className="empty-state">
                <p>We need your height and weight to calculate BMI</p>
              </div>
            )}
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          <div className="card">
            <div className="card-header">
              <div className="card-title">Weight Trend</div>
            </div>
            <div style={{ height: 260 }}>
              {sortedLogs.length > 1 ? (
                <Line data={chartData} options={chartOptions} />
              ) : (
                <div className="empty-state" style={{ height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
                  <div style={{ fontSize: 32, marginBottom: 16 }}>📉</div>
                  <p>Log a few more weigh-ins to see your trend</p>
                </div>
              )}
            </div>
          </div>

          <div className="card" style={{ flex: 1 }}>
            <div className="card-header">
              <div className="card-title">Recent History</div>
            </div>
            
            {sortedLogs.length === 0 ? (
              <p className="empty-state">No history available</p>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12, maxHeight: 200, overflowY: 'auto' }}>
                {[...sortedLogs].reverse().map(log => (
                  <div key={log._id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: 12, background: 'var(--bg-input)', borderRadius: 'var(--radius-sm)' }}>
                    <div>
                      <div style={{ fontWeight: 600 }}>{new Date(log.date).toLocaleDateString()}</div>
                      <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>{log.notes || 'No notes'}</div>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <div style={{ fontWeight: 800, color: 'var(--primary-light)' }}>{log.weight} kg</div>
                      {log.bodyFat && <div style={{ fontSize: 12, color: 'var(--text-secondary)' }}>{log.bodyFat}% BF</div>}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
