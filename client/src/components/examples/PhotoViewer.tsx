import { useState } from 'react';
import { PhotoViewer } from '../PhotoViewer';
import { Button } from '@/components/ui/button';
import type { Photo } from '@shared/schema';

export default function PhotoViewerExample() {
  const [isOpen, setIsOpen] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);

  // Create mock photos
  const mockPhotos: Photo[] = Array.from({ length: 3 }, (_, i) => ({
    id: `photo-${i}`,
    blob: new Blob(['mock'], { type: 'image/jpeg' }),
    thumbnail: new Blob(['mock'], { type: 'image/jpeg' }),
    filename: `photo-${i}.jpg`,
    order: i,
    createdAt: new Date(),
  }));

  return (
    <>
      <div className="p-8">
        <Button onClick={() => setIsOpen(true)}>
          Open Viewer
        </Button>
      </div>
      <PhotoViewer
        photos={mockPhotos}
        currentIndex={currentIndex}
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        onIndexChange={setCurrentIndex}
        onDeletePhoto={(id) => console.log('Delete photo:', id)}
      />
    </>
  );
}
