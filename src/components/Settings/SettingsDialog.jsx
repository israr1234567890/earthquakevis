/**
 * Settings Dialog Component
 */

import { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
  Switch,
  FormControlLabel,
  FormGroup,
  Divider,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Slider,
  Alert,
  Paper,
  useTheme,
  IconButton,
} from "@mui/material";
import {
  Close as CloseIcon,
  Refresh as RefreshIcon,
  Notifications as NotificationsIcon,
  Map as MapIcon,
  Analytics as AnalyticsIcon,
  Palette as PaletteIcon,
} from "@mui/icons-material";
import { useAppSelector, useAppDispatch } from "../../app/hooks.js";
import { useTheme as useCustomTheme } from "../../contexts/ThemeContext.jsx";

const SettingsDialog = ({ open, onClose }) => {
  const theme = useTheme();
  const { isDarkMode, toggleDarkMode } = useCustomTheme();
  const dispatch = useAppDispatch();

  // Local state for settings
  const [settings, setSettings] = useState({
    autoRefresh: true,
    refreshInterval: 300000, // 5 minutes
    showNotifications: true,
    soundAlerts: false,
    magnitudeThreshold: 5.0,
    showClusters: true,
    animateMarkers: true,
    maxEarthquakes: 1000,
    defaultMapLayer: "openstreetmap",
    showAnalytics: true,
    compactView: false,
  });

  const handleSettingChange = (setting) => (event) => {
    const value =
      event.target.type === "checkbox"
        ? event.target.checked
        : event.target.value;
    setSettings((prev) => ({ ...prev, [setting]: value }));
  };

  const handleSliderChange = (setting) => (event, newValue) => {
    setSettings((prev) => ({ ...prev, [setting]: newValue }));
  };

  const handleSave = () => {
    // Here you would dispatch actions to save settings
    console.log("Saving settings:", settings);
    onClose();
  };

  const handleReset = () => {
    setSettings({
      autoRefresh: true,
      refreshInterval: 300000,
      showNotifications: true,
      soundAlerts: false,
      magnitudeThreshold: 5.0,
      showClusters: true,
      animateMarkers: true,
      maxEarthquakes: 1000,
      defaultMapLayer: "openstreetmap",
      showAnalytics: true,
      compactView: false,
    });
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 2,
          bgcolor: "background.default",
        },
      }}
    >
      <DialogTitle
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <Typography variant="h6" component="h2">
          Application Settings
        </Typography>
        <IconButton
          onClick={onClose}
          size="small"
          sx={{
            color: "text.primary",
            "&:hover": {
              bgcolor: "action.hover",
            },
          }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent>
        <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
          {/* Theme Settings */}
          <Paper sx={{ p: 2, bgcolor: "background.paper" }}>
            <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
              <PaletteIcon sx={{ mr: 1, color: "primary.main" }} />
              <Typography variant="h6">Theme & Appearance</Typography>
            </Box>
            <FormGroup>
              <FormControlLabel
                control={
                  <Switch
                    checked={isDarkMode}
                    onChange={toggleDarkMode}
                    color="primary"
                  />
                }
                label="Dark mode"
              />
            </FormGroup>
          </Paper>

          {/* Data Refresh Settings */}
          <Paper sx={{ p: 2, bgcolor: "background.paper" }}>
            <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
              <RefreshIcon sx={{ mr: 1, color: "primary.main" }} />
              <Typography variant="h6">Data Updates</Typography>
            </Box>
            <FormGroup sx={{ gap: 2 }}>
              <FormControlLabel
                control={
                  <Switch
                    checked={settings.autoRefresh}
                    onChange={handleSettingChange("autoRefresh")}
                    color="primary"
                  />
                }
                label="Auto-refresh data"
              />
              {settings.autoRefresh && (
                <FormControl size="small" sx={{ minWidth: 200 }}>
                  <InputLabel>Refresh interval</InputLabel>
                  <Select
                    value={settings.refreshInterval}
                    label="Refresh interval"
                    onChange={handleSettingChange("refreshInterval")}
                  >
                    <MenuItem value={60000}>1 minute</MenuItem>
                    <MenuItem value={300000}>5 minutes</MenuItem>
                    <MenuItem value={600000}>10 minutes</MenuItem>
                    <MenuItem value={1800000}>30 minutes</MenuItem>
                  </Select>
                </FormControl>
              )}
              <Box>
                <Typography gutterBottom>
                  Maximum earthquakes to display: {settings.maxEarthquakes}
                </Typography>
                <Slider
                  value={settings.maxEarthquakes}
                  onChange={handleSliderChange("maxEarthquakes")}
                  min={100}
                  max={5000}
                  step={100}
                  marks={[
                    { value: 100, label: "100" },
                    { value: 1000, label: "1K" },
                    { value: 5000, label: "5K" },
                  ]}
                  sx={{ maxWidth: 300 }}
                />
              </Box>
            </FormGroup>
          </Paper>

          {/* Map Settings */}
          <Paper sx={{ p: 2, bgcolor: "background.paper" }}>
            <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
              <MapIcon sx={{ mr: 1, color: "primary.main" }} />
              <Typography variant="h6">Map Settings</Typography>
            </Box>
            <FormGroup sx={{ gap: 2 }}>
              <FormControl size="small" sx={{ minWidth: 200 }}>
                <InputLabel>Default map layer</InputLabel>
                <Select
                  value={settings.defaultMapLayer}
                  label="Default map layer"
                  onChange={handleSettingChange("defaultMapLayer")}
                >
                  <MenuItem value="openstreetmap">OpenStreetMap</MenuItem>
                  <MenuItem value="satellite">Satellite</MenuItem>
                  <MenuItem value="terrain">Terrain</MenuItem>
                </Select>
              </FormControl>
              <FormControlLabel
                control={
                  <Switch
                    checked={settings.showClusters}
                    onChange={handleSettingChange("showClusters")}
                    color="primary"
                  />
                }
                label="Enable marker clustering"
              />
              <FormControlLabel
                control={
                  <Switch
                    checked={settings.animateMarkers}
                    onChange={handleSettingChange("animateMarkers")}
                    color="primary"
                  />
                }
                label="Animate new earthquakes"
              />
            </FormGroup>
          </Paper>

          {/* Notifications Settings */}
          <Paper sx={{ p: 2, bgcolor: "background.paper" }}>
            <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
              <NotificationsIcon sx={{ mr: 1, color: "primary.main" }} />
              <Typography variant="h6">Notifications & Alerts</Typography>
            </Box>
            <FormGroup sx={{ gap: 2 }}>
              <FormControlLabel
                control={
                  <Switch
                    checked={settings.showNotifications}
                    onChange={handleSettingChange("showNotifications")}
                    color="primary"
                  />
                }
                label="Show notifications"
              />
              <FormControlLabel
                control={
                  <Switch
                    checked={settings.soundAlerts}
                    onChange={handleSettingChange("soundAlerts")}
                    color="primary"
                  />
                }
                label="Sound alerts"
              />
              <Box>
                <Typography gutterBottom>
                  Alert threshold magnitude: {settings.magnitudeThreshold}
                </Typography>
                <Slider
                  value={settings.magnitudeThreshold}
                  onChange={handleSliderChange("magnitudeThreshold")}
                  min={3.0}
                  max={8.0}
                  step={0.5}
                  marks={[
                    { value: 3.0, label: "3.0" },
                    { value: 5.0, label: "5.0" },
                    { value: 7.0, label: "7.0" },
                    { value: 8.0, label: "8.0" },
                  ]}
                  sx={{ maxWidth: 300 }}
                />
              </Box>
            </FormGroup>
          </Paper>

          {/* Analytics Settings */}
          <Paper sx={{ p: 2, bgcolor: "background.paper" }}>
            <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
              <AnalyticsIcon sx={{ mr: 1, color: "primary.main" }} />
              <Typography variant="h6">Analytics & Features</Typography>
            </Box>
            <FormGroup>
              <FormControlLabel
                control={
                  <Switch
                    checked={settings.showAnalytics}
                    onChange={handleSettingChange("showAnalytics")}
                    color="primary"
                  />
                }
                label="Show analytics dashboard"
              />
            </FormGroup>
          </Paper>

          <Alert severity="info" sx={{ mt: 2 }}>
            Settings are stored locally in your browser and will persist between
            sessions.
          </Alert>
        </Box>
      </DialogContent>

      <DialogActions sx={{ px: 3, pb: 2 }}>
        <Button onClick={handleReset} color="secondary">
          Reset to Defaults
        </Button>
        <Button onClick={onClose}>Cancel</Button>
        <Button onClick={handleSave} variant="contained">
          Save Settings
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default SettingsDialog;
