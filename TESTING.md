# Photo Wallet PWA - Testing Guide

This document provides comprehensive information about testing the Photo Wallet PWA application.

## Testing Stack

- **Test Runner**: [Vitest](https://vitest.dev/) - Fast unit test framework for Vite projects
- **Testing Library**: [@testing-library/react](https://testing-library.com/react) - React testing utilities
- **Assertions**: [jest-dom](https://github.com/testing-library/jest-dom) - Custom matchers for DOM testing
- **Coverage**: V8 coverage provider built into Vitest

## Running Tests

### Basic Commands

```bash
# Run all tests
npm test

# Run tests in watch mode (auto-rerun on file changes)
npm run test:watch

# Run tests with UI (visual test runner)
npm run test:ui

# Run tests once and exit (CI mode)
npm run test:run

# Generate coverage report
npm run test:coverage
```

### Running Specific Tests

```bash
# Run tests in a specific file
npm test -- photoUtils.test.ts

# Run tests matching a pattern
npm test -- PhotoCard

# Run a specific test suite
npm test -- --grep "PhotoGrid"
```

## Test Structure

### Directory Organization

```
client/src/
├── components/
│   └── __tests__/          # Component tests
│       ├── PhotoCard.test.tsx
│       ├── PhotoGrid.test.tsx
│       ├── AddPhotoCard.test.tsx
│       ├── EmptyState.test.tsx
│       └── PhotoCounter.test.tsx
├── hooks/
│   └── __tests__/          # Hook tests
│       └── usePhotoStore.test.ts
├── utils/
│   └── __tests__/          # Utility tests
│       ├── photoUtils.test.ts
│       ├── thumbnailGenerator.test.ts
│       └── constants.test.ts
├── services/
│   └── __tests__/          # Service tests
│       └── photoStorage.test.ts
└── test/
    ├── setup.ts            # Global test setup
    └── testUtils.tsx       # Test helper utilities
```

## Writing Tests

### Component Tests

Use `@testing-library/react` for component testing:

```typescript
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { MyComponent } from '../MyComponent';

describe('MyComponent', () => {
  it('renders correctly', () => {
    render(<MyComponent />);
    expect(screen.getByText('Hello')).toBeInTheDocument();
  });

  it('handles click events', () => {
    const handleClick = vi.fn();
    render(<MyComponent onClick={handleClick} />);
    
    fireEvent.click(screen.getByRole('button'));
    expect(handleClick).toHaveBeenCalled();
  });
});
```

### Hook Tests

Use `renderHook` from `@testing-library/react` for hook testing:

```typescript
import { renderHook, act } from '@testing-library/react';
import { useMyHook } from '../useMyHook';

describe('useMyHook', () => {
  it('initializes with default value', () => {
    const { result } = renderHook(() => useMyHook());
    expect(result.current.value).toBe(0);
  });

  it('updates value', () => {
    const { result } = renderHook(() => useMyHook());
    
    act(() => {
      result.current.increment();
    });
    
    expect(result.current.value).toBe(1);
  });
});
```

### Utility Tests

Standard unit tests for pure functions:

```typescript
import { describe, it, expect } from 'vitest';
import { myUtility } from '../myUtility';

describe('myUtility', () => {
  it('performs calculation correctly', () => {
    expect(myUtility(2, 3)).toBe(5);
  });

  it('handles edge cases', () => {
    expect(myUtility(0, 0)).toBe(0);
    expect(myUtility(-1, 1)).toBe(0);
  });
});
```

## Test Helpers

### Test Utilities (`client/src/test/testUtils.tsx`)

Helper functions for common testing scenarios:

```typescript
import { renderWithProviders, createMockPhoto, createMockFile } from '@/test/testUtils';

// Render with all necessary providers (QueryClient, ThemeProvider)
const { getByText } = renderWithProviders(<MyComponent />);

// Create mock photo objects
const mockPhoto = createMockPhoto({ filename: 'custom.jpg' });
const mockPhotos = createMockPhotos(5);

// Create mock files for upload testing
const mockFile = createMockFile('test.jpg', 'image/jpeg', 1024);
const mockFiles = createMockFiles(3);
```

## Mocking

### Mocking Modules

```typescript
import { vi } from 'vitest';

vi.mock('@/services/photoStorage', () => ({
  photoStorage: {
    getAllPhotos: vi.fn(),
    addPhoto: vi.fn(),
    deletePhoto: vi.fn(),
  },
}));
```

### Mocking Browser APIs

Global mocks are configured in `client/src/test/setup.ts`:

- `IndexedDB` - Mocked for database tests
- `matchMedia` - Mocked for responsive design tests
- `IntersectionObserver` - Mocked for lazy loading tests
- `ResizeObserver` - Mocked for resize handling tests
- `URL.createObjectURL` - Mocked for file handling tests

## Coverage

### Coverage Reports

Coverage reports are generated in multiple formats:

- **Terminal**: Summary displayed after `npm run test:coverage`
- **HTML**: Detailed report in `coverage/index.html`
- **JSON**: Machine-readable format in `coverage/coverage-final.json`

### Coverage Goals

| Type | Target |
|------|--------|
| Overall | 80%+ |
| Statements | 80%+ |
| Branches | 75%+ |
| Functions | 80%+ |
| Lines | 80%+ |

### Excluded from Coverage

- `node_modules/`
- `client/src/test/` (test utilities)
- `**/*.d.ts` (type definitions)
- `**/*.config.*` (configuration files)
- `**/mockData` (test fixtures)
- `**/examples` (example components)

## Testing Patterns

### 1. AAA Pattern (Arrange, Act, Assert)

```typescript
it('adds a photo', async () => {
  // Arrange
  const mockPhoto = createMockPhoto();
  const { result } = renderHook(() => usePhotoStore());
  
  // Act
  await act(async () => {
    await result.current.addPhoto(mockPhoto);
  });
  
  // Assert
  expect(result.current.photos).toHaveLength(1);
});
```

### 2. Test User Behavior, Not Implementation

```typescript
// ✅ Good: Test user behavior
it('deletes a photo when delete button is clicked', () => {
  render(<PhotoCard photo={mockPhoto} onDelete={mockDelete} />);
  
  const deleteButton = screen.getByRole('button', { name: /delete/i });
  fireEvent.click(deleteButton);
  
  expect(mockDelete).toHaveBeenCalledWith(mockPhoto.id);
});

// ❌ Bad: Test implementation details
it('calls handleDelete function', () => {
  const { instance } = render(<PhotoCard />);
  expect(instance.handleDelete).toBeDefined();
});
```

### 3. Test Edge Cases

```typescript
describe('photo limit enforcement', () => {
  it('allows adding photos under limit', () => {
    // Test normal case
  });

  it('prevents adding photos at limit', () => {
    // Test boundary condition
  });

  it('handles empty photo array', () => {
    // Test empty state
  });
});
```

## Known Testing Limitations

### IndexedDB Testing

The current test setup uses mocked IndexedDB. For comprehensive database testing:

1. **Option 1**: Use [fake-indexeddb](https://www.npmjs.com/package/fake-indexeddb)
   ```bash
   npm install -D fake-indexeddb
   ```

2. **Option 2**: Write integration tests with real IndexedDB in browser environment

3. **Option 3**: Use Playwright E2E tests for database operations

### Canvas/Image Operations

Tests involving Canvas API and image manipulation may require additional setup:

```typescript
// Mock canvas operations in test setup
const mockCanvas = {
  getContext: vi.fn(() => ({
    drawImage: vi.fn(),
    toBlob: vi.fn(),
  })),
};
```

### Gesture Testing

Tests for gesture-based interactions (@use-gesture/react) are limited in jsdom. Consider:

- E2E tests with Playwright for full gesture testing
- Mock gesture handlers and test state changes

## Continuous Integration

### GitHub Actions Example

```yaml
name: Tests

on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      
      - run: npm ci
      - run: npm run test:run
      - run: npm run test:coverage
      
      - name: Upload coverage
        uses: codecov/codecov-action@v3
        with:
          files: ./coverage/coverage-final.json
```

## Debugging Tests

### Using VS Code

Add to `.vscode/launch.json`:

```json
{
  "type": "node",
  "request": "launch",
  "name": "Debug Tests",
  "runtimeExecutable": "npm",
  "runtimeArgs": ["test"],
  "console": "integratedTerminal",
  "internalConsoleOptions": "neverOpen"
}
```

### Using Chrome DevTools

```bash
# Run tests with Node inspector
node --inspect-brk ./node_modules/vitest/vitest.mjs
```

## Best Practices

1. **Write tests alongside features** - Don't let test debt accumulate
2. **Test behavior, not implementation** - Tests should be refactor-resistant
3. **Keep tests isolated** - Each test should be independent
4. **Use descriptive test names** - Clearly state what is being tested
5. **Mock external dependencies** - Focus on unit under test
6. **Avoid test interdependence** - Don't rely on test execution order
7. **Clean up after tests** - Prevent test pollution
8. **Test error cases** - Don't just test the happy path
9. **Maintain test code quality** - Apply same standards as production code
10. **Keep tests fast** - Slow tests discourage running them

## Resources

- [Vitest Documentation](https://vitest.dev/)
- [Testing Library Docs](https://testing-library.com/)
- [Jest DOM Matchers](https://github.com/testing-library/jest-dom)
- [Testing Best Practices](https://kentcdodds.com/blog/common-mistakes-with-react-testing-library)

## Getting Help

- Check existing tests in `__tests__` directories for examples
- Consult the test utilities in `client/src/test/testUtils.tsx`
- Review the test setup in `client/src/test/setup.ts`
- Ask in team discussions or code reviews

---

**Happy Testing! 🧪**

