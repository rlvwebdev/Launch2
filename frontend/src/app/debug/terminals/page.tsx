'use client';

import React from 'react';
import { useTerminal } from '@/context/TerminalContext';

export default function TerminalDebugPage() {
  const { 
    selectedTerminal, 
    availableTerminals, 
    loading, 
    error 
  } = useTerminal();

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Terminal Context Debug</h1>
      
      <div className="space-y-6">
        <div className="bg-gray-100 p-4 rounded-lg">
          <h2 className="text-lg font-semibold mb-2">Loading State</h2>
          <p>Loading: {loading ? 'Yes' : 'No'}</p>
        </div>

        <div className="bg-gray-100 p-4 rounded-lg">
          <h2 className="text-lg font-semibold mb-2">Error State</h2>
          <p>Error: {error || 'None'}</p>
        </div>

        <div className="bg-gray-100 p-4 rounded-lg">
          <h2 className="text-lg font-semibold mb-2">Available Terminals ({availableTerminals.length})</h2>
          {availableTerminals.length > 0 ? (
            <ul className="space-y-2">
              {availableTerminals.map((terminal) => (
                <li key={terminal.id} className="border-l-4 border-blue-500 pl-4">
                  <strong>{terminal.name}</strong> ({terminal.code})
                  <br />                  <span className="text-sm text-gray-600">
                    {terminal.department.division.company.name} {'>'}  {terminal.department.division.name} {'>'} {terminal.department.name}
                  </span>
                  <br />
                  <span className="text-sm text-gray-500">
                    {terminal.address.city}, {terminal.address.state}
                  </span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-500">No terminals available</p>
          )}
        </div>

        <div className="bg-gray-100 p-4 rounded-lg">
          <h2 className="text-lg font-semibold mb-2">Selected Terminal</h2>
          {selectedTerminal ? (
            <div className="border-l-4 border-green-500 pl-4">
              <strong>{selectedTerminal.name}</strong> ({selectedTerminal.code})
              <br />              <span className="text-sm text-gray-600">
                {selectedTerminal.department.division.company.name} {'>'} {selectedTerminal.department.division.name} {'>'} {selectedTerminal.department.name}
              </span>
              <br />
              <span className="text-sm text-gray-500">
                {selectedTerminal.address.city}, {selectedTerminal.address.state}
              </span>
            </div>
          ) : (
            <p className="text-gray-500">No terminal selected</p>
          )}
        </div>

        <div className="bg-blue-50 p-4 rounded-lg">
          <h2 className="text-lg font-semibold mb-2">Authentication Debug</h2>
          <p>LocalStorage Token: {typeof window !== 'undefined' && localStorage.getItem('auth_token') ? 'Present' : 'Missing'}</p>
          <p>SessionStorage Token: {typeof window !== 'undefined' && sessionStorage.getItem('auth_token') ? 'Present' : 'Missing'}</p>
        </div>
      </div>
    </div>
  );
}
