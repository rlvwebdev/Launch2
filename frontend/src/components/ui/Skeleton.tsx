import React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

interface SkeletonProps extends VariantProps<typeof skeletonVariants> {
  className?: string;
  children?: React.ReactNode;
}

// Professional skeleton variants
const skeletonVariants = cva(
  "animate-pulse bg-gradient-to-r from-neutral-200 via-neutral-300 to-neutral-200 bg-[length:200%_100%] rounded",
  {
    variants: {
      variant: {
        default: "bg-neutral-200",
        text: "bg-neutral-200",
        card: "bg-neutral-100 border border-neutral-200",
        avatar: "bg-neutral-200 rounded-full",
        button: "bg-neutral-200 rounded-md",
      },
      size: {
        sm: "h-4",
        md: "h-6", 
        lg: "h-8",
        xl: "h-12",
      },
      width: {
        xs: "w-16",
        sm: "w-24",
        md: "w-32",
        lg: "w-48",
        xl: "w-64",
        full: "w-full",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "md",
      width: "full",
    },
  }
)

export function Skeleton({ 
  className, 
  variant, 
  size, 
  width, 
  children,
  ...props 
}: SkeletonProps) {
  return (
    <div
      className={cn(skeletonVariants({ variant, size, width }), className)}
      {...props}
    >
      {children}
    </div>
  );
}

// Predefined skeleton components for common use cases
export function SkeletonText({ 
  lines = 1,
  className,
  ...props 
}: { 
  lines?: number; 
  className?: string; 
} & Omit<SkeletonProps, 'variant'>) {
  return (
    <div className={cn("space-y-2", className)}>
      {Array.from({ length: lines }).map((_, i) => (
        <Skeleton
          key={i}
          variant="text"
          className={i === lines - 1 ? "w-3/4" : "w-full"}
          {...props}
        />
      ))}
    </div>
  );
}

export function SkeletonCard({ 
  showAvatar = false,
  showButton = false,
  className,
  ...props 
}: { 
  showAvatar?: boolean;
  showButton?: boolean;
  className?: string;
} & Omit<SkeletonProps, 'variant'>) {
  return (
    <div className={cn("p-6 space-y-4", className)}>
      <div className="flex items-center space-x-4">
        {showAvatar && (
          <Skeleton variant="avatar" size="xl" width="xl" />
        )}
        <div className="space-y-2 flex-1">
          <Skeleton variant="text" size="md" width="lg" />
          <Skeleton variant="text" size="sm" width="md" />
        </div>
      </div>
      <div className="space-y-2">
        <SkeletonText lines={3} />
      </div>
      {showButton && (
        <div className="flex justify-end space-x-2">
          <Skeleton variant="button" size="lg" width="sm" />
          <Skeleton variant="button" size="lg" width="sm" />
        </div>
      )}
    </div>
  );
}

export function SkeletonTable({ 
  rows = 5,
  columns = 4,
  className,
}: {
  rows?: number;
  columns?: number;
  className?: string;
}) {
  return (
    <div className={cn("space-y-4", className)}>
      {/* Table header */}
      <div className="flex space-x-4">
        {Array.from({ length: columns }).map((_, i) => (
          <Skeleton key={i} variant="text" size="sm" width="lg" />
        ))}
      </div>
      {/* Table rows */}
      <div className="space-y-3">
        {Array.from({ length: rows }).map((_, i) => (
          <div key={i} className="flex space-x-4">
            {Array.from({ length: columns }).map((_, j) => (
              <Skeleton key={j} variant="text" size="md" width="lg" />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
