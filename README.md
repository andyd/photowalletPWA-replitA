# Photo Wallet PWA

<div align="center">

![Photo Wallet](https://img.shields.io/badge/Photo-Wallet-blue?style=for-the-badge)
![React](https://img.shields.io/badge/React-18.3-61dafb?style=for-the-badge&logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5.6-3178c6?style=for-the-badge&logo=typescript)
![PWA](https://img.shields.io/badge/PWA-Ready-5A0FC8?style=for-the-badge)
![Tests](https://img.shields.io/badge/Tests-115+-success?style=for-the-badge)

**The photos you want with you all the time**

[Live Demo](#) | [Documentation](#documentation) | [Testing](#testing)

</div>

---

## 📸 Overview

Photo Wallet PWA is a privacy-focused Progressive Web App that recreates the experience of carrying cherished photos in a physical wallet. Store up to 18 photos locally on your device with beautiful full-screen viewing and intuitive gesture controls.

### ✨ Key Features

- 📱 **18-Photo Wallet** - Curated collection of your favorite photos
- 🗄️ **Overflow Folder** - Unlimited archive for removed photos
- 🔒 **Privacy First** - All photos stored locally, never leave your device
- 💨 **Lightning Fast** - Optimized thumbnails and responsive grid
- 👆 **Gesture Controls** - Swipe, pinch, zoom like native apps
- 🌙 **Dark Mode** - Beautiful theme optimized for photos
- 📵 **Offline Ready** - Full PWA with service worker
- 🎨 **Responsive Design** - Dynamic grid adapts to any screen size

---

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Installation

```bash
# Clone the repository
git clone https://github.com/andyd/photowallet1025.git
cd photowallet1025/photowalletPWA-replitA

# Install dependencies
npm install

# Start development server
npm run dev

# Open browser to http://localhost:5000
```

### Development Commands

```bash
# Development server (port 5000)
npm run dev

# Type checking
npm run check

# Run tests
npm test

# Run tests once
npm run test:run

# Generate coverage
npm run test:coverage

# Production build
npm run build

# Start production server
npm start
```

---

## 🏗️ Architecture

### Technology Stack

**Frontend:**
- React 18.3 + TypeScript 5.6
- Vite 5.4 (build tool)
- Tailwind CSS 3.4 (styling)
- Zustand 5.0 (state management)
- Framer Motion 11.13 (animations)
- shadcn/ui (component library)

**Storage:**
- Dexie.js 4.2 (IndexedDB wrapper)
- Local-first architecture
- No server-side storage

**PWA:**
- Service Worker (offline support)
- Web App Manifest
- Install prompts
- Workbox 7.3

**Gestures:**
- @use-gesture/react 10.3
- Pinch, swipe, zoom support

### Project Structure

```
photowalletPWA-replitA/
├── client/              # React frontend
│   ├── src/
│   │   ├── components/  # UI components
│   │   ├── hooks/       # Custom hooks
│   │   ├── pages/       # Route pages
│   │   ├── services/    # Data services
│   │   ├── utils/       # Utilities
│   │   └── test/        # Test infrastructure
│   └── public/          # Static assets
├── server/              # Express backend (minimal)
├── shared/              # Shared TypeScript types
├── documents/           # Documentation
└── .github/             # GitHub Actions CI/CD
```

---

## 🎮 Features

### Photo Management
- **Upload** - Multi-select from device
- **View** - Full-screen with gestures
- **Organize** - Reorder and manage
- **Archive** - Overflow folder for unlimited storage
- **Delete** - Move to overflow or permanently delete

### Viewing Experience
- **Gestures:**
  - Swipe left/right → Navigate photos
  - Swipe down → Close viewer
  - Pinch → Zoom (1x-3x)
  - Double-tap → Toggle zoom
  - Tap → Show/hide UI controls
- **UI:**
  - Clean, minimal interface
  - Auto-hiding controls
  - Centered photo display
  - Photo counter and index

### Smart Features
- **Dynamic Grid** - Adapts to screen size (2-8 columns)
- **Duplicate Detection** - SHA-256 hash comparison
- **Auto-Archive** - Oldest photos when wallet fills
- **Thumbnail Generation** - 400x400px optimized previews
- **Responsive Design** - Works on any device

### PWA Capabilities
- **Offline First** - Works without internet
- **Installable** - Add to home screen
- **Fast Loading** - App shell architecture
- **Background Sync** - Updates when online

---

## 🧪 Testing

### Test Suite

**115+ comprehensive tests** covering:
- Component functionality
- Hook behavior
- Utility functions
- Integration workflows
- Edge cases and errors

```bash
# Run all tests
npm test

# Run with coverage
npm run test:coverage

# Visual test UI
npm run test:ui
```

### Documentation
- [Testing Quick Start](./TESTING-QUICK-START.md)
- [Complete Test Guide](./TEST-GUIDE.md)
- [Test Checklist](./TEST-CHECKLIST.md)
- [Testing Overview](./README-TESTING.md)

### CI/CD
GitHub Actions automatically runs tests on:
- Push to main/develop
- Pull requests
- Coverage reports uploaded to Codecov

---

## 📖 Documentation

### User Guides
- [App Specification](./documents/app-specification.md)
- [Design Guidelines](./design_guidelines.md)
- [Gap Analysis](./documents/gap-analysis.md)
- [Changelog](./documents/changelog-2025-10-08.md)

### Developer Guides
- [CLAUDE.md](./CLAUDE.md) - Development guide for AI
- [Replit Guide](./replit.md) - Architecture overview
- [UX Design System](./documents/UX-DESIGN-SYSTEM.md)

### Design Resources
- [Figma Design Spec](../FIGMA_DESIGN_SPEC.md)
- [Figma Components](../FIGMA_COMPONENTS_SPEC.md)
- [Design System](../FIGMA_DESIGN_SYSTEM.md)
- [Quick Start Guide](../FIGMA_QUICK_START.md)

---

## 🎨 Design System

### Color Palette
- **Dark Mode Primary** - Deep charcoal (HSL: 0 0% 8%)
- **Accent** - Soft blue (HSL: 210 100% 60%)
- **Destructive** - Red (HSL: 0 85% 60%)

### Typography
- **System Fonts** - Native feel
- **Display:** 2.5rem-3.5rem
- **Body:** 1rem
- **Small:** 0.875rem

### Layout
- **Grid:** Dynamic 2-8 columns
- **Spacing:** 8px gap
- **Padding:** 16px standard
- **Border Radius:** 12px on cards

---

## 🔒 Privacy & Security

### Privacy Guarantees
✅ **Local Storage Only** - Photos never uploaded
✅ **No Analytics** - Zero tracking
✅ **No External Requests** - Fully self-contained
✅ **IndexedDB** - Secure browser storage
✅ **No Cookies** - No user tracking
✅ **Open Source** - Auditable code

### Data Storage
- **Location:** Browser IndexedDB
- **Encryption:** Browser-level security
- **Persistence:** Survives browser restart
- **Deletion:** Complete data removal on request

---

## 🌐 Browser Support

### Desktop
- ✅ Chrome 90+
- ✅ Safari 14+
- ✅ Firefox 88+
- ✅ Edge 90+

### Mobile
- ✅ iOS Safari 14+
- ✅ Chrome Android 90+
- ✅ Samsung Internet 14+

### PWA Features
- ✅ Service Worker
- ✅ Add to Home Screen
- ✅ Offline functionality
- ✅ Background sync

---

## 📦 Installation

### As PWA (Recommended)

**Mobile:**
1. Open app in browser
2. Tap "Install" when prompted
3. App icon added to home screen
4. Launch like native app

**Desktop:**
1. Click install icon in address bar
2. Confirm installation
3. App opens in standalone window

### As Web App
Simply visit the URL - no installation required!

---

## 🛠️ Development

### Local Development

```bash
# Install dependencies
npm install

# Start dev server with HMR
npm run dev

# Server runs on http://localhost:5000
```

### Building for Production

```bash
# Build client + server
npm run build

# Outputs to dist/
# - dist/public/ (client assets)
# - dist/index.js (server bundle)

# Start production server
npm start
```

### Environment Variables

```bash
# Development
NODE_ENV=development

# Production
NODE_ENV=production
PORT=5000 # Server port (Replit requires 5000)
```

---

## 🤝 Contributing

### Getting Started
1. Fork the repository
2. Create feature branch: `git checkout -b feature/amazing-feature`
3. Write tests for your feature
4. Implement the feature
5. Ensure all tests pass: `npm run test:run`
6. Commit changes: `git commit -m 'Add amazing feature'`
7. Push to branch: `git push origin feature/amazing-feature`
8. Open Pull Request

### Code Quality Standards
- ✅ All tests must pass
- ✅ TypeScript strict mode
- ✅ 80%+ test coverage
- ✅ No console errors
- ✅ Follows design system
- ✅ Accessibility compliant

---

## 📝 License

MIT License - See [LICENSE](./LICENSE) for details

---

## 🙏 Acknowledgments

Built with:
- [React](https://react.dev/)
- [Vite](https://vitejs.dev/)
- [Tailwind CSS](https://tailwindcss.com/)
- [shadcn/ui](https://ui.shadcn.com/)
- [Framer Motion](https://www.framer.com/motion/)
- [Dexie.js](https://dexie.org/)
- [Zustand](https://zustand-demo.pmnd.rs/)

---

## 📞 Support

- **Issues:** [GitHub Issues](https://github.com/andyd/photowallet1025/issues)
- **Discussions:** [GitHub Discussions](https://github.com/andyd/photowallet1025/discussions)
- **Documentation:** See [Documentation](#documentation) section

---

## 🗺️ Roadmap

### Current (v1.0)
- ✅ 18-photo wallet
- ✅ Overflow folder
- ✅ Gesture controls
- ✅ PWA support
- ✅ Test suite

### Future
- [ ] Photo editing (crop, rotate, filters)
- [ ] Photo sharing enhancements
- [ ] Collections/albums
- [ ] Cloud backup (optional)
- [ ] Photo metadata (captions, dates)
- [ ] Search and filter

---

<div align="center">

**Made with ❤️ for photography enthusiasts**

[⬆ Back to Top](#photo-wallet-pwa)

</div>

