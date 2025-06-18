'use client';

import BottomNavigation from '@/components/navigation/BottomNavigation';
import DesktopNavigation from '@/components/navigation/DesktopNavigation';
import MobileHeader from '@/components/layout/MobileHeader';
import { SidebarProvider, useSidebar } from '@/components/context/SidebarContext';

interface AppLayoutProps {
  children: React.ReactNode;
}

function AppLayoutContent({ children }: AppLayoutProps) {
  const { isCollapsed } = useSidebar();
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Desktop Navigation */}
      <DesktopNavigation />
      
      {/* Mobile Header */}
      <MobileHeader />
      
      {/* Main Content */}
      <div className={`transition-all duration-300 ${
        isCollapsed ? 'md:ml-16' : 'md:ml-64'
      }`}>
        <main className="pb-20 md:pb-0">
          {children}
        </main>
      </div>
      
      {/* Mobile Bottom Navigation */}
      <BottomNavigation />
    </div>
  );
}

export default function AppLayout({ children }: AppLayoutProps) {
  return (
    <SidebarProvider>
      <AppLayoutContent>{children}</AppLayoutContent>
    </SidebarProvider>
  );
}
