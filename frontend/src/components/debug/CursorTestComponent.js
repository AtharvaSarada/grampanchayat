import React, { useState, useRef, useEffect } from 'react';
import { TextField, Box, Typography, Button, Paper } from '@mui/material';

const CursorTestComponent = () => {
  console.log('🧪 TEST COMPONENT RENDER:', Date.now());
  
  const [testValue, setTestValue] = useState('');
  const [renderCount, setRenderCount] = useState(0);
  const inputRef = useRef(null);
  
  useEffect(() => {
    setRenderCount(prev => prev + 1);
    console.log('🔢 Render count:', renderCount + 1);
  }, []); // Add empty dependency array to prevent infinite loop
  
  const handleChange = (event) => {
    const value = event.target.value;
    const activeElement = document.activeElement;
    
    console.log('🔍 MINIMAL TEST INPUT CHANGE:', {
      value,
      activeElement: activeElement?.id || 'unknown',
      inputRefCurrent: inputRef.current?.id || 'unknown',
      timestamp: Date.now()
    });
    
    setTestValue(value);
  };
  
  const handleFocus = () => {
    console.log('✅ MINIMAL TEST FOCUS');
  };
  
  const handleBlur = () => {
    console.log('❌ MINIMAL TEST BLUR');
  };
  
  return (
    <Paper sx={{ p: 3, m: 2 }}>
      <Typography variant="h6" gutterBottom color="error">
        CURSOR BUG TEST COMPONENT
      </Typography>
      <Typography variant="body2" sx={{ mb: 2 }}>
        Renders: {renderCount} | Value length: {testValue.length}
      </Typography>
      
      <Box sx={{ mb: 2 }}>
        <TextField
          ref={inputRef}
          id="cursor-test-input"
          fullWidth
          label="Type continuously to test cursor stability"
          value={testValue}
          onChange={handleChange}
          onFocus={handleFocus}
          onBlur={handleBlur}
          variant="outlined"
          placeholder="If cursor jumps or loses focus, the bug is reproduced"
        />
      </Box>
      
      <Button 
        variant="outlined" 
        onClick={() => {
          console.log('🎯 Current focus:', document.activeElement?.id);
          console.log('📝 Current value:', testValue);
        }}
      >
        Debug Current State
      </Button>
    </Paper>
  );
};

export default CursorTestComponent;
