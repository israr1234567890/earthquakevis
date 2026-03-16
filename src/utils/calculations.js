/**
 * Utility functions for earthquake data calculations and statistics
 */

/**
 * Calculate statistics for a collection of earthquakes
 * @param {Array} earthquakes - Array of earthquake objects
 * @returns {Object} Statistics object
 */
export const calculateEarthquakeStats = (earthquakes) => {
  if (!earthquakes || earthquakes.length === 0) {
    return {
      totalCount: 0,
      averageMagnitude: 0,
      maxMagnitude: 0,
      strongestLocation: null,
      mostActiveRegion: 'N/A',
      mostActiveCount: 0,
      deepestDepth: 0,
      magnitudeDistribution: {
        minor: 0,
        light: 0,
        moderate: 0,
        major: 0
      }
    };
  }

  const magnitudes = earthquakes
    .map(eq => eq.properties.mag)
    .filter(mag => mag !== null && mag !== undefined);

  const depths = earthquakes
    .map(eq => eq.geometry.coordinates[2])
    .filter(depth => depth !== null && depth !== undefined);

  // Calculate magnitude distribution
  const distribution = { minor: 0, light: 0, moderate: 0, major: 0 };
  magnitudes.forEach(mag => {
    if (mag < 3) distribution.minor++;
    else if (mag < 5) distribution.light++;
    else if (mag < 7) distribution.moderate++;
    else distribution.major++;
  });

  // Find strongest earthquake
  const strongestEarthquake = earthquakes.reduce((strongest, current) => {
    const currentMag = current.properties.mag || 0;
    const strongestMag = strongest?.properties.mag || 0;
    return currentMag > strongestMag ? current : strongest;
  }, null);

  // Get most active region info
  const mostActiveInfo = findMostActiveRegion(earthquakes);

  return {
    totalCount: earthquakes.length,
    averageMagnitude: magnitudes.length > 0
      ? (magnitudes.reduce((sum, mag) => sum + mag, 0) / magnitudes.length)
      : 0,
    maxMagnitude: magnitudes.length > 0 ? Math.max(...magnitudes) : 0,
    strongestLocation: strongestEarthquake?.properties.place || null,
    mostActiveRegion: mostActiveInfo.region,
    mostActiveCount: mostActiveInfo.count,
    deepestDepth: depths.length > 0 ? Math.max(...depths) : 0,
    magnitudeDistribution: distribution
  };
};

/**
 * Find the most active region based on earthquake count
 * @param {Array} earthquakes - Array of earthquake objects
 * @returns {string} Most active region name
 */
const findMostActiveRegion = (earthquakes) => {
  if (!earthquakes || earthquakes.length === 0) return { region: 'N/A', count: 0 };

  const regionCounts = {};

  earthquakes.forEach(earthquake => {
    const place = earthquake.properties.place;
    if (!place) return;

    // Extract region from place string (everything after the last comma)
    const parts = place.split(',');
    const region = parts[parts.length - 1].trim();

    regionCounts[region] = (regionCounts[region] || 0) + 1;
  });

  // Find region with highest count
  let mostActiveRegion = 'N/A';
  let maxCount = 0;

  Object.entries(regionCounts).forEach(([region, count]) => {
    if (count > maxCount) {
      maxCount = count;
      mostActiveRegion = region;
    }
  });

  return { region: mostActiveRegion, count: maxCount };
};

/**
 * Filter earthquakes based on criteria
 * @param {Array} earthquakes - Array of earthquake objects
 * @param {Object} filters - Filter criteria
 * @returns {Array} Filtered earthquakes
 */
export const filterEarthquakes = (earthquakes, filters) => {
  if (!earthquakes || earthquakes.length === 0) return [];

  return earthquakes.filter(earthquake => {
    const { properties, geometry } = earthquake;
    const magnitude = properties.mag;
    const depth = geometry.coordinates[2];
    const timestamp = properties.time;

    // Magnitude filter
    if (magnitude !== null && magnitude !== undefined) {
      if (magnitude < filters.magnitudeMin || magnitude > filters.magnitudeMax) {
        return false;
      }
    }

    // Depth filter
    if (depth !== null && depth !== undefined) {
      if (depth < filters.depthMin || depth > filters.depthMax) {
        return false;
      }
    }

    // Time filter
    if (filters.timePeriodHours && timestamp) {
      const now = Date.now();
      const cutoffTime = now - (filters.timePeriodHours * 60 * 60 * 1000);
      if (timestamp < cutoffTime) {
        return false;
      }
    }

    // Location search filter
    if (filters.locationSearch && filters.locationSearch.trim()) {
      const searchTerm = filters.locationSearch.toLowerCase().trim();
      const place = properties.place?.toLowerCase() || '';
      if (!place.includes(searchTerm)) {
        return false;
      }
    }

    return true;
  });
};

/**
 * Calculate distance between two geographic points using Haversine formula
 * @param {number} lat1 - Latitude of first point
 * @param {number} lng1 - Longitude of first point
 * @param {number} lat2 - Latitude of second point
 * @param {number} lng2 - Longitude of second point
 * @returns {number} Distance in kilometers
 */
export const calculateDistance = (lat1, lng1, lat2, lng2) => {
  const R = 6371; // Earth's radius in kilometers
  const dLat = toRadians(lat2 - lat1);
  const dLng = toRadians(lng2 - lng1);
  
  const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRadians(lat1)) * Math.cos(toRadians(lat2)) *
    Math.sin(dLng / 2) * Math.sin(dLng / 2);
  
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  
  return R * c;
};

/**
 * Convert degrees to radians
 * @param {number} degrees - Angle in degrees
 * @returns {number} Angle in radians
 */
const toRadians = (degrees) => {
  return degrees * (Math.PI / 180);
};

/**
 * Get color for earthquake magnitude
 * @param {number} magnitude - Earthquake magnitude
 * @returns {string} Color hex code
 */
export const getMagnitudeColor = (magnitude) => {
  if (magnitude < 3) return '#4ade80'; // Green - Minor
  if (magnitude < 5) return '#fbbf24'; // Yellow - Light
  if (magnitude < 6) return '#f97316'; // Orange - Moderate
  if (magnitude < 7) return '#dc2626'; // Red - Strong
  return '#991b1b'; // Dark red - Major
};

/**
 * Get marker size for earthquake magnitude
 * @param {number} magnitude - Earthquake magnitude
 * @returns {number} Marker radius in pixels
 */
export const getMagnitudeSize = (magnitude) => {
  if (magnitude < 3) return 4;
  if (magnitude < 5) return 6;
  if (magnitude < 6) return 8;
  if (magnitude < 7) return 12;
  return 16;
};

/**
 * Get magnitude severity label
 * @param {number} magnitude - Earthquake magnitude
 * @returns {string} Severity label
 */
export const getMagnitudeSeverity = (magnitude) => {
  if (magnitude < 3) return 'Minor';
  if (magnitude < 5) return 'Light';
  if (magnitude < 6) return 'Moderate';
  if (magnitude < 7) return 'Strong';
  return 'Major';
};