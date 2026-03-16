/**
 * Redux slice for earthquake state management
 */

import { createSlice, createSelector } from '@reduxjs/toolkit';
import { earthquakeApi } from './earthquakeAPI.js';

/**
 * Initial state for earthquake slice
 */
const initialState = {
  // UI state
  selectedEarthquake: null,
  isDetailsOpen: false,
  
  // Display preferences
  showClusters: true,
  animateMarkers: true,
  
  // Auto-refresh settings
  autoRefresh: true,
  refreshInterval: 300000, // 5 minutes
  lastRefresh: null,
  
  // Error handling
  error: null,
  retryCount: 0,
  maxRetries: 3,
};

/**
 * Earthquake slice with reducers and actions
 */
const earthquakeSlice = createSlice({
  name: 'earthquakes',
  initialState,
  
  reducers: {
    /**
     * Select an earthquake for detailed view
     */
    selectEarthquake: (state, action) => {
      state.selectedEarthquake = action.payload;
      state.isDetailsOpen = true;
    },

    /**
     * Clear selected earthquake
     */
    clearSelection: (state) => {
      state.selectedEarthquake = null;
      state.isDetailsOpen = false;
    },

    /**
     * Toggle details panel visibility
     */
    toggleDetailsPanel: (state) => {
      state.isDetailsOpen = !state.isDetailsOpen;
    },

    /**
     * Update display preferences
     */
    updateDisplayPreferences: (state, action) => {
      const { showClusters, animateMarkers } = action.payload;
      if (showClusters !== undefined) state.showClusters = showClusters;
      if (animateMarkers !== undefined) state.animateMarkers = animateMarkers;
    },

    /**
     * Configure auto-refresh settings
     */
    setAutoRefresh: (state, action) => {
      const { enabled, interval } = action.payload;
      if (enabled !== undefined) state.autoRefresh = enabled;
      if (interval !== undefined) state.refreshInterval = interval;
    },

    /**
     * Update last refresh timestamp
     */
    updateLastRefresh: (state) => {
      state.lastRefresh = Date.now();
      state.retryCount = 0; // Reset retry count on successful refresh
    },

    /**
     * Handle API errors
     */
    setError: (state, action) => {
      state.error = action.payload;
      state.retryCount += 1;
    },

    /**
     * Clear errors
     */
    clearError: (state) => {
      state.error = null;
      state.retryCount = 0;
    },

    /**
     * Reset retry count
     */
    resetRetryCount: (state) => {
      state.retryCount = 0;
    },
  },

  // Handle RTK Query lifecycle actions
  extraReducers: (builder) => {
    builder
      // Handle successful earthquake data fetch
      .addMatcher(
        earthquakeApi.endpoints.getEarthquakes.matchFulfilled,
        (state, action) => {
          state.lastRefresh = Date.now();
          state.error = null;
          state.retryCount = 0;
        }
      )
      // Handle failed earthquake data fetch
      .addMatcher(
        earthquakeApi.endpoints.getEarthquakes.matchRejected,
        (state, action) => {
          state.error = {
            message: action.error.message || 'Failed to fetch earthquake data',
            timestamp: Date.now(),
            retryable: true
          };
          state.retryCount += 1;
        }
      );
  },
});

// Export actions
export const {
  selectEarthquake,
  clearSelection,
  toggleDetailsPanel,
  updateDisplayPreferences,
  setAutoRefresh,
  updateLastRefresh,
  setError,
  clearError,
  resetRetryCount,
} = earthquakeSlice.actions;

// Export reducer
export default earthquakeSlice.reducer;