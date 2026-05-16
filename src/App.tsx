import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import Login from './pages/Login';
import MainLayout from './components/Layout/MainLayout';
import Dashboard from './pages/Dashboard';
import ErrorBoundary from './components/common/ErrorBoundary';

function App() {
  const { isAuthenticated, loading } = useAuth();

  if (loading) return null;

  return (
    <ErrorBoundary>
      <Routes>
        <Route path="/login" element={!isAuthenticated ? <Login /> : <Navigate to="/" />} />
        
        <Route 
          path="/" 
          element={isAuthenticated ? <MainLayout /> : <Navigate to="/login" />}
        >
          <Route index element={<Navigate to="/dashboard" replace />} />
          <Route path="dashboard" element={<Dashboard activeTab="overview" />} />
          <Route path="clients" element={<Dashboard activeTab="clients" />} />
          <Route path="clients/:id" element={<Dashboard activeTab="clients" />} />
          <Route path="trimestre" element={<Dashboard activeTab="status" />} />
          <Route path="archive" element={<Dashboard activeTab="archive" />} />
        </Route>

        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </ErrorBoundary>
  );
}

export default App;
