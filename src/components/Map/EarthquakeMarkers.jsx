/**
 * Earthquake Markers Component for Leaflet Map
 */

import React, { useEffect, useRef } from 'react';
import { useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet.markercluster';
import { useAppDispatch, useAppSelector } from '../../app/hooks.js';
import { selectEarthquake } from '../../features/earthquakes/earthquakeSlice.js';
import { getMagnitudeColor, getMagnitudeSize, calculateDistance } from '../../utils/calculations.js';
import { formatMagnitude, formatDateTime, formatLocation } from '../../utils/formatters.js';

const EarthquakeMarkers = ({ earthquakes = [] }) => {
  const map = useMap();
  const dispatch = useAppDispatch();
  const userLocation = useAppSelector(state => state.map.userLocation);
  const markersRef = useRef(null);
  const clusterGroupRef = useRef(null);

  useEffect(() => {
    // Clear existing markers
    if (clusterGroupRef.current) {
      map.removeLayer(clusterGroupRef.current);
    }

    // Create new cluster group
    clusterGroupRef.current = L.markerClusterGroup({
      chunkedLoading: true,
      maxClusterRadius: 50,
      spiderfyOnMaxZoom: true,
      showCoverageOnHover: false,
      zoomToBoundsOnClick: true,
      iconCreateFunction: (cluster) => {
        const count = cluster.getChildCount();
        const size = count < 10 ? 'small' : count < 100 ? 'medium' : 'large';
        
        return L.divIcon({
          html: `<div class="cluster-marker cluster-${size}"><span>${count}</span></div>`,
          className: 'custom-cluster-icon',
          iconSize: L.point(40, 40)
        });
      }
    });

    // Add markers for each earthquake
    earthquakes.forEach((earthquake) => {
      const { coordinates, properties } = earthquake;
      const magnitude = properties.mag || 0;
      const location = properties.place || 'Unknown location';
      const time = properties.time;
      const depth = coordinates.depth || 0;

      // Create custom marker
      const marker = L.circleMarker([coordinates.lat, coordinates.lng], {
        radius: getMagnitudeSize(magnitude),
        fillColor: getMagnitudeColor(magnitude),
        color: '#fff',
        weight: 2,
        opacity: 1,
        fillOpacity: 0.8,
        className: 'earthquake-marker'
      });

      // Calculate distance from user location if available
      let distanceFromUser = null;
      if (userLocation) {
        distanceFromUser = calculateDistance(
          userLocation.lat,
          userLocation.lng,
          coordinates.lat,
          coordinates.lng
        );
      }

      // Create popup content
      const popupContent = `
        <div class="earthquake-popup">
          <div class="popup-header">
            <h3 style="margin: 0 0 8px 0; color: ${getMagnitudeColor(magnitude)};">
              M ${formatMagnitude(magnitude)}
            </h3>
            <p style="margin: 0; font-size: 12px; color: #666;">
              ${formatDateTime(time)}
            </p>
          </div>
          <div class="popup-content">
            <p style="margin: 8px 0; font-weight: 500;">
              📍 ${formatLocation(location)}
            </p>
            ${distanceFromUser ? `
              <div style="margin: 8px 0; padding: 6px; background: #e3f2fd; border-radius: 4px; border-left: 3px solid #2196f3;">
                <strong style="color: #1976d2;">📍 Distance from you:</strong><br>
                <span style="color: #1976d2; font-weight: 500;">
                  ${distanceFromUser < 1 ? 
                    `${(distanceFromUser * 1000).toFixed(0)} meters` : 
                    `${distanceFromUser.toFixed(1)} km`
                  }
                </span>
              </div>
            ` : ''}
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 8px; margin: 8px 0;">
              <div>
                <strong>Depth:</strong><br>
                <span style="color: #666;">${depth.toFixed(1)} km</span>
              </div>
              <div>
                <strong>Coordinates:</strong><br>
                <span style="color: #666; font-size: 11px;">
                  ${coordinates.lat.toFixed(3)}, ${coordinates.lng.toFixed(3)}
                </span>
              </div>
            </div>
            ${properties.felt ? `
              <div style="margin: 8px 0;">
                <strong>Felt Reports:</strong> ${properties.felt}
              </div>
            ` : ''}
            ${properties.url ? `
              <div style="margin: 8px 0;">
                <a href="${properties.url}" target="_blank" rel="noopener noreferrer" 
                   style="color: #1976d2; text-decoration: none;">
                  View Details on USGS →
                </a>
              </div>
            ` : ''}
          </div>
        </div>
      `;

      marker.bindPopup(popupContent, {
        maxWidth: 300,
        className: 'custom-popup'
      });

      // Handle marker click
      marker.on('click', () => {
        dispatch(selectEarthquake(earthquake));
      });

      // Add hover effects
      marker.on('mouseover', function() {
        this.setStyle({
          weight: 3,
          fillOpacity: 1
        });
      });

      marker.on('mouseout', function() {
        this.setStyle({
          weight: 2,
          fillOpacity: 0.8
        });
      });

      // Add to cluster group
      clusterGroupRef.current.addLayer(marker);
    });

    // Add cluster group to map
    map.addLayer(clusterGroupRef.current);

    // Cleanup function
    return () => {
      if (clusterGroupRef.current) {
        map.removeLayer(clusterGroupRef.current);
      }
    };
  }, [earthquakes, map, dispatch, userLocation]);

  // Add custom CSS for markers and popups
  useEffect(() => {
    const style = document.createElement('style');
    style.textContent = `
      .earthquake-marker {
        transition: all 0.2s ease-in-out;
      }
      
      .earthquake-marker:hover {
        transform: scale(1.1);
      }
      
      .cluster-marker {
        background: rgba(25, 118, 210, 0.9);
        border: 2px solid white;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        color: white;
        font-weight: bold;
        box-shadow: 0 2px 8px rgba(0,0,0,0.3);
      }
      
      .cluster-small { width: 30px; height: 30px; font-size: 12px; }
      .cluster-medium { width: 40px; height: 40px; font-size: 14px; }
      .cluster-large { width: 50px; height: 50px; font-size: 16px; }
      
      .custom-popup .leaflet-popup-content {
        margin: 12px;
        line-height: 1.4;
      }
      
      .earthquake-popup {
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      }
      
      .popup-header h3 {
        font-size: 18px;
        font-weight: 600;
      }
      
      .leaflet-popup-content-wrapper {
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
      }
      
      .leaflet-popup-tip {
        box-shadow: 0 2px 4px rgba(0,0,0,0.1);
      }
    `;
    document.head.appendChild(style);

    return () => {
      document.head.removeChild(style);
    };
  }, []);

  return null;
};

export default EarthquakeMarkers;