import { Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { usePWA } from '@/hooks/usePWA';
import { useToast } from '@/hooks/use-toast';

export function InstallPrompt() {
  const { isInstallable, installApp } = usePWA();
  const { toast } = useToast();

  if (!isInstallable) return null;

  const handleInstall = async () => {
    const accepted = await installApp();
    if (accepted) {
      toast({
        title: 'Installing...',
        description: 'Photo Wallet is being added to your home screen',
      });
    }
  };

  return (
    <Button
      onClick={handleInstall}
      variant="outline"
      size="sm"
      className="gap-2"
      data-testid="button-install-app"
    >
      <Download className="w-4 h-4" />
      Install App
    </Button>
  );
}
