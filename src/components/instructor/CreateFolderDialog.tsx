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
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { FolderPlus } from 'lucide-react';
import { useOrgNoteFolders } from '@/hooks/useOrgNoteFolders';

const folderSchema = z.object({
  name: z.string().min(1, 'Folder name is required'),
  parent_folder_id: z.string().optional(),
});

type FolderFormData = z.infer<typeof folderSchema>;

interface CreateFolderDialogProps {
  children?: React.ReactNode;
}

export default function CreateFolderDialog({ children }: CreateFolderDialogProps) {
  const [open, setOpen] = React.useState(false);
  const { createFolder, folders } = useOrgNoteFolders();

  const form = useForm<FolderFormData>({
    resolver: zodResolver(folderSchema),
    defaultValues: {
      name: '',
    },
  });

  const onSubmit = (data: FolderFormData) => {
    if (!data.name.trim()) return;
    
    createFolder({
      name: data.name,
      parent_folder_id: data.parent_folder_id,
    });
    form.reset();
    setOpen(false);
  };

  // Flatten folders for dropdown
  const flattenFolders = (folders: any[], prefix = ''): any[] => {
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
          <Button variant="outline">
            <FolderPlus className="w-4 h-4 mr-2" />
            New Folder
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Create New Folder</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Folder Name</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., Math, Science, Progress Reports" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="parent_folder_id"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Parent Folder (Optional)</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select parent folder" />
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

            <div className="flex justify-end gap-2">
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => setOpen(false)}
              >
                Cancel
              </Button>
              <Button type="submit">
                Create Folder
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}