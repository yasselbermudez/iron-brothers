import type { ReactNode } from 'react';
import { useAuth } from '../AuthContext/auth-hooks';
import { Navigate, useLocation } from 'react-router-dom';
import Loader from './loader';

export interface AuthProviderProps {
  children: ReactNode;
}

const ProtectedRoute = ({ children }:AuthProviderProps) => {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950">
        <header className="bg-slate-900 p-0 border-b border-slate-700 text-white sticky top-0 z-50 backdrop-blur-sm bg-slate-900/80">
          <div className="max-w-7xl  mx-auto px-3 md:px-4 lg:px-5 py-3 md:py-4 lg:py-5">
            
                <div className="flex items-center space-x-2">
                  <img 
                    src="/icon.png" 
                    alt="Iron Brothers Logo" 
                    className="h-6 w-6 md:h-6 md:w-6 lg:h-7 lg:w-7 mr-1 object-contain"
                  />
                  <h1 className="text-3xl md:text-3xl lg:text-4xl mb-0.5 md:mb-1 lg:mb-1 font-bold text-white bg-gradient-to-r from-red-500 to-orange-500 bg-clip-text text-transparent">
                    Iron Brothers
                  </h1>
                </div>
            
          </div>
        </header>
        <main className="container items-center justify-center max-w-7xl mx-auto px-3 py-3 md:px-4 md:px-4  lg:py-5 lg:py-5">
          <Loader/>
        </main>
      </div>
    );
  }

  if (!user) {
    // Redirigir al login guardando la ubicación actual para volver después
    return <Navigate to="/" state={{ from: location }} replace />;
  }

  return children;
};

export default ProtectedRoute;