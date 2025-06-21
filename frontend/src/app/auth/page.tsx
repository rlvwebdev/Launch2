'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useRouter } from 'next/navigation';
import { LoginForm } from '../../components/auth/LoginForm';
import { RegisterForm } from '../../components/auth/RegisterForm';
import { useTheme } from '../../context/ThemeContext';
import { LaunchTriangle } from '../../components/ui/LaunchTriangle';
import { 
  Users, 
  Package, 
  BarChart3, 
  Shield, 
  Clock,
  Star,
  ArrowRight
} from 'lucide-react';

export default function AuthPage() {
  const [isLoginMode, setIsLoginMode] = useState(true);
  const [isLoaded, setIsLoaded] = useState(false);
  const { isAuthenticated, isLoading } = useAuth();
  const { currentTheme } = useTheme();
  const router = useRouter();

  useEffect(() => {
    if (isAuthenticated) {
      router.push('/');
    }
  }, [isAuthenticated, router]);

  useEffect(() => {
    // Trigger animations after component mounts
    const timer = setTimeout(() => {
      setIsLoaded(true);
    }, 100);
    return () => clearTimeout(timer);
  }, []);  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[var(--color-background)]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[var(--color-accent)]"></div>
      </div>
    );
  }

  if (isAuthenticated) {
    return null; // Will redirect
  }  return (
    <div className="min-h-screen flex bg-[var(--color-background)]">
      {/* Left Column - Professional Marketing Content */}
      <div className={`hidden lg:flex bg-gradient-to-br from-[var(--color-background)] to-[var(--color-surface)] relative transition-all duration-1000 ease-out ${
        isLoginMode 
          ? 'lg:w-1/2' 
          : 'lg:w-1/3' // Smaller when in registration mode to give more space to form
      } ${
        isLoaded ? 'translate-x-0 opacity-100' : '-translate-x-full opacity-0'
      }`}>
        
        <div className="relative z-10 flex flex-col justify-center px-12 xl:px-20 max-w-2xl">
          {/* Clean Brand Header */}
          <div className={`mb-12 transition-all duration-1200 delay-300 ease-out ${
            isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
          }`}>            <h1 className="text-5xl lg:text-6xl xl:text-7xl font-black text-black mb-4 leading-tight">
              L<span className="text-[var(--color-accent)]">A</span>UNCH
            </h1><p className="text-lg lg:text-xl text-[var(--color-accent)] font-medium">
              Transportation Management System
            </p>
          </div>

          {/* Value Proposition */}
          <div className={`mb-12 transition-all duration-1200 delay-500 ease-out ${
            isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-12 opacity-0'
          }`}>
            <h2 className="text-3xl xl:text-4xl font-bold text-[var(--color-text)] mb-6 leading-tight">
              Streamline your fleet operations with intelligent management
            </h2>
            <p className="text-lg text-[var(--color-text)] opacity-80 leading-relaxed">
              Complete end-to-end solution for modern transportation companies. 
              Manage drivers, vehicles, and loads with powerful analytics and real-time tracking.
            </p>
          </div>

          {/* Clean Feature List */}
          <div className={`space-y-6 mb-12 transition-all duration-1200 delay-700 ease-out ${
            isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
          }`}>
            {[
              {
                icon: Users,
                title: 'Driver Management',
                description: 'Complete profiles, performance tracking, and compliance monitoring'
              },
              {
                icon: Package,
                title: 'Load Optimization', 
                description: 'Real-time tracking, route optimization, and delivery management'
              },
              {
                icon: BarChart3,
                title: 'Advanced Analytics',
                description: 'Comprehensive reporting, insights, and performance metrics'
              }
            ].map((feature, index) => {
              const Icon = feature.icon;
              return (
                <div 
                  key={index}
                  className="flex items-start space-x-4 group"
                >
                  <div className="flex-shrink-0 w-12 h-12 bg-[var(--color-accent)]/10 rounded-lg flex items-center justify-center border border-[var(--color-accent)]/20 group-hover:bg-[var(--color-accent)]/20 transition-colors">
                    <Icon className="w-6 h-6 text-[var(--color-accent)]" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-[var(--color-text)] mb-2">{feature.title}</h3>
                    <p className="text-[var(--color-text)] opacity-70 leading-relaxed">{feature.description}</p>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Trust Indicators */}
          <div className={`flex items-center space-x-8 transition-all duration-1200 delay-900 ease-out ${
            isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
          }`}>
            <div className="flex items-center space-x-2">
              <Shield className="w-5 h-5 text-[var(--color-accent)]" />
              <span className="text-sm font-medium text-[var(--color-text)]">Enterprise Security</span>
            </div>
            <div className="flex items-center space-x-2">
              <Clock className="w-5 h-5 text-[var(--color-accent)]" />
              <span className="text-sm font-medium text-[var(--color-text)]">99.9% Uptime</span>
            </div>
            <div className="flex items-center space-x-2">
              <Star className="w-5 h-5 text-[var(--color-accent)]" />
              <span className="text-sm font-medium text-[var(--color-text)]">24/7 Support</span>
            </div>
          </div>
        </div>
      </div>      {/* Right Column - Clean Login Form with Accent Background and Image */}
      <div className={`w-full flex flex-col min-h-screen lg:min-h-full px-6 sm:px-8 lg:px-12 py-8 lg:py-12 relative transition-all duration-1000 ease-out ${
        isLoginMode 
          ? 'lg:w-1/2' 
          : 'lg:w-2/3' // Wider when in registration mode
      } ${
        isLoaded ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0'
      }`}>{/* Background layers with accent color, image, and gradient overlay */}
        <div className="absolute inset-0 login-bg-accent" />
        <div className="absolute inset-0 login-bg-image" />
        <div className="absolute inset-0 login-gradient-overlay" />        
        {/* Main Content Area - Centered */}
        <div className="flex-1 flex items-center justify-center">
          <div className={`w-full relative z-10 transition-all duration-1200 delay-400 ease-out ${
            isLoginMode 
              ? 'max-w-md' 
              : 'max-w-4xl' // Much wider for registration form
          } ${
            isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
          }`}>            {/* Mobile Header */}            <div className="lg:hidden text-center mb-10">
              <h1 className="text-6xl sm:text-7xl md:text-8xl font-black text-white mb-3 px-2 leading-none">
                L<span className="text-[var(--color-accent)]">A</span>UNCH
              </h1>
              <p className="hidden text-[var(--color-accent)] opacity-70 font-medium text-sm sm:text-base px-4">
                Transportation Management System
              </p>
            </div>

            {/* Auth Forms */}
            {isLoginMode ? (
              <LoginForm onToggleMode={() => setIsLoginMode(false)} />
            ) : (
              <RegisterForm onToggleMode={() => setIsLoginMode(true)} />
            )}
          </div>
        </div>        {/* Footer positioned at bottom - out of the way */}
        <div className="relative z-10 mt-auto">
          <div className="text-center py-4 px-4">
            <div className="flex items-center justify-center space-x-6 mb-3 text-sm">
              <a href="/docs" className="text-white/70 hover:text-white hover:underline decoration-white/80 transition-all flex items-center">
                Documentation <ArrowRight className="w-3 h-3 ml-1 opacity-70" />
              </a>
              <a href="/support" className="text-white/70 hover:text-white hover:underline decoration-white/80 transition-all">
                Support
              </a>
            </div>
            
            <p className="text-xs text-white/50 leading-relaxed">
              By signing in, you agree to our{' '}
              <a href="#" className="text-white/60 hover:text-white/90 hover:underline decoration-white/60 transition-all">
                Terms of Service
              </a>
              {' '}and{' '}
              <a href="#" className="text-white/60 hover:text-white/90 hover:underline decoration-white/60 transition-all">
                Privacy Policy
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
