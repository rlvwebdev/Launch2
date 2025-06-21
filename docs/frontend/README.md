# 🌐 Frontend Documentation

## Next.js Application

### Overview

The Launch TMS frontend is built with Next.js 15.3.3, React 19, and TypeScript, providing a modern, mobile-first user interface for transportation management operations. The application follows a component-based architecture with context providers for state management and a comprehensive UI design system.

### Architecture

```
frontend/src/
├── app/                    # Next.js App Router pages
│   ├── auth/              # Authentication pages
│   ├── drivers/           # Driver management pages
│   ├── trucks/            # Vehicle management pages
│   ├── loads/             # Load management pages
│   ├── reports/           # Reporting and analytics pages
│   └── settings/          # Application settings
├── components/            # Reusable React components
│   ├── ui/                # Base UI components
│   ├── layout/            # Layout components
│   ├── navigation/        # Navigation components
│   ├── forms/             # Form components
│   └── reports/           # Report-specific components
├── context/               # React Context providers
├── hooks/                 # Custom React hooks
├── lib/                   # Utility libraries
├── types/                 # TypeScript type definitions
└── utils/                 # Helper functions
```

### Technology Stack

- **Framework:** Next.js 15.3.3 with App Router
- **React:** React 19 with functional components and hooks
- **Language:** TypeScript for type safety
- **Styling:** Tailwind CSS v4 for utility-first styling
- **UI Components:** Headless UI for accessible components
- **Icons:** Lucide React for consistent iconography
- **Charts:** Recharts for data visualization
- **State Management:** React Context with custom providers

### Key Features

#### 1. Mobile-First Design
- **Responsive Layout:** Adapts from mobile (320px) to desktop (1920px+)
- **Touch Optimization:** 44px minimum touch targets
- **Progressive Web App:** App-like experience with offline capabilities
- **Bottom Navigation:** Mobile-friendly navigation pattern

#### 2. Authentication System
- **JWT Token Authentication:** Secure token-based auth
- **Route Protection:** Automatic redirection for unauthenticated users
- **Role-Based Access:** Different access levels based on user permissions
- **Session Management:** Automatic token refresh and logout

#### 3. Multi-Tenant Architecture
- **Company Isolation:** All data filtered by user's company
- **Organizational Hierarchy:** Support for divisions, departments, and terminals
- **Context-Aware UI:** Dynamic interface based on user's organizational level

#### 4. Data Management
- **Context Providers:** Centralized state management
- **Real-time Updates:** Automatic data refresh and synchronization
- **Error Handling:** Comprehensive error boundaries and user feedback
- **Loading States:** Skeleton screens and progress indicators

## Core Components

### 1. Layout Components

#### AppLayout
- **Purpose:** Main application wrapper
- **Features:** Responsive sidebar, mobile navigation, theme management
- **Props:** `children` (React nodes)

#### PageHeader
- **Purpose:** Consistent page headers with actions
- **Features:** Title, subtitle, action buttons, breadcrumbs
- **Props:** `title`, `subtitle`, `actions`, `breadcrumbs`

#### MobileHeader
- **Purpose:** Mobile-optimized header
- **Features:** Menu toggle, user avatar, notifications
- **Props:** `title`, `showBack`, `actions`

### 2. Navigation Components

#### DesktopNavigation
- **Purpose:** Sidebar navigation for desktop
- **Features:** Collapsible sidebar, active state management, tooltips
- **State:** `isCollapsed`, navigation items, user context

#### BottomNavigation
- **Purpose:** Mobile bottom navigation
- **Features:** 4 main sections (Drivers, Trucks, Loads, Reports)
- **State:** Active route detection, badge notifications

#### UserMenu
- **Purpose:** User profile and settings dropdown
- **Features:** Profile info, settings link, logout
- **Props:** User data, logout handler

### 3. Form Components

#### Driver Forms
- **DriverForm:** Create/edit driver information
- **DriverDocumentForm:** Upload and manage driver documents
- **DriverAssignmentForm:** Assign trucks and supervisors

#### Vehicle Forms
- **TruckForm:** Create/edit truck information
- **TrailerForm:** Create/edit trailer information
- **MaintenanceForm:** Schedule and track maintenance

#### Load Forms
- **LoadForm:** Create/edit load information
- **LoadAssignmentForm:** Assign drivers and vehicles
- **LoadEventForm:** Track load status and events

### 4. UI Components

#### Button
- **Variants:** `primary`, `secondary`, `outline`, `ghost`, `destructive`
- **Sizes:** `sm`, `md`, `lg`
- **States:** `loading`, `disabled`
- **Props:** `variant`, `size`, `loading`, `disabled`, `onClick`

#### Input
- **Types:** `text`, `email`, `password`, `number`, `tel`, `url`
- **Features:** Validation, error states, icons
- **Props:** `type`, `value`, `onChange`, `error`, `icon`

#### Card
- **Structure:** `Card`, `CardHeader`, `CardTitle`, `CardContent`
- **Features:** Consistent spacing, shadows, borders
- **Variants:** Default, elevated, outlined

#### Alert
- **Types:** `info`, `success`, `warning`, `error`
- **Features:** Icon, title, description, dismissible
- **Props:** `type`, `title`, `description`, `onDismiss`

## Context Providers

### 1. AuthContext
- **Purpose:** Authentication state management
- **State:** `user`, `isAuthenticated`, `isLoading`, `error`
- **Methods:** `login()`, `logout()`, `register()`, `refreshToken()`

### 2. DataContext
- **Purpose:** Application data management
- **State:** `drivers`, `trucks`, `trailers`, `loads`, `companies`
- **Methods:** CRUD operations for each entity
- **Features:** Automatic refresh, error handling, loading states

### 3. OrganizationalContext
- **Purpose:** Organizational hierarchy management
- **State:** `currentOrganization`, `divisions`, `departments`, `terminals`
- **Methods:** `setCurrentOrganization()`, `getFilteredData()`
- **Features:** Hierarchical filtering, access control

### 4. ThemeContext
- **Purpose:** Theme and styling management
- **State:** `currentTheme`, `customThemes`, `isDarkMode`
- **Methods:** `setTheme()`, `addCustomTheme()`, `toggleDarkMode()`
- **Features:** Custom theme creation, persistence

### 5. SettingsContext
- **Purpose:** Application settings management
- **State:** `settings`, `preferences`, `notifications`
- **Methods:** `updateSettings()`, `resetSettings()`
- **Features:** User preferences, system settings

## Routing & Navigation

### App Router Structure

```
/                          # Dashboard
/auth                      # Authentication (login/register)
/drivers                   # Driver management
/drivers/[id]              # Driver details
/drivers/create            # Create new driver
/trucks                    # Truck management
/trucks/[id]               # Truck details
/trucks/create             # Create new truck
/trailers                  # Trailer management
/trailers/[id]             # Trailer details
/trailers/create           # Create new trailer
/loads                     # Load management
/loads/[id]                # Load details
/loads/create              # Create new load
/reports                   # Reports and analytics
/reports/daily             # Daily reports
/reports/history           # Report history
/settings                  # Application settings
/organizations             # Organization management
```

### Route Protection

All routes except `/auth` are protected and require authentication:

```typescript
const RouteProtection = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated, isLoading } = useAuth();
  
  if (isLoading) return <LoadingScreen />;
  if (!isAuthenticated) return <Navigate to="/auth" />;
  
  return <>{children}</>;
};
```

## State Management

### Data Flow

1. **Authentication:** User logs in → JWT tokens stored → AuthContext updated
2. **Data Loading:** Context providers fetch data → State updated → Components re-render
3. **User Actions:** Form submissions → API calls → State updates → UI refresh
4. **Error Handling:** API errors → Error boundaries → User feedback

### Optimization Strategies

1. **Memoization:** `useMemo` and `useCallback` for expensive operations
2. **Code Splitting:** Dynamic imports for large components
3. **Image Optimization:** Next.js Image component with lazy loading
4. **Caching:** SWR-like patterns for data fetching

## Development Workflow

### Setup

```bash
cd frontend
npm install
npm run dev
```

### Available Scripts

- `npm run dev` - Start development server with Turbopack
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

### Environment Variables

```
NEXT_PUBLIC_API_URL=http://localhost:8000/api/
NEXT_PUBLIC_APP_NAME=Launch TMS
```

## Security & Performance

### Security Features
1. **XSS Prevention:** Input sanitization and CSP headers
2. **CSRF Protection:** Token-based CSRF protection
3. **Secure Storage:** Secure token storage and transmission

### Performance Optimization
1. **Next.js Optimizations:** Automatic code splitting, image optimization
2. **Lazy Loading:** Components and images loaded on demand
3. **Bundle Analysis:** Webpack bundle analyzer for size optimization

### Accessibility
1. **WCAG 2.1 AA Compliance:** Meet accessibility standards
2. **Keyboard Navigation:** Full keyboard accessibility
3. **Screen Reader Support:** Proper ARIA labels and roles

## Deployment

### Vercel Deployment

1. Connect GitHub repository to Vercel
2. Configure environment variables in Vercel dashboard
3. Automatic deployments triggered on push to main
4. Preview deployments available for pull requests

### Build Configuration

- **Build Command:** `npm run build`
- **Output Directory:** `.next`
- **Node.js Version:** 18.x or higher
- **Environment Variables:** Set via Vercel dashboard or `.env.local`

### Performance Monitoring

- **Lighthouse CI:** Automated performance testing
- **Web Vitals:** Core web vitals monitoring
- **Bundle Analysis:** Webpack bundle analyzer integration
- **Error Tracking:** Integration with error tracking services

### Environment Configuration

- **Development:** `npm run dev` with hot reloading
- **Staging:** Production build with staging API
- **Production:** Optimized build with production API and CDN
