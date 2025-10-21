import { Wallet, Upload } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface WelcomeScreenProps {
  onGetStarted: () => void;
}

export function WelcomeScreen({ onGetStarted }: WelcomeScreenProps) {
  return (
    <div className="fixed inset-0 bg-background z-50 flex items-center justify-center p-4 pb-4">
      <div className="flex flex-col items-center max-w-2xl w-full">
        {/* App Name - Large and Centered */}
        <h1 className="text-5xl md:text-7xl font-bold mb-6 text-center tracking-tight">
          Photo Wallet
        </h1>

        {/* Tagline */}
        <p className="text-xl md:text-2xl text-muted-foreground mb-16 text-center">
          The photos you want with you all the time
        </p>

        {/* Large App Icon */}
        <div className="mb-24">
          <Wallet className="w-40 h-40 md:w-48 md:h-48 text-primary" />
        </div>

        {/* Large Get Started Button */}
        <Button 
          size="lg" 
          onClick={onGetStarted}
          className="text-xl px-16 py-10 h-auto rounded-2xl shadow-2xl hover:shadow-3xl transition-all hover:scale-105 mb-4"
        >
          <Upload className="w-7 h-7 mr-4" />
          Get Started
        </Button>
      </div>
    </div>
  );
}
