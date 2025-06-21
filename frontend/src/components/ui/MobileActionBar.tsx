import { cn } from '@/lib/utils';

interface MobileActionBarProps {
  children: React.ReactNode;
  className?: string;
}

export default function MobileActionBar({ children, className }: MobileActionBarProps) {
  return (
    <div className={cn(
      // Position fixed at bottom with proper spacing above bottom nav
      "fixed bottom-20 left-0 right-0 md:relative md:bottom-auto md:mt-6",      // Background and styling
      "bg-white border-t border-launch-gray md:border-0 md:bg-transparent",
      // Padding and shadows
      "px-4 py-3 md:px-0 md:py-0",
      "shadow-lg md:shadow-none",
      // Z-index to stay above content but below modals
      "z-40",
      className
    )}>
      <div className="flex gap-3 max-w-md mx-auto md:max-w-none">
        {children}
      </div>
    </div>
  );
}
