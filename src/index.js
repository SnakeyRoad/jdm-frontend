import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { ScoreProvider } from './contexts/ScoreContext';
import reportWebVitals from './reportWebVitals';

// Create root and render app
const rootElement = document.getElementById('root');
if (!rootElement) throw new Error('Failed to find the root element');

const root = ReactDOM.createRoot(rootElement);

// Wrap the render in a try-catch to handle hydration issues gracefully
try {
  root.render(
    <React.StrictMode>
      <ScoreProvider>
        <App />
      </ScoreProvider>
    </React.StrictMode>
  );
} catch (error) {
  console.error('Error during app initialization:', error);
  // Fallback rendering without StrictMode if there's an error
  root.render(
    <ScoreProvider>
      <App />
    </ScoreProvider>
  );
}

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
