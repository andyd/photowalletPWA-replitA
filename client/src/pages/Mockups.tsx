import { useState } from 'react';
import { Settings, Plus, X } from 'lucide-react';

type Screen = 'home' | 'album' | 'photo' | 'settings';

export default function Mockups() {
  const [currentScreen, setCurrentScreen] = useState<Screen>('home');
  const [showSettings, setShowSettings] = useState(false);

  // Sample photo URLs (using picsum for demo)
  const samplePhotos = Array.from({ length: 8 }, (_, i) => ({
    id: i + 1,
    url: `https://picsum.photos/seed/${i + 1}/400/400`
  }));

  return (
    <div className="min-h-screen bg-black text-white font-sans">
      {/* Navigation Controls */}
      <div className="fixed top-4 right-4 z-50 flex gap-2">
        <button
          onClick={() => setCurrentScreen('home')}
          className="px-3 py-1 bg-white/10 text-white text-xs rounded hover:bg-white/20"
          data-testid="nav-home"
        >
          Home
        </button>
        <button
          onClick={() => setCurrentScreen('album')}
          className="px-3 py-1 bg-white/10 text-white text-xs rounded hover:bg-white/20"
          data-testid="nav-album"
        >
          Album
        </button>
        <button
          onClick={() => setCurrentScreen('photo')}
          className="px-3 py-1 bg-white/10 text-white text-xs rounded hover:bg-white/20"
          data-testid="nav-photo"
        >
          Photo
        </button>
        <button
          onClick={() => setShowSettings(true)}
          className="px-3 py-1 bg-white/10 text-white text-xs rounded hover:bg-white/20"
          data-testid="nav-settings"
        >
          Settings
        </button>
      </div>

      {/* HOME SCREEN */}
      {currentScreen === 'home' && (
        <div className="flex flex-col items-center justify-center min-h-screen px-8 text-center animate-in fade-in duration-300">
          <h1 className="text-[32px] font-bold mb-4 tracking-tight">
            Photo Wallet
          </h1>
          <p className="text-[16px] text-[#A0A0A0] leading-[1.6] mb-8 max-w-[300px]">
            Photos at your fingertips,<br />
            like dad had in his wallet<br />
            back in the day.
          </p>
          <button
            onClick={() => setCurrentScreen('album')}
            className="min-w-[140px] h-12 px-6 bg-white text-black rounded-full font-semibold text-[16px] transition-all active:scale-95 active:opacity-90"
            data-testid="button-add-photos"
          >
            Add Photos
          </button>
        </div>
      )}

      {/* ALBUM SCREEN (Grid View) */}
      {currentScreen === 'album' && (
        <div className="min-h-screen animate-in fade-in duration-300">
          {/* Top Bar */}
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
              className="w-11 h-11 flex items-center justify-center text-white transition-opacity active:opacity-60"
              aria-label="Add photos"
              data-testid="button-add"
            >
              <Plus className="w-6 h-6" strokeWidth={2} />
            </button>
          </header>

          {/* Photo Grid */}
          <div className="pt-14 px-4 pb-8">
            <div className="grid grid-cols-3 gap-[2px] max-w-md mx-auto">
              {/* Existing photos */}
              {samplePhotos.map((photo) => (
                <button
                  key={photo.id}
                  onClick={() => setCurrentScreen('photo')}
                  className="aspect-square rounded-[3px] overflow-hidden transition-transform active:scale-95"
                  data-testid={`photo-${photo.id}`}
                >
                  <img
                    src={photo.url}
                    alt={`Photo ${photo.id}`}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
              
              {/* Empty slots */}
              {Array.from({ length: 4 }, (_, i) => (
                <div
                  key={`empty-${i}`}
                  className="aspect-square rounded-[3px] bg-[#1A1A1A] border border-dashed border-[#333333]"
                />
              ))}
            </div>
            
            {/* Photo counter */}
            <p className="text-center text-[12px] text-[#666666] mt-6">
              8 of 12 photos
            </p>
          </div>
        </div>
      )}

      {/* PHOTO SCREEN (Fullscreen Carousel) */}
      {currentScreen === 'photo' && (
        <div 
          className="fixed inset-0 bg-black z-20 animate-in fade-in duration-200"
          onClick={() => setCurrentScreen('album')}
        >
          <div className="flex overflow-x-auto snap-x snap-mandatory h-full gap-1 scrollbar-hide">
            {samplePhotos.map((photo) => (
              <div
                key={photo.id}
                className="flex-shrink-0 w-screen h-full snap-center flex items-center justify-center"
              >
                <img
                  src={photo.url}
                  alt={`Photo ${photo.id}`}
                  className="max-w-full max-h-full object-contain"
                />
              </div>
            ))}
          </div>
          
          {/* Hint to tap to exit (fades out) */}
          <div className="absolute bottom-8 left-0 right-0 text-center text-white/60 text-sm animate-in fade-in duration-500 animate-out fade-out delay-2000">
            Tap anywhere to exit
          </div>
        </div>
      )}

      {/* SETTINGS MODAL */}
      {showSettings && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-30 animate-in fade-in duration-200">
          <div className="bg-[#1A1A1A] rounded-2xl p-6 max-w-[320px] w-[90%] text-center animate-in zoom-in-95 duration-200">
            <h2 className="text-[24px] font-semibold mb-6">Settings</h2>
            
            <div className="space-y-4 text-left mb-6">
              <button className="w-full text-[16px] text-white py-2 text-left hover:text-[#E6A157] transition-colors">
                About Photo Wallet
              </button>
              <button className="w-full text-[16px] text-white py-2 text-left hover:text-[#C44536] transition-colors">
                Clear All Photos
              </button>
              <button className="w-full text-[16px] text-white py-2 text-left hover:text-[#4A9B9B] transition-colors">
                Install App
              </button>
              <button className="w-full text-[16px] text-white py-2 text-left hover:text-[#E6A157] transition-colors">
                Privacy Policy
              </button>
              <button className="w-full text-[16px] text-white py-2 text-left hover:text-[#E6A157] transition-colors">
                Share Feedback
              </button>
            </div>

            <button
              onClick={() => setShowSettings(false)}
              className="min-w-[120px] h-12 px-6 bg-white text-black rounded-full font-semibold text-[16px] transition-all active:scale-95"
              data-testid="button-close-settings"
            >
              Close
            </button>
          </div>
        </div>
      )}

      <style>{`
        @keyframes fade-in {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        
        @keyframes zoom-in-95 {
          from { transform: scale(0.95); opacity: 0; }
          to { transform: scale(1); opacity: 1; }
        }

        .animate-in {
          animation-fill-mode: both;
        }

        .fade-in {
          animation-name: fade-in;
        }

        .zoom-in-95 {
          animation-name: zoom-in-95;
        }

        .duration-200 {
          animation-duration: 200ms;
        }

        .duration-300 {
          animation-duration: 300ms;
        }

        .duration-500 {
          animation-duration: 500ms;
        }

        .delay-2000 {
          animation-delay: 2000ms;
        }

        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }

        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </div>
  );
}
