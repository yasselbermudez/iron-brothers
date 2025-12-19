import type { ReactNode } from "react"

export interface User{
    id: string
    email: string
    name: string
    role: string
    created_at: string
    is_active: boolean
    group_id?:string
}

export interface AuthProviderProps {
  children: ReactNode;
}

export interface AuthResponse {
  success: boolean;
  message: string;
}

export interface AuthContextType {
  user: User|null;
  loading: boolean;
  login: (email: string, password: string) => Promise<AuthResponse>;
  register: (email:string, password:string, name:string, role:string) => Promise<AuthResponse>
  logout: () => void;
  refreshUser: () => Promise<void>;
}