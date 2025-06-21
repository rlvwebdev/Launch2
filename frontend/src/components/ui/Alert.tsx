import React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';
import { AlertCircle, CheckCircle, Info, XCircle, AlertTriangle } from 'lucide-react';

interface AlertProps extends VariantProps<typeof alertVariants> {
  className?: string;
  children: React.ReactNode;
  showIcon?: boolean;
}

interface AlertDescriptionProps {
  className?: string;
  children: React.ReactNode;
}

interface AlertTitleProps {
  className?: string;
  children: React.ReactNode;
}

// Professional alert variants
const alertVariants = cva(
  "relative w-full rounded-lg border p-4 transition-colors",
  {
    variants: {
      variant: {
        default: "bg-neutral-50 border-neutral-200 text-neutral-800",
        info: "bg-launch-50 border-launch-200 text-launch-800",
        success: "bg-status-success/10 border-status-success/20 text-status-success-dark",
        warning: "bg-status-warning/10 border-status-warning/20 text-status-warning-dark", 
        error: "bg-status-error/10 border-status-error/20 text-status-error-dark",
        critical: "bg-status-critical/10 border-status-critical/20 text-status-critical-dark",
      },
      size: {
        sm: "p-3 text-sm",
        md: "p-4",
        lg: "p-6 text-base",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "md",
    },
  }
)

// Icon mapping for alert variants
const alertIcons = {
  default: Info,
  info: Info,
  success: CheckCircle,
  warning: AlertTriangle,
  error: XCircle,
  critical: AlertCircle,
} as const;

export function Alert({ 
  variant = 'default', 
  size, 
  className, 
  children, 
  showIcon = true 
}: AlertProps) {
  const Icon = alertIcons[variant || 'default'];

  return (
    <div
      className={cn(alertVariants({ variant, size }), className)}
      role="alert"
    >
      <div className="flex items-start space-x-3">
        {showIcon && (
          <Icon className="h-4 w-4 mt-0.5 flex-shrink-0" />
        )}
        <div className="flex-1 min-w-0">{children}</div>
      </div>
    </div>
  );
}

export function AlertTitle({ className, children }: AlertTitleProps) {
  return (
    <h4 className={cn('font-semibold mb-1', className)}>
      {children}
    </h4>
  );
}

export function AlertDescription({ className, children }: AlertDescriptionProps) {
  return (
    <div className={cn('text-sm opacity-90 leading-relaxed', className)}>
      {children}
    </div>
  );
}
