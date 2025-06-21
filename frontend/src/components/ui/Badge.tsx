import { cn, getStatusColor } from '@/lib/utils';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'default' | 'status';
  status?: string;
  size?: 'sm' | 'md';
  className?: string;
}

export function Badge({ 
  children, 
  variant = 'default', 
  status,
  size = 'md',
  className 
}: BadgeProps) {
  const baseClasses = 'inline-flex items-center rounded-full font-medium';
  
  const sizeClasses = {
    sm: 'px-2 py-0.5 text-xs',
    md: 'px-2.5 py-0.5 text-xs',
  };
  const variantClasses = {
    default: 'bg-[var(--theme-accent)]/20 text-[var(--theme-primary)]',
    status: status ? getStatusColor(status) : 'bg-[var(--theme-accent)]/20 text-[var(--theme-primary)]',
  };

  return (
    <span 
      className={cn(
        baseClasses,
        sizeClasses[size],
        variantClasses[variant],
        className
      )}
    >
      {children}
    </span>
  );
}

// Also export as default for backwards compatibility
export default Badge;
