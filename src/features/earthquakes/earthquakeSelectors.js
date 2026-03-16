/**
 * Memoized selectors for earthquake data
 */

import { createSelector } from "@reduxjs/toolkit";
import { earthquakeApi } from "./earthquakeAPI.js";
import {
  filterEarthquakes,
  calculateEarthquakeStats,
  calculateDistance,
} from "../../utils/calculations.js";

/**
 * Base selectors for earthquake state
 */
export const selectEarthquakeState = (state) => state.earthquakes;
export const selectFiltersState = (state) => state.filters;

/**
 * Select raw earthquake data from RTK Query cache
 */
export const selectRawEarthquakes = createSelector(
  [(state) => state, (state, timePeriod) => timePeriod],
  (state, timePeriod = "day") => {
    const result =
      earthquakeApi.endpoints.getEarthquakes.select(timePeriod)(state);
    return result?.data?.earthquakes || [];
  }
);

/**
 * Select filtered earthquakes based on current filter criteria
 */
export const selectFilteredEarthquakes = createSelector(
  [
    (state) => {
      const timePeriod = state.filters.timePeriod;
      const result =
        earthquakeApi.endpoints.getEarthquakes.select(timePeriod)(state);
      return result?.data?.earthquakes || [];
    },
    selectFiltersState,
  ],
  (earthquakes, filters) => {
    if (!earthquakes || earthquakes.length === 0) return [];

    return earthquakes.filter((earthquake) => {
      const magnitude = earthquake.properties?.mag || 0;
      const depth = earthquake.coordinates?.depth || 0;
      const location = earthquake.properties?.place || "";

      // Magnitude filter
      if (
        magnitude < filters.magnitudeRange[0] ||
        magnitude > filters.magnitudeRange[1]
      ) {
        return false;
      }

      // Depth filter
      if (depth < filters.depthRange[0] || depth > filters.depthRange[1]) {
        return false;
      }

      // Location filter
      if (
        filters.locationSearch &&
        !location.toLowerCase().includes(filters.locationSearch.toLowerCase())
      ) {
        return false;
      }

      // Show only significant events filter
      if (filters.showOnlySignificant && magnitude < 4.5) {
        return false;
      }

      // Show only felt earthquakes filter
      if (filters.showFeltReports && !earthquake.properties?.felt) {
        return false;
      }

      return true;
    });
  }
);

/**
 * Select earthquake statistics for filtered data
 */
export const selectEarthquakeStatistics = createSelector(
  [selectFilteredEarthquakes],
  (earthquakes) => calculateEarthquakeStats(earthquakes)
);

/**
 * Select currently selected earthquake with full details
 */
export const selectSelectedEarthquake = createSelector(
  [selectEarthquakeState],
  (earthquakeState) => earthquakeState.selectedEarthquake
);

/**
 * Select UI state for earthquake features
 */
export const selectEarthquakeUI = createSelector(
  [selectEarthquakeState],
  (earthquakeState) => ({
    isDetailsOpen: earthquakeState.isDetailsOpen,
    showClusters: earthquakeState.showClusters,
    animateMarkers: earthquakeState.animateMarkers,
    autoRefresh: earthquakeState.autoRefresh,
    refreshInterval: earthquakeState.refreshInterval,
    lastRefresh: earthquakeState.lastRefresh,
    error: earthquakeState.error,
    retryCount: earthquakeState.retryCount,
    maxRetries: earthquakeState.maxRetries,
  })
);

/**
 * Select earthquakes grouped by magnitude severity
 */
export const selectEarthquakesByMagnitude = createSelector(
  [selectFilteredEarthquakes],
  (earthquakes) => {
    const groups = {
      minor: [], // < 3.0
      light: [], // 3.0 - 4.9
      moderate: [], // 5.0 - 6.9
      major: [], // >= 7.0
    };

    earthquakes.forEach((earthquake) => {
      const magnitude = earthquake.properties.mag;
      if (magnitude === null || magnitude === undefined) {
        groups.minor.push(earthquake);
      } else if (magnitude < 3) {
        groups.minor.push(earthquake);
      } else if (magnitude < 5) {
        groups.light.push(earthquake);
      } else if (magnitude < 7) {
        groups.moderate.push(earthquake);
      } else {
        groups.major.push(earthquake);
      }
    });

    return groups;
  }
);

/**
 * Select recent earthquakes (within last hour)
 */
export const selectRecentEarthquakes = createSelector(
  [selectFilteredEarthquakes],
  (earthquakes) => {
    const oneHourAgo = Date.now() - 60 * 60 * 1000;
    return earthquakes.filter(
      (earthquake) =>
        earthquake.properties.time && earthquake.properties.time > oneHourAgo
    );
  }
);

/**
 * Select strongest earthquake in current dataset
 */
export const selectStrongestEarthquake = createSelector(
  [selectFilteredEarthquakes],
  (earthquakes) => {
    if (!earthquakes || earthquakes.length === 0) return null;

    return earthquakes.reduce((strongest, current) => {
      const currentMag = current.properties.mag || 0;
      const strongestMag = strongest?.properties.mag || 0;
      return currentMag > strongestMag ? current : strongest;
    }, null);
  }
);

/**
 * Select loading state from RTK Query
 */
export const selectEarthquakeLoading = createSelector(
  [(state) => state, (state, timePeriod) => timePeriod],
  (state, timePeriod = "day") => {
    const result =
      earthquakeApi.endpoints.getEarthquakes.select(timePeriod)(state);
    return result?.isLoading || false;
  }
);

/**
 * Select error state from RTK Query
 */
export const selectEarthquakeError = createSelector(
  [(state) => state, (state, timePeriod) => timePeriod],
  (state, timePeriod = "day") => {
    const result =
      earthquakeApi.endpoints.getEarthquakes.select(timePeriod)(state);
    return result?.error || null;
  }
);

/**
 * Select earthquakes sorted by distance from user location
 */
export const selectEarthquakesByDistance = createSelector(
  [selectFilteredEarthquakes, (state) => state.map.userLocation],
  (earthquakes, userLocation) => {
    if (!userLocation || !earthquakes || earthquakes.length === 0) {
      return earthquakes;
    }

    return [...earthquakes]
      .map((earthquake) => ({
        ...earthquake,
        distanceFromUser: calculateDistance(
          userLocation.lat,
          userLocation.lng,
          earthquake.coordinates.lat,
          earthquake.coordinates.lng
        ),
      }))
      .sort((a, b) => a.distanceFromUser - b.distanceFromUser);
  }
);

/**
 * Select nearby earthquakes (within specified radius from user location)
 */
export const selectNearbyEarthquakes = createSelector(
  [
    selectFilteredEarthquakes,
    (state) => state.map.userLocation,
    (state, radiusKm = 100) => radiusKm,
  ],
  (earthquakes, userLocation, radiusKm) => {
    if (!userLocation || !earthquakes || earthquakes.length === 0) {
      return [];
    }

    return earthquakes.filter((earthquake) => {
      const distance = calculateDistance(
        userLocation.lat,
        userLocation.lng,
        earthquake.coordinates.lat,
        earthquake.coordinates.lng
      );
      return distance <= radiusKm;
    });
  }
);
