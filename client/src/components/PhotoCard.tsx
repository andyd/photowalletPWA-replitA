import { useState, useEffect } from 'react';
import { Trash2 } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import type { Photo } from '@shared/schema';

interface PhotoCardProps {
  photo: Photo;
  index: number;
  onPhotoClick: (index: number) => void;
  onDelete: (id: string) => void;
}

export function PhotoCard({ photo, index, onPhotoClick, onDelete }: PhotoCardProps) {
  const [imageUrl, setImageUrl] = useState<string>('');
  const [showDelete, setShowDelete] = useState(false);

  useEffect(() => {
    // Use thumbnail for grid display, fallback to full image if thumbnail doesn't exist
    const blob = photo.thumbnail || photo.blob;
    const url = URL.createObjectURL(blob);
    setImageUrl(url);
    return () => URL.revokeObjectURL(url);
  }, [photo.thumbnail, photo.blob]);

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    onDelete(photo.id);
  };

  return (
    <Card
      className="relative aspect-square overflow-hidden cursor-pointer group hover-elevate active-elevate-2"
      onClick={() => onPhotoClick(index)}
      onMouseEnter={() => setShowDelete(true)}
      onMouseLeave={() => setShowDelete(false)}
      data-testid={`card-photo-${photo.id}`}
      role="button"
      tabIndex={0}
      aria-label={`View photo: ${photo.filename}`}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onPhotoClick(index);
        }
      }}
    >
      <img
        src={imageUrl}
        alt={photo.filename}
        className="w-full h-full object-cover"
        data-testid={`img-photo-${photo.id}`}
        loading="lazy"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" aria-hidden="true" />
      <Button
        size="icon"
        variant="destructive"
        className={`absolute top-2 right-2 w-8 h-8 transition-all ${
          showDelete ? 'opacity-100 scale-100' : 'opacity-0 scale-75'
        }`}
        onClick={handleDelete}
        data-testid={`button-delete-${photo.id}`}
        aria-label={`Delete photo: ${photo.filename}`}
      >
        <Trash2 className="w-4 h-4" aria-hidden="true" />
      </Button>
    </Card>
  );
}
