// Main entry point for the React application
import React from 'react';
import ReactDOM from 'react-dom/client';
import { ChakraProvider, extendTheme } from '@chakra-ui/react';
import { BrowserRouter } from 'react-router-dom';
import App from './App';

// Custom theme for CDC25 branding
const theme = extendTheme({
  colors: {
    brand: {
      50: '#E6F7FF',
      100: '#BAE7FF',
      200: '#91D5FF',
      300: '#69C0FF',
      400: '#40A9FF',
      500: '#1890FF', // Primary blue
      600: '#096DD9',
      700: '#0050B3',
      800: '#003A8C',
      900: '#002766',
    },
    space: {
      50: '#F7F9FC',
      100: '#E4E9F2',
      200: '#C5D2E7',
      300: '#A6B8D9',
      400: '#87A0CB',
      500: '#6B89BD', // Space blue
      600: '#546FA8',
      700: '#3E5693',
      800: '#293E7E',
      900: '#152669',
    }
  },
  fonts: {
    heading: '"Segoe UI", -apple-system, BlinkMacSystemFont, sans-serif',
    body: '"Segoe UI", -apple-system, BlinkMacSystemFont, sans-serif',
  },
  styles: {
    global: {
      body: {
        bg: 'gray.50',
      },
    },
  },
});

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <ChakraProvider theme={theme}>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </ChakraProvider>
  </React.StrictMode>
);