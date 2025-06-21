'use client';

import React from 'react';
import { DataTable, ColumnDef, createStatusCell, createActionCell, createDateCell } from './DataTable';
import { Badge } from './Badge';
import { Button } from './Button';
import { 
  Edit, 
  Eye, 
  Wrench, 
  UserCheck, 
  Trash2, 
  AlertTriangle,
  User
} from 'lucide-react';
import { Truck, TruckStatus } from '@/types';

interface TrucksDataTableProps {
  trucks: Truck[];
  loading?: boolean;
  onEdit?: (truck: Truck) => void;
  onView?: (truck: Truck) => void;
  onAssignDriver?: (truck: Truck) => void;
  onScheduleMaintenance?: (truck: Truck) => void;
  onDelete?: (truck: Truck) => void;
  selectable?: boolean;
  selectedTrucks?: Set<string>;
  onSelectionChange?: (selected: Set<string>) => void;
}

const STATUS_CONFIG = {
  [TruckStatus.AVAILABLE]: {
    variant: 'success',
    label: 'Available'
  },
  [TruckStatus.ASSIGNED]: {
    variant: 'active',
    label: 'Assigned'
  },
  [TruckStatus.MAINTENANCE]: {
    variant: 'warning',
    label: 'Maintenance'
  },
  [TruckStatus.OUT_OF_SERVICE]: {
    variant: 'error',
    label: 'Out of Service'
  }
};

export function TrucksDataTable({
  trucks,
  loading = false,
  onEdit,
  onView,
  onAssignDriver,
  onScheduleMaintenance,
  onDelete,
  selectable = false,
  selectedTrucks,
  onSelectionChange,
}: TrucksDataTableProps) {

  // Check if truck needs maintenance or has alerts
  const getTruckAlerts = (truck: Truck) => {
    const alerts = [];
    
    if (new Date(truck.nextMaintenanceDue) < new Date()) {
      alerts.push('Maintenance Overdue');
    }
    
    if (new Date(truck.registrationExpiry) < new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)) {
      alerts.push('Registration Expiring');
    }
    
    return alerts;
  };

  const columns: ColumnDef<Truck>[] = [
    {
      id: 'truck',
      header: 'Truck',
      accessorKey: 'id',
      sortable: true,
      cell: (truck) => (
        <div>
          <div className="font-medium text-neutral-900">{truck.id}</div>
          <div className="text-sm text-neutral-500">
            {truck.make} {truck.model} • {truck.year}
          </div>
        </div>
      ),
      minWidth: 150,
    },
    {
      id: 'license',
      header: 'License Plate',
      accessorKey: 'licensePlate',
      sortable: true,
      width: 120,
    },
    {
      id: 'status',
      header: 'Status',
      accessorKey: 'status',
      sortable: true,
      cell: (truck) => {
        const alerts = getTruckAlerts(truck);
        return (
          <div className="flex flex-col gap-1">
            {createStatusCell(truck.status, STATUS_CONFIG)}
            {alerts.length > 0 && (
              <div className="flex items-center gap-1">
                <AlertTriangle className="h-3 w-3 text-warning-600" />
                <span className="text-xs text-warning-600">
                  {alerts.length} alert{alerts.length > 1 ? 's' : ''}
                </span>
              </div>
            )}
          </div>
        );
      },
      width: 140,
    },
    {
      id: 'driver',
      header: 'Assigned Driver',
      accessorFn: (truck) => truck.assignedDriverId,
      cell: (truck) => (
        truck.assignedDriverId ? (
          <div className="flex items-center gap-2">
            <User className="h-4 w-4 text-neutral-400" />
            <span className="text-sm">{truck.assignedDriverId}</span>
          </div>
        ) : (
          <span className="text-sm text-neutral-400 italic">Unassigned</span>
        )
      ),
      width: 140,
    },
    {
      id: 'mileage',
      header: 'Mileage',
      accessorKey: 'mileage',
      sortable: true,
      cell: (truck) => (
        <span className="text-sm">{truck.mileage.toLocaleString()} mi</span>
      ),
      align: 'right',
      width: 100,
    },
    {
      id: 'lastMaintenance',
      header: 'Last Maintenance',
      accessorKey: 'lastMaintenance',
      sortable: true,
      cell: (truck) => createDateCell(truck.lastMaintenance),
      width: 120,
    },
    {
      id: 'nextMaintenance',
      header: 'Next Maintenance',
      accessorKey: 'nextMaintenanceDue',
      sortable: true,
      cell: (truck) => {
        const isOverdue = new Date(truck.nextMaintenanceDue) < new Date();
        return (
          <span className={isOverdue ? 'text-error-600 font-medium' : ''}>
            {createDateCell(truck.nextMaintenanceDue)}
          </span>
        );
      },
      width: 130,
    },
  ];

  const rowActions = [
    {
      id: 'view',
      label: 'View Details',
      icon: <Eye className="h-4 w-4" />,
      onClick: (truck: Truck) => onView?.(truck),
    },
    {
      id: 'edit',
      label: 'Edit Truck',
      icon: <Edit className="h-4 w-4" />,
      onClick: (truck: Truck) => onEdit?.(truck),
    },
    {
      id: 'assign',
      label: 'Assign Driver',
      icon: <UserCheck className="h-4 w-4" />,
      onClick: (truck: Truck) => onAssignDriver?.(truck),
      show: (truck: Truck) => !truck.assignedDriverId && truck.status === TruckStatus.AVAILABLE,
    },
    {
      id: 'maintenance',
      label: 'Schedule Maintenance',
      icon: <Wrench className="h-4 w-4" />,
      onClick: (truck: Truck) => onScheduleMaintenance?.(truck),
      show: (truck: Truck) => truck.status !== TruckStatus.MAINTENANCE,
    },
    {
      id: 'delete',
      label: 'Delete Truck',
      icon: <Trash2 className="h-4 w-4" />,
      onClick: (truck: Truck) => onDelete?.(truck),
      variant: 'danger' as const,
    },
  ].filter(action => action.onClick);

  const handleSelectionChange = (selectedRowIds: Set<string | number>) => {
    const selectedTruckIds = new Set(
      Array.from(selectedRowIds).map(id => String(id))
    );
    onSelectionChange?.(selectedTruckIds);
  };

  return (
    <DataTable
      data={trucks}
      columns={columns}
      loading={loading}
      selectable={selectable}
      selectedRows={selectedTrucks ? new Set(Array.from(selectedTrucks)) : undefined}
      onSelectionChange={handleSelectionChange}
      getRowId={(truck) => truck.id}
      rowActions={rowActions}
      emptyMessage="No trucks found"
      loadingMessage="Loading trucks..."
      pageSize={15}
      showPagination={true}
      stickyHeader={true}
      exportable={true}
      onExport={(format) => {
        console.log(`Exporting trucks data as ${format}`);
        // Implement export functionality
      }}
      variant="elevated"
      density="normal"
    />
  );
}

export default TrucksDataTable;
