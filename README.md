# TMOps - Trucking Management Operations

A mobile-first web application for managing trucking operations including drivers, trucks, loads, and operational settings.

## 🚛 Features

- **Driver Management**: Manage driver information and truck assignments
- **Truck Management**: Track truck details, maintenance, and assignments  
- **Load Management**: Monitor loads with status tracking and event history
- **Settings**: Application configuration and preferences
- **Mobile-First Design**: Optimized for mobile devices with desktop dashboard view
- **Event Tracking**: Historic records of load events (spills, contamination, NCR, etc.)

## 🛠️ Tech Stack

- **Frontend**: Next.js 14 with TypeScript
- **Styling**: Tailwind CSS
- **State Management**: React Context / Zustand (TBD)
- **Database**: Local Storage (initially), PostgreSQL (planned)
- **UI Components**: Custom components with Headless UI
- **Icons**: Lucide React

## 🏗️ Project Structure

```
TMOps/
├── notes/                          # Project documentation
│   ├── project-requirements.md     # Project requirements and features
│   ├── development-setup.md        # Setup instructions
│   ├── data-models.md             # TypeScript interfaces
│   └── git-workflow.md            # Team Git workflow
├── src/                           # Next.js app source (to be created)
│   ├── app/                       # App Router pages
│   ├── components/                # Reusable components
│   ├── lib/                       # Utilities and helpers
│   └── types/                     # TypeScript type definitions
└── public/                        # Static assets
```

## 🎯 Navigation Structure

Mobile-first bottom navigation with four main sections:
- **Drivers** - Driver management and assignments
- **Trucks** - Vehicle information and maintenance
- **Loads** - Load tracking and event history
- **Settings** - Configuration and preferences

## 👥 Team Workflow

This project follows a Git flow optimized for a 3-person development team:
- **Main Branch**: Production-ready code
- **Develop Branch**: Integration and staging
- **Feature Branches**: Individual development work

See [Git Workflow](./notes/git-workflow.md) for detailed branching strategy.

## 🚀 Getting Started

```bash
# Clone the repository
git clone <repository-url>
cd TMOps

# Install dependencies (after Next.js setup)
npm install

# Start development server
npm run dev
```

## 📱 Mobile-First Design

- Touch-friendly interface with minimum 44px touch targets
- Bottom navigation optimized for thumb accessibility
- Responsive design that scales to desktop with dashboard view
- Progressive Web App capabilities for native-like mobile experience

## 🔄 Development Status

- [x] Project initialization and Git setup
- [x] Requirements documentation
- [x] Data models and TypeScript interfaces
- [x] Git workflow for team collaboration
- [ ] Next.js application scaffolding
- [ ] UI component library setup
- [ ] Mobile navigation implementation
- [ ] Driver management features
- [ ] Truck management features
- [ ] Load management and event tracking
- [ ] Settings and configuration
- [ ] Testing and deployment

## 📋 Data Models

### Core Entities
- **Driver**: Personal info, licensing, truck assignments, status
- **Truck**: Vehicle details, maintenance records, assignments
- **Load**: Origin/destination, cargo details, status, event history

See [Data Models](./notes/data-models.md) for complete TypeScript interfaces.

## 🤝 Contributing

1. Create feature branch from `develop`
2. Make changes following project conventions
3. Submit pull request with detailed description
4. Require code review before merging

## 📄 License

This project is proprietary and confidential.

---

**TMOps Team** - Streamlining trucking operations one load at a time 🚛
