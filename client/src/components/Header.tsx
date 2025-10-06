import { InstallPrompt } from './InstallPrompt';

export function Header() {
  return (
    <header className="px-4 pt-8 pb-6">
      <div className="flex items-start justify-between gap-4 mb-2">
        <h1 className="text-3xl font-semibold tracking-tight" data-testid="text-app-title">
          Photo Wallet
        </h1>
        <InstallPrompt />
      </div>
      <p className="text-muted-foreground max-w-lg" data-testid="text-app-subtitle">
        Your important photos at your fingertips, like how your dad had them in his wallet back in the day.
      </p>
    </header>
  );
}
