import { cn } from '@/lib/utils';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  padding?: 'none' | 'sm' | 'md' | 'lg';
}

interface CardHeaderProps {
  children: React.ReactNode;
  className?: string;
}

interface CardContentProps {
  children: React.ReactNode;
  className?: string;
}

interface CardFooterProps {
  children: React.ReactNode;
  className?: string;
}

interface CardTitleProps {
  children: React.ReactNode;
  className?: string;
}

interface CardDescriptionProps {
  children: React.ReactNode;
  className?: string;
}

const paddingVariants = {
  none: '',
  sm: 'p-3',
  md: 'p-4',
  lg: 'p-6',
};

function Card({ children, className, padding = 'md' }: CardProps) {
  return (
    <div 
      className={cn(
        'bg-[var(--color-surface)] border border-[var(--color-neutral)]/10 rounded-lg shadow-sm',
        paddingVariants[padding],
        className
      )}
    >
      {children}
    </div>
  );
}

function CardHeader({ children, className }: CardHeaderProps) {
  return (
    <div className={cn('pb-3 border-b border-[var(--color-neutral)]/10', className)}>
      {children}
    </div>
  );
}

function CardContent({ children, className }: CardContentProps) {
  return (
    <div className={cn('py-3', className)}>
      {children}
    </div>
  );
}

function CardFooter({ children, className }: CardFooterProps) {
  return (
    <div className={cn('pt-3 border-t border-[var(--color-neutral)]/10', className)}>
      {children}
    </div>
  );
}

function CardTitle({ children, className }: CardTitleProps) {
  return (
    <h3 className={cn('text-lg font-semibold text-white', className)}>
      {children}
    </h3>
  );
}

function CardDescription({ children, className }: CardDescriptionProps) {
  return (
    <p className={cn('text-sm text-[var(--color-neutral)]', className)}>
      {children}
    </p>
  );
}

// Assign sub-components as properties of Card
Card.Header = CardHeader;
Card.Content = CardContent;
Card.Footer = CardFooter;
Card.Title = CardTitle;
Card.Description = CardDescription;

export { Card, CardHeader, CardContent, CardFooter, CardTitle, CardDescription };
