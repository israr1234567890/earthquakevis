/**
 * Educational Tooltip Component
 * Provides contextual learning information throughout the app
 */

import React, { useState } from 'react';
import {
  Tooltip,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
  Chip,
  Divider
} from '@mui/material';
import {
  Info as InfoIcon,
  School as SchoolIcon,
  Close as CloseIcon
} from '@mui/icons-material';

/**
 * Educational content database
 */
export const educationalContent = {
  magnitude: {
    title: 'Earthquake Magnitude',
    shortDescription: 'Measures the energy released by an earthquake',
    content: `
      <strong>What is Magnitude?</strong>
      <br/>Magnitude measures the total energy released by an earthquake at its source. It's measured on a logarithmic scale,
      meaning each whole number increase represents a 10-fold increase in amplitude and about 31.6 times more energy released.
      <br/><br/>
      <strong>Magnitude Scales:</strong>
      <ul>
        <li><strong>Richter Scale:</strong> Original scale developed in 1935, primarily for local earthquakes in California</li>
        <li><strong>Moment Magnitude (Mw):</strong> Modern scale used by USGS, more accurate for large earthquakes</li>
      </ul>
      <br/>
      <strong>Classification:</strong>
      <ul>
        <li><strong>Minor (< 3.0):</strong> Often not felt, thousands occur daily</li>
        <li><strong>Light (3.0-4.9):</strong> Felt by many, rarely causes damage</li>
        <li><strong>Moderate (5.0-6.9):</strong> Can cause damage to buildings</li>
        <li><strong>Major (≥ 7.0):</strong> Serious damage over large areas</li>
      </ul>
    `,
    relatedTopics: ['Intensity', 'Energy Release', 'Richter Scale']
  },

  depth: {
    title: 'Earthquake Depth',
    shortDescription: 'How far below Earth\'s surface the earthquake originated',
    content: `
      <strong>Why Depth Matters:</strong>
      <br/>The depth of an earthquake's hypocenter (focus) affects how much shaking reaches the surface.
      Shallow earthquakes are generally more destructive than deep earthquakes of the same magnitude.
      <br/><br/>
      <strong>Depth Categories:</strong>
      <ul>
        <li><strong>Shallow (0-70 km):</strong> Most common and most destructive. Found at all types of plate boundaries.</li>
        <li><strong>Intermediate (70-300 km):</strong> Occur in subduction zones where oceanic crust dives beneath continental crust.</li>
        <li><strong>Deep (> 300 km):</strong> Only occur in subduction zones, up to 700 km deep. Less damaging due to distance.</li>
      </ul>
      <br/>
      <strong>Key Insight:</strong> If you observe earthquakes at ALL depth ranges in a region,
      you're likely looking at a subduction zone!
    `,
    relatedTopics: ['Subduction Zones', 'Hypocenter', 'Seismic Waves']
  },



  ringOfFire: {
    title: 'Pacific Ring of Fire',
    shortDescription: 'The most seismically active region on Earth',
    content: `
      <strong>What is the Ring of Fire?</strong>
      <br/>A 40,000 km horseshoe-shaped zone around the Pacific Ocean where about 90% of the world's
      earthquakes occur. It's also home to 75% of the world's active volcanoes.
      <br/><br/>
      <strong>Why So Active?</strong>
      <ul>
        <li>Formed by multiple subduction zones around the Pacific Plate</li>
        <li>Oceanic plates dive beneath continental plates</li>
        <li>Creates deep ocean trenches and volcanic arcs</li>
        <li>Generates the most powerful earthquakes on Earth</li>
      </ul>
      <br/>
      <strong>Major Zones Include:</strong>
      <ul>
        <li>Japan Trench</li>
        <li>Aleutian Islands</li>
        <li>West Coast of Americas (Cascadia, Andean subduction)</li>
        <li>Philippines, Indonesia, New Zealand</li>
      </ul>
      <br/>
      <strong>⚠️ Important:</strong> Ring of Fire earthquakes can trigger tsunamis due to
      underwater displacement.
    `,
    relatedTopics: ['Subduction Zones', 'Tsunamis', 'Volcanic Activity']
  },

  felt: {
    title: 'Felt Reports',
    shortDescription: 'Citizen reports of earthquake shaking',
    content: `
      <strong>What are Felt Reports?</strong>
      <br/>After an earthquake, people can report their experience through the USGS "Did You Feel It?" system.
      These reports help scientists understand the earthquake's intensity and impact.
      <br/><br/>
      <strong>Why They Matter:</strong>
      <ul>
        <li>Provide real-world impact data beyond seismic measurements</li>
        <li>Help create shake maps showing intensity distribution</li>
        <li>Useful for emergency response planning</li>
        <li>Shows difference between magnitude (energy) and intensity (shaking felt)</li>
      </ul>
      <br/>
      <strong>Magnitude vs. Intensity:</strong>
      <ul>
        <li><strong>Magnitude:</strong> Single number, energy at source</li>
        <li><strong>Intensity:</strong> Varies by location, damage and shaking felt</li>
      </ul>
    `,
    relatedTopics: ['Modified Mercalli Scale', 'Earthquake Intensity', 'ShakeMap']
  },

  tsunami: {
    title: 'Earthquake-Generated Tsunamis',
    shortDescription: 'How earthquakes can create devastating ocean waves',
    content: `
      <strong>How Earthquakes Cause Tsunamis:</strong>
      <br/>Tsunamis are generated when underwater earthquakes cause vertical displacement of the seafloor,
      pushing massive amounts of water upward.
      <br/><br/>
      <strong>Requirements for Tsunami:</strong>
      <ul>
        <li>Earthquake must occur under or near ocean</li>
        <li>Typically magnitude 7.0 or greater</li>
        <li>Must involve significant vertical motion</li>
        <li>Shallow to intermediate depth (< 100 km)</li>
      </ul>
      <br/>
      <strong>Famous Tsunami Earthquakes:</strong>
      <ul>
        <li><strong>2011 Tōhoku (Japan):</strong> M 9.1, 40-meter waves</li>
        <li><strong>2004 Indian Ocean:</strong> M 9.1, affected 14 countries</li>
        <li><strong>1960 Chile:</strong> M 9.5, largest recorded earthquake</li>
      </ul>
      <br/>
      <strong>⚠️ Safety:</strong> If you feel strong shaking near a coast, move to high ground immediately!
    `,
    relatedTopics: ['Subduction Zones', 'Megathrust Earthquakes', 'Pacific Warning System']
  }
};

/**
 * Educational Tooltip Component
 */
const EducationalTooltip = ({
  topic,
  size = 'small',
  color = 'primary',
  iconButton = true,
  showIcon = true
}) => {
  const [dialogOpen, setDialogOpen] = useState(false);

  const content = educationalContent[topic];

  if (!content) {
    console.warn(`Educational content not found for topic: ${topic}`);
    return null;
  }

  const handleOpen = () => {
    setDialogOpen(true);
  };

  const handleClose = () => {
    setDialogOpen(false);
  };

  return (
    <>
      {iconButton ? (
        <Tooltip title={content.shortDescription} arrow>
          <IconButton
            size={size}
            color={color}
            onClick={handleOpen}
            sx={{ ml: 0.5 }}
          >
            {showIcon ? <InfoIcon fontSize={size} /> : <SchoolIcon fontSize={size} />}
          </IconButton>
        </Tooltip>
      ) : (
        <Chip
          label="Learn More"
          size="small"
          icon={<SchoolIcon />}
          onClick={handleOpen}
          variant="outlined"
          color={color}
        />
      )}

      {/* Educational Dialog */}
      <Dialog
        open={dialogOpen}
        onClose={handleClose}
        maxWidth="md"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 2
          }
        }}
      >
        <DialogTitle sx={{
          bgcolor: 'primary.main',
          color: 'primary.contrastText',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <SchoolIcon />
            <Typography variant="h6" component="span">
              {content.title}
            </Typography>
          </Box>
          <IconButton
            onClick={handleClose}
            sx={{ color: 'primary.contrastText' }}
            size="small"
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>

        <DialogContent sx={{ mt: 2 }}>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            {/* Main Content */}
            <Typography
              variant="body2"
              component="div"
              sx={{ lineHeight: 1.8 }}
              dangerouslySetInnerHTML={{ __html: content.content }}
            />

            {/* Related Topics */}
            {content.relatedTopics && content.relatedTopics.length > 0 && (
              <>
                <Divider />
                <Box>
                  <Typography variant="caption" color="text.secondary" gutterBottom>
                    Related Topics:
                  </Typography>
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mt: 1 }}>
                    {content.relatedTopics.map((topic, index) => (
                      <Chip
                        key={index}
                        label={topic}
                        size="small"
                        variant="outlined"
                        color="primary"
                      />
                    ))}
                  </Box>
                </Box>
              </>
            )}
          </Box>
        </DialogContent>

        <DialogActions sx={{ p: 2 }}>
          <Button onClick={handleClose} variant="contained" fullWidth>
            Got it!
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default EducationalTooltip;
