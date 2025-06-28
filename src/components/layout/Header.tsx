import { ToothIcon } from '@/components/icons/ToothIcon';

export function Header() {
  return (
    <header className="py-4 px-6 border-b bg-card">
      <div className="container mx-auto flex items-center gap-3">
        <ToothIcon className="h-6 w-6 text-primary" />
        <h1 className="text-2xl font-bold font-headline text-primary">
          DentalTrack
        </h1>
      </div>
    </header>
  );
}
