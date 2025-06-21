'use client';

import React, { useState, useMemo } from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { 
  ChevronUp, 
  ChevronDown, 
  Search, 
  Filter, 
  Download, 
  MoreHorizontal,
  Eye,
  Edit,
  Trash2,
  ArrowUpDown
} from 'lucide-react';
import { Button } from './Button';
import { Badge } from './Badge';
import clsx from 'clsx';

// DataTable variants using CVA
const dataTableVariants = cva(
  'w-full border-collapse bg-white rounded-lg shadow-sm overflow-hidden',
  {
    variants: {
      size: {
        sm: 'text-sm',
        md: 'text-base',
        lg: 'text-lg',
      },
      variant: {
        default: 'border border-neutral-200',
        elevated: 'shadow-md border-0',
        outlined: 'border-2 border-neutral-300',
        minimal: 'border-0 shadow-none',
      },
      density: {
        compact: '[&_td]:py-2 [&_th]:py-2',
        normal: '[&_td]:py-3 [&_th]:py-3',
        comfortable: '[&_td]:py-4 [&_th]:py-4',
      },
    },
    defaultVariants: {
      size: 'md',
      variant: 'default',
      density: 'normal',
    },
  }
);

// Column definition interface
export interface ColumnDef<T> {
  id: string;
  header: string;
  accessorKey?: keyof T;
  accessorFn?: (row: T) => any;
  cell?: (row: T) => React.ReactNode;
  sortable?: boolean;
  filterable?: boolean;
  width?: string | number;
  minWidth?: string | number;
  maxWidth?: string | number;
  align?: 'left' | 'center' | 'right';
  sticky?: 'left' | 'right';
}

// Sort direction type
export type SortDirection = 'asc' | 'desc' | null;

// DataTable props interface
export interface DataTableProps<T> extends VariantProps<typeof dataTableVariants> {
  data: T[];
  columns: ColumnDef<T>[];
  className?: string;
  
  // Pagination
  pageSize?: number;
  currentPage?: number;
  onPageChange?: (page: number) => void;
  showPagination?: boolean;
  
  // Sorting
  sortField?: string;
  sortDirection?: SortDirection;
  onSort?: (field: string, direction: SortDirection) => void;
  
  // Filtering
  globalFilter?: string;
  onGlobalFilterChange?: (filter: string) => void;
  columnFilters?: Record<string, string>;
  onColumnFilterChange?: (columnId: string, filter: string) => void;
  
  // Selection
  selectable?: boolean;
  selectedRows?: Set<string | number>;
  onSelectionChange?: (selectedRows: Set<string | number>) => void;
  getRowId?: (row: T, index: number) => string | number;
  
  // Actions
  rowActions?: Array<{
    id: string;
    label: string;
    icon?: React.ReactNode;
    onClick: (row: T) => void;
    variant?: 'primary' | 'secondary' | 'danger';
    show?: (row: T) => boolean;
  }>;
  
  // Loading and empty states
  loading?: boolean;
  emptyMessage?: string;
  loadingMessage?: string;
  
  // Advanced features
  expandable?: boolean;
  renderExpandedRow?: (row: T) => React.ReactNode;
  stickyHeader?: boolean;
  virtualScrolling?: boolean;
  
  // Export functionality
  exportable?: boolean;
  onExport?: (format: 'csv' | 'xlsx' | 'pdf') => void;
  
  // Mobile responsiveness
  mobileBreakpoint?: number;
  mobileView?: 'cards' | 'stacked' | 'horizontal-scroll';
}

export function DataTable<T>({
  data,
  columns,
  className,
  size,
  variant,
  density,
  pageSize = 10,
  currentPage = 1,
  onPageChange,
  showPagination = true,
  sortField,
  sortDirection,
  onSort,
  globalFilter = '',
  onGlobalFilterChange,
  columnFilters = {},
  onColumnFilterChange,
  selectable = false,
  selectedRows = new Set(),
  onSelectionChange,
  getRowId = (row: T, index: number) => index,
  rowActions = [],
  loading = false,
  emptyMessage = 'No data available',
  loadingMessage = 'Loading...',
  expandable = false,
  renderExpandedRow,
  stickyHeader = false,
  exportable = false,
  onExport,
  mobileView = 'horizontal-scroll',
  ...props
}: DataTableProps<T>) {
  const [expandedRows, setExpandedRows] = useState<Set<string | number>>(new Set());
  const [localSortField, setLocalSortField] = useState<string | null>(sortField || null);
  const [localSortDirection, setLocalSortDirection] = useState<SortDirection>(sortDirection || null);

  // Memoized filtered and sorted data
  const processedData = useMemo(() => {
    let filtered = [...data];

    // Apply global filter
    if (globalFilter) {
      filtered = filtered.filter(row =>
        columns.some(col => {
          const value = col.accessorFn 
            ? col.accessorFn(row)
            : col.accessorKey 
            ? row[col.accessorKey]
            : '';
          return String(value).toLowerCase().includes(globalFilter.toLowerCase());
        })
      );
    }

    // Apply column filters
    Object.entries(columnFilters).forEach(([columnId, filter]) => {
      if (filter) {
        const column = columns.find(col => col.id === columnId);
        if (column) {
          filtered = filtered.filter(row => {
            const value = column.accessorFn 
              ? column.accessorFn(row)
              : column.accessorKey 
              ? row[column.accessorKey]
              : '';
            return String(value).toLowerCase().includes(filter.toLowerCase());
          });
        }
      }
    });

    // Apply sorting
    const currentSortField = localSortField || sortField;
    const currentSortDirection = localSortDirection || sortDirection;
    
    if (currentSortField && currentSortDirection) {
      const column = columns.find(col => col.id === currentSortField);
      if (column) {
        filtered.sort((a, b) => {
          const aValue = column.accessorFn 
            ? column.accessorFn(a)
            : column.accessorKey 
            ? a[column.accessorKey]
            : '';
          const bValue = column.accessorFn 
            ? column.accessorFn(b)
            : column.accessorKey 
            ? b[column.accessorKey]
            : '';

          let comparison = 0;
          if (aValue < bValue) comparison = -1;
          if (aValue > bValue) comparison = 1;

          return currentSortDirection === 'desc' ? -comparison : comparison;
        });
      }
    }

    return filtered;
  }, [data, columns, globalFilter, columnFilters, localSortField, localSortDirection, sortField, sortDirection]);

  // Pagination
  const totalPages = Math.ceil(processedData.length / pageSize);
  const paginatedData = showPagination 
    ? processedData.slice((currentPage - 1) * pageSize, currentPage * pageSize)
    : processedData;

  // Handle sorting
  const handleSort = (columnId: string) => {
    const column = columns.find(col => col.id === columnId);
    if (!column?.sortable) return;

    let newDirection: SortDirection = 'asc';
    if (localSortField === columnId || sortField === columnId) {
      const currentDirection = localSortDirection || sortDirection;
      newDirection = currentDirection === 'asc' ? 'desc' : currentDirection === 'desc' ? null : 'asc';
    }

    setLocalSortField(newDirection ? columnId : null);
    setLocalSortDirection(newDirection);
    
    if (onSort) {
      onSort(columnId, newDirection);
    }
  };

  // Handle row selection
  const handleRowSelection = (rowId: string | number) => {
    if (!selectable || !onSelectionChange) return;

    const newSelection = new Set(selectedRows);
    if (newSelection.has(rowId)) {
      newSelection.delete(rowId);
    } else {
      newSelection.add(rowId);
    }
    onSelectionChange(newSelection);
  };

  // Handle select all
  const handleSelectAll = () => {
    if (!selectable || !onSelectionChange) return;

    const allRowIds = paginatedData.map((row, index) => getRowId(row, index));
    const allSelected = allRowIds.every(id => selectedRows.has(id));
    
    const newSelection = new Set(selectedRows);
    if (allSelected) {
      allRowIds.forEach(id => newSelection.delete(id));
    } else {
      allRowIds.forEach(id => newSelection.add(id));
    }
    onSelectionChange(newSelection);
  };

  // Handle row expansion
  const handleRowExpansion = (rowId: string | number) => {
    const newExpanded = new Set(expandedRows);
    if (newExpanded.has(rowId)) {
      newExpanded.delete(rowId);
    } else {
      newExpanded.add(rowId);
    }
    setExpandedRows(newExpanded);
  };

  // Get cell content
  const getCellContent = (row: T, column: ColumnDef<T>) => {
    if (column.cell) {
      return column.cell(row);
    }
    
    const value = column.accessorFn 
      ? column.accessorFn(row)
      : column.accessorKey 
      ? row[column.accessorKey]
      : '';
    
    return String(value);
  };

  // Render sort icon
  const renderSortIcon = (columnId: string) => {
    const currentSortField = localSortField || sortField;
    const currentSortDirection = localSortDirection || sortDirection;
    
    if (currentSortField !== columnId) {
      return <ArrowUpDown className="h-4 w-4 text-neutral-400" />;
    }
    
    return currentSortDirection === 'asc' 
      ? <ChevronUp className="h-4 w-4 text-primary-600" />
      : <ChevronDown className="h-4 w-4 text-primary-600" />;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-neutral-600">{loadingMessage}</div>
      </div>
    );
  }

  if (processedData.length === 0) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-neutral-600">{emptyMessage}</div>
      </div>
    );
  }

  return (
    <div className={clsx('space-y-4', className)}>
      {/* Table Controls */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        {/* Global Search */}
        {onGlobalFilterChange && (
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-neutral-400 h-4 w-4" />
            <input
              type="text"
              placeholder="Search..."
              value={globalFilter}
              onChange={(e) => onGlobalFilterChange(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
          </div>
        )}

        {/* Action buttons */}
        <div className="flex items-center gap-2">
          {exportable && onExport && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => onExport('csv')}
            >
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
          )}
        </div>
      </div>

      {/* Table Container */}
      <div className="overflow-x-auto">
        <table className={dataTableVariants({ size, variant, density })}>
          {/* Header */}
          <thead className={clsx(
            'bg-neutral-50',
            stickyHeader && 'sticky top-0 z-10'
          )}>
            <tr>
              {selectable && (
                <th className="w-12 px-4 py-3">                  <input
                    type="checkbox"
                    aria-label="Select all rows"
                    checked={paginatedData.length > 0 && paginatedData.every((row, index) => 
                      selectedRows.has(getRowId(row, index))
                    )}
                    onChange={handleSelectAll}
                    className="rounded border-neutral-300 text-primary-600 focus:ring-primary-500"
                  />
                </th>
              )}
              
              {expandable && <th className="w-12 px-4 py-3"></th>}
              
              {columns.map((column) => (
                <th
                  key={column.id}
                  className={clsx(
                    'px-4 py-3 text-left font-medium text-neutral-700 border-b border-neutral-200',
                    column.sortable && 'cursor-pointer hover:bg-neutral-100',
                    column.align === 'center' && 'text-center',
                    column.align === 'right' && 'text-right',
                    column.sticky === 'left' && 'sticky left-0 bg-neutral-50',
                    column.sticky === 'right' && 'sticky right-0 bg-neutral-50'
                  )}                  style={{
                    width: column.width ? `${column.width}${typeof column.width === 'number' ? 'px' : ''}` : undefined,
                    minWidth: column.minWidth ? `${column.minWidth}${typeof column.minWidth === 'number' ? 'px' : ''}` : undefined,
                    maxWidth: column.maxWidth ? `${column.maxWidth}${typeof column.maxWidth === 'number' ? 'px' : ''}` : undefined,
                  }}
                  onClick={() => column.sortable && handleSort(column.id)}
                >
                  <div className="flex items-center gap-2">
                    <span>{column.header}</span>
                    {column.sortable && renderSortIcon(column.id)}
                  </div>
                </th>
              ))}
              
              {rowActions.length > 0 && (
                <th className="w-24 px-4 py-3 text-right font-medium text-neutral-700 border-b border-neutral-200">
                  Actions
                </th>
              )}
            </tr>
          </thead>

          {/* Body */}
          <tbody>
            {paginatedData.map((row, rowIndex) => {
              const rowId = getRowId(row, rowIndex);
              const isSelected = selectedRows.has(rowId);
              const isExpanded = expandedRows.has(rowId);
              
              return (
                <React.Fragment key={rowId}>
                  <tr 
                    className={clsx(
                      'border-b border-neutral-100 hover:bg-neutral-50 transition-colors',
                      isSelected && 'bg-primary-50'
                    )}
                  >
                    {selectable && (
                      <td className="px-4 py-3">                        <input
                          type="checkbox"
                          aria-label={`Select row ${rowIndex + 1}`}
                          checked={isSelected}
                          onChange={() => handleRowSelection(rowId)}
                          className="rounded border-neutral-300 text-primary-600 focus:ring-primary-500"
                        />
                      </td>
                    )}
                    
                    {expandable && (
                      <td className="px-4 py-3">
                        <button
                          onClick={() => handleRowExpansion(rowId)}
                          className="p-1 hover:bg-neutral-200 rounded"
                        >
                          {isExpanded ? (
                            <ChevronDown className="h-4 w-4" />
                          ) : (
                            <ChevronUp className="h-4 w-4" />
                          )}
                        </button>
                      </td>
                    )}
                    
                    {columns.map((column) => (
                      <td
                        key={column.id}
                        className={clsx(
                          'px-4 py-3 text-neutral-900',
                          column.align === 'center' && 'text-center',
                          column.align === 'right' && 'text-right',
                          column.sticky === 'left' && 'sticky left-0 bg-white',
                          column.sticky === 'right' && 'sticky right-0 bg-white'
                        )}
                      >
                        {getCellContent(row, column)}
                      </td>
                    ))}
                    
                    {rowActions.length > 0 && (
                      <td className="px-4 py-3 text-right">
                        <div className="flex items-center justify-end gap-1">
                          {rowActions
                            .filter(action => !action.show || action.show(row))
                            .map((action) => (
                              <Button
                                key={action.id}
                                size="sm"
                                variant={action.variant === 'danger' ? 'outline' : 'ghost'}
                                onClick={() => action.onClick(row)}
                                className={action.variant === 'danger' ? 'text-error-600 hover:text-error-700' : ''}
                              >
                                {action.icon}
                                <span className="sr-only">{action.label}</span>
                              </Button>
                            ))}
                        </div>
                      </td>
                    )}
                  </tr>
                  
                  {/* Expanded row content */}
                  {expandable && isExpanded && renderExpandedRow && (
                    <tr>
                      <td 
                        colSpan={
                          columns.length + 
                          (selectable ? 1 : 0) + 
                          (expandable ? 1 : 0) + 
                          (rowActions.length > 0 ? 1 : 0)
                        }
                        className="px-4 py-3 bg-neutral-25"
                      >
                        {renderExpandedRow(row)}
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {showPagination && totalPages > 1 && (
        <div className="flex items-center justify-between">
          <div className="text-sm text-neutral-600">
            Showing {((currentPage - 1) * pageSize) + 1} to {Math.min(currentPage * pageSize, processedData.length)} of {processedData.length} results
          </div>
          
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => onPageChange?.(currentPage - 1)}
              disabled={currentPage === 1}
            >
              Previous
            </Button>
            
            {/* Page numbers */}
            <div className="flex gap-1">
              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                const pageNumber = i + 1;
                return (
                  <Button
                    key={pageNumber}
                    variant={currentPage === pageNumber ? 'primary' : 'ghost'}
                    size="sm"
                    onClick={() => onPageChange?.(pageNumber)}
                  >
                    {pageNumber}
                  </Button>
                );
              })}
            </div>
            
            <Button
              variant="outline"
              size="sm"
              onClick={() => onPageChange?.(currentPage + 1)}
              disabled={currentPage === totalPages}
            >
              Next
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}

// Export helper functions
export const createStatusCell = (status: string, statusConfig: Record<string, { variant: string; label?: string }>) => {
  const config = statusConfig[status] || { variant: 'neutral', label: status };
  return (
    <Badge 
      variant={config.variant as any} 
      status={status as any}
    >
      {config.label || status}
    </Badge>
  );
};

export const createActionCell = (actions: Array<{
  icon: React.ReactNode;
  label: string;
  onClick: () => void;
  variant?: string;
}>) => (
  <div className="flex items-center gap-1">
    {actions.map((action, index) => (
      <Button
        key={index}
        size="sm"
        variant="ghost"
        onClick={action.onClick}
        title={action.label}
      >
        {action.icon}
      </Button>
    ))}
  </div>
);

export const createDateCell = (date: Date | string) => {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  return dateObj.toLocaleDateString();
};

export const createNumberCell = (value: number, options?: Intl.NumberFormatOptions) => {
  return value.toLocaleString(undefined, options);
};
