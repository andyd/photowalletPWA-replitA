import { create } from 'zustand';
import type { Photo } from '@shared/schema';
import { photoStorage } from '@/services/photoStorage';
import { generateThumbnail } from '@/utils/thumbnailGenerator';
import { MAX_PHOTOS } from '@/utils/constants';

interface PhotoStore {
  photos: Photo[];
  archivedPhotos: Photo[];
  isLoading: boolean;
  currentPhotoIndex: number | null;
  isViewerOpen: boolean;
  
  loadPhotos: () => Promise<void>;
  loadArchivedPhotos: () => Promise<void>;
  addPhoto: (file: File) => Promise<void>;
  deletePhoto: (id: string) => Promise<void>;
  unarchivePhoto: (id: string) => Promise<void>;
  deleteArchivedPhoto: (id: string) => Promise<void>;
  reorderPhotos: (reorderedPhotos: Photo[]) => Promise<void>;
  openViewer: (index: number) => void;
  closeViewer: () => void;
  setCurrentPhotoIndex: (index: number) => void;
}

export const usePhotoStore = create<PhotoStore>((set, get) => ({
  photos: [],
  archivedPhotos: [],
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

  loadArchivedPhotos: async () => {
    try {
      const archivedPhotos = await photoStorage.getArchivedPhotos();
      set({ archivedPhotos });
    } catch (error) {
      console.error('Failed to load archived photos:', error);
    }
  },

  addPhoto: async (file: File) => {
    const { photos } = get();

    // Enforce hard limit - don't allow adding if at 18 photos
    if (photos.length >= MAX_PHOTOS) {
      const error = new Error(`WALLET_FULL:Maximum of ${MAX_PHOTOS} photos allowed`);
      throw error;
    }

    set({ isLoading: true });
    try {
      // Generate thumbnail while processing the file
      const [blob, thumbnail] = await Promise.all([
        file.arrayBuffer().then((buffer) => new Blob([buffer], { type: file.type })),
        generateThumbnail(file),
      ]);

      const currentPhotos = get().photos;
      const photo: Photo = {
        id: crypto.randomUUID(),
        blob,
        thumbnail,
        filename: file.name,
        order: currentPhotos.length,
        createdAt: new Date(),
        archived: false,
      };

      await photoStorage.addPhoto(photo);
      set({ photos: [...currentPhotos, photo], isLoading: false });
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

  unarchivePhoto: async (id: string) => {
    const { photos } = get();
    
    // If at limit, can't restore from overflow
    if (photos.length >= MAX_PHOTOS) {
      throw new Error(`Cannot restore: wallet is at maximum capacity (${MAX_PHOTOS} photos)`);
    }

    try {
      await photoStorage.unarchivePhoto(id);
      const updatedPhotos = await photoStorage.getAllPhotos();
      const updatedArchive = await photoStorage.getArchivedPhotos();
      set({ photos: updatedPhotos, archivedPhotos: updatedArchive });
    } catch (error) {
      console.error('Failed to restore photo:', error);
      throw error;
    }
  },

  deleteArchivedPhoto: async (id: string) => {
    try {
      await photoStorage.deletePhoto(id);
      const updatedArchive = await photoStorage.getArchivedPhotos();
      set({ archivedPhotos: updatedArchive });
    } catch (error) {
      console.error('Failed to delete archived photo:', error);
    }
  },
}));
