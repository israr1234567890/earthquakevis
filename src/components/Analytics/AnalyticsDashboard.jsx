/**
 * Advanced Analytics Dashboard with Charts
 */

import React, { useMemo } from "react";
import {
  Box,
  Grid,
  Card,
  CardContent,
  CardHeader,
  Typography,
  useTheme,
  Skeleton,
  Paper,
  Chip,
} from "@mui/material";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  Area,
  AreaChart,
  ScatterChart,
  Scatter,
  ZAxis,
  Legend,
} from "recharts";
import { useAppSelector } from "../../app/hooks.js";
import {
  selectFilteredEarthquakes,
  selectEarthquakesByMagnitude,
  selectEarthquakeStatistics,
} from "../../features/earthquakes/earthquakeSelectors.js";

const AnalyticsDashboard = ({ isLoading = false }) => {
  const theme = useTheme();
  const earthquakes = useAppSelector(selectFilteredEarthquakes);
  const earthquakesByMagnitude = useAppSelector(selectEarthquakesByMagnitude);
  const statistics = useAppSelector(selectEarthquakeStatistics);

  // Colors for charts
  const magnitudeColors = {
    minor: theme.palette.success.main,
    light: theme.palette.warning.main,
    moderate: theme.palette.error.main,
    major: theme.palette.error.dark,
  };

  // Prepare data for magnitude distribution chart
  const magnitudeData = useMemo(
    () => [
      {
        name: "Minor (<3.0)",
        value: earthquakesByMagnitude.minor?.length || 0,
        color: magnitudeColors.minor,
      },
      {
        name: "Light (3.0-4.9)",
        value: earthquakesByMagnitude.light?.length || 0,
        color: magnitudeColors.light,
      },
      {
        name: "Moderate (5.0-6.9)",
        value: earthquakesByMagnitude.moderate?.length || 0,
        color: magnitudeColors.moderate,
      },
      {
        name: "Major (≥7.0)",
        value: earthquakesByMagnitude.major?.length || 0,
        color: magnitudeColors.major,
      },
    ],
    [earthquakesByMagnitude, magnitudeColors]
  );

  // Prepare data for depth distribution
  const depthData = useMemo(() => {
    if (!earthquakes.length) return [];

    const ranges = [
      { name: "Shallow (0-70km)", min: 0, max: 70 },
      { name: "Intermediate (70-300km)", min: 70, max: 300 },
      { name: "Deep (>300km)", min: 300, max: Infinity },
    ];

    return ranges.map((range) => ({
      name: range.name,
      count: earthquakes.filter((eq) => {
        const depth = Math.abs(eq.geometry?.coordinates?.[2] || 0);
        return depth >= range.min && depth < range.max;
      }).length,
    }));
  }, [earthquakes]);

  // Prepare data for timeline (last 24 hours in hourly buckets)
  const timelineData = useMemo(() => {
    if (!earthquakes.length) return [];

    const now = Date.now();
    const hours = [];

    // Create 24 hour buckets
    for (let i = 23; i >= 0; i--) {
      const hourStart = now - i * 60 * 60 * 1000;
      const hourEnd = hourStart + 60 * 60 * 1000;
      const label = new Date(hourStart).toLocaleTimeString("en-US", {
        hour: "2-digit",
        hour12: false,
      });

      const count = earthquakes.filter((eq) => {
        const eqTime = eq.properties?.time;
        return eqTime && eqTime >= hourStart && eqTime < hourEnd;
      }).length;

      hours.push({
        time: label,
        count: count,
        timestamp: hourStart,
      });
    }

    return hours;
  }, [earthquakes]);

  // Prepare data for magnitude-depth scatter plot
  const magnitudeDepthData = useMemo(() => {
    if (!earthquakes.length) return [];

    return earthquakes
      .filter((eq) => {
        const mag = eq.properties?.mag;
        const depth = Math.abs(eq.geometry?.coordinates?.[2] || 0);
        return (
          mag !== null &&
          mag !== undefined &&
          depth !== null &&
          depth !== undefined
        );
      })
      .map((eq) => {
        const mag = eq.properties.mag;
        const depth = Math.abs(eq.geometry.coordinates[2]);

        // Determine color based on magnitude
        let fill = theme.palette.success.main;
        if (mag >= 7.0) fill = theme.palette.error.dark;
        else if (mag >= 5.0) fill = theme.palette.error.main;
        else if (mag >= 3.0) fill = theme.palette.warning.main;

        return {
          magnitude: mag,
          depth: depth,
          location: eq.properties.place,
          fill: fill,
          z: mag, // Size of bubble based on magnitude
        };
      })
      .slice(0, 500); // Limit to 500 points for performance
  }, [earthquakes, theme]);

  if (isLoading) {
    return (
      <Box sx={{ mt: 3 }}>
        <Grid container spacing={3}>
          {[1, 2, 3, 4].map((index) => (
            <Grid item xs={12} md={6} key={index}>
              <Card>
                <CardHeader title={<Skeleton width="40%" />} />
                <CardContent>
                  <Skeleton variant="rectangular" height={300} />
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Box>
    );
  }

  if (!earthquakes.length) {
    return (
      <Box sx={{ mt: 3, textAlign: "center", py: 4 }}>
        <Typography variant="h6" color="text.secondary">
          No earthquake data available for analysis
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Try adjusting your filters or time period
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ mt: 3 }}>
      <Grid container spacing={3}>
        {/* Magnitude Distribution Pie Chart */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardHeader
              title="Magnitude Distribution"
              subheader="Distribution by earthquake severity"
            />
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={magnitudeData.filter((d) => d.value > 0)}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, value, percent }) =>
                      `${name}: ${value} (${(percent * 100).toFixed(0)}%)`
                    }
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {magnitudeData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </Grid>

        {/* Depth Distribution Bar Chart */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardHeader
              title="Depth Distribution"
              subheader="Earthquakes by depth categories"
            />
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={depthData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis
                    dataKey="name"
                    tick={{ fontSize: 12 }}
                    angle={-45}
                    textAnchor="end"
                    height={70}
                  />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="count" fill={theme.palette.primary.main} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </Grid>

        {/* Timeline Chart */}
        <Grid item xs={12} md={8}>
          <Card>
            <CardHeader
              title="Activity Timeline"
              subheader="Earthquake frequency over the last 24 hours"
            />
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={timelineData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis
                    dataKey="time"
                    tick={{ fontSize: 11 }}
                    interval="preserveStartEnd"
                  />
                  <YAxis />
                  <Tooltip
                    labelFormatter={(value) => `Time: ${value}`}
                    formatter={(value) => [`${value} earthquakes`, "Count"]}
                  />
                  <Area
                    type="monotone"
                    dataKey="count"
                    stroke={theme.palette.primary.main}
                    fill={theme.palette.primary.light}
                    strokeWidth={2}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </Grid>

        {/* Key Statistics */}
        <Grid item xs={12} md={4}>
          <Card>
            <CardHeader title="Key Insights" />
            <CardContent>
              <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                <Box>
                  <Typography variant="h6" color="primary">
                    {statistics.totalCount}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Total Events
                  </Typography>
                </Box>

                <Box>
                  <Typography variant="h6" color="warning.main">
                    {statistics.averageMagnitude?.toFixed(1) || "N/A"}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Average Magnitude
                  </Typography>
                </Box>

                <Box>
                  <Typography variant="h6" color="error.main">
                    {statistics.maxMagnitude?.toFixed(1) || "N/A"}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Strongest Event
                  </Typography>
                </Box>

                <Box>
                  <Chip
                    label={
                      earthquakesByMagnitude.major?.length > 0
                        ? "High Activity"
                        : earthquakesByMagnitude.moderate?.length > 5
                        ? "Moderate Activity"
                        : "Low Activity"
                    }
                    color={
                      earthquakesByMagnitude.major?.length > 0
                        ? "error"
                        : earthquakesByMagnitude.moderate?.length > 5
                        ? "warning"
                        : "success"
                    }
                    variant="outlined"
                    size="small"
                  />
                  <Typography
                    variant="caption"
                    display="block"
                    sx={{ mt: 0.5 }}
                  >
                    Current Status
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Magnitude-Depth Scatter Plot (Educational) */}
        <Grid item xs={12}>
          <Card>
            <CardHeader
              title="Magnitude vs Depth Analysis"
              subheader="Understanding earthquake depth patterns - Critical for geology students"
              action={
                <Chip
                  label="Educational"
                  size="small"
                  color="primary"
                  variant="outlined"
                  icon={<Typography>📚</Typography>}
                />
              }
            />
            <CardContent>
              <Box
                sx={{
                  mb: 2,
                  p: 1.5,
                  bgcolor: "info.lighter",
                  borderRadius: 1,
                  border: "1px solid",
                  borderColor: "info.main",
                }}
              >
                <Typography
                  variant="body2"
                  color="info.dark"
                  gutterBottom
                  fontWeight={600}
                >
                  💡 What this chart tells you:
                </Typography>
                <Typography
                  variant="caption"
                  color="text.secondary"
                  component="div"
                >
                  • <strong>Shallow earthquakes (0-70km)</strong>: Most common
                  and most damaging. Found at all plate boundaries.
                  <br />• <strong>Intermediate (70-300km)</strong>: Found at
                  subduction zones where oceanic plates dive under continental
                  plates.
                  <br />• <strong>Deep earthquakes (300km+)</strong>: Only occur
                  at subduction zones. Less common but can be very powerful.
                  <br />• <strong>Pattern to observe</strong>: Subduction zones
                  show earthquakes at ALL depths, while transform/divergent
                  boundaries only have shallow earthquakes.
                </Typography>
              </Box>
              <ResponsiveContainer width="100%" height={400}>
                <ScatterChart
                  margin={{ top: 20, right: 20, bottom: 60, left: 60 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis
                    type="number"
                    dataKey="magnitude"
                    name="Magnitude"
                    label={{
                      value: "Magnitude",
                      position: "bottom",
                      offset: 40,
                      style: { fontSize: 14, fontWeight: 600 },
                    }}
                    domain={[0, "auto"]}
                  />
                  <YAxis
                    type="number"
                    dataKey="depth"
                    name="Depth (km)"
                    label={{
                      value: "Depth (km)",
                      angle: -90,
                      position: "insideLeft",
                      offset: 10,
                      style: { fontSize: 14, fontWeight: 600 },
                    }}
                    reversed={true}
                    domain={[0, "auto"]}
                  />
                  <ZAxis type="number" dataKey="z" range={[20, 400]} />
                  <Tooltip
                    cursor={{ strokeDasharray: "3 3" }}
                    content={({ active, payload }) => {
                      if (active && payload && payload.length) {
                        const data = payload[0].payload;
                        return (
                          <Paper sx={{ p: 1.5, bgcolor: "background.paper" }}>
                            <Typography variant="body2" fontWeight={600}>
                              Magnitude: {data.magnitude.toFixed(1)}
                            </Typography>
                            <Typography variant="body2">
                              Depth: {data.depth.toFixed(0)} km
                            </Typography>
                            <Typography
                              variant="caption"
                              color="text.secondary"
                            >
                              {data.location}
                            </Typography>
                          </Paper>
                        );
                      }
                      return null;
                    }}
                  />
                  <Legend
                    verticalAlign="top"
                    height={36}
                    content={() => (
                      <Box
                        sx={{
                          display: "flex",
                          justifyContent: "center",
                          gap: 2,
                          mb: 1,
                        }}
                      >
                        <Box
                          sx={{
                            display: "flex",
                            alignItems: "center",
                            gap: 0.5,
                          }}
                        >
                          <Box
                            sx={{
                              width: 12,
                              height: 12,
                              borderRadius: "50%",
                              bgcolor: theme.palette.success.main,
                            }}
                          />
                          <Typography variant="caption">
                            Minor (&lt;3.0)
                          </Typography>
                        </Box>
                        <Box
                          sx={{
                            display: "flex",
                            alignItems: "center",
                            gap: 0.5,
                          }}
                        >
                          <Box
                            sx={{
                              width: 12,
                              height: 12,
                              borderRadius: "50%",
                              bgcolor: theme.palette.warning.main,
                            }}
                          />
                          <Typography variant="caption">
                            Light (3.0-4.9)
                          </Typography>
                        </Box>
                        <Box
                          sx={{
                            display: "flex",
                            alignItems: "center",
                            gap: 0.5,
                          }}
                        >
                          <Box
                            sx={{
                              width: 12,
                              height: 12,
                              borderRadius: "50%",
                              bgcolor: theme.palette.error.main,
                            }}
                          />
                          <Typography variant="caption">
                            Moderate (5.0-6.9)
                          </Typography>
                        </Box>
                        <Box
                          sx={{
                            display: "flex",
                            alignItems: "center",
                            gap: 0.5,
                          }}
                        >
                          <Box
                            sx={{
                              width: 12,
                              height: 12,
                              borderRadius: "50%",
                              bgcolor: theme.palette.error.dark,
                            }}
                          />
                          <Typography variant="caption">
                            Major (≥7.0)
                          </Typography>
                        </Box>
                      </Box>
                    )}
                  />
                  <Scatter
                    data={magnitudeDepthData}
                    fill={theme.palette.primary.main}
                  >
                    {magnitudeDepthData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.fill} />
                    ))}
                  </Scatter>
                </ScatterChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default AnalyticsDashboard;
