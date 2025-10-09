/**
 * Thumbnail Generation Utility
 *
 * Generates square-cropped thumbnails from images using Canvas API.
 * Thumbnails are center-cropped to maintain aspect ratio and optimized for grid display.
 */

const THUMBNAIL_SIZE = 400; // 400x400px thumbnails for retina displays
const THUMBNAIL_QUALITY = 0.85; // JPEG quality (0-1)

/**
 * Generates a square thumbnail from an image file
 * @param file - The image file to process
 * @returns Promise<Blob> - The thumbnail as a Blob
 */
export async function generateThumbnail(file: File): Promise<Blob> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');

    if (!ctx) {
      reject(new Error('Failed to get canvas context'));
      return;
    }

    img.onload = () => {
      try {
        // Set canvas to square dimensions
        canvas.width = THUMBNAIL_SIZE;
        canvas.height = THUMBNAIL_SIZE;

        // Calculate center-crop dimensions
        const sourceSize = Math.min(img.width, img.height);
        const sourceX = (img.width - sourceSize) / 2;
        const sourceY = (img.height - sourceSize) / 2;

        // Draw center-cropped image
        ctx.drawImage(
          img,
          sourceX,
          sourceY,
          sourceSize,
          sourceSize,
          0,
          0,
          THUMBNAIL_SIZE,
          THUMBNAIL_SIZE
        );

        // Convert canvas to blob
        canvas.toBlob(
          (blob) => {
            if (blob) {
              resolve(blob);
            } else {
              reject(new Error('Failed to generate thumbnail blob'));
            }
            // Clean up
            URL.revokeObjectURL(img.src);
          },
          'image/jpeg',
          THUMBNAIL_QUALITY
        );
      } catch (error) {
        reject(error);
        URL.revokeObjectURL(img.src);
      }
    };

    img.onerror = () => {
      reject(new Error('Failed to load image'));
      URL.revokeObjectURL(img.src);
    };

    // Load the image
    img.src = URL.createObjectURL(file);
  });
}

/**
 * Generates thumbnails for multiple files in parallel
 * @param files - Array of image files
 * @returns Promise<Blob[]> - Array of thumbnail Blobs
 */
export async function generateThumbnails(files: File[]): Promise<Blob[]> {
  return Promise.all(files.map((file) => generateThumbnail(file)));
}
