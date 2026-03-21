import { useState, useEffect } from 'react';
import api from '../services/api';

export default function Supplements() {
  const [supplements, setSupplements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState('All');
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [supRes, catRes] = await Promise.all([
          api.get('/supplements'),
          api.get('/supplements/categories')
        ]);
        setSupplements(supRes.data);
        setCategories(['All', ...catRes.data]);
      } catch (e) {
        console.error("Failed to load supplements", e);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) return <div className="loading-page"><div className="loading-spinner"/></div>;

  const filtered = activeCategory === 'All' 
    ? supplements 
    : supplements.filter(s => s.category === activeCategory);

  return (
    <div>
      <div className="card" style={{ marginBottom: 24, background: 'linear-gradient(135deg, var(--bg-card), rgba(249,115,22,0.05))' }}>
        <h1 style={{ fontSize: 24, fontWeight: 800, fontFamily: 'Outfit, sans-serif' }}>Evidence-Based Supplement Guide</h1>
        <p style={{ color: 'var(--text-secondary)', marginTop: 8 }}>
          Not all supplements are created equal. Use this clinical guide to determine what is worth your money and what is just marketing. Look for "Strong" evidence ratings.
        </p>
        
        <div style={{ display: 'flex', gap: 8, marginTop: 20, flexWrap: 'wrap' }}>
          {categories.map(cat => (
            <button
              key={cat}
              className={`btn btn-sm ${activeCategory === cat ? 'btn-primary' : 'btn-secondary'}`}
              onClick={() => setActiveCategory(cat)}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      <div className="grid-2">
        {filtered.map(sup => (
          <div key={sup.id} className="supplement-card">
            <div className="supplement-header">
              <div className="supplement-emoji" style={{ background: 'var(--bg-input)', width: 64, height: 64, borderRadius: 'var(--radius-md)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                {sup.emoji}
              </div>
              <div className="supplement-info">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div className="supplement-name">{sup.name}</div>
                  <div className="supplement-category badge badge-info">{sup.category}</div>
                </div>
                
                <div className="supplement-rating">
                  {Array(5).fill(0).map((_, i) => (
                    <span key={i} style={{ color: i < sup.rating ? '#fbbf24' : 'var(--border)', fontSize: 14 }}>★</span>
                  ))}
                  <span className={`evidence-badge ${sup.evidence.includes('Strong') ? 'strong' : 'moderate'}`} style={{ marginLeft: 8 }}>
                    {sup.evidence} Evidence
                  </span>
                </div>
              </div>
            </div>
            
            <p style={{ color: 'var(--text-secondary)', fontSize: 14, marginBottom: 16 }}>
              {sup.description}
            </p>

            <div className="supplement-section">
              <div className="supplement-section-title" style={{ color: 'var(--success)' }}>Key Benefits</div>
              <ul className="supplement-list">
                {sup.benefits.map((b, i) => <li key={i}>{b}</li>)}
              </ul>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginTop: 16, background: 'var(--bg-input)', padding: 12, borderRadius: 'var(--radius-sm)' }}>
              <div>
                <div style={{ fontSize: 11, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: 4 }}>Dosage</div>
                <div style={{ fontSize: 13, fontWeight: 500, color: 'var(--primary-light)' }}>{sup.dosage}</div>
              </div>
              <div>
                <div style={{ fontSize: 11, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: 4 }}>Timing</div>
                <div style={{ fontSize: 13, fontWeight: 500, color: 'var(--accent)' }}>{sup.timing}</div>
              </div>
            </div>

            <div className="supplement-section">
              <div className="supplement-section-title">Authenticity & Sourcing</div>
              <ul className="supplement-list" style={{ color: 'var(--text-primary)' }}>
                {sup.authenticity.map((a, i) => <li key={i}>{a}</li>)}
              </ul>
            </div>

            <div className="warning-box">
              <span>⚠️</span>
              <div>{sup.warning}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
