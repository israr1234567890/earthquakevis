/**
 * Map Legend Component
 */

import React from 'react';
import { Box, Paper, Typography, useTheme } from '@mui/material';
import { MAGNITUDE_COLORS, MAGNITUDE_RANGES } from '../../utils/constants.js';

const MapLegend = () => {
  const theme = useTheme();

  const legendItems = [
    { range: '< 3.0', color: MAGNITUDE_COLORS.MINOR, label: 'Minor' },
    { range: '3.0 - 4.9', color: MAGNITUDE_COLORS.LIGHT, label: 'Light' },
    { range: '5.0 - 5.9', color: MAGNITUDE_COLORS.MODERATE, label: 'Moderate' },
    { range: '6.0 - 6.9', color: MAGNITUDE_COLORS.STRONG, label: 'Strong' },
    { range: '7.0+', color: MAGNITUDE_COLORS.MAJOR, label: 'Major' }
  ];

  return (
    <Paper
      elevation={2}
      sx={{
        position: 'absolute',
        bottom: 16,
        left: 16,
        p: 2,
        zIndex: 1000,
        minWidth: 200,
        bgcolor: 'rgba(255, 255, 255, 0.95)',
        backdropFilter: 'blur(4px)'
      }}
    >
      <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1 }}>
        Magnitude Scale
      </Typography>
      
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
        {legendItems.map((item, index) => (
          <Box
            key={index}
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 1
            }}
          >
            <Box
              sx={{
                width: 16,
                height: 16,
                borderRadius: '50%',
                bgcolor: item.color,
                border: '2px solid white',
                boxShadow: '0 1px 3px rgba(0,0,0,0.3)',
                flexShrink: 0
              }}
            />
            <Typography variant="caption" sx={{ fontSize: '11px', lineHeight: 1.2 }}>
              <strong>{item.range}</strong> - {item.label}
            </Typography>
          </Box>
        ))}
      </Box>
      
      <Box sx={{ mt: 1.5, pt: 1, borderTop: '1px solid', borderColor: 'divider' }}>
        <Typography variant="caption" color="text.secondary" sx={{ fontSize: '10px' }}>
          Circle size indicates magnitude strength
        </Typography>
      </Box>
    </Paper>
  );
};

export default MapLegend;