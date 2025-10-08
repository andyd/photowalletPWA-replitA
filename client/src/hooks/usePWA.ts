import { useEffect, useState } from 'react';

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

export function usePWA() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isInstallable, setIsInstallable] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);
  const [updateAvailable, setUpdateAvailable] = useState(false);
  const [waitingWorker, setWaitingWorker] = useState<ServiceWorker | null>(null);

  useEffect(() => {
    // Check if already installed
    if (window.matchMedia('(display-mode: standalone)').matches) {
      setIsInstalled(true);
    }

    // Listen for install prompt event
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      setIsInstallable(true);
    };

    // Listen for app installed event
    const handleAppInstalled = () => {
      setIsInstalled(true);
      setIsInstallable(false);
      setDeferredPrompt(null);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('appinstalled', handleAppInstalled);

    // Service worker update detection
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('/sw.js').then((registration) => {
        // Check for updates every 60 seconds
        setInterval(() => {
          registration.update();
        }, 60000);

        // Detect when a new service worker is waiting
        registration.addEventListener('updatefound', () => {
          const newWorker = registration.installing;
          if (newWorker) {
            newWorker.addEventListener('statechange', () => {
              if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                // New service worker is waiting
                setUpdateAvailable(true);
                setWaitingWorker(newWorker);
              }
            });
          }
        });

        // If there's already a waiting worker
        if (registration.waiting) {
          setUpdateAvailable(true);
          setWaitingWorker(registration.waiting);
        }
      });

      // Reload when new service worker takes control
      navigator.serviceWorker.addEventListener('controllerchange', () => {
        window.location.reload();
      });
    }

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, []);

  const installApp = async () => {
    if (!deferredPrompt) return false;

    try {
      await deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      
      // Clear the prompt as it can only be used once
      setDeferredPrompt(null);
      setIsInstallable(false);
      
      return outcome === 'accepted';
    } catch (error) {
      // Handle errors (e.g., prompt already used)
      setDeferredPrompt(null);
      setIsInstallable(false);
      return false;
    }
  };

  const applyUpdate = () => {
    if (waitingWorker) {
      // Tell the waiting service worker to skip waiting and activate
      waitingWorker.postMessage({ type: 'SKIP_WAITING' });
    }
  };

  return {
    isInstallable,
    isInstalled,
    installApp,
    updateAvailable,
    applyUpdate
  };
}
