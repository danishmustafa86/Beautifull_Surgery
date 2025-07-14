// API Configuration
// For local development, use the backend URL:
const API_CONFIG = {
  BASE_URL: 'http://localhost:8000', // Change to '' for production on Render
  VERSION: process.env.REACT_APP_API_VERSION || 'v1',
  TIMEOUT: parseInt(process.env.REACT_APP_API_TIMEOUT) || 10000,
  RETRY_COUNT: parseInt(process.env.REACT_APP_REQUEST_RETRY_COUNT) || 3,
};

// Map Configuration
export const MAP_CONFIG = {
  DEFAULT_CENTER: [
    parseFloat(process.env.REACT_APP_DEFAULT_MAP_CENTER_LAT) || 13.7563,
    parseFloat(process.env.REACT_APP_DEFAULT_MAP_CENTER_LNG) || 100.5018
  ],
  DEFAULT_ZOOM: parseInt(process.env.REACT_APP_DEFAULT_MAP_ZOOM) || 12,
  TILE_LAYER: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
  ATTRIBUTION: '&copy; OpenStreetMap contributors'
};

// App Configuration
export const APP_CONFIG = {
  NAME: process.env.REACT_APP_APP_NAME || 'Healthtech Directory',
  VERSION: process.env.REACT_APP_APP_VERSION || '1.0.0',
  CONTACT_EMAIL: process.env.REACT_APP_CONTACT_EMAIL || 'support@healthtech.com',
  ENABLE_DEBUG: process.env.REACT_APP_ENABLE_DEBUG === 'true',
  ENABLE_ANALYTICS: process.env.REACT_APP_ENABLE_ANALYTICS === 'true',
};

// Theme Configuration
export const THEME_CONFIG = {
  MODE: process.env.REACT_APP_THEME_MODE || 'light',
  PRIMARY_COLOR: process.env.REACT_APP_PRIMARY_COLOR || '#1976d2',
  SECONDARY_COLOR: process.env.REACT_APP_SECONDARY_COLOR || '#9c27b0',
};

// Cache Configuration
export const CACHE_CONFIG = {
  DURATION: parseInt(process.env.REACT_APP_CACHE_DURATION) || 300000, // 5 minutes
};

export default API_CONFIG;