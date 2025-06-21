/**
 * ProfessionalLayout - Enterprise-grade layout with adaptive navigation
 * Seamlessly switches between mobile bottom navigation and desktop sidebar
 */

'use client';

import React, { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import MobileBottomNav from '@/components/navigation/MobileBottomNav';
import DesktopSidebar from '@/components/navigation/DesktopSidebar';
import DesktopTopBar from '@/components/navigation/DesktopTopBar';
import TerminalSelector from '@/components/navigation/TerminalSelector';
import { useMediaQuery } from '@/hooks/useMediaQuery';

interface ProfessionalLayoutProps {
  children: React.ReactNode;
}

export function ProfessionalLayout({ children }: ProfessionalLayoutProps) {
  const pathname = usePathname();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [notificationCount, setNotificationCount] = useState(3);
  const isMobile = useMediaQuery('(max-width: 767px)'); // Mobile only below 768px
  // Auto-collapse sidebar on tablet/laptop resolutions
  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      // Collapse sidebar on tablet (768px) to large laptop (1440px) resolutions
      if (width >= 768 && width <= 1440) {
        setSidebarCollapsed(true);
      } else if (width > 1440) {
        // Expand sidebar on very large screens
        setSidebarCollapsed(false);
      }
    };

    // Initial check
    handleResize();

    // Listen for resize events
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Don't render navigation on auth page
  if (pathname === '/auth') {
    return <>{children}</>;
  }

  const handleSidebarToggle = () => {
    setSidebarCollapsed(!sidebarCollapsed);
  };

  const handleSearch = (query: string) => {
    console.log('Global search:', query);
    // Implement global search functionality
  };

  const handleNotifications = () => {
    console.log('Open notifications');
    // Implement notifications panel
  };
  if (isMobile) {
    return (
      <div className="min-h-screen bg-theme-background">
        {/* Mobile Layout with Terminal Selector and Bottom Navigation */}
        <main className="pb-20">          {/* Mobile Terminal Selector - Sticky at top */}
          <div className="sticky top-0 z-40 bg-theme-surface border-b border-neutral-200 px-4 py-3 shadow-sm">
            <TerminalSelector className="!p-0" />
          </div>
          
          <div className="px-4 sm:px-6">
            {children}
          </div>
        </main>
        
        {/* Mobile Bottom Navigation */}
        <MobileBottomNav 
          notificationCount={notificationCount}
          className="fixed bottom-0 left-0 right-0 z-50"
        />
      </div>
    );
  }
  return (
    <div className="min-h-screen bg-theme-background">
      {/* Desktop Layout with Sidebar */}
      <div className="flex h-screen">
        {/* Desktop Sidebar - Always show on desktop/tablet, collapsed on tablet/laptop */}
        <DesktopSidebar
          isCollapsed={sidebarCollapsed}
          onToggleCollapse={handleSidebarToggle}
          className="hidden sm:flex"
        />

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col">
          {/* Desktop Top Bar */}
          <DesktopTopBar
            onSearch={handleSearch}
            onNotifications={handleNotifications}
            notificationCount={notificationCount}
            className="hidden sm:flex"
          />

          {/* Main Content */}
          <main className="flex-1 overflow-auto">
            <div className="p-4 sm:p-6 lg:p-8">
              {children}
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}

export default ProfessionalLayout;
