import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Chrome, Share2 } from 'lucide-react';

interface InstallInstructionsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function InstallInstructionsDialog({ open, onOpenChange }: InstallInstructionsDialogProps) {
  const isIOS = /iPhone|iPad|iPod/.test(navigator.userAgent);
  const isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-black border-white/10" data-testid="dialog-install-instructions">
        <DialogHeader className="text-center">
          <DialogTitle className="text-white text-xl">Install App</DialogTitle>
          <DialogDescription className="text-white/50">
            {isIOS || isSafari ? 'Safari Instructions' : 'Chrome Instructions'}
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-3 py-4">
          {isIOS || isSafari ? (
            <>
              <div className="flex items-start gap-3 text-white/80">
                <div className="flex items-center justify-center w-6 h-6 rounded-full bg-white/10 text-white text-sm shrink-0 mt-0.5">
                  1
                </div>
                <div className="flex-1">
                  <p className="text-sm">Tap Share button <Share2 className="w-4 h-4 inline" /></p>
                </div>
              </div>
              
              <div className="flex items-start gap-3 text-white/80">
                <div className="flex items-center justify-center w-6 h-6 rounded-full bg-white/10 text-white text-sm shrink-0 mt-0.5">
                  2
                </div>
                <div className="flex-1">
                  <p className="text-sm">Select "Add to Home Screen"</p>
                </div>
              </div>
              
              <div className="flex items-start gap-3 text-white/80">
                <div className="flex items-center justify-center w-6 h-6 rounded-full bg-white/10 text-white text-sm shrink-0 mt-0.5">
                  3
                </div>
                <div className="flex-1">
                  <p className="text-sm">Tap "Add"</p>
                </div>
              </div>
            </>
          ) : (
            <>
              <div className="flex items-start gap-3 text-white/80">
                <div className="flex items-center justify-center w-6 h-6 rounded-full bg-white/10 text-white text-sm shrink-0 mt-0.5">
                  1
                </div>
                <div className="flex-1">
                  <p className="text-sm">Open in browser tab (not Replit webview)</p>
                </div>
              </div>
              
              <div className="flex items-start gap-3 text-white/80">
                <div className="flex items-center justify-center w-6 h-6 rounded-full bg-white/10 text-white text-sm shrink-0 mt-0.5">
                  2
                </div>
                <div className="flex-1">
                  <p className="text-sm">Look for install icon <Chrome className="w-4 h-4 inline" /> in address bar</p>
                </div>
              </div>
              
              <div className="flex items-start gap-3 text-white/80">
                <div className="flex items-center justify-center w-6 h-6 rounded-full bg-white/10 text-white text-sm shrink-0 mt-0.5">
                  3
                </div>
                <div className="flex-1">
                  <p className="text-sm">Click "Install"</p>
                </div>
              </div>
            </>
          )}
          
          <div className="pt-3 border-t border-white/10">
            <p className="text-xs text-white/40 text-center">
              Works offline once installed
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
