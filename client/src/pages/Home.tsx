import { useEffect, useRef, useState } from 'react';
import { usePhotoStore } from '@/hooks/usePhotoStore';
import { Header } from '@/components/Header';
import { PhotoCounter } from '@/components/PhotoCounter';
import { EmptyState } from '@/components/EmptyState';
import { PhotoGrid } from '@/components/PhotoGrid';
import { PhotoViewer } from '@/components/PhotoViewer';
import { SettingsDialog } from '@/components/SettingsDialog';
import { InstallBanner } from '@/components/InstallBanner';
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

  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();
  const [duplicateFile, setDuplicateFile] = useState<File | null>(null);
  const [showDuplicateDialog, setShowDuplicateDialog] = useState(false);
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
    <div className="min-h-screen relative">
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
          <PhotoGrid
            photos={photos}
            onPhotoClick={openViewer}
            onDelete={deletePhoto}
            onAddPhotos={handleAddPhotos}
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

      <InstallBanner photoCount={photos.length} />
    </div>
  );
}
