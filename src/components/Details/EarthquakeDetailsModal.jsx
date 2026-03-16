/**
 * Enhanced Earthquake Details Modal
 */

import { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
  Grid,
  Card,
  CardContent,
  Chip,
  Divider,
  IconButton,
  Link,
  Alert,
  LinearProgress,
  Paper,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  useTheme,
  useMediaQuery,
  Tooltip,
  Avatar
} from '@mui/material';
import {
  Close as CloseIcon,
  LocationOn as LocationIcon,
  AccessTime as TimeIcon,
  Speed as SpeedIcon,
  Waves as WavesIcon,
  TrendingUp as TrendingUpIcon,
  Warning as WarningIcon,
  Info as InfoIcon,
  OpenInNew as OpenInNewIcon,
  Share as ShareIcon,
  Bookmark as BookmarkIcon,
  BookmarkBorder as BookmarkBorderIcon
} from '@mui/icons-material';

const EarthquakeDetailsModal = ({ open, onClose, earthquake, isBookmarked, onToggleBookmark }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  if (!earthquake) return null;

  const {
    properties: {
      mag,
      place,
      time,
      updated,
      url,
      detail,
      felt,
      cdi,
      mmi,
      alert,
      tsunami,
      sig,
      net,
      code,
      ids,
      sources,
      types,
      status,
      locationSource,
      magSource
    },
    geometry: {
      coordinates: [longitude, latitude, depth]
    },
    id
  } = earthquake;

  // Helper functions
  const getMagnitudeColor = (magnitude) => {
    if (magnitude >= 7) return theme.palette.error.main;
    if (magnitude >= 5.5) return theme.palette.warning.main;
    if (magnitude >= 4) return theme.palette.info.main;
    return theme.palette.success.main;
  };

  const getMagnitudeLabel = (magnitude) => {
    if (magnitude >= 8) return 'Great';
    if (magnitude >= 7) return 'Major';
    if (magnitude >= 6) return 'Strong';
    if (magnitude >= 5) return 'Moderate';
    if (magnitude >= 4) return 'Light';
    if (magnitude >= 3) return 'Minor';
    return 'Micro';
  };

  const getDepthCategory = (depthKm) => {
    const absDepth = Math.abs(depthKm);
    if (absDepth <= 70) return { label: 'Shallow', color: theme.palette.error.main };
    if (absDepth <= 300) return { label: 'Intermediate', color: theme.palette.warning.main };
    return { label: 'Deep', color: theme.palette.info.main };
  };

  const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    return {
      date: date.toLocaleDateString(),
      time: date.toLocaleTimeString(),
      relative: getRelativeTime(timestamp)
    };
  };

  const getRelativeTime = (timestamp) => {
    const now = Date.now();
    const diff = now - timestamp;
    const minutes = Math.floor(diff / (1000 * 60));
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));

    if (days > 0) return `${days} day${days > 1 ? 's' : ''} ago`;
    if (hours > 0) return `${hours} hour${hours > 1 ? 's' : ''} ago`;
    if (minutes > 0) return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
    return 'Just now';
  };

  const depthInfo = getDepthCategory(depth);
  const timeInfo = formatTime(time);
  const updatedTime = updated ? formatTime(updated) : null;

  const handleShare = async () => {
    if (navigator.share) {
      await navigator.share({
        title: `M${mag} Earthquake`,
        text: `Magnitude ${mag} earthquake near ${place}`,
        url: url
      });
    } else {
      // Fallback to clipboard
      await navigator.clipboard.writeText(
        `M${mag} earthquake near ${place} - ${window.location.origin}${window.location.pathname}?eq=${id}`
      );
    }
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullWidth
      fullScreen={isMobile}
      PaperProps={{
        sx: {
          borderRadius: isMobile ? 0 : 2,
          maxHeight: '90vh'
        }
      }}
    >
      <DialogTitle sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        pb: 1
      }}>
        <Box>
          <Typography variant="h6" component="h2">
            Earthquake Details
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {timeInfo.relative} • {place}
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', gap: 0.5 }}>
          <Tooltip title="Share earthquake details">
            <IconButton 
              onClick={handleShare} 
              size="small"
              sx={{
                color: 'text.primary',
                '&:hover': {
                  bgcolor: 'action.hover'
                }
              }}
            >
              <ShareIcon />
            </IconButton>
          </Tooltip>
          <Tooltip title={isBookmarked ? "Remove bookmark" : "Bookmark earthquake"}>
            <IconButton 
              onClick={() => onToggleBookmark?.(earthquake)} 
              size="small"
              sx={{
                color: isBookmarked ? 'primary.main' : 'text.primary',
                '&:hover': {
                  bgcolor: 'action.hover'
                }
              }}
            >
              {isBookmarked ? <BookmarkIcon /> : <BookmarkBorderIcon />}
            </IconButton>
          </Tooltip>
          <IconButton 
            onClick={onClose} 
            size="small"
            sx={{
              color: 'text.primary',
              '&:hover': {
                bgcolor: 'action.hover'
              }
            }}
          >
            <CloseIcon />
          </IconButton>
        </Box>
      </DialogTitle>

      <DialogContent sx={{ pb: 1 }}>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
          {/* Alert Banner */}
          {alert && (
            <Alert
              severity={alert === 'red' ? 'error' : alert === 'orange' ? 'warning' : 'info'}
              icon={<WarningIcon />}
            >
              <Typography fontWeight={600}>
                {alert.toUpperCase()} Alert Level
              </Typography>
              This earthquake has triggered a {alert} alert level indicating potential hazards.
            </Alert>
          )}

          {/* Tsunami Warning */}
          {tsunami === 1 && (
            <Alert severity="error" icon={<WavesIcon />}>
              <Typography fontWeight={600}>Tsunami Warning</Typography>
              This earthquake may have generated a tsunami.
            </Alert>
          )}

          {/* Main Info Cards */}
          <Grid container spacing={2}>
            {/* Magnitude */}
            <Grid item xs={12} sm={6} md={3}>
              <Card sx={{ height: '100%', bgcolor: `${getMagnitudeColor(mag)}10` }}>
                <CardContent sx={{ textAlign: 'center' }}>
                  <Avatar sx={{
                    bgcolor: getMagnitudeColor(mag),
                    mx: 'auto',
                    mb: 1,
                    width: 56,
                    height: 56,
                    fontSize: '1.5rem',
                    fontWeight: 'bold'
                  }}>
                    {mag?.toFixed(1) || 'N/A'}
                  </Avatar>
                  <Typography variant="h6" color={getMagnitudeColor(mag)}>
                    Magnitude
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {getMagnitudeLabel(mag)}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>

            {/* Depth */}
            <Grid item xs={12} sm={6} md={3}>
              <Card sx={{ height: '100%', bgcolor: `${depthInfo.color}10` }}>
                <CardContent sx={{ textAlign: 'center' }}>
                  <Avatar sx={{
                    bgcolor: depthInfo.color,
                    mx: 'auto',
                    mb: 1,
                    width: 56,
                    height: 56
                  }}>
                    <TrendingUpIcon />
                  </Avatar>
                  <Typography variant="h6" color={depthInfo.color}>
                    {Math.abs(depth).toFixed(1)} km
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {depthInfo.label} Depth
                  </Typography>
                </CardContent>
              </Card>
            </Grid>

            {/* Significance */}
            <Grid item xs={12} sm={6} md={3}>
              <Card sx={{ height: '100%' }}>
                <CardContent sx={{ textAlign: 'center' }}>
                  <Avatar sx={{
                    bgcolor: theme.palette.primary.main,
                    mx: 'auto',
                    mb: 1,
                    width: 56,
                    height: 56
                  }}>
                    <InfoIcon />
                  </Avatar>
                  <Typography variant="h6" color="primary">
                    {sig || 0}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Significance
                  </Typography>
                </CardContent>
              </Card>
            </Grid>

            {/* Felt Reports */}
            <Grid item xs={12} sm={6} md={3}>
              <Card sx={{ height: '100%' }}>
                <CardContent sx={{ textAlign: 'center' }}>
                  <Avatar sx={{
                    bgcolor: theme.palette.success.main,
                    mx: 'auto',
                    mb: 1,
                    width: 56,
                    height: 56
                  }}>
                    <SpeedIcon />
                  </Avatar>
                  <Typography variant="h6" color="success.main">
                    {felt || 0}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Felt Reports
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          </Grid>

          {/* Detailed Information */}
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Detailed Information
            </Typography>
            <List dense>
              <ListItem>
                <ListItemIcon>
                  <LocationIcon sx={{ color: 'text.primary' }} />
                </ListItemIcon>
                <ListItemText
                  primary="Location"
                  secondary={
                    <Box>
                      <Typography variant="body2">{place}</Typography>
                      <Typography variant="caption" color="text.secondary">
                        {latitude.toFixed(4)}°, {longitude.toFixed(4)}°
                      </Typography>
                    </Box>
                  }
                />
              </ListItem>

              <ListItem>
                <ListItemIcon>
                  <TimeIcon sx={{ color: 'text.primary' }} />
                </ListItemIcon>
                <ListItemText
                  primary="Time"
                  secondary={
                    <Box>
                      <Typography variant="body2">
                        {timeInfo.date} at {timeInfo.time}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {timeInfo.relative}
                      </Typography>
                    </Box>
                  }
                />
              </ListItem>

              {updatedTime && (
                <ListItem>
                  <ListItemIcon>
                    <InfoIcon sx={{ color: 'text.primary' }} />
                  </ListItemIcon>
                  <ListItemText
                    primary="Last Updated"
                    secondary={`${updatedTime.date} at ${updatedTime.time}`}
                  />
                </ListItem>
              )}

              {(cdi || mmi) && (
                <ListItem>
                  <ListItemIcon>
                    <SpeedIcon sx={{ color: 'text.primary' }} />
                  </ListItemIcon>
                  <ListItemText
                    primary="Intensity"
                    secondary={
                      <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                        {cdi && <Chip size="small" label={`CDI: ${cdi}`} />}
                        {mmi && <Chip size="small" label={`MMI: ${mmi}`} />}
                      </Box>
                    }
                  />
                </ListItem>
              )}
            </List>
          </Paper>

          {/* Technical Details */}
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Technical Details
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <Typography variant="body2" color="text.secondary">Event ID</Typography>
                <Typography variant="body1" sx={{ fontFamily: 'monospace' }}>{id}</Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant="body2" color="text.secondary">Network</Typography>
                <Typography variant="body1">{net}</Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant="body2" color="text.secondary">Status</Typography>
                <Chip
                  label={status}
                  size="small"
                  color={status === 'reviewed' ? 'success' : 'warning'}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant="body2" color="text.secondary">Data Sources</Typography>
                <Typography variant="body1">{sources}</Typography>
              </Grid>
              {magSource && (
                <Grid item xs={12} sm={6}>
                  <Typography variant="body2" color="text.secondary">Magnitude Source</Typography>
                  <Typography variant="body1">{magSource}</Typography>
                </Grid>
              )}
              {locationSource && (
                <Grid item xs={12} sm={6}>
                  <Typography variant="body2" color="text.secondary">Location Source</Typography>
                  <Typography variant="body1">{locationSource}</Typography>
                </Grid>
              )}
            </Grid>
          </Paper>
        </Box>
      </DialogContent>

      <DialogActions sx={{ px: 3, pb: 2 }}>
        {url && (
          <Button
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            startIcon={<OpenInNewIcon />}
            color="primary"
            variant="contained"
          >
            USGS Details
          </Button>
        )}
        <Button 
          onClick={onClose}
          sx={{
            color: 'text.primary',
            '&:hover': {
              bgcolor: 'action.hover'
            }
          }}
        >
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default EarthquakeDetailsModal;