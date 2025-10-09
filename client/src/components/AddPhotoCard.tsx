import { useRef } from 'react';
import { Plus } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { ACCEPTED_IMAGE_TYPES, MAX_PHOTOS } from '@/utils/constants';

interface AddPhotoCardProps {
  onPhotoSelect: (files: FileList) => void;
  disabled?: boolean;
  photoCount: number;
}

const ACCEPTED_TYPES = ACCEPTED_IMAGE_TYPES;

export function AddPhotoCard({ onPhotoSelect, disabled, photoCount }: AddPhotoCardProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const isAtLimit = photoCount >= MAX_PHOTOS;

  const handleClick = () => {
    if (isAtLimit) return;
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
        className={`relative aspect-square overflow-hidden flex items-center justify-center border-2 border-dashed ${
          isAtLimit || disabled
            ? 'opacity-50 cursor-not-allowed bg-muted'
            : 'cursor-pointer bg-muted hover-elevate active-elevate-2'
        }`}
        data-testid="button-add-photo-card"
        role="button"
        tabIndex={isAtLimit || disabled ? -1 : 0}
        aria-label={isAtLimit ? `Photo limit reached: ${MAX_PHOTOS} photos maximum` : 'Add photos to your wallet'}
        aria-disabled={isAtLimit || disabled}
        onKeyDown={(e) => {
          if ((e.key === 'Enter' || e.key === ' ') && !isAtLimit && !disabled) {
            e.preventDefault();
            handleClick();
          }
        }}
      >
        <div className="flex flex-col items-center gap-2 text-muted-foreground">
          <Plus className="w-8 h-8" aria-hidden="true" />
          <span className="text-sm font-medium">
            {isAtLimit ? `Limit: ${MAX_PHOTOS}` : 'Add Photos'}
          </span>
        </div>
      </Card>
    </>
  );
}
