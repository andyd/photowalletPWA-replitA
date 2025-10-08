import { Button } from "@/components/ui/button";
import { RefreshCw } from "lucide-react";

interface UpdateNotificationProps {
  onUpdate: () => void;
}

export function UpdateNotification({ onUpdate }: UpdateNotificationProps) {
  return (
    <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-50 animate-in slide-in-from-bottom-5" data-testid="update-notification">
      <div className="bg-card border rounded-lg shadow-lg p-4 flex items-center gap-4 max-w-sm">
        <div className="flex-1">
          <p className="font-medium text-sm">Update Available</p>
          <p className="text-sm text-muted-foreground">A new version is ready to install</p>
        </div>
        <Button
          size="sm"
          onClick={onUpdate}
          className="shrink-0"
          data-testid="button-update-app"
        >
          <RefreshCw className="w-4 h-4 mr-2" />
          Update
        </Button>
      </div>
    </div>
  );
}
