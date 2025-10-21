import { describe, it, expect, beforeEach, vi } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useWebShare } from '../useWebShare';
import { createMockPhoto } from '@/test/testUtils';

describe('useWebShare', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('detects Web Share API availability', () => {
    // Mock navigator.share
    Object.defineProperty(navigator, 'share', {
      writable: true,
      value: vi.fn(),
    });

    const { result } = renderHook(() => useWebShare());
    
    expect(result.current.canShare).toBe(true);
  });

  it('returns false when Web Share API is not available', () => {
    // Remove navigator.share
    Object.defineProperty(navigator, 'share', {
      writable: true,
      value: undefined,
    });

    const { result } = renderHook(() => useWebShare());
    
    expect(result.current.canShare).toBe(false);
  });

  it('sharePhoto returns false when API not available', async () => {
    Object.defineProperty(navigator, 'share', {
      writable: true,
      value: undefined,
    });

    const { result } = renderHook(() => useWebShare());
    const mockPhoto = createMockPhoto();
    
    let shareResult;
    await act(async () => {
      shareResult = await result.current.sharePhoto(mockPhoto, {
        title: 'Test Photo',
        text: 'test.jpg',
      });
    });
    
    expect(shareResult).toBe(false);
  });

  it('calls navigator.share with correct parameters', async () => {
    const mockShare = vi.fn().mockResolvedValue(undefined);
    Object.defineProperty(navigator, 'share', {
      writable: true,
      value: mockShare,
    });

    const { result } = renderHook(() => useWebShare());
    const mockPhoto = createMockPhoto({ filename: 'test.jpg' });
    
    await act(async () => {
      await result.current.sharePhoto(mockPhoto, {
        title: 'Test Photo',
        text: 'test.jpg',
      });
    });
    
    expect(mockShare).toHaveBeenCalled();
  });

  it('handles share errors gracefully', async () => {
    const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    const mockShare = vi.fn().mockRejectedValue(new Error('Share failed'));
    
    Object.defineProperty(navigator, 'share', {
      writable: true,
      value: mockShare,
    });

    const { result } = renderHook(() => useWebShare());
    const mockPhoto = createMockPhoto();
    
    let shareResult;
    await act(async () => {
      shareResult = await result.current.sharePhoto(mockPhoto, {
        title: 'Test Photo',
        text: 'test.jpg',
      });
    });
    
    expect(shareResult).toBe(false);
    consoleErrorSpy.mockRestore();
  });
});

