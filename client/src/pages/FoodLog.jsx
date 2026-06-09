import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import { formatDate } from '../utils/fitness';
import toast from 'react-hot-toast';

const mealTypes = ['breakfast', 'lunch', 'dinner', 'snack'];
const mealEmoji = { breakfast: '☀️', lunch: '🌤', dinner: '🌙', snack: '🍟' };

// Common foods for quick-add
const quickFoods = [
  { name: 'Whole Egg', calories: 155, protein: 13, carbs: 1.1, fat: 11, unit: 'g', defaultQty: 60 },
  { name: 'Chicken Breast', calories: 165, protein: 31, carbs: 0, fat: 3.6, unit: 'g', defaultQty: 100 },
  { name: 'Brown Rice', calories: 123, protein: 2.7, carbs: 25.6, fat: 0.97, unit: 'g', defaultQty: 100 },
  { name: 'Oats', calories: 389, protein: 17, carbs: 66, fat: 7, unit: 'g', defaultQty: 60 },
  { name: 'Banana', calories: 89, protein: 1.1, carbs: 23, fat: 0.3, unit: 'g', defaultQty: 120 },
  { name: 'Whey Protein', calories: 400, protein: 80, carbs: 8, fat: 5, unit: 'g', defaultQty: 30 },
];

const calcNutrient = (base, qty, per) => Math.round((base * qty) / per * 10) / 10;

export default function FoodLog() {
  const { user } = useAuth();
  const [date, setDate] = useState(formatDate());
  const [foodData, setFoodData] = useState({ logs: [], totals: { calories: 0, protein: 0, carbs: 0, fat: 0, fiber: 0, sodium: 0 } });
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [activeMeal, setActiveMeal] = useState('breakfast');
  const [nutritionDB, setNutritionDB] = useState([]);
  const [searchQ, setSearchQ] = useState('');
  const [selectedFood, setSelectedFood] = useState(null);
  const [form, setForm] = useState({ foodName: '', quantity: '', unit: 'g', calories: '', protein: '', carbs: '', fat: '', fiber: '', sodium: '' });
  const [submitting, setSubmitting] = useState(false);

  const calGoal = user?.dailyCalorieGoal || 2000;

  const fetchLogs = async () => {
    setLoading(true);
    try {
      const { data } = await api.get(`/food/${date}`);
      setFoodData(data);
    } catch { setFoodData({ logs: [], totals: { calories: 0, protein: 0, carbs: 0, fat: 0, fiber: 0, sodium: 0 } }); }
    finally { setLoading(false); }
  };

  const fetchNutrition = async () => {
    try {
      const { data } = await api.get('/nutrition');
      setNutritionDB(data);
    } catch {}
  };

  useEffect(() => { fetchLogs(); }, [date]);
  useEffect(() => { fetchNutrition(); }, []);

  const filteredFoods = nutritionDB.filter(f => f.name.toLowerCase().includes(searchQ.toLowerCase()));

  const selectFood = (food, qty = 100) => {
    setSelectedFood(food);
    const q = qty;
    setForm({
      foodName: food.name,
      quantity: q,
      unit: 'g',
      calories: calcNutrient(food.per100g.calories, q, 100),
      protein: calcNutrient(food.per100g.protein, q, 100),
      carbs: calcNutrient(food.per100g.carbs, q, 100),
      fat: calcNutrient(food.per100g.fat, q, 100),
      fiber: calcNutrient(food.per100g.fiber, q, 100),
      sodium: calcNutrient(food.per100g.sodium, q, 100),
    });
  };

  const updateQty = (qty) => {
    if (!selectedFood) return;
    setForm(prev => ({
      ...prev,
      quantity: qty,
      calories: calcNutrient(selectedFood.per100g.calories, qty, 100),
      protein: calcNutrient(selectedFood.per100g.protein, qty, 100),
      carbs: calcNutrient(selectedFood.per100g.carbs, qty, 100),
      fat: calcNutrient(selectedFood.per100g.fat, qty, 100),
      fiber: calcNutrient(selectedFood.per100g.fiber, qty, 100),
      sodium: calcNutrient(selectedFood.per100g.sodium, qty, 100),
    }));
  };

  const openModal = (meal) => {
    setActiveMeal(meal);
    setShowModal(true);
    setForm({ foodName: '', quantity: 100, unit: 'g', calories: '', protein: '', carbs: '', fat: '', fiber: '', sodium: '' });
    setSelectedFood(null);
    setSearchQ('');
  };

  const handleSubmit = async () => {
    if (!form.foodName || !form.calories) return toast.error('Food name and calories are required');
    setSubmitting(true);
    try {
      await api.post('/food', { ...form, date, mealType: activeMeal, quantity: Number(form.quantity), calories: Number(form.calories), protein: Number(form.protein) || 0, carbs: Number(form.carbs) || 0, fat: Number(form.fat) || 0, fiber: Number(form.fiber) || 0, sodium: Number(form.sodium) || 0 });
      toast.success('Food logged! 🥗');
      setShowModal(false);
      fetchLogs();
    } catch { toast.error('Failed to log food'); }
    finally { setSubmitting(false); }
  };

  const deleteLog = async (id) => {
    if (!confirm('Remove this food entry?')) return;
    try {
      await api.delete(`/food/${id}`);
      toast.success('Removed');
      fetchLogs();
    } catch { toast.error('Failed to remove'); }
  };

  const macros = foodData.totals;
  const calPct = Math.min(100, Math.round((macros.calories / calGoal) * 100));

  return (
    <div>
      <div className="flex-between mb-6">
        <div>
          <h1 className="page-title">Food Log 📝</h1>
          <p className="page-subtitle">Track your nutrition and hit your daily targets</p>
        </div>
        <input type="date" className="form-input" style={{ width: 'auto' }} value={date} onChange={e => setDate(e.target.value)} />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 320px', gap: 24, alignItems: 'start' }}>
        {/* Log Area */}
        <div>
          {mealTypes.map(meal => {
            const mealLogs = foodData.logs.filter(l => l.mealType === meal);
            const mealCal = mealLogs.reduce((s, l) => s + l.calories, 0);
            return (
              <div key={meal} className="meal-section">
                <div className="meal-header">
                  <div className="meal-header-left">
                    <span style={{ fontSize: 20 }}>{mealEmoji[meal]}</span>
                    <div>
                      <div className="flex" style={{ gap: 8 }}>
                        <span className={`meal-badge ${meal}`}>{meal}</span>
                        <span style={{ fontSize: 13, color: 'var(--text-muted)', fontWeight: 600 }}>{mealCal} kcal</span>
                      </div>
                    </div>
                  </div>
                  <button className="btn btn-primary btn-sm" onClick={() => openModal(meal)}>+ Add Food</button>
                </div>

                {mealLogs.length === 0 ? (
                  <div style={{ padding: '12px 16px', background: 'var(--bg-card)', border: '1px dashed var(--border)', borderRadius: 'var(--radius-md)', fontSize: 13, color: 'var(--text-muted)', textAlign: 'center' }}>
                    No items logged for {meal}
                  </div>
                ) : (
                  mealLogs.map(log => (
                    <div key={log._id} className="food-item">
                      <div style={{ flex: 1 }}>
                        <div className="food-name">{log.foodName}</div>
                        <div className="food-meta">{log.quantity}{log.unit}</div>
                      </div>
                      <div className="food-macros">
                        {[['P', log.protein, '#0d9488'], ['C', log.carbs, '#3b82f6'], ['F', log.fat, '#f59e0b']].map(([l, v, c]) => (
                          <div key={l} className="macro-chip">
                            <span className="macro-chip-val" style={{ color: c }}>{Math.round(v)}g</span>
                            <span className="macro-chip-label">{l}</span>
                          </div>
                        ))}
                        <div className="food-calories">{log.calories}</div>
                        <button className="btn btn-danger btn-icon btn-sm" onClick={() => deleteLog(log._id)}>🗑</button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            );
          })}
        </div>

        {/* Daily Summary Sidebar */}
        <div className="nutrition-summary">
          <div className="card-title" style={{ marginBottom: 16 }}>Daily Summary</div>

          {/* Calorie ring */}
          <div className="calorie-ring-wrap">
            <div style={{ position: 'relative', width: 130, height: 130 }}>
              <svg width="130" height="130" viewBox="0 0 130 130">
                <circle cx="65" cy="65" r="55" fill="none" stroke="var(--bg-hover)" strokeWidth="12" />
                <circle cx="65" cy="65" r="55" fill="none"
                  stroke={calPct > 100 ? 'var(--danger)' : 'var(--primary)'}
                  strokeWidth="12"
                  strokeDasharray={`${2 * Math.PI * 55}`}
                  strokeDashoffset={`${2 * Math.PI * 55 * (1 - calPct / 100)}`}
                  strokeLinecap="round"
                  transform="rotate(-90 65 65)"
                  style={{ transition: 'stroke-dashoffset 0.6s' }}
                />
                <text x="65" y="60" textAnchor="middle" fill="var(--text-primary)" fontSize="20" fontWeight="800" fontFamily="Outfit, sans-serif">{macros.calories}</text>
                <text x="65" y="78" textAnchor="middle" fill="var(--text-muted)" fontSize="11">kcal eaten</text>
              </svg>
            </div>
            <div className="calorie-ring-label">
              <div style={{ fontSize: 13, color: 'var(--text-secondary)' }}>Goal: <strong>{calGoal}</strong> kcal</div>
              <div style={{ fontSize: 12, color: macros.calories > calGoal ? 'var(--danger)' : 'var(--success)', fontWeight: 600, marginTop: 2 }}>
                {macros.calories > calGoal ? `${macros.calories - calGoal} over` : `${calGoal - macros.calories} remaining`}
              </div>
            </div>
          </div>

          <div className="divider" />

          {/* Macro bars */}
          <div className="macro-progress-list">
            {[
              { name: 'Protein', val: Math.round(macros.protein), goal: user?.proteinGoal || 150, color: '#0d9488' },
              { name: 'Carbs', val: Math.round(macros.carbs), goal: user?.carbsGoal || 250, color: '#3b82f6' },
              { name: 'Fat', val: Math.round(macros.fat), goal: user?.fatGoal || 65, color: '#f59e0b' },
              { name: 'Fiber', val: Math.round(macros.fiber), goal: 30, color: '#22c55e' },
            ].map(m => (
              <div key={m.name} className="macro-progress-item">
                <div className="macro-progress-header">
                  <span className="macro-progress-name" style={{ color: m.color }}>{m.name}</span>
                  <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>{m.val}g / {m.goal}g</span>
                </div>
                <div className="progress-bar-wrap">
                  <div className="progress-bar-fill" style={{ width: `${Math.min(100, (m.val / m.goal) * 100)}%`, background: `linear-gradient(90deg, ${m.color}, ${m.color}aa)` }} />
                </div>
              </div>
            ))}
          </div>

          <div className="divider" />
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
            {[['Sodium', `${Math.round(macros.sodium)}mg`], ['Fiber', `${Math.round(macros.fiber)}g`]].map(([l, v]) => (
              <div key={l} style={{ background: 'var(--bg-input)', borderRadius: 'var(--radius-sm)', padding: 8, textAlign: 'center' }}>
                <div style={{ fontSize: 14, fontWeight: 700 }}>{v}</div>
                <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>{l}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Add Food Modal */}
      {showModal && (
        <div className="modal-overlay" onClick={e => e.target === e.currentTarget && setShowModal(false)}>
          <div className="modal-card">
            <div className="modal-header">
              <div>
                <div style={{ fontFamily: 'Outfit, sans-serif', fontWeight: 700, fontSize: 17 }}>Add Food — <span className={`meal-badge ${activeMeal}`}>{activeMeal}</span></div>
              </div>
              <button className="btn btn-secondary btn-icon btn-sm" onClick={() => setShowModal(false)}>✕</button>
            </div>

            <div className="modal-body">
              {/* Quick Add */}
              <div style={{ marginBottom: 20 }}>
                <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-muted)', marginBottom: 8 }}>⚡ Quick Add</div>
                <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                  {quickFoods.map(f => (
                    <button key={f.name} className="filter-chip" onClick={() => selectFood({ name: f.name, per100g: { calories: f.calories, protein: f.protein, carbs: f.carbs, fat: f.fat, fiber: 0, sodium: 0 } }, f.defaultQty)}>
                      {f.name}
                    </button>
                  ))}
                </div>
              </div>

              {/* Search DB */}
              <div style={{ marginBottom: 16 }}>
                <input type="text" className="form-input" placeholder="🔍 Search food database…"
                  value={searchQ} onChange={e => setSearchQ(e.target.value)} />
                {searchQ && (
                  <div style={{ background: 'var(--bg-input)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)', marginTop: 6, maxHeight: 180, overflowY: 'auto' }}>
                    {filteredFoods.slice(0, 8).map(f => (
                      <div key={f.id} onClick={() => { selectFood(f); setSearchQ(''); }}
                        style={{ padding: '10px 14px', cursor: 'pointer', borderBottom: '1px solid var(--border)', fontSize: 13, transition: 'var(--transition)' }}
                        onMouseEnter={e => e.currentTarget.style.background = 'var(--bg-hover)'}
                        onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                      >
                        <div style={{ fontWeight: 600 }}>{f.name}</div>
                        <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>{f.per100g.calories} kcal/100g · P:{f.per100g.protein}g C:{f.per100g.carbs}g F:{f.per100g.fat}g</div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Form */}
              <div className="form-group">
                <label className="form-label">Food Name *</label>
                <input className="form-input" placeholder="e.g. Chicken Breast"
                  value={form.foodName} onChange={e => setForm(p => ({ ...p, foodName: e.target.value }))} />
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">Quantity</label>
                  <input type="number" className="form-input" value={form.quantity}
                    onChange={e => { setForm(p => ({ ...p, quantity: e.target.value })); updateQty(Number(e.target.value)); }} />
                </div>
                <div className="form-group">
                  <label className="form-label">Unit</label>
                  <select className="form-input form-select" value={form.unit} onChange={e => setForm(p => ({ ...p, unit: e.target.value }))}>
                    <option value="g">grams (g)</option>
                    <option value="ml">ml</option>
                    <option value="serving">serving</option>
                    <option value="cup">cup</option>
                    <option value="tbsp">tbsp</option>
                  </select>
                </div>
              </div>
              <div className="form-group">
                <label className="form-label">Calories (kcal) *</label>
                <input type="number" className="form-input" value={form.calories}
                  onChange={e => setForm(p => ({ ...p, calories: e.target.value }))} />
              </div>
              <div className="form-row-3">
                {[['protein', 'Protein (g)', '#f97316'], ['carbs', 'Carbs (g)', '#4facfe'], ['fat', 'Fat (g)', '#eab308']].map(([key, label, c]) => (
                  <div key={key} className="form-group">
                    <label className="form-label" style={{ color: c }}>{label}</label>
                    <input type="number" className="form-input" value={form[key]}
                      onChange={e => setForm(p => ({ ...p, [key]: e.target.value }))} />
                  </div>
                ))}
              </div>
            </div>

            <div className="modal-footer">
              <button className="btn btn-secondary" onClick={() => setShowModal(false)}>Cancel</button>
              <button className="btn btn-gradient" onClick={handleSubmit} disabled={submitting}>
                {submitting ? 'Logging…' : '+ Log Food'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
