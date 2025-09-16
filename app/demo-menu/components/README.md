# Demo Menu Components

This directory contains the modular components for the demo menu page. The components are designed to be reusable and maintainable.

## Component Structure

### Core Components

- **`LoadingScreen`** - Handles the loading state with Lottie animation
- **`AnimatedBackground`** - Manages GSAP animations for background blobs
- **`Header`** - Displays the restaurant title and subtitle
- **`FilterBar`** - Handles filter buttons for menu items
- **`DailyMenu`** - Shows the special daily menu with spotlight effect
- **`MenuItem`** - Individual menu item with animations and tags
- **`MenuCategory`** - Category section with its items

### Types

All TypeScript interfaces are centralized in `../types/index.ts` for consistency across components.

### Benefits of Modularization

1. **Reusability** - Components can be easily reused in other parts of the application
2. **Maintainability** - Each component has a single responsibility
3. **Testability** - Individual components can be tested in isolation
4. **Readability** - The main page is now much cleaner and easier to understand
5. **Scalability** - New features can be added by creating new components

### Usage

```tsx
import {
  LoadingScreen,
  Header,
  FilterBar,
  DailyMenu,
  MenuCategory,
} from "./components";

// Use components with props
<Header
  title="🍽️ Restaurant Name"
  subtitle="Digital menu · Updated instantly"
/>;
```

### Props Interface

Each component has a well-defined props interface that makes it clear what data is required and what can be customized.
