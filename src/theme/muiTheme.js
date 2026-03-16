/**
 * Material-UI theme configuration integrated with Tailwind CSS
 */

import { createTheme } from '@mui/material/styles';

/**
 * Custom MUI theme with earthquake-specific colors and Tailwind integration
 */
export const muiTheme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#2563eb', // blue-600
      light: '#3b82f6', // blue-500
      dark: '#1d4ed8', // blue-700
      contrastText: '#ffffff',
    },
    secondary: {
      main: '#dc2626', // red-600 (for major earthquakes)
      light: '#ef4444', // red-500
      dark: '#b91c1c', // red-700
      contrastText: '#ffffff',
    },
    error: {
      main: '#dc2626', // red-600
      light: '#f87171', // red-400
      dark: '#991b1b', // red-800
    },
    warning: {
      main: '#d97706', // amber-600
      light: '#f59e0b', // amber-500
      dark: '#92400e', // amber-700
    },
    info: {
      main: '#0891b2', // cyan-600
      light: '#06b6d4', // cyan-500
      dark: '#0e7490', // cyan-700
    },
    success: {
      main: '#059669', // emerald-600
      light: '#10b981', // emerald-500
      dark: '#047857', // emerald-700
    },
    background: {
      default: '#f8fafc', // slate-50
      paper: '#ffffff',
    },
    text: {
      primary: '#0f172a', // slate-900
      secondary: '#475569', // slate-600
    },
    // Custom earthquake severity colors
    earthquake: {
      minor: '#4ade80', // green-400
      light: '#fbbf24', // amber-400
      moderate: '#f97316', // orange-500
      major: '#ef4444', // red-500
    },
  },
  
  typography: {
    fontFamily: [
      '-apple-system',
      'BlinkMacSystemFont',
      '"Segoe UI"',
      'Roboto',
      '"Helvetica Neue"',
      'Arial',
      'sans-serif',
    ].join(','),
    
    h1: {
      fontSize: '2.25rem', // text-4xl
      fontWeight: 700,
      lineHeight: 1.2,
    },
    h2: {
      fontSize: '1.875rem', // text-3xl
      fontWeight: 600,
      lineHeight: 1.3,
    },
    h3: {
      fontSize: '1.5rem', // text-2xl
      fontWeight: 600,
      lineHeight: 1.4,
    },
    h4: {
      fontSize: '1.25rem', // text-xl
      fontWeight: 600,
      lineHeight: 1.4,
    },
    h5: {
      fontSize: '1.125rem', // text-lg
      fontWeight: 600,
      lineHeight: 1.5,
    },
    h6: {
      fontSize: '1rem', // text-base
      fontWeight: 600,
      lineHeight: 1.5,
    },
    body1: {
      fontSize: '1rem', // text-base
      lineHeight: 1.6,
    },
    body2: {
      fontSize: '0.875rem', // text-sm
      lineHeight: 1.5,
    },
    caption: {
      fontSize: '0.75rem', // text-xs
      lineHeight: 1.4,
    },
  },
  
  shape: {
    borderRadius: 8, // rounded-lg
  },
  
  spacing: 8, // Base spacing unit (matches Tailwind's 0.5rem increments)
  
  components: {
    // Customize MUI components to work well with Tailwind
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none', // Disable uppercase transformation
          borderRadius: 8,
          fontWeight: 500,
          padding: '8px 16px',
        },
        contained: {
          boxShadow: '0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)', // shadow-sm
          '&:hover': {
            boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)', // shadow-md
          },
        },
      },
    },
    
    MuiCard: {
      styleOverrides: {
        root: {
          boxShadow: '0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)', // shadow-sm
          borderRadius: 12, // rounded-xl
        },
      },
    },
    
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: 8,
        },
        elevation1: {
          boxShadow: '0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)', // shadow-sm
        },
        elevation2: {
          boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)', // shadow-md
        },
      },
    },
    
    MuiDrawer: {
      styleOverrides: {
        paper: {
          borderRadius: 0,
          boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)', // shadow-lg
        },
      },
    },
    
    MuiSlider: {
      styleOverrides: {
        root: {
          height: 6,
        },
        thumb: {
          width: 20,
          height: 20,
          '&:hover': {
            boxShadow: '0 0 0 8px rgba(37, 99, 235, 0.16)', // primary color with opacity
          },
        },
        track: {
          height: 6,
          borderRadius: 3,
        },
        rail: {
          height: 6,
          borderRadius: 3,
          backgroundColor: '#e2e8f0', // slate-200
        },
      },
    },
    
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: 16, // rounded-2xl
          fontWeight: 500,
        },
      },
    },
    
    MuiTooltip: {
      styleOverrides: {
        tooltip: {
          backgroundColor: '#1e293b', // slate-800
          fontSize: '0.875rem', // text-sm
          borderRadius: 6,
          padding: '8px 12px',
        },
        arrow: {
          color: '#1e293b', // slate-800
        },
      },
    },
  },
  
  breakpoints: {
    values: {
      xs: 0,
      sm: 640,  // Tailwind sm
      md: 768,  // Tailwind md
      lg: 1024, // Tailwind lg
      xl: 1280, // Tailwind xl
    },
  },
});

// Dark theme variant (for future dark mode support)
export const darkMuiTheme = createTheme({
  ...muiTheme,
  palette: {
    ...muiTheme.palette,
    mode: 'dark',
    background: {
      default: '#0f172a', // slate-900
      paper: '#1e293b', // slate-800
    },
    text: {
      primary: '#f1f5f9', // slate-100
      secondary: '#94a3b8', // slate-400
    },
  },
});