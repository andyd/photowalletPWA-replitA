interface UpdateNotificationProps {
  onUpdate: () => void;
}

export function UpdateNotification({ onUpdate }: UpdateNotificationProps) {
  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 animate-in slide-in-from-bottom-5" data-testid="update-notification">
      <button
        onClick={onUpdate}
        className="py-3 px-6 bg-white text-black rounded-full transition-opacity active:opacity-60 shadow-lg text-sm font-medium"
        data-testid="button-update-app"
      >
        Update Available
      </button>
    </div>
  );
}
