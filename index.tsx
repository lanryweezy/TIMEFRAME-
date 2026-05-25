console.log("INDEX.TSX: TOP-LEVEL EXECUTION START");
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';
import { ErrorBoundary } from './components/ErrorBoundary';

console.log("INDEX.TSX: LIBRARIES IMPORTED SUCCESSFULLY");

const rootElement = document.getElementById('root');
if (!rootElement) {
  console.error("INDEX.TSX: COULD NOT FIND ROOT ELEMENT");
  throw new Error('Could not find root element to mount to');
}

console.log("INDEX.TSX: ROOT ELEMENT FOUND, CREATING REACT ROOT");

const root = ReactDOM.createRoot(rootElement);

console.log("INDEX.TSX: REACT ROOT CREATED, CALLING RENDER");

root.render(
  <React.StrictMode>
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  </React.StrictMode>,
);

console.log("INDEX.TSX: RENDER CALL COMPLETED");
