import { useEffect, useRef, useState } from 'react';
import { usePhotoStore } from '@/hooks/usePhotoStore';
import { Header } from '@/components/Header';
import { PhotoCounter } from '@/components/PhotoCounter';
import { EmptyState } from '@/components/EmptyState';
import { PhotoGrid } from '@/components/PhotoGrid';
import { PhotoViewer } from '@/components/PhotoViewer';
import { SettingsDialog } from '@/components/SettingsDialog';
import { InstallBanner } from '@/components/InstallBanner';
import { WelcomeScreen } from '@/components/WelcomeScreen';
import { photoStorage } from '@/services/photoStorage';
import { useToast } from '@/hooks/use-toast';
import { isDuplicatePhoto } from '@/utils/photoUtils';
import { MAX_PHOTOS } from '@/utils/constants';
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

export default function Home() {
  const {
    photos,
    isLoading,
    currentPhotoIndex,
    isViewerOpen,
    loadPhotos,
    addPhoto,
    deletePhoto,
    openViewer,
    closeViewer,
    setCurrentPhotoIndex,
  } = usePhotoStore();

  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();
  const [duplicateFile, setDuplicateFile] = useState<File | null>(null);
  const [showDuplicateDialog, setShowDuplicateDialog] = useState(false);
  const [showWelcome, setShowWelcome] = useState(false);
  const pendingFilesRef = useRef<File[]>([]);

  useEffect(() => {
    loadPhotos();

    // Check if user has seen welcome screen
    const hasSeenWelcome = localStorage.getItem('photo-wallet-welcome-seen');
    if (!hasSeenWelcome) {
      setShowWelcome(true);
    }
  }, [loadPhotos]);

  const handleWelcomeComplete = () => {
    localStorage.setItem('photo-wallet-welcome-seen', 'true');
    setShowWelcome(false);
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    await handleAddPhotos(files);
  };

  const handleAddPhotos = async (files: FileList) => {
    const fileArray = Array.from(files);
    const remainingSlots = MAX_PHOTOS - photos.length;

    // Don't allow adding any photos if at limit
    if (remainingSlots <= 0) {
      toast({
        title: 'Photo limit reached',
        description: `Maximum of ${MAX_PHOTOS} photos allowed. Delete some photos to add more.`,
        variant: 'destructive',
      });
      return;
    }

    if (fileArray.length > remainingSlots) {
      toast({
        title: 'Too many photos',
        description: `You can only add ${remainingSlots} more photo${remainingSlots === 1 ? '' : 's'}. Limit is ${MAX_PHOTOS} photos.`,
        variant: 'destructive',
      });
      // Only process files up to the limit
      pendingFilesRef.current = fileArray.slice(0, remainingSlots);
    } else {
      pendingFilesRef.current = fileArray;
    }

    await processNextFile();
  };

  const processNextFile = async () => {
    if (pendingFilesRef.current.length === 0) {
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
      return;
    }

    const file = pendingFilesRef.current[0];
    const isDuplicate = await isDuplicatePhoto(file, photos);

    if (isDuplicate) {
      setDuplicateFile(file);
      setShowDuplicateDialog(true);
    } else {
      await addPhotoToStore(file);
      pendingFilesRef.current = pendingFilesRef.current.slice(1);
      await processNextFile();
    }
  };

  const handleAddDuplicate = async () => {
    if (duplicateFile) {
      await addPhotoToStore(duplicateFile);
      setDuplicateFile(null);
      setShowDuplicateDialog(false);
      pendingFilesRef.current = pendingFilesRef.current.slice(1);
      await processNextFile();
    }
  };

  const handleSkipDuplicate = async () => {
    setDuplicateFile(null);
    setShowDuplicateDialog(false);
    pendingFilesRef.current = pendingFilesRef.current.slice(1);
    await processNextFile();
  };

  const addPhotoToStore = async (file: File) => {
    // Double-check limit before adding (in case photos array changed)
    if (photos.length >= MAX_PHOTOS) {
      toast({
        title: 'Photo limit reached',
        description: `Maximum of ${MAX_PHOTOS} photos allowed.`,
        variant: 'destructive',
      });
      return;
    }

    try {
      await addPhoto(file);
      toast({
        title: 'Photo added',
        description: file.name,
      });
    } catch (error) {
      toast({
        title: 'Failed to add photo',
        description: file.name,
        variant: 'destructive',
      });
    }
  };

  const handleResetApp = async () => {
    await photoStorage.clearAll();
    await loadPhotos();
    toast({
      title: 'App reset',
      description: 'All photos have been deleted.',
    });
  };

  if (isLoading && photos.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-muted-foreground">Loading your photos...</div>
      </div>
    );
  }

  return (
    <>
      {/* Welcome screen for first-time users */}
      {showWelcome && <WelcomeScreen onGetStarted={handleWelcomeComplete} />}

      <div className="min-h-screen relative">
        {/* Skip to main content link for screen readers */}
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-primary focus:text-primary-foreground focus:rounded-md"
        >
          Skip to main content
        </a>

      {photos.length === 0 ? (
        <>
          <Header />
          <EmptyState onUploadClick={handleUploadClick} />
        </>
      ) : (
        <>
          <div className="px-4 pt-4 pb-2 flex items-center justify-between">
            <h1 className="text-2xl font-semibold tracking-tight" data-testid="text-app-title">
              Photo Wallet
            </h1>
            <div className="flex items-center gap-2">
              <PhotoCounter count={photos.length} />
              <SettingsDialog
                photos={photos}
                onResetApp={handleResetApp}
                onDeletePhoto={deletePhoto}
              />
            </div>
          </div>
          <main id="main-content">
            <PhotoGrid
              photos={photos}
              onPhotoClick={openViewer}
              onDelete={deletePhoto}
              onAddPhotos={handleAddPhotos}
            />
          </main>
        </>
      )}

      <input
        ref={fileInputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        onChange={handleFileSelect}
        multiple
        className="hidden"
      />

      {isViewerOpen && currentPhotoIndex !== null && (
        <PhotoViewer
          photos={photos}
          currentIndex={currentPhotoIndex}
          isOpen={isViewerOpen}
          onClose={closeViewer}
          onIndexChange={setCurrentPhotoIndex}
          onDeletePhoto={deletePhoto}
        />
      )}

      <AlertDialog open={showDuplicateDialog} onOpenChange={setShowDuplicateDialog}>
        <AlertDialogContent data-testid="dialog-duplicate-photo">
          <AlertDialogHeader>
            <AlertDialogTitle>Duplicate Photo Detected</AlertDialogTitle>
            <AlertDialogDescription>
              This photo already exists in your wallet. Do you want to add it anyway?
              <br />
              <span className="text-sm font-medium mt-2 block">{duplicateFile?.name}</span>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={handleSkipDuplicate} data-testid="button-skip-duplicate">
              Skip
            </AlertDialogCancel>
            <AlertDialogAction onClick={handleAddDuplicate} data-testid="button-add-duplicate">
              Add Anyway
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

        <InstallBanner photoCount={photos.length} />
      </div>
    </>
  );
}
