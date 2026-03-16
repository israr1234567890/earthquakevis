# 🛠️ Developer Guide - Earthquake Visualizer

## Table of Contents

- [Getting Started](#getting-started)
- [Architecture Overview](#architecture-overview)
- [Development Environment](#development-environment)
- [Code Structure](#code-structure)
- [State Management](#state-management)
- [API Integration](#api-integration)
- [Component Development](#component-development)
- [Testing Strategy](#testing-strategy)
- [Performance Optimization](#performance-optimization)
- [Deployment](#deployment)
- [Contributing Guidelines](#contributing-guidelines)

## Getting Started

### Prerequisites

- Node.js 18+ and npm
- Git
- Modern web browser with WebGL support
- Code editor (VS Code recommended)

### Quick Setup

```bash
# Clone and setup
git clone https://github.com/your-username/earthquake-visualizer.git
cd earthquake-visualizer
npm install

# Start development
npm run dev

# Run tests
npm test
```

### Environment Configuration

```bash
# Copy environment template
cp .env.example .env

# Optional environment variables
VITE_USGS_API_BASE_URL=https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/
VITE_REFRESH_INTERVAL=300000
VITE_DEFAULT_MAP_CENTER_LAT=39.8283
VITE_DEFAULT_MAP_CENTER_LNG=-98.5795
```

## Architecture Overview

### Tech Stack

- **Frontend Framework**: React 18 with Vite
- **UI Libraries**: Material-UI v5 + Tailwind CSS
- **State Management**: Redux Toolkit + RTK Query
- **Mapping**: Leaflet + React-Leaflet
- **3D Visualization**: Three.js + React Three Fiber
- **Charts**: Recharts
- **Testing**: Vitest + React Testing Library
- **Build Tool**: Vite

### Application Flow

```
Landing Page → User Guide → Main App
                ↓
    Dashboard ← → Map ← → Analytics
        ↓           ↓        ↓
   Bookmarks   Search   Notifications
```

### Key Design Patterns

- **Feature-based architecture** for scalability
- **Container/Presentational components** separation
- **Custom hooks** for reusable logic
- **Memoized selectors** for performance
- **Error boundaries** for fault tolerance

## Development Environment

### Recommended VS Code Extensions

```json
{
  "recommendations": [
    "bradlc.vscode-tailwindcss",
    "esbenp.prettier-vscode",
    "dbaeumer.vscode-eslint",
    "ms-vscode.vscode-typescript-next",
    "formulahendry.auto-rename-tag"
  ]
}
```

### Development Scripts

```bash
npm run dev          # Start dev server (http://localhost:3000)
npm run build        # Production build
npm run preview      # Preview production build
npm run lint         # Run ESLint
npm run test         # Run tests
npm run test:ui      # Run tests with UI
```

## Code Structure

### Directory Organization

```
src/
├── app/                    # Redux store configuration
│   ├── store.js           # Main store setup
│   └── hooks.js           # Typed Redux hooks
├── features/              # Feature modules (Redux slices)
│   ├── earthquakes/       # Earthquake data management
│   ├── filters/           # Filter state
│   └── map/              # Map state
├── components/            # Reusable UI components
│   ├── Layout/           # Layout components
│   ├── Map/              # Map-related components
│   ├── Details/          # Detail panels
│   ├── Filters/          # Filter components
│   └── Statistics/       # Chart components
├── pages/                # Page components
├── contexts/             # React contexts
├── utils/                # Helper functions
├── types/                # Type definitions
└── theme/                # MUI theme configuration
```

### Component Naming Conventions

- **PascalCase** for components: `EarthquakeMarker.jsx`
- **camelCase** for functions and variables: `handleEarthquakeClick`
- **UPPER_SNAKE_CASE** for constants: `DEFAULT_MAP_ZOOM`
- **kebab-case** for CSS classes: `earthquake-marker`

### File Organization Rules

- One component per file
- Co-locate tests with components: `Component.jsx` + `Component.test.jsx`
- Index files for clean imports
- Separate styles when complex

## State Management

### Redux Store Structure

```javascript
{
  earthquakes: {
    data: [],
    loading: false,
    error: null,
    lastRefresh: null,
    autoRefresh: true,
    refreshInterval: 300000
  },
  filters: {
    timePeriod: 'day',
    magnitudeRange: [0, 10],
    depthRange: [0, 700],
    location: null,
    radius: 100
  },
  map: {
    center: [39.8283, -98.5795],
    zoom: 4,
    selectedEarthquake: null,
    userLocation: null,
    showTectonicPlates: false
  }
}
```

### RTK Query API Endpoints

```javascript
// earthquakeAPI.js
export const earthquakeAPI = createApi({
  reducerPath: "earthquakeAPI",
  baseQuery: fetchBaseQuery({
    baseUrl: "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/",
  }),
  tagTypes: ["Earthquake"],
  endpoints: (builder) => ({
    getEarthquakes: builder.query({
      query: (timePeriod) => `all_${timePeriod}.geojson`,
      providesTags: ["Earthquake"],
    }),
  }),
});
```

### Selector Patterns

```javascript
// Memoized selectors for performance
export const selectFilteredEarthquakes = createSelector(
  [selectAllEarthquakes, selectFilters],
  (earthquakes, filters) => {
    return earthquakes.filter(
      (earthquake) =>
        earthquake.properties.mag >= filters.magnitudeRange[0] &&
        earthquake.properties.mag <= filters.magnitudeRange[1]
    );
  }
);
```

## API Integration

### USGS Earthquake API

- **Base URL**: `https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/`
- **Format**: GeoJSON
- **Rate Limits**: No explicit limits, but use reasonable polling intervals
- **Caching**: RTK Query handles automatic caching

### API Response Structure

```javascript
{
  type: "FeatureCollection",
  features: [
    {
      type: "Feature",
      properties: {
        mag: 4.2,
        place: "10km NE of Ridgecrest, CA",
        time: 1640995200000,
        updated: 1640995800000,
        tz: null,
        url: "https://earthquake.usgs.gov/earthquakes/eventpage/...",
        detail: "https://earthquake.usgs.gov/earthquakes/feed/v1.0/detail/...",
        felt: null,
        cdi: null,
        mmi: null,
        alert: null,
        status: "automatic",
        tsunami: 0,
        sig: 284,
        net: "ci",
        code: "40123456",
        ids: ",ci40123456,",
        sources: ",ci,",
        types: ",origin,phase-data,",
        nst: null,
        dmin: null,
        rms: 0.13,
        gap: null,
        magType: "ml",
        type: "earthquake",
        title: "M 4.2 - 10km NE of Ridgecrest, CA"
      },
      geometry: {
        type: "Point",
        coordinates: [-117.6135, 35.6785, 8.31]
      },
      id: "ci40123456"
    }
  ]
}
```

### Error Handling

```javascript
// RTK Query error handling
const { data, error, isLoading } = useGetEarthquakesQuery("day");

if (error) {
  if (error.status === "FETCH_ERROR") {
    // Network error
  } else if (error.status === 404) {
    // Not found
  }
}
```

## Component Development

### Component Structure Template

```javascript
/**
 * Component Description
 * @param {Object} props - Component props
 * @param {Function} props.onAction - Action handler
 */
import React, { memo } from "react";
import { Box, Typography } from "@mui/material";
import PropTypes from "prop-types";

const ComponentName = memo(({ onAction, ...props }) => {
  // Hooks
  // State
  // Effects
  // Handlers
  // Render helpers

  return (
    <Box>
      <Typography variant="h6">Component Content</Typography>
    </Box>
  );
});

ComponentName.propTypes = {
  onAction: PropTypes.func.isRequired,
};

ComponentName.displayName = "ComponentName";

export default ComponentName;
```

### Custom Hooks Pattern

```javascript
// useEarthquakeData.js
export const useEarthquakeData = (timePeriod) => {
  const { data, error, isLoading } = useGetEarthquakesQuery(timePeriod);
  const filteredData = useAppSelector(selectFilteredEarthquakes);

  return {
    earthquakes: filteredData,
    isLoading,
    error,
    total: data?.features?.length || 0,
  };
};
```

### Material-UI Theming

```javascript
// theme/muiTheme.js
export const createAppTheme = (mode) =>
  createTheme({
    palette: {
      mode,
      primary: {
        main: "#3b82f6",
        light: "#60a5fa",
        dark: "#2563eb",
      },
      secondary: {
        main: "#10b981",
        light: "#34d399",
        dark: "#059669",
      },
    },
    typography: {
      fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
      h1: { fontWeight: 700 },
      h2: { fontWeight: 700 },
      h3: { fontWeight: 600 },
    },
    components: {
      MuiButton: {
        styleOverrides: {
          root: {
            textTransform: "none",
            borderRadius: 8,
          },
        },
      },
    },
  });
```

## Testing Strategy

### Test Structure

```
src/
├── components/
│   └── Component/
│       ├── Component.jsx
│       ├── Component.test.jsx
│       └── __mocks__/
└── test/
    ├── setup.js
    ├── utils/
    └── fixtures/
```

### Testing Utilities

```javascript
// test/utils/testUtils.js
import { render } from "@testing-library/react";
import { Provider } from "react-redux";
import { ThemeProvider } from "@mui/material/styles";
import { store } from "../app/store";
import { theme } from "../theme/muiTheme";

export const renderWithProviders = (ui, options = {}) => {
  const Wrapper = ({ children }) => (
    <Provider store={store}>
      <ThemeProvider theme={theme}>{children}</ThemeProvider>
    </Provider>
  );

  return render(ui, { wrapper: Wrapper, ...options });
};
```

### Component Testing Example

```javascript
// components/EarthquakeMarker.test.jsx
import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { renderWithProviders } from "../../test/utils/testUtils";
import EarthquakeMarker from "./EarthquakeMarker";

describe("EarthquakeMarker", () => {
  const mockEarthquake = {
    id: "test-1",
    properties: { mag: 4.2, place: "Test Location" },
    geometry: { coordinates: [-117.6135, 35.6785, 8.31] },
  };

  it("renders earthquake information", () => {
    renderWithProviders(<EarthquakeMarker earthquake={mockEarthquake} />);

    expect(screen.getByText("M 4.2")).toBeInTheDocument();
    expect(screen.getByText("Test Location")).toBeInTheDocument();
  });

  it("calls onClick when marker is clicked", async () => {
    const user = userEvent.setup();
    const handleClick = vi.fn();

    renderWithProviders(
      <EarthquakeMarker earthquake={mockEarthquake} onClick={handleClick} />
    );

    await user.click(screen.getByRole("button"));
    expect(handleClick).toHaveBeenCalledWith(mockEarthquake);
  });
});
```

## Performance Optimization

### React Optimization

```javascript
// Memoization
const ExpensiveComponent = memo(({ data }) => {
  const processedData = useMemo(
    () => data.map((item) => expensiveCalculation(item)),
    [data]
  );

  return <div>{processedData}</div>;
});

// Callback memoization
const ParentComponent = () => {
  const handleClick = useCallback((id) => {
    // Handle click
  }, []);

  return <ChildComponent onClick={handleClick} />;
};
```

### Redux Performance

```javascript
// Normalized state structure
const earthquakesAdapter = createEntityAdapter({
  selectId: (earthquake) => earthquake.id,
  sortComparer: (a, b) => b.properties.time - a.properties.time,
});

// Memoized selectors
export const selectEarthquakesByMagnitude = createSelector(
  [selectAllEarthquakes, (state, minMag) => minMag],
  (earthquakes, minMag) =>
    earthquakes.filter((eq) => eq.properties.mag >= minMag)
);
```

### Bundle Optimization

```javascript
// vite.config.js
export default defineConfig({
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ["react", "react-dom"],
          mui: ["@mui/material", "@mui/icons-material"],
          maps: ["leaflet", "react-leaflet"],
        },
      },
    },
  },
});
```

## Deployment

### Build Configuration

```javascript
// vite.config.js
export default defineConfig({
  plugins: [react()],
  build: {
    outDir: "dist",
    sourcemap: true,
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes("node_modules")) {
            return "vendor";
          }
        },
      },
    },
  },
  server: {
    port: 3000,
    open: true,
  },
});
```

### Environment-specific Builds

```bash
# Development
npm run dev

# Production build
npm run build

# Preview production build
npm run preview
```

### Deployment Platforms

#### Vercel

```json
// vercel.json
{
  "builds": [
    {
      "src": "package.json",
      "use": "@vercel/static-build",
      "config": { "distDir": "dist" }
    }
  ],
  "routes": [
    { "handle": "filesystem" },
    { "src": "/(.*)", "dest": "/index.html" }
  ]
}
```

#### Netlify

```toml
# netlify.toml
[build]
  publish = "dist"
  command = "npm run build"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

## Contributing Guidelines

### Code Style

- Use Prettier for formatting
- Follow ESLint rules
- Use TypeScript-style JSDoc comments
- Maintain consistent naming conventions

### Git Workflow

```bash
# Feature development
git checkout -b feature/earthquake-clustering
git add .
git commit -m "feat: add earthquake marker clustering"
git push origin feature/earthquake-clustering

# Create pull request
```

### Commit Message Format

```
type(scope): description

feat(map): add earthquake marker clustering
fix(api): handle network timeout errors
docs(readme): update installation instructions
style(components): fix button spacing
refactor(utils): optimize distance calculations
test(components): add marker interaction tests
```

### Pull Request Template

```markdown
## Description

Brief description of changes

## Type of Change

- [ ] Bug fix
- [ ] New feature
- [ ] Breaking change
- [ ] Documentation update

## Testing

- [ ] Unit tests pass
- [ ] Integration tests pass
- [ ] Manual testing completed

## Screenshots

Include screenshots for UI changes
```

### Code Review Checklist

- [ ] Code follows style guidelines
- [ ] Self-review completed
- [ ] Tests added/updated
- [ ] Documentation updated
- [ ] No console errors
- [ ] Performance impact considered
- [ ] Accessibility guidelines followed

## Troubleshooting

### Common Issues

#### Build Errors

```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install

# Clear Vite cache
rm -rf .vite
```

#### Map Not Loading

- Check Leaflet CSS import
- Verify container has height
- Check console for WebGL errors

#### API Errors

- Verify USGS API endpoint
- Check network connectivity
- Review CORS configuration

### Debug Tools

- React Developer Tools
- Redux DevTools
- Network tab for API calls
- Console for JavaScript errors

### Performance Monitoring

```javascript
// Performance measurement
const startTime = performance.now();
// ... expensive operation
const endTime = performance.now();
console.log(`Operation took ${endTime - startTime} milliseconds`);
```

---

## Additional Resources

- [React Documentation](https://react.dev/)
- [Material-UI Documentation](https://mui.com/)
- [Redux Toolkit Documentation](https://redux-toolkit.js.org/)
- [Leaflet Documentation](https://leafletjs.com/)
- [USGS Earthquake API](https://earthquake.usgs.gov/earthquakes/feed/v1.0/geojson.php)
- [Vite Documentation](https://vitejs.dev/)

For questions or support, please create an issue in the GitHub repository.
