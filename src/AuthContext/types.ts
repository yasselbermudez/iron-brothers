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

export interface AuthContextType {
  user: User|null;
  loading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  register: (email:string, password:string, name:string, role:string) => Promise<boolean>
  logout: () => void;
  refreshUser: () => Promise<void>;
}