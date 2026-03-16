/**
 * Redux slice for filter state management
 */

import { createSlice } from '@reduxjs/toolkit';
import { FILTER_DEFAULTS, TIME_PERIODS } from '../../utils/constants.js';

/**
 * Initial state for filter slice
 */
const initialState = {
  // Magnitude filtering
  magnitudeRange: [FILTER_DEFAULTS.MAGNITUDE_MIN, FILTER_DEFAULTS.MAGNITUDE_MAX],
  
  // Depth filtering
  depthRange: [FILTER_DEFAULTS.DEPTH_MIN, FILTER_DEFAULTS.DEPTH_MAX],
  
  // Time period filtering
  timePeriod: FILTER_DEFAULTS.TIME_PERIOD,
  timePeriodHours: TIME_PERIODS.DAY.hours,
  
  // Location search
  locationSearch: '',
  
  // Advanced filters
  minimumFeltReports: 0,
  significantOnly: false,
  showAdvancedFilters: false,
  showOnlySignificant: false,
  showFeltReports: false,
  
  // Filter panel state
  isFilterPanelOpen: false,
  activeFilterCount: 0,
  
  // Quick filter presets
  quickFilters: {
    majorOnly: false,      // >= 7.0 magnitude
    recentOnly: false,     // Last hour
    significantOnly: false, // Significant earthquakes only
    shallowOnly: false,    // < 70km depth
  },
  
  // Filter history for undo functionality
  filterHistory: [],
  currentHistoryIndex: -1,
  maxHistorySize: 10,
};

/**
 * Helper function to calculate active filter count
 */
const calculateActiveFilters = (state) => {
  let count = 0;
  
  // Check magnitude range
  if (state.magnitudeRange[0] > FILTER_DEFAULTS.MAGNITUDE_MIN || 
      state.magnitudeRange[1] < FILTER_DEFAULTS.MAGNITUDE_MAX) {
    count++;
  }
  
  // Check depth range
  if (state.depthRange[0] > FILTER_DEFAULTS.DEPTH_MIN || 
      state.depthRange[1] < FILTER_DEFAULTS.DEPTH_MAX) {
    count++;
  }
  
  // Check time period
  if (state.timePeriod !== FILTER_DEFAULTS.TIME_PERIOD) {
    count++;
  }
  
  // Check location search
  if (state.locationSearch.trim()) {
    count++;
  }
  
  // Check advanced filters
  if (state.minimumFeltReports > 0) count++;
  if (state.significantOnly) count++;
  
  // Check quick filters
  Object.values(state.quickFilters).forEach(active => {
    if (active) count++;
  });
  
  return count;
};

/**
 * Helper function to save current state to history
 */
const saveToHistory = (state) => {
  const currentState = {
    magnitudeRange: [...state.magnitudeRange],
    depthRange: [...state.depthRange],
    timePeriod: state.timePeriod,
    timePeriodHours: state.timePeriodHours,
    locationSearch: state.locationSearch,
    minimumFeltReports: state.minimumFeltReports,
    significantOnly: state.significantOnly,
    quickFilters: { ...state.quickFilters },
    timestamp: Date.now(),
  };
  
  // Remove any states after current index (when undoing then making new changes)
  state.filterHistory = state.filterHistory.slice(0, state.currentHistoryIndex + 1);
  
  // Add new state
  state.filterHistory.push(currentState);
  
  // Limit history size
  if (state.filterHistory.length > state.maxHistorySize) {
    state.filterHistory = state.filterHistory.slice(-state.maxHistorySize);
  }
  
  state.currentHistoryIndex = state.filterHistory.length - 1;
};

/**
 * Filter slice with reducers and actions
 */
const filterSlice = createSlice({
  name: 'filters',
  initialState,
  
  reducers: {
    /**
     * Update magnitude range filter
     */
    setMagnitudeRange: (state, action) => {
      saveToHistory(state);
      state.magnitudeRange = action.payload;
      state.activeFilterCount = calculateActiveFilters(state);
    },

    /**
     * Update depth range filter
     */
    setDepthRange: (state, action) => {
      saveToHistory(state);
      state.depthRange = action.payload;
      state.activeFilterCount = calculateActiveFilters(state);
    },

    /**
     * Update time period filter
     */
    setTimePeriod: (state, action) => {
      saveToHistory(state);
      const timePeriod = action.payload;
      state.timePeriod = timePeriod;
      
      // Update hours based on time period
      const period = Object.values(TIME_PERIODS).find(p => p.value === timePeriod);
      if (period) {
        state.timePeriodHours = period.hours;
      }
      
      state.activeFilterCount = calculateActiveFilters(state);
    },

    /**
     * Update location search filter
     */
    setLocationSearch: (state, action) => {
      // Don't save to history for every keystroke, only when search is cleared or applied
      state.locationSearch = action.payload;
      state.activeFilterCount = calculateActiveFilters(state);
    },

    /**
     * Apply location search (saves to history)
     */
    applyLocationSearch: (state, action) => {
      saveToHistory(state);
      state.locationSearch = action.payload;
      state.activeFilterCount = calculateActiveFilters(state);
    },

    /**
     * Set location filter (alias for compatibility)
     */
    setLocationFilter: (state, action) => {
      saveToHistory(state);
      state.locationSearch = action.payload;
      state.activeFilterCount = calculateActiveFilters(state);
    },

    /**
     * Toggle advanced filters visibility
     */
    toggleAdvancedFilters: (state) => {
      state.showAdvancedFilters = !state.showAdvancedFilters;
    },

    /**
     * Set show only significant events
     */
    setShowOnlySignificant: (state, action) => {
      saveToHistory(state);
      state.significantOnly = action.payload;
      state.activeFilterCount = calculateActiveFilters(state);
    },

    /**
     * Set show felt reports filter
     */
    setShowFeltReports: (state, action) => {
      saveToHistory(state);
      state.showFeltReports = action.payload;
      state.activeFilterCount = calculateActiveFilters(state);
    },

    /**
     * Update advanced filters
     */
    setAdvancedFilters: (state, action) => {
      saveToHistory(state);
      const { minimumFeltReports, significantOnly } = action.payload;
      
      if (minimumFeltReports !== undefined) {
        state.minimumFeltReports = minimumFeltReports;
      }
      if (significantOnly !== undefined) {
        state.significantOnly = significantOnly;
      }
      
      state.activeFilterCount = calculateActiveFilters(state);
    },

    /**
     * Toggle quick filter presets
     */
    toggleQuickFilter: (state, action) => {
      saveToHistory(state);
      const { filter, value } = action.payload;
      
      if (state.quickFilters.hasOwnProperty(filter)) {
        state.quickFilters[filter] = value !== undefined ? value : !state.quickFilters[filter];
        
        // Apply quick filter logic
        switch (filter) {
          case 'majorOnly':
            if (state.quickFilters[filter]) {
              state.magnitudeRange = [7.0, FILTER_DEFAULTS.MAGNITUDE_MAX];
            }
            break;
          case 'recentOnly':
            if (state.quickFilters[filter]) {
              state.timePeriod = TIME_PERIODS.HOUR.value;
              state.timePeriodHours = TIME_PERIODS.HOUR.hours;
            }
            break;
          case 'significantOnly':
            state.significantOnly = state.quickFilters[filter];
            break;
          case 'shallowOnly':
            if (state.quickFilters[filter]) {
              state.depthRange = [FILTER_DEFAULTS.DEPTH_MIN, 70];
            }
            break;
        }
      }
      
      state.activeFilterCount = calculateActiveFilters(state);
    },

    /**
     * Reset all filters to defaults
     */
    resetFilters: (state) => {
      saveToHistory(state);
      
      state.magnitudeRange = [FILTER_DEFAULTS.MAGNITUDE_MIN, FILTER_DEFAULTS.MAGNITUDE_MAX];
      state.depthRange = [FILTER_DEFAULTS.DEPTH_MIN, FILTER_DEFAULTS.DEPTH_MAX];
      state.timePeriod = FILTER_DEFAULTS.TIME_PERIOD;
      state.timePeriodHours = TIME_PERIODS.DAY.hours;
      state.locationSearch = '';
      state.minimumFeltReports = 0;
      state.significantOnly = false;
      state.quickFilters = {
        majorOnly: false,
        recentOnly: false,
        significantOnly: false,
        shallowOnly: false,
      };
      
      state.activeFilterCount = 0;
    },

    /**
     * Toggle filter panel visibility
     */
    toggleFilterPanel: (state) => {
      state.isFilterPanelOpen = !state.isFilterPanelOpen;
    },

    /**
     * Set filter panel visibility
     */
    setFilterPanelOpen: (state, action) => {
      state.isFilterPanelOpen = action.payload;
    },

    /**
     * Undo last filter change
     */
    undoFilter: (state) => {
      if (state.currentHistoryIndex > 0) {
        state.currentHistoryIndex--;
        const previousState = state.filterHistory[state.currentHistoryIndex];
        
        // Restore previous state
        Object.assign(state, {
          ...previousState,
          filterHistory: state.filterHistory,
          currentHistoryIndex: state.currentHistoryIndex,
          isFilterPanelOpen: state.isFilterPanelOpen,
          maxHistorySize: state.maxHistorySize,
        });
        
        state.activeFilterCount = calculateActiveFilters(state);
      }
    },

    /**
     * Redo filter change
     */
    redoFilter: (state) => {
      if (state.currentHistoryIndex < state.filterHistory.length - 1) {
        state.currentHistoryIndex++;
        const nextState = state.filterHistory[state.currentHistoryIndex];
        
        // Restore next state
        Object.assign(state, {
          ...nextState,
          filterHistory: state.filterHistory,
          currentHistoryIndex: state.currentHistoryIndex,
          isFilterPanelOpen: state.isFilterPanelOpen,
          maxHistorySize: state.maxHistorySize,
        });
        
        state.activeFilterCount = calculateActiveFilters(state);
      }
    },
  },
});

// Export actions
export const {
  setMagnitudeRange,
  setDepthRange,
  setTimePeriod,
  setLocationSearch,
  setLocationFilter,
  applyLocationSearch,
  setAdvancedFilters,
  toggleQuickFilter,
  resetFilters,
  toggleFilterPanel,
  setFilterPanelOpen,
  toggleAdvancedFilters,
  setShowOnlySignificant,
  setShowFeltReports,
  undoFilter,
  redoFilter,
} = filterSlice.actions;

// Export reducer
export default filterSlice.reducer;