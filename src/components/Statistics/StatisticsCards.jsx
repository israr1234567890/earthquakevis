/**
 * Statistics Cards Component
 */

import React from 'react';
import {
  Grid,
  Card,
  CardContent,
  Typography,
  Box,
  Skeleton,
  Chip,
  useTheme
} from '@mui/material';
import {
  TrendingUp as TrendingUpIcon,
  LocationOn as LocationIcon,
  Speed as SpeedIcon,
  Public as PublicIcon
} from '@mui/icons-material';
import { useAppSelector } from '../../app/hooks.js';
import { selectFilteredEarthquakes, selectEarthquakeStatistics } from '../../features/earthquakes/earthquakeSelectors.js';
import { formatMagnitude, formatLocation } from '../../utils/formatters.js';

const StatisticsCards = ({ isLoading = false }) => {
  const theme = useTheme();
  const earthquakes = useAppSelector(selectFilteredEarthquakes);
  const statistics = useAppSelector(selectEarthquakeStatistics);

  const cards = [
    {
      title: 'Total Earthquakes',
      value: statistics.totalCount,
      icon: <PublicIcon />,
      color: theme.palette.primary.main,
      suffix: '',
      description: 'in selected period'
    },
    {
      title: 'Average Magnitude',
      value: formatMagnitude(statistics.averageMagnitude),
      icon: <SpeedIcon />,
      color: theme.palette.info.main,
      suffix: '',
      description: 'mean intensity'
    },
    {
      title: 'Strongest Event',
      value: formatMagnitude(statistics.maxMagnitude),
      icon: <TrendingUpIcon />,
      color: statistics.maxMagnitude >= 6 ? theme.palette.error.main : theme.palette.warning.main,
      suffix: '',
      description: statistics.strongestLocation ? formatLocation(statistics.strongestLocation) : 'No data'
    },
    {
      title: 'Most Active Region',
      value: statistics.mostActiveRegion || 'Calculating...',
      icon: <LocationIcon />,
      color: theme.palette.success.main,
      suffix: '',
      description: `${statistics.mostActiveCount || 0} events`
    }
  ];

  if (isLoading) {
    return (
      <Grid container spacing={3} sx={{ mb: 3 }}>
        {[1, 2, 3, 4].map((index) => (
          <Grid item xs={12} sm={6} md={3} key={index}>
            <Card elevation={2}>
              <CardContent>
                <Skeleton variant="text" width="60%" height={24} />
                <Skeleton variant="text" width="40%" height={40} sx={{ mt: 1 }} />
                <Skeleton variant="text" width="80%" height={20} sx={{ mt: 1 }} />
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    );
  }

  return (
    <Grid container spacing={3} sx={{ mb: 3 }}>
      {cards.map((card, index) => (
        <Grid item xs={12} sm={6} md={3} key={index}>
          <Card 
            elevation={2}
            sx={{
              height: '100%',
              transition: 'all 0.3s ease-in-out',
              '&:hover': {
                elevation: 4,
                transform: 'translateY(-2px)'
              }
            }}
          >
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Box
                  sx={{
                    p: 1,
                    borderRadius: 2,
                    bgcolor: `${card.color}15`,
                    color: card.color,
                    mr: 2
                  }}
                >
                  {card.icon}
                </Box>
                <Typography variant="h6" component="h3" sx={{ fontWeight: 600 }}>
                  {card.title}
                </Typography>
              </Box>

              <Typography
                variant="h4"
                component="div"
                sx={{
                  fontWeight: 700,
                  color: card.color,
                  mb: 1,
                  fontSize: { xs: '1.5rem', sm: '2rem' }
                }}
              >
                {card.value}
                {card.suffix && (
                  <Typography
                    component="span"
                    variant="h6"
                    sx={{ color: 'text.secondary', ml: 0.5 }}
                  >
                    {card.suffix}
                  </Typography>
                )}
              </Typography>

              <Typography variant="body2" color="text.secondary">
                {card.description}
              </Typography>

              {/* Additional info for strongest event */}
              {index === 2 && statistics.maxMagnitude >= 5 && (
                <Chip
                  label={statistics.maxMagnitude >= 7 ? 'Major' : 'Moderate'}
                  size="small"
                  color={statistics.maxMagnitude >= 7 ? 'error' : 'warning'}
                  sx={{ mt: 1 }}
                />
              )}
            </CardContent>
          </Card>
        </Grid>
      ))}
    </Grid>
  );
};

export default StatisticsCards;