/**
 * Filter Panel Component
 */

import React, { useState } from 'react';
import {
  Paper,
  Typography,
  Box,
  Slider,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  Button,
  Chip,
  Divider,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Switch,
  FormControlLabel,
  useTheme,
  useMediaQuery
} from '@mui/material';
import {
  ExpandMore as ExpandMoreIcon,
  FilterList as FilterIcon,
  Clear as ClearIcon,
  Search as SearchIcon
} from '@mui/icons-material';
import { useAppSelector, useAppDispatch } from '../../app/hooks.js';
import { 
  setMagnitudeRange,
  setTimePeriod,
  setDepthRange,
  setLocationFilter,
  resetFilters,
  toggleAdvancedFilters,
  setShowOnlySignificant,
  setShowFeltReports
} from '../../features/filters/filterSlice.js';
import { TIME_PERIODS } from '../../utils/constants.js';

const FilterPanel = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const dispatch = useAppDispatch();
  const filters = useAppSelector(state => state.filters);
  const [searchValue, setSearchValue] = useState(filters.locationFilter);

  const handleMagnitudeChange = (event, newValue) => {
    dispatch(setMagnitudeRange(newValue));
  };

  const handleDepthChange = (event, newValue) => {
    dispatch(setDepthRange(newValue));
  };

  const handleTimePeriodChange = (event) => {
    dispatch(setTimePeriod(event.target.value));
  };

  const handleLocationSearch = (event) => {
    if (event.key === 'Enter' || event.type === 'blur') {
      dispatch(setLocationFilter(searchValue));
    }
  };

  const handleSearchChange = (event) => {
    setSearchValue(event.target.value);
  };

  const handleResetFilters = () => {
    dispatch(resetFilters());
    setSearchValue('');
  };

  const getActiveFiltersCount = () => {
    let count = 0;
    if (filters.magnitudeRange[0] > 0 || filters.magnitudeRange[1] < 10) count++;
    if (filters.depthRange[0] > 0 || filters.depthRange[1] < 700) count++;
    if (filters.locationFilter) count++;
    if (filters.timePeriod !== 'day') count++;
    return count;
  };

  const activeFiltersCount = getActiveFiltersCount();

  return (
    <Paper 
      elevation={2} 
      sx={{ 
        p: 3,
        height: 'fit-content',
        position: 'sticky',
        top: 80
      }}
    >
      {/* Header */}
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <FilterIcon color="primary" />
          <Typography variant="h6" sx={{ fontWeight: 600 }}>
            Filters
          </Typography>
          {activeFiltersCount > 0 && (
            <Chip 
              label={activeFiltersCount} 
              size="small" 
              color="primary" 
              sx={{ minWidth: 24, height: 20 }}
            />
          )}
        </Box>
        
        {activeFiltersCount > 0 && (
          <Button
            size="small"
            startIcon={<ClearIcon />}
            onClick={handleResetFilters}
            sx={{ minWidth: 'auto' }}
          >
            Reset
          </Button>
        )}
      </Box>

      {/* Time Period Filter */}
      <FormControl fullWidth sx={{ mb: 3 }}>
        <InputLabel>Time Period</InputLabel>
        <Select
          value={filters.timePeriod}
          label="Time Period"
          onChange={handleTimePeriodChange}
        >
          {Object.entries(TIME_PERIODS).map(([key, value]) => (
            <MenuItem key={key} value={key}>
              {value.label}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      {/* Location Search */}
      <TextField
        fullWidth
        label="Search Location"
        placeholder="e.g., California, Japan, Pacific"
        value={searchValue}
        onChange={handleSearchChange}
        onKeyPress={handleLocationSearch}
        onBlur={handleLocationSearch}
        InputProps={{
          startAdornment: <SearchIcon sx={{ color: 'text.secondary', mr: 1 }} />
        }}
        sx={{ mb: 3 }}
      />

      {/* Magnitude Range */}
      <Box sx={{ mb: 3 }}>
        <Typography variant="subtitle2" sx={{ mb: 2, fontWeight: 600 }}>
          Magnitude Range
        </Typography>
        <Slider
          value={filters.magnitudeRange}
          onChange={handleMagnitudeChange}
          valueLabelDisplay="auto"
          min={0}
          max={10}
          step={0.1}
          marks={[
            { value: 0, label: '0' },
            { value: 3, label: '3' },
            { value: 5, label: '5' },
            { value: 7, label: '7' },
            { value: 10, label: '10+' }
          ]}
          sx={{
            '& .MuiSlider-markLabel': {
              fontSize: '0.75rem'
            }
          }}
        />
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 1 }}>
          <Typography variant="caption" color="text.secondary">
            Min: {filters.magnitudeRange[0]}
          </Typography>
          <Typography variant="caption" color="text.secondary">
            Max: {filters.magnitudeRange[1]}
          </Typography>
        </Box>
      </Box>

      {/* Advanced Filters */}
      <Accordion 
        expanded={filters.showAdvancedFilters}
        onChange={() => dispatch(toggleAdvancedFilters())}
        elevation={0}
        sx={{ 
          '&:before': { display: 'none' },
          bgcolor: 'transparent'
        }}
      >
        <AccordionSummary expandIcon={<ExpandMoreIcon />} sx={{ px: 0 }}>
          <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
            Advanced Filters
          </Typography>
        </AccordionSummary>
        <AccordionDetails sx={{ px: 0, pt: 0 }}>
          {/* Depth Range */}
          <Box sx={{ mb: 3 }}>
            <Typography variant="body2" sx={{ mb: 2, fontWeight: 500 }}>
              Depth Range (km)
            </Typography>
            <Slider
              value={filters.depthRange}
              onChange={handleDepthChange}
              valueLabelDisplay="auto"
              min={0}
              max={700}
              step={10}
              marks={[
                { value: 0, label: '0' },
                { value: 100, label: '100' },
                { value: 300, label: '300' },
                { value: 700, label: '700+' }
              ]}
              sx={{
                '& .MuiSlider-markLabel': {
                  fontSize: '0.75rem'
                }
              }}
            />
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 1 }}>
              <Typography variant="caption" color="text.secondary">
                Shallow: {filters.depthRange[0]} km
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Deep: {filters.depthRange[1]} km
              </Typography>
            </Box>
          </Box>

          {/* Additional Options */}
          <Divider sx={{ my: 2 }} />
          
         
          
          <FormControlLabel
            control={
              <Switch 
                checked={filters.showFeltReports}
                onChange={(e) => dispatch(setShowFeltReports(e.target.checked))}
                size="small"
              />
            }
            label={
              <Typography variant="body2" sx={{ fontWeight: 300 }}>
                Show only felt earthquakes
              </Typography>
            }
          />
        </AccordionDetails>
      </Accordion>

      {/* Filter Summary */}
      {activeFiltersCount > 0 && (
        <Box sx={{ mt: 2, pt: 2, borderTop: '1px solid', borderColor: 'divider' }}>
          <Typography variant="caption" color="text.secondary">
            {activeFiltersCount} filter{activeFiltersCount > 1 ? 's' : ''} active
          </Typography>
        </Box>
      )}
    </Paper>
  );
};

export default FilterPanel;