import type { ReactNode } from 'react';
import { useAuth } from '../AuthContext/auth-hooks';
import { Navigate, useLocation } from 'react-router-dom';

export interface AuthProviderProps {
  children: ReactNode;
}

const ProtectedRoute = ({ children }:AuthProviderProps) => {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-950">
        <div className="text-white text-lg">Cargando...</div>
      </div>
    );
  }

  if (!user) {
    // Redirigir al login guardando la ubicación actual para volver después
    return <Navigate to="/" state={{ from: location }} replace />;
  }

  console.log({user})
  return children;
};

export default ProtectedRoute;