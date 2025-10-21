import { useEffect, useRef, useState } from 'react';
import { Plus } from 'lucide-react';
import { usePhotoStore } from '@/hooks/usePhotoStore';
import { Button } from '@/components/ui/button';
import { Header } from '@/components/Header';
import { PhotoCounter } from '@/components/PhotoCounter';
import { EmptyState } from '@/components/EmptyState';
import { PhotoGrid } from '@/components/PhotoGrid';
import { PhotoViewer } from '@/components/PhotoViewer';
import { SettingsDialog } from '@/components/SettingsDialog';
import { ManagePhotosDialog } from '@/components/ManagePhotosDialog';
import { InstallBanner } from '@/components/InstallBanner';
import { WelcomeScreen } from '@/components/WelcomeScreen';
import { photoStorage } from '@/services/photoStorage';
import { isDuplicatePhoto } from '@/utils/photoUtils';
import { MAX_PHOTOS } from '@/utils/constants';

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
  const [showWelcome, setShowWelcome] = useState(false);
  const [showManagePhotos, setShowManagePhotos] = useState(false);
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

    // If at limit, show warning and open manage photos
    if (remainingSlots <= 0) {
      alert(`Your wallet is full (${MAX_PHOTOS} photos). Please remove some photos before adding more.`);
      setShowManagePhotos(true);
      return;
    }

    // Only process files up to the limit
    if (fileArray.length > remainingSlots) {
      alert(`You can only add ${remainingSlots} more photo${remainingSlots === 1 ? '' : 's'}. Your wallet limit is ${MAX_PHOTOS} photos.`);
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

    // Skip duplicates silently, no dialog needed
    if (!isDuplicate) {
      await addPhotoToStore(file);
    }
    
    pendingFilesRef.current = pendingFilesRef.current.slice(1);
    await processNextFile();
  };


  const addPhotoToStore = async (file: File) => {
    // Double-check limit before adding (in case photos array changed)
    if (photos.length >= MAX_PHOTOS) {
      return;
    }

    try {
      await addPhoto(file);
      // Photo added silently, no toast needed
    } catch (error) {
      // Failed silently, user will see photo didn't appear
      console.error('Failed to add photo:', error);
    }
  };

  const handleResetApp = async () => {
    await photoStorage.clearAll();
    await loadPhotos();
    // App reset silently, no toast needed
  };

  const handleRemovePhoto = async (id: string) => {
    // Move to overflow folder instead of deleting
    await photoStorage.archivePhoto(id);
    await loadPhotos();
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
        <EmptyState onUploadClick={handleUploadClick} />
      ) : (
        <>
          <div className="px-4 pt-4 pb-2 flex items-center justify-between">
            <h1 className="text-2xl font-semibold tracking-tight" data-testid="text-app-title">
              Photo Wallet
            </h1>
            <div className="flex items-center gap-2">
              <PhotoCounter 
                count={photos.length} 
                onClick={() => setShowManagePhotos(true)}
              />
              <Button
                size="sm"
                onClick={handleUploadClick}
                disabled={photos.length >= MAX_PHOTOS}
                data-testid="button-add-photos-header"
                className="gap-1"
              >
                <Plus className="w-4 h-4" />
                <span className="hidden sm:inline">Add Photos</span>
              </Button>
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

      <ManagePhotosDialog
        photos={photos}
        open={showManagePhotos}
        onOpenChange={setShowManagePhotos}
        onDelete={handleRemovePhoto}
      />

        <InstallBanner photoCount={photos.length} />
      </div>
    </>
  );
}
