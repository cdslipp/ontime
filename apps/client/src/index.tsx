import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';

import App from './App';

import './index.scss';

// Register PWA service worker for installability
// Note: This is a minimal, network-only PWA - Ontime requires LAN connectivity
if ('serviceWorker' in navigator) {
  // Auto-update without prompting - appropriate for signage/displays
  navigator.serviceWorker.register('/sw.js', { scope: '/' }).catch((err) => {
    console.error('PWA service worker registration failed:', err);
  });

  // Listen for new service workers and activate them immediately
  navigator.serviceWorker.addEventListener('controllerchange', () => {
    console.log('PWA service worker updated');
  });
}

const container = document.getElementById('root');
const root = createRoot(container as Element);

root.render(
  <StrictMode>
    <App />
  </StrictMode>,
);
