import type { ReactNode } from 'react';
import Header from './Header'; // Tu componente Header

interface AuthProviderProps {
  children: ReactNode;
}

const Layout = ({ children }:AuthProviderProps) => {

  return (
    <div className="min-h-screen bg-slate-950">
      <Header/>
      <main className="container max-w-7xl mx-auto px-3 py-3 md:px-4 md:px-4  lg:py-5 lg:py-5">
        {children}
      </main>
    </div>
  );
};

export default Layout;