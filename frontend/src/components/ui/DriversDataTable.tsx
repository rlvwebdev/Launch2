'use client';

import React from 'react';
import { DataTable, ColumnDef, createStatusCell, createActionCell, createDateCell } from './DataTable';
import { Badge } from './Badge';
import { 
  Edit, 
  Eye, 
  UserCheck, 
  Truck, 
  Phone, 
  CreditCard,
  Calendar,
  AlertTriangle
} from 'lucide-react';
import { Driver, DriverStatus } from '@/types';

interface DriversDataTableProps {
  drivers: Driver[];
  loading?: boolean;
  onEdit?: (driver: Driver) => void;
  onView?: (driver: Driver) => void;
  onAssignTruck?: (driver: Driver) => void;
  selectable?: boolean;
  selectedDrivers?: Set<string>;
  onSelectionChange?: (selected: Set<string>) => void;
}

const STATUS_CONFIG = {
  [DriverStatus.ACTIVE]: {
    variant: 'success',
    label: 'Active'
  },
  [DriverStatus.INACTIVE]: {
    variant: 'neutral',
    label: 'Inactive'
  },
  [DriverStatus.ON_LEAVE]: {
    variant: 'warning',
    label: 'On Leave'
  },
  [DriverStatus.TERMINATED]: {
    variant: 'error',
    label: 'Terminated'
  },
  [DriverStatus.IN_TRAINING]: {
    variant: 'info',
    label: 'In Training'
  }
};

export function DriversDataTable({
  drivers,
  loading = false,
  onEdit,
  onView,
  onAssignTruck,
  selectable = false,
  selectedDrivers,
  onSelectionChange,
}: DriversDataTableProps) {

  // Check if driver has alerts
  const getDriverAlerts = (driver: Driver) => {
    const alerts = [];
    
    if (driver.licenseExpiry) {
      const expiryDate = new Date(driver.licenseExpiry);
      const thirtyDaysFromNow = new Date();
      thirtyDaysFromNow.setDate(thirtyDaysFromNow.getDate() + 30);
      
      if (expiryDate < thirtyDaysFromNow) {
        alerts.push('License Expiring');
      }
    }
    
    return alerts;
  };

  const columns: ColumnDef<Driver>[] = [
    {
      id: 'name',
      header: 'Driver',
      accessorFn: (driver) => `${driver.firstName} ${driver.lastName}`,
      sortable: true,
      cell: (driver) => (
        <div>
          <div className="font-medium text-neutral-900">
            {driver.firstName} {driver.lastName}
          </div>
          <div className="text-sm text-neutral-500">ID: {driver.id}</div>
        </div>
      ),
      minWidth: 150,
    },
    {
      id: 'phone',
      header: 'Phone',
      accessorKey: 'phoneNumber',
      cell: (driver) => (
        <div className="flex items-center gap-2">
          <Phone className="h-4 w-4 text-neutral-400" />
          <span className="text-sm">{driver.phoneNumber}</span>
        </div>
      ),
      width: 140,
    },    {
      id: 'email',
      header: 'Email',
      accessorKey: 'email',
      cell: (driver) => (
        <span className="text-sm">{driver.email}</span>
      ),
      width: 160,
    },
    {
      id: 'license',
      header: 'License',
      accessorKey: 'licenseNumber',
      cell: (driver) => {
        const alerts = getDriverAlerts(driver);
        return (
          <div className="flex flex-col gap-1">
            <span className="text-sm font-mono">{driver.licenseNumber}</span>
            {alerts.length > 0 && (
              <div className="flex items-center gap-1">
                <AlertTriangle className="h-3 w-3 text-warning-600" />
                <span className="text-xs text-warning-600">Expiring</span>
              </div>
            )}
          </div>
        );
      },
      width: 130,
    },
    {
      id: 'truck',
      header: 'Assigned Truck',
      accessorKey: 'assignedTruckId',
      cell: (driver) => (
        driver.assignedTruckId ? (
          <div className="flex items-center gap-2">
            <Truck className="h-4 w-4 text-neutral-400" />
            <span className="text-sm">{driver.assignedTruckId}</span>
          </div>
        ) : (
          <span className="text-sm text-neutral-400 italic">Unassigned</span>
        )
      ),
      width: 130,
    },
    {
      id: 'status',
      header: 'Status',
      accessorKey: 'status',
      sortable: true,
      cell: (driver) => createStatusCell(driver.status, STATUS_CONFIG),
      width: 100,
    },
    {
      id: 'hireDate',
      header: 'Hire Date',
      accessorKey: 'hireDate',
      sortable: true,
      cell: (driver) => driver.hireDate ? createDateCell(driver.hireDate) : '—',
      width: 110,
    },
    {
      id: 'licenseExpiry',
      header: 'License Expiry',
      accessorKey: 'licenseExpiry',
      sortable: true,
      cell: (driver) => {
        if (!driver.licenseExpiry) return '—';
        
        const expiryDate = new Date(driver.licenseExpiry);
        const isExpiring = expiryDate < new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);
        
        return (
          <span className={isExpiring ? 'text-warning-600 font-medium' : ''}>
            {createDateCell(driver.licenseExpiry)}
          </span>
        );
      },
      width: 120,
    },
  ];

  const rowActions = [
    {
      id: 'view',
      label: 'View Details',
      icon: <Eye className="h-4 w-4" />,
      onClick: (driver: Driver) => onView?.(driver),
    },
    {
      id: 'edit',
      label: 'Edit Driver',
      icon: <Edit className="h-4 w-4" />,
      onClick: (driver: Driver) => onEdit?.(driver),
    },
    {
      id: 'assign',
      label: 'Assign Truck',
      icon: <UserCheck className="h-4 w-4" />,
      onClick: (driver: Driver) => onAssignTruck?.(driver),
      show: (driver: Driver) => !driver.assignedTruckId && driver.status === DriverStatus.ACTIVE,
    },
  ].filter(action => action.onClick);

  const handleSelectionChange = (selectedRowIds: Set<string | number>) => {
    const selectedDriverIds = new Set(
      Array.from(selectedRowIds).map(id => String(id))
    );
    onSelectionChange?.(selectedDriverIds);
  };

  return (
    <DataTable
      data={drivers}
      columns={columns}
      loading={loading}
      selectable={selectable}
      selectedRows={selectedDrivers ? new Set(Array.from(selectedDrivers)) : undefined}
      onSelectionChange={handleSelectionChange}
      getRowId={(driver) => driver.id}
      rowActions={rowActions}
      emptyMessage="No drivers found"
      loadingMessage="Loading drivers..."
      pageSize={15}
      showPagination={true}
      stickyHeader={true}
      exportable={true}
      onExport={(format) => {
        console.log(`Exporting drivers data as ${format}`);
        // Implement export functionality
      }}
      variant="elevated"
      density="normal"
    />
  );
}

export default DriversDataTable;
