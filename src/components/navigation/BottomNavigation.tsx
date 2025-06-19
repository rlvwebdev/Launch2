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
  type LucideIcon 
} from 'lucide-react';
import { cn } from '@/lib/utils';

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
    id: 'organizations',
    label: 'Organizations',
    icon: Building,
    path: '/organizations',
  },
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

  const isItemActive = (path: string) => {
    return path === '/' ? pathname === '/' : pathname.startsWith(path);
  };

  const isAnySecondaryActive = secondaryNavItems.some(item => isItemActive(item.path));

  return (
    <>
      {/* More Menu Overlay */}
      {showMoreMenu && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden" onClick={() => setShowMoreMenu(false)}>
          <div className="absolute bottom-20 left-4 right-4 bg-white rounded-lg shadow-xl p-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">More Options</h3>
              <button
                onClick={() => setShowMoreMenu(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="grid grid-cols-2 gap-3">
              {secondaryNavItems.map((item) => {
                const isActive = isItemActive(item.path);
                const Icon = item.icon;
                
                return (
                  <Link
                    key={item.id}
                    href={item.path}
                    onClick={() => setShowMoreMenu(false)}
                    className={cn(
                      'flex flex-col items-center justify-center p-4 rounded-lg transition-colors min-h-[80px]',
                      isActive 
                        ? 'text-blue-600 bg-blue-50 border border-blue-200' 
                        : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50 border border-gray-200'
                    )}
                  >
                    <Icon 
                      size={24} 
                      className={cn(
                        'mb-2',
                        isActive ? 'text-blue-600' : 'text-gray-500'
                      )} 
                    />
                    <span 
                      className={cn(
                        'text-sm font-medium text-center',
                        isActive ? 'text-blue-600' : 'text-gray-600'
                      )}
                    >
                      {item.label}
                    </span>
                  </Link>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-2 py-2 md:hidden z-30">
        <div className="flex justify-around items-center max-w-lg mx-auto">
          {/* Primary Navigation Items */}
          {primaryNavItems.map((item) => {
            const isActive = isItemActive(item.path);
            const Icon = item.icon;
            
            return (
              <Link
                key={item.id}
                href={item.path}
                className={cn(
                  'flex flex-col items-center justify-center p-1.5 rounded-lg transition-colors min-w-[44px] min-h-[44px] flex-1',
                  isActive 
                    ? 'text-blue-600 bg-blue-50' 
                    : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                )}
              >
                <Icon 
                  size={20} 
                  className={cn(
                    'mb-0.5',
                    isActive ? 'text-blue-600' : 'text-gray-500'
                  )} 
                />
                <span 
                  className={cn(
                    'text-xs font-medium text-center leading-tight',
                    isActive ? 'text-blue-600' : 'text-gray-500'
                  )}
                >
                  {item.label}
                </span>
              </Link>
            );
          })}

          {/* More Button */}
          <button
            onClick={() => setShowMoreMenu(!showMoreMenu)}
            className={cn(
              'flex flex-col items-center justify-center p-1.5 rounded-lg transition-colors min-w-[44px] min-h-[44px] flex-1',
              showMoreMenu || isAnySecondaryActive
                ? 'text-blue-600 bg-blue-50' 
                : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
            )}
          >
            <MoreHorizontal 
              size={20} 
              className={cn(
                'mb-0.5',
                showMoreMenu || isAnySecondaryActive ? 'text-blue-600' : 'text-gray-500'
              )} 
            />
            <span 
              className={cn(
                'text-xs font-medium text-center leading-tight',
                showMoreMenu || isAnySecondaryActive ? 'text-blue-600' : 'text-gray-500'
              )}
            >
              More
            </span>
          </button>
        </div>
      </nav>
    </>
  );
}
