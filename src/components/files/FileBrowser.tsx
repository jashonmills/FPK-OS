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
import { Grid3x3, Grid2x2, List, FolderPlus, Upload } from 'lucide-react';
import { Separator } from '@/components/ui/separator';

type ViewMode = 'grid' | 'large' | 'list';

export const FileBrowser = () => {
  const [viewMode, setViewMode] = useState<ViewMode>(() => {
    return (localStorage.getItem('fileViewMode') as ViewMode) || 'grid';
  });
  const [selectedFolderId, setSelectedFolderId] = useState<string | null>(null);
  const [selectedFileId, setSelectedFileId] = useState<string | null>(null);
  const [showUploader, setShowUploader] = useState(false);
  const [showCreateFolder, setShowCreateFolder] = useState(false);
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
