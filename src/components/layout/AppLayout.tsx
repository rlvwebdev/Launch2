'use client';

import BottomNavigation from '@/components/navigation/BottomNavigation';
import DesktopNavigation from '@/components/navigation/DesktopNavigation';

interface AppLayoutProps {
  children: React.ReactNode;
}

export default function AppLayout({ children }: AppLayoutProps) {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Desktop Navigation */}
      <DesktopNavigation />
      
      {/* Main Content */}
      <div className="md:ml-64">
        <main className="pb-20 md:pb-0">
          {children}
        </main>
      </div>
      
      {/* Mobile Bottom Navigation */}
      <BottomNavigation />
    </div>
  );
}
