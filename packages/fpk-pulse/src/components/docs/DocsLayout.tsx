import { useState } from 'react';
import { SpaceTree } from './SpaceTree';
import { PageEditor } from './PageEditor';
import { PageSidebar } from './PageSidebar';
import { CreateSpaceDialog } from './CreateSpaceDialog';
import { Button } from '@/components/ui/button';
import { Plus, BookOpen, Info } from 'lucide-react';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { useIsMobile } from '@/hooks/use-mobile';

export const DocsLayout = () => {
  const isMobile = useIsMobile();
  const [selectedSpaceId, setSelectedSpaceId] = useState<string | null>(null);
  const [selectedPageId, setSelectedPageId] = useState<string | null>(null);
  const [showCreateSpace, setShowCreateSpace] = useState(false);
  const [showSpaceSheet, setShowSpaceSheet] = useState(false);
  const [showSidebarSheet, setShowSidebarSheet] = useState(false);

  // Mobile Layout
  if (isMobile) {
    return (
      <div className="h-full flex flex-col">
        {/* Mobile Header */}
        <div className="flex-shrink-0 border-b bg-card px-3 py-2 flex items-center gap-2">
          <Sheet open={showSpaceSheet} onOpenChange={setShowSpaceSheet}>
            <SheetTrigger asChild>
              <Button variant="outline" size="sm" className="flex-1">
                <BookOpen className="h-4 w-4 mr-2" />
                Spaces
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-[280px] p-0">
              <SheetHeader className="p-4 border-b">
                <SheetTitle>Spaces & Pages</SheetTitle>
              </SheetHeader>
              <div className="p-4 border-b">
                <Button
                  onClick={() => {
                    setShowCreateSpace(true);
                    setShowSpaceSheet(false);
                  }}
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
                  onSelectPage={(pageId) => {
                    setSelectedPageId(pageId);
                    setShowSpaceSheet(false);
                  }}
                />
              </div>
            </SheetContent>
          </Sheet>

          {selectedPageId && (
            <Sheet open={showSidebarSheet} onOpenChange={setShowSidebarSheet}>
              <SheetTrigger asChild>
                <Button variant="outline" size="sm" className="flex-1">
                  <Info className="h-4 w-4 mr-2" />
                  Details
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[320px] p-0">
                <SheetHeader className="p-4 border-b">
                  <SheetTitle>Page Details</SheetTitle>
                </SheetHeader>
                <div className="overflow-y-auto">
                  <PageSidebar pageId={selectedPageId} />
                </div>
              </SheetContent>
            </Sheet>
          )}
        </div>

        {/* Editor Area */}
        <div className="flex-1 overflow-hidden">
          {selectedPageId ? (
            <PageEditor pageId={selectedPageId} />
          ) : (
            <div className="flex-1 flex items-center justify-center text-muted-foreground p-6">
              <div className="text-center">
                <BookOpen className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p className="text-lg mb-2">Select a page to view</p>
                <p className="text-sm">Tap "Spaces" to browse your documentation</p>
              </div>
            </div>
          )}
        </div>

        {/* Dialogs */}
        <CreateSpaceDialog
          open={showCreateSpace}
          onOpenChange={setShowCreateSpace}
        />
      </div>
    );
  }

  // Desktop Layout
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