import type { Photo } from '@shared/schema';
import { PhotoCard } from './PhotoCard';
import { useResponsiveGrid } from '@/hooks/useResponsiveGrid';

interface PhotoGridProps {
  photos: Photo[];
  onPhotoClick: (index: number) => void;
  onDelete: (id: string) => void;
}

export function PhotoGrid({ photos, onPhotoClick, onDelete }: PhotoGridProps) {
  const { columns } = useResponsiveGrid();
  
  return (
    <div
      className="grid gap-2 p-4 pb-8"
      style={{
        gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))`,
      }}
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
    </div>
  );
}
