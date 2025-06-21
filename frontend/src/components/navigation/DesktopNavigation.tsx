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
  Book,
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
  return (    <nav className={cn(
      "hidden md:flex md:flex-col md:fixed md:inset-y-0 transition-all duration-300",
      "bg-[var(--color-accent)] shadow-xl shadow-black/20",
      isCollapsed ? "md:w-16" : "md:w-64"
    )}>{/* Header with toggle button */}      <div className={cn(
        "flex items-center bg-[var(--color-accent)] border-b border-white/20",
        isCollapsed ? "p-4 justify-center" : "p-6 justify-between"
      )}>
        {/* Logo - only show when not collapsed and hide on mobile */}        {!isCollapsed && (
          <div className="font-bold text-white tracking-wide text-2xl hidden md:block">
            L<span className="text-white">A</span>UNCH
          </div>
        )}<button
          onClick={toggleSidebar}
          className={cn(
            "p-2 transition-all duration-300 bg-white/10 hover:bg-white/20 hover:shadow-lg text-white rounded-lg backdrop-blur-sm",
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

      <div className="flex-1 flex flex-col">        <ul className="flex-1 mt-0">
          {navItems.map((item) => {
            // Fix active state detection - exact match for root path, startsWith for others
            const isActive = item.path === '/' ? pathname === '/' : pathname.startsWith(item.path);
            const Icon = item.icon;
            
            return (
              <li key={item.id}>
                <Link
                  href={item.path}
                  className={cn(
                    'flex items-center transition-all duration-300 text-sm font-medium group relative w-full border-r-4',
                    isCollapsed ? 'p-4 justify-center' : 'px-6 py-4',
                    isActive 
                      ? 'bg-white/20 text-white border-r-white' 
                      : 'text-white/80 hover:bg-white/10 hover:text-white border-r-transparent'
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
                  href={item.path}                  className={cn(
                    'flex items-center transition-all duration-300 text-sm font-medium group relative w-full border-r-4',
                    isCollapsed ? 'p-4 justify-center' : 'px-6 py-4',
                    isActive 
                      ? 'bg-white/20 text-white border-r-white' 
                      : 'text-white/80 hover:bg-white/10 hover:text-white border-r-transparent'
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
      </div>      {/* Bottom Section - User Menu and Status */}      <div        className={cn(
          "border-t border-white/20 bg-[var(--color-accent)]",
          isCollapsed ? "p-2" : "p-4"
        )}
      >{!isCollapsed && (
          <div className="space-y-3">
            <div className="flex items-center justify-between text-xs text-white/60">
              <span>Version 1.0.0</span>
              <Link
                href="/docs"
                className="flex items-center text-white/70 hover:text-white hover:bg-white/10 p-1.5 rounded transition-colors duration-200 group"
                title="API Documentation"
              >
                <Book size={14} className="transition-colors duration-200" />
                {/* Tooltip */}
                <div className="absolute bottom-full mb-2 left-1/2 transform -translate-x-1/2 px-2 py-1 bg-gray-900 text-white text-xs opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-50 shadow-lg rounded">
                  API Docs
                </div>
              </Link>
            </div>
          </div>
        )}        {isCollapsed && (
          <div className="flex flex-col items-center space-y-2">
            <div className="w-2 h-2 bg-[var(--color-accent)] rounded-full" title="System Online" />
            <Link
              href="/docs"
              className="flex items-center text-white/70 hover:text-white hover:bg-white/10 p-1.5 rounded transition-colors duration-200 group relative"
              title="API Documentation"
            >
              <Book size={14} className="transition-colors duration-200" />
              {/* Tooltip */}
              <div className="absolute left-full ml-2 px-2 py-1 bg-gray-900 text-white text-xs opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-50 shadow-lg rounded">
                API Docs
              </div>
            </Link>
          </div>
        )}
      </div>
    </nav>
  );
}
