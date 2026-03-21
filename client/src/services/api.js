import axios from 'axios';

const api = axios.create({
  baseURL: 'https://fitness-application-u3qv.onrender.com/api',
  headers: { 'Content-Type': 'application/json' }
});

export default api;
