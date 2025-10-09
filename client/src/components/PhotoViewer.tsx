import { useState, useEffect, useRef } from 'react';
import type { Photo } from '@shared/schema';

interface PhotoViewerProps {
  photos: Photo[];
  currentIndex: number;
  isOpen: boolean;
  onClose: () => void;
  onIndexChange: (index: number) => void;
  onDeletePhoto: (id: string) => void;
}

export function PhotoViewer({
  photos,
  currentIndex,
  isOpen,
  onClose,
  onIndexChange,
}: PhotoViewerProps) {
  const [photoUrls, setPhotoUrls] = useState<string[]>([]);
  const [showHint, setShowHint] = useState(true);
  const carouselRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const urls = photos.map(photo => URL.createObjectURL(photo.blob));
    setPhotoUrls(urls);
    return () => urls.forEach(url => URL.revokeObjectURL(url));
  }, [photos]);

  useEffect(() => {
    if (carouselRef.current && isOpen) {
      carouselRef.current.scrollTo({
        left: currentIndex * window.innerWidth,
        behavior: 'instant' as ScrollBehavior,
      });
    }
  }, [currentIndex, isOpen]);

  useEffect(() => {
    if (isOpen) {
      setShowHint(true);
      const timer = setTimeout(() => setShowHint(false), 2000);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black z-50"
      onClick={onClose}
      data-testid="photo-viewer"
    >
      <div
        ref={carouselRef}
        className="flex overflow-x-auto snap-x snap-mandatory h-full gap-1 scrollbar-hide"
        onClick={(e) => e.stopPropagation()}
      >
        {photoUrls.map((url, index) => (
          <div
            key={photos[index].id}
            className="flex-shrink-0 w-screen h-full snap-center flex items-center justify-center"
            data-testid={`photo-slide-${index}`}
          >
            <img
              src={url}
              alt={photos[index].filename}
              className="max-w-full max-h-full object-contain"
              data-testid={`photo-image-${index}`}
            />
          </div>
        ))}
      </div>

      {/* Tap to exit hint */}
      {showHint && (
        <div className="absolute bottom-8 left-0 right-0 text-center text-white/60 text-sm animate-in fade-in duration-500">
          Tap anywhere to exit
        </div>
      )}

      <style>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        @keyframes fade-in {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        .animate-in {
          animation-fill-mode: both;
        }
        .fade-in {
          animation-name: fade-in;
        }
        .duration-500 {
          animation-duration: 500ms;
        }
      `}</style>
    </div>
  );
}
