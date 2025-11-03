import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { ChevronRight, ChevronDown, FileText, FolderOpen, Folder, Plus } from 'lucide-react';
import { cn } from '@/lib/utils';
import { CreatePageDialog } from './CreatePageDialog';

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

  const { data: spaces } = useQuery({
    queryKey: ['doc-spaces'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('doc_spaces')
        .select('*')
        .order('name');

      if (error) throw error;
      return data;
    },
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

  return (
    <>
      <ScrollArea className="flex-1">
        <div className="p-2 space-y-1">
          {spaces?.map(space => {
            const isExpanded = expandedSpaces.has(space.id);
            const pageTree = buildPageTree(space.id);
            const FolderIcon = isExpanded ? FolderOpen : Folder;

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
                    <FolderIcon className="h-4 w-4 mr-2" />
                    <span className="truncate font-medium">{space.name}</span>
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-7 w-7 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                    onClick={() => {
                      setCreatePageSpaceId(space.id);
                      setShowCreatePage(true);
                    }}
                  >
                    <Plus className="h-3 w-3" />
                  </Button>
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
    </>
  );
};
