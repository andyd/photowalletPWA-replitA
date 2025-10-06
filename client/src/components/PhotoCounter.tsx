import { Badge } from '@/components/ui/badge';

interface PhotoCounterProps {
  count: number;
}

export function PhotoCounter({ count }: PhotoCounterProps) {
  return (
    <Badge 
      variant="secondary" 
      data-testid="text-photo-count"
    >
      {count} {count === 1 ? 'photo' : 'photos'}
    </Badge>
  );
}
