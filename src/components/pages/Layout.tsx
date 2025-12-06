import type { ReactNode } from 'react';
import Header from './Header'; // Tu componente Header

interface AuthProviderProps {
  children: ReactNode;
}

const Layout = ({ children }:AuthProviderProps) => {

  return (
    <div className="min-h-screen bg-slate-950">
      <Header/>
      <main className="container mx-auto px-4 py-6">
        {children}
      </main>
    </div>
  );
};

export default Layout;