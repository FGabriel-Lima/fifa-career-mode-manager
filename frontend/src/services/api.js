import axios from 'axios';

// Em produção, defina REACT_APP_API_URL (ex.: https://sua-api.onrender.com/api).
const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:5000/api',
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// O back-end responde erros como { mensagem }, { message } ou { error }.
export const apiError = (err, fallback) =>
  err.response?.data?.mensagem || err.response?.data?.message || err.response?.data?.error || fallback;

export default api;
