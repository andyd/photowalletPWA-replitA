import { PhotoUploader } from '../PhotoUploader';
import { Toaster } from '@/components/ui/toaster';
import { MAX_PHOTOS } from '@/utils/constants';

export default function PhotoUploaderExample() {
  return (
    <>
      <div className="h-screen w-full">
        <PhotoUploader
          onPhotoSelect={async (file) => {
            console.log('Photo selected:', file.name);
          }}
          photoCount={5}
          maxPhotos={MAX_PHOTOS}
        />
      </div>
      <Toaster />
    </>
  );
}
