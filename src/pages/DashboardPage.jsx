/**
 * Dashboard Page - Main overview of earthquake activity
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
import { useAppSelector } from '../app/hooks.js';
import { useGetEarthquakesQuery } from '../features/earthquakes/earthquakeAPI.js';
import StatisticsCards from '../components/Statistics/StatisticsCards.jsx';
import LeafletMap from '../components/Map/LeafletMap.jsx';
import { selectFilteredEarthquakes, selectRecentEarthquakes } from '../features/earthquakes/earthquakeSelectors.js';

const DashboardPage = ({ onEarthquakeSelect }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const timePeriod = useAppSelector(state => state.filters.timePeriod);
  const earthquakes = useAppSelector(selectFilteredEarthquakes);
  const recentEarthquakes = useAppSelector(selectRecentEarthquakes);

  const {
    data: earthquakeData,
    error,
    isLoading
  } = useGetEarthquakesQuery(timePeriod, {
    pollingInterval: 300000, // 5 minutes
    refetchOnMountOrArgChange: true,
    refetchOnFocus: true,
    refetchOnReconnect: true
  });

  return (
    <Box sx={{
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
      gap: 2,
      p: 2
    }}>
      {/* Page Header */}
      <Box sx={{ mb: 2 }}>
        <Typography variant="h4" sx={{ fontWeight: 700, color: 'text.primary' }}>
          Live Dashboard
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Real-time earthquake monitoring and statistics
        </Typography>
      </Box>

      {/* Statistics Cards */}
      <StatisticsCards isLoading={isLoading} />

      {/* Main Content Grid */}
      <Grid container spacing={3} sx={{ flex: 1, minHeight: 0 }}>
        {/* Interactive Map */}
        <Grid item xs={12} lg={8}>
          <Card sx={{ height: '100%', minHeight: '600px' }}>
            <CardContent sx={{ p: 0, height: '100%', '&:last-child': { pb: 0 } }}>
              <LeafletMap
                height="100%"
                isLoading={isLoading}
                error={error}
                onEarthquakeSelect={onEarthquakeSelect}
              />
            </CardContent>
          </Card>
        </Grid>

        {/* Recent Activity */}
        <Grid item xs={12} lg={4}>
          <Card sx={{ height: '100%', minHeight: '600px' }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Recent Activity ({recentEarthquakes.length})
              </Typography>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                Last hour earthquakes
              </Typography>

              <Box 
                className="scrollbar-minimal"
                sx={{
                  maxHeight: '500px',
                  overflow: 'auto',
                  mt: 2
                }}
              >
                {recentEarthquakes.length === 0 ? (
                  <Box sx={{
                    textAlign: 'center',
                    py: 4,
                    color: 'text.secondary'
                  }}>
                    <Typography variant="body2">
                      No recent earthquakes in the last hour
                    </Typography>
                  </Box>
                ) : (
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                    {recentEarthquakes.slice(0, 20).map((earthquake) => (
                      <Card
                        key={earthquake.id}
                        sx={{
                          cursor: 'pointer',
                          transition: 'all 0.2s ease',
                          '&:hover': {
                            transform: 'translateY(-2px)',
                            boxShadow: 2
                          }
                        }}
                        onClick={() => onEarthquakeSelect?.(earthquake)}
                      >
                        <CardContent sx={{ p: 2, '&:last-child': { pb: 2 } }}>
                          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                            <Box sx={{ flex: 1 }}>
                              <Typography variant="body2" fontWeight={600}>
                                M{earthquake.properties.mag?.toFixed(1) || 'N/A'}
                              </Typography>
                              <Typography variant="caption" color="text.secondary" sx={{ display: 'block' }}>
                                {earthquake.properties.place || 'Unknown location'}
                              </Typography>
                            </Box>
                            <Typography variant="caption" color="text.secondary">
                              {new Date(earthquake.properties.time).toLocaleTimeString()}
                            </Typography>
                          </Box>
                        </CardContent>
                      </Card>
                    ))}
                  </Box>
                )}
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default DashboardPage;