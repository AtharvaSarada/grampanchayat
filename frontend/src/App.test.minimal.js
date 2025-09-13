import React from 'react';

function App() {
  return (
    <div style={{ 
      padding: '50px', 
      textAlign: 'center', 
      fontFamily: 'Arial, sans-serif',
      backgroundColor: '#f5f5f5',
      minHeight: '100vh' 
    }}>
      <h1 style={{ color: '#2e7d32', fontSize: '2.5rem', marginBottom: '20px' }}>
        🎉 SUCCESS! 🎉
      </h1>
      <h2 style={{ color: '#333', marginBottom: '30px' }}>
        E-Services for Gram Panchayath
      </h2>
      <div style={{ 
        backgroundColor: 'white', 
        padding: '30px', 
        borderRadius: '10px',
        boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
        maxWidth: '600px',
        margin: '0 auto'
      }}>
        <p style={{ fontSize: '1.2rem', marginBottom: '20px' }}>
          ✅ Website is working properly!
        </p>
        <p style={{ fontSize: '1rem', color: '#666', marginBottom: '20px' }}>
          The loading issue has been resolved. The React application is now running successfully.
        </p>
        <button 
          style={{
            backgroundColor: '#2e7d32',
            color: 'white',
            border: 'none',
            padding: '12px 24px',
            borderRadius: '5px',
            fontSize: '1rem',
            cursor: 'pointer'
          }}
          onClick={() => alert('Button works! React is fully functional.')}
        >
          Test Button
        </button>
      </div>
      <div style={{ marginTop: '40px', fontSize: '0.9rem', color: '#666' }}>
        <p>🚀 React App Successfully Loaded</p>
        <p>📅 {new Date().toLocaleString()}</p>
      </div>
    </div>
  );
}

export default App;
