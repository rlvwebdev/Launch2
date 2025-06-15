<!-- Use this file to provide workspace-specific custom instructions to Copilot. For more details, visit https://code.visualstudio.com/docs/copilot/copilot-customization#_use-a-githubcopilotinstructionsmd-file -->

# TMOps - Trucking Management Operations

## Project Context
This is a mobile-first web application for managing trucking operations built with Next.js 15, TypeScript, and Tailwind CSS v4.

## Architecture Guidelines
- Use Next.js App Router with TypeScript
- Implement mobile-first responsive design
- Follow component-based architecture
- Use Tailwind CSS v4 for styling
- Implement proper TypeScript interfaces for all data models

## Core Features
- **Driver Management**: Manage driver information and truck assignments
- **Truck Management**: Track vehicle details and maintenance
- **Load Management**: Monitor loads with status tracking and event history  
- **Settings**: Application configuration and preferences

## Mobile-First Design Requirements
- Bottom navigation with 4 main sections: Drivers, Trucks, Loads, Settings
- Touch-friendly interfaces with minimum 44px touch targets
- Responsive design that scales to desktop with dashboard view
- Progressive Web App capabilities

## Data Models
Use the TypeScript interfaces defined in `/notes/data-models.md` for:
- Driver: Personal info, licensing, assignments, status
- Truck: Vehicle details, maintenance records, assignments
- Load: Origin/destination, cargo details, status, event history

## Code Style
- Use functional components with React hooks
- Implement proper error boundaries and loading states
- Follow accessibility best practices (WCAG 2.1)
- Use semantic HTML elements
- Implement proper TypeScript typing (avoid `any`)

## Git Workflow
- Follow the branching strategy outlined in `/notes/git-workflow.md`
- Use conventional commit messages
- Create feature branches from `develop`
- Require code reviews before merging

## Testing Strategy
- Write unit tests for utilities and hooks
- Implement integration tests for critical user flows
- Test mobile responsiveness across device sizes
- Validate accessibility with screen readers

## Performance Considerations
- Optimize for mobile networks and slower devices
- Implement proper loading states and error handling
- Use Next.js image optimization
- Consider offline capabilities for mobile users

## Dependencies
- **Core**: React 19, Next.js 15.3.3, TypeScript
- **Styling**: Tailwind CSS v4
- **Icons**: Lucide React
- **UI**: Headless UI components
- **Utilities**: clsx for conditional classes
