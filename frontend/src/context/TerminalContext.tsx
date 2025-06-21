'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export interface Terminal {
  id: string;
  name: string;
  code: string;
  department: {
    id: string;
    name: string;
    code: string;
    division: {
      id: string;
      name: string;
      code: string;
      company: {
        id: string;
        name: string;
        code: string;
      };
    };
  };
  address: {
    city: string;
    state: string;
  };
  isActive: boolean;
}

interface TerminalContextType {
  // Selected terminal
  selectedTerminal: Terminal | null;
  setSelectedTerminal: (terminal: Terminal | null) => void;
  
  // Available terminals for the user
  availableTerminals: Terminal[];
  loading: boolean;
  error: string | null;
  
  // Actions
  refreshTerminals: () => void;
  
  // Helper methods
  getTerminalDisplayName: (terminal: Terminal) => string;
  getTerminalHierarchy: (terminal: Terminal) => string;
}

const TerminalContext = createContext<TerminalContextType | undefined>(undefined);

interface TerminalProviderProps {
  children: ReactNode;
}

export function TerminalProvider({ children }: TerminalProviderProps) {
  const [selectedTerminal, setSelectedTerminal] = useState<Terminal | null>(null);
  const [availableTerminals, setAvailableTerminals] = useState<Terminal[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const fetchUserTerminals = async () => {
    try {
      setLoading(true);
      setError(null);

      const token = localStorage.getItem('auth_token') || sessionStorage.getItem('auth_token');
      console.log('🔑 [TerminalContext] Token found:', !!token);
      
      if (!token) {
        console.error('❌ [TerminalContext] No authentication token found');
        setError('No authentication token found');
        return;
      }

      console.log('👤 [TerminalContext] Fetching user info...');
      const response = await fetch('http://localhost:8000/api/users/me/', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      console.log('👤 [TerminalContext] User response status:', response.status);
      if (!response.ok) {
        const errorText = await response.text();
        console.error('❌ [TerminalContext] Failed to fetch user info:', response.status, errorText);
        throw new Error(`Failed to fetch user info: ${response.status}`);
      }

      const userData = await response.json();
      console.log('👤 [TerminalContext] User authenticated:', userData.email, userData.role);
      
      // Fetch all terminals the user has access to
      console.log('🏢 [TerminalContext] Fetching terminals...');
      const terminalsResponse = await fetch('http://localhost:8000/api/terminals/', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      console.log('🏢 [TerminalContext] Terminals response status:', terminalsResponse.status);
      if (!terminalsResponse?.ok) {
        const errorText = await terminalsResponse.text();
        console.error('❌ [TerminalContext] Failed to fetch terminals:', terminalsResponse.status, errorText);
        throw new Error(`Failed to fetch terminals: ${terminalsResponse?.status}`);
      }      const terminalsData = await terminalsResponse.json();      console.log('🏢 [TerminalContext] Terminals API response:', terminalsData);
      
      // Handle paginated response structure
      let terminalsArray = [];
      if (terminalsData.results && Array.isArray(terminalsData.results)) {
        // Paginated response
        terminalsArray = terminalsData.results;
        console.log('🏢 [TerminalContext] Found paginated data with', terminalsArray.length, 'terminals');
      } else if (Array.isArray(terminalsData)) {
        // Direct array response
        terminalsArray = terminalsData;
        console.log('🏢 [TerminalContext] Found direct array with', terminalsArray.length, 'terminals');
      } else if (terminalsData && typeof terminalsData === 'object') {
        // Single terminal response
        terminalsArray = [terminalsData];
        console.log('🏢 [TerminalContext] Found single terminal');
      } else {
        // Empty or invalid response
        terminalsArray = [];
        console.log('🏢 [TerminalContext] No valid terminals data found');
      }
      
      // Transform the data to match our Terminal interface
      const terminals: Terminal[] = terminalsArray.map((terminal: any) => {
        console.log('🔄 [TerminalContext] Processing terminal:', terminal.name, terminal.code);
        
        const transformedTerminal = {
          id: terminal.id,
          name: terminal.name || 'Unknown Terminal',
          code: terminal.code || 'UNK',
          department: {
            id: terminal.department?.id || terminal.department_id || 'unknown',
            name: terminal.department?.name || 'Unknown Department',
            code: terminal.department?.code || 'UNK',
            division: {
              id: terminal.department?.division?.id || terminal.division_id || 'unknown',
              name: terminal.department?.division?.name || 'Unknown Division',
              code: terminal.department?.division?.code || 'UNK',
              company: {
                id: terminal.department?.division?.company?.id || terminal.company_id || 'unknown',
                name: terminal.department?.division?.company?.name || 'Unknown Company',
                code: terminal.department?.division?.company?.code || 'UNK',
              }
            }
          },
          address: {
            city: terminal.address_city || 'Unknown',
            state: terminal.address_state || 'Unknown',
          },
          isActive: terminal.is_active ?? true
        };        
        console.log('✅ [TerminalContext] Transformed terminal:', transformedTerminal);
        return transformedTerminal;
      });

      console.log('🎯 [TerminalContext] Final terminals array:', terminals.length, 'terminals');
      setAvailableTerminals(terminals);
      
      // Smart auto-selection: prioritize user's assigned terminal, then first available terminal
      if (terminals.length > 0) {
        let terminalToSelect = null;
        
        // First priority: user's specifically assigned terminal
        if (userData.terminal) {
          terminalToSelect = terminals.find(t => t.id === userData.terminal);
        }
        
        // Second priority: terminal in user's home department
        if (!terminalToSelect && userData.department) {
          terminalToSelect = terminals.find(t => t.department?.id === userData.department);
        }
        
        // Third priority: any terminal in user's division
        if (!terminalToSelect && userData.division) {
          terminalToSelect = terminals.find(t => t.department?.division?.id === userData.division);
        }
        
        // Fourth priority: any terminal in user's company
        if (!terminalToSelect && userData.company) {
          terminalToSelect = terminals.find(t => t.department?.division?.company?.id === userData.company);
        }
        
        // Final fallback: first available terminal
        if (!terminalToSelect) {
          terminalToSelect = terminals[0];
        }
        
        setSelectedTerminal(terminalToSelect);
      }

    } catch (err) {
      console.error('Error fetching terminals:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch terminals');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUserTerminals();
  }, []);

  const refreshTerminals = () => {
    fetchUserTerminals();
  };  const getTerminalDisplayName = (terminal: Terminal): string => {
    if (!terminal) return 'Unknown Terminal';
    return `${terminal.name || 'Unknown'} (${terminal.code || 'UNK'})`;
  };

  const getTerminalHierarchy = (terminal: Terminal): string => {
    try {
      if (!terminal?.department?.division?.company) {
        return 'Unknown Organization';
      }
      return `${terminal.department.division.company.name} > ${terminal.department.division.name} > ${terminal.department.name}`;
    } catch (error) {
      console.error('Error getting terminal hierarchy:', error);
      return 'Unknown Organization';
    }
  };

  return (
    <TerminalContext.Provider
      value={{
        selectedTerminal,
        setSelectedTerminal,
        availableTerminals,
        loading,
        error,
        refreshTerminals,
        getTerminalDisplayName,
        getTerminalHierarchy,
      }}
    >
      {children}
    </TerminalContext.Provider>
  );
}

export function useTerminal() {
  const context = useContext(TerminalContext);
  if (context === undefined) {
    throw new Error('useTerminal must be used within a TerminalProvider');
  }
  return context;
}
