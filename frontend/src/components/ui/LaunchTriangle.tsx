'use client';

import React from 'react';
import { useSidebar } from '@/components/context/SidebarContext';

interface LaunchTriangleProps {
  /**
   * Whether this triangle acts as a toggle button for the sidebar
   * When true, it will be clickable and toggle the sidebar when the sidebar is collapsed
   */
  isToggleButton?: boolean;
  /**
   * Additional CSS classes
   */
  className?: string;
}

export function LaunchTriangle({ 
  isToggleButton = false, 
  className = '' 
}: LaunchTriangleProps) {
  const { isCollapsed, toggleSidebar } = useSidebar();

  // Only act as a button if explicitly set and sidebar is collapsed
  const shouldBeButton = isToggleButton && isCollapsed;
  const baseStyles = "inline-block transition-all duration-300 ease-in-out align-baseline";
  const sizeStyles = className.includes('text-') ? '' : 'h-[1em] w-[1em]';
  const buttonStyles = shouldBeButton ? "cursor-pointer hover:scale-110 hover:brightness-110 active:scale-95 transform-gpu" : '';

  if (shouldBeButton) {
    return (
      <button
        className={`${baseStyles} ${sizeStyles} ${buttonStyles} ${className} bg-transparent border-none p-0 text-[var(--color-accent)]`}
        onClick={toggleSidebar}
        title="Open navigation"
        aria-label="Open navigation sidebar"
      >
        <svg
          viewBox="0 0 24 24"
          fill="currentColor"
          className="w-[1em] h-[1em]"
        >
          <path d="M12 2 L22 20 L2 20 Z" />
        </svg>
      </button>
    );
  }

  return (
    <span className={`${baseStyles} ${sizeStyles} ${className} text-[var(--color-accent)]`}>
      <svg
        viewBox="0 0 24 24"
        fill="currentColor"
        className="w-[1em] h-[1em]"
      >
        <path d="M12 2 L22 20 L2 20 Z" />
      </svg>
    </span>
  );
}
