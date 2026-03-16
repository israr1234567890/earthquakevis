/**
 * Advanced Search and Filter Bar Component
 */

import React, { useState, useCallback, useMemo } from 'react';
import {
  Box,
  TextField,
  InputAdornment,
  IconButton,
  Autocomplete,
  Chip,
  Paper,
  Typography,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Divider,
  useTheme
} from '@mui/material';
import {
  Search as SearchIcon,
  Clear as ClearIcon,
  LocationOn as LocationIcon,
  History as HistoryIcon,
  TrendingUp as TrendingIcon
} from '@mui/icons-material';
import { useAppSelector, useAppDispatch } from '../../app/hooks.js';
import { selectFilteredEarthquakes } from '../../features/earthquakes/earthquakeSelectors.js';
import { setLocationSearch } from '../../features/filters/filterSlice.js';

const SearchBar = ({ onSelectEarthquake }) => {
  const theme = useTheme();
  const dispatch = useAppDispatch();
  const earthquakes = useAppSelector(selectFilteredEarthquakes);
  const [searchValue, setSearchValue] = useState('');
  const [searchHistory, setSearchHistory] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('earthquakeApp.searchHistory') || '[]');
    } catch {
      return [];
    }
  });

  // Create search options from earthquakes
  const searchOptions = useMemo(() => {
    if (!earthquakes.length || !searchValue.trim()) return [];

    const query = searchValue.toLowerCase();
    const results = earthquakes
      .filter(eq =>
        eq.properties.place?.toLowerCase().includes(query) ||
        eq.id?.toLowerCase().includes(query)
      )
      .slice(0, 10) // Limit to 10 results for performance
      .map(eq => ({
        type: 'earthquake',
        earthquake: eq,
        label: eq.properties.place || 'Unknown location',
        magnitude: eq.properties.mag,
        time: eq.properties.time,
        id: eq.id
      }));

    // Add location suggestions
    const uniqueLocations = [...new Set(
      earthquakes
        .map(eq => {
          const place = eq.properties.place;
          if (!place) return null;
          // Extract region from place (e.g., "10km SE of City, Region" -> "Region")
          const parts = place.split(',');
          return parts.length > 1 ? parts[parts.length - 1].trim() : null;
        })
        .filter(Boolean)
        .filter(location => location.toLowerCase().includes(query))
    )].slice(0, 5);

    const locationSuggestions = uniqueLocations.map(location => ({
      type: 'location',
      label: location,
      value: location
    }));

    return [...results, ...locationSuggestions];
  }, [earthquakes, searchValue]);

  // Popular search suggestions
  const popularSearches = [
    'California',
    'Japan',
    'Alaska',
    'Chile',
    'Indonesia',
    'Turkey',
    'Mexico',
    'Italy'
  ];

  const handleSearch = useCallback((value) => {
    if (!value) return;

    // Update search history
    const newHistory = [value, ...searchHistory.filter(h => h !== value)].slice(0, 10);
    setSearchHistory(newHistory);
    localStorage.setItem('earthquakeApp.searchHistory', JSON.stringify(newHistory));

    // Apply filter
    dispatch(setLocationSearch(value));
  }, [dispatch, searchHistory]);

  const handleInputChange = (event, newValue, reason) => {
    if (reason === 'input') {
      setSearchValue(newValue);
    }
  };

  const handleOptionSelect = (event, option) => {
    if (!option) return;

    if (option.type === 'earthquake') {
      onSelectEarthquake?.(option.earthquake);
      setSearchValue(option.label);
    } else if (option.type === 'location') {
      handleSearch(option.value);
      setSearchValue(option.value);
    }
  };

  const clearSearch = () => {
    setSearchValue('');
    dispatch(setLocationSearch(''));
  };

  const renderOption = (props, option) => {
    if (option.type === 'earthquake') {
      return (
        <ListItem {...props} key={option.id}>
          <ListItemIcon>
            <TrendingIcon color={
              option.magnitude >= 6 ? 'error' :
              option.magnitude >= 4 ? 'warning' : 'primary'
            } />
          </ListItemIcon>
          <ListItemText
            primary={
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Typography variant="body2">
                  {option.label}
                </Typography>
                <Chip
                  label={`M${option.magnitude?.toFixed(1) || 'N/A'}`}
                  size="small"
                  color={
                    option.magnitude >= 6 ? 'error' :
                    option.magnitude >= 4 ? 'warning' : 'primary'
                  }
                  variant="outlined"
                />
              </Box>
            }
            secondary={
              option.time ? new Date(option.time).toLocaleDateString() : 'Unknown date'
            }
          />
        </ListItem>
      );
    }

    if (option.type === 'location') {
      return (
        <ListItem {...props} key={option.value}>
          <ListItemIcon>
            <LocationIcon color="primary" />
          </ListItemIcon>
          <ListItemText
            primary={option.label}
            secondary="Search by location"
          />
        </ListItem>
      );
    }

    return null;
  };

  const renderNoOptions = () => (
    <Paper sx={{ p: 2 }}>
      {searchValue ? (
        <Typography variant="body2" color="text.secondary" textAlign="center">
          No earthquakes found matching "{searchValue}"
        </Typography>
      ) : (
        <Box>
          {searchHistory.length > 0 && (
            <>
              <Typography variant="subtitle2" gutterBottom>
                Recent Searches
              </Typography>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 2 }}>
                {searchHistory.slice(0, 5).map((search, index) => (
                  <Chip
                    key={index}
                    label={search}
                    size="small"
                    icon={<HistoryIcon />}
                    onClick={() => {
                      setSearchValue(search);
                      handleSearch(search);
                    }}
                    variant="outlined"
                  />
                ))}
              </Box>
              <Divider sx={{ my: 1 }} />
            </>
          )}
          <Typography variant="subtitle2" gutterBottom>
            Popular Locations
          </Typography>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
            {popularSearches.map((search, index) => (
              <Chip
                key={index}
                label={search}
                size="small"
                onClick={() => {
                  setSearchValue(search);
                  handleSearch(search);
                }}
                variant="outlined"
              />
            ))}
          </Box>
        </Box>
      )}
    </Paper>
  );

  return (
    <Box sx={{ width: '100%', maxWidth: 400 }}>
      <Autocomplete
        freeSolo
        options={searchOptions}
        inputValue={searchValue}
        onInputChange={handleInputChange}
        onChange={handleOptionSelect}
        getOptionLabel={(option) =>
          typeof option === 'string' ? option : option.label || ''
        }
        renderOption={renderOption}
        renderNoOptionsText={() => null}
        noOptionsText=""
        ListboxProps={{
          style: { maxHeight: '300px' }
        }}
        PaperComponent={({ children, ...other }) => (
          <Paper {...other}>
            {searchOptions.length > 0 ? children : renderNoOptions()}
          </Paper>
        )}
        renderInput={(params) => (
          <TextField
            {...params}
            placeholder="Search earthquakes by location, region, or ID..."
            variant="outlined"
            size="small"
            InputProps={{
              ...params.InputProps,
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon color="primary" />
                </InputAdornment>
              ),
              endAdornment: (
                <InputAdornment position="end">
                  {searchValue && (
                    <IconButton 
                      size="small" 
                      onClick={clearSearch}
                      sx={{
                        color: 'text.secondary',
                        '&:hover': {
                          color: 'text.primary',
                          bgcolor: 'action.hover'
                        }
                      }}
                    >
                      <ClearIcon />
                    </IconButton>
                  )}
                </InputAdornment>
              ),
              sx: {
                borderRadius: 2,
                bgcolor: 'background.paper',
                '&:hover': {
                  bgcolor: 'action.hover'
                },
                '&.Mui-focused': {
                  bgcolor: 'background.paper'
                }
              }
            }}
          />
        )}
      />
    </Box>
  );
};

export default SearchBar;