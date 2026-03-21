import { useState, useEffect } from 'react';
import api from '../services/api';

export default function NutritionFacts() {
  const [foods, setFoods] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All');
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [foodRes, catRes] = await Promise.all([
          api.get('/nutrition'),
          api.get('/nutrition/categories')
        ]);
        setFoods(foodRes.data);
        setCategories(['All', ...catRes.data]);
      } catch (e) {
        console.error("Failed to load nutrition facts", e);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) return <div className="loading-page"><div className="loading-spinner"/></div>;

  const filteredFoods = foods.filter(f => {
    const matchSearch = f.name.toLowerCase().includes(search.toLowerCase());
    const matchCat = category === 'All' ? true : f.category === category;
    return matchSearch && matchCat;
  });

  return (
    <div>
      <div className="card" style={{ marginBottom: 24 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 20 }}>
          <div>
            <h1 style={{ fontSize: 24, fontWeight: 800, fontFamily: 'Outfit, sans-serif' }}>Nutrition Database</h1>
            <p style={{ color: 'var(--text-secondary)' }}>Explore macronutrient and micronutrient profiles per 100g</p>
          </div>
          <div style={{ display: 'flex', gap: 12 }}>
            <input 
              type="text" 
              className="form-input" 
              placeholder="🔍 Search foods..." 
              value={search}
              onChange={e => setSearch(e.target.value)}
              style={{ width: 250 }}
            />
            <select 
              className="form-input form-select"
              value={category}
              onChange={e => setCategory(e.target.value)}
              style={{ width: 160 }}
            >
              {categories.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
        </div>
      </div>

      <div className="grid-3">
        {filteredFoods.map(food => (
          <div key={food.id} className="card" style={{ padding: 0, overflow: 'hidden' }}>
            <div style={{ padding: 16, background: 'var(--bg-card-2)', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ fontSize: 16, fontWeight: 600 }}>{food.name}</div>
              <div className="badge badge-primary">{food.category}</div>
            </div>
            
            <div style={{ padding: 16 }}>
              <div style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 12, textTransform: 'uppercase', letterSpacing: 0.5 }}>Per 100g</div>
              
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'end', marginBottom: 20 }}>
                <div style={{ fontSize: 32, fontWeight: 800, fontFamily: 'Outfit, sans-serif', color: 'var(--primary-light)', lineHeight: 1 }}>
                  {food.per100g.calories} <span style={{ fontSize: 14, color: 'var(--text-muted)', fontWeight: 400 }}>kcal</span>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0,1fr) minmax(0,1fr) minmax(0,1fr)', gap: 8, textAlign: 'center', marginBottom: 20 }}>
                <div style={{ background: 'rgba(249,115,22,0.1)', padding: '10px 4px', borderRadius: 'var(--radius-sm)' }}>
                  <div style={{ fontSize: 16, fontWeight: 700, color: 'var(--primary-light)' }}>{food.per100g.protein}g</div>
                  <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>Protein</div>
                </div>
                <div style={{ background: 'rgba(79,172,254,0.1)', padding: '10px 4px', borderRadius: 'var(--radius-sm)' }}>
                  <div style={{ fontSize: 16, fontWeight: 700, color: '#4facfe' }}>{food.per100g.carbs}g</div>
                  <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>Carbs</div>
                </div>
                <div style={{ background: 'rgba(234,179,8,0.1)', padding: '10px 4px', borderRadius: 'var(--radius-sm)' }}>
                  <div style={{ fontSize: 16, fontWeight: 700, color: '#eab308' }}>{food.per100g.fat}g</div>
                  <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>Fat</div>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12, fontSize: 12, color: 'var(--text-secondary)', borderTop: '1px solid var(--border)', paddingTop: 16 }}>
                <div><strong>Fiber:</strong> {food.per100g.fiber}g</div>
                <div><strong>Sugar:</strong> {food.per100g.sugar}g</div>
                <div><strong>Sodium:</strong> {food.per100g.sodium}mg</div>
              </div>

              {(Object.keys(food.vitamins).length > 0 || Object.keys(food.minerals).length > 0) && (
                <div style={{ marginTop: 16, background: 'var(--bg-card-2)', padding: 12, borderRadius: 'var(--radius-sm)', fontSize: 12 }}>
                  <div style={{ color: 'var(--success)', fontWeight: 600, marginBottom: 4 }}>Micro-nutrients Highlights</div>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                    {Object.entries(food.vitamins).slice(0, 3).map(([k,v]) => (
                      <span key={k} style={{ color: 'var(--text-secondary)' }}>{k}: {v}</span>
                    ))}
                    {Object.entries(food.minerals).slice(0, 3).map(([k,v]) => (
                      <span key={k} style={{ color: 'var(--text-secondary)' }}>{k}: {v}</span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        ))}
        {filteredFoods.length === 0 && (
          <div className="card" style={{ gridColumn: '1 / -1', textAlign: 'center', padding: 60 }}>
            <div style={{ fontSize: 48, marginBottom: 16 }}>🔍</div>
            <h3 style={{ fontSize: 20 }}>No foods found</h3>
            <p style={{ color: 'var(--text-muted)' }}>Try adjusting your search criteria</p>
          </div>
        )}
      </div>
    </div>
  );
}
