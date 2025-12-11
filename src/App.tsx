import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './AuthContext/AuthContext';
import AuthForms from './components/pages/AuthForm';
import Layout from './components/pages/Layout';
import ProtectedRoute from './components/pages/ProtectedRoute';

import Dashboard from './components/pages/Dashboard';
import PokerRanking from './components/pages/Poker';
import Gym from './components/pages/Gym';
import Missions from './components/pages/Missions';
import Galery  from './components/pages/Galery';
import ConsejoEpico from "./components/pages/Consejo";

function App() {

  const navItems = [
    { id: 'main', label: '/main' },
    { id: 'gym', label: '/gym' },
    { id: 'poker', label: '/poker' },
    { id: 'missions', label: '/missions' },
    { id: 'galery', label: '/galery' },
    { id: 'consejo', label: '/consejo' },
  ];

  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Ruta para autenticación sin header */}
          <Route path="/" element={<AuthForms />} />
          
          {navItems.map((item) => (
            <Route path={item.label} element={
            <ProtectedRoute>
              <Layout >
                {item.id === 'main' && <Dashboard />}
                {item.id === 'poker' && <PokerRanking />}
                {item.id === 'gym' && <Gym />}
                {item.id === 'missions' && <Missions />}
                {item.id === 'galery' && <Galery />}
                {item.id === 'consejo' && <ConsejoEpico />}
              </Layout>
            </ProtectedRoute>
          } />
          ))}
          
          {/* Ruta por defecto - redirige a /main si está autenticado, sino al login */}
          <Route path="*" element={<Navigate to="/" replace />} />
          
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
