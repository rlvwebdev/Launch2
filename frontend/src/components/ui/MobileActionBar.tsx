import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

interface MobileActionBarProps extends VariantProps<typeof actionBarVariants> {
  children: React.ReactNode;
  className?: string;
}

// Professional mobile action bar variants
const actionBarVariants = cva(
  "fixed left-0 right-0 md:relative md:bottom-auto md:mt-6 z-40",
  {
    variants: {
      variant: {
        default: "bottom-20 bg-white border-t border-neutral-200 md:border-0 md:bg-transparent shadow-elevation-medium md:shadow-none",
        floating: "bottom-24 mx-4 bg-white rounded-xl border border-neutral-200 shadow-elevation-high md:mx-0 md:border-0 md:bg-transparent md:shadow-none md:rounded-none",
        elevated: "bottom-20 bg-white border-t border-neutral-200 md:border-0 md:bg-transparent shadow-elevation-high md:shadow-none backdrop-blur-sm",
        compact: "bottom-16 bg-white/90 backdrop-blur-md border-t border-neutral-200/50 md:border-0 md:bg-transparent md:shadow-none",
      },
      spacing: {
        sm: "px-3 py-2 md:px-0 md:py-0",
        md: "px-4 py-3 md:px-0 md:py-0",
        lg: "px-6 py-4 md:px-0 md:py-0",
      },
    },
    defaultVariants: {
      variant: "default",
      spacing: "md",
    },
  }
)

export default function MobileActionBar({ 
  children, 
  className, 
  variant, 
  spacing,
  ...props 
}: MobileActionBarProps) {
  return (
    <div 
      className={cn(actionBarVariants({ variant, spacing }), className)}
      {...props}
    >
      <div className="flex gap-3 max-w-md mx-auto md:max-w-none">
        {children}
      </div>
    </div>
  );
}
