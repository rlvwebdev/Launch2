'use client';

import React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { 
  CheckCircle, 
  AlertTriangle, 
  Clock, 
  XCircle, 
  Info, 
  Minus,
  Truck,
  User,
  Package,
  MapPin
} from 'lucide-react';
import clsx from 'clsx';

// Status Indicator variants using CVA
const statusIndicatorVariants = cva(
  'inline-flex items-center gap-2 font-medium transition-all duration-200',
  {
    variants: {
      variant: {
        success: 'text-success-700',
        warning: 'text-warning-700',
        error: 'text-error-700',
        info: 'text-info-700',
        neutral: 'text-neutral-700',
        pending: 'text-warning-600',
        active: 'text-success-600',
        inactive: 'text-neutral-500',
        critical: 'text-error-600',
      },
      size: {
        sm: 'text-xs',
        md: 'text-sm',
        lg: 'text-base',
      },
      style: {
        minimal: '',
        badge: 'px-2 py-1 rounded-full',
        card: 'px-3 py-2 rounded-lg border',
        dot: 'text-xs',
      },
    },
    compoundVariants: [
      // Badge style variants
      {
        style: 'badge',
        variant: 'success',
        class: 'bg-success-50 text-success-700 border border-success-200',
      },
      {
        style: 'badge',
        variant: 'warning',
        class: 'bg-warning-50 text-warning-700 border border-warning-200',
      },
      {
        style: 'badge',
        variant: 'error',
        class: 'bg-error-50 text-error-700 border border-error-200',
      },
      {
        style: 'badge',
        variant: 'info',
        class: 'bg-info-50 text-info-700 border border-info-200',
      },
      {
        style: 'badge',
        variant: 'neutral',
        class: 'bg-neutral-50 text-neutral-700 border border-neutral-200',
      },
      {
        style: 'badge',
        variant: 'pending',
        class: 'bg-warning-50 text-warning-700 border border-warning-200',
      },
      {
        style: 'badge',
        variant: 'active',
        class: 'bg-success-50 text-success-700 border border-success-200',
      },
      {
        style: 'badge',
        variant: 'inactive',
        class: 'bg-neutral-50 text-neutral-500 border border-neutral-200',
      },
      {
        style: 'badge',
        variant: 'critical',
        class: 'bg-error-50 text-error-700 border border-error-200',
      },
      // Card style variants
      {
        style: 'card',
        variant: 'success',
        class: 'bg-success-50 border-success-200 shadow-sm',
      },
      {
        style: 'card',
        variant: 'warning',
        class: 'bg-warning-50 border-warning-200 shadow-sm',
      },
      {
        style: 'card',
        variant: 'error',
        class: 'bg-error-50 border-error-200 shadow-sm',
      },
      {
        style: 'card',
        variant: 'info',
        class: 'bg-info-50 border-info-200 shadow-sm',
      },
      {
        style: 'card',
        variant: 'neutral',
        class: 'bg-neutral-50 border-neutral-200 shadow-sm',
      },
    ],
    defaultVariants: {
      variant: 'neutral',
      size: 'md',
      style: 'minimal',
    },
  }
);

// Icon mapping for different status types
const STATUS_ICONS = {
  success: CheckCircle,
  warning: AlertTriangle,
  error: XCircle,
  info: Info,
  neutral: Minus,
  pending: Clock,
  active: CheckCircle,
  inactive: Minus,
  critical: AlertTriangle,
};

// Context-specific icons for TMS
const CONTEXT_ICONS = {
  driver: User,
  truck: Truck,
  load: Package,
  location: MapPin,
};

export interface StatusIndicatorProps extends VariantProps<typeof statusIndicatorVariants> {
  children: React.ReactNode;
  className?: string;
  icon?: React.ReactNode | 'auto' | 'none';
  context?: 'driver' | 'truck' | 'load' | 'location';
  pulse?: boolean;
  showDot?: boolean;
  dotPosition?: 'left' | 'right';
}

export function StatusIndicator({
  children,
  className,
  variant = 'neutral',
  size = 'md',
  style = 'minimal',
  icon = 'auto',
  context,
  pulse = false,
  showDot = false,
  dotPosition = 'left',
}: StatusIndicatorProps) {
  
  // Determine which icon to show
  const getIcon = () => {
    if (icon === 'none') return null;
    
    if (icon && icon !== 'auto') {
      return icon;
    }
    
    // Context-specific icon takes precedence
    if (context && CONTEXT_ICONS[context]) {
      const ContextIcon = CONTEXT_ICONS[context];
      return <ContextIcon className={clsx(
        'flex-shrink-0',
        size === 'sm' && 'h-3 w-3',
        size === 'md' && 'h-4 w-4',
        size === 'lg' && 'h-5 w-5'
      )} />;
    }
    
    // Default status icon
    if (variant && STATUS_ICONS[variant]) {
      const StatusIcon = STATUS_ICONS[variant];
      return <StatusIcon className={clsx(
        'flex-shrink-0',
        size === 'sm' && 'h-3 w-3',
        size === 'md' && 'h-4 w-4',
        size === 'lg' && 'h-5 w-5'
      )} />;
    }
    
    return null;
  };

  // Determine dot size and colors
  const getDotClasses = () => {
    const sizeClasses = {
      sm: 'h-1.5 w-1.5',
      md: 'h-2 w-2',
      lg: 'h-2.5 w-2.5',
    };
    
    const colorClasses = {
      success: 'bg-success-500',
      warning: 'bg-warning-500',
      error: 'bg-error-500',
      info: 'bg-info-500',
      neutral: 'bg-neutral-400',
      pending: 'bg-warning-500',
      active: 'bg-success-500',
      inactive: 'bg-neutral-400',
      critical: 'bg-error-500',
    };
    
    return clsx(
      'rounded-full flex-shrink-0',
      sizeClasses[size || 'md'],
      colorClasses[variant || 'neutral'],
      pulse && 'animate-pulse'
    );
  };

  const iconElement = getIcon();
  const dotElement = showDot && (
    <span className={getDotClasses()} />
  );

  return (
    <span 
      className={clsx(
        statusIndicatorVariants({ variant, size, style }),
        pulse && variant === 'pending' && 'animate-pulse',
        className
      )}
    >
      {showDot && dotPosition === 'left' && dotElement}
      {iconElement}
      <span className="flex-1">{children}</span>
      {showDot && dotPosition === 'right' && dotElement}
    </span>
  );
}

// Convenience components for common status patterns
export function DriverStatus({ 
  status, 
  driverName,
  className 
}: { 
  status: string; 
  driverName?: string;
  className?: string;
}) {
  const getVariant = (): StatusIndicatorProps['variant'] => {
    switch (status.toLowerCase()) {
      case 'active': return 'active';
      case 'inactive': return 'inactive';
      case 'on_leave': 
      case 'on-leave': return 'warning';
      case 'terminated': return 'error';
      case 'in_training':
      case 'in-training': return 'info';
      default: return 'neutral';
    }
  };

  const getLabel = () => {
    switch (status.toLowerCase()) {
      case 'active': return 'Active';
      case 'inactive': return 'Inactive';
      case 'on_leave':
      case 'on-leave': return 'On Leave';
      case 'terminated': return 'Terminated';
      case 'in_training':
      case 'in-training': return 'In Training';
      default: return status;
    }
  };

  return (
    <StatusIndicator
      variant={getVariant()}
      context="driver"
      style="badge"
      className={className}
    >
      {driverName ? `${driverName} - ${getLabel()}` : getLabel()}
    </StatusIndicator>
  );
}

export function TruckStatus({ 
  status, 
  truckId,
  className 
}: { 
  status: string; 
  truckId?: string;
  className?: string;
}) {
  const getVariant = (): StatusIndicatorProps['variant'] => {
    switch (status.toLowerCase()) {
      case 'available': return 'success';
      case 'assigned': 
      case 'in_use':
      case 'in-use': return 'active';
      case 'maintenance': return 'warning';
      case 'out_of_service':
      case 'out-of-service': return 'error';
      default: return 'neutral';
    }
  };

  const getLabel = () => {
    switch (status.toLowerCase()) {
      case 'available': return 'Available';
      case 'assigned': return 'Assigned';
      case 'in_use':
      case 'in-use': return 'In Use';
      case 'maintenance': return 'Maintenance';
      case 'out_of_service':
      case 'out-of-service': return 'Out of Service';
      default: return status;
    }
  };

  return (
    <StatusIndicator
      variant={getVariant()}
      context="truck"
      style="badge"
      className={className}
    >
      {truckId ? `${truckId} - ${getLabel()}` : getLabel()}
    </StatusIndicator>
  );
}

export function LoadStatus({ 
  status, 
  loadNumber,
  className 
}: { 
  status: string; 
  loadNumber?: string;
  className?: string;
}) {
  const getVariant = (): StatusIndicatorProps['variant'] => {
    switch (status.toLowerCase()) {
      case 'pending': return 'pending';
      case 'assigned': return 'info';
      case 'picked_up':
      case 'picked-up': return 'active';
      case 'in_transit':
      case 'in-transit': return 'active';
      case 'delivered': return 'success';
      case 'cancelled': return 'error';
      default: return 'neutral';
    }
  };

  const getLabel = () => {
    switch (status.toLowerCase()) {
      case 'pending': return 'Pending';
      case 'assigned': return 'Assigned';
      case 'picked_up':
      case 'picked-up': return 'Picked Up';
      case 'in_transit':
      case 'in-transit': return 'In Transit';
      case 'delivered': return 'Delivered';
      case 'cancelled': return 'Cancelled';
      default: return status;
    }
  };

  const shouldPulse = ['pending', 'assigned', 'picked_up', 'picked-up', 'in_transit', 'in-transit'].includes(status.toLowerCase());

  return (
    <StatusIndicator
      variant={getVariant()}
      context="load"
      style="badge"
      pulse={shouldPulse}
      className={className}
    >
      {loadNumber ? `${loadNumber} - ${getLabel()}` : getLabel()}
    </StatusIndicator>
  );
}

// Real-time status indicator with pulse animation
export function RealTimeStatus({
  isOnline,
  lastUpdate,
  className
}: {
  isOnline: boolean;
  lastUpdate?: Date;
  className?: string;
}) {
  const formatLastUpdate = () => {
    if (!lastUpdate) return 'Never';
    
    const now = new Date();
    const diff = now.getTime() - lastUpdate.getTime();
    const minutes = Math.floor(diff / 60000);
    
    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes}m ago`;
    
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h ago`;
    
    const days = Math.floor(hours / 24);
    return `${days}d ago`;
  };

  return (
    <StatusIndicator
      variant={isOnline ? 'active' : 'inactive'}
      size="sm"
      style="badge"
      showDot
      pulse={isOnline}
      className={className}
    >
      {isOnline ? 'Online' : 'Offline'} • {formatLastUpdate()}
    </StatusIndicator>
  );
}
