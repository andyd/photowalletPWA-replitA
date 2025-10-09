// App Configuration Constants

/** Maximum number of photos allowed in the wallet */
export const MAX_PHOTOS = 12;

/** Maximum file size for photo uploads (10MB) */
export const MAX_FILE_SIZE = 10 * 1024 * 1024;

/** Accepted image file types */
export const ACCEPTED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp'];

/** Mime types for file input accept attribute */
export const ACCEPTED_IMAGE_MIMES = ACCEPTED_IMAGE_TYPES.join(',');
