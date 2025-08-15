export const API_CONFIG = {
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3001',
  endpoints: {
    login: '/api/admin/login',
    statistics: '/api/selections/statistics',
    health: '/health'
  }
};

export default API_CONFIG; 