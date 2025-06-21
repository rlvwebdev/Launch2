import React, { forwardRef } from 'react';
import { cn } from '@/lib/utils';
import { Slot } from '@radix-ui/react-slot';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger' | 'success' | 'warning' | 'neutral';
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'icon';
  children: React.ReactNode;
  asChild?: boolean;
  loading?: boolean;
  fullWidth?: boolean;
}

// Professional button variants optimized for TMS interface
const buttonVariants = {
  // Primary - Main action, uses Launch blue for CTAs
  primary: 'bg-launch-blue-600 text-white shadow-sm hover:bg-launch-blue-700 focus:ring-launch-blue-500/30 active:bg-launch-blue-800 border border-transparent disabled:bg-launch-blue-300',
  
  // Secondary - Less prominent action, professional gray
  secondary: 'bg-white text-neutral-900 shadow-sm ring-1 ring-inset ring-neutral-300 hover:bg-neutral-50 focus:ring-launch-blue-500/30 active:bg-neutral-100 disabled:bg-neutral-100 disabled:text-neutral-400',
  
  // Outline - Subtle action with Launch blue accent
  outline: 'bg-white text-launch-blue-700 ring-1 ring-inset ring-launch-blue-300 hover:bg-launch-blue-50 focus:ring-launch-blue-500/30 active:bg-launch-blue-100 disabled:bg-white disabled:text-neutral-400 disabled:ring-neutral-200',
  
  // Ghost - Minimal styling for subtle actions
  ghost: 'bg-transparent text-neutral-700 hover:bg-neutral-100 hover:text-neutral-900 focus:bg-neutral-100 active:bg-neutral-200 disabled:text-neutral-400 disabled:hover:bg-transparent',
  
  // Danger - Critical actions, red accent
  danger: 'bg-operational-critical-500 text-white shadow-sm hover:bg-operational-critical-600 focus:ring-operational-critical-500/30 active:bg-operational-critical-700 border border-transparent disabled:bg-operational-critical-300',
  
  // Success - Positive actions, green accent
  success: 'bg-operational-active-500 text-white shadow-sm hover:bg-operational-active-600 focus:ring-operational-active-500/30 active:bg-operational-active-700 border border-transparent disabled:bg-operational-active-300',
  
  // Warning - Attention actions, amber accent
  warning: 'bg-operational-warning-500 text-white shadow-sm hover:bg-operational-warning-600 focus:ring-operational-warning-500/30 active:bg-operational-warning-700 border border-transparent disabled:bg-operational-warning-300',
  
  // Neutral - Subtle actions, gray palette
  neutral: 'bg-neutral-500 text-white shadow-sm hover:bg-neutral-600 focus:ring-neutral-500/30 active:bg-neutral-700 border border-transparent disabled:bg-neutral-300',
};

// Professional size system optimized for dense interfaces
const buttonSizes = {
  xs: 'px-2 py-1 text-xs rounded-md gap-x-1', // 24px height - Very compact for dense layouts
  sm: 'px-2.5 py-1.5 text-sm rounded-md gap-x-1.5', // 32px height - Compact for tables/cards
  md: 'px-3 py-2 text-sm rounded-md gap-x-1.5', // 36px height - Standard button size
  lg: 'px-3.5 py-2.5 text-sm rounded-md gap-x-2', // 44px height - Prominent actions
  xl: 'px-4 py-3 text-base rounded-md gap-x-2', // 52px height - Hero/CTA buttons
  icon: 'p-2 rounded-md', // Square icon button
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(({ 
  variant = 'primary', 
  size = 'md', 
  className,
  children,
  disabled,
  asChild = false,
  loading = false,
  fullWidth = false,
  ...props 
}, ref) => {
  const Comp = asChild ? Slot : 'button';
  
  return (
    <Comp
      ref={ref}
      className={cn(
        // Base styles - Professional TMS button foundation
        'inline-flex items-center justify-center font-medium transition-all duration-200',
        'focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-white',
        'disabled:opacity-50 disabled:cursor-not-allowed disabled:pointer-events-none',
        
        // Touch-friendly sizing for mobile accessibility
        'min-h-[44px] md:min-h-[32px]',
        
        // Professional interaction states
        'select-none active:scale-[0.98]',
        
        // Full width option for forms and mobile layouts
        fullWidth && 'w-full',
        
        // Variant styles with operational colors
        buttonVariants[variant],
        
        // Size styles with improved spacing
        buttonSizes[size],
        
        // Loading state with smooth transition
        loading && 'relative text-transparent cursor-wait',
        
        className
      )}
      disabled={disabled || loading}
      {...props}
    >
      {loading && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent opacity-75" />
        </div>
      )}
      {children}
    </Comp>
  );
});

Button.displayName = 'Button';

// Also export as default for backwards compatibility  
export default Button;
