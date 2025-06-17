# 🚀 Launch - Transportation Management Platform

A modern, mobile-first web application for managing transportation operations built with Next.js 15, TypeScript, and Tailwind CSS v4.

![Launch Dashboard](https://img.shields.io/badge/Status-Production%20Ready-brightgreen)
![Next.js](https://img.shields.io/badge/Next.js-15.3.3-black)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue)
![Tailwind CSS](https://img.shields.io/badge/Tailwind%20CSS-v4-38bdf8)

## 🚀 Live Demo

Experience Launch in action: [View Live Application](https://github.com/rlvwebdev/Launch2)

## 📱 Features

### Core Functionality
- **📋 Driver Management** - Complete roster management with 23 drivers
  - Real-time status tracking (Active, In Training, OOS)
  - Search and filtering capabilities
  - Grid and list view options
  - Detailed driver profiles with contact information
  - Import/export capabilities with Excel templates

- **🚛 Fleet Management** - Comprehensive truck tracking
  - Professional numbering system (2812-2856A format)
  - Maintenance scheduling and alerts
  - Assignment management
  - Document management system
  - Add/edit truck functionality with validation
  - Grid and list view with detailed truck cards

- **� Trailer Management** - Complete trailer tracking
  - Trailer numbering and identification
  - Assignment and availability tracking
  - Maintenance scheduling
  - Status monitoring

- **�📦 Load Management** - Advanced load tracking
  - Tabbed interface (Today, Tomorrow, All Loads, Events)
  - Status monitoring and updates (Scheduled, In Transit, Delivered, etc.)
  - Action buttons for operations (Lytx, Transflo, etc.)
  - Comprehensive load information display
  - Search and filtering by status, customer, or route
  - Load statistics and performance metrics

- **📊 Reports & Analytics** - Comprehensive reporting dashboard
  - Real-time performance metrics and KPIs
  - Interactive charts and visualizations
  - Load status distribution analysis
  - Truck utilization reports
  - Driver performance tracking
  - Export functionality for data analysis

- **⚙️ Settings & Configuration** - User preferences
  - Profile management
  - Notification preferences
  - Application settings
  - Import/export templates and data management

### Import/Export System
- **📥 Excel Import** - Bulk data import capabilities
  - Support for Drivers, Trucks, Trailers, Loads, and Settings
  - Template-based import with validation
  - Error handling and data mapping
  - Demo data files for testing and development

- **📤 Excel Export** - Data export functionality
  - Export all entity types to Excel format
  - Template generation for easy data entry
  - Batch operations for bulk data management

### Design & UX
- **📱 Mobile-First Design** - Optimized for mobile devices with desktop scalability
- **🎨 Modern UI** - Clean, professional interface with consistent design system
- **⚡ Responsive Navigation** - Bottom navigation for mobile, collapsible sidebar for desktop
- **🔍 Advanced Search** - Powerful search and filtering across all modules
- **📊 Real-time Stats** - Live dashboard with key performance indicators

## 🛠️ Technology Stack

### Frontend
- **Framework**: Next.js 15.3.3 with App Router
- **Language**: TypeScript 5.0
- **Styling**: Tailwind CSS v4
- **UI Components**: Custom component library with Radix UI primitives
- **Icons**: Lucide React
- **Charts**: Recharts for data visualization
- **State Management**: React hooks and Context API with localStorage persistence
- **Excel Processing**: XLSX library for import/export functionality

### Backend & Data
- **API Routes**: Next.js API routes for Excel import/export
- **Data Persistence**: Browser localStorage with React Context
- **File Processing**: Server-side Excel parsing and validation
- **Demo Data**: Python scripts for generating and validating test data

### Development Tools
- **Package Manager**: npm
- **Linting**: ESLint with Next.js configuration
- **Git Workflow**: Feature branch workflow with main/develop branches
- **Code Style**: TypeScript strict mode, mobile-first responsive design

## 🚦 Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn package manager
- Git for version control

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/rlvwebdev/Launch2.git
   cd Launch2
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start development server**
   ```bash
   npm run dev
   ```

4. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

### Available Scripts

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
```

## 📋 Project Structure

```
Launch/
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── api/               # API routes
│   │   │   └── import/        # Excel import API
│   │   ├── drivers/           # Driver management pages
│   │   ├── trucks/            # Fleet management pages
│   │   │   └── add/          # Add truck functionality
│   │   ├── loads/             # Load management pages
│   │   ├── reports/           # Analytics and reporting
│   │   ├── settings/          # Settings and configuration
│   │   ├── layout.tsx         # Root layout component
│   │   └── page.tsx           # Home page
│   ├── components/            # Reusable UI components
│   │   ├── ui/               # Base UI components (Button, Card, Badge, Select, Chart)
│   │   ├── navigation/       # Navigation components
│   │   ├── layout/           # Layout components
│   │   └── context/          # React Context providers
│   ├── context/              # Application context providers
│   │   └── DataContext.tsx   # Main data management context
│   ├── lib/                  # Utility functions
│   └── types/                # TypeScript type definitions
├── templates/                # Excel import/export templates
│   ├── drivers_template.csv
│   ├── trucks_template.csv
│   ├── trailers_template.csv
│   ├── loads_template.csv
│   └── settings_template.csv
├── notes/                    # Project documentation
├── public/                   # Static assets
│   ├── Launch_Demo_Import_Data.xlsx    # Demo data file
│   ├── Launch_Import_Template.xlsx     # Import template
│   ├── favicon.svg          # Custom favicon
│   └── rocket.svg           # Launch logo
├── create_demo_data.py      # Demo data generation script
├── validate_demo.py         # Demo data validation script
├── Demo_Data_Summary.md     # Demo data documentation
├── Excel_Template_README.md # Template documentation
└── Launch_Import_Template_Guide.md # Import guide
```

## 💡 Key Implementation Highlights

### Mobile-First Architecture
- **Bottom Navigation**: Touch-friendly navigation optimized for mobile users
- **Responsive Cards**: Unified card design that scales across all screen sizes
- **Touch Targets**: All interactive elements meet accessibility guidelines (44px minimum)
- **Progressive Enhancement**: Desktop features enhance the mobile experience

### Data Management
- **Type Safety**: Comprehensive TypeScript interfaces for all data models
- **Mock Data**: Realistic sample data for development and demonstration
- **State Management**: Efficient React hooks and context for state management
- **Search & Filter**: Advanced filtering capabilities across all modules

### Performance Optimizations
- **Next.js 15**: Latest framework with optimized rendering and routing
- **Tailwind CSS v4**: Utility-first CSS with optimal build output
- **Component Architecture**: Reusable components for consistent performance
- **Code Splitting**: Automatic code splitting for optimal loading

## 🗂️ Current Data Overview

### Drivers (23 Total)
- **20 Active** drivers currently assigned to routes
- **2 In Training** drivers completing certification
- **1 OOS** (Out of Service) driver

### Fleet Management
- **Truck Numbering**: Professional system (2812-2856A)
- **Automatic Transmission**: Trucks marked with 'A' suffix
- **Maintenance Tracking**: Scheduled maintenance alerts
- **Assignment Management**: Driver-truck assignment tracking

### Load Operations
- **Today's Loads**: 26 active loads requiring attention
- **Tomorrow's Schedule**: 32 scheduled loads
- **Total Load Database**: 98 loads in system
- **Event Tracking**: Comprehensive event logging

## 🔄 Git Workflow

This project follows a feature branch workflow:

```bash
# For new features
git checkout master
git pull origin master
git checkout -b feature/your-feature-name
# ... develop feature ...
git checkout master
git merge feature/your-feature-name
git push origin master

# For quick fixes
git checkout master
# ... make changes ...
git commit -m "fix: describe the fix"
git push origin master
```

## 📚 Documentation

- **[Git Workflow](./notes/git-workflow.md)** - Detailed Git workflow and branching strategy
- **[Development Setup](./notes/development-setup.md)** - Complete development environment setup
- **[Data Models](./notes/data-models.md)** - TypeScript interfaces and data structures
- **[Project Requirements](./notes/project-requirements.md)** - Original project specifications

## 🚀 Future Enhancements

### Planned Features
- **Real-time Updates**: WebSocket integration for live status updates
- **PWA Capabilities**: Offline functionality and push notifications
- **Advanced Analytics**: Comprehensive reporting dashboard
- **API Integration**: Backend data synchronization
- **Role-based Access**: User authentication and permissions
- **Mobile App**: React Native deployment option

### Integration Opportunities
- **Fleet Management Systems**: Integration with existing trucking software
- **GPS Tracking**: Real-time vehicle location tracking
- **Electronic Logging**: DOT compliance and logging integration
- **Route Optimization**: AI-powered route planning
- **Document Management**: Digital document storage and retrieval

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'feat: Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👨‍💻 Developer

**rlvwebdev** - [GitHub Profile](https://github.com/rlvwebdev)

## 🙏 Acknowledgments

- **Next.js Team** - For the excellent React framework
- **Tailwind Labs** - For the utility-first CSS framework
- **Lucide** - For the beautiful icon library
- **Vercel** - For hosting and deployment platform

---

**Built with ❤️ for the transportation industry**

*Launch represents the future of transportation management - mobile-first, user-friendly, and built to propel the modern logistics industry forward.*
