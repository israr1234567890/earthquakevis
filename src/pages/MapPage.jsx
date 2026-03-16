/**
 * Interactive Map Page - Full-screen map view with controls
 */

import { useState } from "react";
import {
  Box,
  Typography,
  Card,
  CardContent,
  IconButton,
  Tooltip,
  Fab,
} from "@mui/material";
import {
  Fullscreen as FullscreenIcon,
  FullscreenExit as FullscreenExitIcon,
  FilterList as FilterIcon,
  Info as InfoIcon,
  Close as CloseIcon,
  Waves as WavesIcon,
} from "@mui/icons-material";
import { useAppSelector } from "../app/hooks.js";
import { useGetEarthquakesQuery } from "../features/earthquakes/earthquakeAPI.js";

import LeafletMap from "../components/Map/LeafletMap.jsx";
import FilterPanel from "../components/Filters/FilterPanel.jsx";
import NearbyEarthquakes from "../components/Location/NearbyEarthquakes.jsx";

const MapPage = ({ onEarthquakeSelect }) => {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [showMapInfo, setShowMapInfo] = useState(true);
  const [showNearbyEarthquakes, setShowNearbyEarthquakes] = useState(true);

  const timePeriod = useAppSelector((state) => state.filters.timePeriod);

  const {
    data: earthquakeData,
    error,
    isLoading,
  } = useGetEarthquakesQuery(timePeriod, {
    pollingInterval: 300000,
    refetchOnMountOrArgChange: true,
    refetchOnFocus: true,
    refetchOnReconnect: true,
  });

  const toggleFullscreen = () => {
    if (!isFullscreen) {
      document.documentElement.requestFullscreen?.();
    } else {
      document.exitFullscreen?.();
    }
    setIsFullscreen(!isFullscreen);
  };

  return (
    <Box
      sx={{
        height: "100%",
        display: "flex",
        flexDirection: "column",
        position: "relative",
      }}
    >
      {/* Page Header */}
      {!isFullscreen && (
        <Box sx={{ p: 2, pb: 0 }}>
          <Typography
            variant="h4"
            sx={{ fontWeight: 700, color: "text.primary" }}
          >
            Interactive Map
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Explore earthquake activity with detailed geographic visualization
          </Typography>
        </Box>
      )}

      {/* Map Container */}
      <Box
        sx={{
          flex: 1,
          display: "flex",
          position: "relative",
          m: isFullscreen ? 0 : 2,
          mt: isFullscreen ? 0 : 1,
          borderRadius: isFullscreen ? 0 : 2,
          overflow: "hidden",
        }}
      >
        {/* Filters Panel */}
        {showFilters && (
          <Card
            sx={{
              width: 320,
              height: "100%",
              zIndex: 1000,
              position: "absolute",
              left: 0,
              top: 0,
            }}
          >
            {/* Filter Panel Header */}
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                p: 2,
                borderBottom: 1,
                borderColor: "divider",
              }}
            >
              <Typography variant="h6" fontWeight={600}>
                Filters
              </Typography>
              <IconButton
                size="small"
                onClick={() => setShowFilters(false)}
                sx={{
                  color: "text.secondary",
                  "&:hover": { color: "text.primary" },
                }}
              >
                <CloseIcon fontSize="small" />
              </IconButton>
            </Box>

            <CardContent
              sx={{ height: "calc(100% - 64px)", overflow: "auto", p: 0 }}
            >
              <FilterPanel />
            </CardContent>
          </Card>
        )}

        {/* Main Map */}
        <Box sx={{ flex: 1, position: "relative" }}>
          <LeafletMap
            height="100%"
            isLoading={isLoading}
            error={error}
            onEarthquakeSelect={onEarthquakeSelect}
          />

          {/* Map Controls */}
          <Box
            sx={{
              position: "absolute",
              top: "50%",
              right: 16,
              transform: "translateY(-50%)",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 1,
              zIndex: 1000,
            }}
          >
            {/* Action Buttons */}
            <Tooltip title={showFilters ? "Hide Filters" : "Show Filters"}>
              <Fab
                size="small"
                color={showFilters ? "primary" : "default"}
                onClick={() => setShowFilters(!showFilters)}
                sx={{
                  bgcolor: showFilters ? "primary.main" : "background.paper",
                  color: showFilters ? "white" : "text.primary",
                  boxShadow: 3,
                  "&:hover": {
                    bgcolor: showFilters ? "primary.dark" : "action.hover",
                  },
                }}
              >
                <FilterIcon />
              </Fab>
            </Tooltip>

            <Tooltip title={showMapInfo ? "Hide Map Info" : "Show Map Info"}>
              <Fab
                size="small"
                color={showMapInfo ? "primary" : "default"}
                onClick={() => setShowMapInfo(!showMapInfo)}
                sx={{
                  bgcolor: showMapInfo ? "primary.main" : "background.paper",
                  color: showMapInfo ? "white" : "text.primary",
                  boxShadow: 3,
                  "&:hover": {
                    bgcolor: showMapInfo ? "primary.dark" : "action.hover",
                  },
                }}
              >
                <InfoIcon />
              </Fab>
            </Tooltip>

            {!showNearbyEarthquakes && (
              <Tooltip title="Show Nearby Earthquakes">
                <Fab
                  size="small"
                  onClick={() => setShowNearbyEarthquakes(true)}
                  sx={{
                    bgcolor: "background.paper",
                    color: "text.primary",
                    boxShadow: 3,
                    "&:hover": {
                      bgcolor: "primary.main",
                      color: "white",
                    },
                  }}
                >
                  <WavesIcon />
                </Fab>
              </Tooltip>
            )}

            <Tooltip title={isFullscreen ? "Exit Fullscreen" : "Fullscreen"}>
              <Fab
                size="small"
                onClick={toggleFullscreen}
                sx={{
                  bgcolor: "background.paper",
                  color: "text.primary",
                  boxShadow: 3,
                  "&:hover": {
                    bgcolor: "primary.main",
                    color: "white",
                  },
                }}
              >
                {isFullscreen ? <FullscreenExitIcon /> : <FullscreenIcon />}
              </Fab>
            </Tooltip>
          </Box>

          {/* Map Info */}
          {!isFullscreen && showMapInfo && (
            <Card
              sx={{
                position: "absolute",
                bottom: 16,
                left: 16,
                zIndex: 1000,
                minWidth: 200,
                bgcolor: "background.paper",
                boxShadow: 3,
              }}
            >
              <CardContent sx={{ p: 2, "&:last-child": { pb: 2 } }}>
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    mb: 1,
                  }}
                >
                  <Typography variant="body2" fontWeight={600}>
                    Map Information
                  </Typography>
                  <IconButton
                    size="small"
                    onClick={() => setShowMapInfo(false)}
                    sx={{
                      ml: 1,
                      color: "text.secondary",
                      "&:hover": { color: "text.primary" },
                    }}
                  >
                    <CloseIcon fontSize="small" />
                  </IconButton>
                </Box>
                <Typography
                  variant="caption"
                  color="text.secondary"
                  display="block"
                >
                  Layer: OpenStreetMap
                </Typography>
                <Typography
                  variant="caption"
                  color="text.secondary"
                  display="block"
                >
                  Total Earthquakes: {earthquakeData?.earthquakes?.length || 0}
                </Typography>
                <Typography
                  variant="caption"
                  color="text.secondary"
                  display="block"
                >
                  Period: {timePeriod}
                </Typography>
              </CardContent>
            </Card>
          )}

          {/* Nearby Earthquakes Panel */}
          {!isFullscreen && showNearbyEarthquakes && (
            <Box
              sx={{
                position: "absolute",
                bottom: 16,
                right: 16,
                zIndex: 1000,
                width: 320,
                maxHeight: "60vh",
                overflow: "auto",
              }}
            >
              <NearbyEarthquakes
                onEarthquakeSelect={onEarthquakeSelect}
                onClose={() => setShowNearbyEarthquakes(false)}
              />
            </Box>
          )}
        </Box>
      </Box>
    </Box>
  );
};

export default MapPage;
