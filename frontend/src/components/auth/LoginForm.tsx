import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import Button from '../ui/Button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/Card';
import { Mail, Lock, Eye, EyeOff } from 'lucide-react';

interface LoginFormProps {
  onToggleMode: () => void;
}

export function LoginForm({ onToggleMode }: LoginFormProps) {
  const { login, isLoading, error } = useAuth();
  const { currentTheme } = useTheme();
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    rememberMe: false,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await login(formData);
    } catch (error) {
      console.error('Login error:', error);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };  return (
    <Card className="w-full max-w-md mx-auto border-[var(--color-surface)] shadow-lg bg-[var(--color-surface)]/50 backdrop-blur-sm">      <CardHeader className="space-y-2 pb-6 text-center">
        <CardTitle className="text-2xl font-black text-[var(--color-accent)]">
          🚀 WELCOME BACK
        </CardTitle>
        <CardDescription className="text-[var(--color-text)] opacity-70">
          Ready to hit the road? Sign in to your dashboard
        </CardDescription>
      </CardHeader><CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">{error && (
            <div className="bg-red-900/50 border border-red-700/50 text-red-200 p-3 rounded-lg">
              <p className="text-red-200 text-sm">{error}</p>
            </div>
          )}            <div className="space-y-2 group">            <label htmlFor="email" className="text-sm font-medium text-[var(--color-text)] block group-focus-within:text-[var(--color-accent)] transition-colors">
              Email Address
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-3 h-4 w-4 text-[var(--color-text)] group-focus-within:text-[var(--color-accent)] transition-colors" /><input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full pl-10 pr-3 py-3 bg-[var(--color-background)] border border-[var(--color-surface)] text-[var(--color-text)] placeholder-[var(--color-text)] placeholder-opacity-50 rounded-lg focus:border-[var(--color-accent)] focus:ring-2 focus:ring-[var(--color-accent)]/20 focus:outline-none transition-all duration-200"
                placeholder="Enter your email"
                required
                autoComplete="email"
              />
            </div>
          </div>

          <div className="space-y-2 group">            <label htmlFor="password" className="text-sm font-medium text-[var(--color-text)] block group-focus-within:text-[var(--color-accent)] transition-colors">
              Password
            </label>            <div className="relative">
              <Lock className="absolute left-3 top-3 h-4 w-4 text-[var(--color-text)] group-focus-within:text-[var(--color-accent)] transition-colors" /><input
                id="password"
                name="password"
                type={showPassword ? 'text' : 'password'}
                value={formData.password}
                onChange={handleChange}
                className="w-full pl-10 pr-10 py-3 bg-[var(--color-background)] border border-[var(--color-surface)] text-[var(--color-text)] placeholder-[var(--color-text)] placeholder-opacity-50 rounded-lg focus:border-[var(--color-accent)] focus:ring-2 focus:ring-[var(--color-accent)]/20 focus:outline-none transition-all duration-200"
                placeholder="Enter your password"
                required
                autoComplete="current-password"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-3 h-4 w-4 text-[var(--color-text)] hover:text-[var(--color-accent)] transition-colors duration-200"
              >
                {showPassword ? <EyeOff /> : <Eye />}
              </button>
            </div>
          </div>          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">              {/* Custom Toggle Checkbox */}
              <button
                type="button"
                onClick={() => setFormData(prev => ({ ...prev, rememberMe: !prev.rememberMe }))}
                className={`relative inline-flex h-5 w-9 items-center rounded-full transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)]/30 ${
                  formData.rememberMe 
                    ? 'bg-[var(--color-accent)]' 
                    : 'bg-[var(--color-background)] border border-[var(--color-surface)]'
                }`}
                aria-label="Remember me toggle"
              >
                <span
                  className={`inline-block h-3 w-3 transform rounded-full transition-all duration-200 ${
                    formData.rememberMe
                      ? 'translate-x-5 bg-white'
                      : 'translate-x-1 bg-[var(--color-text)] opacity-40'
                  }`}
                />
              </button>
              <label 
                onClick={() => setFormData(prev => ({ ...prev, rememberMe: !prev.rememberMe }))}
                className="text-sm text-[var(--color-text)] cursor-pointer select-none"
              >
                Remember me
              </label>
            </div>
            <button
              type="button"
              className="text-sm text-[var(--color-accent)] hover:opacity-80 transition-opacity"
            >
              Forgot password?
            </button>
          </div>          <Button
            type="submit"
            className="w-full bg-[var(--color-accent)] hover:bg-[var(--color-accent)]/90 text-[var(--color-background)] font-black py-3 text-xl uppercase tracking-wide transition-all duration-200 shadow-lg hover:shadow-[var(--color-accent)]/20 border-0 transform hover:scale-[1.02] active:scale-[0.98]"
            disabled={isLoading}
            style={{ 
              color: 'var(--color-background)', 
              fontWeight: '900',
              backgroundColor: 'var(--color-accent)'
            }}
          >            {isLoading ? (
              <div className="flex items-center justify-center space-x-2">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-[var(--color-background)]"></div>
                <span>SIGNING IN...</span>
              </div>
            ) : (
              'SIGN IN'
            )}
          </Button>          <div className="text-center pt-4 border-t border-[var(--color-surface)]">
            <span className="text-sm text-[var(--color-text)]">
              Don&apos;t have an account?{' '}
              <button
                type="button"
                onClick={onToggleMode}
                className="text-[var(--color-accent)] hover:opacity-80 font-medium transition-opacity"
              >
                Create account
              </button>
            </span>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
