import { createContext, useState, useEffect, useCallback} from 'react';
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

  const fetchUser = useCallback( async () => {
    try {
      const response = await apiService.getCurrentUser()
      setUser(response);
    } catch (error) {
      console.error('Error fetching user:', error);
      logout();
    } finally {
      setLoading(false);
    }
  },[])

  useEffect(() => {
    // On mount, try to fetch current user; the browser will send the cookie automatically
    fetchUser();
  },[fetchUser]);

  const extractErrorMessage = (error: unknown): string => {
    if (axios.isAxiosError(error)) {
      const status = error.response?.status;
      const serverMessage = error.response?.data?.detail || error.response?.data?.message;
      console.error("Server Error Message: ",serverMessage)
      switch (status) {
        case 400:
          return "Datos inválidos. Verifica el formato de tu email.";
        case 401:
          return "Email o contraseña incorrectos. Por favor, inténtalo de nuevo.";
        case 404:
          return "Usuario no encontrado. Verifica tu email o regístrate.";
        case 409:
          return "Este email ya está registrado. Inicia sesión o usa otro email.";
        case 422:
          return "Datos de entrada inválidos. Verifica todos los campos.";
        default:
          return "Error en el servidor. Inténtalo más tarde.";
      }
    }
    return "Error de conexión. Verifica tu internet.";
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
        return {
          success:true,
          message:"Inicio de sesión exitoso"
        };
      } catch (error) {
        const errorMessage = extractErrorMessage(error)
        return {
          success:false,
          message:errorMessage
        };
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
      return {
        success:true,
        message:"Registro exitoso"
      };
    } catch (error) {
      const errorMessage = extractErrorMessage(error)
      return {
        success:false,
        message:errorMessage
      };
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