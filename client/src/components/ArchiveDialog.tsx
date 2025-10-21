import { useEffect, useState } from 'react';
import { Archive, Trash2, RotateCcw } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { usePhotoStore } from '@/hooks/usePhotoStore';
import type { Photo } from '@shared/schema';

interface ArchiveDialogProps {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

export function ArchiveDialog({ open, onOpenChange }: ArchiveDialogProps) {
  const { archivedPhotos, loadArchivedPhotos, unarchivePhoto, deleteArchivedPhoto, photos } = usePhotoStore();
  const [isUnarchiving, setIsUnarchiving] = useState<string | null>(null);

  useEffect(() => {
    if (open) {
      loadArchivedPhotos();
    }
  }, [open, loadArchivedPhotos]);

  const handleUnarchive = async (id: string) => {
    if (photos.length >= 18) {
      alert('Cannot restore: Your wallet is full (18 photos). Remove a photo first.');
      return;
    }

    setIsUnarchiving(id);
    try {
      await unarchivePhoto(id);
    } catch (error) {
      console.error('Failed to unarchive:', error);
    } finally {
      setIsUnarchiving(null);
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm('Permanently delete this archived photo? This cannot be undone.')) {
      await deleteArchivedPhoto(id);
    }
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    }).format(new Date(date));
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[80vh]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Archive className="w-5 h-5" />
            Overflow Folder
          </DialogTitle>
          <DialogDescription>
            Photos removed from your wallet are stored here. Your wallet holds up to 18 photos.
          </DialogDescription>
        </DialogHeader>

        {archivedPhotos.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <Archive className="w-16 h-16 text-muted-foreground mb-4" />
            <p className="text-lg font-medium mb-2">Overflow Folder is Empty</p>
            <p className="text-sm text-muted-foreground max-w-md">
              Removed photos are stored here. You can restore them to your wallet anytime.
            </p>
          </div>
        ) : (
          <ScrollArea className="h-[400px] pr-4">
            <div className="grid grid-cols-2 gap-4">
              {archivedPhotos.map((photo) => (
                <div
                  key={photo.id}
                  className="relative group rounded-lg overflow-hidden border border-border bg-card"
                >
                  <div className="aspect-square relative">
                    <img
                      src={URL.createObjectURL(photo.thumbnail)}
                      alt={photo.filename}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>

                  <div className="p-3">
                    <p className="text-sm font-medium truncate mb-1">{photo.filename}</p>
                    <p className="text-xs text-muted-foreground">
                      Removed {photo.archivedAt ? formatDate(photo.archivedAt) : 'recently'}
                    </p>
                  </div>

                  <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity flex gap-1">
                    <Button
                      size="icon"
                      variant="secondary"
                      className="h-8 w-8"
                      onClick={() => handleUnarchive(photo.id)}
                      disabled={isUnarchiving === photo.id || photos.length >= 18}
                      title={photos.length >= 18 ? 'Wallet is full (18 photos)' : 'Restore to wallet'}
                    >
                      <RotateCcw className="w-4 h-4" />
                    </Button>
                    <Button
                      size="icon"
                      variant="destructive"
                      className="h-8 w-8"
                      onClick={() => handleDelete(photo.id)}
                      title="Delete permanently"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>
        )}

        <div className="flex items-center justify-between pt-4 border-t">
          <p className="text-sm text-muted-foreground">
            {archivedPhotos.length} overflow {archivedPhotos.length === 1 ? 'photo' : 'photos'}
          </p>
          <Button variant="outline" onClick={() => onOpenChange?.(false)}>
            Close
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

