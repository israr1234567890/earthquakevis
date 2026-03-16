/**
 * RTK Query API service for USGS Earthquake data
 */

import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { API_ENDPOINTS, APP_CONFIG } from '../../utils/constants.js';

/**
 * Transform raw USGS GeoJSON response to normalized format
 * @param {Object} response - Raw USGS API response
 * @returns {Object} Normalized earthquake data
 */
const transformEarthquakeResponse = (response) => {
  if (!response || !response.features) {
    return {
      earthquakes: [],
      metadata: {
        generated: Date.now(),
        count: 0,
        status: 200
      }
    };
  }

  // Normalize earthquake data and add computed fields
  const earthquakes = response.features.map(feature => ({
    ...feature,
    id: feature.id || `eq_${feature.properties.time}_${Math.random()}`,
    // Add computed fields for easier access
    magnitude: feature.properties.mag,
    location: feature.properties.place,
    timestamp: feature.properties.time,
    coordinates: {
      lat: feature.geometry.coordinates[1],
      lng: feature.geometry.coordinates[0],
      depth: feature.geometry.coordinates[2]
    }
  }));

  return {
    earthquakes,
    metadata: {
      generated: response.metadata?.generated || Date.now(),
      count: earthquakes.length,
      status: 200,
      api: response.metadata?.api || '1.0.0',
      title: response.metadata?.title || 'USGS Earthquake Data'
    }
  };
};

/**
 * RTK Query API definition for earthquake data
 */
export const earthquakeApi = createApi({
  reducerPath: 'earthquakeApi',
  
  baseQuery: fetchBaseQuery({
    baseUrl: import.meta.env.VITE_USGS_API_BASE_URL || 'https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary',
    timeout: APP_CONFIG.API_TIMEOUT,
    
    // Add error handling and request preparation
    prepareHeaders: (headers) => {
      headers.set('Accept', 'application/json');
      return headers;
    },
  }),

  // Tag types for cache invalidation
  tagTypes: ['Earthquakes'],

  endpoints: (builder) => ({
    /**
     * Fetch earthquakes for a specific time period
     */
    getEarthquakes: builder.query({
      query: (timePeriod = 'day') => {
        const endpoint = API_ENDPOINTS[`ALL_${timePeriod.toUpperCase()}`] || API_ENDPOINTS.ALL_DAY;
        return endpoint;
      },
      
      transformResponse: transformEarthquakeResponse,
      
      // Cache for 5 minutes by default
      keepUnusedDataFor: 300,
      
      // Provide tags for cache invalidation
      providesTags: (result, error, timePeriod) => [
        { type: 'Earthquakes', id: timePeriod },
        'Earthquakes'
      ],

      // Handle errors gracefully
      transformErrorResponse: (response, meta, arg) => {
        console.error('Earthquake API Error:', response);
        return {
          status: response.status,
          message: response.data?.message || 'Failed to fetch earthquake data',
          timestamp: Date.now()
        };
      },
    }),

    /**
     * Get detailed information for a specific earthquake
     */
    getEarthquakeDetails: builder.query({
      query: (earthquakeId) => `detail/${earthquakeId}.geojson`,
      
      transformResponse: (response) => {
        if (!response || !response.properties) {
          return null;
        }
        
        return {
          ...response,
          id: response.id,
          coordinates: {
            lat: response.geometry.coordinates[1],
            lng: response.geometry.coordinates[0],
            depth: response.geometry.coordinates[2]
          }
        };
      },
      
      // Cache detailed data longer since it doesn't change
      keepUnusedDataFor: 600,
      
      providesTags: (result, error, earthquakeId) => [
        { type: 'Earthquakes', id: earthquakeId }
      ],
    }),
  }),
});

// Export hooks for components to use
export const {
  useGetEarthquakesQuery,
  useGetEarthquakeDetailsQuery,
  useLazyGetEarthquakesQuery,
  useLazyGetEarthquakeDetailsQuery,
} = earthquakeApi;

// Export utility functions for manual cache management
export const {
  util: { getRunningQueriesThunk },
} = earthquakeApi;

// Selectors for accessing cached data
export const selectEarthquakesResult = earthquakeApi.endpoints.getEarthquakes.select;
export const selectEarthquakeDetailsResult = earthquakeApi.endpoints.getEarthquakeDetails.select;