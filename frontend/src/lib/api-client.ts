/**
 * Launch Transportation Management Platform - API Client
 * Copyright (c) 2025 rlvwebdev. All rights reserved.
 * This software is proprietary and confidential.
 */

import { Driver, Truck, Trailer, Load, Company, Organization } from '@/types'

// API Configuration
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api'

// Types for API responses
interface ApiResponse<T> {
  data: T
  status: number
  message?: string
}

interface LoginResponse {
  access: string
  refresh: string
  user: {
    id: number
    username: string
    email: string
    first_name: string
    last_name: string
  }
}

interface PaginatedResponse<T> {
  count: number
  next: string | null
  previous: string | null
  results: T[]
}

class ApiClient {
  private baseURL: string
  private accessToken: string | null = null
  private refreshToken: string | null = null

  constructor() {
    this.baseURL = API_BASE_URL
    this.loadTokensFromStorage()
  }

  // Token management
  private loadTokensFromStorage() {
    if (typeof window !== 'undefined') {
      this.accessToken = localStorage.getItem('access_token')
      this.refreshToken = localStorage.getItem('refresh_token')
    }
  }

  private saveTokensToStorage(access: string, refresh: string) {
    if (typeof window !== 'undefined') {
      localStorage.setItem('access_token', access)
      localStorage.setItem('refresh_token', refresh)
    }
    this.accessToken = access
    this.refreshToken = refresh
  }

  private clearTokensFromStorage() {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('access_token')
      localStorage.removeItem('refresh_token')
    }
    this.accessToken = null
    this.refreshToken = null
  }
  // HTTP request helper
  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.baseURL}${endpoint}`
    
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...(options.headers as Record<string, string>),
    }

    // Add authorization header if we have a token
    if (this.accessToken) {
      headers['Authorization'] = `Bearer ${this.accessToken}`
    }

    const config: RequestInit = {
      ...options,
      headers,
    }

    try {
      const response = await fetch(url, config)

      // Handle token refresh for 401 errors
      if (response.status === 401 && this.refreshToken) {
        const refreshed = await this.refreshAccessToken()
        if (refreshed) {
          // Retry the original request with new token
          headers['Authorization'] = `Bearer ${this.accessToken}`
          const retryResponse = await fetch(url, { ...config, headers })
          return this.handleResponse<T>(retryResponse)
        }
      }

      return this.handleResponse<T>(response)
    } catch (error) {
      console.error('API request failed:', error)
      throw error
    }
  }

  private async handleResponse<T>(response: Response): Promise<T> {
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      throw new Error(errorData.message || `HTTP error! status: ${response.status}`)
    }

    const contentType = response.headers.get('content-type')
    if (contentType && contentType.includes('application/json')) {
      return response.json()
    }

    return response.text() as unknown as T
  }

  // Auth methods
  async login(username: string, password: string): Promise<LoginResponse> {
    const response = await this.request<LoginResponse>('/auth/login/', {
      method: 'POST',
      body: JSON.stringify({ username, password }),
    })

    this.saveTokensToStorage(response.access, response.refresh)
    return response
  }

  async logout(): Promise<void> {
    if (this.refreshToken) {
      try {
        await this.request('/auth/logout/', {
          method: 'POST',
          body: JSON.stringify({ refresh: this.refreshToken }),
        })
      } catch (error) {
        console.error('Logout request failed:', error)
      }
    }
    this.clearTokensFromStorage()
  }

  async refreshAccessToken(): Promise<boolean> {
    if (!this.refreshToken) return false

    try {
      const response = await this.request<{ access: string }>('/auth/refresh/', {
        method: 'POST',
        body: JSON.stringify({ refresh: this.refreshToken }),
      })

      this.accessToken = response.access
      if (typeof window !== 'undefined') {
        localStorage.setItem('access_token', response.access)
      }
      return true
    } catch (error) {
      console.error('Token refresh failed:', error)
      this.clearTokensFromStorage()
      return false
    }
  }

  // Test connection
  async testConnection(): Promise<{ status: string; message: string }> {
    try {
      const response = await fetch(`${this.baseURL}/health/`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' }
      })
      
      if (response.ok) {
        const data = await response.json()
        return { status: 'success', message: 'Backend connection successful' }
      } else {
        return { status: 'error', message: `Backend responded with status: ${response.status}` }
      }
    } catch (error) {
      return { status: 'error', message: `Connection failed: ${error}` }
    }
  }

  // Driver API methods
  async getDrivers(): Promise<PaginatedResponse<Driver>> {
    return this.request<PaginatedResponse<Driver>>('/drivers/')
  }

  async getDriver(id: string): Promise<Driver> {
    return this.request<Driver>(`/drivers/${id}/`)
  }

  async createDriver(driver: Omit<Driver, 'id'>): Promise<Driver> {
    return this.request<Driver>('/drivers/', {
      method: 'POST',
      body: JSON.stringify(driver),
    })
  }

  async updateDriver(id: string, driver: Partial<Driver>): Promise<Driver> {
    return this.request<Driver>(`/drivers/${id}/`, {
      method: 'PATCH',
      body: JSON.stringify(driver),
    })
  }

  async deleteDriver(id: string): Promise<void> {
    await this.request(`/drivers/${id}/`, {
      method: 'DELETE',
    })
  }

  // Truck API methods
  async getTrucks(): Promise<PaginatedResponse<Truck>> {
    return this.request<PaginatedResponse<Truck>>('/trucks/')
  }

  async getTruck(id: string): Promise<Truck> {
    return this.request<Truck>(`/trucks/${id}/`)
  }

  async createTruck(truck: Omit<Truck, 'id'>): Promise<Truck> {
    return this.request<Truck>('/trucks/', {
      method: 'POST',
      body: JSON.stringify(truck),
    })
  }

  async updateTruck(id: string, truck: Partial<Truck>): Promise<Truck> {
    return this.request<Truck>(`/trucks/${id}/`, {
      method: 'PATCH',
      body: JSON.stringify(truck),
    })
  }

  async deleteTruck(id: string): Promise<void> {
    await this.request(`/trucks/${id}/`, {
      method: 'DELETE',
    })
  }

  // Trailer API methods
  async getTrailers(): Promise<PaginatedResponse<Trailer>> {
    return this.request<PaginatedResponse<Trailer>>('/trailers/')
  }

  async getTrailer(id: string): Promise<Trailer> {
    return this.request<Trailer>(`/trailers/${id}/`)
  }

  async createTrailer(trailer: Omit<Trailer, 'id'>): Promise<Trailer> {
    return this.request<Trailer>('/trailers/', {
      method: 'POST',
      body: JSON.stringify(trailer),
    })
  }

  async updateTrailer(id: string, trailer: Partial<Trailer>): Promise<Trailer> {
    return this.request<Trailer>(`/trailers/${id}/`, {
      method: 'PATCH',
      body: JSON.stringify(trailer),
    })
  }

  async deleteTrailer(id: string): Promise<void> {
    await this.request(`/trailers/${id}/`, {
      method: 'DELETE',
    })
  }

  // Load API methods
  async getLoads(): Promise<PaginatedResponse<Load>> {
    return this.request<PaginatedResponse<Load>>('/loads/')
  }

  async getLoad(id: string): Promise<Load> {
    return this.request<Load>(`/loads/${id}/`)
  }

  async createLoad(load: Omit<Load, 'id'>): Promise<Load> {
    return this.request<Load>('/loads/', {
      method: 'POST',
      body: JSON.stringify(load),
    })
  }

  async updateLoad(id: string, load: Partial<Load>): Promise<Load> {
    return this.request<Load>(`/loads/${id}/`, {
      method: 'PATCH',
      body: JSON.stringify(load),
    })
  }

  async deleteLoad(id: string): Promise<void> {
    await this.request(`/loads/${id}/`, {
      method: 'DELETE',
    })
  }

  // Company API methods
  async getCompanies(): Promise<PaginatedResponse<Company>> {
    return this.request<PaginatedResponse<Company>>('/companies/')
  }

  async getCompany(id: string): Promise<Company> {
    return this.request<Company>(`/companies/${id}/`)
  }

  async createCompany(company: Omit<Company, 'id'>): Promise<Company> {
    return this.request<Company>('/companies/', {
      method: 'POST',
      body: JSON.stringify(company),
    })
  }

  // Utility methods
  isAuthenticated(): boolean {
    return !!this.accessToken
  }

  getAccessToken(): string | null {
    return this.accessToken
  }
}

// Export singleton instance
export const apiClient = new ApiClient()
export default apiClient
