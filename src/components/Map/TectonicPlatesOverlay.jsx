/**
 * Tectonic Plates Overlay Component
 * Educational overlay showing tectonic plate boundaries for geology students
 */

import React, { useEffect, useState } from "react";
import { GeoJSON, useMap } from "react-leaflet";
import {
  Box,
  Paper,
  Typography,
  Chip,
  IconButton,
  Tooltip,
  Collapse,
} from "@mui/material";
import {
  Info as InfoIcon,
  ExpandLess as ExpandLessIcon,
  ExpandMore as ExpandMoreIcon,
} from "@mui/icons-material";
import L from "leaflet";
import { MAGNITUDE_COLORS } from "../../utils/constants.js";

const TectonicPlatesOverlay = ({ visible = true }) => {
  const map = useMap();
  const [platesData, setPlatesData] = useState(null);
  const [legendExpanded, setLegendExpanded] = useState(true);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Load tectonic plates GeoJSON
  useEffect(() => {
    const loadPlatesData = async () => {
      try {
        setLoading(true);
        const response = await fetch("/data/tectonic-plates.geojson");
        if (!response.ok) {
          throw new Error("Failed to load tectonic plates data");
        }
        const data = await response.json();
        setPlatesData(data);
        setError(null);
      } catch (err) {
        console.error("Error loading tectonic plates:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    loadPlatesData();
  }, []);

  // Style function for plate boundaries
  const getPlateStyle = (feature) => {
    const boundaryType = feature.properties.type;
    const color = feature.properties.color;

    const styles = {
      Convergent: {
        color: color || "#DC143C",
        weight: 3,
        opacity: 0.8,
        dashArray: "10, 5",
        lineCap: "round",
      },
      Divergent: {
        color: color || "#4169E1",
        weight: 3,
        opacity: 0.8,
        dashArray: "5, 10",
        lineCap: "round",
      },
      Transform: {
        color: color || "#FFD700",
        weight: 3,
        opacity: 0.8,
        dashArray: "15, 5, 5, 5",
        lineCap: "round",
      },
    };

    return styles[boundaryType] || { color: "#666", weight: 2, opacity: 0.6 };
  };

  // Event handlers for interactivity
  const onEachFeature = (feature, layer) => {
    const { name, type, description } = feature.properties;

    // Create popup content
    const popupContent = `
      <div style="min-width: 200px;">
        <h3 style="margin: 0 0 8px 0; font-size: 14px; font-weight: 600;">
          ${name}
        </h3>
        <p style="margin: 4px 0; font-size: 12px;">
          <strong>Type:</strong> ${type} Boundary
        </p>
        <p style="margin: 4px 0 0 0; font-size: 12px; color: #666;">
          ${description}
        </p>
      </div>
    `;

    layer.bindPopup(popupContent, {
      maxWidth: 300,
      closeButton: true,
    });

    // Highlight on hover
    layer.on({
      mouseover: (e) => {
        const layer = e.target;
        layer.setStyle({
          weight: 5,
          opacity: 1,
        });
        layer.bringToFront();
      },
      mouseout: (e) => {
        const layer = e.target;
        layer.setStyle(getPlateStyle(feature));
      },
      click: (e) => {
        map.fitBounds(e.target.getBounds(), { padding: [50, 50] });
      },
    });
  };

  return (
    <>
      {/* GeoJSON Layer - only show when visible and data is loaded */}
      {visible && !loading && !error && platesData && (
        <GeoJSON
          data={platesData}
          style={getPlateStyle}
          onEachFeature={onEachFeature}
        />
      )}

      {/* Educational Legend */}
      <Box
        sx={{
          position: "absolute",
          bottom: 16,
          left: 16,
          zIndex: 1000,
          maxWidth: 350,
          minWidth: 280,
        }}
      >
        <Paper
          elevation={3}
          sx={{
            p: 2.5,
            bgcolor: "background.paper",
            backdropFilter: "blur(10px)",
            borderRadius: 2,
            maxHeight: "70vh",
            overflow: "auto",
          }}
        >
          {/* Legend Header */}
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              mb: legendExpanded ? 1 : 0,
            }}
          >
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <InfoIcon color="primary" fontSize="small" />
              <Typography variant="subtitle2" fontWeight={600}>
                Tectonic Boundaries
              </Typography>
            </Box>
            <IconButton
              size="small"
              onClick={() => setLegendExpanded(!legendExpanded)}
            >
              {legendExpanded ? <ExpandLessIcon /> : <ExpandMoreIcon />}
            </IconButton>
          </Box>

          {/* Legend Content */}
          <Collapse in={legendExpanded}>
            <Box
              sx={{ display: "flex", flexDirection: "column", gap: 2, mt: 1.5 }}
            >
              {/* Show tectonic boundaries info only when visible and data loaded */}
              {visible && !loading && !error && platesData && (
                <>
                  {/* Convergent Boundaries */}
                  <Box>
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: 1.5,
                        mb: 1,
                      }}
                    >
                      <Box
                        sx={{
                          width: 40,
                          height: 3,
                          bgcolor: "#DC143C",
                          borderRadius: 1,
                          backgroundImage:
                            "repeating-linear-gradient(90deg, #DC143C 0px, #DC143C 10px, transparent 10px, transparent 15px)",
                          flexShrink: 0,
                        }}
                      />
                      <Typography variant="body2" fontWeight={600}>
                        Convergent
                      </Typography>
                    </Box>
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{
                        fontSize: "0.8rem",
                        lineHeight: 1.4,
                        ml: 0.5,
                      }}
                    >
                      Plates collide. Subduction zones & mountains. Deep &
                      powerful earthquakes.
                    </Typography>
                  </Box>

                  {/* Divergent Boundaries */}
                  <Box>
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: 1.5,
                        mb: 1,
                      }}
                    >
                      <Box
                        sx={{
                          width: 40,
                          height: 3,
                          bgcolor: "#4169E1",
                          borderRadius: 1,
                          backgroundImage:
                            "repeating-linear-gradient(90deg, #4169E1 0px, #4169E1 5px, transparent 5px, transparent 15px)",
                          flexShrink: 0,
                        }}
                      />
                      <Typography variant="body2" fontWeight={600}>
                        Divergent
                      </Typography>
                    </Box>
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{
                        fontSize: "0.8rem",
                        lineHeight: 1.4,
                        ml: 0.5,
                      }}
                    >
                      Plates separate. Mid-ocean ridges. Minor earthquakes, new
                      crust forms.
                    </Typography>
                  </Box>

                  {/* Transform Boundaries */}
                  <Box>
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: 1.5,
                        mb: 1,
                      }}
                    >
                      <Box
                        sx={{
                          width: 40,
                          height: 3,
                          bgcolor: "#FFD700",
                          borderRadius: 1,
                          backgroundImage:
                            "repeating-linear-gradient(90deg, #FFD700 0px, #FFD700 15px, transparent 15px, transparent 20px, #FFD700 20px, #FFD700 25px, transparent 25px, transparent 30px)",
                          flexShrink: 0,
                        }}
                      />
                      <Typography variant="body2" fontWeight={600}>
                        Transform
                      </Typography>
                    </Box>
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{
                        fontSize: "0.8rem",
                        lineHeight: 1.4,
                        ml: 0.5,
                      }}
                    >
                      Plates slide past each other. Frequent shallow
                      earthquakes. Ex: San Andreas Fault.
                    </Typography>
                  </Box>
                </>
              )}

              {/* Magnitude Scale Section */}
              <Box
                sx={{
                  mt: 2,
                  pt: 2,
                  borderTop: "1px solid",
                  borderColor: "divider",
                }}
              >
                <Typography
                  variant="subtitle2"
                  fontWeight={600}
                  sx={{ mb: 1.5 }}
                >
                  Magnitude Scale
                </Typography>
                <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
                  {[
                    {
                      range: "< 3.0",
                      color: MAGNITUDE_COLORS.MINOR,
                      label: "Minor",
                    },
                    {
                      range: "3.0 - 4.9",
                      color: MAGNITUDE_COLORS.LIGHT,
                      label: "Light",
                    },
                    {
                      range: "5.0 - 5.9",
                      color: MAGNITUDE_COLORS.MODERATE,
                      label: "Moderate",
                    },
                    {
                      range: "6.0 - 6.9",
                      color: MAGNITUDE_COLORS.STRONG,
                      label: "Strong",
                    },
                    {
                      range: "7.0+",
                      color: MAGNITUDE_COLORS.MAJOR,
                      label: "Major",
                    },
                  ].map((item, index) => (
                    <Box
                      key={index}
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: 1.5,
                      }}
                    >
                      <Box
                        sx={{
                          width: 16,
                          height: 16,
                          borderRadius: "50%",
                          bgcolor: item.color,
                          border: "2px solid white",
                          boxShadow: "0 1px 3px rgba(0,0,0,0.3)",
                          flexShrink: 0,
                        }}
                      />
                      <Typography
                        variant="body2"
                        sx={{ fontSize: "0.8rem", lineHeight: 1.3 }}
                      >
                        <strong>{item.range}</strong> - {item.label}
                      </Typography>
                    </Box>
                  ))}
                </Box>
                <Typography
                  variant="caption"
                  color="text.secondary"
                  sx={{
                    fontSize: "0.75rem",
                    mt: 1.5,
                    display: "block",
                    fontStyle: "italic",
                  }}
                >
                  Circle size indicates magnitude strength
                </Typography>
              </Box>

              {/* Educational Note - only show when tectonic plates are visible */}
              {visible && !loading && !error && platesData && (
                <Box
                  sx={{
                    mt: 2,
                    p: 1.5,
                    bgcolor: "primary.main",
                    color: "primary.contrastText",
                    borderRadius: 1,
                  }}
                >
                  <Typography
                    variant="body2"
                    sx={{ fontSize: "0.8rem", fontWeight: 500 }}
                  >
                    💡 Click on any boundary line to zoom in and learn more
                    about it!
                  </Typography>
                </Box>
              )}
            </Box>
          </Collapse>
        </Paper>
      </Box>
    </>
  );
};

export default TectonicPlatesOverlay;
