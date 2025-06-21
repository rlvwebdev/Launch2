/**
 * DesktopSidebar - Professional desktop navigation with search and collapsible sections
 * Enterprise-grade sidebar with organizational context switching
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
  UserIcon,
  Cog6ToothIcon,
  ChevronDownIcon,
  ChevronRightIcon,
  Bars3Icon,
  BuildingOfficeIcon,
  UserGroupIcon,
  DocumentTextIcon,
  ClockIcon,
  BellIcon,
  AcademicCapIcon,
  BuildingOffice2Icon,
  ExclamationTriangleIcon
} from '@heroicons/react/24/outline';
import {
  HomeIcon as HomeIconSolid,
  TruckIcon as TruckIconSolid,
  ClipboardDocumentListIcon as ClipboardIconSolid,
  ChartBarIcon as ChartIconSolid,
  UserIcon as UserIconSolid,
  Cog6ToothIcon as CogIconSolid,
  AcademicCapIcon as AcademicCapIconSolid,
  BuildingOffice2Icon as BuildingOffice2IconSolid,
  ExclamationTriangleIcon as ExclamationTriangleIconSolid
} from '@heroicons/react/24/solid';
import TerminalSelector from './TerminalSelector';

interface NavItem {
  id: string;
  label: string;
  href?: string;
  icon: React.ComponentType<{ className?: string }>;
  iconSolid: React.ComponentType<{ className?: string }>;
  badge?: number;
  children?: NavItem[];
  onClick?: () => void;
}

interface NavSection {
  id: string;
  label?: string;
  items: NavItem[];
}

interface DesktopSidebarProps {
  isCollapsed?: boolean;
  onToggleCollapse?: () => void;
  notificationCount?: number;
  className?: string;
}

const navigationSections: NavSection[] = [
  {
    id: 'main',
    items: [
      {
        id: 'dashboard',
        label: 'Dashboard',
        href: '/',
        icon: HomeIcon,
        iconSolid: HomeIconSolid
      }
    ]
  },
  {
    id: 'operations',
    label: 'Operations',
    items: [
      {
        id: 'loads',
        label: 'Loads',
        href: '/loads',
        icon: ClipboardDocumentListIcon,
        iconSolid: ClipboardIconSolid,
        badge: 3
      },
      {
        id: 'fleet',
        label: 'Fleet',
        icon: TruckIcon,
        iconSolid: TruckIconSolid,
        children: [
          {
            id: 'trucks',
            label: 'Trucks',
            href: '/trucks',
            icon: TruckIcon,
            iconSolid: TruckIconSolid
          },
          {
            id: 'trailers',
            label: 'Trailers',
            href: '/trailers',
            icon: TruckIcon,
            iconSolid: TruckIconSolid
          },
          {
            id: 'drivers',
            label: 'Drivers',
            href: '/drivers',
            icon: UserIcon,
            iconSolid: UserIconSolid
          }
        ]
      }
    ]
  },
  {
    id: 'management',
    label: 'Management',
    items: [
      {
        id: 'reports',
        label: 'Reports',
        href: '/reports',
        icon: ChartBarIcon,
        iconSolid: ChartIconSolid
      },
      {
        id: 'organizations',
        label: 'Organizations',
        href: '/organizations',
        icon: BuildingOfficeIcon,
        iconSolid: BuildingOfficeIcon
      },
      {
        id: 'settings',
        label: 'Settings',
        href: '/settings',
        icon: Cog6ToothIcon,
        iconSolid: CogIconSolid
      }
    ]
  }
];

const additionalApps = [
  { 
    id: 'academy',
    label: 'Academy', 
    href: '/academy', 
    icon: AcademicCapIcon,
    iconSolid: AcademicCapIconSolid,
    description: 'TMS tutorials and training'
  },
  { 
    id: 'directory',
    label: 'Directory', 
    href: '/directory', 
    icon: BuildingOffice2Icon,
    iconSolid: BuildingOffice2IconSolid,
    description: 'Divisions, departments & terminals'
  },
  { 
    id: 'report-bug',
    label: 'Report Bug', 
    href: '/report-bug', 
    icon: ExclamationTriangleIcon,
    iconSolid: ExclamationTriangleIconSolid,
    description: 'Submit support tickets'
  }
];

const DesktopSidebar: React.FC<DesktopSidebarProps> = ({
  isCollapsed = false,
  onToggleCollapse,
  notificationCount = 0,
  className
}) => {
  const pathname = usePathname();
  const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set(['operations']));

  const isActiveRoute = (href?: string): boolean => {
    if (!href) return false;
    if (href === '/') {
      return pathname === '/';
    }
    return pathname.startsWith(href);
  };

  const toggleSection = (sectionId: string) => {
    const newExpanded = new Set(expandedSections);
    if (newExpanded.has(sectionId)) {
      newExpanded.delete(sectionId);
    } else {
      newExpanded.add(sectionId);
    }
    setExpandedSections(newExpanded);
  };

  const renderNavItem = (item: NavItem, level = 0) => {
    const isActive = isActiveRoute(item.href);
    const hasChildren = item.children && item.children.length > 0;
    const isExpanded = expandedSections.has(item.id);
    const Icon = isActive ? item.iconSolid : item.icon;    const baseClasses = cn(
      'flex items-center w-full transition-all duration-fast group relative border-l-4',
      'hover:bg-neutral-50 focus:bg-neutral-50 focus:outline-none',
      {
        'bg-primary-50 text-primary-700 border-l-primary-500': isActive,
        'text-neutral-700 hover:text-neutral-900 border-l-transparent': !isActive,
        'justify-center px-0 py-3': isCollapsed,
        'gap-3 px-4 py-3': !isCollapsed,
        'pl-8': level > 0 && !isCollapsed,
        'cursor-pointer': hasChildren && !item.href
      }
    );    const content = (
      <>
        {isCollapsed ? (
          // Collapsed state - just the icon
          <Icon className={cn(
            'h-5 w-5 transition-colors duration-fast',
            {
              'text-primary-600': isActive,
              'text-neutral-500 group-hover:text-neutral-700': !isActive
            }
          )} />
        ) : (
          // Expanded state - full content
          <div className="flex items-center gap-3 flex-1 min-w-0">
            <Icon className={cn(
              'h-5 w-5 flex-shrink-0 transition-colors duration-fast',
              {
                'text-primary-600': isActive,
                'text-neutral-500 group-hover:text-neutral-700': !isActive
              }
            )} />
            
            <span className={cn(
              'font-medium text-sm truncate transition-colors duration-fast',
              {
                'text-primary-700': isActive,
                'text-neutral-700 group-hover:text-neutral-900': !isActive
              }
            )}>
              {item.label}
            </span>
            
            {item.badge && (
              <div className="ml-auto bg-error-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                {item.badge}
              </div>
            )}
            
            {hasChildren && (
              <ChevronRightIcon className={cn(
                'h-4 w-4 ml-auto transition-transform duration-fast',
                isExpanded && 'rotate-90'
              )} />
            )}
          </div>
        )}
      </>
    );

    const handleClick = () => {
      if (hasChildren) {
        toggleSection(item.id);
      } else if (item.onClick) {
        item.onClick();
      }
    };    return (
      <div key={item.id}>
        {item.href ? (
          <Link 
            href={item.href} 
            className={baseClasses}
            title={isCollapsed ? item.label : undefined}
          >
            {content}
          </Link>
        ) : (
          <button 
            onClick={handleClick} 
            className={baseClasses}
            title={isCollapsed ? item.label : undefined}
          >
            {content}
          </button>
        )}
        
        {/* Children */}
        {hasChildren && isExpanded && !isCollapsed && (
          <div className="mt-1 space-y-1">
            {item.children?.map(child => renderNavItem(child, level + 1))}
          </div>
        )}
      </div>
    );
  };

  return (
    <aside className={cn(
      'flex flex-col h-full bg-theme-surface border-r border-neutral-200 transition-all duration-normal',
      {
        'w-64': !isCollapsed,
        'w-16': isCollapsed
      },
      className
    )}>
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-neutral-200">
        {!isCollapsed && (
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-primary-500 rounded-lg flex items-center justify-center">
              <TruckIconSolid className="h-5 w-5 text-white" />
            </div>
            <div>
              <h1 className="font-bold text-lg text-neutral-900">Launch</h1>
              <p className="text-xs text-neutral-500">TMS Platform</p>
            </div>
          </div>
        )}
        
        <button
          onClick={onToggleCollapse}
          className="p-2 rounded-lg hover:bg-neutral-100 transition-colors duration-fast"
          title={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          <Bars3Icon className="h-5 w-5 text-neutral-500" />
        </button>
      </div>      {/* Terminal Selection */}
      <TerminalSelector isCollapsed={isCollapsed} />{/* Navigation */}
      <nav className="flex-1 pb-4 overflow-y-auto">
        <div className="space-y-6">
          {navigationSections.map(section => (
            <div key={section.id}>
              {section.label && !isCollapsed && (
                <h3 className="text-xs font-semibold text-neutral-500 uppercase tracking-wider mb-3 px-4">
                  {section.label}
                </h3>
              )}
              
              <div className="space-y-0">
                {section.items.map(item => renderNavItem(item))}
              </div>
            </div>
          ))}
        </div>        {/* Additional Apps */}
        {!isCollapsed && (
          <div className="mt-8 pt-6 border-t border-neutral-200">
            <h3 className="text-xs font-semibold text-neutral-500 uppercase tracking-wider mb-3 px-4">
              More Apps
            </h3>
            <div className="space-y-0">
              {additionalApps.map((app) => {
                const isActive = isActiveRoute(app.href);
                const Icon = isActive ? app.iconSolid : app.icon;
                return (
                  <Link
                    key={app.id}
                    href={app.href}
                    className={cn(
                      "flex items-center gap-3 w-full px-4 py-3 text-sm transition-all duration-fast border-l-4 group",
                      isActive
                        ? "bg-primary-50 text-primary-700 border-l-primary-500"
                        : "text-neutral-600 hover:text-neutral-900 hover:bg-neutral-50 border-l-transparent"
                    )}
                  >
                    <Icon className="h-4 w-4 flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <div className="truncate font-medium">{app.label}</div>
                      <div className="text-xs text-neutral-500 truncate">{app.description}</div>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        )}
        
        {/* Additional Apps - Collapsed State */}
        {isCollapsed && (
          <div className="mt-8 pt-6 border-t border-neutral-200">
            <div className="space-y-1">
              {additionalApps.map((app) => {
                const isActive = isActiveRoute(app.href);
                const Icon = isActive ? app.iconSolid : app.icon;
                return (
                  <Link
                    key={app.id}
                    href={app.href}
                    title={`${app.label} - ${app.description}`}
                    className={cn(
                      "flex items-center justify-center w-full py-3 transition-all duration-fast border-l-4",
                      isActive
                        ? "bg-primary-50 text-primary-700 border-l-primary-500"
                        : "text-neutral-600 hover:text-neutral-900 hover:bg-neutral-50 border-l-transparent"
                    )}
                  >
                    <Icon className="h-5 w-5" />
                  </Link>
                );
              })}
            </div>
          </div>
        )}
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-neutral-200">
        {!isCollapsed ? (
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-neutral-200 rounded-full flex items-center justify-center">
              <UserIcon className="h-4 w-4 text-neutral-600" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-neutral-900 truncate">John Smith</p>
              <p className="text-xs text-neutral-500 truncate">Fleet Manager</p>
            </div>
            {notificationCount > 0 && (
              <div className="bg-error-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                {notificationCount}
              </div>
            )}
          </div>
        ) : (
          <div className="flex justify-center">
            <div className="relative">
              <div className="w-8 h-8 bg-neutral-200 rounded-full flex items-center justify-center">
                <UserIcon className="h-4 w-4 text-neutral-600" />
              </div>
              {notificationCount > 0 && (
                <div className="absolute -top-1 -right-1 bg-error-500 text-white text-xs font-bold rounded-full h-4 w-4 flex items-center justify-center">
                  {notificationCount > 9 ? '9+' : notificationCount}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </aside>
  );
};

export default DesktopSidebar;
