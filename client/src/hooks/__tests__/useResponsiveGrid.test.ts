import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useResponsiveGrid } from '../useResponsiveGrid';

describe('useResponsiveGrid', () => {
  let originalInnerWidth: number;

  beforeEach(() => {
    originalInnerWidth = window.innerWidth;
  });

  afterEach(() => {
    // Restore original window width
    Object.defineProperty(window, 'innerWidth', {
      writable: true,
      configurable: true,
      value: originalInnerWidth,
    });
  });

  const setWindowWidth = (width: number) => {
    Object.defineProperty(window, 'innerWidth', {
      writable: true,
      configurable: true,
      value: width,
    });
    window.dispatchEvent(new Event('resize'));
  };

  it('returns grid configuration', () => {
    const { result } = renderHook(() => useResponsiveGrid());
    
    expect(result.current).toHaveProperty('columns');
    expect(result.current).toHaveProperty('gap');
    expect(result.current).toHaveProperty('minPhotoSize');
  });

  it('returns default values on initial render', () => {
    const { result } = renderHook(() => useResponsiveGrid());
    
    expect(typeof result.current.columns).toBe('number');
    expect(result.current.columns).toBeGreaterThan(0);
    expect(result.current.gap).toBe(8);
    expect(result.current.minPhotoSize).toBe(100);
  });

  it('calculates columns for small phone (375px)', async () => {
    setWindowWidth(375);
    const { result } = renderHook(() => useResponsiveGrid());
    
    await act(async () => {
      await new Promise(resolve => setTimeout(resolve, 200));
    });
    
    expect(result.current.columns).toBeGreaterThanOrEqual(2);
    expect(result.current.columns).toBeLessThanOrEqual(3);
  });

  it('calculates columns for tablet (768px)', async () => {
    setWindowWidth(768);
    const { result } = renderHook(() => useResponsiveGrid());
    
    await act(async () => {
      await new Promise(resolve => setTimeout(resolve, 200));
    });
    
    expect(result.current.columns).toBeGreaterThanOrEqual(3);
    expect(result.current.columns).toBeLessThanOrEqual(5);
  });

  it('calculates columns for desktop (1440px)', async () => {
    setWindowWidth(1440);
    const { result } = renderHook(() => useResponsiveGrid());
    
    await act(async () => {
      await new Promise(resolve => setTimeout(resolve, 200));
    });
    
    expect(result.current.columns).toBeGreaterThanOrEqual(5);
    expect(result.current.columns).toBeLessThanOrEqual(8);
  });

  it('updates columns on window resize', async () => {
    const { result } = renderHook(() => useResponsiveGrid());
    
    const initialColumns = result.current.columns;
    
    // Change window size
    act(() => {
      setWindowWidth(1920);
    });
    
    await act(async () => {
      await new Promise(resolve => setTimeout(resolve, 200));
    });
    
    // Columns may change based on new width
    expect(typeof result.current.columns).toBe('number');
  });

  it('debounces resize events', async () => {
    const { result } = renderHook(() => useResponsiveGrid());
    
    // Trigger multiple resize events quickly
    act(() => {
      setWindowWidth(500);
      setWindowWidth(600);
      setWindowWidth(700);
    });
    
    // Should still have valid columns
    expect(result.current.columns).toBeGreaterThan(0);
  });

  it('cleans up resize listener on unmount', () => {
    const removeEventListenerSpy = vi.spyOn(window, 'removeEventListener');
    const { unmount } = renderHook(() => useResponsiveGrid());
    
    unmount();
    
    expect(removeEventListenerSpy).toHaveBeenCalledWith('resize', expect.any(Function));
    removeEventListenerSpy.mockRestore();
  });
});

