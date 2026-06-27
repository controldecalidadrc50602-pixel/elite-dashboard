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

// Service Worker Unregistration to clear aggressive caching
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.ready.then(registration => {
    registration.unregister().then(boolean => {
      if (boolean) {
        console.log('SW Unregistered successfully.');
      }
    });
  });
}
