'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import Button from '../ui/Button';
import { Input } from '../ui/Input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/Card';
import { Alert, AlertDescription } from '../ui/Alert';
import { Mail, Lock, Eye, EyeOff, User, Phone, Building } from 'lucide-react';

interface RegisterFormProps {
  onToggleMode: () => void;
}

export function RegisterForm({ onToggleMode }: RegisterFormProps) {
  const { register, isLoading, error } = useAuth();
  const { currentTheme } = useTheme();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    password_confirm: '',
    first_name: '',
    last_name: '',
    company: '',
    role: 'user',    phone: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (formData.password !== formData.password_confirm) {
      return; // Error will be shown in validation
    }

    try {
      await register(formData);
    } catch (error) {
      console.error('Registration error:', error);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const passwordsMatch = formData.password === formData.password_confirm || formData.password_confirm === '';  return (
    <Card className="w-full mx-auto border-[var(--color-surface)] shadow-lg bg-[var(--color-surface)]/50 backdrop-blur-sm lg:max-w-none">      <CardHeader className="space-y-2 pb-6 text-center">
        <CardTitle className="text-2xl font-black text-[var(--color-accent)]">
          🚛 Join the Launch Fleet!
        </CardTitle>
        <CardDescription className="text-[var(--color-text)] opacity-70">
          Start your journey with our transportation management platform
        </CardDescription>
      </CardHeader>
      <CardContent>        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 p-3 rounded-lg dark:bg-red-900/20 dark:border-red-800/30 dark:text-red-300">
              <p className="text-sm">{error}</p>
            </div>
          )}
          
          {/* Two-column layout for larger screens */}
          <div className="grid lg:grid-cols-2 gap-6">
            {/* Left Column */}
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label htmlFor="first_name" className="text-sm font-medium text-[var(--color-text)] block">
                    First Name
                  </label>
                  <div className="relative">
                    <User className="absolute left-3 top-3 h-4 w-4 text-[var(--color-text)] opacity-70" />
                    <Input
                      id="first_name"
                      name="first_name"
                      type="text"
                      value={formData.first_name}
                      onChange={handleChange}
                      className="pl-10 bg-[var(--color-background)] border-[var(--color-surface)] text-[var(--color-text)] placeholder-[var(--color-text)] placeholder-opacity-50 focus:border-[var(--color-accent)] focus:ring-[var(--color-accent)]/20"
                      placeholder="John"
                      required
                      autoComplete="given-name"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label htmlFor="last_name" className="text-sm font-medium text-[var(--color-text)] block">
                    Last Name
                  </label>
                  <div className="relative">
                    <User className="absolute left-3 top-3 h-4 w-4 text-[var(--color-text)] opacity-70" />
                    <Input
                      id="last_name"
                      name="last_name"
                      type="text"
                      value={formData.last_name}
                      onChange={handleChange}
                      className="pl-10 bg-[var(--color-background)] border-[var(--color-surface)] text-[var(--color-text)] placeholder-[var(--color-text)] placeholder-opacity-50 focus:border-[var(--color-accent)] focus:ring-[var(--color-accent)]/20"
                      placeholder="Doe"
                      required
                      autoComplete="family-name"
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <label htmlFor="email" className="text-sm font-medium text-[var(--color-text)] block">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-4 w-4 text-[var(--color-text)] opacity-70" />
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="pl-10 bg-[var(--color-background)] border-[var(--color-surface)] text-[var(--color-text)] placeholder-[var(--color-text)] placeholder-opacity-50 focus:border-[var(--color-accent)] focus:ring-[var(--color-accent)]/20"
                    placeholder="john@example.com"
                    required
                    autoComplete="email"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label htmlFor="phone" className="text-sm font-medium text-[var(--color-text)] block">
                  Phone (Optional)
                </label>
                <div className="relative">
                  <Phone className="absolute left-3 top-3 h-4 w-4 text-[var(--color-text)] opacity-70" />
                  <Input
                    id="phone"
                    name="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={handleChange}
                    className="pl-10 bg-[var(--color-background)] border-[var(--color-surface)] text-[var(--color-text)] placeholder-[var(--color-text)] placeholder-opacity-50 focus:border-[var(--color-accent)] focus:ring-[var(--color-accent)]/20"
                    placeholder="+1 (555) 123-4567"
                    autoComplete="tel"
                  />
                </div>
              </div>
            </div>

            {/* Right Column */}
            <div className="space-y-6">              <div className="space-y-2">
                <label htmlFor="company" className="text-sm font-medium text-[var(--color-text)] block">
                  Company ID *
                </label>
                <div className="relative">
                  <Building className="absolute left-3 top-3 h-4 w-4 text-[var(--color-text)] opacity-70" />
                  <Input
                    id="company"
                    name="company"
                    type="text"
                    value={formData.company}
                    onChange={handleChange}
                    className="pl-10 bg-[var(--color-background)] border-[var(--color-surface)] text-[var(--color-text)] placeholder-[var(--color-text)] placeholder-opacity-50 focus:border-[var(--color-accent)] focus:ring-[var(--color-accent)]/20"
                    placeholder="Enter your company ID"
                    required
                    autoComplete="organization"
                  />
                </div>
                <p className="text-xs text-[var(--color-text)] opacity-70 mt-1">
                  Enter the unique company identifier provided by your administrator.
                </p>
              </div>

              <div className="space-y-2">
                <label htmlFor="password" className="text-sm font-medium text-[var(--color-text)]">
                  Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-[var(--color-text)] opacity-70" />
                  <Input
                    id="password"
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    value={formData.password}
                    onChange={handleChange}
                    className="pl-10 pr-10 bg-[var(--color-background)] border-[var(--color-surface)] text-[var(--color-text)] placeholder-[var(--color-text)] placeholder-opacity-50 focus:border-[var(--color-accent)] focus:ring-[var(--color-accent)]/20"
                    placeholder="Create a password"
                    required
                    autoComplete="new-password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-3 h-4 w-4 text-[var(--color-text)] opacity-70 hover:text-[var(--color-accent)] transition-colors"
                  >
                    {showPassword ? <EyeOff /> : <Eye />}
                  </button>
                </div>
              </div>

              <div className="space-y-2">
                <label htmlFor="password_confirm" className="text-sm font-medium text-[var(--color-text)]">
                  Confirm Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-[var(--color-text)] opacity-70" />
                  <Input
                    id="password_confirm"
                    name="password_confirm"
                    type={showConfirmPassword ? 'text' : 'password'}
                    value={formData.password_confirm}
                    onChange={handleChange}
                    className={`pl-10 pr-10 bg-[var(--color-background)] border-[var(--color-surface)] text-[var(--color-text)] placeholder-[var(--color-text)] placeholder-opacity-50 focus:border-[var(--color-accent)] focus:ring-[var(--color-accent)]/20 ${!passwordsMatch ? 'border-red-500 focus:border-red-400' : ''}`}
                    placeholder="Confirm your password"
                    required
                    autoComplete="new-password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-3 h-4 w-4 text-[var(--color-text)] opacity-70 hover:text-[var(--color-accent)] transition-colors"
                  >
                    {showConfirmPassword ? <EyeOff /> : <Eye />}
                  </button>
                </div>
                {!passwordsMatch && formData.password_confirm && (
                  <p className="text-sm text-red-500 dark:text-red-400">Passwords do not match</p>
                )}
              </div>
            </div>
          </div>

          <Button
            type="submit"
            className="w-full bg-[var(--color-accent)] hover:bg-[var(--color-accent)]/90 text-[var(--color-background)] font-semibold py-2.5 transition-all duration-200 shadow-lg hover:shadow-[var(--color-accent)]/20"
            disabled={isLoading || !passwordsMatch}
            style={{ 
              backgroundColor: 'var(--color-accent)',
              color: 'var(--color-background)'
            }}
          >
            {isLoading ? 'Creating account...' : 'Create Account'}
          </Button>

          <div className="text-center pt-4 border-t border-[var(--color-surface)]">
            <span className="text-sm text-[var(--color-text)]">
              Already have an account?{' '}
              <button
                type="button"
                onClick={onToggleMode}
                className="text-[var(--color-accent)] hover:opacity-80 font-medium transition-opacity"
              >
                Sign in
              </button>
            </span>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
