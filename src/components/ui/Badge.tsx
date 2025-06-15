import { cn, getStatusColor } from '@/lib/utils';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'default' | 'status';
  status?: string;
  className?: string;
}

export default function Badge({ 
  children, 
  variant = 'default', 
  status,
  className 
}: BadgeProps) {
  const baseClasses = 'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium';
  
  const variantClasses = {
    default: 'bg-gray-100 text-gray-800',
    status: status ? getStatusColor(status) : 'bg-gray-100 text-gray-800',
  };

  return (
    <span 
      className={cn(
        baseClasses,
        variantClasses[variant],
        className
      )}
    >
      {children}
    </span>
  );
}
