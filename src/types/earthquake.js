/**
 * Type definitions and interfaces for earthquake data
 * Using JSDoc for type documentation (can be converted to TypeScript later)
 */

/**
 * @typedef {Object} EarthquakeProperties
 * @property {number|null} mag - Magnitude of the earthquake
 * @property {string|null} place - Location description
 * @property {number} time - Timestamp in milliseconds
 * @property {number} updated - Last update timestamp
 * @property {number|null} tz - Timezone offset
 * @property {string} url - USGS detail page URL
 * @property {string} detail - USGS detail API URL
 * @property {number|null} felt - Number of felt reports
 * @property {number|null} cdi - Maximum Community Determined Intensity
 * @property {number|null} mmi - Maximum Modified Mercalli Intensity
 * @property {string|null} alert - Alert level (green, yellow, orange, red)
 * @property {string} status - Status (automatic, reviewed, deleted)
 * @property {number} tsunami - Tsunami flag (0 or 1)
 * @property {number|null} sig - Significance score
 * @property {string} net - Network that reported the earthquake
 * @property {string} code - Event code
 * @property {string} ids - Comma-separated list of event IDs
 * @property {string|null} sources - Comma-separated list of network contributors
 * @property {string|null} types - Comma-separated list of product types
 * @property {number|null} nst - Number of seismic stations
 * @property {number|null} dmin - Minimum distance to stations
 * @property {number|null} rms - Root-mean-square travel time residual
 * @property {number|null} gap - Largest azimuthal gap between stations
 * @property {string|null} magType - Magnitude type
 * @property {string|null} type - Event type
 * @property {string|null} title - Event title
 */

/**
 * @typedef {Object} EarthquakeGeometry
 * @property {string} type - Geometry type (always "Point")
 * @property {[number, number, number]} coordinates - [longitude, latitude, depth]
 */

/**
 * @typedef {Object} EarthquakeFeature
 * @property {string} type - Feature type (always "Feature")
 * @property {EarthquakeProperties} properties - Earthquake properties
 * @property {EarthquakeGeometry} geometry - Earthquake location
 * @property {string} id - Unique earthquake identifier
 */

/**
 * @typedef {Object} EarthquakeCoordinates
 * @property {number} lat - Latitude
 * @property {number} lng - Longitude
 * @property {number} depth - Depth in kilometers
 */

/**
 * @typedef {Object} NormalizedEarthquake
 * @property {string} id - Unique identifier
 * @property {EarthquakeProperties} properties - Original properties
 * @property {EarthquakeGeometry} geometry - Original geometry
 * @property {number|null} magnitude - Convenience accessor for magnitude
 * @property {string|null} location - Convenience accessor for location
 * @property {number} timestamp - Convenience accessor for timestamp
 * @property {EarthquakeCoordinates} coordinates - Normalized coordinates
 */

/**
 * @typedef {Object} EarthquakeMetadata
 * @property {number} generated - Generation timestamp
 * @property {string} url - API URL
 * @property {string} title - Dataset title
 * @property {number} status - HTTP status code
 * @property {string} api - API version
 * @property {number} count - Number of earthquakes
 */

/**
 * @typedef {Object} EarthquakeResponse
 * @property {NormalizedEarthquake[]} earthquakes - Array of normalized earthquakes
 * @property {EarthquakeMetadata} metadata - Response metadata
 */

/**
 * @typedef {Object} EarthquakeStatistics
 * @property {number} total - Total number of earthquakes
 * @property {number} averageMagnitude - Average magnitude
 * @property {number} strongestMagnitude - Highest magnitude
 * @property {number} deepestDepth - Maximum depth
 * @property {string} mostActiveRegion - Region with most earthquakes
 * @property {Object} magnitudeDistribution - Count by magnitude category
 * @property {number} magnitudeDistribution.minor - Count of minor earthquakes (<3.0)
 * @property {number} magnitudeDistribution.light - Count of light earthquakes (3.0-4.9)
 * @property {number} magnitudeDistribution.moderate - Count of moderate earthquakes (5.0-6.9)
 * @property {number} magnitudeDistribution.major - Count of major earthquakes (>=7.0)
 */

/**
 * @typedef {Object} FilterCriteria
 * @property {number} magnitudeMin - Minimum magnitude
 * @property {number} magnitudeMax - Maximum magnitude
 * @property {number} depthMin - Minimum depth in km
 * @property {number} depthMax - Maximum depth in km
 * @property {number} timePeriodHours - Time period in hours
 * @property {string} locationSearch - Location search term
 * @property {number} minimumFeltReports - Minimum felt reports
 * @property {boolean} significantOnly - Show only significant earthquakes
 */

/**
 * @typedef {Object} MagnitudeLevel
 * @property {number} min - Minimum magnitude for this level
 * @property {number} max - Maximum magnitude for this level
 * @property {string} color - Hex color code for this level
 * @property {string} label - Human-readable label
 */

/**
 * @typedef {Object} TimePeriod
 * @property {string} value - Internal value identifier
 * @property {string} label - Display label
 * @property {number} hours - Duration in hours
 */

// Export empty object to make this a module
export {};