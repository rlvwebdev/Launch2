/**
 * DesktopTopBar - Professional desktop top navigation bar
 * Global search, notifications, user menu, and organization selector
 */

'use client';

import React, { useState, useEffect, useRef } from 'react';
import { cn } from '@/lib/utils';
import { useTheme } from '@/context/ThemeContext';
import { useSearch } from '@/context/SearchContext';
import {
  MagnifyingGlassIcon,
  BellIcon,
  ChevronDownIcon,
  Cog6ToothIcon,
  UserIcon,
  SunIcon,
  MoonIcon
} from '@heroicons/react/24/outline';
import { Button } from '@/components/ui/Button';

interface DesktopTopBarProps {
  onSearch?: (query: string) => void;
  onNotifications?: () => void;
  notificationCount?: number;
  className?: string;
}

export default function DesktopTopBar({
  onSearch,
  onNotifications,
  notificationCount = 0,
  className
}: DesktopTopBarProps) {
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [orgMenuOpen, setOrgMenuOpen] = useState(false);
  const [showSearchResults, setShowSearchResults] = useState(false);
  const { isDarkMode, toggleDarkMode } = useTheme();
  const { searchQuery, searchResults, isSearching, performSearch, clearSearch, navigateToResult } = useSearch();
  const searchRef = useRef<HTMLDivElement>(null);

  // Close search results when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowSearchResults(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);
  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      performSearch(searchQuery);
      setShowSearchResults(true);
      onSearch?.(searchQuery);
    }
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (value.trim()) {
      performSearch(value);
      setShowSearchResults(true);
    } else {
      clearSearch();
      setShowSearchResults(false);
    }
  };

  const handleSearchResultClick = (result: any) => {
    navigateToResult(result);
    setShowSearchResults(false);
    clearSearch();
  };
  return (
    <header className={cn(
      "bg-theme-background border-b border-neutral-200 px-6 py-4",
      "flex items-center justify-between",
      className
    )}>
      <div className="flex-1 max-w-lg">
        <div ref={searchRef} className="relative">
          <form onSubmit={handleSearchSubmit}>
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <MagnifyingGlassIcon className="h-5 w-5 text-neutral-400" />
            </div><input
            type="text"
            className={cn(
              "block w-full pl-10 pr-3 py-2 border border-neutral-300 rounded-lg",
              "placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent",
              "text-sm bg-neutral-50 hover:bg-white transition-colors"
            )}
            placeholder="Search drivers, trucks, loads..."
            value={searchQuery}
            onChange={handleSearchChange}
          />          {searchQuery && (
            <div className="absolute right-2 top-1/2 transform -translate-y-1/2">
              <kbd className="px-2 py-1 text-xs font-semibold text-neutral-500 bg-neutral-100 border border-neutral-300 rounded">
                ⏎
              </kbd>
            </div>
          )}
          
          {/* Search Results Dropdown */}
          {showSearchResults && searchResults.length > 0 && (
            <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-neutral-200 rounded-lg shadow-lg z-50 max-h-96 overflow-y-auto">
              <div className="p-2">
                <div className="text-xs font-medium text-neutral-500 px-3 py-2">
                  {searchResults.length} result{searchResults.length !== 1 ? 's' : ''} found
                </div>
                {searchResults.slice(0, 10).map((result) => (
                  <button
                    key={`${result.type}-${result.id}`}
                    onClick={() => handleSearchResultClick(result)}
                    className="w-full text-left px-3 py-2 hover:bg-neutral-50 rounded-lg transition-colors"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex-1 min-w-0">
                        <div className="font-medium text-sm text-neutral-900 truncate">
                          {result.title}
                        </div>
                        <div className="text-xs text-neutral-500 truncate">
                          {result.subtitle}
                        </div>
                        {result.description && (
                          <div className="text-xs text-neutral-400 truncate mt-0.5">
                            {result.description}
                          </div>
                        )}
                      </div>
                      <div className="ml-2 flex-shrink-0">
                        <span className={cn(
                          "px-2 py-1 text-xs font-medium rounded-full",
                          result.type === 'driver' && "bg-blue-100 text-blue-800",
                          result.type === 'truck' && "bg-orange-100 text-orange-800",
                          result.type === 'trailer' && "bg-purple-100 text-purple-800",
                          result.type === 'load' && "bg-green-100 text-green-800"
                        )}>
                          {result.type}
                        </span>
                      </div>
                    </div>
                  </button>
                ))}
                {searchResults.length > 10 && (
                  <div className="text-xs text-neutral-500 px-3 py-2 border-t border-neutral-100">
                    Showing first 10 results. Refine your search for more specific results.
                  </div>
                )}
              </div>
            </div>            )}
          </form>
        </div>
      </div>

      {/* Right Section - Actions & User */}
      <div className="flex items-center space-x-4">
        {/* Organization Selector */}
        <div className="relative">
          <button
            onClick={() => setOrgMenuOpen(!orgMenuOpen)}
            className={cn(
              "flex items-center space-x-2 px-3 py-2 text-sm font-medium text-neutral-700",
              "hover:bg-neutral-100 rounded-lg transition-colors"
            )}
          >
            <div className="w-6 h-6 bg-primary-500 rounded-lg flex items-center justify-center">
              <span className="text-xs font-bold text-white">LT</span>
            </div>
            <span>Launch Transport</span>
            <ChevronDownIcon className="h-4 w-4 text-neutral-400" />
          </button>
        </div>

        {/* Notifications */}
        <button
          onClick={onNotifications}
          className={cn(
            "relative p-2 text-neutral-500 hover:text-neutral-700",
            "hover:bg-neutral-100 rounded-lg transition-colors"
          )}
        >
          <BellIcon className="h-6 w-6" />
          {notificationCount > 0 && (
            <span className="absolute -top-1 -right-1 bg-error-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
              {notificationCount > 9 ? '9+' : notificationCount}
            </span>
          )}
        </button>        {/* Theme Toggle */}
        <button 
          onClick={toggleDarkMode}
          title={isDarkMode ? 'Switch to light mode' : 'Switch to dark mode'}
          className={cn(
            "p-2 text-neutral-500 hover:text-neutral-700",
            "hover:bg-neutral-100 rounded-lg transition-colors"
          )}
        >
          {isDarkMode ? (
            <SunIcon className="h-6 w-6" />
          ) : (
            <MoonIcon className="h-6 w-6" />
          )}
        </button>

        {/* User Menu */}
        <div className="relative">
          <button
            onClick={() => setUserMenuOpen(!userMenuOpen)}
            className={cn(
              "flex items-center space-x-2 px-3 py-2 text-sm font-medium text-neutral-700",
              "hover:bg-neutral-100 rounded-lg transition-colors"
            )}
          >
            <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center">
              <UserIcon className="h-5 w-5 text-primary-600" />
            </div>
            <div className="text-left">
              <div className="text-sm font-medium">John Doe</div>
              <div className="text-xs text-neutral-500">Fleet Manager</div>
            </div>
            <ChevronDownIcon className="h-4 w-4 text-neutral-400" />
          </button>

          {/* User Dropdown Menu */}
          {userMenuOpen && (
            <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg border border-neutral-200 py-1 z-50">
              <a
                href="/profile"
                className="block px-4 py-2 text-sm text-neutral-700 hover:bg-neutral-100"
              >
                Your Profile
              </a>
              <a
                href="/settings"
                className="block px-4 py-2 text-sm text-neutral-700 hover:bg-neutral-100"
              >
                Settings
              </a>
              <hr className="my-1 border-neutral-200" />
              <button
                className="block w-full text-left px-4 py-2 text-sm text-neutral-700 hover:bg-neutral-100"
              >
                Sign Out
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
