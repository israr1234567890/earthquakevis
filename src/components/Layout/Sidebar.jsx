/**
 * Modern Sidebar Navigation Component
 */

import React from "react";
import {
  Drawer,
  Box,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Typography,
  Divider,
  IconButton,
  Badge,
  useTheme,
  useMediaQuery,
  Tooltip,
  Avatar,
} from "@mui/material";
import DashboardIcon from "@mui/icons-material/Dashboard";
import AnalyticsIcon from "@mui/icons-material/Analytics";
import MapIcon from "@mui/icons-material/Map";
import BookmarkIcon from "@mui/icons-material/Bookmark";
import SearchIcon from "@mui/icons-material/Search";
import SettingsIcon from "@mui/icons-material/Settings";

import PublicIcon from "@mui/icons-material/Public";
import MenuOpenIcon from "@mui/icons-material/MenuOpen";
import MenuIcon from "@mui/icons-material/Menu";

import { useAppSelector } from "../../app/hooks.js";

const SIDEBAR_WIDTH = 280;
const SIDEBAR_WIDTH_COLLAPSED = 72;

const navigationItems = [
  {
    id: "dashboard",
    label: "Dashboard",
    icon: <DashboardIcon />,
    description: "Live earthquake monitoring",
  },
  {
    id: "map",
    label: "Interactive Map",
    icon: <MapIcon />,
    description: "Global earthquake visualization",
  },
  {
    id: "analytics",
    label: "Analytics",
    icon: <AnalyticsIcon />,
    description: "Charts and statistics",
  },
  {
    id: "search",
    label: "Search & Filter",
    icon: <SearchIcon />,
    description: "Find specific earthquakes",
  },
  {
    id: "bookmarks",
    label: "Bookmarks",
    icon: <BookmarkIcon />,
    description: "Saved earthquakes",
  },
];

const secondaryItems = [
  {
    id: "settings",
    label: "Settings",
    icon: <SettingsIcon />,
    description: "App preferences",
  },
];

const Sidebar = ({
  open,
  onClose,
  currentPage,
  onPageChange,
  collapsed = false,
  onToggleCollapsed,
  bookmarkCount = 0,
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  // Get statistics for badges
  const earthquakes = useAppSelector((state) => state.earthquakes);
  const filters = useAppSelector((state) => state.filters);
  const activeFilterCount = filters.activeFilterCount || 0;

  const sidebarWidth = collapsed ? SIDEBAR_WIDTH_COLLAPSED : SIDEBAR_WIDTH;

  const handleItemClick = (itemId) => {
    onPageChange(itemId);
    if (isMobile) {
      onClose();
    }
  };

  const renderNavigationItem = (item) => {
    const isActive = currentPage === item.id;

    // Determine badge content
    let badgeContent = null;
    if (item.id === "bookmarks" && bookmarkCount > 0) {
      badgeContent = bookmarkCount;
    }
    if (item.id === "search" && activeFilterCount > 0) {
      badgeContent = activeFilterCount;
    }

    const listItem = (
      <ListItem key={item.id} disablePadding>
        <ListItemButton
          onClick={() => handleItemClick(item.id)}
          selected={isActive}
          sx={{
            minHeight: 48,
            justifyContent: collapsed ? "center" : "initial",
            px: 2.5,
            borderRadius: 2,
            mx: 1,
            mb: 0.5,
            "&.Mui-selected": {
              bgcolor: "primary.main",
              color: "primary.contrastText",
              "&:hover": {
                bgcolor: "primary.dark",
              },
              "& .MuiListItemIcon-root": {
                color: "primary.contrastText",
              },
            },
            "&:hover": {
              bgcolor: isActive ? "primary.main" : "action.hover",
            },
          }}
        >
          <ListItemIcon
            sx={{
              minWidth: 0,
              mr: collapsed ? 0 : 3,
              justifyContent: "center",
              color: isActive ? "inherit" : "text.secondary",
            }}
          >
            <Badge badgeContent={badgeContent} color="error">
              {item.icon}
            </Badge>
          </ListItemIcon>

          {!collapsed && (
            <ListItemText
              primary={item.label}
              secondary={item.description}
              primaryTypographyProps={{
                fontSize: 14,
                fontWeight: isActive ? 600 : 500,
              }}
              secondaryTypographyProps={{
                fontSize: 12,
                opacity: isActive ? 0.9 : 0.7,
                color: isActive ? "inherit" : "text.secondary",
              }}
            />
          )}
        </ListItemButton>
      </ListItem>
    );

    if (collapsed) {
      return (
        <Tooltip key={item.id} title={item.label} placement="right" arrow>
          {listItem}
        </Tooltip>
      );
    }

    return listItem;
  };

  const sidebarContent = (
    <Box
      sx={{
        height: "100%",
        display: "flex",
        flexDirection: "column",
        bgcolor: "background.paper",
        overflow: "hidden",
      }}
    >
      {/* Header */}
      {!collapsed && (
        <Box
          sx={{
            p: 2,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            minHeight: 64,
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <Avatar sx={{ bgcolor: "primary.main", width: 32, height: 32 }}>
              <PublicIcon fontSize="small" />
            </Avatar>
            <Box>
              <Typography variant="h6" sx={{ fontSize: 16, fontWeight: 700 }}>
                EarthquakeViz
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Real-time monitoring
              </Typography>
            </Box>
          </Box>

          {!isMobile && (
            <Tooltip title="Collapse sidebar">
              <IconButton
                onClick={onToggleCollapsed}
                size="small"
                sx={{
                  color: "text.secondary",
                  "&:hover": {
                    color: "text.primary",
                    bgcolor: "action.hover",
                  },
                }}
              >
                <MenuOpenIcon />
              </IconButton>
            </Tooltip>
          )}
        </Box>
      )}

      {/* Collapsed Header - Toggle Button Only */}
      {collapsed && !isMobile && (
        <Box
          sx={{
            p: 1,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            minHeight: 64,
          }}
        >
          <Tooltip title="Expand sidebar">
            <IconButton
              onClick={onToggleCollapsed}
              size="small"
              sx={{
                color: "text.secondary",
                "&:hover": {
                  color: "text.primary",
                  bgcolor: "action.hover",
                },
              }}
            >
              <MenuIcon />
            </IconButton>
          </Tooltip>
        </Box>
      )}

      <Divider />

      {/* Main Navigation */}
      <Box
        className="scrollbar-minimal"
        sx={{ flex: 1, py: 1, overflow: "auto" }}
      >
        <List component="nav" sx={{ px: 0 }}>
          {navigationItems.map(renderNavigationItem)}
        </List>
      </Box>

      {/* Settings at Bottom */}
      <Box sx={{ mt: "auto" }}>
        <Divider sx={{ mx: 2, mb: 1 }} />
        <List component="nav" sx={{ px: 0, pb: 1 }}>
          {secondaryItems.map(renderNavigationItem)}
        </List>
      </Box>
    </Box>
  );

  if (isMobile) {
    return (
      <Drawer
        anchor="left"
        open={open}
        onClose={onClose}
        ModalProps={{ keepMounted: true }}
        PaperProps={{
          sx: {
            width: SIDEBAR_WIDTH,
            bgcolor: "background.paper",
          },
        }}
      >
        {sidebarContent}
      </Drawer>
    );
  }

  return (
    <Drawer
      variant="permanent"
      anchor="left"
      PaperProps={{
        sx: {
          width: sidebarWidth,
          bgcolor: "background.paper",
          borderRight: 1,
          borderColor: "divider",
          transition: theme.transitions.create("width", {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.enteringScreen,
          }),
        },
      }}
    >
      {sidebarContent}
    </Drawer>
  );
};

export default Sidebar;
