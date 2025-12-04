import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { ChevronRight, ChevronDown, FileText, FolderOpen, Folder, Plus, Settings, Lock, Package, Filter } from 'lucide-react';
import { cn } from '@/lib/utils';
import { CreatePageDialog } from './CreatePageDialog';
import { SpacePermissionsDialog } from './SpacePermissionsDialog';
import { Toggle } from '@/components/ui/toggle';

interface SpaceTreeProps {
  selectedSpaceId: string | null;
  selectedPageId: string | null;
  onSelectSpace: (spaceId: string) => void;
  onSelectPage: (pageId: string) => void;
}

interface PageNode {
  id: string;
  title: string;
  space_id: string;
  parent_page_id: string | null;
  children?: PageNode[];
}

export const SpaceTree = ({
  selectedSpaceId,
  selectedPageId,
  onSelectSpace,
  onSelectPage,
}: SpaceTreeProps) => {
  const [expandedSpaces, setExpandedSpaces] = useState<Set<string>>(new Set());
  const [expandedPages, setExpandedPages] = useState<Set<string>>(new Set());
  const [showCreatePage, setShowCreatePage] = useState(false);
  const [createPageSpaceId, setCreatePageSpaceId] = useState<string | null>(null);
  const [showPermissions, setShowPermissions] = useState(false);
  const [permissionsSpaceId, setPermissionsSpaceId] = useState<string | null>(null);
  const [permissionsSpaceName, setPermissionsSpaceName] = useState('');
  const [showPersonalSpaces, setShowPersonalSpaces] = useState(true);

  const { data: spaces } = useQuery({
    queryKey: ['documentation-spaces'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('doc_spaces')
        .select('*')
        .order('is_personal', { ascending: false })
        .order('name', { ascending: true });

      if (error) throw error;
      return data;
    },
  });

  // Filter spaces based on toggle
  const filteredSpaces = spaces?.filter(space => {
    if (!showPersonalSpaces && space.is_personal) return false;
    return true;
  });

  const { data: pages } = useQuery({
    queryKey: ['doc-pages'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('doc_pages')
        .select('*')
        .order('title');

      if (error) throw error;
      return data as PageNode[];
    },
  });

  const buildPageTree = (spaceId: string): PageNode[] => {
    if (!pages) return [];

    const spacePages = pages.filter(p => p.space_id === spaceId);
    const pageMap = new Map<string, PageNode>();
    const rootPages: PageNode[] = [];

    spacePages.forEach(page => {
      pageMap.set(page.id, { ...page, children: [] });
    });

    spacePages.forEach(page => {
      const node = pageMap.get(page.id)!;
      if (page.parent_page_id) {
        const parent = pageMap.get(page.parent_page_id);
        if (parent) {
          parent.children!.push(node);
        }
      } else {
        rootPages.push(node);
      }
    });

    return rootPages;
  };

  const toggleSpace = (spaceId: string) => {
    setExpandedSpaces(prev => {
      const next = new Set(prev);
      if (next.has(spaceId)) {
        next.delete(spaceId);
      } else {
        next.add(spaceId);
      }
      return next;
    });
  };

  const togglePage = (pageId: string) => {
    setExpandedPages(prev => {
      const next = new Set(prev);
      if (next.has(pageId)) {
        next.delete(pageId);
      } else {
        next.add(pageId);
      }
      return next;
    });
  };

  const renderPage = (page: PageNode, level: number = 0) => {
    const isExpanded = expandedPages.has(page.id);
    const hasChildren = page.children && page.children.length > 0;
    const isSelected = selectedPageId === page.id;

    return (
      <div key={page.id}>
        <Button
          variant="ghost"
          className={cn(
            'w-full justify-start text-left font-normal',
            isSelected && 'bg-accent'
          )}
          style={{ paddingLeft: `${level * 1 + 1.5}rem` }}
          onClick={() => onSelectPage(page.id)}
        >
          {hasChildren && (
            <Button
              variant="ghost"
              size="sm"
              className="h-4 w-4 p-0 mr-1"
              onClick={(e) => {
                e.stopPropagation();
                togglePage(page.id);
              }}
            >
              {isExpanded ? (
                <ChevronDown className="h-3 w-3" />
              ) : (
                <ChevronRight className="h-3 w-3" />
              )}
            </Button>
          )}
          <FileText className="h-4 w-4 mr-2" />
          <span className="truncate">{page.title}</span>
        </Button>
        {isExpanded && hasChildren && (
          <div>
            {page.children!.map(child => renderPage(child, level + 1))}
          </div>
        )}
      </div>
    );
  };

  const getSpaceIcon = (space: any, isExpanded: boolean) => {
    if (space.is_personal) return Lock;
    if (space.project_id) return Package;
    return isExpanded ? FolderOpen : Folder;
  };

  return (
    <>
      <div className="p-2 border-b flex items-center justify-between">
        <span className="text-sm font-medium text-muted-foreground">Spaces</span>
        <Toggle
          pressed={showPersonalSpaces}
          onPressedChange={setShowPersonalSpaces}
          size="sm"
          aria-label="Toggle personal spaces"
          title={showPersonalSpaces ? "Hide personal spaces" : "Show personal spaces"}
        >
          <Lock className="h-3 w-3" />
        </Toggle>
      </div>
      <ScrollArea className="flex-1">
        <div className="p-2 space-y-1">
          {filteredSpaces?.map(space => {
            const isExpanded = expandedSpaces.has(space.id);
            const pageTree = buildPageTree(space.id);
            const SpaceIcon = getSpaceIcon(space, isExpanded);

            return (
              <div key={space.id}>
                <div className="flex items-center group">
                  <Button
                    variant="ghost"
                    className="flex-1 justify-start text-left font-normal"
                    onClick={() => {
                      onSelectSpace(space.id);
                      toggleSpace(space.id);
                    }}
                  >
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-4 w-4 p-0 mr-1"
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleSpace(space.id);
                      }}
                    >
                      {isExpanded ? (
                        <ChevronDown className="h-3 w-3" />
                      ) : (
                        <ChevronRight className="h-3 w-3" />
                      )}
                    </Button>
                    <SpaceIcon className="h-4 w-4 mr-2" />
                    <span className="truncate font-medium">
                      {space.icon && <span className="mr-1">{space.icon}</span>}
                      {space.name}
                    </span>
                  </Button>
                  <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-7 w-7 p-0"
                      onClick={() => {
                        setCreatePageSpaceId(space.id);
                        setShowCreatePage(true);
                      }}
                      title="Add page"
                    >
                      <Plus className="h-3 w-3" />
                    </Button>
                    {!space.is_personal && (
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-7 w-7 p-0"
                        onClick={() => {
                          setPermissionsSpaceId(space.id);
                          setPermissionsSpaceName(space.name);
                          setShowPermissions(true);
                        }}
                        title="Space settings"
                      >
                        <Settings className="h-3 w-3" />
                      </Button>
                    )}
                  </div>
                </div>
                {isExpanded && (
                  <div className="ml-2">
                    {pageTree.length > 0 ? (
                      pageTree.map(page => renderPage(page))
                    ) : (
                      <p className="text-xs text-muted-foreground py-2 px-4">
                        No pages yet
                      </p>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </ScrollArea>

      <CreatePageDialog
        open={showCreatePage}
        onOpenChange={setShowCreatePage}
        spaceId={createPageSpaceId}
        parentPageId={null}
      />

      {permissionsSpaceId && (
        <SpacePermissionsDialog
          open={showPermissions}
          onOpenChange={setShowPermissions}
          spaceId={permissionsSpaceId}
          spaceName={permissionsSpaceName}
        />
      )}
    </>
  );
};
