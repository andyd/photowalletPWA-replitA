import { useState, useEffect, useRef } from 'react';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';
import { useGesture } from '@use-gesture/react';
import { motion, AnimatePresence, useMotionValue, useTransform, animate } from 'framer-motion';
import { Button } from '@/components/ui/button';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
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
  onDeletePhoto,
}: PhotoViewerProps) {
  const [imageUrl, setImageUrl] = useState<string>('');
  const [scale, setScale] = useState(1);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [showUI, setShowUI] = useState(true);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  const [slideDirection, setSlideDirection] = useState<1 | -1>(1);
  
  const dragOffsetX = useMotionValue(0);
  const dragOffsetY = useMotionValue(0);
  const closingProgress = useMotionValue(0);
  
  const hideUITimeoutRef = useRef<NodeJS.Timeout>();
  const lastTapRef = useRef<number>(0);
  const imageContainerRef = useRef<HTMLDivElement>(null);
  const currentPhoto = photos[currentIndex];

  useEffect(() => {
    if (!currentPhoto) return;
    const url = URL.createObjectURL(currentPhoto.blob);
    setImageUrl(url);
    return () => URL.revokeObjectURL(url);
  }, [currentPhoto]);

  useEffect(() => {
    setScale(1);
    setPosition({ x: 0, y: 0 });
    dragOffsetX.set(0);
    dragOffsetY.set(0);
  }, [currentIndex]);

  // Reset zoom/pan state when viewer closes
  useEffect(() => {
    if (!isOpen) {
      setScale(1);
      setPosition({ x: 0, y: 0 });
      setIsClosing(false);
      dragOffsetX.set(0);
      dragOffsetY.set(0);
      closingProgress.set(0);
    }
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;

    const resetUITimeout = () => {
      if (hideUITimeoutRef.current) {
        clearTimeout(hideUITimeoutRef.current);
      }
      setShowUI(true);
      hideUITimeoutRef.current = setTimeout(() => {
        setShowUI(false);
      }, 3000);
    };

    resetUITimeout();
    return () => {
      if (hideUITimeoutRef.current) {
        clearTimeout(hideUITimeoutRef.current);
      }
    };
  }, [isOpen, currentIndex]);

  const handleMouseMove = () => {
    if (hideUITimeoutRef.current) {
      clearTimeout(hideUITimeoutRef.current);
    }
    setShowUI(true);
    hideUITimeoutRef.current = setTimeout(() => {
      setShowUI(false);
    }, 3000);
  };

  const goToPrevious = () => {
    setSlideDirection(-1);
    if (currentIndex > 0) {
      onIndexChange(currentIndex - 1);
    } else {
      onIndexChange(photos.length - 1);
    }
  };

  const goToNext = () => {
    setSlideDirection(1);
    if (currentIndex < photos.length - 1) {
      onIndexChange(currentIndex + 1);
    } else {
      onIndexChange(0);
    }
  };

  const handleClose = () => {
    setIsClosing(true);
    // Reset drag offsets immediately when closing
    dragOffsetX.set(0);
    dragOffsetY.set(0);
    
    animate(closingProgress, 1, {
      duration: 0.3,
      ease: [0.32, 0.72, 0, 1],
    }).then(() => {
      onClose();
    });
  };

  const handleDeleteConfirm = () => {
    if (currentPhoto) {
      onDeletePhoto(currentPhoto.id);
      setShowDeleteDialog(false);
      
      // Navigate to next photo or close if this was the last one
      if (photos.length > 1) {
        if (currentIndex >= photos.length - 1) {
          onIndexChange(0);
        }
      } else {
        onClose();
      }
    }
  };

  // Use gesture hook for comprehensive touch handling
  const bind = useGesture(
    {
      onDrag: ({ offset: [x, y], direction: [dx, dy], movement: [mx, my], velocity: [vx, vy], down, cancel }) => {
        // If zoomed in, allow panning
        if (scale > 1) {
          setPosition({ x, y });
        } else if (!isClosing) {
          // While dragging, update offset values for visual feedback (unless closing)
          if (down) {
            const isVertical = Math.abs(my) > Math.abs(mx);
            if (isVertical) {
              dragOffsetY.set(my);
              dragOffsetX.set(0);
            } else {
              dragOffsetX.set(mx);
              dragOffsetY.set(0);
            }
          } else {
            // Gesture ended - determine action
            const isVertical = Math.abs(my) > Math.abs(mx);
            
            // Vertical swipe to close
            if (isVertical && Math.abs(my) > 80) {
              cancel();
              handleClose();
              return; // Don't animate back to center
            }
            // Horizontal swipe for navigation
            else if (!isVertical && Math.abs(mx) > 60 && Math.abs(vx) > 0.2) {
              if (dx > 0) {
                goToPrevious();
              } else {
                goToNext();
              }
            }
            
            // Animate back to center if no action triggered
            animate(dragOffsetX, 0, { type: 'spring', stiffness: 300, damping: 30 });
            animate(dragOffsetY, 0, { type: 'spring', stiffness: 300, damping: 30 });
          }
        }
      },
      onPinch: ({ offset: [d] }) => {
        const newScale = Math.min(Math.max(1, 1 + d / 200), 3);
        setScale(newScale);
        if (newScale === 1) {
          setPosition({ x: 0, y: 0 });
        }
      },
      onClick: ({ event }) => {
        event.preventDefault();
        
        const now = Date.now();
        const timeSinceLastTap = now - lastTapRef.current;
        
        // Double tap detection (within 300ms)
        if (timeSinceLastTap < 300) {
          setShowDeleteDialog(true);
          lastTapRef.current = 0;
        } else {
          // Single tap - advance to next photo
          lastTapRef.current = now;
          setTimeout(() => {
            if (lastTapRef.current === now) {
              goToNext();
            }
          }, 300);
        }
      },
    },
    {
      drag: {
        from: () => [position.x, position.y],
        filterTaps: true,
      },
      pinch: {
        scaleBounds: { min: 1, max: 3 },
        rubberband: true,
      },
    }
  );

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;
      if (e.key === 'Escape') handleClose();
      if (e.key === 'ArrowLeft') goToPrevious();
      if (e.key === 'ArrowRight') goToNext();
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, currentIndex, photos.length]);

  // Don't render if not open, or if closing animation finished
  if (!isOpen || !currentPhoto) return null;
  if (isClosing && closingProgress.get() >= 0.99) return null;

  const slideVariants = {
    enter: (direction: number) => ({
      x: direction > 0 ? '100%' : '-100%',
      opacity: 0,
    }),
    center: {
      x: 0,
      opacity: 1,
    },
    exit: (direction: number) => ({
      x: direction > 0 ? '-100%' : '100%',
      opacity: 0,
    }),
  };

  const closingScale = useTransform(closingProgress, [0, 1], [1, 0.3]);
  const closingOpacity = useTransform(closingProgress, [0, 1], [1, 0]);

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.2 }}
        className="fixed inset-0 bg-black/95 z-50 flex items-center justify-center"
        onMouseMove={handleMouseMove}
        data-testid="container-photo-viewer"
      >
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: showUI && !isClosing ? 1 : 0 }}
          className="absolute top-0 left-0 right-0 p-4 flex items-center justify-between z-10"
        >
          <Button
            size="icon"
            variant="ghost"
            onClick={handleClose}
            className="text-white hover:bg-white/20"
            data-testid="button-close-viewer"
          >
            <X className="w-6 h-6" />
          </Button>
          <div className="text-white text-sm" data-testid="text-photo-index">
            {currentIndex + 1} of {photos.length}
          </div>
        </motion.div>

        <div
          ref={imageContainerRef}
          {...bind()}
          className="relative w-full h-full flex items-center justify-center touch-none overflow-hidden"
          style={{
            cursor: scale > 1 ? 'grab' : 'default',
          }}
        >
          <AnimatePresence initial={false} custom={slideDirection} mode="wait">
            <motion.div
              key={currentPhoto.id}
              custom={slideDirection}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{
                x: { type: 'spring', stiffness: 300, damping: 30 },
                opacity: { duration: 0.2 },
              }}
              style={{
                position: 'absolute',
                width: '100%',
                height: '100%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <motion.div
                style={{
                  x: dragOffsetX,
                  y: dragOffsetY,
                  scale: isClosing ? closingScale : scale > 1 ? scale : undefined,
                  opacity: isClosing ? closingOpacity : undefined,
                }}
              >
                <motion.img
                  src={imageUrl}
                  alt={currentPhoto.filename}
                  className="max-w-full max-h-full object-contain select-none"
                  style={{
                    transform: scale > 1 
                      ? `translate(${position.x / scale}px, ${position.y / scale}px)` 
                      : undefined,
                  }}
                  data-testid="img-viewer-photo"
                />
              </motion.div>
            </motion.div>
          </AnimatePresence>
        </div>

        {photos.length > 1 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: showUI && !isClosing ? 1 : 0 }}
            className="absolute left-4 right-4 top-1/2 -translate-y-1/2 flex items-center justify-between pointer-events-none"
          >
            <Button
              size="icon"
              variant="ghost"
              onClick={goToPrevious}
              className="text-white hover:bg-white/20 pointer-events-auto"
              data-testid="button-previous-photo"
            >
              <ChevronLeft className="w-8 h-8" />
            </Button>
            <Button
              size="icon"
              variant="ghost"
              onClick={goToNext}
              className="text-white hover:bg-white/20 pointer-events-auto"
              data-testid="button-next-photo"
            >
              <ChevronRight className="w-8 h-8" />
            </Button>
          </motion.div>
        )}

        {scale > 1 && !isClosing && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/60 text-white px-3 py-1 rounded-full text-sm"
            data-testid="text-zoom-level"
          >
            {scale.toFixed(1)}x
          </motion.div>
        )}

        <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
          <AlertDialogContent data-testid="dialog-delete-photo">
            <AlertDialogHeader>
              <AlertDialogTitle>Delete Photo?</AlertDialogTitle>
              <AlertDialogDescription>
                Are you sure you want to delete this photo? This action cannot be undone.
                <br />
                <span className="text-sm font-medium mt-2 block">{currentPhoto.filename}</span>
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel data-testid="button-cancel-delete">Cancel</AlertDialogCancel>
              <AlertDialogAction
                onClick={handleDeleteConfirm}
                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                data-testid="button-confirm-delete"
              >
                Delete
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </motion.div>
    </AnimatePresence>
  );
}
