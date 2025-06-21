import React, { forwardRef } from 'react';
import { cn } from '@/lib/utils';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  className?: string;
  padding?: 'none' | 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  variant?: 'default' | 'elevated' | 'outlined' | 'ghost' | 'interactive' | 'dense' | 'status';
  status?: 'success' | 'warning' | 'error' | 'info' | 'neutral';
  hover?: boolean;
}

interface CardHeaderProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  className?: string;
  divided?: boolean;
}

interface CardContentProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  className?: string;
  dense?: boolean;
}

interface CardFooterProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  className?: string;
  divided?: boolean;
  actions?: boolean;
}

interface CardTitleProps extends React.HTMLAttributes<HTMLHeadingElement> {
  children: React.ReactNode;
  className?: string;
  as?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

interface CardDescriptionProps extends React.HTMLAttributes<HTMLParagraphElement> {
  children: React.ReactNode;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

// Professional padding system for different content types
const paddingVariants = {
  none: '',
  xs: 'p-2',      // 8px - Very tight for dense content
  sm: 'p-3',      // 12px - Compact cards, status indicators
  md: 'p-4',      // 16px - Standard card padding
  lg: 'p-6',      // 24px - Comfortable spacing for forms
  xl: 'p-8',      // 32px - Spacious layouts, hero cards
};

// Professional card variants for different use cases
const cardVariants = {
  // Default card - clean, professional appearance
  default: 'bg-white border border-neutral-200 shadow-card rounded-lg transition-all duration-200',
  
  // Elevated card - important information, focal points
  elevated: 'bg-white border border-neutral-200 shadow-card-elevated rounded-lg transition-all duration-200',
  
  // Outlined card - emphasized content with stronger border
  outlined: 'bg-white border-2 border-launch-blue-200 shadow-card rounded-lg transition-all duration-200',
  
  // Ghost card - subtle background for secondary content
  ghost: 'bg-neutral-50/50 border border-neutral-100 rounded-lg transition-all duration-200',
  
  // Interactive card - for clickable/selectable content
  interactive: 'bg-white border border-neutral-200 shadow-card rounded-lg transition-all duration-200 cursor-pointer hover:shadow-card-hover hover:border-launch-blue-300 active:shadow-card',
  
  // Dense card - minimal padding for high information density
  dense: 'bg-white border border-neutral-200 shadow-sm rounded-md transition-all duration-200',
  
  // Status card - contextual coloring based on status
  status: 'border rounded-lg shadow-card transition-all duration-200',
};

// Status-based styling for contextual cards
const statusVariants = {
  success: 'bg-status-success-bg border-status-success-border text-status-success-text',
  warning: 'bg-status-warning-bg border-status-warning-border text-status-warning-text',
  error: 'bg-status-error-bg border-status-error-border text-status-error-text',
  info: 'bg-status-info-bg border-status-info-border text-status-info-text',
  neutral: 'bg-status-neutral-bg border-status-neutral-border text-status-neutral-text',
};

// Enhanced Card component with professional TMS design system
const Card = forwardRef<HTMLDivElement, CardProps>(({ 
  children, 
  className, 
  padding = 'md',
  variant = 'default',
  status,
  hover = false,
  ...props 
}, ref) => {
  return (
    <div 
      ref={ref}
      className={cn(
        cardVariants[variant],
        variant === 'status' && status && statusVariants[status],
        hover && 'hover:shadow-card-hover hover:border-launch-blue-300',
        paddingVariants[padding],
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
});

// Enhanced Card Header with optional divider
const CardHeader = forwardRef<HTMLDivElement, CardHeaderProps>(({ 
  children, 
  className,
  divided = true,
  ...props 
}, ref) => {
  return (
    <div 
      ref={ref}
      className={cn(
        'space-y-1.5',
        divided && 'pb-4 border-b border-neutral-200',
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
});

// Enhanced Card Content with density options
const CardContent = forwardRef<HTMLDivElement, CardContentProps>(({ 
  children, 
  className,
  dense = false,
  ...props 
}, ref) => {
  return (
    <div 
      ref={ref}
      className={cn(
        dense ? 'pt-2' : 'pt-4',
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
});

// Enhanced Card Footer with actions styling
const CardFooter = forwardRef<HTMLDivElement, CardFooterProps>(({ 
  children, 
  className,
  divided = true,
  actions = false,
  ...props 
}, ref) => {
  return (
    <div 
      ref={ref}
      className={cn(
        'pt-4',
        divided && 'border-t border-neutral-200',
        actions ? 'flex items-center justify-between gap-2' : 'flex items-center justify-end gap-2',
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
});

// Enhanced Card Title with size variants
const CardTitle = forwardRef<HTMLHeadingElement, CardTitleProps>(({ 
  children, 
  className,
  as: Component = 'h3',
  size = 'md',
  ...props 
}, ref) => {
  const sizeClasses = {
    sm: 'text-base font-semibold leading-6 text-neutral-900',
    md: 'text-lg font-semibold leading-6 text-neutral-900',
    lg: 'text-xl font-semibold leading-7 text-neutral-900',
    xl: 'text-2xl font-semibold leading-8 text-neutral-900',
  };

  return (
    <Component 
      ref={ref}
      className={cn(sizeClasses[size], className)}
      {...props}
    >
      {children}
    </Component>
  );
});

// Enhanced Card Description with size variants
const CardDescription = forwardRef<HTMLParagraphElement, CardDescriptionProps>(({ 
  children, 
  className,
  size = 'md',
  ...props 
}, ref) => {
  const sizeClasses = {
    sm: 'text-xs text-neutral-600 leading-4',
    md: 'text-sm text-neutral-600 leading-5',
    lg: 'text-base text-neutral-600 leading-6',
  };

  return (
    <p 
      ref={ref}
      className={cn(sizeClasses[size], className)}
      {...props}
    >
      {children}
    </p>
  );
});

Card.displayName = 'Card';
CardHeader.displayName = 'CardHeader';
CardContent.displayName = 'CardContent';
CardFooter.displayName = 'CardFooter';
CardTitle.displayName = 'CardTitle';
CardDescription.displayName = 'CardDescription';

export { Card, CardHeader, CardContent, CardFooter, CardTitle, CardDescription };
