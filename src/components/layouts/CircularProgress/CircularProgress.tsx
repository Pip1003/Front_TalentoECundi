import React from 'react';
import { CircularProgress, Typography, Box } from '@mui/material';

interface CircularProgressWithLabelProps {
  value: number;
}

const CircularProgressComponent: React.FC<CircularProgressWithLabelProps> = ({ value }) => {
  return (
    <Box position="relative" display="inline-flex">
      <CircularProgress
        variant="determinate"
        value={value} size={35}
        thickness={4}
        sx={{
          color: '#003A22',
        }} />
      <Box
        top={0}
        left={0}
        bottom={0}
        right={0}
        position="absolute"
        display="flex"
        alignItems="center"
        justifyContent="center"
      >
        <Typography variant="caption" component="div" color="textSecondary">
          {`${Math.round(value)}%`}
        </Typography>
      </Box>
    </Box>
  );
};

export default CircularProgressComponent;
