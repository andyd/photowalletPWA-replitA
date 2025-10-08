import { useState } from 'react';
import { Settings, Trash2, Images, Moon, Sun, Monitor, Download, Github } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'wouter';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
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
import { ManagePhotosDialog } from './ManagePhotosDialog';
import { useTheme } from '@/components/ThemeProvider';
import { usePWA } from '@/hooks/usePWA';
import { useToast } from '@/hooks/use-toast';
import type { Photo } from '@shared/schema';

interface SettingsDialogProps {
  photos: Photo[];
  onResetApp: () => void;
  onDeletePhoto: (id: string) => void;
}

export function SettingsDialog({ photos, onResetApp, onDeletePhoto }: SettingsDialogProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [showResetConfirm, setShowResetConfirm] = useState(false);
  const [showManagePhotos, setShowManagePhotos] = useState(false);
  const { theme, setTheme } = useTheme();
  const { isInstallable, isInstalled, installApp } = usePWA();
  const { toast } = useToast();

  const handleReset = () => {
    onResetApp();
    setShowResetConfirm(false);
    setIsOpen(false);
  };

  const handleManagePhotos = () => {
    setShowManagePhotos(true);
    setIsOpen(false);
  };

  const handleInstall = async () => {
    const accepted = await installApp();
    if (accepted) {
      toast({
        title: 'Installing...',
        description: 'Photo Wallet is being added to your home screen',
      });
      setIsOpen(false);
    } else {
      toast({
        title: 'Installation canceled',
        description: 'Reload the page to try again',
      });
      setIsOpen(false);
    }
  };

  return (
    <>
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogTrigger asChild>
          <Button size="icon" variant="ghost" data-testid="button-settings">
            <Settings className="w-5 h-5" />
          </Button>
        </DialogTrigger>
        <DialogContent data-testid="dialog-settings">
          <DialogHeader>
            <DialogTitle>Settings</DialogTitle>
            <DialogDescription>
              Manage your Photo Wallet settings
            </DialogDescription>
          </DialogHeader>
          <div className="py-4 space-y-4">
            <div className="space-y-2">
              <h3 className="text-sm font-medium">Theme</h3>
              <div className="flex gap-2">
                <Button
                  variant={theme === 'dark' ? 'default' : 'outline'}
                  className="flex-1 justify-start"
                  onClick={() => setTheme('dark')}
                  data-testid="button-theme-dark"
                >
                  <Moon className="w-4 h-4 mr-2" />
                  Dark
                </Button>
                <Button
                  variant={theme === 'light' ? 'default' : 'outline'}
                  className="flex-1 justify-start"
                  onClick={() => setTheme('light')}
                  data-testid="button-theme-light"
                >
                  <Sun className="w-4 h-4 mr-2" />
                  Light
                </Button>
                <Button
                  variant={theme === 'system' ? 'default' : 'outline'}
                  className="flex-1 justify-start"
                  onClick={() => setTheme('system')}
                  data-testid="button-theme-system"
                >
                  <Monitor className="w-4 h-4 mr-2" />
                  System
                </Button>
              </div>
            </div>

            {(isInstallable || isInstalled) && (
              <div className="space-y-2">
                <h3 className="text-sm font-medium">App</h3>
                {isInstallable && (
                  <Button
                    variant="secondary"
                    className="w-full justify-start"
                    onClick={handleInstall}
                    data-testid="button-install-settings"
                  >
                    <Download className="w-4 h-4 mr-2" />
                    Install App
                  </Button>
                )}
                {isInstalled && (
                  <div className="text-sm text-muted-foreground px-3 py-2" data-testid="text-app-installed">
                    App is installed on your device
                  </div>
                )}
              </div>
            )}

            <div className="space-y-2">
              <h3 className="text-sm font-medium">Photos</h3>
              <Button
                variant="secondary"
                className="w-full justify-start"
                onClick={handleManagePhotos}
                data-testid="button-manage-photos"
              >
                <Images className="w-4 h-4 mr-2" />
                Manage Photos
              </Button>
            </div>

            <div className="space-y-2">
              <h3 className="text-sm font-medium">Backup</h3>
              <Link href="/github-setup">
                <Button
                  variant="secondary"
                  className="w-full justify-start"
                  onClick={() => setIsOpen(false)}
                  data-testid="button-github-setup"
                >
                  <Github className="w-4 h-4 mr-2" />
                  Push to GitHub
                </Button>
              </Link>
            </div>

            <div className="space-y-2">
              <h3 className="text-sm font-medium">Danger Zone</h3>
              <Button
                variant="destructive"
                className="w-full justify-start"
                onClick={() => setShowResetConfirm(true)}
                data-testid="button-reset-app"
              >
                <Trash2 className="w-4 h-4 mr-2" />
                Reset App & Delete All Photos
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <ManagePhotosDialog
        photos={photos}
        open={showManagePhotos}
        onOpenChange={setShowManagePhotos}
        onDelete={onDeletePhoto}
      />

      <AlertDialog open={showResetConfirm} onOpenChange={setShowResetConfirm}>
        <AlertDialogContent data-testid="dialog-reset-confirm">
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete all your photos from your device. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel data-testid="button-cancel-reset">Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleReset}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              data-testid="button-confirm-reset"
            >
              Delete All Photos
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
