import React from 'react';
import { cn } from '@/lib/utils';
import { AlertCircle, CheckCircle, Info, XCircle } from 'lucide-react';

interface AlertProps {
  variant?: 'default' | 'destructive' | 'success' | 'warning';
  className?: string;
  children: React.ReactNode;
}

interface AlertDescriptionProps {
  className?: string;
  children: React.ReactNode;
}

const alertVariants = {
  default: 'bg-blue-50 border-blue-200 text-blue-800',
  destructive: 'bg-red-50 border-red-200 text-red-800',
  success: 'bg-green-50 border-green-200 text-green-800',
  warning: 'bg-yellow-50 border-yellow-200 text-yellow-800',
};

const alertIcons = {
  default: Info,
  destructive: XCircle,
  success: CheckCircle,
  warning: AlertCircle,
};

export function Alert({ variant = 'default', className, children }: AlertProps) {
  const Icon = alertIcons[variant];

  return (
    <div
      className={cn(
        'relative w-full rounded-lg border p-4',
        alertVariants[variant],
        className
      )}
      role="alert"
    >
      <div className="flex items-start space-x-2">
        <Icon className="h-4 w-4 mt-0.5 flex-shrink-0" />
        <div className="flex-1">{children}</div>
      </div>
    </div>
  );
}

export function AlertDescription({ className, children }: AlertDescriptionProps) {
  return (
    <div className={cn('text-sm', className)}>
      {children}
    </div>
  );
}
