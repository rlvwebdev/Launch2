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
    trailers,
    loads,
    getFilteredDrivers,
    getFilteredTrucks,
    getFilteredTrailers,
    getFilteredLoads,
    ...dataContextRest
  } = useData();

  const orgFilter = getOrganizationalFilter();
  return {
    // Filtered data based on current organizational context
    drivers: shouldFilterByOrganization('drivers' as any) ? getFilteredDrivers(orgFilter) : drivers,
    trucks: shouldFilterByOrganization('trucks' as any) ? getFilteredTrucks(orgFilter) : trucks,
    trailers: shouldFilterByOrganization('trailers' as any) ? getFilteredTrailers(orgFilter) : trailers,
    loads: shouldFilterByOrganization('loads' as any) ? getFilteredLoads(orgFilter) : loads,
    
    // Raw data (unfiltered)
    allDrivers: drivers,
    allTrucks: trucks,
    allTrailers: trailers,
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
    getFilteredTrailers: (customFilter?: Partial<OrganizationalContext>) => 
      getFilteredTrailers(customFilter || orgFilter),
    getFilteredLoads: (customFilter?: Partial<OrganizationalContext>) => 
      getFilteredLoads(customFilter || orgFilter),
  };
};

export default useOrganizationalData;
