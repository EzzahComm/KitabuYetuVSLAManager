
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

const rootElement = document.getElementById('root');
if (rootElement) {
  const root = ReactDOM.createRoot(rootElement);
  // Removing StrictMode temporarily to stabilize hydration in the Google Apps Script iframe
  root.render(<App />);
} else {
  console.error("Critical Failure: Root element not found.");
}
