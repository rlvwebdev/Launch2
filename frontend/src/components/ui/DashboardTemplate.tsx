'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardHeader } from './Card';
import { Button } from './Button';
import { Badge } from './Badge';
import { KPICard, KPICardProps } from './KPICardSimple';
import { cn } from '@/lib/utils';
import { 
  LayoutDashboard, 
  Settings, 
  Maximize2, 
  Minimize2, 
  Grid3X3, 
  List,
  Filter,
  Download,
  RefreshCw,
  MoreHorizontal,
  AlertTriangle,
  Clock,
  CheckCircle,
  TrendingUp
} from 'lucide-react';

export interface QuickActionConfig {
  id: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  onClick: () => void;
  variant?: 'primary' | 'secondary' | 'outline';
  disabled?: boolean;
}

export interface AlertConfig {
  id: string;
  title: string;
  message: string;
  severity: 'high' | 'medium' | 'low';
  timestamp: Date;
  type: 'operational' | 'system' | 'compliance';
  action?: {
    label: string;
    onClick: () => void;
  };
}

export interface ActivityConfig {
  id: string;
  title: string;
  description: string;
  timestamp: Date;
  type: 'load' | 'driver' | 'truck' | 'system';
  status?: 'completed' | 'in-progress' | 'pending' | 'failed';
}

export interface DashboardTemplateProps {
  title?: string;
  subtitle?: string;
  kpiCards?: KPICardProps[];
  quickActions?: QuickActionConfig[];
  alerts?: AlertConfig[];
  recentActivity?: ActivityConfig[];
  children?: React.ReactNode;
  viewMode?: 'grid' | 'list';
  onViewModeChange?: (mode: 'grid' | 'list') => void;
  isFullscreen?: boolean;
  onFullscreenToggle?: () => void;
  refreshable?: boolean;
  onRefresh?: () => void;
  className?: string;
}

const getSeverityColor = (severity: 'high' | 'medium' | 'low') => {
  switch (severity) {
    case 'high':
      return 'text-red-600 dark:text-red-400 bg-red-100 dark:bg-red-900/30';
    case 'medium':
      return 'text-amber-600 dark:text-amber-400 bg-amber-100 dark:bg-amber-900/30';
    case 'low':
      return 'text-blue-600 dark:text-blue-400 bg-blue-100 dark:bg-blue-900/30';
    default:
      return 'text-gray-600 dark:text-gray-400 bg-gray-100 dark:bg-gray-900/30';
  }
};

const getActivityIcon = (type: string) => {
  switch (type) {
    case 'load':
      return CheckCircle;
    case 'driver':
      return TrendingUp;
    case 'truck':
      return AlertTriangle;
    default:
      return Clock;
  }
};

const getActivityStatusColor = (status?: string) => {
  switch (status) {
    case 'completed':
      return 'text-emerald-600 dark:text-emerald-400';
    case 'in-progress':
      return 'text-blue-600 dark:text-blue-400';
    case 'pending':
      return 'text-amber-600 dark:text-amber-400';
    case 'failed':
      return 'text-red-600 dark:text-red-400';
    default:
      return 'text-gray-600 dark:text-gray-400';
  }
};

export function DashboardTemplate({
  title = 'Dashboard',
  subtitle,
  kpiCards = [],
  quickActions = [],
  alerts = [],
  recentActivity = [],
  children,
  viewMode = 'grid',
  onViewModeChange,
  isFullscreen = false,
  onFullscreenToggle,
  refreshable = true,
  onRefresh,
  className,
}: DashboardTemplateProps) {
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleRefresh = async () => {
    if (!onRefresh) return;
    setIsRefreshing(true);
    await onRefresh();
    setIsRefreshing(false);
  };

  return (
    <div className={cn('space-y-6', className)}>
      {/* Dashboard Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[var(--color-text)] flex items-center gap-2">
            <LayoutDashboard className="w-6 h-6 text-[var(--color-accent)]" />
            {title}
          </h1>
          {subtitle && (
            <p className="text-sm text-[var(--color-text-secondary)] mt-1">
              {subtitle}
            </p>
          )}
        </div>
        
        <div className="flex items-center gap-2">
          {/* View Mode Toggle */}
          {onViewModeChange && (
            <div className="flex rounded-lg border border-[var(--color-neutral)]/30 p-1">              <Button
                variant={viewMode === 'grid' ? 'primary' : 'ghost'}
                size="sm"
                onClick={() => onViewModeChange('grid')}
              >
                <Grid3X3 className="w-4 h-4" />
              </Button>
              <Button
                variant={viewMode === 'list' ? 'primary' : 'ghost'}
                size="sm"
                onClick={() => onViewModeChange('list')}
              >
                <List className="w-4 h-4" />
              </Button>
            </div>
          )}
          
          {/* Refresh Button */}
          {refreshable && (
            <Button
              variant="outline"
              size="sm"
              onClick={handleRefresh}
              disabled={isRefreshing}
            >
              <RefreshCw className={cn('w-4 h-4', isRefreshing && 'animate-spin')} />
              Refresh
            </Button>
          )}
          
          {/* Fullscreen Toggle */}
          {onFullscreenToggle && (
            <Button variant="outline" size="sm" onClick={onFullscreenToggle}>
              {isFullscreen ? (
                <Minimize2 className="w-4 h-4" />
              ) : (
                <Maximize2 className="w-4 h-4" />
              )}
            </Button>
          )}
          
          <Button variant="outline" size="sm">
            <Settings className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* KPI Cards */}
      {kpiCards.length > 0 && (
        <div className={cn(
          'grid gap-4',
          viewMode === 'grid' 
            ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4' 
            : 'grid-cols-1'
        )}>
          {kpiCards.map((kpi, index) => (
            <KPICard
              key={index}
              {...kpi}
              variant={viewMode === 'list' ? 'compact' : kpi.variant}
            />
          ))}
        </div>
      )}

      {/* Quick Actions */}
      {quickActions.length > 0 && (
        <Card>
          <CardHeader>
            <h2 className="text-lg font-semibold text-[var(--color-accent)]">
              Quick Actions
            </h2>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-3">
              {quickActions.map((action) => {
                const Icon = action.icon;
                return (
                  <Button
                    key={action.id}
                    variant={action.variant || 'outline'}
                    onClick={action.onClick}
                    disabled={action.disabled}
                    className="flex items-center gap-2"
                  >
                    <Icon className="w-4 h-4" />
                    {action.label}
                  </Button>
                );
              })}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Alerts and Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Alerts */}
        {alerts.length > 0 && (
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <h2 className="text-lg font-semibold text-[var(--color-accent)]">
                Recent Alerts
              </h2>
              <Badge variant="outline" status="warning">
                {alerts.length}
              </Badge>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {alerts.slice(0, 5).map((alert) => (
                  <div
                    key={alert.id}
                    className="flex items-start gap-3 p-3 rounded-lg border border-[var(--color-neutral)]/20 hover:border-[var(--color-accent)]/30 transition-colors"
                  >
                    <div className={cn('p-1 rounded-full', getSeverityColor(alert.severity))}>
                      <AlertTriangle className="w-3 h-3" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-[var(--color-text)] truncate">
                        {alert.title}
                      </p>
                      <p className="text-xs text-[var(--color-text-secondary)] mt-1">
                        {alert.message}
                      </p>
                      <p className="text-xs text-[var(--color-text-secondary)] mt-1">
                        {alert.timestamp.toLocaleTimeString()}
                      </p>
                    </div>
                    {alert.action && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={alert.action.onClick}
                        className="text-xs"
                      >
                        {alert.action.label}
                      </Button>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Recent Activity */}
        {recentActivity.length > 0 && (
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <h2 className="text-lg font-semibold text-[var(--color-accent)]">
                Recent Activity
              </h2>
              <Button variant="ghost" size="sm">
                <MoreHorizontal className="w-4 h-4" />
              </Button>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {recentActivity.slice(0, 5).map((activity) => {
                  const Icon = getActivityIcon(activity.type);
                  return (
                    <div
                      key={activity.id}
                      className="flex items-start gap-3 p-3 rounded-lg border border-[var(--color-neutral)]/20 hover:border-[var(--color-accent)]/30 transition-colors"
                    >
                      <div className="p-1">
                        <Icon className={cn('w-4 h-4', getActivityStatusColor(activity.status))} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-[var(--color-text)] truncate">
                          {activity.title}
                        </p>
                        <p className="text-xs text-[var(--color-text-secondary)] mt-1">
                          {activity.description}
                        </p>
                        <p className="text-xs text-[var(--color-text-secondary)] mt-1">
                          {activity.timestamp.toLocaleTimeString()}
                        </p>
                      </div>
                      {activity.status && (
                        <Badge variant="outline" status={activity.status === 'completed' ? 'success' : 'info'}>
                          {activity.status}
                        </Badge>
                      )}
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Custom Content */}
      {children}
    </div>
  );
}

export default DashboardTemplate;
