import { useRef } from 'react';
import { Plus } from 'lucide-react';
import { Card } from '@/components/ui/card';

interface AddPhotoCardProps {
  onPhotoSelect: (files: FileList) => void;
  disabled?: boolean;
}

const ACCEPTED_TYPES = ['image/jpeg', 'image/png', 'image/webp'];

export function AddPhotoCard({ onPhotoSelect, disabled }: AddPhotoCardProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      onPhotoSelect(files);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  return (
    <>
      <input
        ref={fileInputRef}
        type="file"
        accept={ACCEPTED_TYPES.join(',')}
        onChange={handleFileChange}
        multiple
        className="hidden"
        data-testid="input-photo-upload"
      />
      <Card
        onClick={handleClick}
        className="relative aspect-square overflow-hidden cursor-pointer bg-muted hover-elevate active-elevate-2 flex items-center justify-center border-2 border-dashed"
        data-testid="button-add-photo-card"
      >
        <div className="flex flex-col items-center gap-2 text-muted-foreground">
          <Plus className="w-8 h-8" />
          <span className="text-sm font-medium">Add Photos</span>
        </div>
      </Card>
    </>
  );
}
