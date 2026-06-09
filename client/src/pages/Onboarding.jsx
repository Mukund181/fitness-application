import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

const steps = ['Personal Info', 'Body Metrics', 'Your Goal'];

const goalOptions = [
  { value: 'fat_loss', emoji: '🔥', label: 'Fat Loss', desc: 'Lose weight & burn fat' },
  { value: 'muscle_gain', emoji: '💪', label: 'Muscle Gain', desc: 'Build strength & size' },
  { value: 'maintenance', emoji: '⚖️', label: 'Maintenance', desc: 'Stay fit & healthy' },
  { value: 'endurance', emoji: '🏃', label: 'Endurance', desc: 'Improve performance' },
];

const activityOptions = [
  { value: 'sedentary', label: 'Sedentary', desc: 'Desk job, little exercise' },
  { value: 'light', label: 'Light', desc: '1-3 days/week exercise' },
  { value: 'moderate', label: 'Moderate', desc: '3-5 days/week exercise' },
  { value: 'active', label: 'Active', desc: '6-7 days/week exercise' },
  { value: 'very_active', label: 'Very Active', desc: 'Twice daily training' },
];

export default function Onboarding() {
  const { completeOnboarding } = useAuth();
  const [step, setStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    age: '', gender: 'male', height: '', weight: '',
    activityLevel: 'moderate', goal: 'fat_loss', targetWeight: ''
  });

  const updateForm = (field, value) => setForm(prev => ({ ...prev, [field]: value }));

  const validateStep = () => {
    if (step === 0) {
      if (!form.age || form.age < 10 || form.age > 100) return toast.error('Enter a valid age (10-100)');
      return true;
    }
    if (step === 1) {
      if (!form.height || form.height < 100 || form.height > 250) return toast.error('Enter height in cm (100-250)');
      if (!form.weight || form.weight < 30 || form.weight > 300) return toast.error('Enter weight in kg (30-300)');
      return true;
    }
    return true;
  };

  const next = () => {
    if (!validateStep()) return;
    setStep(s => s + 1);
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      await completeOnboarding({
        age: Number(form.age), gender: form.gender,
        height: Number(form.height), weight: Number(form.weight),
        activityLevel: form.activityLevel, goal: form.goal,
        targetWeight: form.targetWeight ? Number(form.targetWeight) : undefined
      });
      toast.success('Profile complete! Welcome to FitTrack Pro 🎉');
    } catch (err) {
      toast.error('Failed to save profile. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="onboarding-page">
      <div className="onboarding-card">
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: 28 }}>
          <div style={{ fontSize: 40, marginBottom: 10 }}>🏋️‍♂️</div>
          <h2 className="page-title">Set Up Your Profile</h2>
          <p className="text-muted text-sm">We'll calculate your personalized calorie & macro targets</p>
        </div>

        {/* Step dots */}
        <div className="step-indicator">
          {steps.map((_, i) => (
            <div key={i} className={`step-dot ${i < step ? 'done' : i === step ? 'active' : ''}`} />
          ))}
        </div>
        <p style={{ fontSize: 13, color: 'var(--text-muted)', marginBottom: 24 }}>
          Step {step + 1} of {steps.length}: <strong style={{ color: 'var(--text-primary)' }}>{steps[step]}</strong>
        </p>

        {/* Step 0: Personal Info */}
        {step === 0 && (
          <div className="onboarding-step">
            <div className="form-group">
              <label className="form-label">Age</label>
              <input type="number" className="form-input" placeholder="25"
                value={form.age} onChange={e => updateForm('age', e.target.value)} min="10" max="100" />
            </div>
            <div className="form-group">
              <label className="form-label">Gender</label>
              <div className="form-row">
                {['male', 'female', 'other'].map(g => (
                  <button
                    key={g}
                    type="button"
                    className={`goal-option ${form.gender === g ? 'selected' : ''}`}
                    onClick={() => updateForm('gender', g)}
                  >
                    <div className="goal-option-emoji">{g === 'male' ? '♂️' : g === 'female' ? '♀️' : '⚧️'}</div>
                    <div className="goal-option-label" style={{ textTransform: 'capitalize' }}>{g}</div>
                  </button>
                ))}
              </div>
            </div>
            <div className="form-group">
              <label className="form-label">Activity Level</label>
              <select className="form-input form-select"
                value={form.activityLevel} onChange={e => updateForm('activityLevel', e.target.value)}>
                {activityOptions.map(a => (
                  <option key={a.value} value={a.value}>{a.label} — {a.desc}</option>
                ))}
              </select>
            </div>
          </div>
        )}

        {/* Step 1: Body Metrics */}
        {step === 1 && (
          <div className="onboarding-step">
            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Height (cm)</label>
                <input type="number" className="form-input" placeholder="175"
                  value={form.height} onChange={e => updateForm('height', e.target.value)} min="100" max="250" />
              </div>
              <div className="form-group">
                <label className="form-label">Current Weight (kg)</label>
                <input type="number" className="form-input" placeholder="70"
                  value={form.weight} onChange={e => updateForm('weight', e.target.value)} min="30" max="300" />
              </div>
            </div>
            <div className="form-group">
              <label className="form-label">Target Weight (kg) <span style={{ color: 'var(--text-muted)' }}>— optional</span></label>
              <input type="number" className="form-input" placeholder="65"
                value={form.targetWeight} onChange={e => updateForm('targetWeight', e.target.value)} min="30" max="300" />
            </div>
            {form.height && form.weight && (
              <div style={{ background: 'rgba(13,148,136,0.06)', border: '1px solid rgba(13,148,136,0.15)', borderRadius: 'var(--radius-md)', padding: 14, marginTop: 8 }}>
                <p style={{ fontSize: 13, color: 'var(--text-secondary)' }}>
                  📊 Estimated BMI: <strong style={{ color: 'var(--primary-dark)' }}>
                    {(form.weight / Math.pow(form.height / 100, 2)).toFixed(1)}
                  </strong>
                </p>
              </div>
            )}
          </div>
        )}

        {/* Step 2: Goal */}
        {step === 2 && (
          <div className="onboarding-step">
            <p style={{ fontSize: 14, color: 'var(--text-secondary)', marginBottom: 16 }}>
              What's your primary fitness goal?
            </p>
            <div className="goal-option-grid">
              {goalOptions.map(g => (
                <button
                   key={g.value}
                   type="button"
                   className={`goal-option ${form.goal === g.value ? 'selected' : ''}`}
                   onClick={() => updateForm('goal', g.value)}
                >
                  <div className="goal-option-emoji">{g.emoji}</div>
                  <div className="goal-option-label">{g.label}</div>
                  <div className="goal-option-desc">{g.desc}</div>
                </button>
              ))}
            </div>

            <div style={{ background: 'rgba(34,197,94,0.06)', border: '1px solid rgba(34,197,94,0.15)', borderRadius: 'var(--radius-md)', padding: 14, marginTop: 4 }}>
              <p style={{ fontSize: 13, color: 'var(--text-secondary)' }}>
                🧮 We'll calculate your <strong style={{ color: 'var(--success)' }}>BMR → TDEE → Calorie Goal + Macro Splits</strong> using the Mifflin-St Jeor equation.
              </p>
            </div>
          </div>
        )}

        {/* Navigation */}
        <div style={{ display: 'flex', gap: 12, marginTop: 28 }}>
          {step > 0 && (
            <button className="btn btn-secondary" onClick={() => setStep(s => s - 1)}>← Back</button>
          )}
          {step < steps.length - 1 ? (
            <button className="btn btn-gradient btn-full" onClick={next}>Continue →</button>
          ) : (
            <button className="btn btn-gradient btn-full btn-lg" onClick={handleSubmit} disabled={loading}>
              {loading ? '⏳ Calculating your plan…' : '🎯 Generate My Fitness Plan'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
