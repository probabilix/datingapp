// Centralized API Configuration
// Production = Relative Path (Same Domain)
// Development = Localhost:5000
export const API_BASE_URL = import.meta.env.PROD ? '' : 'http://localhost:5000';

console.log(`[Config] API_BASE_URL resolved to: "${API_BASE_URL}" (Prod: ${import.meta.env.PROD})`);
