/**
 * Global Search Context - Provides unified search across all data types
 */
'use client';

import React, { createContext, useContext, useState, useCallback } from 'react';
import { useData } from './DataContext';
import { Driver, Truck, Trailer, Load } from '@/types';

export interface SearchResult {
  id: string;
  type: 'driver' | 'truck' | 'trailer' | 'load';
  title: string;
  subtitle: string;
  description?: string;
  url: string;
  data: Driver | Truck | Trailer | Load;
  relevanceScore: number;
}

interface SearchContextType {
  searchQuery: string;
  searchResults: SearchResult[];
  isSearching: boolean;
  performSearch: (query: string) => void;
  clearSearch: () => void;
  navigateToResult: (result: SearchResult) => void;
}

const SearchContext = createContext<SearchContextType | undefined>(undefined);

export function SearchProvider({ children }: { children: React.ReactNode }) {
  const { drivers, trucks, trailers, loads } = useData();
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const searchDrivers = useCallback((query: string): SearchResult[] => {
    const lowerQuery = query.toLowerCase();
    return drivers
      .filter(driver => {
        return (
          driver.id.toLowerCase().includes(lowerQuery) ||
          driver.firstName.toLowerCase().includes(lowerQuery) ||
          driver.lastName.toLowerCase().includes(lowerQuery) ||
          `${driver.firstName} ${driver.lastName}`.toLowerCase().includes(lowerQuery) ||
          driver.email?.toLowerCase().includes(lowerQuery) ||
          driver.phoneNumber?.toLowerCase().includes(lowerQuery) ||
          driver.licenseNumber?.toLowerCase().includes(lowerQuery)
        );
      })
      .map(driver => ({
        id: driver.id,
        type: 'driver' as const,
        title: `${driver.firstName} ${driver.lastName}`,
        subtitle: `Driver ID: ${driver.id}`,
        description: `${driver.status} • ${driver.email} • ${driver.phoneNumber}`,
        url: `/drivers/${driver.id}`,
        data: driver,
        relevanceScore: calculateRelevanceScore(query, [
          driver.id,
          driver.firstName,
          driver.lastName,
          `${driver.firstName} ${driver.lastName}`,
          driver.email,
          driver.phoneNumber,
          driver.licenseNumber
        ])
      }));
  }, [drivers]);
  const searchTrucks = useCallback((query: string): SearchResult[] => {
    const lowerQuery = query.toLowerCase();
    return trucks
      .filter(truck => {
        return (
          truck.id.toLowerCase().includes(lowerQuery) ||
          truck.make.toLowerCase().includes(lowerQuery) ||
          truck.model.toLowerCase().includes(lowerQuery) ||
          truck.licensePlate.toLowerCase().includes(lowerQuery) ||
          truck.vin.toLowerCase().includes(lowerQuery) ||
          truck.assignedDriverId?.toLowerCase().includes(lowerQuery)
        );
      })
      .map(truck => ({
        id: truck.id,
        type: 'truck' as const,
        title: `${truck.make} ${truck.model}`,
        subtitle: `Truck ID: ${truck.id}`,
        description: `${truck.status} • License: ${truck.licensePlate} • ${truck.assignedDriverId ? `Driver ID: ${truck.assignedDriverId}` : 'Unassigned'}`,
        url: `/trucks/${truck.id}`,
        data: truck,
        relevanceScore: calculateRelevanceScore(query, [
          truck.id,
          truck.make,
          truck.model,
          truck.licensePlate,
          truck.vin,
          truck.assignedDriverId
        ])
      }));
  }, [trucks]);

  const searchTrailers = useCallback((query: string): SearchResult[] => {
    const lowerQuery = query.toLowerCase();
    return trailers
      .filter(trailer => {
        return (
          trailer.id.toLowerCase().includes(lowerQuery) ||
          trailer.type.toLowerCase().includes(lowerQuery) ||
          trailer.licensePlate?.toLowerCase().includes(lowerQuery) ||
          trailer.vin?.toLowerCase().includes(lowerQuery)
        );
      })
      .map(trailer => ({
        id: trailer.id,
        type: 'trailer' as const,
        title: `${trailer.type} Trailer`,
        subtitle: `Trailer ID: ${trailer.id}`,
        description: `${trailer.status} • ${trailer.licensePlate ? `License: ${trailer.licensePlate}` : 'No License'}`,
        url: `/trailers/${trailer.id}`,
        data: trailer,
        relevanceScore: calculateRelevanceScore(query, [
          trailer.id,
          trailer.type,
          trailer.licensePlate,
          trailer.vin
        ])
      }));
  }, [trailers]);
  const searchLoads = useCallback((query: string): SearchResult[] => {
    const lowerQuery = query.toLowerCase();
    return loads
      .filter(load => {
        return (
          load.id.toLowerCase().includes(lowerQuery) ||
          load.loadNumber?.toLowerCase().includes(lowerQuery) ||
          load.bolNumber?.toLowerCase().includes(lowerQuery) ||
          load.shipper?.toLowerCase().includes(lowerQuery) ||
          load.receiver?.toLowerCase().includes(lowerQuery) ||
          load.origin?.toLowerCase().includes(lowerQuery) ||
          load.destination?.toLowerCase().includes(lowerQuery) ||
          load.pickupLocation?.city?.toLowerCase().includes(lowerQuery) ||
          load.deliveryLocation?.city?.toLowerCase().includes(lowerQuery) ||
          load.assignedDriverId?.toLowerCase().includes(lowerQuery) ||
          load.assignedTruckId?.toLowerCase().includes(lowerQuery)
        );
      })
      .map(load => ({
        id: load.id,
        type: 'load' as const,
        title: `Load ${load.loadNumber || load.id}`,
        subtitle: `${load.pickupLocation?.city || load.origin || 'Unknown'} → ${load.deliveryLocation?.city || load.destination || 'Unknown'}`,
        description: `${load.status} • ${load.shipper || 'No Shipper'} • BOL: ${load.bolNumber || 'N/A'}`,
        url: `/loads/${load.id}`,
        data: load,
        relevanceScore: calculateRelevanceScore(query, [
          load.id,
          load.loadNumber,
          load.bolNumber,
          load.shipper,
          load.receiver,
          load.origin,
          load.destination,
          load.pickupLocation?.city,
          load.deliveryLocation?.city,
          load.assignedDriverId,
          load.assignedTruckId
        ])
      }));
  }, [loads]);

  const calculateRelevanceScore = (query: string, fields: (string | undefined | null)[]): number => {
    const lowerQuery = query.toLowerCase();
    let score = 0;
    
    fields.forEach(field => {
      if (!field) return;
      
      const lowerField = field.toLowerCase();
      
      // Exact match gets highest score
      if (lowerField === lowerQuery) {
        score += 100;
      }
      // Starts with query gets high score
      else if (lowerField.startsWith(lowerQuery)) {
        score += 50;
      }
      // Contains query gets medium score
      else if (lowerField.includes(lowerQuery)) {
        score += 25;
      }
    });
    
    return score;
  };

  const performSearch = useCallback((query: string) => {
    setSearchQuery(query);
    setIsSearching(true);

    if (!query.trim()) {
      setSearchResults([]);
      setIsSearching(false);
      return;
    }

    try {
      // Perform search across all data types
      const driverResults = searchDrivers(query);
      const truckResults = searchTrucks(query);
      const trailerResults = searchTrailers(query);
      const loadResults = searchLoads(query);

      // Combine and sort by relevance score
      const allResults = [
        ...driverResults,
        ...truckResults,
        ...trailerResults,
        ...loadResults
      ].sort((a, b) => b.relevanceScore - a.relevanceScore);

      // Limit results to top 20 for performance
      setSearchResults(allResults.slice(0, 20));
    } catch (error) {
      console.error('Search error:', error);
      setSearchResults([]);
    } finally {
      setIsSearching(false);
    }
  }, [searchDrivers, searchTrucks, searchTrailers, searchLoads]);

  const clearSearch = useCallback(() => {
    setSearchQuery('');
    setSearchResults([]);
    setIsSearching(false);
  }, []);

  const navigateToResult = useCallback((result: SearchResult) => {
    // This will be handled by the component using the search context
    // The component can use Next.js router to navigate
    window.location.href = result.url;
  }, []);

  const value: SearchContextType = {
    searchQuery,
    searchResults,
    isSearching,
    performSearch,
    clearSearch,
    navigateToResult
  };

  return (
    <SearchContext.Provider value={value}>
      {children}
    </SearchContext.Provider>
  );
}

export function useSearch() {
  const context = useContext(SearchContext);
  if (context === undefined) {
    throw new Error('useSearch must be used within a SearchProvider');
  }
  return context;
}
