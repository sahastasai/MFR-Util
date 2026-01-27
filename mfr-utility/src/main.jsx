// src/main.jsx
import { Buffer } from 'buffer';
import process from 'process';

// --- POLYFILL FIX (Makes the browser act like Node.js for the PDF engine) ---
window.global = window;
window.process = process;
window.Buffer = Buffer;
// --------------------------------------------------------------------------

import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)