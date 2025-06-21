'use client';

import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { 
  Users, 
  Truck, 
  Package, 
  Settings,
  ChevronRight,
  ChevronLeft,
  Home,
  BarChart3,
  Building,
  Container,
  AlertTriangle,
  User,
  Triangle,
  type LucideIcon 
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useSidebar } from '@/components/context/SidebarContext';

interface NavItem {
  id: string;
  label: string;
  icon: LucideIcon;
  path: string;
}

const navItems: NavItem[] = [
  // Dashboard - Overview and starting point
  {
    id: 'dashboard',
    label: 'Dashboard',
    icon: Home,
    path: '/',
  },
  
  // Core Operations - Daily workflow items
  {
    id: 'loads',
    label: 'Loads',
    icon: Package,
    path: '/loads',
  },
  {
    id: 'drivers',
    label: 'Drivers',
    icon: Users,
    path: '/drivers',
  },
  {
    id: 'trucks',
    label: 'Trucks',
    icon: Truck,
    path: '/trucks',
  },
  {
    id: 'trailers',
    label: 'Trailers',
    icon: Container,
    path: '/trailers',
  },
  
  // Management & Monitoring
  {
    id: 'events',
    label: 'Events',
    icon: AlertTriangle,
    path: '/events',
  },
  {
    id: 'reports',
    label: 'Reports',
    icon: BarChart3,
    path: '/reports',
  },
];

const bottomNavItems: NavItem[] = [
  {
    id: 'account',
    label: 'My Account',
    icon: User,
    path: '/settings',
  },
];

export default function DesktopNavigation() {
  const pathname = usePathname();
  const { isCollapsed, toggleSidebar } = useSidebar();

  return (
    <nav className={cn(
      "hidden md:flex md:flex-col md:fixed md:inset-y-0 transition-all duration-300 bg-[var(--theme-primary)]",
      isCollapsed ? "md:w-16" : "md:w-64"
    )}>      {/* Header with toggle button */}
      <div className={cn(
        "flex items-center bg-[var(--theme-primary)] border-b border-white/20",
        isCollapsed ? "p-4 justify-center" : "p-6 justify-between"
      )}>
        {/* Logo - only show when not collapsed and hide on mobile */}
        {!isCollapsed && (
          <div className="font-bold text-white tracking-wide text-2xl hidden md:block">
            L<span className="text-[var(--theme-accent)]">A</span>UNCH
          </div>
        )}
        <button
          onClick={toggleSidebar}
          className={cn(
            "p-2 transition-colors bg-white/10 hover:bg-white/20 text-white",
            isCollapsed && "w-8 h-8 flex items-center justify-center"
          )}
          title={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          {isCollapsed ? (
            <ChevronRight size={20} />
          ) : (
            <ChevronLeft size={20} />
          )}        </button>
      </div>

      <div className="flex-1 flex flex-col"><ul className="flex-1 mt-0">
          {navItems.map((item) => {
            // Fix active state detection - exact match for root path, startsWith for others
            const isActive = item.path === '/' ? pathname === '/' : pathname.startsWith(item.path);
            const Icon = item.icon;
            
            return (
              <li key={item.id}>
                <Link
                  href={item.path}
                  className={cn(
                    'flex items-center transition-all duration-200 text-sm font-medium group relative w-full border-r-4',
                    isCollapsed ? 'p-4 justify-center' : 'px-6 py-4',
                    isActive 
                      ? 'bg-[var(--theme-secondary)] text-white border-r-[var(--theme-accent)]' 
                      : 'text-white/70 hover:bg-white/10 hover:text-white border-r-transparent'
                  )}
                  title={isCollapsed ? item.label : undefined}
                >
                  <Icon 
                    size={20} 
                    className={cn(
                      isCollapsed ? '' : 'mr-3',
                      'transition-colors duration-200'
                    )}
                  />
                  {!isCollapsed && (
                    <span className="transition-opacity duration-200">
                      {item.label}
                    </span>
                  )}
                  
                  {/* Tooltip for collapsed state */}
                  {isCollapsed && (
                    <div className="absolute left-full ml-2 px-3 py-2 bg-gray-900 text-white text-xs opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-50 shadow-lg">
                      {item.label}
                    </div>
                  )}
                </Link>
              </li>
            );
          })}
        </ul>        {/* Bottom Navigation Items */}
        <ul className="mb-0">
          {bottomNavItems.map((item) => {
            // Fix active state detection - exact match for root path, startsWith for others
            const isActive = item.path === '/' ? pathname === '/' : pathname.startsWith(item.path);
            const Icon = item.icon;
            
            return (
              <li key={item.id}>
                <Link
                  href={item.path}
                  className={cn(
                    'flex items-center transition-all duration-200 text-sm font-medium group relative w-full border-r-4',
                    isCollapsed ? 'p-4 justify-center' : 'px-6 py-4',
                    isActive 
                      ? 'bg-[var(--theme-secondary)] text-white border-r-[var(--theme-accent)]' 
                      : 'text-white/70 hover:bg-white/10 hover:text-white border-r-transparent'
                  )}
                  title={isCollapsed ? item.label : undefined}
                >
                  <Icon 
                    size={20} 
                    className={cn(
                      isCollapsed ? '' : 'mr-3',
                      'transition-colors duration-200'
                    )}
                  />
                  {!isCollapsed && (
                    <span className="transition-opacity duration-200">
                      {item.label}
                    </span>
                  )}
                  
                  {/* Tooltip for collapsed state */}
                  {isCollapsed && (
                    <div className="absolute left-full ml-2 px-3 py-2 bg-gray-900 text-white text-xs opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-50 shadow-lg">
                      {item.label}
                    </div>
                  )}
                </Link>
              </li>
            );
          })}
        </ul>
      </div>      {/* Bottom Section - User Menu and Status */}
      <div 
        className={cn(
          "border-t border-white/20 bg-[var(--theme-primary)]",
          isCollapsed ? "p-2" : "p-4"
        )}
      >
        {!isCollapsed && (
          <div className="space-y-3">
            <div className="text-xs text-white/60">
              Version 1.0.0
            </div>
          </div>
        )}
        {isCollapsed && (
          <div className="w-2 h-2 bg-[var(--theme-accent)] rounded-full mx-auto" title="System Online" />
        )}
      </div>
    </nav>
  );
}
