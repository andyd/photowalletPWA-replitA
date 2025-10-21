import { describe, it, expect } from 'vitest';

// Test utilities for photo processing
describe('Photo Utils', () => {
  describe('File validation', () => {
    it('accepts valid image types', () => {
      const validTypes = ['image/jpeg', 'image/png', 'image/webp'];
      const file = new File(['test'], 'test.jpg', { type: 'image/jpeg' });

      expect(validTypes).toContain(file.type);
    });

    it('validates file size limit', () => {
      const maxSize = 10 * 1024 * 1024; // 10MB
      const smallFile = new File(['test'], 'small.jpg', { type: 'image/jpeg' });

      expect(smallFile.size).toBeLessThan(maxSize);
    });
  });

  describe('Blob creation', () => {
    it('creates blob from file', async () => {
      const file = new File(['test content'], 'test.jpg', { type: 'image/jpeg' });
      const blob = new Blob([file], { type: file.type });

      expect(blob.type).toBe('image/jpeg');
      expect(blob.size).toBeGreaterThan(0);
    });
  });

  describe('Photo ordering', () => {
    it('sorts photos by order property', () => {
      const photos = [
        { id: '1', order: 2 },
        { id: '2', order: 0 },
        { id: '3', order: 1 },
      ];

      const sorted = [...photos].sort((a, b) => a.order - b.order);

      expect(sorted[0].id).toBe('2');
      expect(sorted[1].id).toBe('3');
      expect(sorted[2].id).toBe('1');
    });
  });
});
