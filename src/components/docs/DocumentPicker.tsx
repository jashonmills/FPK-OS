import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { FileText, Search, ChevronRight } from 'lucide-react';

interface DocumentPickerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSelect: (pageId: string, pageTitle: string) => void;
}

export const DocumentPicker = ({ open, onOpenChange, onSelect }: DocumentPickerProps) => {
  const [searchQuery, setSearchQuery] = useState('');

  const { data: pages, isLoading } = useQuery({
    queryKey: ['document-picker', searchQuery],
    queryFn: async () => {
      let query = supabase
        .from('doc_pages')
        .select('id, title, space:doc_spaces(name)')
        .order('updated_at', { ascending: false });

      if (searchQuery) {
        query = query.ilike('title', `%${searchQuery}%`);
      }

      const { data, error } = await query.limit(20);
      if (error) throw error;
      return data;
    },
    enabled: open,
  });

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>Link Document</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search documents..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9"
            />
          </div>

          <ScrollArea className="h-[400px]">
            {isLoading ? (
              <div className="text-center py-8 text-muted-foreground">Loading...</div>
            ) : pages && pages.length > 0 ? (
              <div className="space-y-1">
                {pages.map((page) => (
                  <Button
                    key={page.id}
                    variant="ghost"
                    className="w-full justify-start h-auto py-3 px-3"
                    onClick={() => {
                      onSelect(page.id, page.title);
                      onOpenChange(false);
                    }}
                  >
                    <FileText className="h-4 w-4 mr-3 flex-shrink-0 text-primary" />
                    <div className="flex-1 text-left overflow-hidden">
                      <p className="font-medium truncate">{page.title}</p>
                      <p className="text-xs text-muted-foreground truncate">
                        {(page.space as any)?.name || 'Unknown Space'}
                      </p>
                    </div>
                    <ChevronRight className="h-4 w-4 ml-2 text-muted-foreground" />
                  </Button>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                {searchQuery ? 'No documents found' : 'No documents available'}
              </div>
            )}
          </ScrollArea>
        </div>
      </DialogContent>
    </Dialog>
  );
};
