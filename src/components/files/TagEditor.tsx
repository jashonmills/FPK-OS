import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { X, Plus } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface TagEditorProps {
  fileId: string;
}

export const TagEditor = ({ fileId }: TagEditorProps) => {
  const [newTag, setNewTag] = useState('');
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: fileTags } = useQuery({
    queryKey: ['file-tags', fileId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('file_tag_assignments')
        .select('tag:file_tags(*)')
        .eq('file_id', fileId);

      if (error) throw error;
      return data.map(d => (d.tag as any));
    },
  });

  const addTagMutation = useMutation({
    mutationFn: async (tagName: string) => {
      // First, get or create the tag
      const { data: existingTag } = await supabase
        .from('file_tags')
        .select('id')
        .eq('name', tagName)
        .single();

      let tagId: string;

      if (existingTag) {
        tagId = existingTag.id;
      } else {
        const { data: newTagData, error: createError } = await supabase
          .from('file_tags')
          .insert({ name: tagName })
          .select('id')
          .single();

        if (createError) throw createError;
        tagId = newTagData.id;
      }

      // Then create the assignment
      const { error: assignError } = await supabase
        .from('file_tag_assignments')
        .insert({
          file_id: fileId,
          tag_id: tagId,
        });

      if (assignError) throw assignError;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['file-tags', fileId] });
      queryClient.invalidateQueries({ queryKey: ['file-tags'] });
      setNewTag('');
      toast({
        title: 'Tag added',
        description: 'Tag has been added to the file',
      });
    },
    onError: (error: Error) => {
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive',
      });
    },
  });

  const removeTagMutation = useMutation({
    mutationFn: async (tagId: string) => {
      const { error } = await supabase
        .from('file_tag_assignments')
        .delete()
        .eq('file_id', fileId)
        .eq('tag_id', tagId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['file-tags', fileId] });
      toast({
        title: 'Tag removed',
        description: 'Tag has been removed from the file',
      });
    },
  });

  const handleAddTag = (e: React.FormEvent) => {
    e.preventDefault();
    if (newTag.trim()) {
      addTagMutation.mutate(newTag.trim());
    }
  };

  return (
    <div>
      <h3 className="font-semibold mb-3">Tags</h3>

      <div className="flex flex-wrap gap-2 mb-3">
        {fileTags && fileTags.length > 0 ? (
          fileTags.map((tag: any) => (
            <Badge key={tag.id} variant="secondary" className="gap-1">
              {tag.name}
              <button
                onClick={() => removeTagMutation.mutate(tag.id)}
                className="hover:text-destructive"
              >
                <X className="h-3 w-3" />
              </button>
            </Badge>
          ))
        ) : (
          <p className="text-sm text-muted-foreground">No tags</p>
        )}
      </div>

      <form onSubmit={handleAddTag} className="flex gap-2">
        <Input
          value={newTag}
          onChange={(e) => setNewTag(e.target.value)}
          placeholder="Add a tag..."
          className="flex-1"
        />
        <Button type="submit" size="icon" disabled={!newTag.trim()}>
          <Plus className="h-4 w-4" />
        </Button>
      </form>
    </div>
  );
};
