'use client';

import { useData } from '@/context/DataContext';
import { useState } from 'react';

export default function DateRangeTestPage() {
  const { loads } = useData();
  const [selectedRange, setSelectedRange] = useState('comprehensive');
  
  const today = new Date(); // June 19, 2025
  
  // Test different date ranges
  const getDateRange = (range: string) => {
    const currentDate = new Date();
    let start: Date, end: Date;
    
    switch (range) {
      case 'comprehensive':
        // Show the exact range our comprehensive data covers: June 5-19, 2025
        start = new Date('2025-06-05');
        end = new Date('2025-06-19');
        break;
      case 'past14':
        // Past 14 days from today (June 5-19, 2025)
        start = new Date(currentDate);
        start.setDate(start.getDate() - 14);
        end = new Date(currentDate);
        break;
      case 'today':
        // Today only
        start = new Date(currentDate);
        end = new Date(currentDate);
        break;
      case 'thisWeek':
        // This week (Sunday to Saturday)
        start = new Date(currentDate);
        start.setDate(start.getDate() - start.getDay());
        end = new Date(start);
        end.setDate(start.getDate() + 6);
        break;
      default:
        start = new Date(currentDate);
        end = new Date(currentDate);
    }
    
    return { start, end };
  };
  
  const { start, end } = getDateRange(selectedRange);
  
  // Filter loads based on selected range
  const safeDate = (dateInput: any): Date => {
    if (dateInput instanceof Date) return dateInput;
    if (typeof dateInput === 'string' || typeof dateInput === 'number') {
      const date = new Date(dateInput);
      return isNaN(date.getTime()) ? new Date() : date;
    }
    return new Date();
  };
  
  const filteredLoads = loads.filter(load => {
    const pickupDate = safeDate(load.pickupDate);
    const deliveryDate = safeDate(load.deliveryDate);
    return (pickupDate >= start && pickupDate <= end) || 
           (deliveryDate >= start && deliveryDate <= end);
  });
  
  // Get load distribution by date
  const loadsByDate = loads.reduce((acc, load) => {
    const pickupDate = safeDate(load.pickupDate).toISOString().split('T')[0];
    const deliveryDate = safeDate(load.deliveryDate).toISOString().split('T')[0];
    
    acc[pickupDate] = (acc[pickupDate] || 0) + 1;
    if (pickupDate !== deliveryDate) {
      acc[deliveryDate] = (acc[deliveryDate] || 0) + 1;
    }
    
    return acc;
  }, {} as Record<string, number>);
  
  const sortedDates = Object.entries(loadsByDate).sort(([a], [b]) => a.localeCompare(b));
  
  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Date Range Testing</h1>
      
      <div className="mb-6">
        <label className="block text-sm font-medium mb-2">Select Date Range:</label>
        <select 
          value={selectedRange} 
          onChange={(e) => setSelectedRange(e.target.value)}
          className="px-3 py-2 border rounded-md"
        >
          <option value="comprehensive">Comprehensive Data Range (Jun 5-19, 2025)</option>
          <option value="past14">Past 14 Days</option>
          <option value="today">Today Only</option>
          <option value="thisWeek">This Week</option>
        </select>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-4 rounded-lg shadow">
          <h2 className="font-semibold mb-2">Range Info</h2>
          <div className="space-y-1 text-sm">
            <p><strong>Today:</strong> {today.toISOString().split('T')[0]}</p>
            <p><strong>Start:</strong> {start.toISOString().split('T')[0]}</p>
            <p><strong>End:</strong> {end.toISOString().split('T')[0]}</p>
            <p><strong>Total Loads:</strong> {loads.length}</p>
            <p><strong>Filtered Loads:</strong> {filteredLoads.length}</p>
            <p><strong>Match Rate:</strong> {((filteredLoads.length / loads.length) * 100).toFixed(1)}%</p>
          </div>
        </div>
        
        <div className="bg-white p-4 rounded-lg shadow">
          <h2 className="font-semibold mb-2">Status Breakdown</h2>
          <div className="space-y-1 text-sm">
            {Object.entries(
              filteredLoads.reduce((acc, load) => {
                acc[load.status] = (acc[load.status] || 0) + 1;
                return acc;
              }, {} as Record<string, number>)
            ).map(([status, count]) => (
              <div key={status} className="flex justify-between">
                <span className="capitalize">{status.replace('-', ' ')}</span>
                <span className="font-semibold">{count}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
      
      <div className="mt-6 bg-white p-4 rounded-lg shadow">
        <h2 className="font-semibold mb-2">Loads by Date</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-2 text-xs">
          {sortedDates.map(([date, count]) => (
            <div key={date} className="flex justify-between p-1 border rounded">
              <span>{date}</span>
              <span className="font-semibold">{count}</span>
            </div>
          ))}
        </div>
      </div>
      
      <div className="mt-4 text-sm text-gray-600">
        <p>This page helps identify the optimal date range for filtering loads data.</p>
        <p>Our comprehensive data spans June 5-19, 2025 with 330 loads.</p>
      </div>
    </div>
  );
}
