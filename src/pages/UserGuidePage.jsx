/**
 * User Guide Page Component
 * Comprehensive guide for using the Earthquake Visualizer
 */

import React from 'react';
import {
  Box,
  Container,
  Typography,
  Button,
  Grid,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Paper,
  Chip,
  Stack,
  Divider
} from '@mui/material';
import {
  ArrowBack as ArrowBackIcon,
  ExpandMore as ExpandMoreIcon,
  Dashboard as DashboardIcon,
  Map as MapIcon,
  Search as SearchIcon,
  Analytics as AnalyticsIcon,
  Bookmark as BookmarkIcon,
  Notifications as NotificationsIcon,
  Settings as SettingsIcon,
  Public as EarthIcon
} from '@mui/icons-material';

const UserGuidePage = ({ onBack }) => {
  const guideSteps = [
    {
      title: 'Dashboard Overview',
      icon: <DashboardIcon />,
      description: 'Get a comprehensive overview of recent earthquake activity',
      steps: [
        'View real-time earthquake statistics and counts',
        'See recent significant earthquakes in your area',
        'Monitor global seismic activity trends',
        'Access quick filters for magnitude and time periods'
      ]
    },
    {
      title: 'Interactive Map',
      icon: <MapIcon />,
      description: 'Explore earthquakes on an interactive world map',
      steps: [
        'Click on earthquake markers to view detailed information',
        'Use zoom and pan controls to navigate the map',
        'Toggle different map layers (satellite, terrain, etc.)',
        'Filter earthquakes by magnitude, depth, and time range'
      ]
    },
    {
      title: 'Search & Filter',
      icon: <SearchIcon />,
      description: 'Find specific earthquakes using advanced filters',
      steps: [
        'Search by location, magnitude, or date range',
        'Apply multiple filters simultaneously',
        'Sort results by various criteria',
        'Export filtered data for analysis'
      ]
    },
    {
      title: 'Analytics & Trends',
      icon: <AnalyticsIcon />,
      description: 'Analyze earthquake patterns and statistics',
      steps: [
        'View magnitude distribution charts',
        'Analyze temporal patterns and trends',
        'Compare regional earthquake activity',
        'Generate custom reports and visualizations'
      ]
    },
    {
      title: 'Bookmarks & Alerts',
      icon: <BookmarkIcon />,
      description: 'Save interesting earthquakes and set up notifications',
      steps: [
        'Bookmark earthquakes for later reference',
        'Set up magnitude-based alert thresholds',
        'Receive notifications for significant events',
        'Manage your saved earthquake collection'
      ]
    },
    {
      title: 'Settings & Preferences',
      icon: <SettingsIcon />,
      description: 'Customize your experience and preferences',
      steps: [
        'Adjust refresh intervals and auto-update settings',
        'Configure notification preferences',
        'Set default map layers and zoom levels',
        'Manage data export formats and options'
      ]
    }
  ];

  const quickTips = [
    {
      title: 'Understanding Earthquake Data',
      content: 'Earthquake magnitude is measured on the Richter scale. Magnitudes above 5.0 are considered significant, while those above 7.0 are major earthquakes.'
    },
    {
      title: 'Real-time Updates',
      content: 'Data is sourced from USGS and updates automatically every 5 minutes. You can also manually refresh using the refresh button in the top bar.'
    },
    {
      title: 'Map Navigation',
      content: 'Use mouse wheel to zoom, click and drag to pan. On mobile, use pinch gestures to zoom and swipe to navigate.'
    },
    {
      title: 'Filtering Tips',
      content: 'Combine multiple filters for precise results. Use date ranges to focus on specific time periods and magnitude filters to show only significant events.'
    }
  ];

  return (
    <Box
      sx={{
        minHeight: '100vh',
        bgcolor: '#fafafa',
        py: 4
      }}
    >
      {/* Header */}
      <Container maxWidth="lg">
        <Box sx={{ mb: 4 }}>
          <Button
            startIcon={<ArrowBackIcon />}
            onClick={onBack}
            sx={{
              mb: 3,
              color: '#6b7280',
              textTransform: 'none',
              '&:hover': { bgcolor: '#f3f4f6' }
            }}
          >
            Back to Landing Page
          </Button>

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
            <EarthIcon sx={{ fontSize: 40, color: '#3b82f6' }} />
            <Box>
              <Typography
                variant="h3"
                component="h1"
                sx={{
                  fontWeight: 700,
                  color: '#111827',
                  mb: 1
                }}
              >
                User Guide
              </Typography>
              <Typography
                variant="h6"
                sx={{
                  color: '#6b7280',
                  fontWeight: 400
                }}
              >
                Learn how to make the most of the Earthquake Visualizer
              </Typography>
            </Box>
          </Box>

          <Stack direction="row" spacing={1} sx={{ mb: 4 }}>
            <Chip 
              label="Comprehensive Guide" 
              size="small" 
              sx={{ bgcolor: '#dbeafe', color: '#1e40af', fontWeight: 500 }}
            />
            <Chip 
              label="Step-by-Step" 
              size="small" 
              sx={{ bgcolor: '#dcfce7', color: '#166534', fontWeight: 500 }}
            />
            <Chip 
              label="Educational" 
              size="small" 
              sx={{ bgcolor: '#fef3c7', color: '#92400e', fontWeight: 500 }}
            />
          </Stack>
        </Box>

        {/* Quick Tips Section */}
        <Paper
          sx={{
            p: 4,
            mb: 6,
            borderRadius: 3,
            bgcolor: 'white',
            boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)'
          }}
        >
          <Typography
            variant="h5"
            component="h2"
            gutterBottom
            sx={{ 
              fontWeight: 600,
              color: '#111827',
              mb: 3
            }}
          >
            Quick Tips & Overview
          </Typography>
          
          <Grid container spacing={3}>
            {quickTips.map((tip, index) => (
              <Grid item xs={12} md={6} key={index}>
                <Box
                  sx={{
                    p: 3,
                    borderRadius: 2,
                    bgcolor: '#f8fafc',
                    border: '1px solid #e2e8f0',
                    height: '100%'
                  }}
                >
                  <Typography
                    variant="h6"
                    component="h3"
                    gutterBottom
                    sx={{ 
                      fontWeight: 600,
                      color: '#1e293b',
                      mb: 2
                    }}
                  >
                    {tip.title}
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{ 
                      color: '#475569',
                      lineHeight: 1.6
                    }}
                  >
                    {tip.content}
                  </Typography>
                </Box>
              </Grid>
            ))}
          </Grid>
        </Paper>

        {/* Detailed Guide Steps */}
        <Typography
          variant="h5"
          component="h2"
          gutterBottom
          sx={{ 
            mb: 4, 
            fontWeight: 600,
            color: '#111827'
          }}
        >
          Detailed Feature Guide
        </Typography>

        <Grid container spacing={3}>
          {guideSteps.map((step, index) => (
            <Grid item xs={12} md={6} key={index}>
              <Accordion
                sx={{
                  boxShadow: 'none',
                  border: '1px solid #e5e7eb',
                  borderRadius: 2,
                  '&:before': { display: 'none' },
                  mb: 2,
                  bgcolor: 'white'
                }}
              >
                <AccordionSummary
                  expandIcon={<ExpandMoreIcon />}
                  sx={{
                    '& .MuiAccordionSummary-content': {
                      alignItems: 'center',
                      gap: 2
                    }
                  }}
                >
                  <Box
                    sx={{
                      width: 48,
                      height: 48,
                      borderRadius: '50%',
                      bgcolor: '#f3f4f6',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}
                  >
                    {React.cloneElement(step.icon, { sx: { fontSize: 24, color: '#3b82f6' } })}
                  </Box>
                  <Box>
                    <Typography variant="h6" sx={{ fontWeight: 600, color: '#111827' }}>
                      {step.title}
                    </Typography>
                    <Typography variant="body2" sx={{ color: '#6b7280' }}>
                      {step.description}
                    </Typography>
                  </Box>
                </AccordionSummary>
                <AccordionDetails>
                  <List dense>
                    {step.steps.map((stepItem, stepIndex) => (
                      <ListItem key={stepIndex} sx={{ pl: 0 }}>
                        <ListItemIcon sx={{ minWidth: 32 }}>
                          <Box
                            sx={{
                              width: 8,
                              height: 8,
                              borderRadius: '50%',
                              bgcolor: '#3b82f6'
                            }}
                          />
                        </ListItemIcon>
                        <ListItemText 
                          primary={stepItem}
                          primaryTypographyProps={{
                            variant: 'body2',
                            color: '#4b5563'
                          }}
                        />
                      </ListItem>
                    ))}
                  </List>
                </AccordionDetails>
              </Accordion>
            </Grid>
          ))}
        </Grid>

        {/* Getting Started Section */}
        <Paper
          sx={{
            p: 6,
            mt: 6,
            borderRadius: 3,
            bgcolor: 'white',
            boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
            textAlign: 'center'
          }}
        >
          <Typography
            variant="h5"
            component="h2"
            gutterBottom
            sx={{ 
              fontWeight: 600,
              color: '#111827',
              mb: 2
            }}
          >
            Ready to Get Started?
          </Typography>
          <Typography
            variant="body1"
            sx={{ 
              color: '#6b7280',
              mb: 4,
              maxWidth: 600,
              mx: 'auto'
            }}
          >
            Now that you know how to use the Earthquake Visualizer, start exploring real-time seismic data and discover patterns in earthquake activity around the world.
          </Typography>
          <Button
            variant="contained"
            size="large"
            onClick={onBack}
            sx={{
              py: 2,
              px: 4,
              fontSize: '1rem',
              fontWeight: 600,
              borderRadius: 2,
              bgcolor: '#3b82f6',
              color: 'white',
              textTransform: 'none',
              boxShadow: '0 4px 14px 0 rgba(59, 130, 246, 0.3)',
              '&:hover': {
                bgcolor: '#2563eb',
                transform: 'translateY(-1px)',
                boxShadow: '0 6px 20px 0 rgba(59, 130, 246, 0.4)'
              },
              transition: 'all 0.2s ease'
            }}
          >
            Launch Application
          </Button>
        </Paper>
      </Container>
    </Box>
  );
};

export default UserGuidePage;