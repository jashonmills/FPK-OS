import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Badge } from '@/components/ui/badge';
import { useCollectionItems } from '@/hooks/useCollectionItems';
import { FolderOpen, ChevronDown, Plus, Eye } from 'lucide-react';

interface CollectionsDropdownProps {
  orgId: string;
}

export function CollectionsDropdown({ orgId }: CollectionsDropdownProps) {
  const navigate = useNavigate();
  const { data: collections, isLoading } = useCollectionItems(orgId);

  const handleViewAllCollections = () => {
    navigate(`/org/${orgId}/collections`);
  };

  const handleViewCollection = (collectionId: string) => {
    // For now, navigate to collections page - could be expanded to show filtered view
    navigate(`/org/${orgId}/collections`);
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button 
          variant="outline" 
          className="bg-white/10 text-white border-white/30 hover:bg-white/20"
        >
          <FolderOpen className="w-4 h-4 mr-2" />
          Collections
          <ChevronDown className="w-4 h-4 ml-2" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent 
        align="end" 
        className="w-64 bg-popover border border-border"
      >
        <DropdownMenuLabel className="font-semibold">
          Course Collections
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        
        {isLoading ? (
          <div className="px-2 py-4 text-center text-sm text-muted-foreground">
            Loading collections...
          </div>
        ) : collections && collections.length > 0 ? (
          <>
            <div className="max-h-48 overflow-y-auto">
              {collections.slice(0, 8).map((collection) => (
                <DropdownMenuItem
                  key={collection.id}
                  onClick={() => handleViewCollection(collection.id)}
                  className="cursor-pointer"
                >
                  <div className="flex items-center justify-between w-full">
                    <span className="truncate flex-1 mr-2">{collection.name}</span>
                    <Badge variant="secondary" className="text-xs">
                      {collection.course_count}
                    </Badge>
                  </div>
                </DropdownMenuItem>
              ))}
              {collections.length > 8 && (
                <div className="px-2 py-1 text-xs text-muted-foreground text-center border-t">
                  +{collections.length - 8} more collections
                </div>
              )}
            </div>
            <DropdownMenuSeparator />
          </>
        ) : (
          <div className="px-2 py-4 text-center text-sm text-muted-foreground">
            No collections yet
          </div>
        )}
        
        <DropdownMenuItem onClick={handleViewAllCollections}>
          <Eye className="w-4 h-4 mr-2" />
          View All Collections
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}