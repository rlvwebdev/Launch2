'use client';

import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { 
  Users, 
  Truck, 
  Package, 
  Settings,
  type LucideIcon 
} from 'lucide-react';
import { cn } from '@/lib/utils';

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
  return (
    <nav className="hidden md:flex md:flex-col md:fixed md:inset-y-0 md:w-64 md:bg-white md:border-r md:border-gray-200">
      <div className="p-6">
        <h1 className="text-2xl font-bold text-gray-900">TMOps</h1>
        <p className="text-sm text-gray-600 mt-1">Trucking Management</p>
      </div>
      
      <div className="flex-1 px-4">
        <ul className="space-y-2">
          {navItems.map((item) => {
            const isActive = pathname.startsWith(item.path);
            const Icon = item.icon;
            
            return (
              <li key={item.id}>
                <Link
                  href={item.path}
                  className={cn(
                    'flex items-center px-4 py-3 rounded-lg transition-colors text-sm font-medium',
                    isActive 
                      ? 'bg-blue-50 text-blue-700 border-r-2 border-blue-700' 
                      : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
                  )}
                >
                  <Icon 
                    size={20} 
                    className={cn(
                      'mr-3',
                      isActive ? 'text-blue-700' : 'text-gray-500'
                    )} 
                  />
                  {item.label}
                </Link>
              </li>
            );
          })}
        </ul>
      </div>
      
      <div className="p-4 border-t border-gray-200">
        <div className="text-xs text-gray-500">
          Version 1.0.0
        </div>
      </div>
    </nav>
  );
}
