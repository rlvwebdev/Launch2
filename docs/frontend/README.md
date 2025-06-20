# 🌐 Frontend Documentation

## Next.js Application

### Overview

The Launch TMS frontend is a modern, mobile-first web application built with Next.js 15.3.3, React 19, and TypeScript, designed specifically for transportation management operations.

### Architecture

```
frontend/
├── src/
│   ├── app/                 # Next.js App Router pages
│   ├── components/          # Reusable UI components
│   │   ├── forms/          # Form components
│   │   ├── layout/         # Layout components
│   │   ├── navigation/     # Navigation components
│   │   ├── reports/        # Report components
│   │   └── ui/            # Base UI components
│   ├── context/            # React Context providers
│   ├── hooks/              # Custom React hooks
│   ├── lib/               # Utility libraries
│   ├── types/             # TypeScript type definitions
│   └── utils/             # Utility functions
├── public/                 # Static assets
├── scripts/               # Data generation scripts
└── templates/             # CSV templates
```

### Key Features

- **Mobile-First Design**: Optimized for mobile devices with responsive layouts
- **Modern UI/UX**: Clean, intuitive interface using Tailwind CSS v4
- **Component-Based**: Modular, reusable components
- **TypeScript**: Full type safety throughout the application
- **Real-time Data**: Dynamic data loading and state management
- **Progressive Web App**: PWA capabilities for mobile experience

### Tech Stack

- **Framework**: Next.js 15.3.3 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS v4
- **UI Components**: Headless UI, Lucide React
- **Charts**: Recharts
- **State Management**: React Context API
- **Data Fetching**: Custom API client with fetch

### Core Features

#### Navigation
- **Bottom Navigation**: 4 main sections (Drivers, Trucks, Loads, Settings)
- **Touch-Friendly**: Minimum 44px touch targets
- **Responsive**: Scales from mobile to desktop

#### Data Management
- **Driver Management**: Complete driver profiles and assignments
- **Truck Management**: Vehicle tracking and maintenance
- **Load Management**: Shipment tracking with status updates
- **Settings**: Application configuration

#### Components

##### Layout Components
- `MobileLayout`: Main mobile-first layout wrapper
- `BottomNavigation`: Primary navigation component
- `Header`: Page headers with actions

##### UI Components
- `Button`: Customizable button component
- `Card`: Container component for content sections
- `Badge`: Status and category indicators
- `Select`: Dropdown selection component

##### Form Components
- Form validation and submission handling
- Input components with proper TypeScript typing
- File upload and data import functionality

### Data Models

The frontend uses TypeScript interfaces for type safety:

```typescript
interface Driver {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  licenseNumber: string;
  licenseExpiry: string;
  status: 'active' | 'inactive' | 'on_leave';
}

interface Truck {
  id: string;
  truckNumber: string;
  make: string;
  model: string;
  year: number;
  vin: string;
  status: 'available' | 'in_use' | 'maintenance';
}

interface Load {
  id: string;
  loadNumber: string;
  origin: string;
  destination: string;
  status: 'planned' | 'in_transit' | 'delivered' | 'cancelled';
  assignedDriver?: string;
  assignedTruck?: string;
}
```

### Development

#### Setup
```bash
cd frontend
npm install
npm run dev
```

#### Available Scripts
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

#### Environment Variables

Frontend environment variables (`.env.local`):
```bash
NEXT_PUBLIC_API_URL=http://localhost:8000
NEXT_PUBLIC_FRONTEND_URL=http://localhost:3000
```

### API Integration

The frontend communicates with the Django backend via REST API:

- **Base URL**: Configured via `NEXT_PUBLIC_API_URL`
- **Authentication**: JWT tokens stored in localStorage
- **Error Handling**: Centralized error handling with user-friendly messages
- **Loading States**: Proper loading indicators throughout the app

### Deployment

The frontend is configured for deployment on Vercel:

- **Build Command**: `npm run build`
- **Output Directory**: `.next`
- **Environment Variables**: Set in Vercel dashboard
- **Domain**: Custom domain support available

### Mobile Optimization

- **Responsive Design**: Mobile-first approach
- **Touch Interactions**: Optimized for touch screens
- **Performance**: Optimized bundle sizes and loading
- **Offline Support**: PWA capabilities for offline functionality
