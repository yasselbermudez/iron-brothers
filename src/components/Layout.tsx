import type { ReactNode } from 'react';
import Header from './Header'; // Tu componente Header

interface AuthProviderProps {
  children: ReactNode;
}

const Layout = ({ children }:AuthProviderProps) => {

  return (
    <div className="min-h-screen bg-slate-950">
      <Header/>
      <main className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 lg:py-8">
        {children}
      </main>
    </div>
  );
};

export default Layout;