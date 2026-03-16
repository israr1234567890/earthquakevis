/**
 * Redux store configuration with RTK Query
 */

import { configureStore } from '@reduxjs/toolkit';
import { setupListeners } from '@reduxjs/toolkit/query';
import { earthquakeApi } from '../features/earthquakes/earthquakeAPI.js';
import earthquakeSlice from '../features/earthquakes/earthquakeSlice.js';
import mapSlice from '../features/map/mapSlice.js';
import filterSlice from '../features/filters/filterSlice.js';

/**
 * Configure the Redux store with all slices and middleware
 */
export const store = configureStore({
  reducer: {
    // RTK Query API slice
    [earthquakeApi.reducerPath]: earthquakeApi.reducer,
    
    // Feature slices
    earthquakes: earthquakeSlice,
    map: mapSlice,
    filters: filterSlice,
  },
  
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      // Configure serialization checks for better performance
      serializableCheck: {
        ignoredPaths: [
          // Ignore paths that might contain non-serializable data
          'earthquakes.selectedEarthquake.geometry',
          'map.mapInstance',
        ],
      },
    }).concat(earthquakeApi.middleware),
  
  // Enable Redux DevTools in development
  devTools: import.meta.env.DEV && import.meta.env.VITE_ENABLE_REDUX_DEVTOOLS !== 'false',
});

// Setup RTK Query listeners for automatic refetching
setupListeners(store.dispatch);

// Export types for TypeScript (if using TypeScript later)
// export type RootState = ReturnType<typeof store.getState>;
// export type AppDispatch = typeof store.dispatch;