import { PhotoGrid } from '../PhotoGrid';
import type { Photo } from '@shared/schema';

export default function PhotoGridExample() {
  // Create mock photos
  const mockPhotos: Photo[] = Array.from({ length: 6 }, (_, i) => ({
    id: `photo-${i}`,
    blob: new Blob(['mock'], { type: 'image/jpeg' }),
    thumbnail: new Blob(['mock'], { type: 'image/jpeg' }),
    filename: `photo-${i}.jpg`,
    order: i,
    createdAt: new Date(),
  }));

  return (
    <PhotoGrid
      photos={mockPhotos}
      onPhotoClick={(index) => console.log('Photo clicked:', index)}
      onDelete={(id) => console.log('Delete photo:', id)}
      onAddPhotos={(files) => console.log('Add photos:', files)}
    />
  );
}
