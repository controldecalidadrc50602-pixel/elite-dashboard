import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import Login from './pages/Login';
import MainLayout from './components/Layout/MainLayout';

function App() {
  const { isAuthenticated } = useAuth();

  return (
    <Routes>
      <Route path="/login" element={!isAuthenticated ? <Login /> : <Navigate to="/" />} />
      <Route 
        path="/" 
        element={
          isAuthenticated ? (
            <MainLayout />
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
