import { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const stored = localStorage.getItem('fittrack_user');
    if (stored) {
      const u = JSON.parse(stored);
      setUser(u);
      api.defaults.headers.common['Authorization'] = `Bearer ${u.token}`;
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    const { data } = await api.post('/auth/login', { email, password });
    setUser(data);
    localStorage.setItem('fittrack_user', JSON.stringify(data));
    api.defaults.headers.common['Authorization'] = `Bearer ${data.token}`;
    return data;
  };

  const register = async (name, email, password) => {
    const { data } = await api.post('/auth/register', { name, email, password });
    setUser(data);
    localStorage.setItem('fittrack_user', JSON.stringify(data));
    api.defaults.headers.common['Authorization'] = `Bearer ${data.token}`;
    return data;
  };

  const completeOnboarding = async (formData) => {
    const { data } = await api.put('/auth/onboarding', formData);
    setUser(data);
    localStorage.setItem('fittrack_user', JSON.stringify(data));
    return data;
  };

  const updateProfile = async (formData) => {
    const { data } = await api.put('/auth/profile', formData);
    setUser(data);
    localStorage.setItem('fittrack_user', JSON.stringify(data));
    return data;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('fittrack_user');
    delete api.defaults.headers.common['Authorization'];
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, completeOnboarding, updateProfile, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
