import { describe, it, expect, beforeEach, vi } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { usePWA } from '../usePWA';

describe('usePWA', () => {
  beforeEach(() => {
    // Reset beforeinstallprompt event
    vi.clearAllMocks();
  });

  it('initializes with default values', () => {
    const { result } = renderHook(() => usePWA());
    
    expect(result.current.isInstallable).toBe(false);
    expect(result.current.isInstalled).toBe(false);
    expect(typeof result.current.installApp).toBe('function');
  });

  it('detects standalone mode (installed PWA)', () => {
    // Mock window.matchMedia for standalone mode
    Object.defineProperty(window, 'matchMedia', {
      writable: true,
      value: vi.fn().mockImplementation((query) => ({
        matches: query === '(display-mode: standalone)',
        media: query,
        onchange: null,
        addListener: vi.fn(),
        removeListener: vi.fn(),
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
        dispatchEvent: vi.fn(),
      })),
    });

    const { result } = renderHook(() => usePWA());
    
    expect(result.current.isInstalled).toBe(true);
  });

  it('detects iOS standalone mode', () => {
    // Mock iOS standalone
    Object.defineProperty(window.navigator, 'standalone', {
      writable: true,
      value: true,
    });

    const { result } = renderHook(() => usePWA());
    
    expect(result.current.isInstalled).toBe(true);
  });

  it('installApp returns false when not installable', async () => {
    const { result } = renderHook(() => usePWA());
    
    let installResult;
    await act(async () => {
      installResult = await result.current.installApp();
    });
    
    expect(installResult).toBe(false);
  });

  it('cleans up event listeners on unmount', () => {
    const removeEventListenerSpy = vi.spyOn(window, 'removeEventListener');
    const { unmount } = renderHook(() => usePWA());
    
    unmount();
    
    expect(removeEventListenerSpy).toHaveBeenCalled();
    removeEventListenerSpy.mockRestore();
  });
});

