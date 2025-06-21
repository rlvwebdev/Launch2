import React from 'react';

interface RocketTruckProps {
  className?: string;
  size?: number;
}

export function RocketTruck({ className = "", size = 24 }: RocketTruckProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      {/* Truck Body - Facing Up */}
      <rect x="6" y="8" width="12" height="8" rx="1" />
      
      {/* Truck Cab - Top part */}
      <rect x="8" y="4" width="8" height="5" rx="1" />
      
      {/* Windshield */}
      <line x1="8" y1="7" x2="16" y2="7" />
      
      {/* Wheels */}
      <circle cx="8" cy="18" r="1.5" />
      <circle cx="16" cy="18" r="1.5" />
      
      {/* Flames shooting from bottom */}
      <path d="M10 20 L10 22 L9 24 L10 22 L11 24 L10 22 L12 20" stroke="#ff6b35" strokeWidth="1.5" fill="none" />
      <path d="M14 20 L14 22 L13 24 L14 22 L15 24 L14 22 L16 20" stroke="#ff6b35" strokeWidth="1.5" fill="none" />
      
      {/* Inner flame highlights */}
      <path d="M10 20 L10 21.5 L9.5 23 L10.5 23 L10 21.5" stroke="#ffaa00" strokeWidth="1" fill="none" />
      <path d="M14 20 L14 21.5 L13.5 23 L14.5 23 L14 21.5" stroke="#ffaa00" strokeWidth="1" fill="none" />
    </svg>
  );
}
