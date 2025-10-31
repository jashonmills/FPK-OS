import { NotificationCenter } from '@/components/notifications/NotificationCenter';

export const AppHeader = () => {
  return (
    <header className="h-14 border-b border-border bg-background flex items-center justify-between px-4">
      <div className="flex-1">
        <h1 className="text-lg font-semibold">FPK Pulse</h1>
      </div>
      
      <div className="flex items-center gap-2">
        <NotificationCenter />
      </div>
    </header>
  );
};
