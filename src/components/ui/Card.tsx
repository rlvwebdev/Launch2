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
        'bg-white rounded-lg border border-gray-200 shadow-sm',
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
    <div className={cn('pb-3 border-b border-gray-200', className)}>
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
    <div className={cn('pt-3 border-t border-gray-200', className)}>
      {children}
    </div>
  );
}

export { Card, CardHeader, CardContent, CardFooter };
