'use client';

import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/Button';
import { MoreVertical, X } from 'lucide-react';
import { cn } from '@/lib/utils';

interface MobileActionDropdownProps {
  children: React.ReactNode;
  className?: string;
  trigger?: React.ReactNode;
}

export default function MobileActionDropdown({ 
  children, 
  className,
  trigger 
}: MobileActionDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Close dropdown when pressing Escape
  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsOpen(false);
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => {
      document.removeEventListener('keydown', handleEscape);
    };
  }, []);

  return (
    <div className={cn("relative", className)} ref={dropdownRef}>
      {/* Trigger Button */}
      <div onClick={() => setIsOpen(!isOpen)}>
        {trigger || (
          <Button variant="outline" size="sm" className="md:hidden">
            {isOpen ? (
              <X className="h-4 w-4" />
            ) : (
              <MoreVertical className="h-4 w-4" />
            )}
          </Button>
        )}
      </div>

      {/* Dropdown Menu */}
      {isOpen && (
        <>
          {/* Backdrop for mobile */}
          <div className="fixed inset-0 bg-black bg-opacity-25 z-40 md:hidden" />
          
          {/* Dropdown Content */}
          <div className={cn(
            // Mobile: Bottom sheet style
            "fixed bottom-20 left-4 right-4 md:absolute md:bottom-auto md:left-auto md:right-0 md:top-full md:mt-2",            // Background and styling
            "bg-white rounded-lg border border-launch-gray shadow-lg",
            // Z-index to stay above backdrop but below modals
            "z-50",
            // Width constraints
            "md:w-48 md:min-w-max"
          )}>
            {/* Mobile header */}            <div className="flex items-center justify-between p-4 border-b border-launch-gray md:hidden">
              <h3 className="text-lg font-medium text-launch-navy">Actions</h3>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1 hover:bg-launch-mint/20 rounded"
                aria-label="Close actions menu"
              >
                <X className="h-5 w-5 text-launch-navy/70" />
              </button>
            </div>
            
            {/* Actions */}
            <div className="p-2">
              <div 
                className="space-y-1"
                onClick={() => setIsOpen(false)} // Close dropdown when any action is clicked
              >
                {children}
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
