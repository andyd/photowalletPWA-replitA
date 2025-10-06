import { Upload, Wallet } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

interface EmptyStateProps {
  onUploadClick: () => void;
}

export function EmptyState({ onUploadClick }: EmptyStateProps) {
  return (
    <div className="flex items-center justify-center min-h-[60vh] px-4">
      <Card className="p-12 text-center max-w-md w-full">
        <div className="flex justify-center mb-6">
          <div className="w-20 h-20 rounded-full bg-muted flex items-center justify-center">
            <Wallet className="w-10 h-10 text-muted-foreground" />
          </div>
        </div>
        <h2 className="text-2xl font-semibold mb-3" data-testid="text-empty-title">
          No Photos Yet
        </h2>
        <p className="text-muted-foreground mb-8" data-testid="text-empty-description">
          Add your first cherished photo to start building your digital wallet collection.
        </p>
        <Button 
          size="lg" 
          onClick={onUploadClick}
          data-testid="button-add-first-photo"
          className="w-full"
        >
          <Upload className="w-4 h-4 mr-2" />
          Add Your First Photo
        </Button>
      </Card>
    </div>
  );
}
