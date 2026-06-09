import { useAuth } from '../context/AuthContext';
import { getGoalLabel } from '../utils/fitness';

export default function Profile() {
  const { user, logout } = useAuth();
  
  if (!user) return <div className="loading-page"><div className="loading-spinner"/></div>;

  return (
    <div style={{ maxWidth: 800, margin: '0 auto' }}>
      <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
        <div style={{ 
          height: 140, 
          background: 'linear-gradient(135deg, var(--primary), var(--primary-light))',
          position: 'relative'
        }}>
          <div style={{
            width: 100,
            height: 100,
            borderRadius: '50%',
            background: 'var(--bg-card)',
            border: '4px solid var(--bg-card)',
            position: 'absolute',
            bottom: -50,
            left: 32,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: 40,
            color: 'var(--text-primary)',
            fontWeight: 800,
            boxShadow: 'var(--shadow-md)'
          }}>
            {user.name?.[0]?.toUpperCase()}
          </div>
        </div>
        
        <div style={{ padding: '64px 32px 32px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
              <h1 style={{ fontSize: 28, fontWeight: 800, fontFamily: 'Outfit, sans-serif' }}>{user.name}</h1>
              <p style={{ color: 'var(--text-secondary)', fontSize: 15, marginTop: 4 }}>{user.email}</p>
            </div>
            <button className="btn btn-secondary" onClick={logout}>Sign Out</button>
          </div>

          <div className="grid-3" style={{ marginTop: 40 }}>
            <div style={{ padding: 20, background: 'var(--bg-input)', borderRadius: 'var(--radius-md)' }}>
              <div style={{ fontSize: 12, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: 0.5 }}>Current Goal</div>
              <div style={{ fontSize: 18, fontWeight: 600, color: 'var(--primary-dark)', marginTop: 8 }}>{getGoalLabel(user.goal)}</div>
            </div>
            <div style={{ padding: 20, background: 'var(--bg-input)', borderRadius: 'var(--radius-md)' }}>
              <div style={{ fontSize: 12, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: 0.5 }}>Daily Calories</div>
              <div style={{ fontSize: 18, fontWeight: 600, color: 'var(--accent)', marginTop: 8 }}>{user.dailyCalorieGoal} kcal</div>
            </div>
            <div style={{ padding: 20, background: 'var(--bg-input)', borderRadius: 'var(--radius-md)' }}>
              <div style={{ fontSize: 12, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: 0.5 }}>Activity Level</div>
              <div style={{ fontSize: 18, fontWeight: 600, color: 'var(--success)', marginTop: 8, textTransform: 'capitalize' }}>{user.activityLevel}</div>
            </div>
          </div>
          
          <div style={{ marginTop: 40 }}>
            <h3 style={{ fontSize: 18, marginBottom: 16 }}>Biometrics</h3>
            <div className="grid-4">
              <div style={{ border: '1px solid var(--border)', padding: 16, borderRadius: 'var(--radius-md)', textAlign: 'center' }}>
                <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>Age</div>
                <div style={{ fontSize: 20, fontWeight: 700 }}>{user.age || '—'}</div>
              </div>
              <div style={{ border: '1px solid var(--border)', padding: 16, borderRadius: 'var(--radius-md)', textAlign: 'center' }}>
                <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>Gender</div>
                <div style={{ fontSize: 20, fontWeight: 700, textTransform: 'capitalize' }}>{user.gender || '—'}</div>
              </div>
              <div style={{ border: '1px solid var(--border)', padding: 16, borderRadius: 'var(--radius-md)', textAlign: 'center' }}>
                <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>Height</div>
                <div style={{ fontSize: 20, fontWeight: 700 }}>{user.height} cm</div>
              </div>
              <div style={{ border: '1px solid var(--border)', padding: 16, borderRadius: 'var(--radius-md)', textAlign: 'center' }}>
                <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>Weight</div>
                <div style={{ fontSize: 20, fontWeight: 700 }}>{user.weight} kg</div>
              </div>
            </div>
          </div>

          <div style={{ marginTop: 40 }}>
            <h3 style={{ fontSize: 18, marginBottom: 16 }}>Macro Targets</h3>
            <div className="grid-3">
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: 16, background: 'rgba(13,148,136,0.05)', borderRadius: 'var(--radius-md)' }}>
                <div style={{ width: 8, height: 40, borderRadius: 4, background: '#0d9488' }} />
                <div>
                  <div style={{ fontSize: 13, color: 'var(--text-secondary)' }}>Protein</div>
                  <div style={{ fontSize: 18, fontWeight: 700 }}>{user.proteinGoal}g</div>
                </div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: 16, background: 'rgba(59,130,246,0.05)', borderRadius: 'var(--radius-md)' }}>
                <div style={{ width: 8, height: 40, borderRadius: 4, background: '#3b82f6' }} />
                <div>
                  <div style={{ fontSize: 13, color: 'var(--text-secondary)' }}>Carbs</div>
                  <div style={{ fontSize: 18, fontWeight: 700 }}>{user.carbsGoal}g</div>
                </div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: 16, background: 'rgba(245,158,11,0.05)', borderRadius: 'var(--radius-md)' }}>
                <div style={{ width: 8, height: 40, borderRadius: 4, background: '#f59e0b' }} />
                <div>
                  <div style={{ fontSize: 13, color: 'var(--text-secondary)' }}>Fat</div>
                  <div style={{ fontSize: 18, fontWeight: 700 }}>{user.fatGoal}g</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
