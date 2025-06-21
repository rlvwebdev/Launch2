// Temporary compatibility helper for Badge status migration
// This file will help migrate from old Badge API to new Badge API
import { Badge as NewBadge } from './Badge';

// Legacy status mappings
const legacyStatusMap: Record<string, any> = {
  'maintenance': 'warning',
  'delivered': 'success',
  'pending': 'pending',
  'oos': 'error',
  'in-transit': 'info',
  'active': 'active',
  'in-training': 'warning',
  'in-use': 'info',
  'available': 'success',
  'critical': 'critical',
  'assigned': 'info',
  'picked-up': 'active',
  'delivering': 'warning',
  'cancelled': 'error',
  'inactive': 'inactive',
  'on_leave': 'neutral',
  'terminated': 'error',
  'open': 'error',
  'in_progress': 'info',
  'resolved': 'success',
  'closed': 'neutral',
  'low': 'success',
  'medium': 'warning',
  'high': 'warning',
};

// Legacy variant mappings
const legacyVariantMap: Record<string, any> = {
  'status': 'default',
  'default': 'default',
  'secondary': 'secondary',
  'outline': 'outline',
  'solid': 'solid',
};

interface LegacyBadgeProps {
  variant?: 'status' | 'default' | 'secondary' | 'outline' | 'solid';
  status?: string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  children?: React.ReactNode;
  [key: string]: any; // Allow any additional props
}

// Legacy Badge wrapper that converts old API to new API
export default function Badge({ variant = 'default', status, size, className, children, ...props }: LegacyBadgeProps) {
  const newVariant = legacyVariantMap[variant] || 'default';
  const newStatus = status ? legacyStatusMap[status] || status : undefined;
  
  return (
    <NewBadge
      variant={newVariant}
      status={newStatus}
      size={size}
      className={className}
      {...props}
    >
      {children}
    </NewBadge>
  );
}
