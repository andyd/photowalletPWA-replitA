import { useState } from 'react';
import { X, Hand, ZoomIn, Trash2, ArrowLeft, ArrowRight, ArrowDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { motion, AnimatePresence } from 'framer-motion';

interface GestureTutorialProps {
  onClose: () => void;
}

export function GestureTutorial({ onClose }: GestureTutorialProps) {
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

  const currentTipData = tips[currentTip];
  const Icon = currentTipData.icon;
  const isLastTip = currentTip === tips.length - 1;

  const handleNext = () => {
    if (isLastTip) {
      onClose();
    } else {
      setCurrentTip((prev) => prev + 1);
    }
  };

  const handleSkip = () => {
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/90 z-[100] flex items-center justify-center p-4">
      <div className="w-full max-w-sm">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentTip}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.2 }}
            className="bg-card rounded-2xl p-8 shadow-2xl"
          >
            {/* Close button */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 text-muted-foreground hover:text-foreground transition-colors"
              aria-label="Close tutorial"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Icon */}
            <div className="flex flex-col items-center text-center space-y-6">
              <div className={`w-16 h-16 rounded-full bg-background flex items-center justify-center ${currentTipData.color}`}>
                <Icon className="w-8 h-8" />
              </div>

              {/* Content */}
              <div className="space-y-2">
                <h3 className="text-xl font-semibold">
                  {currentTipData.gesture}
                </h3>
                <p className="text-muted-foreground leading-relaxed">
                  {currentTipData.description}
                </p>
              </div>

              {/* Progress */}
              <div className="flex gap-2 pt-2">
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
              <div className="flex gap-3 w-full pt-4">
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
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
