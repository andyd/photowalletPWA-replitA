# Photo Wallet - Complete UX Design System

**Version 1.0 | Mobile-First PWA | Dark Mode Only**

---

## 📱 Project Overview

**Product Name:** Photo Wallet

**Tagline:** Photos at your fingertips, like dad had in his wallet back in the day.

**Purpose:** Recreate the intimate experience of sharing personal photos from a physical wallet. Users curate a small, meaningful collection (max 12 photos) for instant, full-screen sharing with friends and family—combining nostalgia with modern mobile convenience.

**Platform:** Progressive Web App (PWA) - iOS, Android, Mobile Web only

**Target Audience:** Personal users wanting warm, happy connection to family through photo sharing

---

## 🎯 Brand Principles

### Core Values
- **Minimal** - UI gets out of the way, photos are the hero
- **Modern** - Snappy, responsive, slick animations
- **Retro/Nostalgic** - Film-inspired colors, wallet metaphor
- **Intimate** - Small curated collection, personal connection

### Brand Voice
- Friendly but minimal
- Simple, cool, funny (especially in errors)
- Not lame, not slow, not corporate

### Emotional Goal
**Primary emotion:** Warm happy connection to family
**Interaction feeling:** Natural, physical, intuitive

---

## 🎨 Color System

### Philosophy
**Dark canvas, photos as focus.** Black background keeps UI out of the way. When colors appear, they're retro film-inspired accents.

### Core Palette

```
Primary Background
--color-bg-primary: #000000        /* Pure black canvas */
--color-bg-secondary: #0A0A0A      /* Slightly elevated black */
--color-bg-tertiary: #1A1A1A       /* Modal/card backgrounds */

Text Colors
--color-text-primary: #FFFFFF      /* Primary text */
--color-text-secondary: #A0A0A0    /* Secondary/dimmed text */
--color-text-tertiary: #666666     /* Disabled/placeholder */

Accent Colors (Retro Film-Inspired)
--color-accent-warm: #E6A157       /* Warm amber (70s film) */
--color-accent-red: #C44536        /* Faded red (Kodachrome) */
--color-accent-teal: #4A9B9B       /* Vintage teal */
--color-accent-cream: #F4E8D8      /* Photo paper cream */

Interactive States
--color-interactive: #FFFFFF       /* Tap targets */
--color-interactive-dimmed: #666   /* Inactive */
--color-loading: #333333           /* Pulsing placeholder */

Semantic Colors (Use sparingly)
--color-error: #C44536            /* Error states */
--color-success: #4A9B9B          /* Success moments */
```

### Usage Guidelines
- **Background:** Always pure black (#000000)
- **Photos:** No overlays, filters, or tints - content is king
- **Icons:** White (#FFFFFF) on black
- **Accents:** Use retro colors sparingly for moments that need emphasis
- **No gradients:** Keep flat and clean

---

## ✍️ Typography System

### Font Stack

**Primary Font:** System Sans-Serif
```css
font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto',
             'Helvetica Neue', Arial, sans-serif;
```

**Why:** Native system fonts ensure fast load, familiar feel, optimal mobile rendering

**Alternative:** If custom font desired, consider:
- **Modern:** Inter, SF Pro Display, Helvetica Now
- **Retro:** Neue Haas Grotesk, Futura PT, Space Grotesk

### Type Scale

```css
/* Hierarchy */
--font-size-h1: 32px;      /* Empty state headline */
--font-size-h2: 24px;      /* Modal titles */
--font-size-body: 16px;    /* Default text */
--font-size-caption: 14px; /* Small labels */
--font-size-label: 12px;   /* Micro-copy */

/* Weights */
--font-weight-regular: 400;
--font-weight-medium: 500;
--font-weight-bold: 700;

/* Line Heights */
--line-height-tight: 1.2;   /* Headlines */
--line-height-normal: 1.5;  /* Body */
--line-height-loose: 1.7;   /* Comfortable reading */

/* Letter Spacing */
--letter-spacing-tight: -0.02em;   /* Large headlines */
--letter-spacing-normal: 0em;      /* Default */
--letter-spacing-wide: 0.05em;     /* All caps labels */
```

### Typography Rules
- **Minimal text:** Only show when necessary or when app is tapped
- **Larger when needed:** Make text big and clear when it appears, then hide it
- **No text on photos:** Zero UI or captions on fullscreen images
- **System optimized:** Use platform defaults for maximum legibility

---

## 📐 Layout & Grid System

### Grid Philosophy
**Mobile-first, gesture-driven, fullscreen focus**

### Grid View Specifications

```
Layout: 3 columns × 4 rows (max 12 photos)
Column width: (100vw - 32px) / 3
Gap: 8px between thumbnails
Padding: 16px edge margins
Thumbnail aspect: 1:1 (square)
Corner radius: 2-3px (subtle)
```

**Thumbnail Grid CSS:**
```css
.photo-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 8px;
  padding: 16px;
  background: #000000;
}

.photo-thumbnail {
  aspect-ratio: 1;
  border-radius: 3px;
  overflow: hidden;
  cursor: pointer;
  /* No borders or shadows */
}
```

### Fullscreen Carousel

```
Layout: 100vw × 100vh (edge-to-edge)
Navigation: Horizontal swipe (snap scroll)
Image spacing: 4px gap between images (minimal)
Snap behavior: Center-aligned, one image at a time
```

**Carousel CSS:**
```css
.photo-carousel {
  display: flex;
  width: 100vw;
  height: 100vh;
  overflow-x: scroll;
  scroll-snap-type: x mandatory;
  scroll-behavior: smooth;
  gap: 4px; /* Minimal space to see next image edge */
  background: #000000;
}

.photo-slide {
  flex: 0 0 100vw;
  scroll-snap-align: center;
  display: flex;
  align-items: center;
  justify-content: center;
}

.photo-slide img {
  max-width: 100%;
  max-height: 100%;
  object-fit: contain;
}
```

### Touch Targets
**All interactive elements minimum 44×44px**

```css
--touch-target-min: 44px;
--touch-target-comfortable: 56px;
--touch-target-large: 64px;
```

### Spacing Scale

```css
/* 4px base unit */
--space-xs: 4px;
--space-sm: 8px;
--space-md: 16px;
--space-lg: 24px;
--space-xl: 32px;
--space-2xl: 48px;
```

---

## 🧩 Component Library

### Top Bar (Grid View Only)

**Position:** Fixed top
**Background:** Subtle gradient fade to black (optional) or transparent
**Height:** 56px
**Content:** Settings icon (left), Add icon (right)

```html
<header class="top-bar">
  <button class="icon-button" aria-label="Settings">
    <svg><!-- Gear icon --></svg>
  </button>
  <button class="icon-button" aria-label="Add photos">
    <svg><!-- Plus icon --></svg>
  </button>
</header>
```

```css
.top-bar {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  height: 56px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 16px;
  z-index: 100;
  background: transparent; /* or subtle gradient */
}

.icon-button {
  width: 44px;
  height: 44px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: transparent;
  border: none;
  color: #FFFFFF;
  cursor: pointer;
  transition: opacity 200ms ease;
}

.icon-button:active {
  opacity: 0.6;
}

.icon-button svg {
  width: 24px;
  height: 24px;
  stroke: currentColor;
  stroke-width: 2;
}
```

**Icons:**
- Settings: Simple gear icon (outlined)
- Add: Simple plus icon (outlined)
- Style: 2px stroke, minimal line icons

---

## ⚡ Animation System

### Philosophy
**Natural, physical, snappy. Animations feel real and responsive, never sluggish.**

### Timing & Easing

```css
/* Durations */
--duration-instant: 100ms;
--duration-fast: 150ms;
--duration-normal: 200ms;
--duration-slow: 300ms;

/* Easing curves */
--ease-out: cubic-bezier(0.33, 1, 0.68, 1);        /* Snappy exit */
--ease-in-out: cubic-bezier(0.65, 0, 0.35, 1);     /* Smooth both ways */
--ease-spring: cubic-bezier(0.34, 1.56, 0.64, 1);  /* Subtle bounce */
```

---

## 💬 Content & Microcopy

### Voice & Tone
- **Friendly but minimal:** Say just enough
- **Simple, cool, funny:** Especially for errors
- **No jargon:** Clear and direct

### Key Messages

**Empty State:**
```
Photo Wallet
Photos at your fingertips, like dad had in his wallet back in the day.

[Add Photos]
```

**Wallet Full (12/12):**
```
Your wallet is full, remove photos to add others.
```

**Error States:**
```
// Failed to load
"Oops, that photo didn't want to be in your wallet."

// Upload failed
"Hmm, that one's camera-shy. Try another?"

// Generic error
"Something went sideways. Give it another shot?"
```

---

## 🛠️ Design Tokens (Dev Handoff)

### Color Tokens
```json
{
  "color": {
    "background": {
      "primary": "#000000",
      "secondary": "#0A0A0A",
      "tertiary": "#1A1A1A"
    },
    "text": {
      "primary": "#FFFFFF",
      "secondary": "#A0A0A0",
      "tertiary": "#666666"
    },
    "accent": {
      "warm": "#E6A157",
      "red": "#C44536",
      "teal": "#4A9B9B",
      "cream": "#F4E8D8"
    },
    "interactive": "#FFFFFF",
    "loading": "#333333"
  }
}
```

### Spacing Tokens
```json
{
  "spacing": {
    "xs": "4px",
    "sm": "8px",
    "md": "16px",
    "lg": "24px",
    "xl": "32px",
    "2xl": "48px"
  }
}
```

### Typography Tokens
```json
{
  "typography": {
    "fontSize": {
      "h1": "32px",
      "h2": "24px",
      "body": "16px",
      "caption": "14px",
      "label": "12px"
    },
    "fontWeight": {
      "regular": 400,
      "medium": 500,
      "bold": 700
    },
    "lineHeight": {
      "tight": 1.2,
      "normal": 1.5,
      "loose": 1.7
    }
  }
}
```

### Animation Tokens
```json
{
  "animation": {
    "duration": {
      "instant": "100ms",
      "fast": "150ms",
      "normal": "200ms",
      "slow": "300ms"
    },
    "easing": {
      "out": "cubic-bezier(0.33, 1, 0.68, 1)",
      "inOut": "cubic-bezier(0.65, 0, 0.35, 1)",
      "spring": "cubic-bezier(0.34, 1.56, 0.64, 1)"
    }
  }
}
```

---

## 📄 Version History

**v1.0** - Initial design system
- Core brand, colors, typography
- Grid + carousel specifications
- Animation system
- Component library
- Content guidelines

---

**Design System Owner:** Photo Wallet Team
**Last Updated:** 2025
**Status:** Ready for Development

---

**End of Design System**
