import { useState } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import MainLayout from './components/Layout/MainLayout';

function App() {
  const { isAuthenticated } = useAuth();
  const [activeTab, setActiveTab] = useState<'overview' | 'clients' | 'status' | 'tasks'>('overview');

  return (
    <Routes>
      <Route path="/login" element={!isAuthenticated ? <Login /> : <Navigate to="/" />} />
      <Route 
        path="/" 
        element={
          isAuthenticated ? (
            <MainLayout activeTab={activeTab} setActiveTab={setActiveTab}>
              <Dashboard activeTab={activeTab} />
            </MainLayout>
          ) : (
            <Navigate to="/login" />
          )
        } 
      />
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
}

export default App;
