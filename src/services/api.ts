import axios from 'axios';
import { API_BASE_URL } from '../constants';

// récupérer token dans cookie
function getToken() {
  const match = document.cookie.match(/(^|;\s*)token=([^;]*)/);
  return match ? match[2] : null;
}

const api = axios.create({
  baseURL: API_BASE_URL,
});

// Ajout automatique du token dans toutes les requêtes protégées
api.interceptors.request.use((config) => {
  const token = getToken();
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export default api;
