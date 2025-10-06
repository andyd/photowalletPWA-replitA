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
    const url = URL.createObjectURL(photo.blob);
    setImageUrl(url);
    return () => URL.revokeObjectURL(url);
  }, [photo.blob]);

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
    >
      <img
        src={imageUrl}
        alt={photo.filename}
        className="w-full h-full object-cover"
        data-testid={`img-photo-${photo.id}`}
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
      <Button
        size="icon"
        variant="destructive"
        className={`absolute top-2 right-2 w-8 h-8 transition-all ${
          showDelete ? 'opacity-100 scale-100' : 'opacity-0 scale-75'
        }`}
        onClick={handleDelete}
        data-testid={`button-delete-${photo.id}`}
      >
        <Trash2 className="w-4 h-4" />
      </Button>
    </Card>
  );
}
