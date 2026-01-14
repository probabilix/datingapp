// Centralized API Configuration
// In production, set VITE_API_URL in your Vercel/Netlify environment variables.
// Example: VITE_API_URL=https://my-dating-app-backend.onrender.com

export const API_BASE_URL = import.meta.env.VITE_API_URL || (import.meta.env.PROD ? '' : 'http://localhost:5000');
