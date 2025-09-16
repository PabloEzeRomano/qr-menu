# AnimatedBackground Component

This folder contains the organized AnimatedBackground component with separated concerns.

## Structure

- **`index.tsx`** - Main component that renders the animated background
- **`animationConfig.ts`** - All GSAP animation configurations and timelines
- **`index.ts`** - Export file for clean imports

## Benefits of This Organization

### **1. Separation of Concerns**

- **Component logic** is separate from **animation configuration**
- **Easier to maintain** and modify animations
- **Cleaner component code** focused on rendering

### **2. Animation Configuration (`animationConfig.ts`)**

- **Blob animations**: Floating, morphing, rotation, and scaling effects
- **Particle animations**: 20 particles with unique movement patterns
- **Reusable functions**: Can be imported and used elsewhere
- **Easy to modify**: Change animation parameters in one place

### **3. Main Component (`index.tsx`)**

- **Clean and focused**: Only handles rendering and lifecycle
- **Imports configurations**: Uses the separated animation functions
- **Proper cleanup**: Manages timeline cleanup on unmount

### **4. Usage**

```tsx
import { AnimatedBackground } from "./components";

// The component automatically uses the animation configurations
<AnimatedBackground />;
```

## Animation Features

- **3 organic blobs** with complex movement patterns
- **20 floating particles** with unique paths
- **Morphing effects** that change blob shapes
- **Rotation and scaling** for organic movement
- **Fade effects** when animations complete
- **MotionPath plugin** for complex particle paths

## Customization

To modify animations, edit `animationConfig.ts`:

- Change durations, easing, and movement patterns
- Add new particle animations
- Modify blob behaviors
- Adjust timing and delays
