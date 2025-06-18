'use client';

import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { 
  Users, 
  Truck, 
  Package, 
  Settings,
  Menu,
  Home,
  BarChart3,
  Building,
  Container,
  AlertTriangle,
  type LucideIcon 
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useSidebar } from '@/components/context/SidebarContext';
import OrganizationSelector from '@/components/ui/OrganizationSelector';

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
  
  // Administration
  {
    id: 'organizations',
    label: 'Organizations',
    icon: Building,
    path: '/organizations',
  },
];

const bottomNavItems: NavItem[] = [
  {
    id: 'settings',
    label: 'Settings',
    icon: Settings,
    path: '/settings',
  },
];

export default function DesktopNavigation() {
  const pathname = usePathname();
  const { isCollapsed, toggleSidebar } = useSidebar();

  return (
    <nav className={cn(
      "hidden md:flex md:flex-col md:fixed md:inset-y-0 md:bg-white md:border-r md:border-gray-200 transition-all duration-300",
      isCollapsed ? "md:w-16" : "md:w-64"
    )}>
      {/* Header with toggle button */}
      <div className={cn(
        "flex items-center border-b border-gray-200",
        isCollapsed ? "p-4 justify-center" : "p-6 justify-between"      )}>
        {isCollapsed ? (
          <svg width="24" height="24" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M16 2C12 2 10 6 10 10v8c0 2 1 4 3 5l3 3 3-3c2-1 3-3 3-5v-8c0-4-2-8-6-8z" fill="#3B82F6"/>
            <path d="M16 2c-2 0-3 1-3 3s1 3 3 3 3-1 3-3-1-3-3-3z" fill="#1E40AF"/>
            <circle cx="16" cy="12" r="2" fill="#60A5FA"/>
            <path d="M13 26c1 2 2 3 3 4 1-1 2-2 3-4-1 1-2 1-3 1s-2 0-3-1z" fill="#F59E0B"/>
          </svg>
        ) : (
          <div className="flex items-center gap-3">
            <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M16 2C12 2 10 6 10 10v8c0 2 1 4 3 5l3 3 3-3c2-1 3-3 3-5v-8c0-4-2-8-6-8z" fill="#3B82F6" stroke="#1E40AF" strokeWidth="1"/>
              <path d="M16 2c-2 0-3 1-3 3s1 3 3 3 3-1 3-3-1-3-3-3z" fill="#1E40AF"/>
              <path d="M10 18L8 22L10 20z" fill="#EF4444"/>
              <path d="M22 18L24 22L22 20z" fill="#EF4444"/>
              <circle cx="16" cy="12" r="2.5" fill="#E5E7EB" stroke="#9CA3AF" strokeWidth="0.5"/>
              <circle cx="16" cy="12" r="1.5" fill="#60A5FA"/>
              <path d="M13 26c1 2 2 3 3 4 1-1 2-2 3-4-1 1-2 1-3 1s-2 0-3-1z" fill="#F59E0B"/>
              <path d="M14 24c0.5 1.5 1 2.5 2 3 1-0.5 1.5-1.5 2-3-0.5 0.5-1 0.5-2 0.5s-1.5 0-2-0.5z" fill="#EF4444"/>
            </svg>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Launch</h1>
              <p className="text-sm text-gray-600 mt-1">Terminal Ops</p>            </div>
          </div>
        )}
        <button
          onClick={toggleSidebar}
          className={cn(
            "p-2 rounded-lg hover:bg-gray-100 transition-colors",
            isCollapsed && "w-8 h-8 flex items-center justify-center"
          )}
          title={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          <Menu size={20} className="text-gray-600" />
        </button>
      </div>      
      <div className={cn("flex-1 flex flex-col", isCollapsed ? "px-2" : "px-4")}>
        <ul className="space-y-2 mt-4 flex-1">
          {navItems.map((item) => {
            const isActive = pathname.startsWith(item.path);
            const Icon = item.icon;
            
            return (
              <li key={item.id}>
                <Link
                  href={item.path}
                  className={cn(
                    'flex items-center rounded-lg transition-colors text-sm font-medium group relative',
                    isCollapsed ? 'p-3 justify-center' : 'px-4 py-3',
                    isActive 
                      ? 'bg-blue-50 text-blue-700' 
                      : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
                  )}
                  title={isCollapsed ? item.label : undefined}
                >
                  <Icon 
                    size={20} 
                    className={cn(
                      isCollapsed ? '' : 'mr-3',
                      isActive ? 'text-blue-700' : 'text-gray-500'
                    )} 
                  />
                  {!isCollapsed && (
                    <span className="transition-opacity duration-200">
                      {item.label}
                    </span>
                  )}
                  
                  {/* Tooltip for collapsed state */}
                  {isCollapsed && (
                    <div className="absolute left-full ml-2 px-2 py-1 bg-gray-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-50">
                      {item.label}
                    </div>
                  )}
                </Link>
              </li>
            );
          })}
        </ul>
        
        {/* Bottom Navigation Items */}
        <ul className="space-y-2 mb-4">
          {bottomNavItems.map((item) => {
            const isActive = pathname.startsWith(item.path);
            const Icon = item.icon;
            
            return (
              <li key={item.id}>
                <Link
                  href={item.path}
                  className={cn(
                    'flex items-center rounded-lg transition-colors text-sm font-medium group relative',
                    isCollapsed ? 'p-3 justify-center' : 'px-4 py-3',
                    isActive 
                      ? 'bg-blue-50 text-blue-700' 
                      : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
                  )}
                  title={isCollapsed ? item.label : undefined}
                >
                  <Icon 
                    size={20} 
                    className={cn(
                      isCollapsed ? '' : 'mr-3',
                      isActive ? 'text-blue-700' : 'text-gray-500'
                    )} 
                  />
                  {!isCollapsed && (
                    <span className="transition-opacity duration-200">
                      {item.label}
                    </span>
                  )}
                  
                  {/* Tooltip for collapsed state */}
                  {isCollapsed && (
                    <div className="absolute left-full ml-2 px-2 py-1 bg-gray-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-50">
                      {item.label}
                    </div>
                  )}
                </Link>
              </li>
            );
          })}
        </ul>
      </div>
        <div className={cn(
        "border-t border-gray-200",
        isCollapsed ? "p-2" : "p-4"
      )}>
        {!isCollapsed && (
          <div className="space-y-3">
            <OrganizationSelector className="w-full" showFullHierarchy={false} />
            <div className="text-xs text-gray-500">
              Version 1.0.0
            </div>
          </div>
        )}
        {isCollapsed && (
          <div className="w-2 h-2 bg-green-400 rounded-full mx-auto" title="System Online" />
        )}
      </div>
    </nav>
  );
}
