# Earthquake Monitoring Dashboard - Application Context

## Project Overview
A real-time earthquake monitoring dashboard built with React, Redux Toolkit, and Material-UI. The application fetches earthquake data from the USGS API and displays it on an interactive Leaflet map with comprehensive filtering and visualization capabilities.

## Tech Stack
- **Frontend**: React 18 with Vite
- **State Management**: Redux Toolkit
- **UI Framework**: Material-UI (MUI) v5
- **Mapping**: Leaflet with React-Leaflet
- **Testing**: Vitest + React Testing Library
- **Build Tool**: Vite
- **Language**: JavaScript (ES6+)

## Architecture

### Folder Structure
```
src/
├── app/                    # Redux store configuration
│   ├── store.js           # Main store setup
│   └── hooks.js           # Typed Redux hooks
├── components/            # React components
│   ├── Details/           # Earthquake details panel
│   ├── Filters/           # Filter controls
│   ├── Layout/            # Header and layout components
│   ├── Map/               # Map-related components
│   └── Statistics/        # Statistics cards
├── features/              # Redux slices (feature-based)
│   ├── earthquakes/       # Earthquake data management
│   ├── filters/           # Filter state management
│   └── map/               # Map state management
├── theme/                 # MUI theme configuration
├── types/                 # Type definitions
└── utils/                 # Utility functions and constants
```

### Key Features
1. **Real-time Data**: Fetches earthquake data from USGS API
2. **Interactive Map**: Leaflet-based map with clustering and multiple tile layers
3. **Advanced Filtering**: Filter by magnitude, depth, time period, and location
4. **Statistics Dashboard**: Real-time statistics and data visualization
5. **Responsive Design**: Mobile-first responsive layout
6. **Performance Optimized**: Marker clustering and virtualization

## Redux State Structure

### Earthquakes Slice (`features/earthquakes/`)
- **State**: Raw earthquake data, loading states, error handling
- **Actions**: Fetch earthquakes, select earthquake, clear selection
- **Selectors**: Filtered earthquakes based on current filters

### Filters Slice (`features/filters/`)
- **State**: Magnitude range, depth range, time period, search query
- **Actions**: Update individual filters, reset filters, apply presets

### Map Slice (`features/map/`)
- **State**: Map center, zoom, bounds, layer settings, clustering options
- **Actions**: Update map view, toggle layers, manage clustering

## Component Architecture

### Map Components (`components/Map/`)
- **LeafletMap.jsx**: Main map container with tile layer switching
- **EarthquakeMarkers.jsx**: Renders earthquake markers with clustering
- **MapLegend.jsx**: Displays magnitude legend and map controls

### Filter Components (`components/Filters/`)
- **FilterPanel.jsx**: Main filter interface with all controls

### Layout Components (`components/Layout/`)
- **Header.jsx**: Application header with branding and navigation

### Statistics Components (`components/Statistics/`)
- **StatisticsCards.jsx**: Real-time earthquake statistics display

## API Integration

### USGS Earthquake API
- **Base URL**: `https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/`
- **Endpoints**: 
  - `all_hour.geojson` - Past hour
  - `all_day.geojson` - Past 24 hours
  - `all_week.geojson` - Past week
  - `all_month.geojson` - Past month

### Data Flow
1. API calls triggered by time period filter changes
2. Raw GeoJSON data normalized and stored in Redux
3. Selectors apply filters and return processed data
4. Components subscribe to filtered data via useSelector

## Material-UI Integration

### Theme Configuration (`theme/muiTheme.js`)
- Custom color palette for earthquake severity levels
- Typography scale optimized for data visualization
- Component overrides for consistent styling
- Dark/light mode support

### Key MUI Components Used
- **Layout**: Container, Box, Grid, Paper
- **Navigation**: AppBar, Toolbar, Drawer
- **Data Display**: Card, CardContent, Typography, Chip
- **Inputs**: Slider, Select, TextField, Switch
- **Feedback**: CircularProgress, Alert, Snackbar
- **Surfaces**: Paper, Card with elevation

### Custom Styling Patterns
- Consistent spacing using theme.spacing()
- Color coding based on earthquake magnitude
- Responsive breakpoints for mobile optimization
- Elevation and shadows for depth perception

## Performance Considerations

### Map Optimization
- Marker clustering for large datasets (1000+ earthquakes)
- Virtualization for off-screen markers
- Debounced map events to prevent excessive updates
- Tile layer caching

### State Management
- Memoized selectors to prevent unnecessary re-renders
- Normalized state structure for efficient updates
- Selective subscriptions to minimize component updates

### Bundle Optimization
- Code splitting by route/feature
- Tree shaking for unused MUI components
- Lazy loading for non-critical components

## Development Workflow

### Available Scripts
- `npm run dev` - Start development server
- `npm run build` - Production build
- `npm run test` - Run test suite
- `npm run lint` - ESLint checking
- `npm run preview` - Preview production build

### Testing Strategy
- Unit tests for utility functions
- Component tests for UI interactions
- Integration tests for Redux flows
- E2E tests for critical user paths

## Environment Configuration

### Environment Variables
- `VITE_DEFAULT_MAP_CENTER_LAT` - Default map latitude
- `VITE_DEFAULT_MAP_CENTER_LNG` - Default map longitude
- `VITE_DEFAULT_MAP_ZOOM` - Default zoom level
- `VITE_MAX_EARTHQUAKES_DISPLAY` - Maximum earthquakes to display
- `VITE_DEFAULT_REFRESH_INTERVAL` - Auto-refresh interval
- `VITE_USGS_API_TIMEOUT` - API request timeout

## Known Issues & Considerations

### Current Limitations
- USGS API rate limiting (requests per minute)
- Large datasets may impact performance on mobile devices
- Real-time updates require manual refresh (no WebSocket)

### Future Enhancements
- WebSocket integration for real-time updates
- Offline support with service workers
- Advanced analytics and historical data
- User preferences and saved filters
- Export functionality for data and maps

## Dependencies

### Core Dependencies
- React 18.2.0
- @reduxjs/toolkit 1.9.7
- @mui/material 5.14.20
- leaflet 1.9.4
- react-leaflet 4.2.1

### Development Dependencies
- Vite 4.5.0
- Vitest 0.34.6
- ESLint 8.53.0
- @testing-library/react 13.4.0

This documentation serves as a comprehensive guide for understanding the application architecture, state management patterns, and Material-UI integration strategies used throughout the earthquake monitoring dashboard.