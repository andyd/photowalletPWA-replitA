import { describe, it, expect } from 'vitest';
import {
  MAX_PHOTOS,
  MAX_FILE_SIZE,
  ACCEPTED_IMAGE_TYPES,
  ACCEPTED_IMAGE_MIMES,
} from '../constants';

describe('constants', () => {
  describe('MAX_PHOTOS', () => {
    it('should be set to 18', () => {
      expect(MAX_PHOTOS).toBe(18);
    });

    it('should be a positive integer', () => {
      expect(MAX_PHOTOS).toBeGreaterThan(0);
      expect(Number.isInteger(MAX_PHOTOS)).toBe(true);
    });
  });

  describe('MAX_FILE_SIZE', () => {
    it('should be 10MB in bytes', () => {
      const tenMB = 10 * 1024 * 1024;
      expect(MAX_FILE_SIZE).toBe(tenMB);
    });

    it('should equal 10485760 bytes', () => {
      expect(MAX_FILE_SIZE).toBe(10485760);
    });
  });

  describe('ACCEPTED_IMAGE_TYPES', () => {
    it('should include jpeg, png, and webp', () => {
      expect(ACCEPTED_IMAGE_TYPES).toContain('image/jpeg');
      expect(ACCEPTED_IMAGE_TYPES).toContain('image/png');
      expect(ACCEPTED_IMAGE_TYPES).toContain('image/webp');
    });

    it('should have exactly 3 image types', () => {
      expect(ACCEPTED_IMAGE_TYPES).toHaveLength(3);
    });

    it('should all start with "image/"', () => {
      ACCEPTED_IMAGE_TYPES.forEach((type) => {
        expect(type).toMatch(/^image\//);
      });
    });
  });

  describe('ACCEPTED_IMAGE_MIMES', () => {
    it('should be a comma-separated string', () => {
      expect(ACCEPTED_IMAGE_MIMES).toContain(',');
    });

    it('should equal joined ACCEPTED_IMAGE_TYPES', () => {
      expect(ACCEPTED_IMAGE_MIMES).toBe(ACCEPTED_IMAGE_TYPES.join(','));
    });

    it('should be usable in file input accept attribute', () => {
      expect(ACCEPTED_IMAGE_MIMES).toBe('image/jpeg,image/png,image/webp');
    });
  });
});

