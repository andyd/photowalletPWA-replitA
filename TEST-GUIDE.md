# Photo Wallet PWA - Complete Testing Guide

## Table of Contents
1. [Quick Start](#quick-start)
2. [Test Suite Overview](#test-suite-overview)
3. [Running Tests](#running-tests)
4. [Writing Tests](#writing-tests)
5. [Testing Patterns](#testing-patterns)
6. [CI/CD Integration](#cicd-integration)
7. [Troubleshooting](#troubleshooting)

---

## Quick Start

### Run All Tests
```bash
cd photowalletPWA-replitA
npm test
```

### Run Tests Once (CI Mode)
```bash
npm run test:run
```

### Run Tests with Coverage
```bash
npm run test:coverage
```

### Run Tests in UI Mode
```bash
npm run test:ui
```

---

## Test Suite Overview

### Current Test Coverage

| Category | Files | Tests | Status |
|----------|-------|-------|--------|
| **Components** | 7 | 45+ | ✅ Active |
| **Hooks** | 4 | 30+ | ✅ Active |
| **Utils** | 3 | 25+ | ✅ Active |
| **Integration** | 1 | 15+ | ✅ Active |
| **Total** | **15** | **115+** | **✅ Ready** |

### Test Files Structure

```
client/src/
├── components/__tests__/
│   ├── AddPhotoCard.test.tsx       # Upload card component
│   ├── ArchiveDialog.test.tsx      # Overflow folder dialog
│   ├── EmptyState.test.tsx         # Empty state screen
│   ├── Header.test.tsx             # App header
│   ├── PhotoCard.test.tsx          # Photo thumbnail card
│   ├── PhotoCounter.test.tsx       # Photo count badge
│   ├── PhotoGrid.test.tsx          # Photo grid layout
│   └── WelcomeScreen.test.tsx      # First-time user screen
├── hooks/__tests__/
│   ├── usePhotoStore.test.ts       # Zustand store
│   ├── usePWA.test.ts              # PWA installation
│   ├── useResponsiveGrid.test.ts   # Dynamic grid
│   └── useWebShare.test.ts         # Web Share API
├── utils/__tests__/
│   ├── constants.test.ts           # App constants
│   ├── photoUtils.test.ts          # Photo utilities
│   └── thumbnailGenerator.test.ts  # Image processing
├── services/__tests__/
│   └── photoStorage.test.ts        # IndexedDB operations
└── test/
    ├── integration/
    │   └── photoWorkflow.test.ts   # End-to-end workflows
    ├── setup.ts                     # Global test config
    └── testUtils.tsx                # Test helpers

```

---

## Running Tests

### Basic Commands

#### Watch Mode (Recommended for Development)
```bash
npm test
```
- Auto-reruns tests when files change
- Fast feedback loop
- Press 'a' to run all tests
- Press 'f' to run only failed tests
- Press 'q' to quit

#### Run Once
```bash
npm run test:run
```
- Runs all tests once and exits
- Perfect for CI/CD
- Shows final pass/fail status

#### UI Mode
```bash
npm run test:ui
```
- Visual test runner in browser
- Interactive test exploration
- View test results graphically
- Debug failing tests easily

#### Coverage Report
```bash
npm run test:coverage
```
- Generates coverage report
- HTML report in `coverage/index.html`
- Terminal summary
- Identifies untested code

### Advanced Commands

#### Run Specific Test File
```bash
npm test -- PhotoCard.test.tsx
```

#### Run Tests Matching Pattern
```bash
npm test -- --grep "PhotoGrid"
```

#### Run Failed Tests Only
```bash
npm test -- --reporter=verbose --reporter=junit
```

#### Update Snapshots
```bash
npm test -- -u
```

---

## Writing Tests

### Component Testing

#### Basic Component Test
```typescript
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MyComponent } from '../MyComponent';

describe('MyComponent', () => {
  it('renders correctly', () => {
    render(<MyComponent />);
    expect(screen.getByText('Hello')).toBeInTheDocument();
  });
});
```

#### Testing User Interactions
```typescript
import { fireEvent } from '@testing-library/react';

it('handles button click', () => {
  const handleClick = vi.fn();
  render(<Button onClick={handleClick} />);
  
  fireEvent.click(screen.getByRole('button'));
  expect(handleClick).toHaveBeenCalledTimes(1);
});
```

#### Testing with Props
```typescript
it('displays photo count', () => {
  render(<PhotoCounter count={5} />);
  expect(screen.getByText('5 photos')).toBeInTheDocument();
});
```

### Hook Testing

#### Basic Hook Test
```typescript
import { renderHook, act } from '@testing-library/react';

it('initializes with default value', () => {
  const { result } = renderHook(() => useMyHook());
  expect(result.current.value).toBe(0);
});
```

#### Testing State Changes
```typescript
it('updates state', () => {
  const { result } = renderHook(() => usePhotoStore());
  
  act(() => {
    result.current.openViewer(0);
  });
  
  expect(result.current.isViewerOpen).toBe(true);
  expect(result.current.currentPhotoIndex).toBe(0);
});
```

#### Testing Async Operations
```typescript
it('loads photos', async () => {
  const { result } = renderHook(() => usePhotoStore());
  
  await act(async () => {
    await result.current.loadPhotos();
  });
  
  expect(result.current.photos).toBeDefined();
});
```

### Integration Testing

#### Complete User Workflows
```typescript
describe('Photo Upload Workflow', () => {
  it('adds photo from upload to grid display', async () => {
    // 1. Start with empty state
    // 2. Upload a photo
    // 3. Verify it appears in grid
    // 4. Click to view full-screen
    // 5. Verify viewer opens
  });
});
```

---

## Testing Patterns

### AAA Pattern (Arrange, Act, Assert)

```typescript
it('deletes a photo', async () => {
  // Arrange - Set up test data
  const mockPhoto = createMockPhoto();
  const { result } = renderHook(() => usePhotoStore());
  
  // Act - Perform the action
  await act(async () => {
    await result.current.deletePhoto(mockPhoto.id);
  });
  
  // Assert - Verify the result
  expect(photoStorage.deletePhoto).toHaveBeenCalledWith(mockPhoto.id);
});
```

### Test User Behavior, Not Implementation

✅ **Good:**
```typescript
it('shows delete button on hover', () => {
  render(<PhotoCard photo={mockPhoto} />);
  
  const card = screen.getByTestId('card-photo-test-1');
  fireEvent.mouseEnter(card);
  
  expect(screen.getByTestId('button-delete-test-1')).toBeVisible();
});
```

❌ **Bad:**
```typescript
it('has handleDelete method', () => {
  const instance = render(<PhotoCard />);
  expect(instance.handleDelete).toBeDefined(); // Testing implementation
});
```

### Test Edge Cases

```typescript
describe('Photo Limit Enforcement', () => {
  it('allows adding photos under limit', async () => {
    // Test normal case
  });

  it('prevents adding photos at 18-photo limit', async () => {
    // Test boundary condition
  });

  it('handles empty photo array', () => {
    // Test empty state
  });

  it('handles single photo', () => {
    // Test minimum case
  });
});
```

---

## Test Utilities

### Helper Functions (`test/testUtils.tsx`)

#### Render with Providers
```typescript
import { renderWithProviders } from '@/test/testUtils';

it('renders with all providers', () => {
  const { getByText } = renderWithProviders(<MyComponent />);
  expect(getByText('Hello')).toBeInTheDocument();
});
```

#### Create Mock Data
```typescript
import { createMockPhoto, createMockPhotos, createMockFile } from '@/test/testUtils';

// Single photo
const photo = createMockPhoto({ filename: 'custom.jpg' });

// Multiple photos
const photos = createMockPhotos(5);

// Mock file
const file = createMockFile('test.jpg', 'image/jpeg', 2048);
```

### Mocking Services

```typescript
import { vi } from 'vitest';

vi.mock('@/services/photoStorage', () => ({
  photoStorage: {
    getAllPhotos: vi.fn().mockResolvedValue([]),
    addPhoto: vi.fn().mockResolvedValue('photo-id'),
    deletePhoto: vi.fn().mockResolvedValue(),
  },
}));
```

---

## Testing Checklist

### Before Committing Code

- [ ] All tests pass (`npm run test:run`)
- [ ] No TypeScript errors (`npm run check`)
- [ ] Code coverage meets minimum (80%+)
- [ ] New features have tests
- [ ] Edge cases are tested
- [ ] Integration tests pass

### When Adding New Features

- [ ] Write tests alongside feature code
- [ ] Test happy path
- [ ] Test error cases
- [ ] Test edge cases (empty, max, min)
- [ ] Test user interactions
- [ ] Update documentation if needed

### When Fixing Bugs

- [ ] Write test that reproduces bug
- [ ] Verify test fails before fix
- [ ] Implement fix
- [ ] Verify test passes after fix
- [ ] Add regression test

---

## CI/CD Integration

### GitHub Actions Example

Create `.github/workflows/test.yml`:

```yaml
name: Test Suite

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
          cache: 'npm'
      
      - name: Install dependencies
        run: |
          cd photowalletPWA-replitA
          npm ci
      
      - name: Run tests
        run: |
          cd photowalletPWA-replitA
          npm run test:run
      
      - name: Generate coverage
        run: |
          cd photowalletPWA-replitA
          npm run test:coverage
      
      - name: Upload coverage to Codecov
        uses: codecov/codecov-action@v3
        with:
          files: ./photowalletPWA-replitA/coverage/coverage-final.json
          fail_ci_if_error: true
```

### Pre-commit Hook

Create `.husky/pre-commit`:

```bash
#!/bin/sh
. "$(dirname "$0")/_/husky.sh"

cd photowalletPWA-replitA
npm run test:run
npm run check
```

---

## Troubleshooting

### Common Issues

#### Tests Timing Out
```typescript
// Increase timeout for specific test
it('slow operation', async () => {
  // test code
}, 10000); // 10 second timeout
```

#### Mock Not Working
```typescript
// Ensure mock is defined before import
vi.mock('@/services/photoStorage');
import { photoStorage } from '@/services/photoStorage'; // After mock
```

#### Canvas/Image Tests Failing
```typescript
// Mock Canvas API
beforeEach(() => {
  global.HTMLCanvasElement.prototype.getContext = vi.fn();
  global.Image = vi.fn().mockImplementation(() => ({
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
  }));
});
```

#### IndexedDB Tests
```typescript
// Use fake-indexeddb for realistic DB testing
import 'fake-indexeddb/auto';

beforeEach(() => {
  // Reset database between tests
  indexedDB.deleteDatabase('PhotoWalletDB');
});
```

### Debugging Tests

#### Using console.log
```typescript
it('debugs test', () => {
  const { container } = render(<MyComponent />);
  console.log(container.innerHTML); // See rendered HTML
  screen.debug(); // Alternative method
});
```

#### Using VS Code Debugger
1. Set breakpoint in test file
2. Run > Start Debugging
3. Select "Vitest" configuration
4. Step through test execution

#### Using Chrome DevTools
```bash
node --inspect-brk ./node_modules/vitest/vitest.mjs
```
Then open `chrome://inspect` in Chrome.

---

## Test Quality Guidelines

### Test Naming
```typescript
// ✅ Good: Descriptive, readable
it('shows error message when upload fails', () => {});

// ❌ Bad: Vague, unclear
it('works', () => {});
it('test 1', () => {});
```

### Test Independence
```typescript
// ✅ Good: Each test is isolated
describe('PhotoStore', () => {
  beforeEach(() => {
    // Reset state before each test
    usePhotoStore.setState({ photos: [] });
  });
  
  it('adds photo', () => {});
  it('deletes photo', () => {});
});

// ❌ Bad: Tests depend on each other
it('adds photo', () => {
  // adds photo
});
it('has one photo', () => {
  expect(photos.length).toBe(1); // Depends on previous test
});
```

### Assertion Quality
```typescript
// ✅ Good: Specific assertions
expect(photos).toHaveLength(5);
expect(photo.filename).toBe('test.jpg');
expect(button).toHaveAttribute('aria-label', 'Delete photo');

// ❌ Bad: Vague assertions
expect(photos).toBeTruthy();
expect(result).not.toBeNull();
```

---

## Coverage Goals

### Minimum Targets
- **Overall Coverage:** 80%
- **Statements:** 80%
- **Branches:** 75%
- **Functions:** 80%
- **Lines:** 80%

### Priority Areas (90%+ Coverage Required)
- Core utilities (photoUtils, thumbnailGenerator)
- State management (usePhotoStore)
- Photo storage service
- Critical user paths (upload, view, delete)

### Excluded from Coverage
- UI component library (shadcn/ui)
- Type definitions (.d.ts files)
- Configuration files
- Test files themselves
- Example components

---

## Testing Best Practices

### 1. Write Tests First (TDD)
```typescript
// 1. Write failing test
it('validates file size', () => {
  const largeFile = createMockFile('large.jpg', 'image/jpeg', 20 * 1024 * 1024);
  expect(validateFileSize(largeFile)).toBe(false);
});

// 2. Implement feature to make test pass
// 3. Refactor with confidence
```

### 2. Test Behavior, Not Implementation
Focus on what the user sees and does, not internal details.

### 3. Keep Tests Simple
One concept per test. If you need "and" in the test name, split it.

### 4. Use Descriptive Names
```typescript
// ✅ Good
it('archives oldest photo when adding to full wallet')

// ❌ Bad
it('test archive functionality')
```

### 5. Mock External Dependencies
```typescript
vi.mock('@/services/photoStorage');
vi.mock('@/utils/thumbnailGenerator');
```

### 6. Clean Up After Tests
```typescript
afterEach(() => {
  cleanup(); // React Testing Library
  vi.clearAllMocks(); // Vitest mocks
  localStorage.clear(); // Browser APIs
});
```

### 7. Test Error Cases
```typescript
it('handles network error gracefully', async () => {
  vi.mocked(photoStorage.addPhoto).mockRejectedValue(new Error('Network error'));
  
  await expect(
    act(async () => await addPhoto(mockFile))
  ).rejects.toThrow('Network error');
});
```

---

## Common Test Scenarios

### Testing Photo Upload

```typescript
describe('Photo Upload', () => {
  it('successfully uploads a photo', async () => {
    const { result } = renderHook(() => usePhotoStore());
    const mockFile = createMockFile('test.jpg');
    
    await act(async () => {
      await result.current.addPhoto(mockFile);
    });
    
    expect(result.current.photos).toHaveLength(1);
    expect(result.current.photos[0].filename).toBe('test.jpg');
  });

  it('enforces 18-photo limit', async () => {
    // Set up 18 existing photos
    // Try to add 19th
    // Expect error
  });

  it('skips duplicate photos', async () => {
    // Add photo
    // Try to add same photo again
    // Expect only 1 photo in store
  });

  it('generates thumbnails for uploaded photos', async () => {
    // Upload photo
    // Verify thumbnail was generated
    // Verify thumbnail is correct size
  });
});
```

### Testing Photo Viewer

```typescript
describe('PhotoViewer', () => {
  it('opens with correct photo', () => {
    render(<PhotoViewer photos={mockPhotos} currentIndex={2} />);
    expect(screen.getByText('3 of 5')).toBeInTheDocument();
  });

  it('hides UI by default', () => {
    render(<PhotoViewer photos={mockPhotos} currentIndex={0} />);
    // UI should be hidden initially
  });

  it('shows UI on tap', () => {
    const { container } = render(<PhotoViewer photos={mockPhotos} currentIndex={0} />);
    const viewer = container.querySelector('[data-testid="container-photo-viewer"]');
    
    fireEvent.click(viewer);
    // UI should now be visible
  });

  it('handles keyboard navigation', () => {
    render(<PhotoViewer photos={mockPhotos} currentIndex={0} />);
    
    fireEvent.keyDown(window, { key: 'Escape' });
    // Viewer should close
  });
});
```

### Testing Archive/Overflow

```typescript
describe('Archive System', () => {
  it('moves photo to overflow when removed', async () => {
    const { result } = renderHook(() => usePhotoStore());
    
    await act(async () => {
      await photoStorage.archivePhoto('photo-1');
    });
    
    // Verify photo moved to overflow
  });

  it('restores photo from overflow', async () => {
    const { result } = renderHook(() => usePhotoStore());
    
    await act(async () => {
      await result.current.unarchivePhoto('archived-1');
    });
    
    expect(photoStorage.unarchivePhoto).toHaveBeenCalledWith('archived-1');
  });

  it('prevents restore when wallet is full', async () => {
    // Set wallet to 18 photos
    // Try to restore from overflow
    // Expect error
  });
});
```

---

## Performance Testing

### Test Execution Speed

**Current Performance:**
- Full suite: ~8-10 seconds
- Component tests: ~3-4 seconds
- Hook tests: ~2-3 seconds
- Util tests: ~1 second

**Optimization Tips:**
- Use `vi.mock()` instead of real implementations
- Avoid unnecessary async waits
- Parallelize independent tests
- Clean up resources promptly

### Memory Leaks

```typescript
it('cleans up object URLs', () => {
  const revokeURLSpy = vi.spyOn(URL, 'revokeObjectURL');
  
  const { unmount } = render(<PhotoCard photo={mockPhoto} />);
  unmount();
  
  expect(revokeURLSpy).toHaveBeenCalled();
  revokeURLSpy.mockRestore();
});
```

---

## Continuous Testing

### Watch Mode Workflow

1. **Start watch mode:**
   ```bash
   npm test
   ```

2. **Edit a file** - Tests auto-run

3. **Focus on failures:**
   - Press `f` to run only failed tests
   - Fix issues
   - Tests auto-rerun

4. **Run all when done:**
   - Press `a` to run all tests
   - Verify everything passes

### Test-Driven Development (TDD)

1. **Write failing test** for new feature
2. **Run tests** - should fail
3. **Write minimal code** to pass test
4. **Run tests** - should pass
5. **Refactor** code
6. **Run tests** - should still pass
7. Repeat!

---

## Accessibility Testing

### ARIA Labels
```typescript
it('has proper aria labels', () => {
  render(<PhotoCard photo={mockPhoto} />);
  
  const card = screen.getByRole('button');
  expect(card).toHaveAttribute('aria-label', 'View photo: test.jpg');
});
```

### Keyboard Navigation
```typescript
it('handles keyboard interactions', () => {
  render(<AddPhotoCard onPhotoSelect={mockFn} photoCount={0} />);
  
  const card = screen.getByTestId('button-add-photo-card');
  fireEvent.keyDown(card, { key: 'Enter' });
  
  // Verify action triggered
});
```

### Focus Management
```typescript
it('manages focus correctly', () => {
  render(<Dialog open={true} />);
  
  // First focusable element should be focused
  expect(document.activeElement).toBe(screen.getByRole('button'));
});
```

---

## Resources

### Documentation
- [Vitest](https://vitest.dev/) - Test framework
- [Testing Library](https://testing-library.com/) - Testing utilities
- [jest-dom](https://github.com/testing-library/jest-dom) - DOM matchers

### Learning Materials
- [Testing Library Cheatsheet](https://testing-library.com/docs/react-testing-library/cheatsheet)
- [Common Mistakes](https://kentcdodds.com/blog/common-mistakes-with-react-testing-library)
- [Testing Best Practices](https://github.com/goldbergyoni/javascript-testing-best-practices)

### Tools
- **Vitest UI** - Visual test runner
- **Coverage Reports** - Identify gaps
- **VS Code Extensions** - Vitest extension for IDE integration

---

## Quick Reference

### Test File Naming
```
Component.tsx → Component.test.tsx
useHook.ts → useHook.test.ts
utils.ts → utils.test.ts
```

### Common Matchers
```typescript
expect(value).toBe(expected)
expect(value).toEqual(expected)
expect(value).toBeTruthy()
expect(value).toHaveLength(5)
expect(element).toBeInTheDocument()
expect(element).toBeVisible()
expect(element).toHaveClass('active')
expect(element).toHaveAttribute('aria-label', 'Close')
expect(fn).toHaveBeenCalled()
expect(fn).toHaveBeenCalledWith(arg1, arg2)
expect(fn).toHaveBeenCalledTimes(3)
```

### Common Queries
```typescript
screen.getByText('Hello')
screen.getByRole('button')
screen.getByLabelText('Username')
screen.getByPlaceholderText('Enter name')
screen.getByTestId('custom-element')
screen.getByAltText('Photo description')
screen.queryByText('Optional') // Returns null if not found
screen.findByText('Async') // Returns promise
```

---

## Next Steps

1. **Run the test suite:** `npm test`
2. **Review coverage:** `npm run test:coverage`
3. **Add missing tests** for any gaps
4. **Set up CI/CD** with GitHub Actions
5. **Write tests** for new features
6. **Maintain 80%+ coverage**

---

**Happy Testing! 🧪**

For questions or issues, refer to the [TESTING.md](./TESTING.md) file or check existing tests in `__tests__` directories for examples.

