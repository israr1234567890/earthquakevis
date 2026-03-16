/**
 * User Location Marker Component
 * Displays the user's current location on the map with accuracy circle
 */

import React from "react";
import { Marker, Circle, Popup } from "react-leaflet";
import { Box, Typography, Chip } from "@mui/material";
import { MyLocation as MyLocationIcon } from "@mui/icons-material";
import L from "leaflet";

// Create custom user location icon
const createUserLocationIcon = () => {
  return L.divIcon({
    className: "user-location-marker",
    html: `
      <div style="
        width: 20px;
        height: 20px;
        background: #2196f3;
        border: 3px solid white;
        border-radius: 50%;
        box-shadow: 0 2px 8px rgba(0,0,0,0.3);
        position: relative;
      ">
        <div style="
          position: absolute;
          top: -10px;
          left: -10px;
          width: 40px;
          height: 40px;
          background: rgba(33, 150, 243, 0.2);
          border-radius: 50%;
          animation: pulse 2s infinite;
        "></div>
      </div>
      <style>
        @keyframes pulse {
          0% {
            transform: scale(0.8);
            opacity: 1;
          }
          100% {
            transform: scale(2);
            opacity: 0;
          }
        }
      </style>
    `,
    iconSize: [20, 20],
    iconAnchor: [10, 10],
    popupAnchor: [0, -10],
  });
};

const UserLocationMarker = ({ location }) => {
  if (!location) return null;

  const { lat, lng, accuracy } = location;
  const userIcon = createUserLocationIcon();

  return (
    <>
      {/* Accuracy circle */}
      {accuracy && (
        <Circle
          center={[lat, lng]}
          radius={accuracy}
          pathOptions={{
            color: "#2196f3",
            fillColor: "#2196f3",
            fillOpacity: 0.1,
            weight: 2,
            opacity: 0.6,
          }}
        />
      )}

      {/* User location marker */}
      <Marker position={[lat, lng]} icon={userIcon}>
        <Popup>
          <Box sx={{ p: 1, minWidth: 200 }}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}>
              <MyLocationIcon color="primary" fontSize="small" />
              <Typography variant="subtitle2" fontWeight="bold">
                Your Location
              </Typography>
            </Box>

            <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
              Latitude: {lat.toFixed(6)}°
            </Typography>

            <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
              Longitude: {lng.toFixed(6)}°
            </Typography>

            {accuracy && (
              <Chip
                label={`±${Math.round(accuracy)}m accuracy`}
                size="small"
                color="primary"
                variant="outlined"
              />
            )}
          </Box>
        </Popup>
      </Marker>
    </>
  );
};

export default UserLocationMarker;
