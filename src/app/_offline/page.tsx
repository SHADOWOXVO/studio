'use client';

import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { WifiOff } from 'lucide-react';

export default function OfflinePage() {
  const handleReload = () => {
    if (typeof window !== 'undefined') {
      window.location.reload();
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen p-4 bg-background">
      <div className="w-full max-w-md text-center">
        <Alert variant="destructive" className="shadow-md">
            <WifiOff className="h-4 w-4" />
            <AlertTitle>You are offline</AlertTitle>
            <AlertDescription>
                It looks like you've lost your internet connection. We couldn't load a new page.
                <br />
                Please check your connection and try again.
            </AlertDescription>
        </Alert>
        <Button onClick={handleReload} className="mt-4">
          Try to Reload
        </Button>
      </div>
    </div>
  );
}
