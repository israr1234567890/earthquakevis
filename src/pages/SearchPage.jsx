/**
 * Search & Filter Page - Advanced search and filtering capabilities
 */

import React from 'react';
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  useMediaQuery,
  useTheme
} from '@mui/material';
import SearchBar from '../components/Search/SearchBar.jsx';
import FilterPanel from '../components/Filters/FilterPanel.jsx';
import { useAppSelector } from '../app/hooks.js';
import { selectFilteredEarthquakes } from '../features/earthquakes/earthquakeSelectors.js';

const SearchPage = ({ onEarthquakeSelect }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const earthquakes = useAppSelector(selectFilteredEarthquakes);

  return (
    <Box 
      className="scrollbar-minimal"
      sx={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'auto'
      }}
    >
      {/* Page Header */}
      <Box sx={{ p: 2, pb: 1 }}>
        <Typography variant="h4" sx={{ fontWeight: 700, color: 'text.primary' }}>
          Search & Filter
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Find specific earthquakes using advanced search and filtering
        </Typography>
      </Box>

      {/* Search Bar */}
      <Box sx={{ px: 2, pb: 2 }}>
        <SearchBar onSelectEarthquake={onEarthquakeSelect} />
      </Box>

      {/* Main Content */}
      <Box 
        className="scrollbar-minimal"
        sx={{ flex: 1, p: 2, pt: 0, overflow: 'auto' }}
      >
        <Grid container spacing={3} sx={{ height: '100%' }}>
          {/* Filter Panel */}
          <Grid item xs={12} md={4} lg={3}>
            <Card sx={{ height: 'fit-content', position: 'sticky', top: 0 }}>
              <CardContent>
                <FilterPanel />
              </CardContent>
            </Card>
          </Grid>

          {/* Results */}
          <Grid item xs={12} md={8} lg={9}>
            <Card sx={{ height: 'fit-content' }}>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Search Results ({earthquakes.length})
                </Typography>

                {earthquakes.length === 0 ? (
                  <Box sx={{
                    textAlign: 'center',
                    py: 8,
                    color: 'text.secondary'
                  }}>
                    <Typography variant="h6" gutterBottom>
                      No earthquakes found
                    </Typography>
                    <Typography variant="body2">
                      Try adjusting your search criteria or filters
                    </Typography>
                  </Box>
                ) : (
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, mt: 2 }}>
                    {earthquakes.slice(0, 50).map((earthquake) => (
                      <Card
                        key={earthquake.id}
                        sx={{
                          cursor: 'pointer',
                          transition: 'all 0.2s ease',
                          '&:hover': {
                            transform: 'translateY(-1px)',
                            boxShadow: 2
                          }
                        }}
                        onClick={() => onEarthquakeSelect?.(earthquake)}
                      >
                        <CardContent sx={{ p: 2, '&:last-child': { pb: 2 } }}>
                          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                            <Box sx={{ flex: 1 }}>
                              <Typography variant="h6" sx={{ fontSize: 16, fontWeight: 600 }}>
                                M{earthquake.properties.mag?.toFixed(1) || 'N/A'} - {earthquake.properties.place || 'Unknown location'}
                              </Typography>
                              <Typography variant="body2" color="text.secondary">
                                Depth: {Math.abs(earthquake.geometry?.coordinates?.[2] || 0).toFixed(1)} km
                              </Typography>
                              <Typography variant="body2" color="text.secondary">
                                {earthquake.properties.time ?
                                  new Date(earthquake.properties.time).toLocaleString() :
                                  'Unknown time'
                                }
                              </Typography>
                            </Box>
                            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 1 }}>
                              <Box sx={{
                                bgcolor: earthquake.properties.mag >= 6 ? 'error.main' :
                                         earthquake.properties.mag >= 4 ? 'warning.main' : 'success.main',
                                color: 'white',
                                px: 1,
                                py: 0.5,
                                borderRadius: 1,
                                fontSize: 12,
                                fontWeight: 600
                              }}>
                                {earthquake.properties.mag >= 6 ? 'Major' :
                                 earthquake.properties.mag >= 4 ? 'Moderate' : 'Minor'}
                              </Box>
                              {earthquake.properties.felt > 0 && (
                                <Typography variant="caption" color="text.secondary">
                                  {earthquake.properties.felt} felt reports
                                </Typography>
                              )}
                            </Box>
                          </Box>
                        </CardContent>
                      </Card>
                    ))}

                    {earthquakes.length > 50 && (
                      <Box sx={{ textAlign: 'center', py: 2 }}>
                        <Typography variant="body2" color="text.secondary">
                          Showing first 50 results. Use filters to narrow your search.
                        </Typography>
                      </Box>
                    )}
                  </Box>
                )}
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
};

export default SearchPage;