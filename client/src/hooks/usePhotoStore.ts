import { create } from 'zustand';
import type { Photo } from '@shared/schema';
import { photoStorage } from '@/services/photoStorage';

interface PhotoStore {
  photos: Photo[];
  isLoading: boolean;
  currentPhotoIndex: number | null;
  isViewerOpen: boolean;
  
  loadPhotos: () => Promise<void>;
  addPhoto: (file: File) => Promise<void>;
  deletePhoto: (id: string) => Promise<void>;
  reorderPhotos: (reorderedPhotos: Photo[]) => Promise<void>;
  openViewer: (index: number) => void;
  closeViewer: () => void;
  setCurrentPhotoIndex: (index: number) => void;
}

export const usePhotoStore = create<PhotoStore>((set, get) => ({
  photos: [],
  isLoading: false,
  currentPhotoIndex: null,
  isViewerOpen: false,

  loadPhotos: async () => {
    set({ isLoading: true });
    try {
      const photos = await photoStorage.getAllPhotos();
      set({ photos, isLoading: false });
    } catch (error) {
      console.error('Failed to load photos:', error);
      set({ isLoading: false });
    }
  },

  addPhoto: async (file: File) => {
    const { photos } = get();
    set({ isLoading: true });
    try {
      const blob = new Blob([await file.arrayBuffer()], { type: file.type });
      const photo: Photo = {
        id: crypto.randomUUID(),
        blob,
        filename: file.name,
        order: photos.length,
        createdAt: new Date(),
      };

      await photoStorage.addPhoto(photo);
      set({ photos: [...photos, photo], isLoading: false });
    } catch (error) {
      console.error('Failed to add photo:', error);
      set({ isLoading: false });
      throw error;
    }
  },

  deletePhoto: async (id: string) => {
    set({ isLoading: true });
    try {
      await photoStorage.deletePhoto(id);
      const { photos } = get();
      const updatedPhotos = photos
        .filter(p => p.id !== id)
        .map((p, index) => ({ ...p, order: index }));
      
      await photoStorage.reorderPhotos(updatedPhotos);
      set({ photos: updatedPhotos, isLoading: false });
    } catch (error) {
      console.error('Failed to delete photo:', error);
      set({ isLoading: false });
    }
  },

  reorderPhotos: async (reorderedPhotos: Photo[]) => {
    const photosWithNewOrder = reorderedPhotos.map((photo, index) => ({
      ...photo,
      order: index,
    }));

    set({ photos: photosWithNewOrder });
    try {
      await photoStorage.reorderPhotos(photosWithNewOrder);
    } catch (error) {
      console.error('Failed to reorder photos:', error);
    }
  },

  openViewer: (index: number) => {
    set({ isViewerOpen: true, currentPhotoIndex: index });
  },

  closeViewer: () => {
    set({ isViewerOpen: false, currentPhotoIndex: null });
  },

  setCurrentPhotoIndex: (index: number) => {
    set({ currentPhotoIndex: index });
  },
}));
