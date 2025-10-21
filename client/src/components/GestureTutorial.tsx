import { useState, useEffect } from 'react';
import { X, Hand, ZoomIn, Trash2, ArrowLeft, ArrowDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  type CarouselApi,
} from '@/components/ui/carousel';

interface GestureTutorialProps {
  onClose: () => void;
}

export function GestureTutorial({ onClose }: GestureTutorialProps) {
  const [carouselApi, setCarouselApi] = useState<CarouselApi>();
  const [currentTip, setCurrentTip] = useState(0);

  const tips = [
    {
      icon: Hand,
      gesture: 'Single Tap',
      description: 'Tap anywhere to go to the next photo',
      color: 'text-blue-500',
    },
    {
      icon: ZoomIn,
      gesture: 'Double Tap',
      description: 'Double tap to zoom in and out (1x ↔ 2x)',
      color: 'text-green-500',
    },
    {
      icon: Trash2,
      gesture: 'Long Press',
      description: 'Hold for 500ms to delete a photo',
      color: 'text-red-500',
    },
    {
      icon: ArrowLeft,
      gesture: 'Swipe Left/Right',
      description: 'Swipe horizontally to navigate between photos',
      color: 'text-purple-500',
    },
    {
      icon: ArrowDown,
      gesture: 'Swipe Down',
      description: 'Swipe down to close the photo viewer',
      color: 'text-orange-500',
    },
  ];

  const isLastTip = currentTip === tips.length - 1;

  // Listen to carousel changes
  useEffect(() => {
    if (!carouselApi) return;

    const onSelect = () => {
      setCurrentTip(carouselApi.selectedScrollSnap());
    };

    carouselApi.on('select', onSelect);
    return () => {
      carouselApi.off('select', onSelect);
    };
  }, [carouselApi]);

  const handleNext = () => {
    if (isLastTip) {
      onClose();
    } else if (carouselApi) {
      carouselApi.scrollNext();
    }
  };

  const handleSkip = () => {
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/90 z-[100] flex items-center justify-center p-4">
      <div className="w-full max-w-sm relative">
        <div className="bg-card rounded-2xl p-8 shadow-2xl">
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-muted-foreground hover:text-foreground transition-colors z-10"
            aria-label="Close tutorial"
          >
            <X className="w-5 h-5" />
          </button>

          <Carousel
            setApi={setCarouselApi}
            opts={{
              loop: false,
              duration: 20,
            }}
          >
            <CarouselContent>
              {tips.map((tip, index) => {
                const Icon = tip.icon;
                return (
                  <CarouselItem key={index}>
                    <div className="flex flex-col items-center text-center space-y-6">
                      {/* Icon */}
                      <div className={`w-16 h-16 rounded-full bg-background flex items-center justify-center ${tip.color}`}>
                        <Icon className="w-8 h-8" />
                      </div>

                      {/* Content */}
                      <div className="space-y-2">
                        <h3 className="text-xl font-semibold">
                          {tip.gesture}
                        </h3>
                        <p className="text-muted-foreground leading-relaxed">
                          {tip.description}
                        </p>
                      </div>
                    </div>
                  </CarouselItem>
                );
              })}
            </CarouselContent>
          </Carousel>

          {/* Progress */}
          <div className="flex gap-2 pt-8 justify-center">
            {tips.map((_, index) => (
              <div
                key={index}
                className={`h-1 rounded-full transition-all ${
                  index === currentTip
                    ? 'bg-primary w-8'
                    : 'bg-muted w-4'
                }`}
              />
            ))}
          </div>

          {/* Actions */}
          <div className="flex gap-3 w-full pt-6">
            <Button
              variant="ghost"
              onClick={handleSkip}
              className="flex-1"
            >
              Skip
            </Button>
            <Button
              onClick={handleNext}
              className="flex-1"
            >
              {isLastTip ? 'Got it!' : 'Next'}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
