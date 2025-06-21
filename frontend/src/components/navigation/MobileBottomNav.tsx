/**
 * MobileBottomNav - Professional mobile navigation with more menu
 * Modern tab bar design optimized for one-handed use and driver operations
 */

'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import {
  HomeIcon,
  TruckIcon,
  ClipboardDocumentListIcon,
  ChartBarIcon,
  EllipsisHorizontalIcon,
  UserIcon,
  Cog6ToothIcon,
  BuildingOfficeIcon,
  AcademicCapIcon,
  BuildingOffice2Icon,
  ExclamationTriangleIcon,
  XMarkIcon
} from '@heroicons/react/24/outline';
import {
  HomeIcon as HomeIconSolid,
  TruckIcon as TruckIconSolid,
  ClipboardDocumentListIcon as ClipboardIconSolid,
  ChartBarIcon as ChartIconSolid,
  EllipsisHorizontalIcon as EllipsisHorizontalIconSolid,
  UserIcon as UserIconSolid,
  Cog6ToothIcon as CogIconSolid,
  BuildingOfficeIcon as BuildingOfficeIconSolid,
  AcademicCapIcon as AcademicCapIconSolid,
  BuildingOffice2Icon as BuildingOffice2IconSolid,
  ExclamationTriangleIcon as ExclamationTriangleIconSolid
} from '@heroicons/react/24/solid';

interface NavItem {
  id: string;
  label: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  iconSolid: React.ComponentType<{ className?: string }>;
  badge?: number;
}

interface MoreMenuItem {
  id: string;
  label: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  iconSolid: React.ComponentType<{ className?: string }>;
  description?: string;
}

interface MobileBottomNavProps {
  notificationCount?: number;
  className?: string;
}

const navItems: NavItem[] = [
  {
    id: 'dashboard',
    label: 'Home',
    href: '/',
    icon: HomeIcon,
    iconSolid: HomeIconSolid
  },
  {
    id: 'fleet',
    label: 'Fleet',
    href: '/trucks',
    icon: TruckIcon,
    iconSolid: TruckIconSolid
  },
  {
    id: 'loads',
    label: 'Loads',
    href: '/loads',
    icon: ClipboardDocumentListIcon,
    iconSolid: ClipboardIconSolid,
    badge: 3
  },
  {
    id: 'reports',
    label: 'Reports',
    href: '/reports',
    icon: ChartBarIcon,
    iconSolid: ChartIconSolid
  }
];

const moreMenuItems: MoreMenuItem[] = [
  {
    id: 'drivers',
    label: 'Drivers',
    href: '/drivers',
    icon: UserIcon,
    iconSolid: UserIconSolid,
    description: 'Driver management'
  },
  {
    id: 'trailers',
    label: 'Trailers',
    href: '/trailers',
    icon: TruckIcon,
    iconSolid: TruckIconSolid,
    description: 'Trailer fleet'
  },
  {
    id: 'organizations',
    label: 'Organizations',
    href: '/organizations',
    icon: BuildingOfficeIcon,
    iconSolid: BuildingOfficeIconSolid,
    description: 'Company structure'
  },
  {
    id: 'settings',
    label: 'Settings',
    href: '/settings',
    icon: Cog6ToothIcon,
    iconSolid: CogIconSolid,
    description: 'App preferences'
  },
  {
    id: 'academy',
    label: 'Academy',
    href: '/academy',
    icon: AcademicCapIcon,
    iconSolid: AcademicCapIconSolid,
    description: 'TMS tutorials'
  },
  {
    id: 'directory',
    label: 'Directory',
    href: '/directory',
    icon: BuildingOffice2Icon,
    iconSolid: BuildingOffice2IconSolid,
    description: 'Departments & terminals'
  },
  {
    id: 'report-bug',
    label: 'Report Bug',
    href: '/report-bug',
    icon: ExclamationTriangleIcon,
    iconSolid: ExclamationTriangleIconSolid,
    description: 'Submit tickets'
  }
];

const MobileBottomNav: React.FC<MobileBottomNavProps> = ({
  notificationCount = 0,
  className
}) => {
  const pathname = usePathname();
  const [showMoreMenu, setShowMoreMenu] = useState(false);

  const isActiveRoute = (href: string): boolean => {
    if (href === '/') {
      return pathname === '/';
    }
    return pathname.startsWith(href);
  };

  const isMoreMenuActive = (): boolean => {
    return moreMenuItems.some(item => isActiveRoute(item.href));
  };

  return (
    <>
      {/* More Menu Overlay */}
      {showMoreMenu && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-modal-backdrop md:hidden">
          <div className="absolute bottom-0 left-0 right-0 bg-white rounded-t-2xl p-6 pb-safe">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-neutral-900">More Apps</h3>
              <button
                onClick={() => setShowMoreMenu(false)}
                className="p-2 rounded-lg hover:bg-neutral-100 transition-colors duration-fast"
                title="Close menu"
              >
                <XMarkIcon className="h-5 w-5 text-neutral-500" />
              </button>
            </div>

            {/* Grid of More Items */}
            <div className="grid grid-cols-3 gap-4 mb-6">
              {moreMenuItems.map((item) => {
                const isActive = isActiveRoute(item.href);
                const Icon = isActive ? item.iconSolid : item.icon;
                
                return (
                  <Link
                    key={item.id}
                    href={item.href}
                    onClick={() => setShowMoreMenu(false)}
                    className={cn(
                      'flex flex-col items-center p-4 rounded-xl transition-all duration-fast',
                      'min-h-[80px] justify-center text-center',
                      {
                        'bg-primary-50 text-primary-600': isActive,
                        'text-neutral-600 hover:text-neutral-900 hover:bg-neutral-50': !isActive
                      }
                    )}
                  >
                    <Icon className="h-6 w-6 mb-2" />
                    <span className="text-xs font-medium mb-1">{item.label}</span>
                    {item.description && (
                      <span className="text-xs text-neutral-500 leading-tight">{item.description}</span>
                    )}
                  </Link>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Bottom Navigation Bar */}
      <nav className={cn(
        'fixed bottom-0 left-0 right-0 z-fixed md:hidden',
        'bg-white/95 backdrop-blur-lg border-t border-neutral-200',
        'shadow-nav',
        className
      )}>
        {/* Notification Badge */}
        {notificationCount > 0 && (
          <div className="absolute -top-2 right-6 z-10">
            <div className="bg-error-500 text-white text-xs font-bold rounded-full h-6 w-6 flex items-center justify-center shadow-md animate-pulse-soft">
              {notificationCount > 99 ? '99+' : notificationCount}
            </div>
          </div>
        )}

        <div className="px-6 py-2">
          <div className="flex items-center justify-between">
            {/* Navigation Items */}
            {navItems.map((item) => {
              const isActive = isActiveRoute(item.href);
              const Icon = isActive ? item.iconSolid : item.icon;
              
              return (
                <Link
                  key={item.id}
                  href={item.href}
                  className={cn(
                    'flex flex-col items-center justify-center py-2 px-3 rounded-xl transition-all duration-fast relative',
                    'min-w-[44px] min-h-[44px]', // Touch target size
                    {
                      'text-primary-600 bg-primary-50': isActive,
                      'text-neutral-500 hover:text-neutral-700 hover:bg-neutral-50': !isActive
                    }
                  )}
                >
                  <div className="relative">
                    <Icon className={cn(
                      'h-6 w-6 transition-transform duration-fast',
                      isActive && 'scale-110'
                    )} />
                    {item.badge && (
                      <div className="absolute -top-2 -right-2 bg-error-500 text-white text-xs font-bold rounded-full h-4 w-4 flex items-center justify-center">
                        {item.badge}
                      </div>
                    )}
                  </div>
                  <span className={cn(
                    'text-xs font-medium mt-1 transition-colors duration-fast',
                    {
                      'text-primary-600': isActive,
                      'text-neutral-500': !isActive
                    }
                  )}>
                    {item.label}
                  </span>
                  
                  {/* Active indicator */}
                  {isActive && (
                    <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-primary-600 rounded-full" />
                  )}
                </Link>
              );
            })}

            {/* More Button */}
            <button
              onClick={() => setShowMoreMenu(!showMoreMenu)}
              className={cn(
                'flex flex-col items-center justify-center py-2 px-3 rounded-xl transition-all duration-fast relative',
                'min-w-[44px] min-h-[44px]', // Touch target size
                {
                  'text-primary-600 bg-primary-50': isMoreMenuActive(),
                  'text-neutral-500 hover:text-neutral-700 hover:bg-neutral-50': !isMoreMenuActive()
                }
              )}
              title="More options"
            >
              <div className="relative">
                <EllipsisHorizontalIcon className={cn(
                  'h-6 w-6 transition-transform duration-fast',
                  isMoreMenuActive() && 'scale-110'
                )} />
              </div>
              <span className={cn(
                'text-xs font-medium mt-1 transition-colors duration-fast',
                {
                  'text-primary-600': isMoreMenuActive(),
                  'text-neutral-500': !isMoreMenuActive()
                }
              )}>
                More
              </span>
              
              {/* Active indicator */}
              {isMoreMenuActive() && (
                <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-primary-600 rounded-full" />
              )}
            </button>
          </div>
        </div>

        {/* Safe area padding for devices with home indicator */}
        <div className="pb-safe" />
      </nav>
    </>
  );
};

export default MobileBottomNav;
