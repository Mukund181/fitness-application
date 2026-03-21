import { useState, useEffect } from 'react';
import api from '../services/api';
import toast from 'react-hot-toast';

export default function ActivityLog() {
  const [workouts, setWorkouts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  const [formData, setFormData] = useState({
    date: new Date().toISOString().split('T')[0],
    category: 'strength',
    workoutName: '',
    duration: 45,
    intensity: 'medium',
    caloriesBurned: 300,
    notes: ''
  });

  useEffect(() => {
    fetchWorkouts();
  }, []);

  const fetchWorkouts = async () => {
    try {
      const res = await api.get('/workout');
      setWorkouts(res.data.logs || []);
    } catch (e) {
      console.error(e);
      toast.error('Failed to load workouts');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: ['duration', 'caloriesBurned'].includes(name) ? Number(value) : value
    }));
  };

  const calculateCalories = () => {
    // Very simple estimation
    const multipliers = {
      strength: 6, cardio: 9, hiit: 10, yoga: 4, sports: 8, other: 6
    };
    const intensityM = {
      low: 0.8, medium: 1.0, high: 1.2
    };
    const burn = Math.round(
      multipliers[formData.category] * formData.duration * intensityM[formData.intensity]
    );
    setFormData(prev => ({ ...prev, caloriesBurned: burn }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post('/workout', formData);
      toast.success('Workout logged successfully!');
      setIsModalOpen(false);
      fetchWorkouts();
      // reset form
      setFormData(prev => ({ ...prev, workoutName: '', notes: '' }));
    } catch (e) {
      toast.error(e.response?.data?.message || 'Failed to log workout');
    }
  };

  if (loading) return <div className="loading-page"><div className="loading-spinner"/></div>;

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <div>
          <h1 style={{ fontSize: 24, fontWeight: 800, fontFamily: 'Outfit, sans-serif' }}>Activity Log</h1>
          <p style={{ color: 'var(--text-secondary)' }}>Track your past workouts and estimated calorie burns</p>
        </div>
        <button className="btn btn-primary" onClick={() => setIsModalOpen(true)}>
          + Log Workout
        </button>
      </div>

      <div className="card" style={{ padding: 0 }}>
        {workouts.length === 0 ? (
          <div className="empty-state" style={{ padding: 60 }}>
             <div className="empty-state-icon">🏃</div>
             <h3>No workouts logged yet</h3>
             <p>Click the button above to log your first activity.</p>
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table className="exercise-table" style={{ width: '100%' }}>
              <thead>
                <tr>
                  <th style={{ padding: '16px 20px' }}>Date</th>
                  <th style={{ padding: '16px 20px' }}>Type</th>
                  <th style={{ padding: '16px 20px' }}>Name</th>
                  <th style={{ padding: '16px 20px' }}>Duration</th>
                  <th style={{ padding: '16px 20px' }}>Intensity</th>
                  <th style={{ padding: '16px 20px', textAlign: 'right' }}>Burn </th>
                </tr>
              </thead>
              <tbody>
                {workouts.map(w => (
                  <tr key={w._id}>
                    <td style={{ padding: '16px 20px', color: 'var(--text-secondary)' }}>
                      {new Date(w.date).toLocaleDateString()}
                    </td>
                    <td style={{ padding: '16px 20px' }}>
                      <span className="badge badge-info" style={{ textTransform: 'capitalize' }}>
                        {w.category}
                      </span>
                    </td>
                    <td style={{ padding: '16px 20px', fontWeight: 600 }}>{w.workoutName}</td>
                    <td style={{ padding: '16px 20px' }}>{w.duration} min</td>
                    <td style={{ padding: '16px 20px', textTransform: 'capitalize' }}>{w.intensity}</td>
                    <td style={{ padding: '16px 20px', textAlign: 'right', fontWeight: 700, color: 'var(--accent)' }}>
                      {w.caloriesBurned} kcal
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {isModalOpen && (
        <div style={{
          position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.8)', zIndex: 1000,
          display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24, backdropFilter: 'blur(5px)'
        }}>
          <div className="card" style={{ width: '100%', maxWidth: 500 }} onClick={e => e.stopPropagation()}>
            <div className="card-header" style={{ marginBottom: 24 }}>
              <div className="card-title">Log Activity</div>
              <button 
                onClick={() => setIsModalOpen(false)}
                style={{ background: 'none', border: 'none', color: 'var(--text-muted)', fontSize: 24, cursor: 'pointer' }}
              >×</button>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">Date</label>
                  <input type="date" name="date" className="form-input" value={formData.date} onChange={handleInputChange} required />
                </div>
                <div className="form-group">
                  <label className="form-label">Category</label>
                  <select name="category" className="form-input form-select" value={formData.category} onChange={handleInputChange}>
                    <option value="strength">Strength Training</option>
                    <option value="cardio">Cardio</option>
                    <option value="hiit">HIIT</option>
                    <option value="yoga">Yoga / Pilgrim</option>
                    <option value="sports">Sports</option>
                    <option value="other">Other</option>
                  </select>
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Workout Name/Description</label>
                <input type="text" name="workoutName" className="form-input" placeholder="e.g. Push Day, 5k Run" value={formData.workoutName} onChange={handleInputChange} required />
              </div>

              <div className="form-row-3">
                <div className="form-group">
                  <label className="form-label">Duration (min)</label>
                  <input type="number" name="duration" className="form-input" min="1" value={formData.duration} onChange={handleInputChange} required />
                </div>
                <div className="form-group">
                  <label className="form-label">Intensity</label>
                  <select name="intensity" className="form-input form-select" value={formData.intensity} onChange={handleInputChange}>
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label" style={{ display: 'flex', justifyContent: 'space-between' }}>
                    Calories 
                    <button type="button" onClick={calculateCalories} style={{ background: 'none', border: 'none', color: 'var(--primary-light)', fontSize: 10, cursor: 'pointer', textDecoration: 'underline' }}>Auto</button>
                  </label>
                  <input type="number" name="caloriesBurned" className="form-input" min="1" value={formData.caloriesBurned} onChange={handleInputChange} required />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Notes (Optional)</label>
                <textarea name="notes" className="form-input" rows="2" placeholder="How did it feel? PRs?" value={formData.notes} onChange={handleInputChange}></textarea>
              </div>

              <div style={{ display: 'flex', gap: 12, marginTop: 24 }}>
                <button type="button" className="btn btn-secondary btn-full" onClick={() => setIsModalOpen(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary btn-full">Save Workout</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
