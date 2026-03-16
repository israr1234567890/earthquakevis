/**
 * Nearby Earthquakes Component
 * Shows earthquakes near user's location
 */

import { useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Chip,
  IconButton,
  Collapse,
  Slider,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Divider,
  Alert
} from '@mui/material';
import {
  MyLocation as MyLocationIcon,
  ExpandMore as ExpandMoreIcon,
  ExpandLess as ExpandLessIcon,
  Place as PlaceIcon,
  AccessTime as TimeIcon,
  Close as CloseIcon
} from '@mui/icons-material';
import { useAppSelector } from '../../app/hooks.js';
import { selectNearbyEarthquakes } from '../../features/earthquakes/earthquakeSelectors.js';
import { getMagnitudeColor, getMagnitudeSeverity } from '../../utils/calculations.js';
import { formatMagnitude, formatDateTime, formatLocation } from '../../utils/formatters.js';

const NearbyEarthquakes = ({ onEarthquakeSelect, onClose }) => {
  const [expanded, setExpanded] = useState(false);
  const [radiusKm, setRadiusKm] = useState(100);
  const [sortBy, setSortBy] = useState('distance');
  
  const userLocation = useAppSelector(state => state.map.userLocation);
  const nearbyEarthquakes = useAppSelector(state => 
    selectNearbyEarthquakes(state, radiusKm)
  );

  if (!userLocation) {
    return (
      <Card sx={{ mb: 2 }}>
        <CardContent>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <MyLocationIcon color="disabled" />
              <Typography variant="h6" color="text.secondary">
                Nearby Earthquakes
              </Typography>
            </Box>
            {onClose && (
              <IconButton 
                size="small" 
                onClick={onClose}
                sx={{ 
                  color: 'text.secondary',
                  '&:hover': { color: 'text.primary' }
                }}
              >
                <CloseIcon fontSize="small" />
              </IconButton>
            )}
          </Box>
          <Alert severity="info" sx={{ fontSize: '0.875rem' }}>
            Enable location access to see earthquakes near you
          </Alert>
        </CardContent>
      </Card>
    );
  }

  const sortedEarthquakes = [...nearbyEarthquakes].sort((a, b) => {
    switch (sortBy) {
      case 'magnitude':
        return (b.properties.mag || 0) - (a.properties.mag || 0);
      case 'time':
        return (b.properties.time || 0) - (a.properties.time || 0);
      case 'distance':
      default:
        return a.distanceFromUser - b.distanceFromUser;
    }
  });

  const handleEarthquakeClick = (earthquake) => {
    if (onEarthquakeSelect) {
      onEarthquakeSelect(earthquake);
    }
  };

  return (
    <Card sx={{ mb: 2 }}>
      <CardContent>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Box 
            sx={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: 1,
              cursor: 'pointer',
              flex: 1
            }}
            onClick={() => setExpanded(!expanded)}
          >
            <MyLocationIcon color="primary" />
            <Typography variant="h6">
              Nearby Earthquakes
            </Typography>
            <Chip 
              label={nearbyEarthquakes.length} 
              size="small" 
              color={nearbyEarthquakes.length > 0 ? "primary" : "default"}
            />
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
            <IconButton size="small" onClick={() => setExpanded(!expanded)}>
              {expanded ? <ExpandLessIcon /> : <ExpandMoreIcon />}
            </IconButton>
            {onClose && (
              <IconButton 
                size="small" 
                onClick={onClose}
                sx={{ 
                  color: 'text.secondary',
                  '&:hover': { color: 'text.primary' }
                }}
              >
                <CloseIcon fontSize="small" />
              </IconButton>
            )}
          </Box>
        </Box>

        <Collapse in={expanded}>
          <Box sx={{ mt: 2 }}>
            {/* Controls */}
            <Box sx={{ display: 'flex', gap: 2, mb: 2, flexWrap: 'wrap' }}>
              <Box sx={{ minWidth: 120 }}>
                <Typography variant="body2" gutterBottom>
                  Radius: {radiusKm} km
                </Typography>
                <Slider
                  value={radiusKm}
                  onChange={(_, value) => setRadiusKm(value)}
                  min={10}
                  max={500}
                  step={10}
                  size="small"
                  valueLabelDisplay="auto"
                />
              </Box>
              
              <FormControl size="small" sx={{ minWidth: 120 }}>
                <InputLabel>Sort by</InputLabel>
                <Select
                  value={sortBy}
                  label="Sort by"
                  onChange={(e) => setSortBy(e.target.value)}
                >
                  <MenuItem value="distance">Distance</MenuItem>
                  <MenuItem value="magnitude">Magnitude</MenuItem>
                  <MenuItem value="time">Time</MenuItem>
                </Select>
              </FormControl>
            </Box>

            <Divider sx={{ mb: 2 }} />

            {/* Earthquake List */}
            {sortedEarthquakes.length === 0 ? (
              <Alert severity="info" sx={{ fontSize: '0.875rem' }}>
                No earthquakes found within {radiusKm} km of your location
              </Alert>
            ) : (
              <List dense sx={{ maxHeight: 300, overflow: 'auto' }}>
                {sortedEarthquakes.slice(0, 10).map((earthquake) => {
                  const magnitude = earthquake.properties.mag || 0;
                  const location = earthquake.properties.place || 'Unknown location';
                  const time = earthquake.properties.time;
                  const distance = earthquake.distanceFromUser;

                  return (
                    <ListItem
                      key={earthquake.id}
                      onClick={() => handleEarthquakeClick(earthquake)}
                      sx={{
                        borderRadius: 1,
                        mb: 0.5,
                        cursor: 'pointer',
                        '&:hover': { bgcolor: 'action.hover' }
                      }}
                    >
                      <ListItemIcon sx={{ minWidth: 36 }}>
                        <Box
                          sx={{
                            width: 12,
                            height: 12,
                            borderRadius: '50%',
                            bgcolor: getMagnitudeColor(magnitude),
                            border: '2px solid white',
                            boxShadow: 1
                          }}
                        />
                      </ListItemIcon>
                      
                      <ListItemText
                        primary={
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexWrap: 'wrap' }}>
                            <Typography variant="body2" fontWeight="bold">
                              M{formatMagnitude(magnitude)}
                            </Typography>
                            <Chip
                              label={getMagnitudeSeverity(magnitude)}
                              size="small"
                              sx={{
                                bgcolor: getMagnitudeColor(magnitude),
                                color: 'white',
                                fontSize: '0.7rem',
                                height: 20
                              }}
                            />
                          </Box>
                        }
                        secondary={
                          <Box sx={{ mt: 0.5 }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mb: 0.5 }}>
                              <PlaceIcon sx={{ fontSize: 14, color: 'text.secondary' }} />
                              <Typography variant="caption" color="text.secondary">
                                {distance < 1 ? 
                                  `${(distance * 1000).toFixed(0)}m away` : 
                                  `${distance.toFixed(1)} km away`
                                }
                              </Typography>
                            </Box>
                            <Typography variant="caption" color="text.secondary" display="block">
                              {formatLocation(location)}
                            </Typography>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mt: 0.5 }}>
                              <TimeIcon sx={{ fontSize: 14, color: 'text.secondary' }} />
                              <Typography variant="caption" color="text.secondary">
                                {formatDateTime(time)}
                              </Typography>
                            </Box>
                          </Box>
                        }
                      />
                    </ListItem>
                  );
                })}
                
                {sortedEarthquakes.length > 10 && (
                  <ListItem>
                    <ListItemText>
                      <Typography variant="caption" color="text.secondary" align="center">
                        ... and {sortedEarthquakes.length - 10} more earthquakes
                      </Typography>
                    </ListItemText>
                  </ListItem>
                )}
              </List>
            )}
          </Box>
        </Collapse>
      </CardContent>
    </Card>
  );
};

export default NearbyEarthquakes;