import React, { forwardRef } from 'react';
import { cn } from '@/lib/utils';

interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  children: React.ReactNode;
  variant?: 'default' | 'secondary' | 'outline' | 'solid';
  status?: 'success' | 'warning' | 'error' | 'info' | 'neutral' | 'active' | 'inactive' | 'pending' | 'critical';
  size?: 'xs' | 'sm' | 'md' | 'lg';
  pill?: boolean;
  dot?: boolean;
}

// Professional badge variants for different emphasis levels
const badgeVariants = {
  // Default - subtle background with border
  default: 'border bg-opacity-50',
  
  // Secondary - more prominent background
  secondary: 'border bg-opacity-75',
  
  // Outline - transparent background with border
  outline: 'bg-transparent border-2',
  
  // Solid - full color background
  solid: 'border-transparent text-white',
};

// Operational status colors for transportation management
const statusColors = {
  // Success states - completed, delivered, available
  success: {
    default: 'bg-operational-active-50 text-operational-active-700 border-operational-active-200',
    secondary: 'bg-operational-active-100 text-operational-active-800 border-operational-active-300',
    outline: 'text-operational-active-700 border-operational-active-300',
    solid: 'bg-operational-active-500 border-operational-active-500',
  },
  
  // Warning states - maintenance due, expiring soon
  warning: {
    default: 'bg-operational-warning-50 text-operational-warning-700 border-operational-warning-200',
    secondary: 'bg-operational-warning-100 text-operational-warning-800 border-operational-warning-300',
    outline: 'text-operational-warning-700 border-operational-warning-300',
    solid: 'bg-operational-warning-500 border-operational-warning-500',
  },
  
  // Error states - overdue, failed, emergency
  error: {
    default: 'bg-operational-critical-50 text-operational-critical-700 border-operational-critical-200',
    secondary: 'bg-operational-critical-100 text-operational-critical-800 border-operational-critical-300',
    outline: 'text-operational-critical-700 border-operational-critical-300',
    solid: 'bg-operational-critical-500 border-operational-critical-500',
  },
  
  // Info states - scheduled, planned, informational
  info: {
    default: 'bg-launch-blue-50 text-launch-blue-700 border-launch-blue-200',
    secondary: 'bg-launch-blue-100 text-launch-blue-800 border-launch-blue-300',
    outline: 'text-launch-blue-700 border-launch-blue-300',
    solid: 'bg-launch-blue-500 border-launch-blue-500',
  },
  
  // Neutral states - default, unassigned
  neutral: {
    default: 'bg-neutral-50 text-neutral-700 border-neutral-200',
    secondary: 'bg-neutral-100 text-neutral-800 border-neutral-300',
    outline: 'text-neutral-700 border-neutral-300',
    solid: 'bg-neutral-500 border-neutral-500',
  },
  
  // Active operational states - driver available, truck running
  active: {
    default: 'bg-operational-active-50 text-operational-active-700 border-operational-active-200',
    secondary: 'bg-operational-active-100 text-operational-active-800 border-operational-active-300',
    outline: 'text-operational-active-700 border-operational-active-300',
    solid: 'bg-operational-active-500 border-operational-active-500',
  },
  
  // Inactive operational states - driver off duty, truck parked
  inactive: {
    default: 'bg-operational-inactive-50 text-operational-inactive-700 border-operational-inactive-200',
    secondary: 'bg-operational-inactive-100 text-operational-inactive-800 border-operational-inactive-300',
    outline: 'text-operational-inactive-700 border-operational-inactive-300',
    solid: 'bg-operational-inactive-500 border-operational-inactive-500',
  },
  
  // Pending operational states - in transit, processing
  pending: {
    default: 'bg-operational-pending-50 text-operational-pending-700 border-operational-pending-200',
    secondary: 'bg-operational-pending-100 text-operational-pending-800 border-operational-pending-300',
    outline: 'text-operational-pending-700 border-operational-pending-300',
    solid: 'bg-operational-pending-500 border-operational-pending-500',
  },
  
  // Critical operational states - emergency, immediate attention
  critical: {
    default: 'bg-operational-critical-50 text-operational-critical-700 border-operational-critical-200',
    secondary: 'bg-operational-critical-100 text-operational-critical-800 border-operational-critical-300',
    outline: 'text-operational-critical-700 border-operational-critical-300',
    solid: 'bg-operational-critical-500 border-operational-critical-500',
  },
};

// Professional size system for different contexts
const badgeSizes = {
  xs: 'px-1.5 py-0.5 text-xs font-medium', // 20px height - Very compact
  sm: 'px-2 py-1 text-xs font-medium',     // 24px height - Compact
  md: 'px-2.5 py-1 text-sm font-medium',   // 28px height - Standard
  lg: 'px-3 py-1.5 text-sm font-semibold', // 32px height - Prominent
};

export const Badge = forwardRef<HTMLSpanElement, BadgeProps>(({
  children,
  className,
  variant = 'default',
  status = 'neutral',
  size = 'sm',
  pill = false,
  dot = false,
  ...props
}, ref) => {
  return (
    <span
      ref={ref}
      className={cn(
        // Base badge styles
        'inline-flex items-center font-medium transition-colors',
        
        // Border radius - pill or standard
        pill ? 'rounded-full' : 'rounded-md',
        
        // Size variations
        badgeSizes[size],
        
        // Variant styling
        badgeVariants[variant],
        
        // Status-based colors
        statusColors[status]?.[variant] || statusColors.neutral[variant],
        
        // Dot indicator spacing
        dot && 'gap-1.5',
        
        className
      )}
      {...props}
    >
      {dot && (
        <span 
          className={cn(
            'h-1.5 w-1.5 rounded-full',
            status === 'success' || status === 'active' ? 'bg-operational-active-500' :
            status === 'warning' ? 'bg-operational-warning-500' :
            status === 'error' || status === 'critical' ? 'bg-operational-critical-500' :
            status === 'info' || status === 'pending' ? 'bg-launch-blue-500' :
            status === 'inactive' ? 'bg-operational-inactive-500' :
            'bg-neutral-500'
          )}
          aria-hidden="true"
        />
      )}
      {children}
    </span>
  );
});

Badge.displayName = 'Badge';

export default Badge;
