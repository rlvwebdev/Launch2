'use client';

import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { 
  Users, 
  Truck, 
  Package, 
  Settings,
  Menu,
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
    id: 'loads',
    label: 'Loads',
    icon: Package,
    path: '/loads',
  },
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
        isCollapsed ? "p-4 justify-center" : "p-6 justify-between"
      )}>
        {!isCollapsed && (
          <div>
            <h1 className="text-2xl font-bold text-gray-900">TMOps</h1>
            <p className="text-sm text-gray-600 mt-1">Trucking Management</p>
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
      
      <div className={cn("flex-1", isCollapsed ? "px-2" : "px-4")}>
        <ul className="space-y-2 mt-4">
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
      </div>
      
      <div className={cn(
        "border-t border-gray-200",
        isCollapsed ? "p-2" : "p-4"
      )}>
        {!isCollapsed && (
          <div className="text-xs text-gray-500">
            Version 1.0.0
          </div>
        )}
        {isCollapsed && (
          <div className="w-2 h-2 bg-green-400 rounded-full mx-auto" title="System Online" />
        )}
      </div>
    </nav>
  );
}
