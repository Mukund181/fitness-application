import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';

export default function Recipes() {
  const { user } = useAuth();
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [selectedRecipe, setSelectedRecipe] = useState(null);

  useEffect(() => {
    const fetchRecipes = async () => {
      try {
        const res = await api.get('/recipes');
        setRecipes(res.data);
      } catch (e) {
        console.error("Failed to load recipes", e);
      } finally {
        setLoading(false);
      }
    };
    fetchRecipes();
  }, []);

  if (loading) return <div className="loading-page"><div className="loading-spinner"/></div>;

  const filteredRecipes = filter === 'all' 
    ? recipes 
    : recipes.filter(r => r.goal.includes(filter));

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 24 }}>
        <div>
          <h1 style={{ fontSize: 28, fontWeight: 800, fontFamily: 'Outfit, sans-serif' }}>Healthy Recipes</h1>
          <p style={{ color: 'var(--text-secondary)', marginTop: 4 }}>Fuel your body with goal-aligned meals</p>
        </div>
        
        <select 
          className="form-input form-select" 
          style={{ width: 200 }}
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
        >
          <option value="all">All Goals</option>
          <option value="fat_loss">Fat Loss</option>
          <option value="muscle_gain">Muscle Gain</option>
          <option value="maintenance">Maintenance</option>
          <option value="endurance">Endurance</option>
        </select>
      </div>

      <div className="grid-auto">
        {filteredRecipes.map(recipe => (
          <div key={recipe.id} className="recipe-card" onClick={() => setSelectedRecipe(recipe)}>
            <div className="recipe-card-header">
              {recipe.image}
              <div className="recipe-goal-badges">
                {recipe.goal.map(g => (
                  <span key={g} className={`badge badge-${g === 'fat_loss' ? 'danger' : g === 'muscle_gain' ? 'primary' : 'success'}`} style={{ fontSize: 10 }}>
                    {g.replace('_', ' ').toUpperCase()}
                  </span>
                ))}
              </div>
            </div>
            <div className="recipe-card-body">
              <div className="recipe-name">{recipe.name}</div>
              <div className="recipe-meta">
                <span>⏱️ {parseInt(recipe.prepTime) + parseInt(recipe.cookTime)}m total</span>
                <span>🔥 {recipe.calories} kcal</span>
                <span>🔥 {recipe.difficulty}</span>
              </div>
              
              <div className="recipe-macro-row">
                <div className="recipe-macro-chip" style={{ color: 'var(--primary-light)' }}>
                  <strong>{recipe.protein}g</strong> Protein
                </div>
                <div className="recipe-macro-chip" style={{ color: 'var(--accent-2)' }}>
                  <strong>{recipe.carbs}g</strong> Carbs
                </div>
                <div className="recipe-macro-chip" style={{ color: 'var(--accent)' }}>
                  <strong>{recipe.fat}g</strong> Fat
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {selectedRecipe && (
        <div style={{
          position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.8)', zIndex: 1000,
          display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24
        }} onClick={() => setSelectedRecipe(null)}>
          <div 
            style={{ 
              background: 'var(--bg-card)', width: '100%', maxWidth: 700, 
              maxHeight: '90vh', overflowY: 'auto', borderRadius: 'var(--radius-xl)',
              border: '1px solid var(--border)' 
            }}
            onClick={e => e.stopPropagation()}
          >
            <div style={{ background: 'linear-gradient(135deg, var(--bg-hover), var(--bg-card))', padding: 40, textAlign: 'center', fontSize: 64, position: 'relative' }}>
              {selectedRecipe.image}
              <button 
                onClick={() => setSelectedRecipe(null)}
                style={{ position: 'absolute', top: 16, right: 16, background: 'rgba(0,0,0,0.3)', border: 'none', color: 'white', width: 32, height: 32, borderRadius: '50%', cursor: 'pointer' }}
              >✕</button>
            </div>
            
            <div style={{ padding: 32 }}>
              <h2 style={{ fontSize: 24, fontWeight: 800, fontFamily: 'Outfit, sans-serif', marginBottom: 16 }}>{selectedRecipe.name}</h2>
              
              <div style={{ display: 'flex', gap: 16, marginBottom: 24, padding: '16px 0', borderTop: '1px solid var(--border)', borderBottom: '1px solid var(--border)' }}>
                <div><strong>Prep:</strong> {selectedRecipe.prepTime}</div>
                <div><strong>Cook:</strong> {selectedRecipe.cookTime}</div>
                <div><strong>Servings:</strong> {selectedRecipe.servings}</div>
              </div>

              <div className="grid-2">
                <div>
                  <h3 style={{ fontSize: 16, marginBottom: 12, color: 'var(--primary-light)' }}>Ingredients</h3>
                  <ul style={{ paddingLeft: 20, color: 'var(--text-secondary)', display: 'flex', flexDirection: 'column', gap: 8 }}>
                    {selectedRecipe.ingredients.map((ing, i) => (
                      <li key={i}>{ing}</li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h3 style={{ fontSize: 16, marginBottom: 12, color: 'var(--accent)' }}>Instructions</h3>
                  <ol style={{ paddingLeft: 20, color: 'var(--text-secondary)', display: 'flex', flexDirection: 'column', gap: 8 }}>
                    {selectedRecipe.instructions.map((inst, i) => (
                      <li key={i}>{inst}</li>
                    ))}
                  </ol>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
