/**
 * Bookmarks Page - Saved earthquakes management
 */

import React, { useState } from 'react';
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  TextField,
  InputAdornment,
  Button,
  Menu,
  MenuItem,
  Chip,
  useTheme
} from '@mui/material';
import {
  Search as SearchIcon,
  Sort as SortIcon,
  Download as DownloadIcon,
  Bookmark as BookmarkIcon,
  Delete as DeleteIcon,
  LocationOn as LocationIcon,
  TrendingUp as MagnitudeIcon,
  AccessTime as TimeIcon
} from '@mui/icons-material';
import { useBookmarks } from '../components/Bookmarks/BookmarksPanel.jsx';

const BookmarksPage = ({ onEarthquakeSelect }) => {
  const theme = useTheme();
  const { bookmarks, removeBookmark, isBookmarked } = useBookmarks();

  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('time');
  const [sortAnchorEl, setSortAnchorEl] = useState(null);
  const [filterBy, setFilterBy] = useState('all');

  // Filter and sort bookmarks
  const filteredBookmarks = bookmarks
    .filter(bookmark => {
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        return (
          bookmark.properties.place?.toLowerCase().includes(query) ||
          bookmark.id?.toLowerCase().includes(query)
        );
      }
      return true;
    })
    .filter(bookmark => {
      switch (filterBy) {
        case 'major':
          return bookmark.properties.mag >= 6;
        case 'recent':
          return Date.now() - bookmark.properties.time < 24 * 60 * 60 * 1000;
        default:
          return true;
      }
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'magnitude':
          return (b.properties.mag || 0) - (a.properties.mag || 0);
        case 'location':
          return (a.properties.place || '').localeCompare(b.properties.place || '');
        case 'time':
        default:
          return (b.properties.time || 0) - (a.properties.time || 0);
      }
    });

  const handleSortClick = (event) => {
    setSortAnchorEl(event.currentTarget);
  };

  const handleSortClose = (newSort) => {
    setSortAnchorEl(null);
    if (newSort) {
      setSortBy(newSort);
    }
  };

  const exportBookmarks = () => {
    const dataStr = JSON.stringify(bookmarks, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `earthquake-bookmarks-${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const getMagnitudeColor = (magnitude) => {
    if (magnitude >= 7) return 'error';
    if (magnitude >= 5.5) return 'warning';
    if (magnitude >= 4) return 'info';
    return 'success';
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
          Bookmarks ({bookmarks.length})
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Manage your saved earthquakes and export data
        </Typography>
      </Box>

      {/* Controls */}
      <Box sx={{ p: 2, pt: 1 }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              size="small"
              placeholder="Search bookmarks..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon />
                  </InputAdornment>
                )
              }}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
              <Button
                size="small"
                startIcon={<SortIcon />}
                onClick={handleSortClick}
                variant="outlined"
              >
                Sort: {sortBy}
              </Button>

              <Menu
                anchorEl={sortAnchorEl}
                open={Boolean(sortAnchorEl)}
                onClose={() => handleSortClose()}
              >
                <MenuItem onClick={() => handleSortClose('time')}>
                  <TimeIcon sx={{ mr: 1 }} /> Time
                </MenuItem>
                <MenuItem onClick={() => handleSortClose('magnitude')}>
                  <MagnitudeIcon sx={{ mr: 1 }} /> Magnitude
                </MenuItem>
                <MenuItem onClick={() => handleSortClose('location')}>
                  <LocationIcon sx={{ mr: 1 }} /> Location
                </MenuItem>
              </Menu>

              <Button
                size="small"
                onClick={() => setFilterBy(filterBy === 'all' ? 'major' : filterBy === 'major' ? 'recent' : 'all')}
                variant="outlined"
              >
                {filterBy === 'all' ? 'All' : filterBy === 'major' ? 'Major' : 'Recent'}
              </Button>

              {bookmarks.length > 0 && (
                <Button
                  size="small"
                  startIcon={<DownloadIcon />}
                  onClick={exportBookmarks}
                  variant="contained"
                >
                  Export
                </Button>
              )}
            </Box>
          </Grid>
        </Grid>
      </Box>

      {/* Bookmarks List */}
      <Box sx={{ flex: 1, p: 2, pt: 0, overflow: 'auto' }}>
        {bookmarks.length === 0 ? (
          <Card sx={{ textAlign: 'center', py: 8 }}>
            <CardContent>
              <BookmarkIcon sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
              <Typography variant="h6" color="text.secondary" gutterBottom>
                No Bookmarks Yet
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Start bookmarking earthquakes to save them for later reference
              </Typography>
            </CardContent>
          </Card>
        ) : filteredBookmarks.length === 0 ? (
          <Card sx={{ textAlign: 'center', py: 4 }}>
            <CardContent>
              <Typography variant="h6" color="text.secondary">
                No bookmarks match your search
              </Typography>
            </CardContent>
          </Card>
        ) : (
          <Grid container spacing={2}>
            {filteredBookmarks.map((earthquake) => (
              <Grid item xs={12} sm={6} lg={4} key={earthquake.id}>
                <Card sx={{
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  height: '100%',
                  '&:hover': {
                    transform: 'translateY(-2px)',
                    boxShadow: 4
                  }
                }}>
                  <CardContent
                    sx={{ p: 2, height: '100%', display: 'flex', flexDirection: 'column' }}
                    onClick={() => onEarthquakeSelect?.(earthquake)}
                  >
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
                      <Chip
                        size="small"
                        label={`M${earthquake.properties.mag?.toFixed(1) || 'N/A'}`}
                        color={getMagnitudeColor(earthquake.properties.mag)}
                        variant="outlined"
                      />
                      <Button
                        size="small"
                        color="error"
                        onClick={(e) => {
                          e.stopPropagation();
                          removeBookmark(earthquake.id);
                        }}
                        sx={{ minWidth: 'auto', p: 0.5 }}
                      >
                        <DeleteIcon fontSize="small" />
                      </Button>
                    </Box>

                    <Typography variant="h6" sx={{ fontSize: 14, fontWeight: 600, mb: 1, flex: 1 }}>
                      {earthquake.properties.place || 'Unknown location'}
                    </Typography>

                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                        <LocationIcon sx={{ fontSize: 14 }} color="action" />
                        <Typography variant="caption" color="text.secondary">
                          {earthquake.geometry.coordinates[1].toFixed(2)}°, {earthquake.geometry.coordinates[0].toFixed(2)}°
                        </Typography>
                      </Box>

                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                        <TimeIcon sx={{ fontSize: 14 }} color="action" />
                        <Typography variant="caption" color="text.secondary">
                          {earthquake.properties.time ?
                            new Date(earthquake.properties.time).toLocaleDateString() :
                            'Unknown date'
                          }
                        </Typography>
                      </Box>

                      <Typography variant="caption" color="text.secondary">
                        Depth: {Math.abs(earthquake.geometry?.coordinates?.[2] || 0).toFixed(1)} km
                      </Typography>

                      {earthquake.properties.felt > 0 && (
                        <Typography variant="caption" color="primary.main">
                          {earthquake.properties.felt} felt reports
                        </Typography>
                      )}
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        )}
      </Box>
    </Box>
  );
};

export default BookmarksPage;