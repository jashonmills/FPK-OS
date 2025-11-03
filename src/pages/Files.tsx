import { AppLayout } from '@/components/layout/AppLayout';
import { FileBrowser } from '@/components/files/FileBrowser';

const Files = () => {
  return (
    <AppLayout>
      <div className="h-full flex flex-col">
        <div className="flex-shrink-0 border-b bg-card px-6 py-4">
          <div className="space-y-1">
            <h1 className="text-3xl font-bold">Files</h1>
            <p className="text-muted-foreground">
              Manage and organize your project files
            </p>
          </div>
        </div>
        <div className="flex-1 overflow-hidden">
          <FileBrowser />
        </div>
      </div>
    </AppLayout>
  );
};

export default Files;
