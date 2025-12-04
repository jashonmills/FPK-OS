import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Folder, ChevronRight, ChevronDown, MoreVertical, Pencil, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';
import { useState } from 'react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { RenameFolderDialog } from './RenameFolderDialog';
import { toast } from 'sonner';

interface FolderTreeProps {
  selectedFolderId: string | null;
  onSelectFolder: (folderId: string | null) => void;
}

interface FolderNode {
  id: string;
  name: string;
  parent_folder_id: string | null;
  children?: FolderNode[];
}

export const FolderTree = ({ selectedFolderId, onSelectFolder }: FolderTreeProps) => {
  const [expandedFolders, setExpandedFolders] = useState<Set<string>>(new Set());
  const [renameFolder, setRenameFolder] = useState<{ id: string; name: string } | null>(null);
  const [deleteFolder, setDeleteFolder] = useState<{ id: string; name: string } | null>(null);
  const queryClient = useQueryClient();

  const { data: folders, isLoading } = useQuery({
    queryKey: ['file-folders'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('file_folders')
        .select('*')
        .order('name');

      if (error) throw error;
      return data as FolderNode[];
    },
  });

  const buildTree = (folders: FolderNode[]): FolderNode[] => {
    const folderMap = new Map<string, FolderNode>();
    const rootFolders: FolderNode[] = [];

    folders.forEach(folder => {
      folderMap.set(folder.id, { ...folder, children: [] });
    });

    folders.forEach(folder => {
      const node = folderMap.get(folder.id)!;
      if (folder.parent_folder_id) {
        const parent = folderMap.get(folder.parent_folder_id);
        if (parent) {
          parent.children!.push(node);
        }
      } else {
        rootFolders.push(node);
      }
    });

    return rootFolders;
  };

  const deleteMutation = useMutation({
    mutationFn: async (folderId: string) => {
      const { error } = await supabase
        .from('file_folders')
        .delete()
        .eq('id', folderId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['file-folders'] });
      toast.success('Folder deleted successfully');
      setDeleteFolder(null);
      if (selectedFolderId === deleteFolder?.id) {
        onSelectFolder(null);
      }
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to delete folder');
    },
  });

  const toggleFolder = (folderId: string) => {
    setExpandedFolders(prev => {
      const next = new Set(prev);
      if (next.has(folderId)) {
        next.delete(folderId);
      } else {
        next.add(folderId);
      }
      return next;
    });
  };

  const renderFolder = (folder: FolderNode, level: number = 0) => {
    const isExpanded = expandedFolders.has(folder.id);
    const hasChildren = folder.children && folder.children.length > 0;
    const isSelected = selectedFolderId === folder.id;

    return (
      <div key={folder.id}>
        <div className="flex items-center group">
          <Button
            variant="ghost"
            className={cn(
              'flex-1 justify-start text-left font-normal',
              isSelected && 'bg-accent'
            )}
            style={{ paddingLeft: `${level * 1 + 0.5}rem` }}
            onClick={() => onSelectFolder(folder.id)}
          >
            {hasChildren && (
              <Button
                variant="ghost"
                size="sm"
                className="h-4 w-4 p-0 mr-1"
                onClick={(e) => {
                  e.stopPropagation();
                  toggleFolder(folder.id);
                }}
              >
                {isExpanded ? (
                  <ChevronDown className="h-3 w-3" />
                ) : (
                  <ChevronRight className="h-3 w-3" />
                )}
              </Button>
            )}
            <Folder className="h-4 w-4 mr-2" />
            <span className="truncate">{folder.name}</span>
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className="h-8 w-8 p-0 opacity-0 group-hover:opacity-100"
                onClick={(e) => e.stopPropagation()}
              >
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => setRenameFolder({ id: folder.id, name: folder.name })}>
                <Pencil className="h-4 w-4 mr-2" />
                Rename
              </DropdownMenuItem>
              <DropdownMenuItem 
                onClick={() => setDeleteFolder({ id: folder.id, name: folder.name })}
                className="text-destructive"
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        {isExpanded && hasChildren && (
          <div>
            {folder.children!.map(child => renderFolder(child, level + 1))}
          </div>
        )}
      </div>
    );
  };

  if (isLoading) {
    return <div className="p-4 text-sm text-muted-foreground">Loading folders...</div>;
  }

  const folderTree = folders ? buildTree(folders) : [];

  return (
    <>
      <ScrollArea className="flex-1">
        <div className="p-2">
          <Button
            variant="ghost"
            className={cn(
              'w-full justify-start text-left font-normal mb-1',
              selectedFolderId === null && 'bg-accent'
            )}
            onClick={() => onSelectFolder(null)}
          >
            <Folder className="h-4 w-4 mr-2" />
            All Files
          </Button>
          {folderTree.map(folder => renderFolder(folder))}
        </div>
      </ScrollArea>

      <RenameFolderDialog
        folderId={renameFolder?.id || null}
        currentName={renameFolder?.name || ''}
        onClose={() => setRenameFolder(null)}
      />

      <AlertDialog open={!!deleteFolder} onOpenChange={() => setDeleteFolder(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Folder</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete "{deleteFolder?.name}"? This action cannot be undone.
              All files in this folder will remain but will no longer be organized in this folder.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => deleteFolder && deleteMutation.mutate(deleteFolder.id)}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};
