import { useState, useEffect } from 'react';
import api from '../services/api';

export default function MythBuster() {
  const [myths, setMyths] = useState([]);
  const [categories, setCategories] = useState([]);
  const [activeCategory, setActiveCategory] = useState('All');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [mythsRes, catsRes] = await Promise.all([
          api.get('/myths'),
          api.get('/myths/categories')
        ]);
        setMyths(mythsRes.data);
        setCategories(['All', ...catsRes.data]);
      } catch (e) {
        console.error("Failed to load myths", e);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) return <div className="loading-page"><div className="loading-spinner"/></div>;

  const filtered = activeCategory === 'All'
    ? myths
    : myths.filter(m => m.category === activeCategory);

  return (
    <div>
      <div style={{ marginBottom: 32, textAlign: 'center' }}>
        <h1 style={{ fontSize: 32, fontWeight: 800, fontFamily: 'Outfit, sans-serif' }}>Fitness Myth Buster 🕵️‍♂️</h1>
        <p style={{ color: 'var(--text-secondary)', maxWidth: 600, margin: '8px auto', fontSize: 16 }}>
          The fitness industry is full of misinformation. We break down the most common myths using science-backed evidence so you can focus on what actually works.
        </p>

        <div style={{ display: 'flex', gap: 10, justifyContent: 'center', marginTop: 24, flexWrap: 'wrap' }}>
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
        {filtered.map(item => {
          const isFalse = item.verdict === 'FALSE';
          const isPartially = item.verdict === 'PARTIALLY FALSE';
          
          return (
            <div 
              key={item.id} 
              className={`myth-card ${isFalse ? 'false' : isPartially ? 'partially' : 'nuanced'}`}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
                <span className="badge badge-info">{item.category}</span>
                <span style={{ fontSize: 24 }}>{item.emoji}</span>
              </div>
              
              <h3 style={{ fontSize: 20, fontWeight: 700, fontFamily: 'Outfit, sans-serif', marginBottom: 12, lineHeight: 1.3 }}>
                "{item.myth}"
              </h3>
              
              <div 
                className="myth-verdict" 
                style={{ 
                  background: isFalse ? 'rgba(248,113,113,0.15)' : isPartially ? 'rgba(96,165,250,0.15)' : 'rgba(251,191,36,0.15)',
                  color: isFalse ? 'var(--danger)' : isPartially ? 'var(--info)' : 'var(--warning)',
                  fontWeight: 800
                }}
              >
                {isFalse ? '❌' : isPartially ? '⚠️' : '🤔'} VERDICT: {item.verdict}
              </div>

              <div style={{ marginTop: 20 }}>
                <div style={{ color: 'var(--primary-light)', fontWeight: 600, fontSize: 13, textTransform: 'uppercase', marginBottom: 4 }}>The Truth</div>
                <p style={{ color: 'var(--text-primary)', fontSize: 14, lineHeight: 1.5 }}>
                  {item.truth}
                </p>
              </div>

              <div style={{ marginTop: 16, padding: '12px', background: 'var(--bg-input)', borderRadius: 'var(--radius-sm)' }}>
                <div style={{ color: 'var(--accent)', fontWeight: 600, fontSize: 12, textTransform: 'uppercase', marginBottom: 4 }}>🔬 The Science</div>
                <p style={{ color: 'var(--text-secondary)', fontSize: 13, lineHeight: 1.5 }}>
                  {item.science}
                </p>
              </div>

              <div style={{ marginTop: 16, display: 'flex', gap: 10, alignItems: 'flex-start' }}>
                <span style={{ fontSize: 20 }}>💡</span>
                <div>
                  <div style={{ color: 'var(--success)', fontWeight: 600, fontSize: 12, textTransform: 'uppercase' }}>Action Tip</div>
                  <div style={{ fontSize: 14, color: 'var(--text-primary)', marginTop: 2 }}>{item.actionTip}</div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
