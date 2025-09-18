import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Plus } from 'lucide-react';
import { useOrgNotes } from '@/hooks/useOrgNotes';
import { useOrgNoteFolders } from '@/hooks/useOrgNoteFolders';

const noteSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  content: z.string().min(1, 'Content is required'),
  student_id: z.string().optional(),
  visibility_scope: z.enum(['private', 'organization', 'student']).default('private'),
  category: z.string().default('general'),
  tags: z.string().optional(),
  folder_id: z.string().optional(),
});

type NoteFormData = z.infer<typeof noteSchema>;

interface FolderOption {
  id: string;
  name: string;
  children?: FolderOption[];
}

interface FlattenedFolder {
  id: string;
  name: string;
}

interface CreateNoteDialogProps {
  children?: React.ReactNode;
  organizationId?: string;
}

export default function CreateNoteDialog({ children, organizationId }: CreateNoteDialogProps) {
  const [open, setOpen] = React.useState(false);
  const { createNote } = useOrgNotes(organizationId);
  const { folders } = useOrgNoteFolders(organizationId);

  const form = useForm<NoteFormData>({
    resolver: zodResolver(noteSchema),
    defaultValues: {
      title: '',
      content: '',
      visibility_scope: 'private',
      category: 'general',
      tags: '',
    },
  });

  const onSubmit = (data: NoteFormData) => {
    if (!data.title.trim() || !data.content.trim()) return;
    
    const noteData = {
      title: data.title,
      content: data.content,
      student_id: data.student_id || '',
      visibility_scope: data.visibility_scope,
      category: data.category,
      tags: data.tags ? data.tags.split(',').map(tag => tag.trim()) : [],
      folder_path: data.folder_id, // Using folder_id as folder_path for now
      created_by: '', // Will be set by the hook
    };
    createNote(noteData);
    form.reset();
    setOpen(false);
  };

  // Flatten folders for dropdown
  const flattenFolders = (folders: FolderOption[], prefix = ''): FlattenedFolder[] => {
    return folders.reduce((acc, folder) => {
      acc.push({ 
        id: folder.id, 
        name: prefix + folder.name 
      });
      if (folder.children && folder.children.length > 0) {
        acc.push(...flattenFolders(folder.children, prefix + folder.name + ' / '));
      }
      return acc;
    }, []);
  };

  const flatFolders = flattenFolders(folders);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {children || (
          <Button>
            <Plus className="w-4 h-4 mr-2" />
            Create Note
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[525px]">
        <DialogHeader>
          <DialogTitle>Create New Note</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Title</FormLabel>
                  <FormControl>
                    <Input placeholder="Note title..." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="content"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Content</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Note content..." 
                      rows={4}
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="category"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Category</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., lesson-plan, progress-report" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="visibility_scope"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Visibility</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select visibility" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="private">Private</SelectItem>
                        <SelectItem value="organization">Organization</SelectItem>
                        <SelectItem value="student">Shared with Students</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="folder_id"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Folder (Optional)</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a folder" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {flatFolders.map((folder) => (
                        <SelectItem key={folder.id} value={folder.id}>
                          {folder.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="tags"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tags (Optional)</FormLabel>
                  <FormControl>
                    <Input placeholder="Comma-separated tags..." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex justify-end gap-2">
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => setOpen(false)}
              >
                Cancel
              </Button>
              <Button type="submit">
                Create Note
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}