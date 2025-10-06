import { useState, useEffect } from 'react';
import { Download, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { usePWA } from '@/hooks/usePWA';
import { useToast } from '@/hooks/use-toast';

interface InstallBannerProps {
  photoCount: number;
}

export function InstallBanner({ photoCount }: InstallBannerProps) {
  const { isInstallable, installApp } = usePWA();
  const { toast } = useToast();
  const [isDismissed, setIsDismissed] = useState(false);
  const [showBanner, setShowBanner] = useState(false);

  useEffect(() => {
    const dismissed = localStorage.getItem('install-banner-dismissed') === 'true';
    setIsDismissed(dismissed);

    if (photoCount > 0 && isInstallable && !dismissed) {
      setShowBanner(true);
    } else {
      setShowBanner(false);
    }
  }, [photoCount, isInstallable]);

  const handleInstall = async () => {
    const accepted = await installApp();
    if (accepted) {
      toast({
        title: 'Installing...',
        description: 'Photo Wallet is being added to your home screen',
      });
      setShowBanner(false);
    }
  };

  const handleDismiss = () => {
    localStorage.setItem('install-banner-dismissed', 'true');
    setIsDismissed(true);
    setShowBanner(false);
  };

  if (!showBanner) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 p-4 pb-safe" data-testid="banner-install">
      <div className="mx-auto max-w-lg bg-card border rounded-lg shadow-lg p-4">
        <div className="flex items-start gap-3">
          <div className="flex-shrink-0 mt-0.5">
            <Download className="w-5 h-5 text-primary" />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="text-sm font-semibold mb-1">Install Photo Wallet</h3>
            <p className="text-sm text-muted-foreground mb-3">
              Add to your home screen for quick access to your photos anytime, anywhere.
            </p>
            <div className="flex gap-2">
              <Button
                onClick={handleInstall}
                size="sm"
                className="flex-1"
                data-testid="button-install-banner"
              >
                Install Now
              </Button>
              <Button
                onClick={handleDismiss}
                size="sm"
                variant="ghost"
                data-testid="button-dismiss-banner"
              >
                Not Now
              </Button>
            </div>
          </div>
          <Button
            onClick={handleDismiss}
            size="icon"
            variant="ghost"
            className="flex-shrink-0 -mr-2 -mt-1"
            data-testid="button-close-banner"
          >
            <X className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
