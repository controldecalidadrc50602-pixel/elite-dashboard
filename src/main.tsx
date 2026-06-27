import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import { DemoModeProvider } from './context/DemoModeContext';
import './lib/i18n';
import App from './App';
import './index.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <div className="app-container">
      <BrowserRouter>
        <ThemeProvider>
          <DemoModeProvider>
            <AuthProvider>
              <App />
            </AuthProvider>
          </DemoModeProvider>
        </ThemeProvider>
      </BrowserRouter>
    </div>
  </StrictMode>
);

// ============================================================
// SERVICE WORKER CLEANUP — Fuerza la eliminación del SW y caches
// ============================================================
if ('serviceWorker' in navigator) {
  // Estrategia agresiva: buscamos TODAS las registraciones y las matamos
  navigator.serviceWorker.getRegistrations().then((registrations) => {
    for (const registration of registrations) {
      registration.unregister().then((success) => {
        if (success) {
          console.log('[SW Cleanup] Unregistered:', registration.scope);
        }
      });
    }
  });

  // Limpiamos todas las caches del navegador por si el SW ya las llenó
  if ('caches' in window) {
    caches.keys().then((names) => {
      for (const name of names) {
        caches.delete(name);
        console.log('[Cache Cleanup] Deleted cache:', name);
      }
    });
  }
}
