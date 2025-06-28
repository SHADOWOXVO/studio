import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { WifiOff } from 'lucide-react';

export default function OfflinePage() {
  return (
    <div className="flex items-center justify-center min-h-screen p-4 bg-background">
      <div className="w-full max-w-md">
        <Alert variant="destructive" className="shadow-md">
            <WifiOff className="h-4 w-4" />
            <AlertTitle>You are offline</AlertTitle>
            <AlertDescription>
                It looks like you've lost your internet connection. The page you are
                trying to access is not available offline. Please check your
                connection and try again.
            </AlertDescription>
        </Alert>
      </div>
    </div>
  );
}
