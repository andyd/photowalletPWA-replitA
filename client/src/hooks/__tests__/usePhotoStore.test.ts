import { describe, it, expect, beforeEach, vi } from 'vitest';
import { renderHook, act, waitFor } from '@testing-library/react';
import { usePhotoStore } from '../usePhotoStore';
import { photoStorage } from '@/services/photoStorage';
import type { Photo } from '@shared/schema';

// Mock the photoStorage service
vi.mock('@/services/photoStorage', () => ({
  photoStorage: {
    getAllPhotos: vi.fn(),
    addPhoto: vi.fn(),
    deletePhoto: vi.fn(),
    reorderPhotos: vi.fn(),
  },
}));

// Mock thumbnail generator
vi.mock('@/utils/thumbnailGenerator', () => ({
  generateThumbnail: vi.fn().mockResolvedValue(new Blob(['thumb'], { type: 'image/jpeg' })),
}));

describe('usePhotoStore', () => {
  const mockPhoto: Photo = {
    id: 'test-1',
    blob: new Blob(['test'], { type: 'image/jpeg' }),
    thumbnail: new Blob(['thumb'], { type: 'image/jpeg' }),
    filename: 'test.jpg',
    order: 0,
    createdAt: new Date('2024-01-01'),
  };

  beforeEach(() => {
    // Reset the store before each test
    const { result } = renderHook(() => usePhotoStore());
    act(() => {
      usePhotoStore.setState({
        photos: [],
        isLoading: false,
        currentPhotoIndex: null,
        isViewerOpen: false,
      });
    });

    // Clear all mocks
    vi.clearAllMocks();
  });

  describe('initial state', () => {
    it('should have empty photos array', () => {
      const { result } = renderHook(() => usePhotoStore());
      expect(result.current.photos).toEqual([]);
    });

    it('should not be loading', () => {
      const { result } = renderHook(() => usePhotoStore());
      expect(result.current.isLoading).toBe(false);
    });

    it('should have no photo selected', () => {
      const { result } = renderHook(() => usePhotoStore());
      expect(result.current.currentPhotoIndex).toBeNull();
    });

    it('should have viewer closed', () => {
      const { result } = renderHook(() => usePhotoStore());
      expect(result.current.isViewerOpen).toBe(false);
    });
  });

  describe('loadPhotos', () => {
    it('should load photos from storage', async () => {
      const mockPhotos = [mockPhoto];
      vi.mocked(photoStorage.getAllPhotos).mockResolvedValue(mockPhotos);

      const { result } = renderHook(() => usePhotoStore());

      await act(async () => {
        await result.current.loadPhotos();
      });

      expect(photoStorage.getAllPhotos).toHaveBeenCalled();
      expect(result.current.photos).toEqual(mockPhotos);
    });

    it('should set loading state during load', async () => {
      vi.mocked(photoStorage.getAllPhotos).mockImplementation(
        () =>
          new Promise((resolve) => {
            setTimeout(() => resolve([]), 100);
          })
      );

      const { result } = renderHook(() => usePhotoStore());

      act(() => {
        result.current.loadPhotos();
      });

      expect(result.current.isLoading).toBe(true);

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });
    });

    it('should handle load errors', async () => {
      const consoleError = vi.spyOn(console, 'error').mockImplementation(() => {});
      vi.mocked(photoStorage.getAllPhotos).mockRejectedValue(new Error('Load failed'));

      const { result } = renderHook(() => usePhotoStore());

      await act(async () => {
        await result.current.loadPhotos();
      });

      expect(consoleError).toHaveBeenCalledWith('Failed to load photos:', expect.any(Error));
      expect(result.current.isLoading).toBe(false);

      consoleError.mockRestore();
    });
  });

  describe('addPhoto', () => {
    it('should add a photo to the store', async () => {
      vi.mocked(photoStorage.addPhoto).mockResolvedValue();
      const mockFile = new File(['test'], 'test.jpg', { type: 'image/jpeg' });

      const { result } = renderHook(() => usePhotoStore());

      await act(async () => {
        await result.current.addPhoto(mockFile);
      });

      expect(photoStorage.addPhoto).toHaveBeenCalled();
      expect(result.current.photos).toHaveLength(1);
      expect(result.current.photos[0].filename).toBe('test.jpg');
    });

    it('should enforce MAX_PHOTOS limit', async () => {
      const { result } = renderHook(() => usePhotoStore());

      // Fill up to 18 photos
      act(() => {
        usePhotoStore.setState({
          photos: Array.from({ length: 18 }, (_, i) => ({
            ...mockPhoto,
            id: `photo-${i}`,
            order: i,
          })),
        });
      });

      const mockFile = new File(['test'], 'test.jpg', { type: 'image/jpeg' });

      await expect(
        act(async () => {
          await result.current.addPhoto(mockFile);
        })
      ).rejects.toThrow('Maximum of 18 photos allowed');
    });

    it('should set correct order for new photo', async () => {
      vi.mocked(photoStorage.addPhoto).mockResolvedValue();
      const { result } = renderHook(() => usePhotoStore());

      // Add two existing photos
      act(() => {
        usePhotoStore.setState({
          photos: [
            { ...mockPhoto, id: 'photo-1', order: 0 },
            { ...mockPhoto, id: 'photo-2', order: 1 },
          ],
        });
      });

      const mockFile = new File(['test'], 'test.jpg', { type: 'image/jpeg' });

      await act(async () => {
        await result.current.addPhoto(mockFile);
      });

      expect(result.current.photos).toHaveLength(3);
      expect(result.current.photos[2].order).toBe(2);
    });
  });

  describe('deletePhoto', () => {
    it('should delete a photo from the store', async () => {
      vi.mocked(photoStorage.deletePhoto).mockResolvedValue();
      vi.mocked(photoStorage.reorderPhotos).mockResolvedValue();

      const { result } = renderHook(() => usePhotoStore());

      act(() => {
        usePhotoStore.setState({
          photos: [mockPhoto],
        });
      });

      await act(async () => {
        await result.current.deletePhoto('test-1');
      });

      expect(photoStorage.deletePhoto).toHaveBeenCalledWith('test-1');
      expect(result.current.photos).toHaveLength(0);
    });

    it('should reorder remaining photos after deletion', async () => {
      vi.mocked(photoStorage.deletePhoto).mockResolvedValue();
      vi.mocked(photoStorage.reorderPhotos).mockResolvedValue();

      const { result } = renderHook(() => usePhotoStore());

      act(() => {
        usePhotoStore.setState({
          photos: [
            { ...mockPhoto, id: 'photo-1', order: 0 },
            { ...mockPhoto, id: 'photo-2', order: 1 },
            { ...mockPhoto, id: 'photo-3', order: 2 },
          ],
        });
      });

      await act(async () => {
        await result.current.deletePhoto('photo-2');
      });

      expect(result.current.photos).toHaveLength(2);
      expect(result.current.photos[0].order).toBe(0);
      expect(result.current.photos[1].order).toBe(1);
      expect(photoStorage.reorderPhotos).toHaveBeenCalled();
    });
  });

  describe('reorderPhotos', () => {
    it('should reorder photos', async () => {
      vi.mocked(photoStorage.reorderPhotos).mockResolvedValue();

      const { result } = renderHook(() => usePhotoStore());

      const photos = [
        { ...mockPhoto, id: 'photo-1', order: 0 },
        { ...mockPhoto, id: 'photo-2', order: 1 },
      ];

      act(() => {
        usePhotoStore.setState({ photos });
      });

      const reordered = [photos[1], photos[0]];

      await act(async () => {
        await result.current.reorderPhotos(reordered);
      });

      expect(result.current.photos[0].id).toBe('photo-2');
      expect(result.current.photos[0].order).toBe(0);
      expect(result.current.photos[1].id).toBe('photo-1');
      expect(result.current.photos[1].order).toBe(1);
    });
  });

  describe('viewer controls', () => {
    it('should open viewer with photo index', () => {
      const { result } = renderHook(() => usePhotoStore());

      act(() => {
        result.current.openViewer(2);
      });

      expect(result.current.isViewerOpen).toBe(true);
      expect(result.current.currentPhotoIndex).toBe(2);
    });

    it('should close viewer', () => {
      const { result } = renderHook(() => usePhotoStore());

      act(() => {
        result.current.openViewer(1);
      });

      expect(result.current.isViewerOpen).toBe(true);

      act(() => {
        result.current.closeViewer();
      });

      expect(result.current.isViewerOpen).toBe(false);
      expect(result.current.currentPhotoIndex).toBeNull();
    });

    it('should set current photo index', () => {
      const { result } = renderHook(() => usePhotoStore());

      act(() => {
        result.current.setCurrentPhotoIndex(3);
      });

      expect(result.current.currentPhotoIndex).toBe(3);
    });
  });
});

