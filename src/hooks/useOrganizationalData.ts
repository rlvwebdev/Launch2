'use client';

import { useOrganizational } from '@/context/OrganizationalContext';
import { useData } from '@/context/DataContext';
import { Driver, Truck, Load, OrganizationalContext } from '@/types';

/**
 * Hook that provides filtered data based on current organizational context
 * This simplifies data access in components by automatically applying organizational filters
 */
export const useOrganizationalData = () => {
  const { 
    getOrganizationalFilter,
    shouldFilterByOrganization,
    getDataScope,
    currentOrganization 
  } = useOrganizational();
  
  const {
    drivers,
    trucks,
    loads,
    getFilteredDrivers,
    getFilteredTrucks,
    getFilteredLoads,
    ...dataContextRest
  } = useData();

  const orgFilter = getOrganizationalFilter();

  return {
    // Filtered data based on current organizational context
    drivers: shouldFilterByOrganization('drivers' as any) ? getFilteredDrivers(orgFilter) : drivers,
    trucks: shouldFilterByOrganization('trucks' as any) ? getFilteredTrucks(orgFilter) : trucks,
    loads: shouldFilterByOrganization('loads' as any) ? getFilteredLoads(orgFilter) : loads,
    
    // Raw data (unfiltered)
    allDrivers: drivers,
    allTrucks: trucks,
    allLoads: loads,
    
    // Organizational context info
    currentOrganization,
    organizationalFilter: orgFilter,
    dataScope: getDataScope(),
    
    // Pass through other data context functions
    ...dataContextRest,
    
    // Enhanced filtering functions
    getFilteredDrivers: (customFilter?: Partial<OrganizationalContext>) => 
      getFilteredDrivers(customFilter || orgFilter),
    getFilteredTrucks: (customFilter?: Partial<OrganizationalContext>) => 
      getFilteredTrucks(customFilter || orgFilter),
    getFilteredLoads: (customFilter?: Partial<OrganizationalContext>) => 
      getFilteredLoads(customFilter || orgFilter),
  };
};

export default useOrganizationalData;
