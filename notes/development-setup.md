# Development Setup Instructions

## Initial Project Setup

### 1. Create Next.js Application
```bash
npx create-next-app@latest trucking-app --typescript --tailwind --app --use-npm
cd trucking-app
```

### 2. Install Additional Dependencies
```bash
npm install lucide-react @headlessui/react
npm install -D @types/node
```

### 3. Project Structure
```
tmops/
├── app/
│   ├── drivers/
│   ├── trucks/
│   ├── loads/
│   ├── settings/
│   ├── components/
│   │   ├── ui/
│   │   ├── navigation/
│   │   └── layout/
│   ├── lib/
│   ├── types/
│   └── data/
├── public/
└── styles/
```

### 4. Key Components to Create
- [ ] Bottom Navigation Component
- [ ] Layout Component
- [ ] Driver Management Components
- [ ] Truck Management Components
- [ ] Load Management Components
- [ ] Settings Components

### 5. Mobile-First Considerations
- Use Tailwind's mobile-first breakpoints
- Touch-friendly button sizes (min 44px)
- Optimize for thumb navigation
- Consider PWA manifest for app-like experience
