/**
 * Notifications & Alerts Page
 */

import React, { useState } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Switch,
  FormControlLabel,
  Slider,
  Button,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Divider,
  Alert,
  Chip
} from '@mui/material';
import {
  Notifications as NotificationsIcon,
  NotificationsActive as NotificationsActiveIcon,
  VolumeUp as VolumeUpIcon,
  Warning as WarningIcon,
  Error as ErrorIcon,
  Info as InfoIcon
} from '@mui/icons-material';
import NotificationSystem from '../components/Notifications/NotificationSystem.jsx';

const NotificationsPage = () => {
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [soundEnabled, setSoundEnabled] = useState(false);
  const [magnitudeThreshold, setMagnitudeThreshold] = useState(5.0);

  // Mock notification history
  const [notificationHistory] = useState([
    {
      id: 1,
      type: 'error',
      title: 'Major Earthquake Alert',
      message: 'M7.2 earthquake detected near Japan',
      time: Date.now() - 1000 * 60 * 30,
      magnitude: 7.2,
      location: 'Japan'
    },
    {
      id: 2,
      type: 'warning',
      title: 'Strong Earthquake',
      message: 'M5.8 earthquake near California',
      time: Date.now() - 1000 * 60 * 120,
      magnitude: 5.8,
      location: 'California'
    },
    {
      id: 3,
      type: 'info',
      title: 'Moderate Activity',
      message: 'M4.5 earthquake detected',
      time: Date.now() - 1000 * 60 * 180,
      magnitude: 4.5,
      location: 'Alaska'
    }
  ]);

  const requestNotificationPermission = async () => {
    if (Notification.permission === 'default') {
      const permission = await Notification.requestPermission();
      return permission === 'granted';
    }
    return Notification.permission === 'granted';
  };

  const testNotification = async () => {
    const hasPermission = await requestNotificationPermission();
    if (hasPermission) {
      new Notification('Test Notification', {
        body: 'This is a test notification from Earthquake Visualizer',
        icon: '/earthquake-icon.svg'
      });
    }
  };

  const getNotificationIcon = (type) => {
    switch (type) {
      case 'error':
        return <ErrorIcon color="error" />;
      case 'warning':
        return <WarningIcon color="warning" />;
      default:
        return <InfoIcon color="info" />;
    }
  };

  const getSeverityChip = (magnitude) => {
    if (magnitude >= 7) return <Chip label="Major" color="error" size="small" />;
    if (magnitude >= 5.5) return <Chip label="Strong" color="warning" size="small" />;
    if (magnitude >= 4) return <Chip label="Moderate" color="info" size="small" />;
    return <Chip label="Light" color="success" size="small" />;
  };

  return (
    <Box sx={{
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
      overflow: 'auto'
    }}>
      {/* Page Header */}
      <Box sx={{ p: 2, pb: 1 }}>
        <Typography variant="h4" sx={{ fontWeight: 700, color: 'text.primary' }}>
          Notifications & Alerts
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Configure real-time earthquake notifications and view alert history
        </Typography>
      </Box>

      {/* Notification Settings */}
      <Box sx={{ p: 2 }}>
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Notification Settings
            </Typography>

            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
              {/* Enable Notifications */}
              <FormControlLabel
                control={
                  <Switch
                    checked={notificationsEnabled}
                    onChange={(e) => setNotificationsEnabled(e.target.checked)}
                    color="primary"
                  />
                }
                label={
                  <Box>
                    <Typography variant="body1">Enable Notifications</Typography>
                    <Typography variant="body2" color="text.secondary">
                      Receive real-time alerts for significant earthquakes
                    </Typography>
                  </Box>
                }
              />

              {/* Sound Alerts */}
              <FormControlLabel
                control={
                  <Switch
                    checked={soundEnabled}
                    onChange={(e) => setSoundEnabled(e.target.checked)}
                    disabled={!notificationsEnabled}
                    color="primary"
                  />
                }
                label={
                  <Box>
                    <Typography variant="body1">Sound Alerts</Typography>
                    <Typography variant="body2" color="text.secondary">
                      Play sound for earthquake notifications
                    </Typography>
                  </Box>
                }
              />

              {/* Magnitude Threshold */}
              <Box>
                <Typography gutterBottom>
                  Alert Threshold: Magnitude {magnitudeThreshold}
                </Typography>
                <Slider
                  value={magnitudeThreshold}
                  onChange={(e, value) => setMagnitudeThreshold(value)}
                  min={3.0}
                  max={8.0}
                  step={0.5}
                  marks={[
                    { value: 3.0, label: '3.0' },
                    { value: 5.0, label: '5.0' },
                    { value: 7.0, label: '7.0' },
                    { value: 8.0, label: '8.0' }
                  ]}
                  disabled={!notificationsEnabled}
                  sx={{ maxWidth: 400 }}
                />
                <Typography variant="body2" color="text.secondary">
                  Only earthquakes above this magnitude will trigger notifications
                </Typography>
              </Box>

              {/* Permission Status */}
              <Alert
                severity={Notification.permission === 'granted' ? 'success' : 'warning'}
                action={
                  Notification.permission !== 'granted' && (
                    <Button color="inherit" size="small" onClick={requestNotificationPermission}>
                      Enable
                    </Button>
                  )
                }
              >
                Browser notifications: {Notification.permission}
                {Notification.permission === 'denied' && ' - Please enable in browser settings'}
              </Alert>

              {/* Test Notification */}
              <Box>
                <Button
                  variant="outlined"
                  startIcon={<NotificationsActiveIcon />}
                  onClick={testNotification}
                  disabled={!notificationsEnabled}
                >
                  Test Notification
                </Button>
              </Box>
            </Box>
          </CardContent>
        </Card>
      </Box>

      {/* Notification History */}
      <Box sx={{ p: 2, pt: 0, flex: 1 }}>
        <Card sx={{ height: '100%' }}>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Recent Alerts
            </Typography>

            {notificationHistory.length === 0 ? (
              <Box sx={{ textAlign: 'center', py: 4, color: 'text.secondary' }}>
                <NotificationsIcon sx={{ fontSize: 48, mb: 2 }} />
                <Typography variant="body1">
                  No recent notifications
                </Typography>
                <Typography variant="body2">
                  Alerts will appear here when significant earthquakes occur
                </Typography>
              </Box>
            ) : (
              <List>
                {notificationHistory.map((notification, index) => (
                  <React.Fragment key={notification.id}>
                    <ListItem>
                      <ListItemIcon>
                        {getNotificationIcon(notification.type)}
                      </ListItemIcon>
                      <ListItemText
                        primary={
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <Typography variant="subtitle1">
                              {notification.title}
                            </Typography>
                            {getSeverityChip(notification.magnitude)}
                          </Box>
                        }
                        secondary={
                          <Box>
                            <Typography variant="body2" color="text.secondary">
                              {notification.message}
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                              {new Date(notification.time).toLocaleString()} • {notification.location}
                            </Typography>
                          </Box>
                        }
                      />
                    </ListItem>
                    {index < notificationHistory.length - 1 && <Divider />}
                  </React.Fragment>
                ))}
              </List>
            )}
          </CardContent>
        </Card>
      </Box>

      {/* Live Notification System */}
      <NotificationSystem enabled={notificationsEnabled} />
    </Box>
  );
};

export default NotificationsPage;