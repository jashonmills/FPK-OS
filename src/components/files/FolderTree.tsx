import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Folder, ChevronRight, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';
import { useState } from 'react';

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
        <Button
          variant="ghost"
          className={cn(
            'w-full justify-start text-left font-normal',
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
  );
};
