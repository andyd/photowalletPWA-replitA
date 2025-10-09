import { useState, useEffect } from 'react';
import type { Photo } from '@shared/schema';

interface PhotoCardProps {
  photo: Photo;
  index: number;
  onPhotoClick: (index: number) => void;
  onDelete: (id: string) => void;
}

export function PhotoCard({ photo, index, onPhotoClick }: PhotoCardProps) {
  const [imageUrl, setImageUrl] = useState<string>('');

  useEffect(() => {
    const url = URL.createObjectURL(photo.blob);
    setImageUrl(url);
    return () => URL.revokeObjectURL(url);
  }, [photo.blob]);

  return (
    <button
      className="aspect-square rounded-[3px] overflow-hidden cursor-pointer transition-transform active:scale-95"
      onClick={() => onPhotoClick(index)}
      data-testid={`card-photo-${photo.id}`}
    >
      <img
        src={imageUrl}
        alt={photo.filename}
        className="w-full h-full object-cover"
        data-testid={`img-photo-${photo.id}`}
      />
    </button>
  );
}
