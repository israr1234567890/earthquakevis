/**
 * Landing Page Component
 * Modern landing page with user guide
 */

import React from "react";
import {
  Box,
  Container,
  Typography,
  Button,
  Grid,
  Card,
  CardContent,
  useTheme,
  useMediaQuery,
  Fade,
  Slide,
  Chip,
  Stack,
  Divider,
} from "@mui/material";
import {
  Public as EarthIcon,
  Timeline as AnalyticsIcon,
  Map as MapIcon,
  Notifications as AlertIcon,
  TrendingUp as TrendIcon,
  Security as SafetyIcon,
  PlayArrow as PlayIcon,
} from "@mui/icons-material";
import SimpleGlobe3D from "../components/SimpleGlobe3D";

const LandingPage = ({ onGetStarted, onShowUserGuide }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const isSmallMobile = useMediaQuery(theme.breakpoints.down("sm"));

  // Floating objects animation keyframes
  const floatingAnimation = {
    "@keyframes float1": {
      "0%, 100%": { transform: "translateY(0px) rotate(0deg)" },
      "50%": { transform: "translateY(-20px) rotate(180deg)" },
    },
    "@keyframes float2": {
      "0%, 100%": { transform: "translateY(0px) rotate(0deg)" },
      "50%": { transform: "translateY(-15px) rotate(-180deg)" },
    },
    "@keyframes float3": {
      "0%, 100%": { transform: "translateY(0px) scale(1)" },
      "50%": { transform: "translateY(-25px) scale(1.1)" },
    },
    "@keyframes pulse": {
      "0%, 100%": { opacity: 0.6, transform: "scale(1)" },
      "50%": { opacity: 1, transform: "scale(1.05)" },
    },
    "@keyframes drift": {
      "0%": { transform: "translateX(0px) translateY(0px)" },
      "25%": { transform: "translateX(10px) translateY(-10px)" },
      "50%": { transform: "translateX(-5px) translateY(-20px)" },
      "75%": { transform: "translateX(-10px) translateY(-10px)" },
      "100%": { transform: "translateX(0px) translateY(0px)" },
    },
  };

  const features = [
    {
      icon: <EarthIcon />,
      title: "Real-time Data",
      description: "Live earthquake data from USGS with automatic updates",
      color: "#3b82f6",
    },
    {
      icon: <MapIcon />,
      title: "Interactive Maps",
      description: "Visualize seismic activity on detailed interactive maps",
      color: "#10b981",
    },
    {
      icon: <AnalyticsIcon />,
      title: "Advanced Analytics",
      description: "Comprehensive statistics and trend analysis",
      color: "#8b5cf6",
    },
    {
      icon: <AlertIcon />,
      title: "Smart Alerts",
      description: "Get notified about significant seismic events",
      color: "#f59e0b",
    },
    {
      icon: <TrendIcon />,
      title: "Historical Trends",
      description: "Analyze patterns and trends in earthquake activity",
      color: "#ef4444",
    },
    {
      icon: <SafetyIcon />,
      title: "Educational Focus",
      description: "Perfect for students and seismology enthusiasts",
      color: "#06b6d4",
    },
  ];

  return (
    <Box
      sx={{
        minHeight: "100vh",
        bgcolor: "#fafafa",
        display: "flex",
        flexDirection: "column",
        position: "relative",
        overflow: "hidden",
        ...floatingAnimation,
      }}
    >
      {/* Floating Background Objects - Responsive sizes */}
      <Box
        sx={{
          position: "absolute",
          top: "10%",
          left: "5%",
          width: { xs: 30, sm: 45, md: 60 },
          height: { xs: 30, sm: 45, md: 60 },
          borderRadius: "50%",
          bgcolor: "rgba(59, 130, 246, 0.1)",
          animation: "float1 6s ease-in-out infinite",
          zIndex: 0,
          display: { xs: "none", sm: "block" },
        }}
      />
      <Box
        sx={{
          position: "absolute",
          top: "20%",
          right: "8%",
          width: { xs: 25, sm: 30, md: 40 },
          height: { xs: 25, sm: 30, md: 40 },
          borderRadius: "50%",
          bgcolor: "rgba(16, 185, 129, 0.15)",
          animation: "float2 8s ease-in-out infinite",
          zIndex: 0,
        }}
      />
      <Box
        sx={{
          position: "absolute",
          top: "60%",
          left: "3%",
          width: { xs: 40, sm: 60, md: 80 },
          height: { xs: 40, sm: 60, md: 80 },
          borderRadius: "50%",
          bgcolor: "rgba(139, 92, 246, 0.08)",
          animation: "float3 10s ease-in-out infinite",
          zIndex: 0,
          display: { xs: "none", sm: "block" },
        }}
      />
      <Box
        sx={{
          position: "absolute",
          top: "70%",
          right: "15%",
          width: { xs: 30, sm: 40, md: 50 },
          height: { xs: 30, sm: 40, md: 50 },
          borderRadius: "50%",
          bgcolor: "rgba(245, 158, 11, 0.12)",
          animation: "pulse 4s ease-in-out infinite",
          zIndex: 0,
        }}
      />
      <Box
        sx={{
          position: "absolute",
          top: "40%",
          left: { xs: "80%", md: "85%" },
          width: { xs: 20, sm: 28, md: 35 },
          height: { xs: 20, sm: 28, md: 35 },
          borderRadius: "50%",
          bgcolor: "rgba(239, 68, 68, 0.1)",
          animation: "drift 12s ease-in-out infinite",
          zIndex: 0,
        }}
      />
      <Box
        sx={{
          position: "absolute",
          top: "85%",
          left: "20%",
          width: { xs: 15, sm: 20, md: 25 },
          height: { xs: 15, sm: 20, md: 25 },
          borderRadius: "50%",
          bgcolor: "rgba(6, 182, 212, 0.15)",
          animation: "float1 7s ease-in-out infinite",
          zIndex: 0,
        }}
      />

      {/* Seismic Wave Rings - Responsive */}
      <Box
        sx={{
          position: "absolute",
          top: "15%",
          right: { xs: "15%", md: "25%" },
          width: { xs: 60, sm: 90, md: 120 },
          height: { xs: 60, sm: 90, md: 120 },
          border: "2px solid rgba(59, 130, 246, 0.2)",
          borderRadius: "50%",
          animation: "pulse 8s ease-in-out infinite",
          zIndex: 0,
          display: { xs: "none", sm: "block" },
        }}
      />
      <Box
        sx={{
          position: "absolute",
          top: "75%",
          right: "5%",
          width: { xs: 50, sm: 70, md: 90 },
          height: { xs: 50, sm: 70, md: 90 },
          border: "1px solid rgba(16, 185, 129, 0.25)",
          borderRadius: "50%",
          animation: "float2 9s ease-in-out infinite",
          zIndex: 0,
          display: { xs: "none", sm: "block" },
        }}
      />

      {/* Geometric patterns */}
      <Box
        sx={{
          position: "absolute",
          top: "30%",
          left: "15%",
          width: 0,
          height: 0,
          borderLeft: "15px solid transparent",
          borderRight: "15px solid transparent",
          borderBottom: "25px solid rgba(245, 158, 11, 0.15)",
          animation: "float3 7s ease-in-out infinite",
          zIndex: 0,
        }}
      />
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          right: "30%",
          width: 30,
          height: 30,
          bgcolor: "rgba(139, 92, 246, 0.1)",
          transform: "rotate(45deg)",
          animation: "drift 9s ease-in-out infinite",
          zIndex: 0,
        }}
      />

      {/* Navigation Bar - Mobile Responsive */}
      <Box
        sx={{
          borderBottom: "1px solid #e5e7eb",
          py: { xs: 1.5, sm: 2 },
          position: "sticky",
          top: 0,
          zIndex: 100,
          backdropFilter: "blur(10px)",
          bgcolor: "rgba(255, 255, 255, 0.95)",
        }}
      >
        <Container maxWidth="lg" sx={{ px: { xs: 2, sm: 3 } }}>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: { xs: 1, sm: 2 },
              }}
            >
              <EarthIcon
                sx={{ fontSize: { xs: 24, sm: 28, md: 32 }, color: "#3b82f6" }}
              />
              <Typography
                variant={isSmallMobile ? "subtitle1" : "h6"}
                sx={{
                  fontWeight: 700,
                  color: "#1f2937",
                  fontSize: { xs: "1rem", sm: "1.1rem", md: "1.25rem" },
                  display: {
                    xs: isSmallMobile ? "none" : "block",
                    sm: "block",
                  },
                }}
              >
                Earthquake Visualizer
              </Typography>
              {isSmallMobile && (
                <Typography
                  variant="subtitle2"
                  sx={{ fontWeight: 700, color: "#1f2937" }}
                >
                  EQ Viz
                </Typography>
              )}
            </Box>
            <Button
              variant="contained"
              size="small"
              onClick={onGetStarted}
              sx={{
                bgcolor: "#3b82f6",
                textTransform: "none",
                borderRadius: 1.5,
                px: 2,
                py: 0.75,
                fontSize: "0.8125rem",
                fontWeight: 500,
                "&:hover": { bgcolor: "#2563eb" },
              }}
            >
              Launch
            </Button>
          </Box>
        </Container>
      </Box>

      {/* Hero Section - Mobile Responsive */}
      <Container
        maxWidth="lg"
        sx={{
          py: { xs: 4, sm: 6, md: 8, lg: 12 },
          px: { xs: 2, sm: 3 },
          position: "relative",
          zIndex: 1,
        }}
      >
        <Grid container spacing={{ xs: 4, sm: 6, md: 8 }} alignItems="center">
          <Grid item xs={12} md={6}>
            <Fade in timeout={1000}>
              <div>
                <Stack
                  direction="row"
                  spacing={1}
                  sx={{
                    mb: { xs: 2, sm: 3 },
                    justifyContent: { xs: "center", md: "flex-start" },
                    flexWrap: "wrap",
                    gap: 1,
                  }}
                >
                  <Chip
                    label="Real-time Data"
                    size={isSmallMobile ? "small" : "small"}
                    sx={{
                      bgcolor: "#dbeafe",
                      color: "#1e40af",
                      fontWeight: 500,
                      fontSize: { xs: "0.75rem", sm: "0.8125rem" },
                    }}
                  />
                  <Chip
                    label="Educational"
                    size={isSmallMobile ? "small" : "small"}
                    sx={{
                      bgcolor: "#dcfce7",
                      color: "#166534",
                      fontWeight: 500,
                      fontSize: { xs: "0.75rem", sm: "0.8125rem" },
                    }}
                  />
                </Stack>

                <Typography
                  variant={isSmallMobile ? "h4" : isMobile ? "h3" : "h2"}
                  component="h1"
                  gutterBottom
                  sx={{
                    fontWeight: 800,
                    color: "#111827",
                    mb: { xs: 2, sm: 3 },
                    letterSpacing: "-0.025em",
                    lineHeight: 1.1,
                    textAlign: { xs: "center", md: "left" },
                    fontSize: {
                      xs: "1.75rem",
                      sm: "2.25rem",
                      md: "2.75rem",
                      lg: "3.5rem",
                    },
                  }}
                >
                  Visualize Earth's
                  <Box
                    component="span"
                    sx={{ color: "#3b82f6", display: "block" }}
                  >
                    Seismic Activity
                  </Box>
                </Typography>

                <Typography
                  variant={isSmallMobile ? "body1" : "h6"}
                  paragraph
                  sx={{
                    mb: { xs: 3, sm: 4 },
                    lineHeight: 1.6,
                    color: "#6b7280",
                    fontWeight: 400,
                    maxWidth: { xs: "100%", md: 500 },
                    textAlign: { xs: "center", md: "left" },
                    fontSize: {
                      xs: "1rem",
                      sm: "1.125rem",
                      md: "1.25rem",
                    },
                    px: { xs: 1, sm: 0 },
                  }}
                >
                  Explore real-time earthquake data from USGS with interactive
                  maps, comprehensive analytics, and educational insights for
                  students and researchers.
                </Typography>

                <Stack
                  direction={{ xs: "column", sm: "row" }}
                  spacing={2}
                  sx={{
                    mb: { xs: 4, sm: 6 },
                    alignItems: "center",
                    justifyContent: { xs: "center", md: "flex-start" },
                  }}
                >
                  <Button
                    variant="contained"
                    size={isSmallMobile ? "medium" : "large"}
                    onClick={onGetStarted}
                    startIcon={!isSmallMobile ? <PlayIcon /> : null}
                    sx={{
                      py: { xs: 1.5, sm: 2 },
                      px: { xs: 3, sm: 4 },
                      fontSize: { xs: "0.875rem", sm: "1rem" },
                      fontWeight: 600,
                      borderRadius: 2,
                      bgcolor: "#3b82f6",
                      color: "white",
                      textTransform: "none",
                      boxShadow: "0 4px 14px 0 rgba(59, 130, 246, 0.3)",
                      width: { xs: "100%", sm: "auto" },
                      maxWidth: { xs: "280px", sm: "none" },
                      "&:hover": {
                        bgcolor: "#2563eb",
                        transform: "translateY(-1px)",
                        boxShadow: "0 6px 20px 0 rgba(59, 130, 246, 0.4)",
                      },
                      transition: "all 0.2s ease",
                    }}
                  >
                    Get Started Free
                  </Button>
                  <Button
                    variant="outlined"
                    size={isSmallMobile ? "medium" : "large"}
                    onClick={onShowUserGuide}
                    sx={{
                      py: { xs: 1.5, sm: 2 },
                      px: { xs: 3, sm: 4 },
                      fontSize: { xs: "0.875rem", sm: "1rem" },
                      fontWeight: 600,
                      borderRadius: 2,
                      borderColor: "#d1d5db",
                      color: "#374151",
                      textTransform: "none",
                      width: { xs: "100%", sm: "auto" },
                      maxWidth: { xs: "280px", sm: "none" },
                      "&:hover": {
                        borderColor: "#9ca3af",
                        bgcolor: "#f9fafb",
                      },
                    }}
                  >
                    View Guide
                  </Button>
                </Stack>

                <Stack
                  direction={{ xs: "column", sm: "row" }}
                  spacing={{ xs: 2, sm: 4 }}
                  sx={{
                    color: "#9ca3af",
                    fontSize: { xs: "0.8125rem", sm: "0.875rem" },
                    alignItems: "center",
                    justifyContent: { xs: "center", md: "flex-start" },
                  }}
                >
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <Box
                      sx={{
                        width: { xs: 6, sm: 8 },
                        height: { xs: 6, sm: 8 },
                        borderRadius: "50%",
                        bgcolor: "#10b981",
                      }}
                    />
                    Live USGS Data
                  </Box>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <Box
                      sx={{
                        width: { xs: 6, sm: 8 },
                        height: { xs: 6, sm: 8 },
                        borderRadius: "50%",
                        bgcolor: "#3b82f6",
                      }}
                    />
                    No Registration Required
                  </Box>
                </Stack>
              </div>
            </Fade>
          </Grid>

          <Grid item xs={12} md={6}>
            <Slide direction="left" in timeout={1200}>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  height: { xs: 400, md: 500 },
                  position: "relative",
                }}
              >
                {/* Background decoration with floating elements */}
                <Box
                  sx={{
                    position: "absolute",
                    width: 450,
                    height: 450,
                    borderRadius: "50%",
                  }}
                />

                {/* Floating seismic indicators around globe */}
                <Box
                  sx={{
                    position: "absolute",
                    top: "10%",
                    left: "10%",
                    width: 12,
                    height: 12,
                    borderRadius: "50%",
                    bgcolor: "#ef4444",
                    animation: "pulse 3s ease-in-out infinite",
                    boxShadow: "0 0 20px rgba(239, 68, 68, 0.5)",
                  }}
                />
                <Box
                  sx={{
                    position: "absolute",
                    top: "20%",
                    right: "15%",
                    width: 8,
                    height: 8,
                    borderRadius: "50%",
                    bgcolor: "#f59e0b",
                    animation: "float1 4s ease-in-out infinite",
                    boxShadow: "0 0 15px rgba(245, 158, 11, 0.4)",
                  }}
                />
                <Box
                  sx={{
                    position: "absolute",
                    bottom: "25%",
                    left: "20%",
                    width: 10,
                    height: 10,
                    borderRadius: "50%",
                    bgcolor: "#10b981",
                    animation: "float2 5s ease-in-out infinite",
                    boxShadow: "0 0 18px rgba(16, 185, 129, 0.4)",
                  }}
                />
                <Box
                  sx={{
                    position: "absolute",
                    bottom: "15%",
                    right: "25%",
                    width: 6,
                    height: 6,
                    borderRadius: "50%",
                    bgcolor: "#3b82f6",
                    animation: "drift 6s ease-in-out infinite",
                    boxShadow: "0 0 12px rgba(59, 130, 246, 0.5)",
                  }}
                />

                {/* 3D Globe - Mobile Responsive */}
                <Box
                  sx={{
                    width: { xs: 280, sm: 320, md: 400 },
                    height: { xs: 280, sm: 320, md: 400 },
                    position: "relative",
                    zIndex: 2,
                    overflow: "hidden",
                    borderRadius: "40%",
                    mx: "auto",
                  }}
                >
                  <SimpleGlobe3D />
                </Box>
              </Box>
            </Slide>
          </Grid>
        </Grid>
      </Container>

      {/* Features Section - Mobile Responsive */}
      <Box
        sx={{
          bgcolor: "#fafafa",
          py: { xs: 6, sm: 8, md: 12 },
          position: "relative",
        }}
      >
        {/* Additional floating elements for features section */}
        <Box
          sx={{
            position: "absolute",
            top: "20%",
            left: "2%",
            width: 30,
            height: 30,
            borderRadius: "50%",
            bgcolor: "rgba(139, 92, 246, 0.1)",
            animation: "float3 8s ease-in-out infinite",
            zIndex: 0,
          }}
        />
        <Box
          sx={{
            position: "absolute",
            top: "60%",
            right: "5%",
            width: 45,
            height: 45,
            borderRadius: "50%",
            bgcolor: "rgba(59, 130, 246, 0.08)",
            animation: "pulse 6s ease-in-out infinite",
            zIndex: 0,
          }}
        />
        <Container
          maxWidth="lg"
          sx={{ position: "relative", zIndex: 1, px: { xs: 2, sm: 3 } }}
        >
          <Fade in timeout={1500}>
            <div>
              <Typography
                variant={isSmallMobile ? "h5" : "h4"}
                component="h2"
                textAlign="center"
                gutterBottom
                sx={{
                  mb: { xs: 1, sm: 2 },
                  fontWeight: 700,
                  color: "#111827",
                  fontSize: { xs: "1.5rem", sm: "2rem", md: "2.125rem" },
                }}
              >
                Powerful Features
              </Typography>
              <Typography
                variant="body1"
                textAlign="center"
                sx={{
                  mb: { xs: 4, sm: 6, md: 8 },
                  color: "#6b7280",
                  maxWidth: { xs: "100%", sm: 600 },
                  mx: "auto",
                  fontSize: { xs: "0.875rem", sm: "1rem" },
                  px: { xs: 2, sm: 0 },
                }}
              >
                Everything you need to understand and visualize seismic activity
                around the world
              </Typography>
            </div>
          </Fade>

          <Grid container spacing={{ xs: 3, sm: 4 }}>
            {features.map((feature, index) => (
              <Grid item xs={12} sm={6} md={4} key={index}>
                <Fade in timeout={1500 + index * 200}>
                  <div>
                    <Card
                      sx={{
                        height: "100%",
                        transition: "all 0.3s ease",
                        "&:hover": {
                          transform: "translateY(-4px)",
                          boxShadow: "0 20px 40px rgba(0, 0, 0, 0.1)",
                        },
                        borderRadius: 3,
                        border: "none",
                        bgcolor: "white",
                        boxShadow: "0 4px 20px rgba(0, 0, 0, 0.08)",
                        overflow: "visible",
                      }}
                    >
                      <CardContent
                        sx={{ p: { xs: 3, sm: 4 }, textAlign: "center" }}
                      >
                        <Box
                          sx={{
                            mb: { xs: 2, sm: 3 },
                            width: { xs: 48, sm: 56, md: 64 },
                            height: { xs: 48, sm: 56, md: 64 },
                            borderRadius: 2,
                            bgcolor: `${feature.color}15`,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            mx: "auto",
                          }}
                        >
                          {React.cloneElement(feature.icon, {
                            sx: {
                              fontSize: { xs: 24, sm: 28, md: 32 },
                              color: feature.color,
                            },
                          })}
                        </Box>
                        <Typography
                          variant={isSmallMobile ? "subtitle1" : "h6"}
                          component="h3"
                          gutterBottom
                          sx={{
                            fontWeight: 600,
                            color: "#111827",
                            mb: { xs: 1, sm: 2 },
                            fontSize: {
                              xs: "1rem",
                              sm: "1.125rem",
                              md: "1.25rem",
                            },
                          }}
                        >
                          {feature.title}
                        </Typography>
                        <Typography
                          variant="body2"
                          sx={{
                            lineHeight: 1.6,
                            color: "#6b7280",
                            fontSize: { xs: "0.8125rem", sm: "0.875rem" },
                          }}
                        >
                          {feature.description}
                        </Typography>
                      </CardContent>
                    </Card>
                  </div>
                </Fade>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>
      {/* Footer - Mobile Responsive */}
      <Box
        sx={{
          py: { xs: 4, sm: 6, md: 8 },
          borderTop: "1px solid #e5e7eb",
          bgcolor: "#111827",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Subtle floating elements in footer */}
        <Box
          sx={{
            position: "absolute",
            top: "30%",
            left: "10%",
            width: 20,
            height: 20,
            borderRadius: "50%",
            bgcolor: "rgba(59, 130, 246, 0.2)",
            animation: "float1 10s ease-in-out infinite",
            zIndex: 0,
          }}
        />
        <Box
          sx={{
            position: "absolute",
            top: "60%",
            right: "15%",
            width: 15,
            height: 15,
            borderRadius: "50%",
            bgcolor: "rgba(16, 185, 129, 0.15)",
            animation: "drift 8s ease-in-out infinite",
            zIndex: 0,
          }}
        />
        <Container maxWidth="lg" sx={{ px: { xs: 2, sm: 3 } }}>
          <Grid container spacing={{ xs: 3, sm: 4 }} alignItems="center">
            <Grid item xs={12} md={6}>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: { xs: 1.5, sm: 2 },
                  mb: { xs: 1.5, sm: 2 },
                  justifyContent: { xs: "center", md: "flex-start" },
                }}
              >
                <EarthIcon
                  sx={{ fontSize: { xs: 24, sm: 28 }, color: "#3b82f6" }}
                />
                <Typography
                  variant={isSmallMobile ? "subtitle1" : "h6"}
                  sx={{
                    fontWeight: 700,
                    color: "white",
                    fontSize: { xs: "1rem", sm: "1.125rem", md: "1.25rem" },
                  }}
                >
                  Earthquake Visualizer
                </Typography>
              </Box>
              <Typography
                variant="body2"
                sx={{
                  color: "#9ca3af",
                  lineHeight: 1.6,
                  textAlign: { xs: "center", md: "left" },
                  fontSize: { xs: "0.8125rem", sm: "0.875rem" },
                }}
              >
                Real-time earthquake visualization and analysis platform for
                educational purposes. Data provided by USGS Earthquake Hazards
                Program.
              </Typography>
            </Grid>
            <Grid item xs={12} md={6}>
              <Box sx={{ textAlign: { xs: "center", md: "right" } }}>
                <Typography
                  variant="body2"
                  sx={{
                    color: "#9ca3af",
                    mb: { xs: 1.5, sm: 2 },
                    fontSize: { xs: "0.8125rem", sm: "0.875rem" },
                  }}
                >
                  Built for students, researchers, and seismology enthusiasts
                </Typography>
                <Stack
                  direction="row"
                  spacing={{ xs: 1, sm: 2 }}
                  sx={{
                    justifyContent: { xs: "center", md: "flex-end" },
                    flexWrap: "wrap",
                    gap: 1,
                  }}
                >
                  <Chip
                    label="Open Source"
                    size="small"
                    sx={{
                      bgcolor: "#374151",
                      color: "#d1d5db",
                      fontSize: { xs: "0.75rem", sm: "0.8125rem" },
                    }}
                  />
                  <Chip
                    label="Educational"
                    size="small"
                    sx={{
                      bgcolor: "#374151",
                      color: "#d1d5db",
                      fontSize: { xs: "0.75rem", sm: "0.8125rem" },
                    }}
                  />
                </Stack>
              </Box>
            </Grid>
          </Grid>
          <Divider sx={{ my: { xs: 3, sm: 4 }, borderColor: "#374151" }} />
          <Typography
            variant="body2"
            textAlign="center"
            sx={{
              color: "#6b7280",
              fontSize: { xs: "0.8125rem", sm: "0.875rem" },
            }}
          >
            © 2024 Earthquake Visualizer. Built with React and Material-UI.
          </Typography>
        </Container>
      </Box>
    </Box>
  );
};

export default LandingPage;
