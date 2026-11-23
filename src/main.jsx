import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
// src/main.jsx
import { registerSW } from 'virtual:pwa-register';

// Registra el service worker
registerSW({
  onNeedRefresh() {
    console.log('Nueva versión disponible. Recarga para actualizar.');
  },
  onOfflineReady() {
    console.log('ReservaPro está lista para funcionar offline.');
  },
});