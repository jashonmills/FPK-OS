import { useState } from 'react';
import { SpaceTree } from './SpaceTree';
import { PageEditor } from './PageEditor';
import { PageSidebar } from './PageSidebar';
import { CreateSpaceDialog } from './CreateSpaceDialog';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';

export const DocsLayout = () => {
  const [selectedSpaceId, setSelectedSpaceId] = useState<string | null>(null);
  const [selectedPageId, setSelectedPageId] = useState<string | null>(null);
  const [showCreateSpace, setShowCreateSpace] = useState(false);

  return (
    <div className="h-full flex">
      {/* Left Sidebar - Spaces & Pages Tree */}
      <div className="w-72 border-r bg-card flex-shrink-0 flex flex-col">
        <div className="p-4 border-b">
          <Button
            onClick={() => setShowCreateSpace(true)}
            className="w-full"
            size="sm"
          >
            <Plus className="h-4 w-4 mr-2" />
            New Space
          </Button>
        </div>
        <div className="flex-1 overflow-y-auto">
          <SpaceTree
            selectedSpaceId={selectedSpaceId}
            selectedPageId={selectedPageId}
            onSelectSpace={setSelectedSpaceId}
            onSelectPage={setSelectedPageId}
          />
        </div>
      </div>

      {/* Center - Page Editor */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {selectedPageId ? (
          <PageEditor pageId={selectedPageId} />
        ) : (
          <div className="flex-1 flex items-center justify-center text-muted-foreground">
            <div className="text-center">
              <p className="text-lg mb-2">Select a page to view</p>
              <p className="text-sm">or create a new one</p>
            </div>
          </div>
        )}
      </div>

      {/* Right Sidebar - Page Details */}
      {selectedPageId && (
        <div className="w-80 border-l bg-card flex-shrink-0 overflow-y-auto">
          <PageSidebar pageId={selectedPageId} />
        </div>
      )}

      {/* Dialogs */}
      <CreateSpaceDialog
        open={showCreateSpace}
        onOpenChange={setShowCreateSpace}
      />
    </div>
  );
};
