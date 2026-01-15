import { createContext, useState, type ReactNode } from "react";

export interface ToastProviderProps {
  children: ReactNode;
}

export interface ToastContextType {
  addToast: (message: string, type?: string, duration?: number) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

interface Toast{
  id:number,
  message:string,
  type:string,
}

export  function ToastProvider({ children }:ToastProviderProps) {
      const [toasts, setToasts] = useState<Toast[]>([]);
      
      const addToast = (message:string, type = 'success', duration = 3000) => {
        const id = Date.now();
        setToasts(prevToasts => [...prevToasts, { id, message, type }]);
        
        setTimeout(() => {
          setToasts(prevToasts => prevToasts.filter(toast => toast.id !== id));
        }, duration);
      };
      
      return (
        <ToastContext.Provider value={{ addToast }}>
          {children}
          <div className="fixed top-5 left-1/2 transform -translate-x-1/2 flex flex-col items-center gap-2 z-60 w-full max-w-md px-4">
            {toasts.map(toast => (
              <div 
                key={toast.id} 
                className={`p-3 rounded-xl border-2 slide-down w-full text-center ${
                  toast.type === 'success' 
                    ? 'border-green-400 text-green-400 bg-green-900/60' 
                    : toast.type === 'error' 
                    ? 'border-red-400 text-red-400 bg-red-900/60' 
                    : 'border-blue-400 text-blue-400 bg-blue-900/60'
                }`}
              >
                <span className="text-sm font-semibold">{toast.message}</span>
              </div>
            ))}
          </div>
        </ToastContext.Provider>
      );
}

export default ToastContext