'use client';

import React, { useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useRouter, usePathname } from 'next/navigation';
import LandingPage from '../marketing/LandingPage';

interface RouteProtectionProps {
  children: React.ReactNode;
}

const publicRoutes = ['/auth', '/auth/reset-password', '/docs'];

export function RouteProtection({ children }: RouteProtectionProps) {
  const { isAuthenticated, isLoading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!isLoading) {
      const isPublicRoute = publicRoutes.some(route => pathname.startsWith(route));
      
      if (!isAuthenticated && !isPublicRoute) {
        router.push('/auth');
      } else if (isAuthenticated && pathname === '/auth') {
        router.push('/');
      }
    }
  }, [isAuthenticated, isLoading, pathname, router]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="flex flex-col items-center space-y-4">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-theme-primary"></div>
          <p className="text-sm text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }  const isPublicRoute = publicRoutes.some(route => pathname.startsWith(route));
  
  if (!isAuthenticated && !isPublicRoute) {
    // Show landing page instead of redirecting
    if (pathname === '/') {
      return <LandingPage />;
    }
    // Don't call router.push during render - it's handled in useEffect
    return null;
  }

  if (isAuthenticated && pathname === '/auth') {
    return null; // Will redirect to dashboard
  }

  return <>{children}</>;
}
