/**
 * Data Export Utilities for Earthquake Data
 * Supports CSV, JSON, and GeoJSON formats for student assignments
 */

/**
 * Convert earthquake data to CSV format
 * @param {Array} earthquakes - Array of earthquake objects
 * @returns {string} CSV formatted string
 */
export const exportToCSV = (earthquakes) => {
  if (!earthquakes || earthquakes.length === 0) {
    return 'No data to export';
  }

  // Define CSV headers
  const headers = [
    'ID',
    'Magnitude',
    'Location',
    'Latitude',
    'Longitude',
    'Depth (km)',
    'Time',
    'Date',
    'Significance',
    'Felt Reports',
    'Tsunami',
    'Type',
    'URL'
  ];

  // Create CSV rows
  const rows = earthquakes.map(eq => {
    const props = eq.properties || {};
    const coords = eq.geometry?.coordinates || [null, null, null];
    const time = props.time ? new Date(props.time) : null;

    return [
      eq.id || '',
      props.mag || '',
      `"${(props.place || '').replace(/"/g, '""')}"`, // Escape quotes
      coords[1] || '', // Latitude
      coords[0] || '', // Longitude
      Math.abs(coords[2]) || '', // Depth
      time ? time.toLocaleTimeString() : '',
      time ? time.toLocaleDateString() : '',
      props.sig || '',
      props.felt || '',
      props.tsunami === 1 ? 'Yes' : 'No',
      props.type || '',
      props.url || ''
    ].join(',');
  });

  // Combine headers and rows
  return [headers.join(','), ...rows].join('\n');
};

/**
 * Convert earthquake data to JSON format
 * @param {Array} earthquakes - Array of earthquake objects
 * @returns {string} JSON formatted string
 */
export const exportToJSON = (earthquakes) => {
  if (!earthquakes || earthquakes.length === 0) {
    return JSON.stringify({ earthquakes: [], count: 0, exported: new Date().toISOString() }, null, 2);
  }

  const exportData = {
    exported: new Date().toISOString(),
    count: earthquakes.length,
    earthquakes: earthquakes.map(eq => ({
      id: eq.id,
      magnitude: eq.properties?.mag,
      location: eq.properties?.place,
      coordinates: {
        latitude: eq.geometry?.coordinates?.[1],
        longitude: eq.geometry?.coordinates?.[0],
        depth: Math.abs(eq.geometry?.coordinates?.[2] || 0)
      },
      time: eq.properties?.time,
      date: new Date(eq.properties?.time).toISOString(),
      significance: eq.properties?.sig,
      felt: eq.properties?.felt,
      tsunami: eq.properties?.tsunami === 1,
      type: eq.properties?.type,
      url: eq.properties?.url
    }))
  };

  return JSON.stringify(exportData, null, 2);
};

/**
 * Convert earthquake data to GeoJSON format (for GIS software)
 * @param {Array} earthquakes - Array of earthquake objects
 * @returns {string} GeoJSON formatted string
 */
export const exportToGeoJSON = (earthquakes) => {
  if (!earthquakes || earthquakes.length === 0) {
    return JSON.stringify({
      type: 'FeatureCollection',
      features: [],
      metadata: {
        count: 0,
        exported: new Date().toISOString()
      }
    }, null, 2);
  }

  const geoJSON = {
    type: 'FeatureCollection',
    metadata: {
      generated: new Date().toISOString(),
      count: earthquakes.length,
      title: 'Exported Earthquake Data'
    },
    features: earthquakes.map(eq => ({
      type: 'Feature',
      id: eq.id,
      properties: {
        ...eq.properties,
        exportedAt: new Date().toISOString()
      },
      geometry: eq.geometry
    }))
  };

  return JSON.stringify(geoJSON, null, 2);
};

/**
 * Trigger browser download of data
 * @param {string} content - File content
 * @param {string} filename - Name of file to download
 * @param {string} mimeType - MIME type of file
 */
export const downloadFile = (content, filename, mimeType = 'text/plain') => {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

/**
 * Export earthquake data in specified format
 * @param {Array} earthquakes - Array of earthquake objects
 * @param {string} format - Export format ('csv', 'json', 'geojson')
 * @param {string} filenamePrefix - Prefix for filename
 */
export const exportEarthquakeData = (earthquakes, format = 'csv', filenamePrefix = 'earthquakes') => {
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, 19);
  const filename = `${filenamePrefix}_${timestamp}.${format === 'geojson' ? 'geojson' : format}`;

  let content = '';
  let mimeType = 'text/plain';

  switch (format.toLowerCase()) {
    case 'csv':
      content = exportToCSV(earthquakes);
      mimeType = 'text/csv';
      break;
    case 'json':
      content = exportToJSON(earthquakes);
      mimeType = 'application/json';
      break;
    case 'geojson':
      content = exportToGeoJSON(earthquakes);
      mimeType = 'application/geo+json';
      break;
    default:
      throw new Error(`Unsupported export format: ${format}`);
  }

  downloadFile(content, filename, mimeType);
};

/**
 * Export statistics summary for reports
 * @param {Object} statistics - Statistics object
 * @param {Array} earthquakes - Array of earthquake objects
 * @returns {string} Formatted statistics text
 */
export const exportStatisticsSummary = (statistics, earthquakes) => {
  const timestamp = new Date().toISOString();

  const summary = `
EARTHQUAKE DATA SUMMARY
Generated: ${timestamp}
Total Earthquakes: ${statistics.totalCount || 0}

MAGNITUDE STATISTICS
Average Magnitude: ${statistics.averageMagnitude?.toFixed(2) || 'N/A'}
Maximum Magnitude: ${statistics.maxMagnitude?.toFixed(1) || 'N/A'}
Minimum Magnitude: ${statistics.minMagnitude?.toFixed(1) || 'N/A'}

DEPTH STATISTICS
Average Depth: ${statistics.averageDepth?.toFixed(0) || 'N/A'} km
Maximum Depth: ${statistics.maxDepth?.toFixed(0) || 'N/A'} km
Shallowest: ${statistics.minDepth?.toFixed(0) || 'N/A'} km

DISTRIBUTION BY MAGNITUDE
Minor (< 3.0): ${earthquakes?.filter(eq => eq.properties?.mag < 3).length || 0}
Light (3.0-4.9): ${earthquakes?.filter(eq => eq.properties?.mag >= 3 && eq.properties?.mag < 5).length || 0}
Moderate (5.0-6.9): ${earthquakes?.filter(eq => eq.properties?.mag >= 5 && eq.properties?.mag < 7).length || 0}
Major (≥ 7.0): ${earthquakes?.filter(eq => eq.properties?.mag >= 7).length || 0}

DISTRIBUTION BY DEPTH
Shallow (0-70 km): ${earthquakes?.filter(eq => Math.abs(eq.geometry?.coordinates?.[2] || 0) < 70).length || 0}
Intermediate (70-300 km): ${earthquakes?.filter(eq => {
  const depth = Math.abs(eq.geometry?.coordinates?.[2] || 0);
  return depth >= 70 && depth < 300;
}).length || 0}
Deep (≥ 300 km): ${earthquakes?.filter(eq => Math.abs(eq.geometry?.coordinates?.[2] || 0) >= 300).length || 0}

---
This data is sourced from USGS Earthquake Hazards Program
https://earthquake.usgs.gov/
  `.trim();

  return summary;
};

export default {
  exportToCSV,
  exportToJSON,
  exportToGeoJSON,
  downloadFile,
  exportEarthquakeData,
  exportStatisticsSummary
};
