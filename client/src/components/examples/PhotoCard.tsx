import { PhotoCard } from '../PhotoCard';
import type { Photo } from '@shared/schema';

export default function PhotoCardExample() {
  // Create a mock photo with a placeholder blob
  const mockPhoto: Photo = {
    id: '1',
    blob: new Blob(['mock'], { type: 'image/jpeg' }),
    thumbnail: new Blob(['mock'], { type: 'image/jpeg' }),
    filename: 'example.jpg',
    order: 0,
    createdAt: new Date(),
  };

  return (
    <div className="p-8 grid grid-cols-2 gap-4 max-w-md">
      <PhotoCard
        photo={mockPhoto}
        index={0}
        onPhotoClick={(index) => console.log('Photo clicked:', index)}
        onDelete={(id) => console.log('Delete photo:', id)}
      />
    </div>
  );
}
