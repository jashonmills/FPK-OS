import React, { useState } from 'react';
import { Folder as FolderIcon, Plus, MoreVertical, Trash2, Edit2, FolderOpen } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { useAICoachFolders, Folder } from '@/hooks/useAICoachFolders';
import { cn } from '@/lib/utils';

interface FolderManagerProps {
  folderType: 'study_material' | 'saved_chat';
  orgId?: string;
  selectedFolderId: string | null;
  onSelectFolder: (folderId: string | null) => void;
  onFolderCreated?: () => void;
  onDrop?: (folderId: string | null, folderName?: string) => void;
}

export function FolderManager({
  folderType,
  orgId,
  selectedFolderId,
  onSelectFolder,
  onFolderCreated,
  onDrop
}: FolderManagerProps) {
  const { folders, isLoadingFolders, createFolder, renameFolder, deleteFolder } = useAICoachFolders(folderType, orgId);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isRenameDialogOpen, setIsRenameDialogOpen] = useState(false);
  const [folderToRename, setFolderToRename] = useState<Folder | null>(null);
  const [newFolderName, setNewFolderName] = useState('');
  const [dragOverFolderId, setDragOverFolderId] = useState<string | null>(null);

  const handleCreateFolder = async () => {
    if (!newFolderName.trim()) return;
    const success = await createFolder(newFolderName);
    if (success) {
      setNewFolderName('');
      setIsCreateDialogOpen(false);
      onFolderCreated?.();
    }
  };

  const handleRenameFolder = async () => {
    if (!folderToRename || !newFolderName.trim()) return;
    const success = await renameFolder(folderToRename.id, newFolderName);
    if (success) {
      setIsRenameDialogOpen(false);
      setFolderToRename(null);
      setNewFolderName('');
    }
  };

  const handleDeleteFolder = async (folderId: string) => {
    if (confirm('Delete this folder? Items inside will not be deleted.')) {
      await deleteFolder(folderId);
      if (selectedFolderId === folderId) {
        onSelectFolder(null);
      }
    }
  };

  return (
    <div className="space-y-2">
      {/* "All Items" view */}
      <div
        onClick={() => onSelectFolder(null)}
        onDragOver={(e) => {
          e.preventDefault();
          e.stopPropagation();
          setDragOverFolderId('all-items');
        }}
        onDragLeave={(e) => {
          e.preventDefault();
          e.stopPropagation();
          setDragOverFolderId(null);
        }}
        onDrop={(e) => {
          e.preventDefault();
          e.stopPropagation();
          setDragOverFolderId(null);
          onDrop?.(null, 'All Items');
        }}
        className={cn(
          "flex items-center justify-between p-2 rounded cursor-pointer transition",
          selectedFolderId === null
            ? "bg-blue-100 text-blue-900"
            : dragOverFolderId === 'all-items'
            ? "bg-blue-50 ring-2 ring-blue-400"
            : "hover:bg-gray-100"
        )}
      >
        <div className="flex items-center gap-2">
          <FolderOpen className="w-4 h-4" />
          <span className="text-sm font-medium">All Items</span>
        </div>
      </div>

      {/* Folders list */}
      {isLoadingFolders ? (
        <p className="text-sm text-gray-500 italic animate-pulse">Loading folders...</p>
      ) : (
        folders.map((folder) => (
          <div
            key={folder.id}
            onClick={() => onSelectFolder(folder.id)}
            onDragOver={(e) => {
              e.preventDefault();
              e.stopPropagation();
              setDragOverFolderId(folder.id);
            }}
            onDragLeave={(e) => {
              e.preventDefault();
              e.stopPropagation();
              setDragOverFolderId(null);
            }}
            onDrop={(e) => {
              e.preventDefault();
              e.stopPropagation();
              setDragOverFolderId(null);
              onDrop?.(folder.id, folder.name);
            }}
            className={cn(
              "flex items-center justify-between p-2 rounded cursor-pointer transition group",
              selectedFolderId === folder.id
                ? "bg-blue-100 text-blue-900"
                : dragOverFolderId === folder.id
                ? "bg-blue-50 ring-2 ring-blue-400"
                : "hover:bg-gray-100"
            )}
          >
            <div className="flex items-center gap-2">
              <FolderIcon className="w-4 h-4" />
              <span className="text-sm font-medium">{folder.name}</span>
              <span className="text-xs text-gray-500">({folder.item_count || 0})</span>
            </div>
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                <Button
                  variant="ghost"
                  size="sm"
                  className="opacity-0 group-hover:opacity-100 h-6 w-6 p-0"
                >
                  <MoreVertical className="w-3 h-3" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem
                  onClick={(e) => {
                    e.stopPropagation();
                    setFolderToRename(folder);
                    setNewFolderName(folder.name);
                    setIsRenameDialogOpen(true);
                  }}
                >
                  <Edit2 className="w-3 h-3 mr-2" />
                  Rename
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDeleteFolder(folder.id);
                  }}
                  className="text-red-600"
                >
                  <Trash2 className="w-3 h-3 mr-2" />
                  Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        ))
      )}

      {/* New Folder Button */}
      <Button
        variant="outline"
        size="sm"
        onClick={() => setIsCreateDialogOpen(true)}
        className="w-full mt-2"
      >
        <Plus className="w-4 h-4 mr-2" />
        New Folder
      </Button>

      {/* Create Folder Dialog */}
      <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create New Folder</DialogTitle>
            <DialogDescription>
              Enter a name for your new folder
            </DialogDescription>
          </DialogHeader>
          <Input
            placeholder="Folder name"
            value={newFolderName}
            onChange={(e) => setNewFolderName(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleCreateFolder()}
          />
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleCreateFolder}>Create</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Rename Folder Dialog */}
      <Dialog open={isRenameDialogOpen} onOpenChange={setIsRenameDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Rename Folder</DialogTitle>
            <DialogDescription>
              Enter a new name for "{folderToRename?.name}"
            </DialogDescription>
          </DialogHeader>
          <Input
            placeholder="Folder name"
            value={newFolderName}
            onChange={(e) => setNewFolderName(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleRenameFolder()}
          />
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsRenameDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleRenameFolder}>Rename</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
