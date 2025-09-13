import React, { useRef, useEffect } from 'react';
import { Paper, Typography, Box, Button } from '@mui/material';

const PlainHtmlFormTest = () => {
  console.log('🚀 NUCLEAR OPTION: Plain HTML Form Rendered');
  
  const formRef = useRef(null);
  
  useEffect(() => {
    const form = formRef.current;
    if (!form) return;
    
    const inputs = form.querySelectorAll('input');
    
    inputs.forEach((input, index) => {
      input.addEventListener('input', (e) => {
        console.log(`📝 PLAIN HTML INPUT ${index}:`, {
          value: e.target.value,
          activeElement: document.activeElement?.id || 'unknown',
          timestamp: Date.now()
        });
      });
      
      input.addEventListener('focus', () => {
        console.log(`✅ PLAIN HTML FOCUS ${index}`);
      });
      
      input.addEventListener('blur', () => {
        console.log(`❌ PLAIN HTML BLUR ${index}`);
      });
    });
    
    return () => {
      inputs.forEach(input => {
        input.removeEventListener('input', () => {});
        input.removeEventListener('focus', () => {});
        input.removeEventListener('blur', () => {});
      });
    };
  }, []);
  
  return (
    <Paper sx={{ p: 3, m: 2, bgcolor: 'warning.light' }}>
      <Typography variant="h6" gutterBottom color="error">
        🚨 NUCLEAR OPTION: Plain HTML Form Test
      </Typography>
      <Typography variant="body2" sx={{ mb: 2 }}>
        This uses plain HTML inputs with zero React state management
      </Typography>
      
      <form ref={formRef} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <div>
          <label htmlFor="plain-first-name" style={{ display: 'block', marginBottom: '4px' }}>
            First Name (Plain HTML):
          </label>
          <input
            id="plain-first-name"
            type="text"
            placeholder="Type continuously here..."
            style={{
              width: '100%',
              padding: '12px',
              border: '1px solid #ccc',
              borderRadius: '4px',
              fontSize: '16px'
            }}
          />
        </div>
        
        <div>
          <label htmlFor="plain-last-name" style={{ display: 'block', marginBottom: '4px' }}>
            Last Name (Plain HTML):
          </label>
          <input
            id="plain-last-name"
            type="text"
            placeholder="Test cursor stability here..."
            style={{
              width: '100%',
              padding: '12px',
              border: '1px solid #ccc',
              borderRadius: '4px',
              fontSize: '16px'
            }}
          />
        </div>
        
        <div>
          <label htmlFor="plain-phone" style={{ display: 'block', marginBottom: '4px' }}>
            Phone Number (Plain HTML):
          </label>
          <input
            id="plain-phone"
            type="tel"
            placeholder="Phone number test..."
            style={{
              width: '100%',
              padding: '12px',
              border: '1px solid #ccc',
              borderRadius: '4px',
              fontSize: '16px'
            }}
          />
        </div>
      </form>
      
      <Box sx={{ mt: 2 }}>
        <Button 
          variant="outlined" 
          color="warning"
          onClick={() => {
            const inputs = formRef.current?.querySelectorAll('input') || [];
            inputs.forEach((input, index) => {
              console.log(`📊 INPUT ${index}:`, {
                id: input.id,
                value: input.value,
                focused: input === document.activeElement
              });
            });
          }}
        >
          Debug Plain HTML State
        </Button>
      </Box>
    </Paper>
  );
};

export default PlainHtmlFormTest;
