import { createContext, useState, useEffect} from 'react';
import axios from 'axios';
import apiService from "../services/api.service"
import type {User,AuthProviderProps,AuthContextType} from "./types"

// Crear el contexto
const AuthContext = createContext<AuthContextType|undefined>(undefined);

// Proveedor del contexto
export const AuthProvider = ({ children }:AuthProviderProps) => {
  const [user, setUser] = useState<User|null>(null);
  const [loading, setLoading] = useState(true);

  // Ensure axios sends cookies (for HttpOnly cookie-based auth)
  axios.defaults.withCredentials = true;

  useEffect(() => {
    // On mount, try to fetch current user; the browser will send the cookie automatically
    fetchUser();
  },[]);

   const fetchUser = async () => {
    try {
      const response = await apiService.getCurrentUser()
      setUser(response);
    } catch (error) {
      console.error('Error fetching user:', error);
      logout();
    } finally {
      setLoading(false);
    }
  };

  const refreshUser = async () => {
    try {
      setLoading(true);
      const response = await apiService.getCurrentUser();
      setUser(response);
    } catch (error) {
      console.error('Error refreshing user:', error);
      // No hacemos logout aquí para no cerrar sesión por errores temporales
    } finally {
      setLoading(false);
    }
  };

  const login = async (email:string, password:string) => {
      try {
        const userData = await apiService.login(email,password)
        // Assume backend sets HttpOnly cookie on successful login when request is sent with credentials.
        // If backend also returns user data, use it; otherwise fetch user separately.
        if (userData) {
          setUser(userData);
        } else {
          await fetchUser();
        }
        return true;
      } catch (error) {
        console.error('Register error in login retornamos false:', error);
        return false;
      }
      
  };

  const register = async (email:string, password:string, name:string, role:string) => {
    try {
     
      const userData = await apiService.register(email, password, name, role)
      // Assume backend sets HttpOnly cookie on successful registration when request is sent with credentials.
      if (userData) {
        setUser(userData);
      } else {
        await fetchUser();
      }
      return true;
    } catch (error) {
      console.error('Register error:', error);
      return false;
    }
  };

  const logout = async () => {
    try {
      await apiService.logout()
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      setUser(null);
      delete axios.defaults.headers.common['Authorization'];
    }
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, loading, refreshUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;