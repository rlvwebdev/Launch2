import { cn } from '@/lib/utils';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  children: React.ReactNode;
}

const buttonVariants = {
  primary: 'bg-[var(--color-accent)] text-white hover:bg-[var(--color-accent)]/90 focus:ring-[var(--color-accent)]/50 active:bg-[var(--color-accent)]',
  secondary: 'bg-[var(--color-surface)] text-[var(--color-text)] border border-[var(--color-neutral)] hover:bg-[var(--color-neutral)]/20 focus:ring-[var(--color-accent)]/50 active:bg-[var(--color-accent)] active:text-white',
  outline: 'border border-[var(--color-neutral)] bg-transparent text-[var(--color-text)] hover:bg-[var(--color-surface)] focus:ring-[var(--color-accent)]/50 active:bg-[var(--color-accent)] active:text-white',
  ghost: 'bg-transparent text-[var(--color-text)] hover:bg-[var(--color-surface)] focus:ring-[var(--color-accent)]/50 active:bg-[var(--color-accent)] active:text-white',
  danger: 'bg-red-600 text-white hover:bg-red-700 focus:ring-red-500/50 active:bg-red-800',
};

const buttonSizes = {
  sm: 'px-3 py-1.5 text-sm',
  md: 'px-4 py-2 text-sm',
  lg: 'px-6 py-3 text-base',
};

export function Button({ 
  variant = 'primary', 
  size = 'md', 
  className,
  children,
  disabled,
  ...props 
}: ButtonProps) {
  return (
    <button
      className={cn(
        'inline-flex items-center justify-center font-medium transition-colors',
        'focus:outline-none focus:ring-2 focus:ring-offset-2',
        'disabled:opacity-50 disabled:cursor-not-allowed',
        'min-h-[44px] md:min-h-[36px]', // Touch-friendly on mobile
        buttonVariants[variant],
        buttonSizes[size],
        className
      )}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  );
}

// Also export as default for backwards compatibility
export default Button;
