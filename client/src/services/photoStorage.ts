import Dexie, { type Table } from 'dexie';
import type { Photo } from '@shared/schema';

class PhotoDatabase extends Dexie {
  photos!: Table<Photo>;

  constructor() {
    super('PhotoWalletDB');
    // Version 1: Original schema
    this.version(1).stores({
      photos: 'id, order, createdAt',
    });
    // Version 2: Added thumbnail support
    this.version(2).stores({
      photos: 'id, order, createdAt',
    }).upgrade(async (trans) => {
      console.log('Database upgraded to version 2 with thumbnail support');
    });
    // Version 3: Added archive support
    this.version(3).stores({
      photos: 'id, order, createdAt, archived, archivedAt',
    }).upgrade(async (trans) => {
      console.log('Database upgraded to version 3 with archive support');
    });
  }
}

export const db = new PhotoDatabase();

export const photoStorage = {
  async getAllPhotos(): Promise<Photo[]> {
    return await db.photos
      .filter(photo => !photo.archived)
      .sortBy('order');
  },

  async getArchivedPhotos(): Promise<Photo[]> {
    const archived = await db.photos
      .filter(photo => photo.archived === true)
      .toArray();
    return archived.sort((a, b) => {
      const dateA = a.archivedAt?.getTime() || 0;
      const dateB = b.archivedAt?.getTime() || 0;
      return dateB - dateA; // newest first
    });
  },

  async getPhoto(id: string): Promise<Photo | undefined> {
    return await db.photos.get(id);
  },

  async addPhoto(photo: Photo): Promise<string> {
    return await db.photos.add(photo);
  },

  async updatePhoto(id: string, updates: Partial<Photo>): Promise<void> {
    await db.photos.update(id, updates);
  },

  async deletePhoto(id: string): Promise<void> {
    await db.photos.delete(id);
  },

  async archivePhoto(id: string): Promise<void> {
    await db.photos.update(id, {
      archived: true,
      archivedAt: new Date(),
    });
  },

  async unarchivePhoto(id: string): Promise<void> {
    // Get current max order for active photos
    const activePhotos = await this.getAllPhotos();
    const maxOrder = activePhotos.length > 0 
      ? Math.max(...activePhotos.map(p => p.order))
      : -1;
    
    await db.photos.update(id, {
      archived: false,
      archivedAt: undefined,
      order: maxOrder + 1,
    });
  },

  async archiveOldestPhotos(count: number): Promise<Photo[]> {
    const activePhotos = await this.getAllPhotos();
    const photosToArchive = activePhotos
      .sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime())
      .slice(0, count);
    
    for (const photo of photosToArchive) {
      await this.archivePhoto(photo.id);
    }
    
    return photosToArchive;
  },

  async reorderPhotos(photos: Photo[]): Promise<void> {
    await db.transaction('rw', db.photos, async () => {
      for (const photo of photos) {
        await db.photos.update(photo.id, { order: photo.order });
      }
    });
  },

  async getPhotoCount(): Promise<number> {
    return await db.photos.filter(photo => !photo.archived).count();
  },

  async clearAll(): Promise<void> {
    await db.photos.clear();
  },
};
