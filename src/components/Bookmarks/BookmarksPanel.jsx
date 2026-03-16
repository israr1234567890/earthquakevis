/**
 * Bookmarks Management Panel
 */

import React, { useState, useEffect } from 'react';
import {
  Drawer,
  Box,
  Typography,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
  Chip,
  Button,
  Divider,
  TextField,
  InputAdornment,
  Menu,
  MenuItem,
  Card,
  CardContent,
  useTheme,
  useMediaQuery,
  Tooltip,
  Alert
} from '@mui/material';
import {
  Bookmark as BookmarkIcon,
  Delete as DeleteIcon,
  Search as SearchIcon,
  Sort as SortIcon,
  Share as ShareIcon,
  LocationOn as LocationIcon,
  AccessTime as TimeIcon,
  TrendingUp as MagnitudeIcon,
  Close as CloseIcon,
  Download as DownloadIcon,
  FilterList as FilterIcon
} from '@mui/icons-material';

const BookmarksPanel = ({ open, onClose, onSelectEarthquake }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const [bookmarks, setBookmarks] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('earthquakeApp.bookmarks') || '[]');
    } catch {
      return [];
    }
  });

  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('time'); // 'time', 'magnitude', 'location'
  const [sortAnchorEl, setSortAnchorEl] = useState(null);
  const [filterBy, setFilterBy] = useState('all'); // 'all', 'major', 'recent'

  // Save bookmarks to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('earthquakeApp.bookmarks', JSON.stringify(bookmarks));
  }, [bookmarks]);

  // Filter and sort bookmarks
  const filteredBookmarks = bookmarks
    .filter(bookmark => {
      // Search filter
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
      // Category filter
      switch (filterBy) {
        case 'major':
          return bookmark.properties.mag >= 6;
        case 'recent':
          return Date.now() - bookmark.properties.time < 24 * 60 * 60 * 1000; // Last 24 hours
        default:
          return true;
      }
    })
    .sort((a, b) => {
      // Sort
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

  const addBookmark = (earthquake) => {
    if (bookmarks.some(b => b.id === earthquake.id)) return;
    setBookmarks(prev => [...prev, { ...earthquake, bookmarkedAt: Date.now() }]);
  };

  const removeBookmark = (earthquakeId) => {
    setBookmarks(prev => prev.filter(b => b.id !== earthquakeId));
  };

  const isBookmarked = (earthquakeId) => {
    return bookmarks.some(b => b.id === earthquakeId);
  };

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
    <Drawer
      anchor="right"
      open={open}
      onClose={onClose}
      PaperProps={{
        sx: {
          width: isMobile ? '100vw' : 400,
          maxWidth: '100vw'
        }
      }}
    >
      <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
        {/* Header */}
        <Box sx={{
          p: 2,
          borderBottom: 1,
          borderColor: 'divider',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <BookmarkIcon color="primary" />
            <Typography variant="h6">
              Bookmarks ({bookmarks.length})
            </Typography>
          </Box>
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

        {/* Search and Filter Bar */}
        <Box sx={{ p: 2, borderBottom: 1, borderColor: 'divider' }}>
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
            sx={{ mb: 1 }}
          />

          <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
            <Button
              size="small"
              startIcon={<SortIcon />}
              onClick={handleSortClick}
              variant="outlined"
            >
              Sort by {sortBy}
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
              startIcon={<FilterIcon />}
              onClick={(e) => setFilterBy(filterBy === 'all' ? 'major' : filterBy === 'major' ? 'recent' : 'all')}
              variant="outlined"
            >
              {filterBy === 'all' ? 'All' : filterBy === 'major' ? 'Major' : 'Recent'}
            </Button>
          </Box>
        </Box>

        {/* Bookmarks List */}
        <Box sx={{ flex: 1, overflow: 'auto' }}>
          {bookmarks.length === 0 ? (
            <Box sx={{ p: 3, textAlign: 'center' }}>
              <BookmarkIcon sx={{ fontSize: 48, color: 'text.secondary', mb: 2 }} />
              <Typography variant="h6" color="text.secondary" gutterBottom>
                No Bookmarks Yet
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Bookmark earthquakes to save them for later reference
              </Typography>
            </Box>
          ) : filteredBookmarks.length === 0 ? (
            <Box sx={{ p: 3, textAlign: 'center' }}>
              <Typography variant="body1" color="text.secondary">
                No bookmarks match your search
              </Typography>
            </Box>
          ) : (
            <List sx={{ px: 1 }}>
              {filteredBookmarks.map((earthquake, index) => (
                <React.Fragment key={earthquake.id}>
                  <Card sx={{ mb: 1, cursor: 'pointer' }}>
                    <CardContent
                      sx={{ p: 2, '&:last-child': { pb: 2 } }}
                      onClick={() => onSelectEarthquake?.(earthquake)}
                    >
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
                        <Typography variant="subtitle2" sx={{ flex: 1 }}>
                          {earthquake.properties.place || 'Unknown location'}
                        </Typography>
                        <IconButton
                          size="small"
                          onClick={(e) => {
                            e.stopPropagation();
                            removeBookmark(earthquake.id);
                          }}
                          sx={{ ml: 1 }}
                        >
                          <DeleteIcon fontSize="small" />
                        </IconButton>
                      </Box>

                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                        <Chip
                          size="small"
                          label={`M${earthquake.properties.mag?.toFixed(1) || 'N/A'}`}
                          color={getMagnitudeColor(earthquake.properties.mag)}
                          variant="outlined"
                        />
                        <Typography variant="caption" color="text.secondary">
                          {earthquake.properties.time ?
                            new Date(earthquake.properties.time).toLocaleDateString() :
                            'Unknown date'
                          }
                        </Typography>
                      </Box>

                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                        <LocationIcon sx={{ fontSize: 14 }} color="action" />
                        <Typography variant="caption" color="text.secondary">
                          {earthquake.geometry.coordinates[1].toFixed(2)}°, {earthquake.geometry.coordinates[0].toFixed(2)}°
                        </Typography>
                      </Box>
                    </CardContent>
                  </Card>
                </React.Fragment>
              ))}
            </List>
          )}
        </Box>

        {/* Footer Actions */}
        {bookmarks.length > 0 && (
          <Box sx={{ p: 2, borderTop: 1, borderColor: 'divider' }}>
            <Button
              fullWidth
              variant="outlined"
              startIcon={<DownloadIcon />}
              onClick={exportBookmarks}
            >
              Export Bookmarks
            </Button>
          </Box>
        )}
      </Box>
    </Drawer>
  );
};

// Export functions for external use
export const useBookmarks = () => {
  const [bookmarks, setBookmarks] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('earthquakeApp.bookmarks') || '[]');
    } catch {
      return [];
    }
  });

  const addBookmark = (earthquake) => {
    if (bookmarks.some(b => b.id === earthquake.id)) return false;
    const newBookmarks = [...bookmarks, { ...earthquake, bookmarkedAt: Date.now() }];
    setBookmarks(newBookmarks);
    localStorage.setItem('earthquakeApp.bookmarks', JSON.stringify(newBookmarks));
    return true;
  };

  const removeBookmark = (earthquakeId) => {
    const newBookmarks = bookmarks.filter(b => b.id !== earthquakeId);
    setBookmarks(newBookmarks);
    localStorage.setItem('earthquakeApp.bookmarks', JSON.stringify(newBookmarks));
  };

  const toggleBookmark = (earthquake) => {
    const isCurrentlyBookmarked = bookmarks.some(b => b.id === earthquake.id);
    if (isCurrentlyBookmarked) {
      removeBookmark(earthquake.id);
      return false;
    } else {
      return addBookmark(earthquake);
    }
  };

  const isBookmarked = (earthquakeId) => {
    return bookmarks.some(b => b.id === earthquakeId);
  };

  return {
    bookmarks,
    addBookmark,
    removeBookmark,
    toggleBookmark,
    isBookmarked
  };
};

export default BookmarksPanel;