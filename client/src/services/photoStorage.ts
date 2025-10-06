import Dexie, { type Table } from 'dexie';
import type { Photo } from '@shared/schema';

class PhotoDatabase extends Dexie {
  photos!: Table<Photo>;

  constructor() {
    super('PhotoWalletDB');
    this.version(1).stores({
      photos: 'id, order, createdAt',
    });
  }
}

export const db = new PhotoDatabase();

export const photoStorage = {
  async getAllPhotos(): Promise<Photo[]> {
    return await db.photos.orderBy('order').toArray();
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

  async reorderPhotos(photos: Photo[]): Promise<void> {
    await db.transaction('rw', db.photos, async () => {
      for (const photo of photos) {
        await db.photos.update(photo.id, { order: photo.order });
      }
    });
  },

  async getPhotoCount(): Promise<number> {
    return await db.photos.count();
  },

  async clearAll(): Promise<void> {
    await db.photos.clear();
  },
};
