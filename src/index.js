import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';

import { createTheme, ThemeProvider } from '@mui/material';

const theme = createTheme({
  palette: {
    mode: "dark"
  },
  breakpoints: {
    values: {
      xxs: 0, // small phone
      xs: 425, // phone
      sm: 600, // tablets
      md: 900, // small laptop
      lg: 1200, // desktop
      xl: 1536 // large screens
    }
  },
  components: {
    MuiPaper: {
      styleOverrides: {
        root: { background: 'transparent' }
      }
    }
  }
})

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <ThemeProvider theme={theme}>
      <App />
    </ThemeProvider>
  </React.StrictMode>
);

