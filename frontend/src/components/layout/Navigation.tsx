/**
 * Modern Navigation Component - Mobile-first design with Tailwind UI patterns
 * Professional sidebar navigation with responsive mobile menu
 */

'use client';

import React, { useState, Fragment } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { Dialog, DialogPanel, Transition, TransitionChild } from '@headlessui/react';
import {
  Bars3Icon,
  XMarkIcon,
  HomeIcon,
  UserGroupIcon,
  TruckIcon,
  ArchiveBoxIcon,
  DocumentTextIcon,
  ChartBarIcon,
  Cog6ToothIcon,
  QuestionMarkCircleIcon,
  BellIcon
} from '@heroicons/react/24/outline';
import {
  HomeIcon as HomeIconSolid,
  UserGroupIcon as UserGroupIconSolid,
  TruckIcon as TruckIconSolid,
  ArchiveBoxIcon as ArchiveBoxIconSolid,
  DocumentTextIcon as DocumentTextIconSolid,
  ChartBarIcon as ChartBarIconSolid,
  Cog6ToothIcon as Cog6ToothIconSolid
} from '@heroicons/react/24/solid';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/Button';
import OrganizationSelector from '@/components/ui/OrganizationSelector';

interface NavigationItem {
  name: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  iconSolid: React.ComponentType<{ className?: string }>;
  count?: number;
  current?: boolean;
}

const navigation: NavigationItem[] = [
  { name: 'Dashboard', href: '/', icon: HomeIcon, iconSolid: HomeIconSolid },
  { name: 'Drivers', href: '/drivers', icon: UserGroupIcon, iconSolid: UserGroupIconSolid },
  { name: 'Trucks', href: '/trucks', icon: TruckIcon, iconSolid: TruckIconSolid },
  { name: 'Trailers', href: '/trailers', icon: ArchiveBoxIcon, iconSolid: ArchiveBoxIconSolid },
  { name: 'Loads', href: '/loads', icon: DocumentTextIcon, iconSolid: DocumentTextIconSolid },
  { name: 'Reports', href: '/reports', icon: ChartBarIcon, iconSolid: ChartBarIconSolid },
];

const secondaryNavigation = [
  { name: 'Settings', href: '/settings', icon: Cog6ToothIcon, iconSolid: Cog6ToothIconSolid },
  { name: 'Help', href: '/help', icon: QuestionMarkCircleIcon, iconSolid: QuestionMarkCircleIcon },
];

interface NavigationProps {
  children: React.ReactNode;
}

export default function Navigation({ children }: NavigationProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  const isCurrentPage = (href: string) => {
    if (href === '/') {
      return pathname === '/';
    }
    return pathname.startsWith(href);
  };

  const handleNavigation = (href: string) => {
    router.push(href);
    setSidebarOpen(false);
  };

  // Don't render navigation on auth page
  if (pathname === '/auth') {
    return <>{children}</>;
  }

  return (
    <div className="h-full">
      {/* Mobile sidebar */}
      <Transition show={sidebarOpen} as={Fragment}>
        <Dialog as="div" className="relative z-50 lg:hidden" onClose={setSidebarOpen}>
          <TransitionChild
            as={Fragment}
            enter="transition-opacity ease-linear duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="transition-opacity ease-linear duration-300"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-gray-900/80" />
          </TransitionChild>

          <div className="fixed inset-0 flex">
            <TransitionChild
              as={Fragment}
              enter="transition ease-in-out duration-300 transform"
              enterFrom="-translate-x-full"
              enterTo="translate-x-0"
              leave="transition ease-in-out duration-300 transform"
              leaveFrom="translate-x-0"
              leaveTo="-translate-x-full"
            >
              <DialogPanel className="relative mr-16 flex w-full max-w-xs flex-1">
                <TransitionChild
                  as={Fragment}
                  enter="ease-in-out duration-300"
                  enterFrom="opacity-0"
                  enterTo="opacity-100"
                  leave="ease-in-out duration-300"
                  leaveFrom="opacity-100"
                  leaveTo="opacity-0"
                >
                  <div className="absolute left-full top-0 flex w-16 justify-center pt-5">
                    <button
                      type="button"
                      className="-m-2.5 p-2.5"
                      onClick={() => setSidebarOpen(false)}
                    >
                      <span className="sr-only">Close sidebar</span>
                      <XMarkIcon className="h-6 w-6 text-white" aria-hidden="true" />
                    </button>
                  </div>
                </TransitionChild>

                {/* Mobile sidebar content */}
                <div className="flex grow flex-col gap-y-5 overflow-y-auto bg-white px-6 pb-4">
                  <div className="flex h-16 shrink-0 items-center">
                    <div className="h-8 w-8 rounded-lg bg-accent-600 flex items-center justify-center">
                      <span className="text-white font-bold text-lg">L</span>
                    </div>
                    <span className="ml-3 text-xl font-bold text-gray-900">Launch TMS</span>
                  </div>
                  <nav className="flex flex-1 flex-col">
                    <ul className="flex flex-1 flex-col gap-y-7">
                      <li>
                        <ul className="-mx-2 space-y-1">
                          {navigation.map((item) => {
                            const current = isCurrentPage(item.href);
                            const Icon = current ? item.iconSolid : item.icon;
                            return (
                              <li key={item.name}>
                                <button
                                  onClick={() => handleNavigation(item.href)}
                                  className={cn(
                                    current
                                      ? 'bg-accent-50 text-accent-700 border-r-2 border-accent-700'
                                      : 'text-gray-700 hover:text-accent-700 hover:bg-accent-50',
                                    'group flex gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold w-full text-left transition-colors'
                                  )}
                                >
                                  <Icon
                                    className={cn(
                                      current ? 'text-accent-700' : 'text-gray-400 group-hover:text-accent-700',
                                      'h-6 w-6 shrink-0'
                                    )}
                                    aria-hidden="true"
                                  />
                                  {item.name}
                                  {item.count && (
                                    <span
                                      className="ml-auto w-9 min-w-max whitespace-nowrap rounded-full bg-accent-600 px-2.5 py-0.5 text-center text-xs font-medium text-white ring-1 ring-inset ring-accent-600"
                                      aria-hidden="true"
                                    >
                                      {item.count}
                                    </span>
                                  )}
                                </button>
                              </li>
                            );
                          })}
                        </ul>
                      </li>
                      <li className="mt-auto">
                        <ul className="-mx-2 space-y-1">
                          {secondaryNavigation.map((item) => {
                            const current = isCurrentPage(item.href);
                            const Icon = current ? item.iconSolid : item.icon;
                            return (
                              <li key={item.name}>
                                <button
                                  onClick={() => handleNavigation(item.href)}
                                  className={cn(
                                    current
                                      ? 'bg-accent-50 text-accent-700'
                                      : 'text-gray-700 hover:text-accent-700 hover:bg-accent-50',
                                    'group flex gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold w-full text-left transition-colors'
                                  )}
                                >
                                  <Icon
                                    className={cn(
                                      current ? 'text-accent-700' : 'text-gray-400 group-hover:text-accent-700',
                                      'h-6 w-6 shrink-0'
                                    )}
                                    aria-hidden="true"
                                  />
                                  {item.name}
                                </button>
                              </li>
                            );
                          })}
                        </ul>
                      </li>
                    </ul>
                  </nav>
                </div>
              </DialogPanel>
            </TransitionChild>
          </div>
        </Dialog>
      </Transition>

      {/* Static sidebar for desktop */}
      <div className="hidden lg:fixed lg:inset-y-0 lg:z-50 lg:flex lg:w-72 lg:flex-col">
        <div className="flex grow flex-col gap-y-5 overflow-y-auto bg-white border-r border-gray-200 px-6 pb-4">
          <div className="flex h-16 shrink-0 items-center">
            <div className="h-8 w-8 rounded-lg bg-accent-600 flex items-center justify-center">
              <span className="text-white font-bold text-lg">L</span>
            </div>
            <span className="ml-3 text-xl font-bold text-gray-900">Launch TMS</span>
          </div>
          <nav className="flex flex-1 flex-col">
            <ul className="flex flex-1 flex-col gap-y-7">
              <li>
                <ul className="-mx-2 space-y-1">
                  {navigation.map((item) => {
                    const current = isCurrentPage(item.href);
                    const Icon = current ? item.iconSolid : item.icon;
                    return (
                      <li key={item.name}>
                        <button
                          onClick={() => handleNavigation(item.href)}
                          className={cn(
                            current
                              ? 'bg-accent-50 text-accent-700 border-r-2 border-accent-700'
                              : 'text-gray-700 hover:text-accent-700 hover:bg-accent-50',
                            'group flex gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold w-full text-left transition-colors'
                          )}
                        >
                          <Icon
                            className={cn(
                              current ? 'text-accent-700' : 'text-gray-400 group-hover:text-accent-700',
                              'h-6 w-6 shrink-0'
                            )}
                            aria-hidden="true"
                          />
                          {item.name}
                          {item.count && (
                            <span
                              className="ml-auto w-9 min-w-max whitespace-nowrap rounded-full bg-accent-600 px-2.5 py-0.5 text-center text-xs font-medium text-white ring-1 ring-inset ring-accent-600"
                              aria-hidden="true"
                            >
                              {item.count}
                            </span>
                          )}
                        </button>
                      </li>
                    );
                  })}
                </ul>
              </li>
              
              {/* Organization Selector */}
              <li className="border-t border-gray-200 pt-4">
                <div className="px-2">
                  <div className="text-xs font-semibold leading-6 text-gray-400 mb-2">Current Terminal</div>
                  <OrganizationSelector className="w-full" showFullHierarchy={false} />
                </div>
              </li>
              
              <li className="mt-auto">
                <ul className="-mx-2 space-y-1">
                  {secondaryNavigation.map((item) => {
                    const current = isCurrentPage(item.href);
                    const Icon = current ? item.iconSolid : item.icon;
                    return (
                      <li key={item.name}>
                        <button
                          onClick={() => handleNavigation(item.href)}
                          className={cn(
                            current
                              ? 'bg-accent-50 text-accent-700'
                              : 'text-gray-700 hover:text-accent-700 hover:bg-accent-50',
                            'group flex gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold w-full text-left transition-colors'
                          )}
                        >
                          <Icon
                            className={cn(
                              current ? 'text-accent-700' : 'text-gray-400 group-hover:text-accent-700',
                              'h-6 w-6 shrink-0'
                            )}
                            aria-hidden="true"
                          />
                          {item.name}
                        </button>
                      </li>
                    );
                  })}
                </ul>
              </li>
            </ul>
          </nav>
        </div>
      </div>

      {/* Main content area */}
      <div className="lg:pl-72">
        {/* Top bar for mobile */}
        <div className="sticky top-0 z-40 flex h-16 shrink-0 items-center gap-x-4 border-b border-gray-200 bg-white px-4 shadow-sm sm:gap-x-6 sm:px-6 lg:hidden">
          <button
            type="button"
            className="-m-2.5 p-2.5 text-gray-700 lg:hidden"
            onClick={() => setSidebarOpen(true)}
          >
            <span className="sr-only">Open sidebar</span>
            <Bars3Icon className="h-6 w-6" aria-hidden="true" />
          </button>

          {/* Separator */}
          <div className="h-6 w-px bg-gray-200 lg:hidden" aria-hidden="true" />

          <div className="flex flex-1 gap-x-4 self-stretch lg:gap-x-6">
            <div className="flex items-center gap-x-4 lg:gap-x-6">
              <div className="h-8 w-8 rounded-lg bg-accent-600 flex items-center justify-center">
                <span className="text-white font-bold text-lg">L</span>
              </div>
              <span className="text-lg font-bold text-gray-900">Launch TMS</span>
            </div>
            <div className="flex items-center gap-x-4 lg:gap-x-6 ml-auto">
              <button
                type="button"
                className="-m-2.5 p-2.5 text-gray-400 hover:text-gray-500"
              >
                <span className="sr-only">View notifications</span>
                <BellIcon className="h-6 w-6" aria-hidden="true" />
              </button>
            </div>
          </div>
        </div>

        {/* Main content */}
        <main className="min-h-screen">
          {children}
        </main>
      </div>
    </div>
  );
}
