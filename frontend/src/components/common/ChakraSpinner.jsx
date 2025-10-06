import React from 'react';
import { styled } from '@mui/material/styles';
import { Box } from '@mui/material';

// Styled component for the Chakra animation
const StyledChakra = styled('svg')(({ theme, size }) => ({
  width: size || '24px',
  height: size || '24px',
  animation: 'chakra-spin 30s linear infinite',
  transformOrigin: '50% 50%',
  '@keyframes chakra-spin': {
    from: {
      transform: 'rotate(0deg)',
    },
    to: {
      transform: 'rotate(360deg)',
    },
  },
}));

const ChakraSpinner = ({ 
  size = '24px', 
  color = '#000080', 
  strokeWidth = '1.5',
  className = '',
  ...props 
}) => {
  return (
    <Box 
      className={className}
      display="inline-flex"
      alignItems="center"
      justifyContent="center"
      {...props}
    >
      <StyledChakra 
        size={size}
        viewBox="0 0 100 100" 
        fill="none" 
        stroke={color} 
        strokeWidth={strokeWidth}
      >
        {/* Outer Rim and Center Hub */}
        <circle cx="50" cy="50" r="45" strokeWidth="4" stroke={color} />
        <circle cx="50" cy="50" r="6" fill={color} />

        {/* Define a single spoke and reuse it 24 times */}
        <defs>
          <line id="spoke" x1="50" y1="55" x2="50" y2="90" stroke={color} strokeWidth="2" />
        </defs>

        {/* 24 Spokes (15 degrees apart) */}
        <g>
          <use href="#spoke" transform="rotate(0, 50, 50)" />
          <use href="#spoke" transform="rotate(15, 50, 50)" />
          <use href="#spoke" transform="rotate(30, 50, 50)" />
          <use href="#spoke" transform="rotate(45, 50, 50)" />
          <use href="#spoke" transform="rotate(60, 50, 50)" />
          <use href="#spoke" transform="rotate(75, 50, 50)" />
          <use href="#spoke" transform="rotate(90, 50, 50)" />
          <use href="#spoke" transform="rotate(105, 50, 50)" />
          <use href="#spoke" transform="rotate(120, 50, 50)" />
          <use href="#spoke" transform="rotate(135, 50, 50)" />
          <use href="#spoke" transform="rotate(150, 50, 50)" />
          <use href="#spoke" transform="rotate(165, 50, 50)" />
          <use href="#spoke" transform="rotate(180, 50, 50)" />
          <use href="#spoke" transform="rotate(195, 50, 50)" />
          <use href="#spoke" transform="rotate(210, 50, 50)" />
          <use href="#spoke" transform="rotate(225, 50, 50)" />
          <use href="#spoke" transform="rotate(240, 50, 50)" />
          <use href="#spoke" transform="rotate(255, 50, 50)" />
          <use href="#spoke" transform="rotate(270, 50, 50)" />
          <use href="#spoke" transform="rotate(285, 50, 50)" />
          <use href="#spoke" transform="rotate(300, 50, 50)" />
          <use href="#spoke" transform="rotate(315, 50, 50)" />
          <use href="#spoke" transform="rotate(330, 50, 50)" />
          <use href="#spoke" transform="rotate(345, 50, 50)" />
        </g>
      </StyledChakra>
    </Box>
  );
};

export default ChakraSpinner;
