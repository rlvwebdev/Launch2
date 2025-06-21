'use client';

import { useState } from 'react';

export default function AuthTestPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [authStatus, setAuthStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [authData, setAuthData] = useState<any>(null);
  const [error, setError] = useState<string>('');

  const testLogin = async () => {
    setIsLoading(true);
    setAuthStatus('idle');
    setError('');

    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';
      
      // Test login with Django test user credentials
      const response = await fetch(`${apiUrl}/auth/login/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: 'testuser',
          password: 'password'
        }),
      });

      if (response.ok) {
        const result = await response.json();
        setAuthData(result);
        setAuthStatus('success');
        
        // Store token in localStorage for testing
        if (result.access) {
          localStorage.setItem('auth_token', result.access);
        }
      } else {
        const errorData = await response.json();
        throw new Error(errorData.detail || `HTTP ${response.status}: ${response.statusText}`);
      }
    } catch (err) {
      console.error('Authentication failed:', err);
      setError(err instanceof Error ? err.message : 'Unknown error');
      setAuthStatus('error');
    } finally {
      setIsLoading(false);
    }
  };

  const testProtectedEndpoint = async () => {
    if (!authData?.access) {
      setError('No access token available. Please login first.');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';
      
      const response = await fetch(`${apiUrl}/users/me/`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${authData.access}`,
        },
      });

      if (response.ok) {
        const userData = await response.json();
        console.log('User data:', userData);
        alert(`Successfully accessed protected endpoint! User: ${userData.username || userData.email}`);
      } else {
        const errorData = await response.json();
        throw new Error(errorData.detail || `HTTP ${response.status}: ${response.statusText}`);
      }
    } catch (err) {
      console.error('Protected endpoint test failed:', err);
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">
          🔐 Authentication Test
        </h1>
        
        <div className="bg-white rounded-lg shadow-lg p-6 space-y-6">
          <div>
            <h2 className="text-xl font-semibold mb-4">Django JWT Authentication Test</h2>
            
            <div className="space-y-4">
              <div className="bg-blue-50 rounded-md p-4">
                <h3 className="font-medium text-blue-900 mb-2">Test Credentials:</h3>
                <div className="text-sm text-blue-700 space-y-1">
                  <p><strong>Username:</strong> testuser</p>
                  <p><strong>Password:</strong> password</p>
                  <p><strong>Endpoint:</strong> {process.env.NEXT_PUBLIC_API_URL}/auth/login/</p>
                </div>
              </div>

              <button
                onClick={testLogin}
                disabled={isLoading}
                className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? '🔄 Testing...' : '✅ Test Login'}
              </button>

              {authStatus === 'success' && authData && (
                <div className="space-y-4">
                  <div className="flex items-center space-x-2">
                    <div className="h-3 w-3 bg-green-500 rounded-full"></div>
                    <span className="text-green-700 font-medium">✅ Authentication successful!</span>
                  </div>
                  
                  <div className="bg-gray-50 rounded-md p-4">
                    <h3 className="font-medium text-gray-900 mb-2">JWT Tokens:</h3>
                    <pre className="text-xs text-gray-600 overflow-auto">
                      {JSON.stringify(authData, null, 2)}
                    </pre>
                  </div>

                  <button
                    onClick={testProtectedEndpoint}
                    disabled={isLoading}
                    className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isLoading ? '🔄 Testing...' : '🔒 Test Protected Endpoint'}
                  </button>
                </div>
              )}

              {authStatus === 'error' && (
                <div className="bg-red-50 rounded-md p-4">
                  <h3 className="font-medium text-red-900 mb-2">Authentication Failed:</h3>
                  <p className="text-sm text-red-600">{error}</p>
                </div>
              )}

              {error && authStatus !== 'error' && (
                <div className="bg-yellow-50 rounded-md p-4">
                  <h3 className="font-medium text-yellow-900 mb-2">Error:</h3>
                  <p className="text-sm text-yellow-600">{error}</p>
                </div>
              )}
            </div>
          </div>

          <div className="border-t border-gray-200 pt-6">
            <h3 className="font-medium text-gray-900 mb-4">Available API Endpoints:</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div className="space-y-2">
                <h4 className="font-medium">Authentication:</h4>
                <ul className="text-gray-600 space-y-1">
                  <li>• POST /auth/login/</li>
                  <li>• POST /auth/refresh/</li>
                </ul>
              </div>
              
              <div className="space-y-2">
                <h4 className="font-medium">Resources:</h4>
                <ul className="text-gray-600 space-y-1">
                  <li>• GET /companies/</li>
                  <li>• GET /users/me/</li>
                  <li>• GET /drivers/</li>
                  <li>• GET /trucks/</li>
                  <li>• GET /loads/</li>
                </ul>
              </div>
            </div>
          </div>

          <div className="border-t border-gray-200 pt-6">
            <p className="text-sm text-gray-600">
              <strong>API Documentation:</strong> Visit{' '}
              <a 
                href="http://localhost:8000/api/docs/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-blue-600 hover:text-blue-800 underline"
              >
                http://localhost:8000/api/docs/
              </a>{' '}
              for interactive API documentation.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
