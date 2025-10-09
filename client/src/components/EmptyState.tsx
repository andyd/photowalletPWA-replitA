interface EmptyStateProps {
  onUploadClick: () => void;
}

export function EmptyState({ onUploadClick }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-8 text-center bg-black">
      <h1 className="text-[32px] font-bold mb-4 tracking-tight text-white" data-testid="text-empty-title">
        Photo Wallet
      </h1>
      <p className="text-[16px] text-muted-foreground leading-[1.6] mb-8 max-w-[300px]" data-testid="text-empty-description">
        Photos at your fingertips,<br />
        like dad had in his wallet<br />
        back in the day.
      </p>
      <button
        onClick={onUploadClick}
        data-testid="button-add-first-photo"
        className="min-w-[140px] h-12 px-6 bg-white text-black rounded-full font-semibold text-[16px] transition-all active:scale-95 active:opacity-90"
      >
        Add Photos
      </button>
    </div>
  );
}
