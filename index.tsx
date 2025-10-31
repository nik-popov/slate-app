import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './src/index.css';

console.log('🚀 Starting React app...');

const rootElement = document.getElementById('root');
console.log('🔍 Root element found:', rootElement);

if (!rootElement) {
  console.error('❌ Root element not found!');
  throw new Error("Could not find root element to mount to");
}

console.log('📦 Creating React root...');
const root = ReactDOM.createRoot(rootElement);

console.log('🎨 Rendering App component...');
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

console.log('✅ App should be rendered now');
