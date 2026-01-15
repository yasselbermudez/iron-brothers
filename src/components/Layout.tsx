import type { ReactNode } from 'react';
import Header from './header/Header';

interface AuthProviderProps {
  children: ReactNode;
}

const Layout = ({ children }:AuthProviderProps) => {

  return (
    <div className="min-h-screen bg-slate-950">
      <Header/>
      <main className="
        container max-w-7xl 
        mx-auto
        px-0 py-0 
        sm:px-2 sm:pb-2 
        md:px-4 md:pb-4 
        lg:px-5 lg:pb-5
      ">
        {children}
      </main>
    </div>
  );
};

export default Layout;