'use client';

import { useState } from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { 
  Users, 
  Truck, 
  Package, 
  MoreHorizontal,
  Building,
  Settings,
  BarChart3,
  Container,
  AlertTriangle,
  X,
  Home,
  User,
  LogOut,
  type LucideIcon 
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useSettings } from '@/context/SettingsContext';
import { useAuth } from '@/context/AuthContext';

interface NavItem {
  id: string;
  label: string;
  icon: LucideIcon;
  path: string;
  isPrimary?: boolean;
}

// Primary navigation items (always visible)
const primaryNavItems: NavItem[] = [
  {
    id: 'dashboard',
    label: 'Dashboard',
    icon: Home,
    path: '/',
    isPrimary: true,
  },
  {
    id: 'drivers',
    label: 'Drivers',
    icon: Users,
    path: '/drivers',
    isPrimary: true,
  },
  {
    id: 'trucks',
    label: 'Trucks',
    icon: Truck,
    path: '/trucks',
    isPrimary: true,
  },
  {
    id: 'loads',
    label: 'Loads',
    icon: Package,
    path: '/loads',
    isPrimary: true,
  },
];

// Secondary navigation items (in "More" menu)
const secondaryNavItems: NavItem[] = [
  {
    id: 'reports',
    label: 'Reports',
    icon: BarChart3,
    path: '/reports',
  },
  {
    id: 'trailers',
    label: 'Trailers',
    icon: Container,
    path: '/trailers',
  },
  {
    id: 'events',
    label: 'Events',
    icon: AlertTriangle,
    path: '/events',
  },
  {
    id: 'settings',
    label: 'Settings',
    icon: Settings,
    path: '/settings',
  },
];

export default function BottomNavigation() {
  const pathname = usePathname();
  const [showMoreMenu, setShowMoreMenu] = useState(false);
  const { preferences } = useSettings();
  const { logout } = useAuth();

  const handleLogout = async () => {
    setShowMoreMenu(false);
    await logout();
  };

  const isItemActive = (path: string) => {
    return path === '/' ? pathname === '/' : pathname.startsWith(path);
  };

  const isAnySecondaryActive = secondaryNavItems.some(item => isItemActive(item.path));

  return (
    <>      {/* More Menu Overlay */}
      {showMoreMenu && (        <div className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden" onClick={() => setShowMoreMenu(false)}>
          <div className="absolute bottom-20 left-4 right-4 bg-[var(--color-surface)] border border-[var(--color-neutral)]/30 shadow-xl overflow-hidden backdrop-blur-sm rounded-lg">
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-[var(--color-neutral)]/20 bg-[var(--color-surface)]">
              <h3 className="text-lg font-semibold text-[var(--color-text)]">More Options</h3>
              <button
                onClick={() => setShowMoreMenu(false)}
                className="p-2 text-[var(--color-text-secondary)] hover:text-[var(--color-text)] hover:bg-[var(--color-accent)]/10 transition-colors rounded"
                aria-label="Close more options menu"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            
            {/* Menu Items - Dynamic Layout */}
            <div className="p-0">
              {preferences.mobileMenuLayout === 'grid' ? (
                /* Grid Layout */
                <div className="grid grid-cols-2 gap-0 p-4">
                  {secondaryNavItems.map((item) => {
                    const isActive = isItemActive(item.path);
                    const Icon = item.icon;
                    
                    return (
                      <Link
                        key={item.id}
                        href={item.path}
                        onClick={() => setShowMoreMenu(false)}                        className={cn(
                          'flex flex-col items-center justify-center p-4 m-1 transition-all duration-200 text-sm font-medium border border-[var(--color-neutral)]/20 hover:shadow-md rounded-lg',
                          isActive 
                            ? 'bg-[var(--color-accent)] text-white border-[var(--color-accent)]' 
                            : 'text-[var(--color-text)] hover:bg-[var(--color-accent)]/10 hover:text-[var(--color-accent)] hover:border-[var(--color-accent)]/30 bg-[var(--color-background)]'
                        )}
                      >
                        <Icon 
                          size={24} 
                          className="mb-2 transition-colors duration-200" 
                        />
                        <span className="text-xs text-center font-medium leading-tight transition-opacity duration-200">
                          {item.label}
                        </span>                      </Link>
                    );
                  })}
                  
                  {/* Logout Button */}
                  <button
                    onClick={handleLogout}                    className={cn(
                      'flex flex-col items-center justify-center p-4 m-1 transition-all duration-200 text-sm font-medium border border-[var(--color-neutral)]/20 hover:shadow-md rounded-lg',
                      'text-red-600 hover:bg-red-50 hover:text-red-700 hover:border-red-300 bg-[var(--color-background)]'
                    )}
                  >
                    <LogOut 
                      size={24} 
                      className="mb-2 transition-colors duration-200" 
                    />
                    <span className="text-xs text-center font-medium leading-tight transition-opacity duration-200">
                      Logout
                    </span>
                  </button>
                </div>
              ) : (
                /* List Layout (Sidebar Style) */
                <>
                  {secondaryNavItems.map((item, index) => {
                    const isActive = isItemActive(item.path);
                    const Icon = item.icon;
                    
                    return (
                      <Link
                        key={item.id}
                        href={item.path}
                        onClick={() => setShowMoreMenu(false)}                        className={cn(
                          'flex items-center w-full px-6 py-4 transition-all duration-200 text-sm font-medium border-r-4',
                          isActive 
                            ? 'bg-[var(--color-accent)] text-white border-r-[var(--color-accent)]' 
                            : 'text-[var(--color-text)] hover:bg-[var(--color-accent)]/10 hover:text-[var(--color-accent)] border-r-transparent',
                          index !== secondaryNavItems.length - 1 && 'border-b border-[var(--color-neutral)]/10'
                        )}
                      >
                        <Icon 
                          size={20} 
                          className="mr-3 transition-colors duration-200" 
                        />
                        <span className="transition-opacity duration-200">
                          {item.label}
                        </span>                      </Link>
                    );
                  })}
                  
                  {/* Logout Button */}
                  <button
                    onClick={handleLogout}                    className={cn(
                      'flex items-center w-full px-6 py-4 transition-all duration-200 text-sm font-medium border-r-4',
                      'text-red-600 hover:bg-red-50 hover:text-red-700 border-r-transparent border-t border-[var(--color-neutral)]/10'
                    )}
                  >
                    <LogOut 
                      size={20} 
                      className="mr-3 transition-colors duration-200" 
                    />
                    <span className="transition-opacity duration-200">
                      Logout
                    </span>
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      )}{/* Bottom Navigation */}      <nav className="fixed bottom-0 left-0 right-0 border-t bg-[var(--color-surface)] border-[var(--color-neutral)]/20 px-0 py-0 md:hidden z-30 shadow-xl shadow-black/10 backdrop-blur-sm">
        <div className="flex items-center max-w-lg mx-auto">
          {/* Primary Navigation Items */}
          {primaryNavItems.map((item) => {
            const isActive = isItemActive(item.path);
            const Icon = item.icon;
            
            return (
              <Link
                key={item.id}
                href={item.path}                className={cn(
                  'flex flex-col items-center justify-center transition-all duration-200 text-sm font-medium flex-1 py-3 px-2 border-t-4',
                  isActive 
                    ? 'bg-[var(--color-accent)]/20 text-[var(--color-accent)] border-t-[var(--color-accent)]' 
                    : 'text-[var(--color-text-secondary)] hover:bg-[var(--color-accent)]/10 hover:text-[var(--color-accent)] border-t-transparent'
                )}
              >
                <Icon 
                  size={20} 
                  className="mb-1 transition-colors duration-200"
                />
                <span className="text-xs font-medium text-center leading-tight transition-opacity duration-200">
                  {item.label}
                </span>
              </Link>
            );
          })}

          {/* More Button */}
          <button
            onClick={() => setShowMoreMenu(!showMoreMenu)}            className={cn(
              'flex flex-col items-center justify-center transition-all duration-200 text-sm font-medium flex-1 py-3 px-2 border-t-4',
              showMoreMenu || isAnySecondaryActive 
                ? 'bg-[var(--color-accent)]/20 text-[var(--color-accent)] border-t-[var(--color-accent)]' 
                : 'text-[var(--color-text-secondary)] hover:bg-[var(--color-accent)]/10 hover:text-[var(--color-accent)] border-t-transparent'
            )}
          >
            <MoreHorizontal 
              size={20} 
              className="mb-1 transition-colors duration-200"
            />
            <span className="text-xs font-medium text-center leading-tight transition-opacity duration-200">
              More
            </span>
          </button>
        </div>
      </nav>
    </>
  );
}
