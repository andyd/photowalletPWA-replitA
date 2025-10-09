import { useEffect, useRef, useState } from 'react';
import { Settings, Plus } from 'lucide-react';
import { usePhotoStore, MAX_PHOTOS } from '@/hooks/usePhotoStore';
import { usePWA } from '@/hooks/usePWA';
import { EmptyState } from '@/components/EmptyState';
import { PhotoGrid } from '@/components/PhotoGrid';
import { PhotoViewer } from '@/components/PhotoViewer';
import { SettingsDialog } from '@/components/SettingsDialog';
import { UpdateNotification } from '@/components/UpdateNotification';
import { photoStorage } from '@/services/photoStorage';
import { useToast } from '@/hooks/use-toast';
import { isDuplicatePhoto } from '@/utils/photoUtils';
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

  const { updateAvailable, applyUpdate } = usePWA();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();
  const [duplicateFile, setDuplicateFile] = useState<File | null>(null);
  const [showDuplicateDialog, setShowDuplicateDialog] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const pendingFilesRef = useRef<File[]>([]);

  useEffect(() => {
    loadPhotos();
  }, [loadPhotos]);

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
    pendingFilesRef.current = fileArray;
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
    try {
      await addPhoto(file);
      toast({
        title: 'Photo added',
        description: file.name,
      });
    } catch (error) {
      if (error instanceof Error && error.message === 'WALLET_FULL') {
        toast({
          title: 'Your wallet is full',
          description: 'Remove photos to add more (12 max)',
          variant: 'destructive',
        });
      } else {
        toast({
          title: 'Failed to add photo',
          description: file.name,
          variant: 'destructive',
        });
      }
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
    <div className="min-h-screen relative bg-black">
      {photos.length === 0 ? (
        <EmptyState onUploadClick={handleUploadClick} />
      ) : (
        <>
          {/* Top Bar - Icon only */}
          <header className="fixed top-0 left-0 right-0 h-14 flex items-center justify-between px-4 z-10">
            <button
              onClick={() => setShowSettings(true)}
              className="w-11 h-11 flex items-center justify-center text-white transition-opacity active:opacity-60"
              aria-label="Settings"
              data-testid="button-settings"
            >
              <Settings className="w-6 h-6" strokeWidth={2} />
            </button>
            <button
              onClick={handleUploadClick}
              className="w-11 h-11 flex items-center justify-center text-white transition-opacity active:opacity-60"
              aria-label="Add photos"
              data-testid="button-add-photos"
            >
              <Plus className="w-6 h-6" strokeWidth={2} />
            </button>
          </header>

          <div className="pt-14">
            <PhotoGrid
              photos={photos}
              onPhotoClick={openViewer}
              onDelete={deletePhoto}
              onAddPhotos={handleAddPhotos}
            />
          </div>

          <SettingsDialog 
            photos={photos}
            onResetApp={handleResetApp}
            onDeletePhoto={deletePhoto}
            open={showSettings}
            onOpenChange={setShowSettings}
          />
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
      
      {updateAvailable && <UpdateNotification onUpdate={applyUpdate} />}
    </div>
  );
}
