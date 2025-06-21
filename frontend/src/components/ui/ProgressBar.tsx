import React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

interface ProgressBarProps extends VariantProps<typeof progressVariants> {
  value: number;
  max: number;
  className?: string;
  barClassName?: string;
  showValue?: boolean;
  showPercentage?: boolean;
  label?: string;
}

// Professional progress bar variants
const progressVariants = cva(
  "w-full rounded-full overflow-hidden transition-all duration-200",
  {
    variants: {
      variant: {
        default: "bg-neutral-200",
        success: "bg-status-success/20",
        warning: "bg-status-warning/20",
        error: "bg-status-error/20",
        info: "bg-launch-100",
      },
      size: {
        sm: "h-1",
        md: "h-2",
        lg: "h-3",
        xl: "h-4",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "md",
    },
  }
)

// Progress bar fill variants
const progressFillVariants = cva(
  "h-full transition-all duration-500 ease-out rounded-full",
  {
    variants: {
      variant: {
        default: "bg-launch-600",
        success: "bg-status-success",
        warning: "bg-status-warning",
        error: "bg-status-error",
        info: "bg-launch-500",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

export function ProgressBar({ 
  value, 
  max, 
  className,
  barClassName,
  variant,
  size,
  showValue = false,
  showPercentage = false,
  label,
}: ProgressBarProps) {
  const percentage = max > 0 ? Math.min(Math.max((value / max) * 100, 0), 100) : 0;
  
  return (
    <div className="space-y-2">
      {(label || showValue || showPercentage) && (
        <div className="flex justify-between items-center text-sm">
          {label && (
            <span className="font-medium text-neutral-700">{label}</span>
          )}
          <div className="flex items-center gap-2 text-neutral-600">
            {showValue && (
              <span>{value} / {max}</span>
            )}
            {showPercentage && (
              <span>{Math.round(percentage)}%</span>
            )}
          </div>
        </div>
      )}
      <div 
        className={cn(progressVariants({ variant, size }), className)}
        role="progressbar"
        aria-label={label || `Progress: ${value} of ${max}`}
        aria-valuenow={value}
        aria-valuemin={0}
        aria-valuemax={max}
      >        <div
          className={cn(progressFillVariants({ variant }), barClassName)}
          style={{ 
            width: `${percentage}%`,
          }}
        />
      </div>
    </div>
  );
}
