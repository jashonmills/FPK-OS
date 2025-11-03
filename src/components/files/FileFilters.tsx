import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';

interface FileFiltersProps {
  filters: {
    fileTypes: string[];
    tags: string[];
    dateRange: { start: Date; end: Date } | null;
    uploaderId: string | null;
  };
  onFiltersChange: (filters: any) => void;
}

export const FileFilters = ({ filters, onFiltersChange }: FileFiltersProps) => {
  const { data: tags } = useQuery({
    queryKey: ['file-tags'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('file_tags')
        .select('*')
        .order('name');

      if (error) throw error;
      return data;
    },
  });

  const fileTypeOptions = [
    { label: 'Images', value: 'image/' },
    { label: 'Videos', value: 'video/' },
    { label: 'Audio', value: 'audio/' },
    { label: 'PDFs', value: 'application/pdf' },
    { label: 'Documents', value: 'application/vnd' },
    { label: 'Text', value: 'text/' },
  ];

  const toggleFileType = (type: string) => {
    const newTypes = filters.fileTypes.includes(type)
      ? filters.fileTypes.filter(t => t !== type)
      : [...filters.fileTypes, type];
    onFiltersChange({ ...filters, fileTypes: newTypes });
  };

  const toggleTag = (tagId: string) => {
    const newTags = filters.tags.includes(tagId)
      ? filters.tags.filter(t => t !== tagId)
      : [...filters.tags, tagId];
    onFiltersChange({ ...filters, tags: newTags });
  };

  const clearFilters = () => {
    onFiltersChange({
      fileTypes: [],
      tags: [],
      dateRange: null,
      uploaderId: null,
    });
  };

  const hasActiveFilters =
    filters.fileTypes.length > 0 ||
    filters.tags.length > 0 ||
    filters.dateRange !== null ||
    filters.uploaderId !== null;

  return (
    <ScrollArea className="h-full">
      <div className="p-6 space-y-6">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold">Filters</h3>
          {hasActiveFilters && (
            <button
              onClick={clearFilters}
              className="text-sm text-primary hover:underline"
            >
              Clear all
            </button>
          )}
        </div>

        <div className="space-y-4">
          <div>
            <Label className="mb-3 block">File Type</Label>
            <div className="space-y-2">
              {fileTypeOptions.map(option => (
                <div key={option.value} className="flex items-center space-x-2">
                  <Checkbox
                    id={option.value}
                    checked={filters.fileTypes.some(t => t.startsWith(option.value))}
                    onCheckedChange={() => toggleFileType(option.value)}
                  />
                  <label
                    htmlFor={option.value}
                    className="text-sm cursor-pointer"
                  >
                    {option.label}
                  </label>
                </div>
              ))}
            </div>
          </div>

          <Separator />

          <div>
            <Label className="mb-3 block">Tags</Label>
            {tags && tags.length > 0 ? (
              <div className="space-y-2">
                {tags.map(tag => (
                  <div key={tag.id} className="flex items-center space-x-2">
                    <Checkbox
                      id={tag.id}
                      checked={filters.tags.includes(tag.id)}
                      onCheckedChange={() => toggleTag(tag.id)}
                    />
                    <label
                      htmlFor={tag.id}
                      className="text-sm cursor-pointer"
                    >
                      {tag.name}
                    </label>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">No tags yet</p>
            )}
          </div>
        </div>
      </div>
    </ScrollArea>
  );
};
