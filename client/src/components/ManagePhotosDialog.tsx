import { useState, useEffect } from 'react';
import { Trash2, Image as ImageIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import type { Photo } from '@shared/schema';

interface ManagePhotosDialogProps {
  photos: Photo[];
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onDelete: (id: string) => void;
}

export function ManagePhotosDialog({ photos, open, onOpenChange, onDelete }: ManagePhotosDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[80vh]" data-testid="dialog-manage-photos">
        <DialogHeader>
          <DialogTitle>Manage Photos</DialogTitle>
          <DialogDescription>
            Remove photos from your wallet. Removed photos are saved in the Overflow Folder.
          </DialogDescription>
        </DialogHeader>
        <ScrollArea className="h-[500px] pr-4">
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {photos.map((photo) => (
              <PhotoItem
                key={photo.id}
                photo={photo}
                onDelete={onDelete}
              />
            ))}
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}

function PhotoItem({ photo, onDelete }: { photo: Photo; onDelete: (id: string) => void }) {
  const [imageUrl, setImageUrl] = useState<string>('');

  useEffect(() => {
    const url = URL.createObjectURL(photo.blob);
    setImageUrl(url);
    return () => URL.revokeObjectURL(url);
  }, [photo.blob]);

  return (
    <div className="relative group">
      <div className="aspect-square rounded-lg overflow-hidden bg-muted">
        {imageUrl ? (
          <img
            src={imageUrl}
            alt={photo.filename}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <ImageIcon className="w-8 h-8 text-muted-foreground" />
          </div>
        )}
      </div>
      <Button
        size="icon"
        variant="destructive"
        className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
        onClick={() => onDelete(photo.id)}
        data-testid={`button-manage-delete-${photo.id}`}
      >
        <Trash2 className="w-4 h-4" />
      </Button>
      <p className="text-xs text-muted-foreground mt-1 truncate" title={photo.filename}>
        {photo.filename}
      </p>
    </div>
  );
}
