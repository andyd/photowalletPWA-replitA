// Storage interface - not used in this PWA (fully client-side)
export interface IStorage {}

export class MemStorage implements IStorage {
  constructor() {}
}

export const storage = new MemStorage();
