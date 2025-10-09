import { useState } from 'react';
import { Settings } from 'lucide-react';
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
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { ManagePhotosDialog } from './ManagePhotosDialog';
import { InstallInstructionsDialog } from './InstallInstructionsDialog';
import { usePWA } from '@/hooks/usePWA';
import { useToast } from '@/hooks/use-toast';
import { hardResetApp } from '@/utils/hardReset';
import type { Photo } from '@shared/schema';

interface SettingsDialogProps {
  photos: Photo[];
  onResetApp: () => void;
  onDeletePhoto: (id: string) => void;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

export function SettingsDialog({ photos, onResetApp, onDeletePhoto, open: externalOpen, onOpenChange: externalOnOpenChange }: SettingsDialogProps) {
  const [internalOpen, setInternalOpen] = useState(false);
  
  // Use external state if provided, otherwise use internal state
  const isOpen = externalOpen !== undefined ? externalOpen : internalOpen;
  const setIsOpen = externalOnOpenChange !== undefined ? externalOnOpenChange : setInternalOpen;
  const [showResetConfirm, setShowResetConfirm] = useState(false);
  const [showManagePhotos, setShowManagePhotos] = useState(false);
  const [showInstallInstructions, setShowInstallInstructions] = useState(false);
  const { isInstallable, isInstalled, installApp } = usePWA();
  const { toast } = useToast();

  const handleReset = async () => {
    setShowResetConfirm(false);
    setIsOpen(false);
    
    toast({
      title: 'Resetting app...',
      description: 'Clearing all data and refreshing',
    });
    
    // Wait a moment for toast to show
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Perform hard reset (clears service worker, caches, IndexedDB, and reloads)
    await hardResetApp();
  };

  const handleManagePhotos = () => {
    setShowManagePhotos(true);
    setIsOpen(false);
  };

  const handleInstall = async () => {
    if (isInstallable) {
      // Native install is available
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
    } else {
      // Show instructions for manual install
      setShowInstallInstructions(true);
      setIsOpen(false);
    }
  };

  return (
    <>
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        {!externalOpen && (
          <DialogTrigger asChild>
            <Button size="icon" variant="ghost" data-testid="button-settings">
              <Settings className="w-5 h-5" />
            </Button>
          </DialogTrigger>
        )}
        <DialogContent className="bg-black border-white/10" data-testid="dialog-settings">
          <DialogHeader className="text-center">
            <DialogTitle className="text-white text-xl">Settings</DialogTitle>
            <DialogDescription className="text-white/50">
              {photos.length} of 12 photos
            </DialogDescription>
          </DialogHeader>
          <div className="py-4 space-y-3">
            {!isInstalled && (
              <button
                onClick={handleInstall}
                className="w-full py-3 px-4 bg-white/10 hover:bg-white/15 active:bg-white/20 text-white rounded-full transition-colors text-center"
                data-testid="button-install-app"
              >
                Install App
              </button>
            )}
            
            <button
              onClick={handleManagePhotos}
              className="w-full py-3 px-4 bg-white/10 hover:bg-white/15 active:bg-white/20 text-white rounded-full transition-colors text-center"
              data-testid="button-manage-photos"
            >
              Manage Photos
            </button>

            <Link href="/github-setup">
              <button
                onClick={() => setIsOpen(false)}
                className="w-full py-3 px-4 bg-white/10 hover:bg-white/15 active:bg-white/20 text-white rounded-full transition-colors text-center"
                data-testid="button-github-setup"
              >
                Push to GitHub
              </button>
            </Link>

            <button
              onClick={() => setShowResetConfirm(true)}
              className="w-full py-3 px-4 bg-[#C44536]/20 hover:bg-[#C44536]/30 active:bg-[#C44536]/40 text-[#C44536] rounded-full transition-colors text-center"
              data-testid="button-reset-app"
            >
              Hard Reset
            </button>
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
        <AlertDialogContent className="bg-black border-white/10" data-testid="dialog-reset-confirm">
          <AlertDialogHeader className="text-center">
            <AlertDialogTitle className="text-white text-xl">Hard Reset?</AlertDialogTitle>
            <AlertDialogDescription className="text-white/70 text-center">
              This will delete all photos and app data. This cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="flex flex-col gap-2 sm:flex-col">
            <button
              onClick={handleReset}
              className="w-full py-3 px-4 bg-[#C44536] hover:bg-[#C44536]/80 active:bg-[#C44536]/60 text-white rounded-full transition-colors"
              data-testid="button-confirm-reset"
            >
              Reset Everything
            </button>
            <button
              onClick={() => setShowResetConfirm(false)}
              className="w-full py-3 px-4 bg-white/10 hover:bg-white/15 active:bg-white/20 text-white rounded-full transition-colors"
              data-testid="button-cancel-reset"
            >
              Cancel
            </button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <InstallInstructionsDialog
        open={showInstallInstructions}
        onOpenChange={setShowInstallInstructions}
      />
    </>
  );
}
