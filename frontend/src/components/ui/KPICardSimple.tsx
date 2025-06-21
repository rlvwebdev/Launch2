'use client';

import React from 'react';
import { Card, CardContent } from './Card';
import { Badge } from './Badge';
import { Button } from './Button';
import { cn } from '@/lib/utils';
import { LucideIcon, TrendingUp, TrendingDown, Minus, MoreHorizontal } from 'lucide-react';

export interface KPICardProps {
  title: string;
  value: string | number;
  unit?: string;
  change?: {
    value: number;
    period: string;
    direction: 'up' | 'down' | 'neutral';
  };
  status?: 'success' | 'warning' | 'error' | 'info' | 'neutral';
  icon?: LucideIcon;
  iconColor?: 'emerald' | 'blue' | 'amber' | 'red' | 'purple' | 'gray';
  variant?: 'default' | 'compact' | 'detailed';
  className?: string;
  onClick?: () => void;
  actions?: Array<{
    label: string;
    onClick: () => void;
  }>;
}

const iconColorClasses = {
  emerald: 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400',
  blue: 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400',
  amber: 'bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400',
  red: 'bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400',
  purple: 'bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400',
  gray: 'bg-gray-100 dark:bg-gray-900/30 text-gray-600 dark:text-gray-400',
};

const getTrendIcon = (direction: 'up' | 'down' | 'neutral') => {
  switch (direction) {
    case 'up':
      return TrendingUp;
    case 'down':
      return TrendingDown;
    default:
      return Minus;
  }
};

const getTrendColor = (direction: 'up' | 'down' | 'neutral') => {
  switch (direction) {
    case 'up':
      return 'text-emerald-600 dark:text-emerald-400';
    case 'down':
      return 'text-red-600 dark:text-red-400';
    default:
      return 'text-gray-500 dark:text-gray-400';
  }
};

export function KPICard({
  title,
  value,
  unit,
  change,
  status,
  icon: Icon,
  iconColor = 'blue',
  variant = 'default',
  className,
  onClick,
  actions,
}: KPICardProps) {
  const isClickable = !!onClick;
  const TrendIcon = change ? getTrendIcon(change.direction) : null;

  const formatValue = (val: string | number) => {
    if (typeof val === 'number') {
      return val.toLocaleString();
    }
    return val;
  };

  if (variant === 'compact') {
    return (
      <Card 
        className={cn(
          'transition-all duration-200 hover:shadow-md',
          isClickable && 'cursor-pointer hover:border-[var(--color-accent)]/30',
          className
        )}
        onClick={onClick}
      >
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {Icon && (
                <div className={cn('p-2 rounded-lg', iconColorClasses[iconColor])}>
                  <Icon className="h-4 w-4" />
                </div>
              )}
              <div>
                <p className="text-xs font-medium text-[var(--color-text-secondary)] uppercase tracking-wide">
                  {title}
                </p>
                <div className="flex items-baseline gap-1">
                  <span className="text-lg font-bold text-[var(--color-text)]">
                    {formatValue(value)}
                  </span>
                  {unit && (
                    <span className="text-xs text-[var(--color-text-secondary)]">
                      {unit}
                    </span>
                  )}
                </div>
              </div>
            </div>
            {change && TrendIcon && (
              <div className={cn('flex items-center gap-1', getTrendColor(change.direction))}>
                <TrendIcon className="h-3 w-3" />
                <span className="text-xs font-medium">
                  {Math.abs(change.value)}%
                </span>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card 
      className={cn(
        'transition-all duration-200 hover:shadow-md',
        isClickable && 'cursor-pointer hover:border-[var(--color-accent)]/30',
        className
      )}
      onClick={onClick}
    >
      <CardContent className="p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            {Icon && (
              <div className={cn('p-3 rounded-lg', iconColorClasses[iconColor])}>
                <Icon className="h-5 w-5" />
              </div>
            )}
            <div>
              <p className="text-sm font-medium text-[var(--color-text-secondary)] uppercase tracking-wide">
                {title}
              </p>
              {status && (
                <Badge status={status} variant="outline" className="mt-1">
                  {status}
                </Badge>
              )}
            </div>
          </div>
          {actions && actions.length > 0 && (
            <Button variant="ghost" size="sm">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          )}
        </div>

        {/* Value */}
        <div className="mb-4">
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-bold text-[var(--color-text)]">
              {formatValue(value)}
            </span>
            {unit && (
              <span className="text-sm text-[var(--color-text-secondary)]">
                {unit}
              </span>
            )}
          </div>
        </div>

        {/* Change Indicator */}
        {change && TrendIcon && (
          <div className="flex items-center gap-2 mb-4">
            <div className={cn('flex items-center gap-1 px-2 py-1 rounded-md', 
              change.direction === 'up' ? 'bg-emerald-100 dark:bg-emerald-900/30' :
              change.direction === 'down' ? 'bg-red-100 dark:bg-red-900/30' :
              'bg-gray-100 dark:bg-gray-900/30'
            )}>
              <TrendIcon className={cn('h-3 w-3', getTrendColor(change.direction))} />
              <span className={cn('text-xs font-medium', getTrendColor(change.direction))}>
                {change.direction === 'up' ? '+' : change.direction === 'down' ? '-' : ''}
                {Math.abs(change.value)}%
              </span>
            </div>
            <span className="text-xs text-[var(--color-text-secondary)]">
              vs {change.period}
            </span>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

export default KPICard;
