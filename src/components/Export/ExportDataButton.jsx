/**
 * Export Data Button Component
 * Allows students to export earthquake data for assignments
 */

import React, { useState } from 'react';
import {
  Button,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Typography,
  Box,
  Alert,
  Chip,
  Divider
} from '@mui/material';
import {
  Download as DownloadIcon,
  TableChart as TableChartIcon,
  Code as CodeIcon,
  Map as MapIcon,
  Description as DescriptionIcon,
  CheckCircle as CheckCircleIcon
} from '@mui/icons-material';
import {
  exportEarthquakeData,
  exportStatisticsSummary,
  downloadFile
} from '../../utils/dataExport.js';
import { useAppSelector } from '../../app/hooks.js';
import { selectFilteredEarthquakes, selectEarthquakeStatistics } from '../../features/earthquakes/earthquakeSelectors.js';

const ExportDataButton = ({ variant = 'contained', size = 'medium', fullWidth = false }) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [infoDialogOpen, setInfoDialogOpen] = useState(false);
  const [exportSuccess, setExportSuccess] = useState(false);
  const [lastExportFormat, setLastExportFormat] = useState('');

  const earthquakes = useAppSelector(selectFilteredEarthquakes);
  const statistics = useAppSelector(selectEarthquakeStatistics);

  const open = Boolean(anchorEl);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleExport = (format) => {
    try {
      exportEarthquakeData(earthquakes, format, 'earthquake_data');
      setLastExportFormat(format.toUpperCase());
      setExportSuccess(true);
      setTimeout(() => setExportSuccess(false), 3000);
      handleClose();
    } catch (error) {
      console.error('Export failed:', error);
      alert('Failed to export data. Please try again.');
    }
  };

  const handleExportSummary = () => {
    try {
      const summary = exportStatisticsSummary(statistics, earthquakes);
      const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, 19);
      downloadFile(summary, `earthquake_summary_${timestamp}.txt`, 'text/plain');
      setLastExportFormat('Summary Report');
      setExportSuccess(true);
      setTimeout(() => setExportSuccess(false), 3000);
      handleClose();
    } catch (error) {
      console.error('Export summary failed:', error);
      alert('Failed to export summary. Please try again.');
    }
  };

  const exportFormats = [
    {
      format: 'csv',
      label: 'CSV (Excel)',
      description: 'Open in Excel, Google Sheets, or any spreadsheet software',
      icon: <TableChartIcon />,
      color: 'success'
    },
    {
      format: 'json',
      label: 'JSON',
      description: 'For programming projects and data analysis',
      icon: <CodeIcon />,
      color: 'info'
    },
    {
      format: 'geojson',
      label: 'GeoJSON',
      description: 'For GIS software (ArcGIS, QGIS)',
      icon: <MapIcon />,
      color: 'primary'
    }
  ];

  return (
    <>
      <Box sx={{ position: 'relative' }}>
        <Button
          variant={variant}
          size={size}
          fullWidth={fullWidth}
          startIcon={<DownloadIcon />}
          onClick={handleClick}
          color="primary"
        >
          Export Data
        </Button>

        {exportSuccess && (
          <Box
            sx={{
              position: 'absolute',
              top: -40,
              left: '50%',
              transform: 'translateX(-50%)',
              zIndex: 9999
            }}
          >
            <Chip
              icon={<CheckCircleIcon />}
              label={`${lastExportFormat} downloaded!`}
              color="success"
              size="small"
              sx={{
                animation: 'slideDown 0.3s ease-out',
                '@keyframes slideDown': {
                  from: { opacity: 0, transform: 'translateY(-10px)' },
                  to: { opacity: 1, transform: 'translateY(0)' }
                }
              }}
            />
          </Box>
        )}
      </Box>

      {/* Export Menu */}
      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right'
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right'
        }}
        PaperProps={{
          elevation: 3,
          sx: {
            minWidth: 320,
            mt: 1
          }
        }}
      >
        {/* Header */}
        <Box sx={{ px: 2, py: 1.5, bgcolor: 'primary.main', color: 'primary.contrastText' }}>
          <Typography variant="subtitle2" fontWeight={600}>
            Export Earthquake Data
          </Typography>
          <Typography variant="caption">
            {earthquakes.length} events in current view
          </Typography>
        </Box>

        <Divider />

        {/* Export Formats */}
        {exportFormats.map((format) => (
          <MenuItem
            key={format.format}
            onClick={() => handleExport(format.format)}
            sx={{ py: 1.5 }}
          >
            <ListItemIcon>
              <Box
                sx={{
                  width: 40,
                  height: 40,
                  borderRadius: 1,
                  bgcolor: `${format.color}.lighter`,
                  color: `${format.color}.main`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                {format.icon}
              </Box>
            </ListItemIcon>
            <ListItemText
              primary={format.label}
              secondary={format.description}
              primaryTypographyProps={{
                fontWeight: 600,
                fontSize: '0.9rem'
              }}
              secondaryTypographyProps={{
                fontSize: '0.75rem',
                sx: { mt: 0.5 }
              }}
            />
          </MenuItem>
        ))}

        <Divider />

        {/* Statistics Summary */}
        <MenuItem onClick={handleExportSummary} sx={{ py: 1.5 }}>
          <ListItemIcon>
            <Box
              sx={{
                width: 40,
                height: 40,
                borderRadius: 1,
                bgcolor: 'warning.lighter',
                color: 'warning.main',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <DescriptionIcon />
            </Box>
          </ListItemIcon>
          <ListItemText
            primary="Statistics Summary"
            secondary="Text report with key insights"
            primaryTypographyProps={{
              fontWeight: 600,
              fontSize: '0.9rem'
            }}
            secondaryTypographyProps={{
              fontSize: '0.75rem',
              sx: { mt: 0.5 }
            }}
          />
        </MenuItem>

        <Divider />

        {/* Help Link */}
        <Box sx={{ px: 2, py: 1.5 }}>
          <Button
            size="small"
            onClick={() => {
              setInfoDialogOpen(true);
              handleClose();
            }}
            fullWidth
            variant="text"
          >
            How to use exported data?
          </Button>
        </Box>
      </Menu>

      {/* Info Dialog */}
      <Dialog open={infoDialogOpen} onClose={() => setInfoDialogOpen(false)} maxWidth="md">
        <DialogTitle>
          📚 How to Use Exported Data
        </DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <Alert severity="info" variant="outlined">
              <strong>For Students:</strong> This export feature is designed to help you complete assignments,
              research projects, and lab reports using real earthquake data from USGS.
            </Alert>

            {/* CSV Section */}
            <Box>
              <Typography variant="subtitle2" fontWeight={600} gutterBottom>
                📊 CSV Format (Excel/Google Sheets)
              </Typography>
              <Typography variant="body2" color="text.secondary">
                • Open in Excel, Google Sheets, or Numbers
                <br />
                • Perfect for creating charts and graphs
                <br />
                • Use for statistical analysis
                <br />
                • Great for lab reports and presentations
              </Typography>
            </Box>

            <Divider />

            {/* JSON Section */}
            <Box>
              <Typography variant="subtitle2" fontWeight={600} gutterBottom>
                💻 JSON Format (Programming)
              </Typography>
              <Typography variant="body2" color="text.secondary">
                • Use in Python, JavaScript, R, or other languages
                <br />
                • Perfect for data science projects
                <br />
                • Easy to parse and analyze programmatically
                <br />
                • Include in coding assignments
              </Typography>
            </Box>

            <Divider />

            {/* GeoJSON Section */}
            <Box>
              <Typography variant="subtitle2" fontWeight={600} gutterBottom>
                🗺️ GeoJSON Format (GIS)
              </Typography>
              <Typography variant="body2" color="text.secondary">
                • Import into ArcGIS, QGIS, or other GIS software
                <br />
                • Create custom maps and spatial analysis
                <br />
                • Advanced geography projects
                <br />
                • Professional mapping and visualization
              </Typography>
            </Box>

            <Divider />

            {/* Statistics Summary */}
            <Box>
              <Typography variant="subtitle2" fontWeight={600} gutterBottom>
                📝 Statistics Summary
              </Typography>
              <Typography variant="body2" color="text.secondary">
                • Quick overview of key metrics
                <br />
                • Include in reports and presentations
                <br />
                • Ready-to-use statistics
                <br />
                • Citations and data sources included
              </Typography>
            </Box>

            <Alert severity="success" variant="filled" sx={{ mt: 1 }}>
              <Typography variant="caption" fontWeight={600}>
                💡 Pro Tip: Filter your data first, then export! This way you only get the specific
                earthquakes you need for your assignment.
              </Typography>
            </Alert>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setInfoDialogOpen(false)} variant="contained">
            Got it!
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default ExportDataButton;
