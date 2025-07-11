import { Button } from '@/components/ui/button';
import { ToothIcon } from '@/components/icons/ToothIcon';
import { Download, Upload } from 'lucide-react';

interface HeaderProps {
  onExport: () => void;
  onImport: () => void;
}

export function Header({ onExport, onImport }: HeaderProps) {
  return (
    <header className="py-4 px-6 border-b bg-card">
      <div className="container mx-auto flex items-center justify-between">
        <div className="flex items-center gap-3">
          <ToothIcon className="h-6 w-6 text-primary" />
          <h1 className="text-2xl font-bold font-headline text-primary">
            DentalTrack
          </h1>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={onImport}>
            <Upload className="mr-2 h-4 w-4" /> Import Data
          </Button>
          <Button variant="outline" size="sm" onClick={onExport}>
            <Download className="mr-2 h-4 w-4" /> Export Data
          </Button>
        </div>
      </div>
    </header>
  );
}
