import { Upload, Wallet } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface EmptyStateProps {
  onUploadClick: () => void;
}

export function EmptyState({ onUploadClick }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-4 pb-4">
      <div className="flex flex-col items-center max-w-2xl w-full">
        {/* App Name - Centered and Large */}
        <h1 className="text-5xl md:text-6xl font-bold mb-6 text-center tracking-tight">
          Photo Wallet
        </h1>

        {/* App Description */}
        <p className="text-xl md:text-2xl text-muted-foreground mb-16 text-center">
          The photos you want with you all the time
        </p>

        {/* Large App Icon */}
        <div className="mb-24">
          <Wallet className="w-32 h-32 text-muted-foreground" />
        </div>

        {/* Large Add Photos Button */}
        <Button 
          size="lg" 
          onClick={onUploadClick}
          data-testid="button-add-first-photo"
          className="text-lg px-12 py-8 h-auto rounded-2xl shadow-lg hover:shadow-xl transition-all mb-4"
        >
          <Upload className="w-6 h-6 mr-3" />
          Add Photos
        </Button>
      </div>
    </div>
  );
}
