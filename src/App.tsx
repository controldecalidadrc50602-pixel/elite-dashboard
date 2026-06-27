import { Routes, Route, Navigate } from 'react-router-dom';
import { lazy, Suspense } from 'react';
import { useAuth } from './context/AuthContext';
import Login from './pages/Login';
import MainLayout from './components/Layout/MainLayout';
import Dashboard from './pages/Dashboard';
import ErrorBoundary from './components/common/ErrorBoundary';

// ============================================================
// LAZY LOADING: Portal se carga en un chunk completamente separado.
// Esto aísla Recharts del Dashboard y evita que ResponsiveContainer
// se evalúe cuando el usuario está en /portal/:slug.
// ============================================================
const PortalLayout = lazy(() => import('./components/Layout/PortalLayout'));
const Portal = lazy(() => import('./pages/Portal/Portal'));

// Fallback minimalista mientras carga el chunk
const ChunkLoading = () => (
  <div className="min-h-screen flex items-center justify-center bg-black">
    <div className="w-8 h-8 border-2 border-white/20 border-t-white/80 rounded-full animate-spin" />
  </div>
);

function App() {
  console.log('BUILD_VERSION_4.0_CODESPLIT — ' + new Date().toISOString());
  const { isAuthenticated, loading } = useAuth();

  if (loading) return null;

  return (
    <ErrorBoundary>
      <Routes>
        {/* Rutas Públicas (Capa de Exhibición) — Chunk separado */}
        <Route path="/portal" element={
          <Suspense fallback={<ChunkLoading />}>
            <PortalLayout />
          </Suspense>
        }>
          <Route path=":clientSlug" element={
            <Suspense fallback={<ChunkLoading />}>
              <Portal />
            </Suspense>
          } />
        </Route>

        <Route path="/login" element={!isAuthenticated ? <Login /> : <Navigate to="/" />} />
        
        <Route 
          path="/" 
          element={isAuthenticated ? <MainLayout /> : <Navigate to="/login" />}
        >
          <Route index element={<Navigate to="/dashboard" replace />} />
          <Route path="dashboard" element={<Dashboard activeTab="overview" />} />
          <Route path="clients" element={<Dashboard activeTab="clients" />} />
          <Route path="clients/:id" element={<Dashboard activeTab="clients" />} />
          <Route path="services" element={<Dashboard activeTab="services" />} />
          <Route path="trimestre" element={<Dashboard activeTab="status" />} />
          <Route path="archive" element={<Dashboard activeTab="archive" />} />
        </Route>

        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </ErrorBoundary>
  );
}

export default App;
