import React, { useEffect, useState, useRef } from 'react';
import { Box, IconButton, Paper, Slide, Typography } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

interface MapSidePaneProps {
  location: string;
  open: boolean;
  onClose: () => void;
}

const MapSidePane: React.FC<MapSidePaneProps> = ({ location, open, onClose }) => {
  const [width, setWidth] = useState(400);
  const [isDragging, setIsDragging] = useState(false);
  const dragRef = useRef<HTMLDivElement>(null);

  // Handle ESC key press
  useEffect(() => {
    const handleEscKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && open) {
        onClose();
      }
    };

    window.addEventListener('keydown', handleEscKey);
    return () => {
      window.removeEventListener('keydown', handleEscKey);
    };
  }, [open, onClose]);

  // Handle resize functionality
  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isDragging) return;

      // Calculate new width based on mouse position (from right edge of screen)
      const newWidth = window.innerWidth - e.clientX;

      // Set constraints for min/max width
      if (newWidth >= 250 && newWidth <= window.innerWidth * 0.8) {
        setWidth(newWidth);
      }
    };

    const handleMouseUp = () => {
      setIsDragging(false);
    };

    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging]);

  return (
    <Slide direction="left" in={open} mountOnEnter unmountOnExit>
      <Paper
        sx={{
          position: 'fixed',
          top: 0,
          right: 0,
          width: { xs: '100%', sm: `${width}px` },
          height: '100vh',
          zIndex: 1300,
          boxShadow: '-2px 0 10px rgba(0, 0, 0, 0.1)',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        {/* Resize handle */}
        <Box
          ref={dragRef}
          sx={{
            position: 'absolute',
            left: 0,
            top: 0,
            bottom: 0,
            width: '8px',
            cursor: 'ew-resize',
            backgroundColor: 'transparent',
            '&:hover': {
              backgroundColor: 'rgba(0, 0, 0, 0.1)',
            },
            '&:active': {
              backgroundColor: 'rgba(0, 0, 0, 0.2)',
            },
          }}
          onMouseDown={handleMouseDown}
        />

        <Box sx={{ p: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="h6">{location}</Typography>
          <IconButton onClick={onClose}>
            <CloseIcon />
          </IconButton>
        </Box>
        <Box sx={{ flex: 1, p: 2 }}>
          <iframe
            title="Google Maps"
            width="100%"
            height="100%"
            frameBorder="0"
            style={{ border: 0 }}
            src={`https://www.google.com/maps?q=${encodeURIComponent(location)}&output=embed`}
            allowFullScreen
          ></iframe>
        </Box>
      </Paper>
    </Slide>
  );
};

export default MapSidePane;
