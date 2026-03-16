/**
 * Real-time Notification System
 */

import React, { useState, useEffect, useCallback } from 'react';
import {
  Snackbar,
  Alert,
  IconButton,
  Box,
  Typography,
  Chip,
  Slide,
  Fade,
  Badge
} from '@mui/material';
import {
  Close as CloseIcon,
  Warning as WarningIcon,
  Error as ErrorIcon,
  Info as InfoIcon,
  LocationOn as LocationIcon
} from '@mui/icons-material';
import { useAppSelector } from '../../app/hooks.js';
import { selectFilteredEarthquakes, selectRecentEarthquakes } from '../../features/earthquakes/earthquakeSelectors.js';

const NotificationSystem = ({ enabled = true }) => {
  const [notifications, setNotifications] = useState([]);
  const [lastCheck, setLastCheck] = useState(Date.now());

  const earthquakes = useAppSelector(selectFilteredEarthquakes);
  const recentEarthquakes = useAppSelector(selectRecentEarthquakes);

  // Check for new significant earthquakes
  useEffect(() => {
    if (!enabled || !earthquakes.length) return;

    const now = Date.now();
    const newEarthquakes = earthquakes.filter(eq =>
      eq.properties.time > lastCheck &&
      eq.properties.mag >= 4.5 // Only notify for significant events
    );

    newEarthquakes.forEach(earthquake => {
      const magnitude = earthquake.properties.mag;
      const location = earthquake.properties.place;
      const time = new Date(earthquake.properties.time).toLocaleTimeString();

      let severity = 'info';
      let title = 'New Earthquake Detected';
      let icon = <InfoIcon />;

      if (magnitude >= 7.0) {
        severity = 'error';
        title = 'Major Earthquake Alert!';
        icon = <ErrorIcon />;
      } else if (magnitude >= 5.5) {
        severity = 'warning';
        title = 'Strong Earthquake Detected';
        icon = <WarningIcon />;
      }

      const notification = {
        id: earthquake.id,
        title,
        message: `Magnitude ${magnitude.toFixed(1)} earthquake near ${location}`,
        time,
        severity,
        icon,
        earthquake,
        timestamp: now
      };

      setNotifications(prev => [notification, ...prev].slice(0, 10)); // Keep only last 10

      // Browser notification if permission granted
      if (Notification.permission === 'granted') {
        new Notification(title, {
          body: `M${magnitude.toFixed(1)} - ${location}`,
          icon: '/earthquake-icon.svg',
          tag: earthquake.id
        });
      }
    });

    setLastCheck(now);
  }, [earthquakes, lastCheck, enabled]);

  // Request notification permission on mount
  useEffect(() => {
    if (enabled && Notification.permission === 'default') {
      Notification.requestPermission();
    }
  }, [enabled]);

  const handleDismiss = useCallback((notificationId) => {
    setNotifications(prev => prev.filter(n => n.id !== notificationId));
  }, []);

  const handleDismissAll = useCallback(() => {
    setNotifications([]);
  }, []);

  if (!enabled || notifications.length === 0) {
    return null;
  }

  return (
    <Box sx={{ position: 'fixed', top: 80, right: 16, zIndex: 1300, maxWidth: 400 }}>
      {/* Notification Header */}
      {notifications.length > 0 && (
        <Box sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          mb: 1,
          p: 1,
          bgcolor: 'background.paper',
          borderRadius: 1,
          boxShadow: 1
        }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Badge badgeContent={notifications.length} color="primary">
              <WarningIcon color="primary" />
            </Badge>
            <Typography variant="body2" fontWeight={600}>
              Recent Alerts
            </Typography>
          </Box>
          <IconButton 
            size="small" 
            onClick={handleDismissAll}
            sx={{
              color: 'text.primary',
              '&:hover': {
                bgcolor: 'action.hover'
              }
            }}
          >
            <CloseIcon fontSize="small" />
          </IconButton>
        </Box>
      )}

      {/* Individual Notifications */}
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
        {notifications.map((notification, index) => (
          <Slide
            key={notification.id}
            direction="left"
            in={true}
            timeout={{ enter: 300, exit: 200 }}
            style={{ transitionDelay: `${index * 100}ms` }}
          >
            <Alert
              severity={notification.severity}
              icon={notification.icon}
              action={
                <IconButton
                  size="small"
                  onClick={() => handleDismiss(notification.id)}
                >
                  <CloseIcon fontSize="small" />
                </IconButton>
              }
              sx={{
                width: '100%',
                boxShadow: 3,
                '& .MuiAlert-message': {
                  width: '100%',
                  overflow: 'hidden'
                }
              }}
            >
              <Box>
                <Typography variant="subtitle2" fontWeight={600} gutterBottom>
                  {notification.title}
                </Typography>
                <Typography variant="body2" sx={{ mb: 1 }}>
                  {notification.message}
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexWrap: 'wrap' }}>
                  <Chip
                    label={`M${notification.earthquake.properties.mag.toFixed(1)}`}
                    size="small"
                    color={notification.severity}
                    variant="outlined"
                  />
                  <Chip
                    icon={<LocationIcon />}
                    label="View on Map"
                    size="small"
                    variant="outlined"
                    clickable
                    onClick={() => {
                      // TODO: Center map on earthquake location
                      console.log('Center map on:', notification.earthquake);
                    }}
                  />
                  <Typography variant="caption" color="text.secondary">
                    {notification.time}
                  </Typography>
                </Box>
              </Box>
            </Alert>
          </Slide>
        ))}
      </Box>
    </Box>
  );
};

export default NotificationSystem;