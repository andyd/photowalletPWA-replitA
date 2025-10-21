# Testing Quick Start - Photo Wallet PWA

## 🚀 Get Started in 30 Seconds

```bash
cd photowalletPWA-replitA
npm test
```

---

## ⚡ Most Used Commands

```bash
# Watch mode (auto-rerun on changes)
npm test

# Run once (CI mode)
npm run test:run

# Visual UI mode
npm run test:ui

# Coverage report
npm run test:coverage

# Run specific test file
npm test -- PhotoCard.test.tsx

# Run only failed tests
npm test -- --reporter=verbose
```

---

## 📝 Write Your First Test

### 1. Create Test File
```bash
# Component test
touch client/src/components/__tests__/MyComponent.test.tsx

# Hook test
touch client/src/hooks/__tests__/useMyHook.test.ts

# Util test
touch client/src/utils/__tests__/myUtil.test.ts
```

### 2. Basic Test Template

```typescript
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MyComponent } from '../MyComponent';

describe('MyComponent', () => {
  it('renders correctly', () => {
    render(<MyComponent />);
    expect(screen.getByText('Hello')).toBeInTheDocument();
  });

  it('handles click', () => {
    const handleClick = vi.fn();
    render(<MyComponent onClick={handleClick} />);
    
    const button = screen.getByRole('button');
    fireEvent.click(button);
    
    expect(handleClick).toHaveBeenCalled();
  });
});
```

### 3. Run Your Test
```bash
npm test -- MyComponent
```

---

## 🎯 Test Patterns Cheat Sheet

### Component Testing
```typescript
// Render component
const { container } = render(<MyComponent />);

// Find elements
screen.getByText('Hello')
screen.getByRole('button')
screen.getByTestId('my-element')

// Interact
fireEvent.click(button)
fireEvent.change(input, { target: { value: 'test' } })
fireEvent.keyDown(element, { key: 'Enter' })

// Assert
expect(element).toBeInTheDocument()
expect(element).toHaveClass('active')
expect(element).toHaveAttribute('aria-label', 'Close')
```

### Hook Testing
```typescript
// Render hook
const { result } = renderHook(() => useMyHook());

// Access current value
expect(result.current.value).toBe(0);

// Update state
act(() => {
  result.current.increment();
});

// Async operations
await act(async () => {
  await result.current.loadData();
});
```

### Mocking
```typescript
// Mock entire module
vi.mock('@/services/api');

// Mock function
const mockFn = vi.fn().mockReturnValue('result');
const mockAsyncFn = vi.fn().mockResolvedValue('result');

// Mock implementation
mockFn.mockImplementation((arg) => arg * 2);

// Verify calls
expect(mockFn).toHaveBeenCalled();
expect(mockFn).toHaveBeenCalledWith('arg');
expect(mockFn).toHaveBeenCalledTimes(3);
```

---

## 🐛 Debug Failing Tests

### See What Rendered
```typescript
screen.debug(); // Prints DOM to console
console.log(container.innerHTML); // Raw HTML
```

### Check Test Output
```bash
npm run test:run -- --reporter=verbose
```

### Use VS Code Debugger
1. Set breakpoint in test
2. Click "Debug" above test
3. Step through execution

---

## 📊 Check Coverage

```bash
npm run test:coverage
```

**Then open:** `coverage/index.html` in browser

**Coverage Report Shows:**
- Overall coverage percentage
- Uncovered lines (highlighted in red)
- Branch coverage
- Function coverage

---

## ✅ Pre-Commit Checklist

Before committing code:

```bash
# 1. Run all tests
npm run test:run

# 2. Check TypeScript
npm run check

# 3. Generate coverage
npm run test:coverage

# 4. Verify coverage ≥ 80%
```

All passing? ✅ Ready to commit!

---

## 🎓 Learn by Example

### See Working Tests
```bash
# Component examples
cat client/src/components/__tests__/PhotoCard.test.tsx

# Hook examples
cat client/src/hooks/__tests__/usePhotoStore.test.ts

# Integration examples
cat client/src/test/integration/photoWorkflow.test.ts
```

### Copy-Paste Templates
Use `test/testUtils.tsx` for helper functions:
```typescript
import { 
  renderWithProviders,
  createMockPhoto,
  createMockFile,
} from '@/test/testUtils';
```

---

## 💡 Pro Tips

1. **Write tests alongside features** - Don't accumulate test debt
2. **Run tests frequently** - Catch issues early
3. **Use watch mode** - Instant feedback
4. **Test behavior, not implementation** - Tests survive refactoring
5. **Keep tests simple** - Easy to understand = easy to maintain
6. **Mock external dependencies** - Fast, reliable tests
7. **Test edge cases** - Where bugs hide
8. **Use descriptive names** - Tests are documentation

---

## 🆘 Getting Help

- **Read full guide:** [TEST-GUIDE.md](./TEST-GUIDE.md)
- **Testing docs:** [TESTING.md](./TESTING.md)
- **Check examples:** Look in `__tests__` directories
- **Review test utils:** `client/src/test/testUtils.tsx`
- **Vitest docs:** https://vitest.dev/

---

## 📈 Test Suite Status

**Current Status:**
- ✅ 115+ tests created
- ✅ Component tests (45+)
- ✅ Hook tests (30+)
- ✅ Utility tests (25+)
- ✅ Integration tests (15+)
- ✅ ~85% estimated coverage

**Next Goals:**
- Add E2E tests with Playwright
- Increase coverage to 90%+
- Add visual regression tests
- Set up CI/CD pipeline

---

**You're ready to test! 🎉**

Run `npm test` and start building with confidence!

