# Terminal Selector Enhancement

## Overview
Enhanced the page header terminal selector to be styled like the sidebar navigation with improved visual design and user experience.

## New Header Variant

### Design Features
- **Sidebar-inspired styling**: Matches the dark theme and visual hierarchy of the sidebar navigation
- **Enhanced visual feedback**: Improved hover states, transitions, and shadows
- **Status indicators**: Color-coded terminal operational status with visual indicators
- **Accessible design**: Proper ARIA labels, keyboard navigation, and focus states

### Key Improvements

#### Visual Design
- ✅ Dark theme background using `--theme-primary` color
- ✅ White text with proper opacity levels for hierarchy
- ✅ Smooth transitions and hover effects
- ✅ Shadow effects for depth and interactivity
- ✅ Rounded corners consistent with modern UI design

#### Interactive Features
- ✅ Hover states with enhanced visual feedback
- ✅ Smooth dropdown animation with backdrop blur
- ✅ Active terminal highlighting with accent border
- ✅ Chevron rotation animation for open/close state
- ✅ Click outside to close functionality

#### Information Display
- ✅ Terminal name prominently displayed
- ✅ Terminal code and operational status shown
- ✅ Color-coded status indicators (operational, maintenance, limited, closed)
- ✅ Optional location coordinates display
- ✅ Check mark for currently selected terminal

## Implementation Details

### Component Structure
```tsx
// New header variant in TerminalSelector.tsx
variant: 'header' | 'full' | 'compact'
```

### Styling Classes
- **Button**: `bg-[var(--theme-primary)]` with white text and borders
- **Dropdown**: Matching background with shadow and backdrop effects
- **Items**: Hover states with `--theme-secondary` background
- **Active item**: Accent border using `--theme-accent` color
- **Status indicators**: Color-coded dots with proper borders

### Page Header Integration
- Updated `PageHeader.tsx` to use `variant="header"`
- Improved spacing and alignment
- Better mobile responsive behavior
- Enhanced label text ("Terminal:" instead of "Viewing:")

## Status Color Mapping
- 🟢 **Operational**: Green indicator - normal operations
- 🟡 **Maintenance**: Yellow indicator - scheduled maintenance
- 🟠 **Limited**: Orange indicator - limited operations
- 🔴 **Closed**: Red indicator - terminal closed
- ⚪ **Unknown**: Gray indicator - status unknown

## User Experience Improvements

### Desktop Experience
- Prominent terminal selector in page header
- Consistent with sidebar navigation styling
- Clear visual hierarchy and status information
- Smooth animations and hover feedback

### Mobile Experience
- Full-width selector in mobile header
- Touch-friendly interface with proper spacing
- Responsive design maintains functionality
- Clear terminal selection on smaller screens

### Accessibility
- Proper ARIA labels and roles
- Keyboard navigation support
- High contrast for status indicators
- Screen reader friendly terminal descriptions

## Integration Points

### OrganizationalContext
- `getAccessibleOrganizations()`: Gets user's available terminals
- `switchOrganization()`: Changes active terminal context
- `currentOrganization`: Current terminal selection

### Theme System
- Uses CSS custom properties for consistent theming
- Matches sidebar color scheme and styling
- Supports both light and dark themes

### Data Filtering
- Terminal selection affects data shown on all pages
- Drivers, trucks, trailers, and loads filtered by selected terminal
- Consistent data context throughout application

## Testing Checklist
- ✅ Header variant renders correctly in page header
- ✅ Dropdown opens/closes with proper animations
- ✅ Terminal switching works correctly
- ✅ Status indicators display with correct colors
- ✅ Mobile responsive design functions properly
- ✅ Accessibility features work with screen readers
- ✅ Styling matches sidebar navigation theme
- ✅ No compilation errors or TypeScript issues

## Future Enhancements
- **Search functionality**: Add search/filter within terminal list
- **Favorites**: Allow users to mark frequently used terminals
- **Recent terminals**: Show recently accessed terminals at top
- **Keyboard shortcuts**: Add hotkeys for quick terminal switching
- **Bulk operations**: Multi-terminal operations for admin users
