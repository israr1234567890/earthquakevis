/**
 * Main Application Component - Modern Sidebar Layout
 */

import React, { useState, useEffect } from 'react';
import {
  Box,
  useMediaQuery,
  useTheme,
  IconButton,
  AppBar,
  Toolbar,
  Typography,
  Badge,
  Tooltip
} from '@mui/material';
import {
  Menu as MenuIcon,
  DarkMode as DarkModeIcon,
  LightMode as LightModeIcon,
  Notifications as NotificationsIcon,
  Refresh as RefreshIcon
} from '@mui/icons-material';
import { useAppSelector, useAppDispatch } from './app/hooks.js';
import { useGetEarthquakesQuery } from './features/earthquakes/earthquakeAPI.js';
import { updateLastRefresh } from './features/earthquakes/earthquakeSlice.js';
import { useTheme as useCustomTheme } from './contexts/ThemeContext.jsx';
import { useBookmarks } from './components/Bookmarks/BookmarksPanel.jsx';

// Layout Components
import Sidebar from './components/Layout/Sidebar.jsx';

// Pages
import LandingPage from './pages/LandingPage.jsx';
import UserGuidePage from './pages/UserGuidePage.jsx';
import DashboardPage from './pages/DashboardPage.jsx';
import MapPage from './pages/MapPage.jsx';
import AnalyticsPage from './pages/AnalyticsPage.jsx';
import SearchPage from './pages/SearchPage.jsx';
import BookmarksPage from './pages/BookmarksPage.jsx';
import NotificationsPage from './pages/NotificationsPage.jsx';

// Modals and Components
import SettingsDialog from './components/Settings/SettingsDialog.jsx';
import EarthquakeDetailsModal from './components/Details/EarthquakeDetailsModal.jsx';
import NotificationSystem from './components/Notifications/NotificationSystem.jsx';

const SIDEBAR_WIDTH = 280;
const SIDEBAR_WIDTH_COLLAPSED = 72;

/**
 * Main App Component with Modern Sidebar Layout
 */
function App() {
  const theme = useTheme();
  const { isDarkMode, toggleDarkMode } = useCustomTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const dispatch = useAppDispatch();

  // Redux state
  const timePeriod = useAppSelector(state => state.filters.timePeriod);
  const earthquakeUI = useAppSelector(state => state.earthquakes);

  // Handle routing based on current path
  const [showLanding, setShowLanding] = useState(() => {
    const currentPath = window.location.pathname;
    // Show landing page only when at root path "/"
    return currentPath === '/';
  });
  
  const [showUserGuide, setShowUserGuide] = useState(() => {
    const currentPath = window.location.pathname;
    return currentPath === '/guide';
  });
  
  // Local state for layout
  const [sidebarOpen, setSidebarOpen] = useState(!isMobile);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [currentPage, setCurrentPage] = useState('dashboard');

  // Modal states
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [selectedEarthquake, setSelectedEarthquake] = useState(null);
  const [detailsModalOpen, setDetailsModalOpen] = useState(false);

  // Bookmarks hook
  const { bookmarks, toggleBookmark, isBookmarked } = useBookmarks();

  // Fetch earthquake data
  const {
    data: earthquakeData,
    error,
    isLoading,
    refetch
  } = useGetEarthquakesQuery(timePeriod, {
    pollingInterval: earthquakeUI.autoRefresh ? earthquakeUI.refreshInterval : 0,
    refetchOnMountOrArgChange: true,
    refetchOnFocus: true,
    refetchOnReconnect: true
  });

  // Auto-refresh effect
  useEffect(() => {
    if (earthquakeData) {
      dispatch(updateLastRefresh());
    }
  }, [earthquakeData, dispatch]);

  // Handle manual refresh
  const handleRefresh = () => {
    refetch();
    dispatch(updateLastRefresh());
  };

  // Handle earthquake selection
  const handleEarthquakeSelect = (earthquake) => {
    setSelectedEarthquake(earthquake);
    setDetailsModalOpen(true);
  };

  // Handle sidebar toggle (mobile only)
  const handleSidebarToggle = () => {
    setSidebarOpen(!sidebarOpen);
  };

  // Handle page change
  const handlePageChange = (pageId) => {
    setCurrentPage(pageId);
  };

  // Handle get started from landing page
  const handleGetStarted = () => {
    setShowLanding(false);
    setShowUserGuide(false);
    // Update URL to /app
    window.history.pushState({}, '', '/app');
  };

  // Handle show user guide
  const handleShowUserGuide = () => {
    setShowLanding(false);
    setShowUserGuide(true);
    // Update URL to /guide
    window.history.pushState({}, '', '/guide');
  };

  // Handle back to landing from user guide
  const handleBackToLanding = () => {
    setShowUserGuide(false);
    setShowLanding(true);
    // Update URL to /
    window.history.pushState({}, '', '/');
  };

  // Handle browser back/forward navigation
  useEffect(() => {
    const handlePopState = () => {
      const currentPath = window.location.pathname;
      if (currentPath === '/app') {
        setShowLanding(false);
        setShowUserGuide(false);
      } else if (currentPath === '/guide') {
        setShowLanding(false);
        setShowUserGuide(true);
      } else if (currentPath === '/') {
        setShowLanding(true);
        setShowUserGuide(false);
      }
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  // Calculate main content margins
  const getMainContentMargin = () => {
    if (isMobile) return 0;
    return sidebarCollapsed ? SIDEBAR_WIDTH_COLLAPSED : SIDEBAR_WIDTH;
  };

  // Render current page content
  const renderPageContent = () => {
    const commonProps = {
      onEarthquakeSelect: handleEarthquakeSelect
    };

    switch (currentPage) {
      case 'dashboard':
        return <DashboardPage {...commonProps} />;
      case 'map':
        return <MapPage {...commonProps} />;
      case 'analytics':
        return <AnalyticsPage {...commonProps} />;
      case 'search':
        return <SearchPage {...commonProps} />;
      case 'bookmarks':
        return <BookmarksPage {...commonProps} />;
      case 'notifications':
        return <NotificationsPage {...commonProps} />;
      case 'settings':
        setSettingsOpen(true);
        setCurrentPage('dashboard');
        return <DashboardPage {...commonProps} />;
      case 'about':
        // TODO: Implement about page
        return <DashboardPage {...commonProps} />;
      default:
        return <DashboardPage {...commonProps} />;
    }
  };

  // Page titles
  const getPageTitle = () => {
    const titles = {
      dashboard: 'Dashboard',
      map: 'Interactive Map',
      analytics: 'Analytics',
      search: 'Search & Filter',
      bookmarks: 'Bookmarks',
      notifications: 'Notifications',
      settings: 'Settings',
      about: 'About'
    };
    return titles[currentPage] || 'Dashboard';
  };

  // Show landing page if not started
  if (showLanding) {
    return <LandingPage onGetStarted={handleGetStarted} onShowUserGuide={handleShowUserGuide} />;
  }

  // Show user guide page
  if (showUserGuide) {
    return <UserGuidePage onBack={handleBackToLanding} />;
  }

  return (
    <Box sx={{
      display: 'flex',
      height: '100vh',
      bgcolor: 'background.default'
    }}>
      {/* Sidebar */}
      <Sidebar
        open={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        currentPage={currentPage}
        onPageChange={handlePageChange}
        collapsed={sidebarCollapsed && !isMobile}
        onToggleCollapsed={() => setSidebarCollapsed(!sidebarCollapsed)}
        bookmarkCount={bookmarks.length}
      />

      {/* Main Content Area */}
      <Box
        sx={{
          flexGrow: 1,
          display: 'flex',
          flexDirection: 'column',
          marginLeft: isMobile ? 0 : `${getMainContentMargin()}px`,
          transition: theme.transitions.create('margin', {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
          }),
          minWidth: 0,
          height: '100vh'
        }}
      >
        {/* Top App Bar */}
        <AppBar
          position="static"
          elevation={0}
          sx={{
            bgcolor: 'background.paper',
            color: 'text.primary',
            borderBottom: 1,
            borderColor: 'divider',
            zIndex: theme.zIndex.drawer - 1
          }}
        >
          <Toolbar sx={{ minHeight: 64 }}>
            {/* Mobile Menu Button */}
            {isMobile && (
              <IconButton
                edge="start"
                color="inherit"
                onClick={handleSidebarToggle}
                sx={{ mr: 2 }}
              >
                <MenuIcon />
              </IconButton>
            )}

            {/* Page Title */}
            <Typography variant="h6" component="h1" sx={{ flexGrow: 1, fontWeight: 600 }}>
              {getPageTitle()}
            </Typography>

            {/* Action Buttons */}
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              {/* Notifications Badge */}
              <Tooltip title="View notifications">
                <IconButton
                  color="inherit"
                  onClick={() => setCurrentPage('notifications')}
                >
                  <Badge badgeContent={0} color="error">
                    <NotificationsIcon />
                  </Badge>
                </IconButton>
              </Tooltip>

              {/* Refresh Button */}
              <Tooltip title="Refresh data">
                <IconButton
                  color="inherit"
                  onClick={handleRefresh}
                  disabled={isLoading}
                  sx={{
                    animation: isLoading ? 'spin 1s linear infinite' : 'none',
                    '@keyframes spin': {
                      '0%': { transform: 'rotate(0deg)' },
                      '100%': { transform: 'rotate(360deg)' }
                    }
                  }}
                >
                  <RefreshIcon />
                </IconButton>
              </Tooltip>

              {/* Dark Mode Toggle */}
              <Tooltip title={isDarkMode ? 'Switch to light mode' : 'Switch to dark mode'}>
                <IconButton color="inherit" onClick={toggleDarkMode}>
                  {isDarkMode ? <LightModeIcon /> : <DarkModeIcon />}
                </IconButton>
              </Tooltip>
            </Box>
          </Toolbar>
        </AppBar>

        {/* Page Content */}
        <Box
          component="main"
          className="scrollbar-minimal"
          sx={{
            flexGrow: 1,
            overflow: 'auto',
            display: 'flex',
            flexDirection: 'column'
          }}
        >
          {renderPageContent()}
        </Box>
      </Box>

      {/* Modals and Overlays */}

      {/* Settings Dialog */}
      <SettingsDialog
        open={settingsOpen}
        onClose={() => setSettingsOpen(false)}
      />

      {/* Earthquake Details Modal */}
      <EarthquakeDetailsModal
        open={detailsModalOpen}
        onClose={() => setDetailsModalOpen(false)}
        earthquake={selectedEarthquake}
        isBookmarked={selectedEarthquake ? isBookmarked(selectedEarthquake.id) : false}
        onToggleBookmark={toggleBookmark}
      />

      {/* Notification System */}
      <NotificationSystem enabled={true} />

      {/* Mobile Sidebar Overlay */}
      {isMobile && sidebarOpen && (
        <Box
          sx={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            bgcolor: 'rgba(0, 0, 0, 0.5)',
            zIndex: theme.zIndex.drawer - 1
          }}
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </Box>
  );
}

export default App;