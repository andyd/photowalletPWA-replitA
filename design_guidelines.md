# Photo Wallet PWA - Design Guidelines

## Design Approach

**Reference-Based Approach**: Drawing inspiration from Apple Photos' content-first minimalism and Instagram's gesture-based viewing, combined with the intimate, personal feel of a physical wallet. The design prioritizes photo content over UI chrome, creating an emotional, tactile experience.

## Core Design Principles

1. **Content Supremacy**: Photos are always the hero - UI elements fade into the background
2. **Tactile Intimacy**: Every interaction should feel physical and satisfying
3. **Privacy by Design**: Visual cues reinforce local-only storage and security
4. **Effortless Navigation**: Gestures feel natural, like flipping through physical photos

## Color Palette

### Dark Mode (Primary)
- **Background**: 0 0% 8% (deep charcoal, not pure black for reduced eye strain)
- **Surface**: 0 0% 12% (photo grid cards, elevated elements)
- **Surface Elevated**: 0 0% 16% (modals, overlays)
- **Border/Divider**: 0 0% 20% (subtle separation)
- **Text Primary**: 0 0% 98% (high contrast for readability)
- **Text Secondary**: 0 0% 65% (metadata, captions)
- **Accent**: 210 100% 60% (soft blue for CTAs, trust indicator)
- **Danger**: 0 85% 60% (delete actions)

### Photo Viewer Overlay
- **Backdrop**: 0 0% 5% at 95% opacity (nearly black for photo focus)
- **UI Chrome**: White with 20% opacity when active, fades to 5% opacity

## Typography

**Font Stack**: System fonts for optimal performance and native feel
- **Primary**: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif
- **Display (Headers)**: 600 weight, tracking tight (-0.02em)
- **Body**: 400 weight, line-height 1.5
- **Caption/Metadata**: 400 weight, 0.875rem, tracking wide (0.01em)

**Sizing Scale**:
- Display: 2rem (mobile), 2.5rem (desktop)
- Headline: 1.5rem
- Body: 1rem
- Small: 0.875rem
- Tiny: 0.75rem

## Layout System

**Spacing Primitives**: Tailwind units of 2, 4, 8, 12, 16 for consistent rhythm
- Tight spacing: p-2, gap-2 (8px)
- Standard spacing: p-4, gap-4 (16px)
- Generous spacing: p-8, gap-8 (32px)
- Section spacing: py-12, py-16 (48-64px)

**Container Widths**:
- Mobile: Full width with px-4 padding
- Desktop: max-w-6xl centered

**Grid System**:
- Mobile: 2-column photo grid (grid-cols-2, gap-4)
- Tablet: 3-column (md:grid-cols-3)
- Desktop: 4-column (lg:grid-cols-4)

## Component Library

### Home Screen Header
- App title: Display size, 600 weight
- Tagline: Body size, secondary color, max-w-lg
- Photo counter: Badge style (e.g., "5/10") with accent color, absolute positioned top-right

### Photo Grid Cards
- Aspect ratio: 1:1 square thumbnails
- Border radius: rounded-xl (12px)
- Shadow: Subtle elevation (shadow-lg)
- Hover state: scale-105 transform, shadow-xl
- Overlay: Gradient from transparent to 20% black at bottom for metadata

### Photo Upload Button
- **Primary FAB**: Fixed bottom-right, rounded-full, w-14 h-14
- Background: Accent color with shadow-2xl
- Icon: Plus symbol, white, size-6
- Hover: scale-110 with increased shadow
- **Empty State**: Centered card with dashed border, p-12, upload icon, "Add Your First Photo" text

### Full-Screen Photo Viewer
- **Background**: Backdrop color at 95% opacity
- **Photo Container**: Centered, max dimensions respect safe areas
- **Navigation UI**: 
  - Top bar: Close button (X icon) top-left, photo index "3 of 5" top-center
  - Fade-in/out: opacity-0 to opacity-100, transition-all duration-300
  - Auto-hide: After 3 seconds of inactivity
- **Zoom Indicators**: Scale factor overlay (e.g., "2.0x") fades in briefly

### Delete Interaction
- Swipe gesture reveals red background with trash icon
- Confirmation modal: rounded-2xl, p-6, backdrop-blur-md
- Buttons: "Cancel" (ghost), "Delete" (danger solid)

### Loading States
- Photo grid skeleton: Shimmer effect on rounded-xl boxes
- Upload progress: Circular progress indicator, accent color
- Viewer transition: Fade + scale animation (300ms ease-out)

## Animations & Gestures

**Motion Philosophy**: Physics-based, responsive, never gratuitous

### Transitions
- Page changes: Fade + subtle slide (200ms)
- Photo grid hover: Transform scale (150ms ease-out)
- Viewer open/close: Scale from thumbnail position (400ms spring)
- Swipe navigation: Drag-based with momentum (native feel)

### Gesture Feedback
- Pinch zoom: Real-time scale with smooth spring physics
- Swipe threshold: 50px drag distance or 0.3 velocity to trigger
- Double-tap: Instant zoom toggle with 250ms easing
- Haptic feedback (where supported): Light on tap, medium on action

## Images

**Hero Section**: Not applicable - photos themselves are the hero content

**Photo Thumbnails**: 
- Generated from user uploads
- Displayed in responsive grid
- Each thumbnail: 300x300px optimized (client-side compression)
- Lazy loading: Intersection observer for off-screen photos

**Empty State Illustration**: 
- Simple line-art icon of a wallet with photo slots
- Monochrome (matches text secondary color)
- Size: 80px, centered above CTA

## Accessibility & Polish

- Minimum touch targets: 44x44px for all interactive elements
- Focus indicators: 2px accent color ring on keyboard focus
- Skip to content: Hidden link for screen readers
- Alt text: Use filenames as fallback, allow custom captions
- Safe areas: Respect iOS notch, Android navigation (env() variables)
- Reduced motion: Disable animations if prefers-reduced-motion

## PWA-Specific Design

**Install Prompt**: 
- Toast notification at bottom, rounded-t-2xl
- Message: "Add Photo Wallet to your home screen"
- Buttons: "Install" (accent), "Not now" (ghost)

**Splash Screen**:
- Background: Deep charcoal (matches app)
- Logo: Wallet icon with "Photo Wallet" text
- Monochrome theme for brand consistency

**Offline Indicator**:
- Subtle banner at top when offline: "Viewing cached photos"
- Background: surface elevated, accent left border

This design creates an intimate, tactile experience that honors the emotional value of cherished photos while leveraging modern web capabilities.