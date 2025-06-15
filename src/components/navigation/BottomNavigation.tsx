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

export default function BottomNavigation() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-4 py-2 md:hidden">
      <div className="flex justify-around items-center max-w-md mx-auto">
        {navItems.map((item) => {
          const isActive = pathname.startsWith(item.path);
          const Icon = item.icon;
          
          return (
            <Link
              key={item.id}
              href={item.path}
              className={cn(
                'flex flex-col items-center justify-center p-2 rounded-lg transition-colors min-w-[44px] min-h-[44px]',
                isActive 
                  ? 'text-blue-600 bg-blue-50' 
                  : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
              )}
            >
              <Icon 
                size={24} 
                className={cn(
                  'mb-1',
                  isActive ? 'text-blue-600' : 'text-gray-500'
                )} 
              />
              <span 
                className={cn(
                  'text-xs font-medium',
                  isActive ? 'text-blue-600' : 'text-gray-500'
                )}
              >
                {item.label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
