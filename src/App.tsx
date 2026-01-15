import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './AuthContext/AuthContext';
import AuthForms from './components/AuthForm';
import Layout from './components/Layout';
import ProtectedRoute from './components/ProtectedRoute';

import Dashboard from './components/pages/Dashboard';
import Profiles from './components/pages/Profiles';
import Missions from './components/pages/Missions';
import Galery  from './components/pages/Galery';
import Consejo from "./components/pages/Consejo";
import { ToastProvider } from './contexts/ToastContext';

function App() {

  const navItems = [
    { id: 'main', label: '/main' },
    { id: 'profiles', label: '/profiles' },
    { id: 'missions', label: '/missions' },
    { id: 'galery', label: '/galery' },
    { id: 'consejo', label: '/consejo' },
  ];

  return (
    <AuthProvider>
      <ToastProvider>
      <BrowserRouter>
        <Routes>
          {/* Ruta para autenticación sin header */}
          <Route path="/" element={<AuthForms />} />
          
          {navItems.map((item) => (
            <Route path={item.label} element={
            <ProtectedRoute>
              <Layout >
                {item.id === 'main' && <Dashboard />}
                {item.id === 'profiles' && <Profiles />}
                {item.id === 'missions' && <Missions />}
                {item.id === 'galery' && <Galery />}
                {item.id === 'consejo' && <Consejo />}
              </Layout>
            </ProtectedRoute>
          } />
          ))}
          
          {/* Ruta por defecto - redirige a /main si está autenticado, sino al login */}
          <Route path="*" element={<Navigate to="/" replace />} />
          
        </Routes>
      </BrowserRouter>
      </ToastProvider>
    </AuthProvider>
  );
}

export default App;
