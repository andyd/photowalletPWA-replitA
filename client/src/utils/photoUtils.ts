import type { Photo } from '@shared/schema';

export async function getFileHash(file: File): Promise<string> {
  const arrayBuffer = await file.arrayBuffer();
  const hashBuffer = await crypto.subtle.digest('SHA-256', arrayBuffer);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  return hashHex;
}

export async function isDuplicatePhoto(file: File, existingPhotos: Photo[]): Promise<boolean> {
  const newFileHash = await getFileHash(file);
  
  for (const photo of existingPhotos) {
    const existingFileHash = await getFileHash(new File([photo.blob], photo.filename));
    if (newFileHash === existingFileHash) {
      return true;
    }
  }
  
  return false;
}
