import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';

export default function WorkoutSplit() {
  const { user } = useAuth();
  const [splits, setSplits] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeSplitId, setActiveSplitId] = useState(null);
  const [expandedDay, setExpandedDay] = useState(null);

  useEffect(() => {
    const fetchSplits = async () => {
      try {
        const res = await api.get('/workoutsplits');
        setSplits(res.data);
        
        // Find split matching user goal, or use the first one
        const match = res.data.find(s => s.goal === user?.goal);
        setActiveSplitId(match ? match.id : res.data[0]?.id);
      } catch (e) {
        console.error("Failed to load workout splits", e);
      } finally {
        setLoading(false);
      }
    };
    fetchSplits();
  }, [user]);

  if (loading) return <div className="loading-page"><div className="loading-spinner"/></div>;
  if (!splits.length) return <div className="empty-state">No workout splits found.</div>;

  const activeSplit = splits.find(s => s.id === activeSplitId);

  return (
    <div>
      <div className="card" style={{ marginBottom: 24 }}>
        <div className="card-header" style={{ marginBottom: 20 }}>
          <div>
            <div className="card-title">Training Programs</div>
            <div className="card-subtitle">Select a split that aligns with your fitness goal</div>
          </div>
        </div>
        
        <div style={{ display: 'flex', gap: 12, overflowX: 'auto', paddingBottom: 12 }}>
          {splits.map(split => (
            <button
              key={split.id}
              onClick={() => setActiveSplitId(split.id)}
              className={`btn ${activeSplitId === split.id ? 'btn-primary' : 'btn-secondary'}`}
              style={{ whiteSpace: 'nowrap' }}
            >
              {split.name}
              {split.goal === user?.goal && <span style={{ marginLeft: 6 }}>⭐</span>}
            </button>
          ))}
        </div>
      </div>

      {activeSplit && (
        <div className="card">
          <div className="card-header" style={{ flexWrap: 'wrap', gap: 16 }}>
            <div>
              <div style={{ fontSize: 24, fontWeight: 800, fontFamily: 'Outfit, sans-serif' }}>{activeSplit.name}</div>
              <p style={{ color: 'var(--text-secondary)', marginTop: 8, maxWidth: 600 }}>{activeSplit.description}</p>
            </div>
            <div style={{ display: 'flex', gap: 12 }}>
              <div className="badge badge-primary">🗓️ {activeSplit.frequency}</div>
              <div className="badge badge-warning">⚡ {activeSplit.difficulty}</div>
              <div className="badge badge-info">⏱️ {activeSplit.duration}</div>
            </div>
          </div>

          <div style={{ marginTop: 24 }}>
            <h3 style={{ fontSize: 16, marginBottom: 16, borderBottom: '1px solid var(--border)', paddingBottom: 8 }}>Weekly Schedule</h3>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {activeSplit.days.map((dayObj, i) => {
                const isExpanded = expandedDay === i;
                return (
                  <div key={i} className="split-day-card">
                    <div 
                      className="split-day-header"
                      onClick={() => setExpandedDay(isExpanded ? null : i)}
                    >
                      <div style={{ fontWeight: 600 }}>{dayObj.day}</div>
                      <div>{isExpanded ? '▲' : '▼'}</div>
                    </div>
                    
                    {isExpanded && (
                      <div className="split-day-content">
                        <table className="exercise-table">
                          <thead>
                            <tr>
                              <th>Exercise</th>
                              <th>Sets</th>
                              <th>Reps/Duration</th>
                              <th>Rest</th>
                            </tr>
                          </thead>
                          <tbody>
                            {dayObj.exercises.map((ex, j) => (
                              <tr key={j}>
                                <td style={{ fontWeight: 500, color: 'var(--text-primary)' }}>{ex.name}</td>
                                <td>{ex.sets || '-'}</td>
                                <td>{ex.reps || ex.duration || '-'}</td>
                                <td>{ex.rest || '-'}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          </div>

          <div className="warning-box" style={{ marginTop: 24 }}>
            <span>💡</span>
            <div>
              <strong>Trainer Notes:</strong> {activeSplit.notes}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
