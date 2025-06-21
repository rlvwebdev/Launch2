import { clsx, type ClassValue } from 'clsx';

/**
 * Utility function to combine CSS classes conditionally
 * Uses clsx for conditional class names
 */
export function cn(...inputs: ClassValue[]) {
  return clsx(inputs);
}

/**
 * Format a date to a readable string
 */
export function formatDate(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  return d.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

/**
 * Format a date with time
 */
export function formatDateTime(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  return d.toLocaleString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

/**
 * Format phone number to (XXX) XXX-XXXX format
 */
export function formatPhoneNumber(phone: string): string {
  const cleaned = phone.replace(/\D/g, '');
  const match = cleaned.match(/^(\d{3})(\d{3})(\d{4})$/);
  if (match) {
    return `(${match[1]}) ${match[2]}-${match[3]}`;
  }
  return phone;
}

/**
 * Capitalize first letter of each word
 */
export function toTitleCase(str: string): string {
  return str.replace(/\w\S*/g, (txt) => 
    txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase()
  );
}

/**
 * Generate a unique ID (simple implementation)
 */
export function generateId(): string {
  return Math.random().toString(36).substr(2, 9);
}

/**
 * Calculate days between two dates
 */
export function daysBetween(date1: Date, date2: Date): number {
  const diffTime = Math.abs(date2.getTime() - date1.getTime());
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
}

/**
 * Check if a date is overdue
 */
export function isOverdue(date: Date): boolean {
  return date < new Date();
}

/**
 * Format weight in pounds with proper units
 */
export function formatWeight(weight: number): string {
  if (weight >= 2000) {
    return `${(weight / 2000).toFixed(1)} tons`;
  }
  return `${weight.toLocaleString()} lbs`;
}

/**
 * Format currency
 */
export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(amount);
}

/**
 * Get status color classes for UI components using Launch color palette
 */
export function getStatusColor(status: string): string {
  const statusColors: Record<string, string> = {
    active: 'bg-launch-mint text-launch-navy',
    inactive: 'bg-launch-gray/30 text-launch-navy',
    'on-break': 'bg-warning-100 text-warning-800',
    available: 'bg-launch-mint text-launch-navy',
    'in-use': 'bg-launch-teal/20 text-launch-teal',
    maintenance: 'bg-warning-100 text-warning-800',
    'out-of-service': 'bg-danger-100 text-danger-800',
    pending: 'bg-launch-gray/30 text-launch-navy',
    assigned: 'bg-launch-teal/20 text-launch-teal',
    'picked-up': 'bg-warning-100 text-warning-800',
    'in-transit': 'bg-primary-100 text-primary-800',
    delivered: 'bg-launch-mint text-launch-navy',
    cancelled: 'bg-danger-100 text-danger-800',
  };
  
  return statusColors[status] || 'bg-launch-gray/30 text-launch-navy';
}

/**
 * Validate email format
 */
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Validate phone number format
 */
export function isValidPhoneNumber(phone: string): boolean {
  const phoneRegex = /^\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$/;
  return phoneRegex.test(phone);
}
