import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Smartphone, Chrome, Share2 } from 'lucide-react';

interface InstallInstructionsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function InstallInstructionsDialog({ open, onOpenChange }: InstallInstructionsDialogProps) {
  const isIOS = /iPhone|iPad|iPod/.test(navigator.userAgent);
  const isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent data-testid="dialog-install-instructions">
        <DialogHeader>
          <DialogTitle>Install Photo Wallet</DialogTitle>
          <DialogDescription>
            Follow these steps to install the app on your device
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4 py-4">
          {isIOS || isSafari ? (
            <>
              <div className="flex items-start gap-3">
                <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary text-primary-foreground text-sm font-semibold">
                  1
                </div>
                <div className="flex-1">
                  <p className="font-medium">Tap the Share button</p>
                  <div className="flex items-center gap-2 mt-2 text-muted-foreground">
                    <Share2 className="w-5 h-5" />
                    <span className="text-sm">Look for the share icon in Safari</span>
                  </div>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary text-primary-foreground text-sm font-semibold">
                  2
                </div>
                <div className="flex-1">
                  <p className="font-medium">Select "Add to Home Screen"</p>
                  <p className="text-sm text-muted-foreground mt-1">
                    Scroll down if you don't see it immediately
                  </p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary text-primary-foreground text-sm font-semibold">
                  3
                </div>
                <div className="flex-1">
                  <p className="font-medium">Tap "Add"</p>
                  <p className="text-sm text-muted-foreground mt-1">
                    The app will appear on your home screen
                  </p>
                </div>
              </div>
            </>
          ) : (
            <>
              <div className="flex items-start gap-3">
                <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary text-primary-foreground text-sm font-semibold">
                  1
                </div>
                <div className="flex-1">
                  <p className="font-medium">Open in a browser tab</p>
                  <p className="text-sm text-muted-foreground mt-1">
                    If you're in the Replit webview, click "Open in new tab"
                  </p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary text-primary-foreground text-sm font-semibold">
                  2
                </div>
                <div className="flex-1">
                  <p className="font-medium">Look for the install icon</p>
                  <div className="flex items-center gap-2 mt-2 text-muted-foreground">
                    <Chrome className="w-5 h-5" />
                    <span className="text-sm">In the address bar (Chrome/Edge)</span>
                  </div>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary text-primary-foreground text-sm font-semibold">
                  3
                </div>
                <div className="flex-1">
                  <p className="font-medium">Click "Install"</p>
                  <p className="text-sm text-muted-foreground mt-1">
                    The app will be added to your desktop/apps
                  </p>
                </div>
              </div>
            </>
          )}
          
          <div className="pt-2 border-t">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Smartphone className="w-4 h-4" />
              <span>Once installed, Photo Wallet works offline and can be launched from your home screen</span>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
