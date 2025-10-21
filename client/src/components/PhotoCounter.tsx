import { Badge } from '@/components/ui/badge';

interface PhotoCounterProps {
  count: number;
  onClick?: () => void;
}

export function PhotoCounter({ count, onClick }: PhotoCounterProps) {
  return (
    <Badge 
      variant="secondary" 
      data-testid="text-photo-count"
      onClick={onClick}
      className={onClick ? 'cursor-pointer hover:bg-secondary/80 transition-colors' : ''}
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
      onKeyDown={onClick ? (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onClick();
        }
      } : undefined}
    >
      {count} {count === 1 ? 'photo' : 'photos'}
    </Badge>
  );
}
