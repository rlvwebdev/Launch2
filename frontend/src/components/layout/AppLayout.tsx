'use client';

import BottomNavigation from '@/components/navigation/BottomNavigation';
import DesktopNavigation from '@/components/navigation/DesktopNavigation';
import MobileHeader from '@/components/layout/MobileHeader';
import { SidebarProvider, useSidebar } from '@/components/context/SidebarContext';
import { useAuth } from '@/context/AuthContext';
import { usePathname } from 'next/navigation';

interface AppLayoutProps {
  children: React.ReactNode;
}

function AppLayoutContent({ children }: AppLayoutProps) {
  const { isCollapsed } = useSidebar();
  const { isAuthenticated } = useAuth();
  const pathname = usePathname();
  
  // Check if current route should show navigation
  const showNavigation = isAuthenticated && !pathname.startsWith('/auth');
  
  if (!showNavigation) {
    return (
      <div className="min-h-screen bg-gray-50">
        {children}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-theme-background">
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
