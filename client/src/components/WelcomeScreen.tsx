import { useState, useEffect } from 'react';
import { Wallet, Upload, Smartphone, Lock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { motion, AnimatePresence } from 'framer-motion';

interface WelcomeScreenProps {
  onGetStarted: () => void;
}

export function WelcomeScreen({ onGetStarted }: WelcomeScreenProps) {
  const [currentStep, setCurrentStep] = useState(0);

  const steps = [
    {
      icon: Wallet,
      title: 'Welcome to Photo Wallet',
      description: 'Carry your most cherished photos everywhere, just like a physical wallet.',
    },
    {
      icon: Upload,
      title: 'Add Your Photos',
      description: 'Store up to 12 of your favorite photos. They stay on your device, private and secure.',
    },
    {
      icon: Smartphone,
      title: 'View Anytime',
      description: 'Swipe through your photos with beautiful full-screen viewing and gesture controls.',
    },
    {
      icon: Lock,
      title: 'Privacy First',
      description: 'All photos stay on your device. No cloud storage, no tracking, just you and your memories.',
    },
  ];

  const currentStepData = steps[currentStep];
  const Icon = currentStepData.icon;
  const isLastStep = currentStep === steps.length - 1;

  const handleNext = () => {
    if (isLastStep) {
      onGetStarted();
    } else {
      setCurrentStep((prev) => prev + 1);
    }
  };

  const handleSkip = () => {
    onGetStarted();
  };

  useEffect(() => {
    // Auto-advance timer (optional - removes if user prefers manual control)
    const timer = setTimeout(() => {
      if (!isLastStep) {
        setCurrentStep((prev) => prev + 1);
      }
    }, 4000); // 4 seconds per slide

    return () => clearTimeout(timer);
  }, [currentStep, isLastStep]);

  return (
    <div className="fixed inset-0 bg-background z-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md p-8">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="flex flex-col items-center text-center space-y-6"
          >
            {/* Icon */}
            <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center">
              <Icon className="w-10 h-10 text-primary" />
            </div>

            {/* Content */}
            <div className="space-y-3">
              <h2 className="text-2xl font-semibold tracking-tight">
                {currentStepData.title}
              </h2>
              <p className="text-muted-foreground text-lg leading-relaxed">
                {currentStepData.description}
              </p>
            </div>

            {/* Progress Dots */}
            <div className="flex gap-2 pt-4">
              {steps.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentStep(index)}
                  className={`w-2 h-2 rounded-full transition-all ${
                    index === currentStep
                      ? 'bg-primary w-8'
                      : 'bg-muted-foreground/30 hover:bg-muted-foreground/50'
                  }`}
                  aria-label={`Go to step ${index + 1}`}
                  aria-current={index === currentStep ? 'step' : undefined}
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
                {isLastStep ? 'Get Started' : 'Next'}
              </Button>
            </div>
          </motion.div>
        </AnimatePresence>
      </Card>
    </div>
  );
}
