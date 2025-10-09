import type { Photo } from '@shared/schema';
import { PhotoCard } from './PhotoCard';
import { AddPhotoCard } from './AddPhotoCard';
import { MAX_PHOTOS } from '@/hooks/usePhotoStore';

interface PhotoGridProps {
  photos: Photo[];
  onPhotoClick: (index: number) => void;
  onDelete: (id: string) => void;
  onAddPhotos: (files: FileList) => void;
}

export function PhotoGrid({ photos, onPhotoClick, onDelete, onAddPhotos }: PhotoGridProps) {
  const emptySlots = MAX_PHOTOS - photos.length;
  
  return (
    <div className="px-4 pb-8" data-testid="container-photo-grid">
      <div className="grid grid-cols-3 gap-[2px] max-w-md mx-auto">
        {/* Existing photos */}
        {photos.map((photo, index) => (
          <PhotoCard
            key={photo.id}
            photo={photo}
            index={index}
            onPhotoClick={onPhotoClick}
            onDelete={onDelete}
          />
        ))}
        
        {/* Empty slots */}
        {Array.from({ length: emptySlots }, (_, i) => (
          <div
            key={`empty-${i}`}
            className="aspect-square rounded-[3px] bg-[#1A1A1A] border border-dashed border-[#333333]"
          />
        ))}
      </div>
      
      {/* Photo counter */}
      <p className="text-center text-[12px] text-secondary mt-6" data-testid="text-photo-count">
        {photos.length} of {MAX_PHOTOS} photos
      </p>
    </div>
  );
}
