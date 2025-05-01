import { ReactNode } from 'react';
import Header from './Header';
import Footer from './Footer';
import MobileNavigation from './MobileNavigation';
import { useMediaQuery } from '@/hooks/use-mobile';

interface LayoutProps {
  children: ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  const isMobile = useMediaQuery('(max-width: 640px)');

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {children}
        </div>
      </main>
      
      <Footer />
      
      {isMobile && <MobileNavigation />}
    </div>
  );
};

export default Layout;
