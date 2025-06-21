import React, { forwardRef } from 'react';
import { cn } from '@/lib/utils';

interface InputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size'> {
  label?: string;
  error?: string;
  helperText?: string;
  variant?: 'default' | 'filled' | 'underlined';
  inputSize?: 'sm' | 'md' | 'lg';
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  fullWidth?: boolean;
}

// Professional input variants for different contexts
const inputVariants = {
  // Default - clean border with focus states
  default: 'border border-neutral-300 bg-white focus:border-launch-blue-500 focus:ring-launch-blue-500/20 shadow-sm',
  
  // Filled - subtle background for forms
  filled: 'border border-neutral-200 bg-neutral-50 focus:border-launch-blue-500 focus:ring-launch-blue-500/20 focus:bg-white',
  
  // Underlined - minimal design for dense layouts
  underlined: 'border-0 border-b-2 border-neutral-300 bg-transparent focus:border-launch-blue-500 focus:ring-0 rounded-none px-0 shadow-none',
};

// Professional size system for forms
const inputSizes = {
  sm: 'px-3 py-1.5 text-sm', // 32px height - Compact forms
  md: 'px-3 py-2 text-sm',   // 36px height - Standard forms
  lg: 'px-4 py-3 text-base', // 44px height - Prominent forms
};

export const Input = forwardRef<HTMLInputElement, InputProps>(({ 
  className, 
  label, 
  error, 
  helperText, 
  variant = 'default',
  inputSize = 'md',
  leftIcon,
  rightIcon,
  id, 
  ...props 
}, ref) => {
  const inputId = id || `input-${Math.random().toString(36).substr(2, 9)}`;

  return (
    <div className="space-y-2">
      {label && (
        <label 
          htmlFor={inputId} 
          className="block text-sm font-medium text-neutral-900"
        >
          {label}
        </label>
      )}
      
      <div className="relative">
        {leftIcon && (
          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-neutral-400">
            {leftIcon}
          </div>
        )}
        
        <input
          ref={ref}
          id={inputId}
          className={cn(
            // Base input styles - professional foundation
            'block w-full rounded-lg transition-all duration-200',
            'focus:outline-none focus:ring-2 focus:ring-offset-0',
            'disabled:cursor-not-allowed disabled:opacity-50 disabled:bg-neutral-100',
            'placeholder:text-neutral-400',
            
            // Variant-specific styling
            inputVariants[variant],
            
            // Size variations
            inputSizes[inputSize],
            
            // Icon spacing
            leftIcon && 'pl-10',
            rightIcon && 'pr-10',
            
            // Error state styling
            error && 'border-operational-critical-300 focus:border-operational-critical-500 focus:ring-operational-critical-500/20',
            
            className
          )}
          {...props}
        />
        
        {rightIcon && (
          <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none text-neutral-400">
            {rightIcon}
          </div>
        )}
      </div>
      
      {error && (
        <p className="text-sm text-operational-critical-600 flex items-center gap-1">
          <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
          {error}
        </p>
      )}
      
      {helperText && !error && (
        <p className="text-sm text-neutral-600">
          {helperText}
        </p>
      )}
    </div>
  );
});

Input.displayName = 'Input';
