/**
 * Utility functions for formatting earthquake data
 */

import { MAGNITUDE_LEVELS } from './constants.js';

/**
 * Format earthquake magnitude with appropriate precision
 * @param {number} magnitude - Raw magnitude value
 * @returns {string} Formatted magnitude string
 */
export const formatMagnitude = (magnitude) => {
  if (magnitude === null || magnitude === undefined) return 'N/A';
  return parseFloat(magnitude).toFixed(1);
};

/**
 * Format earthquake depth in kilometers
 * @param {number} depth - Depth in kilometers
 * @returns {string} Formatted depth string
 */
export const formatDepth = (depth) => {
  if (depth === null || depth === undefined) return 'N/A';
  return `${parseFloat(depth).toFixed(1)} km`;
};

/**
 * Format earthquake timestamp to readable date/time
 * @param {number} timestamp - Unix timestamp in milliseconds
 * @returns {string} Formatted date/time string
 */
export const formatDateTime = (timestamp) => {
  if (!timestamp) return 'N/A';
  
  const date = new Date(timestamp);
  const now = new Date();
  const diffMs = now - date;
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  const diffMinutes = Math.floor(diffMs / (1000 * 60));

  // Show relative time for recent earthquakes
  if (diffMinutes < 60) {
    return `${diffMinutes} minute${diffMinutes !== 1 ? 's' : ''} ago`;
  } else if (diffHours < 24) {
    return `${diffHours} hour${diffHours !== 1 ? 's' : ''} ago`;
  }

  // Show full date/time for older earthquakes
  return date.toLocaleString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    timeZoneName: 'short'
  });
};

/**
 * Format coordinates with appropriate precision
 * @param {number} lat - Latitude
 * @param {number} lng - Longitude
 * @returns {string} Formatted coordinates string
 */
export const formatCoordinates = (lat, lng) => {
  if (lat === null || lat === undefined || lng === null || lng === undefined) {
    return 'N/A';
  }
  
  const latStr = `${Math.abs(lat).toFixed(4)}°${lat >= 0 ? 'N' : 'S'}`;
  const lngStr = `${Math.abs(lng).toFixed(4)}°${lng >= 0 ? 'E' : 'W'}`;
  
  return `${latStr}, ${lngStr}`;
};

/**
 * Get magnitude severity level and color
 * @param {number} magnitude - Earthquake magnitude
 * @returns {Object} Severity level object with color and label
 */
export const getMagnitudeSeverity = (magnitude) => {
  if (magnitude === null || magnitude === undefined) {
    return MAGNITUDE_LEVELS.MINOR;
  }

  for (const [key, level] of Object.entries(MAGNITUDE_LEVELS)) {
    if (magnitude >= level.min && magnitude < level.max) {
      return level;
    }
  }

  // For magnitudes >= 7, return MAJOR
  return MAGNITUDE_LEVELS.MAJOR;
};

/**
 * Calculate marker size based on magnitude
 * @param {number} magnitude - Earthquake magnitude
 * @returns {number} Marker radius in pixels
 */
export const calculateMarkerSize = (magnitude) => {
  if (magnitude === null || magnitude === undefined) return 5;
  
  // Base size of 5px, with exponential scaling for visual impact
  const baseSize = 5;
  const scaleFactor = Math.pow(magnitude, 1.5);
  
  return Math.max(baseSize, Math.min(scaleFactor * 2, 25)); // Cap at 25px
};

/**
 * Format location name by removing unnecessary prefixes
 * @param {string} place - Raw place string from USGS
 * @returns {string} Cleaned location name
 */
export const formatLocation = (place) => {
  if (!place) return 'Unknown Location';
  
  // Remove distance and direction prefixes (e.g., "23km NNE of")
  const cleanPlace = place.replace(/^\d+km\s+[NSEW]{1,3}\s+of\s+/i, '');
  
  return cleanPlace.trim();
};

/**
 * Format location for display (shorter version)
 * @param {string} place - Raw place string from USGS
 * @returns {string} Short location name
 */
export const formatLocationShort = (place) => {
  if (!place) return 'Unknown';
  
  const formatted = formatLocation(place);
  
  // If location has comma, take the last part (usually the region/country)
  if (formatted.includes(',')) {
    const parts = formatted.split(',');
    return parts[parts.length - 1].trim();
  }
  
  // If too long, truncate
  if (formatted.length > 20) {
    return formatted.substring(0, 17) + '...';
  }
  
  return formatted;
};

/**
 * Format felt reports count
 * @param {number} felt - Number of felt reports
 * @returns {string} Formatted felt reports string
 */
export const formatFeltReports = (felt) => {
  if (!felt || felt === 0) return 'No reports';
  
  if (felt === 1) return '1 report';
  
  // Format large numbers with commas
  return `${felt.toLocaleString()} reports`;
};