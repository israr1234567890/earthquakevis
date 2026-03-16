/**
 * Analytics Page - Data visualization and insights
 */

import React from 'react';
import {
  Box,
  Typography,
  useMediaQuery,
  useTheme
} from '@mui/material';
import { useAppSelector } from '../app/hooks.js';
import { useGetEarthquakesQuery } from '../features/earthquakes/earthquakeAPI.js';
import AnalyticsDashboard from '../components/Analytics/AnalyticsDashboard.jsx';
import ExportDataButton from '../components/Export/ExportDataButton.jsx';

const AnalyticsPage = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const timePeriod = useAppSelector(state => state.filters.timePeriod);

  const {
    data: earthquakeData,
    error,
    isLoading
  } = useGetEarthquakesQuery(timePeriod, {
    pollingInterval: 300000,
    refetchOnMountOrArgChange: true,
    refetchOnFocus: true,
    refetchOnReconnect: true
  });

  return (
    <Box sx={{
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
      overflow: 'auto'
    }}>
      {/* Page Header */}
      <Box sx={{ p: 2, pb: 1, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 2 }}>
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 700, color: 'text.primary' }}>
            Analytics & Insights
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Comprehensive data analysis and statistical visualization
          </Typography>
        </Box>
        <ExportDataButton variant="contained" size="medium" />
      </Box>

      {/* Analytics Content */}
      <Box sx={{ flex: 1, overflow: 'auto' }}>
        <AnalyticsDashboard isLoading={isLoading} />
      </Box>
    </Box>
  );
};

export default AnalyticsPage;