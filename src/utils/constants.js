/**
 * Application constants and configuration values
 */

// Earthquake magnitude severity levels
export const MAGNITUDE_LEVELS = {
  MINOR: { min: 0, max: 3, color: '#4ade80', label: 'Minor' },
  LIGHT: { min: 3, max: 5, color: '#fbbf24', label: 'Light' },
  MODERATE: { min: 5, max: 7, color: '#f97316', label: 'Moderate' },
  MAJOR: { min: 7, max: 10, color: '#ef4444', label: 'Major' }
};

// Magnitude colors for easy access
export const MAGNITUDE_COLORS = {
  MINOR: '#4ade80',
  LIGHT: '#fbbf24', 
  MODERATE: '#f97316',
  STRONG: '#dc2626',
  MAJOR: '#991b1b'
};

// Magnitude ranges for legend
export const MAGNITUDE_RANGES = [
  { min: 0, max: 3, color: MAGNITUDE_COLORS.MINOR, label: 'Minor' },
  { min: 3, max: 5, color: MAGNITUDE_COLORS.LIGHT, label: 'Light' },
  { min: 5, max: 6, color: MAGNITUDE_COLORS.MODERATE, label: 'Moderate' },
  { min: 6, max: 7, color: MAGNITUDE_COLORS.STRONG, label: 'Strong' },
  { min: 7, max: 10, color: MAGNITUDE_COLORS.MAJOR, label: 'Major' }
];

// Time period options for filtering
export const TIME_PERIODS = {
  HOUR: { value: 'hour', label: 'Past Hour', hours: 1 },
  SIX_HOURS: { value: '6hours', label: 'Past 6 Hours', hours: 6 },
  TWELVE_HOURS: { value: '12hours', label: 'Past 12 Hours', hours: 12 },
  DAY: { value: 'day', label: 'Past 24 Hours', hours: 24 }
};

// USGS API endpoints
export const API_ENDPOINTS = {
  ALL_HOUR: 'all_hour.geojson',
  ALL_DAY: 'all_day.geojson',
  ALL_WEEK: 'all_week.geojson',
  ALL_MONTH: 'all_month.geojson'
};

// Map configuration
export const MAP_CONFIG = {
  DEFAULT_CENTER: [
    parseFloat(import.meta.env.VITE_DEFAULT_MAP_CENTER_LAT) || 20,
    parseFloat(import.meta.env.VITE_DEFAULT_MAP_CENTER_LNG) || 0
  ],
  DEFAULT_ZOOM: parseInt(import.meta.env.VITE_DEFAULT_MAP_ZOOM) || 2,
  MIN_ZOOM: parseInt(import.meta.env.VITE_MIN_MAP_ZOOM) || 2,
  MAX_ZOOM: parseInt(import.meta.env.VITE_MAX_MAP_ZOOM) || 18,
  TILE_LAYER: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
  ATTRIBUTION: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
};

// Application settings
export const APP_CONFIG = {
  REFRESH_INTERVAL: parseInt(import.meta.env.VITE_DEFAULT_REFRESH_INTERVAL) || 300000, // 5 minutes
  MAX_EARTHQUAKES: parseInt(import.meta.env.VITE_MAX_EARTHQUAKES_DISPLAY) || 1000,
  API_TIMEOUT: parseInt(import.meta.env.VITE_USGS_API_TIMEOUT) || 10000
};

// Filter defaults
export const FILTER_DEFAULTS = {
  MAGNITUDE_MIN: 0,
  MAGNITUDE_MAX: 10,
  DEPTH_MIN: 0,
  DEPTH_MAX: 700,
  TIME_PERIOD: TIME_PERIODS.DAY.value
};

// Marker clustering options
export const CLUSTER_CONFIG = {
  MAX_CLUSTER_RADIUS: 80,
  DISABLE_CLUSTERING_AT_ZOOM: 10,
  SHOW_COVERAGE_ON_HOVER: false
};