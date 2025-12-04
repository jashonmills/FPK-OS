import { useState } from 'react';
import { FolderTree } from './FolderTree';
import { FileGrid } from './FileGrid';
import { FileLargeGrid } from './FileLargeGrid';
import { FileList } from './FileList';
import { FileUploader } from './FileUploader';
import { FilePreview } from './FilePreview';
import { CreateFolderDialog } from './CreateFolderDialog';
import { FileFilters } from './FileFilters';
import { Button } from '@/components/ui/button';
import { Grid3x3, Grid2x2, List, FolderPlus, Upload, FolderOpen, SlidersHorizontal } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { useIsMobile } from '@/hooks/use-mobile';

type ViewMode = 'grid' | 'large' | 'list';

export const FileBrowser = () => {
  const isMobile = useIsMobile();
  const [viewMode, setViewMode] = useState<ViewMode>(() => {
    return (localStorage.getItem('fileViewMode') as ViewMode) || 'grid';
  });
  const [selectedFolderId, setSelectedFolderId] = useState<string | null>(null);
  const [selectedFileId, setSelectedFileId] = useState<string | null>(null);
  const [showUploader, setShowUploader] = useState(false);
  const [showCreateFolder, setShowCreateFolder] = useState(false);
  const [showFolderSheet, setShowFolderSheet] = useState(false);
  const [showFilterSheet, setShowFilterSheet] = useState(false);
  const [filters, setFilters] = useState({
    fileTypes: [] as string[],
    tags: [] as string[],
    dateRange: null as { start: Date; end: Date } | null,
    uploaderId: null as string | null,
  });

  const handleViewModeChange = (mode: ViewMode) => {
    setViewMode(mode);
    localStorage.setItem('fileViewMode', mode);
  };

  // Mobile Layout
  if (isMobile) {
    return (
      <div className="h-full flex flex-col">
        {/* Mobile Toolbar */}
        <div className="flex-shrink-0 border-b bg-card px-3 py-2 space-y-2">
          {/* Action Buttons */}
          <div className="flex items-center gap-2">
            <Sheet open={showFolderSheet} onOpenChange={setShowFolderSheet}>
              <SheetTrigger asChild>
                <Button variant="outline" size="sm" className="flex-1">
                  <FolderOpen className="h-4 w-4 mr-2" />
                  Folders
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-[280px] p-0">
                <SheetHeader className="p-4 border-b">
                  <SheetTitle>Folders</SheetTitle>
                </SheetHeader>
                <div className="p-4 space-y-2">
                  <Button
                    onClick={() => {
                      setShowCreateFolder(true);
                      setShowFolderSheet(false);
                    }}
                    className="w-full"
                    size="sm"
                  >
                    <FolderPlus className="h-4 w-4 mr-2" />
                    New Folder
                  </Button>
                  <Button
                    onClick={() => {
                      setShowUploader(true);
                      setShowFolderSheet(false);
                    }}
                    className="w-full"
                    variant="outline"
                    size="sm"
                  >
                    <Upload className="h-4 w-4 mr-2" />
                    Upload Files
                  </Button>
                </div>
                <Separator />
                <div className="overflow-y-auto">
                  <FolderTree
                    selectedFolderId={selectedFolderId}
                    onSelectFolder={(id) => {
                      setSelectedFolderId(id);
                      setShowFolderSheet(false);
                    }}
                  />
                </div>
              </SheetContent>
            </Sheet>

            <Sheet open={showFilterSheet} onOpenChange={setShowFilterSheet}>
              <SheetTrigger asChild>
                <Button variant="outline" size="sm" className="flex-1">
                  <SlidersHorizontal className="h-4 w-4 mr-2" />
                  Filters
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[320px] p-0">
                <SheetHeader className="p-4 border-b">
                  <SheetTitle>Filters</SheetTitle>
                </SheetHeader>
                <div className="overflow-y-auto">
                  <FileFilters filters={filters} onFiltersChange={setFilters} />
                </div>
              </SheetContent>
            </Sheet>
          </div>

          {/* View Mode Buttons */}
          <div className="flex items-center gap-2 justify-center">
            <Button
              variant={viewMode === 'grid' ? 'default' : 'outline'}
              size="sm"
              onClick={() => handleViewModeChange('grid')}
              className="flex-1"
            >
              <Grid3x3 className="h-4 w-4" />
            </Button>
            <Button
              variant={viewMode === 'large' ? 'default' : 'outline'}
              size="sm"
              onClick={() => handleViewModeChange('large')}
              className="flex-1"
            >
              <Grid2x2 className="h-4 w-4" />
            </Button>
            <Button
              variant={viewMode === 'list' ? 'default' : 'outline'}
              size="sm"
              onClick={() => handleViewModeChange('list')}
              className="flex-1"
            >
              <List className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* File Display Area */}
        <div className="flex-1 overflow-y-auto p-4">
          {viewMode === 'grid' ? (
            <FileGrid
              folderId={selectedFolderId}
              filters={filters}
              onSelectFile={setSelectedFileId}
            />
          ) : viewMode === 'large' ? (
            <FileLargeGrid
              folderId={selectedFolderId}
              filters={filters}
              onSelectFile={setSelectedFileId}
            />
          ) : (
            <FileList
              folderId={selectedFolderId}
              filters={filters}
              onSelectFile={setSelectedFileId}
            />
          )}
        </div>

        {/* Modals */}
        <FileUploader
          open={showUploader}
          onOpenChange={setShowUploader}
          folderId={selectedFolderId}
        />

        <CreateFolderDialog
          open={showCreateFolder}
          onOpenChange={setShowCreateFolder}
          parentFolderId={selectedFolderId}
        />

        <FilePreview
          fileId={selectedFileId}
          onClose={() => setSelectedFileId(null)}
        />
      </div>
    );
  }

  // Desktop Layout
  return (
    <div className="h-full flex">
      {/* Left Sidebar - Folder Tree */}
      <div className="w-64 border-r bg-card flex-shrink-0 overflow-y-auto">
        <div className="p-4 space-y-2">
          <Button
            onClick={() => setShowCreateFolder(true)}
            className="w-full"
            size="sm"
          >
            <FolderPlus className="h-4 w-4 mr-2" />
            New Folder
          </Button>
          <Button
            onClick={() => setShowUploader(true)}
            className="w-full"
            variant="outline"
            size="sm"
          >
            <Upload className="h-4 w-4 mr-2" />
            Upload Files
          </Button>
        </div>
        <Separator />
        <FolderTree
          selectedFolderId={selectedFolderId}
          onSelectFolder={setSelectedFolderId}
        />
      </div>

      {/* Center - File Display */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Toolbar */}
        <div className="flex-shrink-0 border-b bg-card px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Button
              variant={viewMode === 'grid' ? 'default' : 'outline'}
              size="sm"
              onClick={() => handleViewModeChange('grid')}
            >
              <Grid3x3 className="h-4 w-4" />
            </Button>
            <Button
              variant={viewMode === 'large' ? 'default' : 'outline'}
              size="sm"
              onClick={() => handleViewModeChange('large')}
            >
              <Grid2x2 className="h-4 w-4" />
            </Button>
            <Button
              variant={viewMode === 'list' ? 'default' : 'outline'}
              size="sm"
              onClick={() => handleViewModeChange('list')}
            >
              <List className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* File Display Area */}
        <div className="flex-1 overflow-y-auto p-6">
          {viewMode === 'grid' ? (
            <FileGrid
              folderId={selectedFolderId}
              filters={filters}
              onSelectFile={setSelectedFileId}
            />
          ) : viewMode === 'large' ? (
            <FileLargeGrid
              folderId={selectedFolderId}
              filters={filters}
              onSelectFile={setSelectedFileId}
            />
          ) : (
            <FileList
              folderId={selectedFolderId}
              filters={filters}
              onSelectFile={setSelectedFileId}
            />
          )}
        </div>
      </div>

      {/* Right Sidebar - Filters */}
      <div className="w-80 border-l bg-card flex-shrink-0 overflow-y-auto">
        <FileFilters filters={filters} onFiltersChange={setFilters} />
      </div>

      {/* Modals */}
      <FileUploader
        open={showUploader}
        onOpenChange={setShowUploader}
        folderId={selectedFolderId}
      />

      <CreateFolderDialog
        open={showCreateFolder}
        onOpenChange={setShowCreateFolder}
        parentFolderId={selectedFolderId}
      />

      <FilePreview
        fileId={selectedFileId}
        onClose={() => setSelectedFileId(null)}
      />
    </div>
  );
};