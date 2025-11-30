import axios from 'axios';

// Creamos la conexión base
const api = axios.create({
  baseURL: 'http://localhost:8000', // La dirección de tu Backend (FastAPI)
});

// INTERCEPTOR (El Portero)
// Antes de que salga cualquier petición, revisa si hay un token guardado
api.interceptors.request.use(
  (config) => {
    // 1. Busca el token en el bolsillo del navegador (localStorage)
    const token = localStorage.getItem('token');
    
    // 2. Si existe, pégalo en el mensaje como "Bearer token..."
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default api;