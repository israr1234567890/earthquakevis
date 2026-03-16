/**
 * Earthquake Details Panel Component
 */

import React from "react";
import {
  Paper,
  Typography,
  Box,
  IconButton,
  Divider,
  Chip,
  Button,
  Card,
  CardContent,
  Grid,
  useTheme,
} from "@mui/material";
import {
  Close as CloseIcon,
  LocationOn as LocationIcon,
  AccessTime as TimeIcon,
  Speed as SpeedIcon,
  Terrain as TerrainIcon,
  OpenInNew as OpenInNewIcon,
  Share as ShareIcon,
  Favorite as FavoriteIcon,
  FavoriteBorder as FavoriteBorderIcon,
} from "@mui/icons-material";
import { useAppSelector, useAppDispatch } from "../../app/hooks.js";
import { clearSelection } from "../../features/earthquakes/earthquakeSlice.js";
import {
  formatMagnitude,
  formatDateTime,
  formatLocation,
  formatDepth,
} from "../../utils/formatters.js";
import {
  getMagnitudeColor,
  getMagnitudeSeverity,
} from "../../utils/calculations.js";

const DetailsPanel = () => {
  const theme = useTheme();
  const dispatch = useAppDispatch();
  const { selectedEarthquake, isDetailsOpen } = useAppSelector(
    (state) => state.earthquakes
  );

  if (!isDetailsOpen || !selectedEarthquake) {
    return null;
  }

  const { properties, coordinates, id } = selectedEarthquake;
  const magnitude = properties.mag || 0;
  const location = properties.place || "Unknown location";
  const time = properties.time;
  const depth = coordinates.depth || 0;
  const magnitudeColor = getMagnitudeColor(magnitude);
  const severity = getMagnitudeSeverity(magnitude);

  const handleClose = () => {
    dispatch(clearSelection());
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: `M${formatMagnitude(magnitude)} Earthquake`,
        text: `${formatLocation(location)} - ${formatDateTime(time)}`,
        url: window.location.href,
      });
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(
        `M${formatMagnitude(magnitude)} Earthquake: ${formatLocation(
          location
        )} - ${formatDateTime(time)}`
      );
    }
  };

  const detailItems = [
    {
      icon: <SpeedIcon />,
      label: "Magnitude",
      value: formatMagnitude(magnitude),
      color: magnitudeColor,
      extra: severity,
    },
    {
      icon: <LocationIcon />,
      label: "Location",
      value: formatLocation(location),
      extra: `${coordinates.lat.toFixed(3)}°, ${coordinates.lng.toFixed(3)}°`,
    },
    {
      icon: <TimeIcon />,
      label: "Time",
      value: formatDateTime(time),
      extra: new Date(time).toLocaleDateString(),
    },
    {
      icon: <TerrainIcon />,
      label: "Depth",
      value: formatDepth(depth),
      extra: depth < 70 ? "Shallow" : depth < 300 ? "Intermediate" : "Deep",
    },
  ];

  return (
    <Paper
      elevation={3}
      className="scrollbar-minimal"
      sx={{
        height: "fit-content",
        position: "sticky",
        top: 80,
        maxHeight: "calc(100vh - 100px)",
        overflow: "auto",
      }}
    >
      {/* Header */}
      <Box
        sx={{
          p: 2,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          bgcolor: "primary.main",
          color: "white",
        }}
      >
        <Typography variant="h6" sx={{ fontWeight: 600 }}>
          Earthquake Details
        </Typography>
        <IconButton onClick={handleClose} size="small" sx={{ color: "white" }}>
          <CloseIcon />
        </IconButton>
      </Box>

      <Box sx={{ p: 2 }}>
        {/* Magnitude Badge */}
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            mb: 2,
          }}
        >
          <Chip
            label={`M ${formatMagnitude(magnitude)}`}
            sx={{
              bgcolor: magnitudeColor,
              color: "white",
              fontSize: "1.2rem",
              fontWeight: 700,
              height: 40,
              px: 2,
            }}
          />
          <Chip
            label={severity}
            variant="outlined"
            size="small"
            sx={{ ml: 1 }}
          />
        </Box>

        {/* Main Details */}
        <Grid container spacing={2} sx={{ mb: 2 }}>
          {detailItems.map((item, index) => (
            <Grid item xs={12} key={index}>
              <Card variant="outlined" sx={{ p: 1.5 }}>
                <Box
                  sx={{ display: "flex", alignItems: "flex-start", gap: 1.5 }}
                >
                  <Box
                    sx={{
                      color: item.color || "primary.main",
                      mt: 0.5,
                    }}
                  >
                    {item.icon}
                  </Box>
                  <Box sx={{ flex: 1 }}>
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{ mb: 0.5 }}
                    >
                      {item.label}
                    </Typography>
                    <Typography
                      variant="body1"
                      sx={{
                        fontWeight: 600,
                        color: item.color || "text.primary",
                        mb: item.extra ? 0.5 : 0,
                      }}
                    >
                      {item.value}
                    </Typography>
                    {item.extra && (
                      <Typography variant="caption" color="text.secondary">
                        {item.extra}
                      </Typography>
                    )}
                  </Box>
                </Box>
              </Card>
            </Grid>
          ))}
        </Grid>

        {/* Additional Information */}
        {(properties.felt || properties.cdi || properties.mmi) && (
          <>
            <Divider sx={{ my: 2 }} />
            <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 600 }}>
              Impact Information
            </Typography>
            <Grid container spacing={1}>
              {properties.felt && (
                <Grid item xs={6}>
                  <Box
                    sx={{
                      textAlign: "center",
                      p: 1,
                      bgcolor: "grey.50",
                      borderRadius: 1,
                    }}
                  >
                    <Typography variant="h6" color="primary">
                      {properties.felt}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      Felt Reports
                    </Typography>
                  </Box>
                </Grid>
              )}
              {properties.cdi && (
                <Grid item xs={6}>
                  <Box
                    sx={{
                      textAlign: "center",
                      p: 1,
                      bgcolor: "grey.50",
                      borderRadius: 1,
                    }}
                  >
                    <Typography variant="h6" color="primary">
                      {properties.cdi}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      Max Intensity
                    </Typography>
                  </Box>
                </Grid>
              )}
            </Grid>
          </>
        )}

        {/* Actions */}
        <Divider sx={{ my: 2 }} />
        <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
          {properties.url && (
            <Button
              variant="outlined"
              size="small"
              startIcon={<OpenInNewIcon />}
              onClick={() => window.open(properties.url, "_blank")}
              sx={{ flex: 1 }}
            >
              USGS Details
            </Button>
          )}
          <Button
            variant="outlined"
            size="small"
            startIcon={<ShareIcon />}
            onClick={handleShare}
            sx={{ flex: 1 }}
          >
            Share
          </Button>
        </Box>

        {/* Metadata */}
        <Box
          sx={{ mt: 2, pt: 2, borderTop: "1px solid", borderColor: "divider" }}
        >
          <Typography variant="caption" color="text.secondary">
            Event ID: {id}
          </Typography>
          <br />
          <Typography variant="caption" color="text.secondary">
            Data source: USGS Earthquake Hazards Program
          </Typography>
        </Box>
      </Box>
    </Paper>
  );
};

export default DetailsPanel;
