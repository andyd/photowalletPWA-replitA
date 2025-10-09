import type { Photo } from '@shared/schema';
import { PhotoCard } from './PhotoCard';
import { AddPhotoCard } from './AddPhotoCard';

interface PhotoGridProps {
  photos: Photo[];
  onPhotoClick: (index: number) => void;
  onDelete: (id: string) => void;
  onAddPhotos: (files: FileList) => void;
}

export function PhotoGrid({ photos, onPhotoClick, onDelete, onAddPhotos }: PhotoGridProps) {
  return (
    <div
      className="grid grid-cols-3 gap-2 p-4 pb-8"
      data-testid="container-photo-grid"
    >
      {photos.map((photo, index) => (
        <PhotoCard
          key={photo.id}
          photo={photo}
          index={index}
          onPhotoClick={onPhotoClick}
          onDelete={onDelete}
        />
      ))}
      <AddPhotoCard
        onPhotoSelect={onAddPhotos}
        photoCount={photos.length}
      />
    </div>
  );
}
