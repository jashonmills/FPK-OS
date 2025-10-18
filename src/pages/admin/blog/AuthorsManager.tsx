import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Plus, Pencil, Trash2, Sparkles } from 'lucide-react';
import { useBlogAuthors, useCreateBlogAuthor, useUpdateBlogAuthor, useDeleteBlogAuthor } from '@/hooks/useBlogAuthors';
import { AuthorManagementDialog } from '@/components/blog/AuthorManagementDialog';
import { toast } from '@/hooks/use-toast';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

export function AuthorsManager() {
  const { data: authors = [], isLoading } = useBlogAuthors();
  const createAuthor = useCreateBlogAuthor();
  const updateAuthor = useUpdateBlogAuthor();
  const deleteAuthor = useDeleteBlogAuthor();

  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedAuthor, setSelectedAuthor] = useState<any>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [authorToDelete, setAuthorToDelete] = useState<any>(null);

  const handleSaveAuthor = async (data: any) => {
    try {
      if (selectedAuthor) {
        await updateAuthor.mutateAsync({ id: selectedAuthor.id, ...data });
        toast({ title: 'Author updated successfully' });
      } else {
        await createAuthor.mutateAsync(data);
        toast({ title: 'Author created successfully' });
      }
    } catch (error: any) {
      toast({
        title: 'Failed to save author',
        description: error.message,
        variant: 'destructive'
      });
      throw error;
    }
  };

  const handleDeleteAuthor = async () => {
    if (!authorToDelete) return;
    try {
      await deleteAuthor.mutateAsync(authorToDelete.id);
      toast({ title: 'Author deleted successfully' });
      setDeleteDialogOpen(false);
      setAuthorToDelete(null);
    } catch (error: any) {
      toast({
        title: 'Failed to delete author',
        description: error.message,
        variant: 'destructive'
      });
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="h-32 bg-muted animate-pulse rounded-lg" />
        <div className="h-32 bg-muted animate-pulse rounded-lg" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Authors</h2>
          <p className="text-muted-foreground">Manage content contributors</p>
        </div>
        <Button
          onClick={() => {
            setSelectedAuthor(null);
            setDialogOpen(true);
          }}
        >
          <Plus className="mr-2 h-4 w-4" />
          New Author
        </Button>
      </div>

      <div className="space-y-4">
        {authors.map((author) => (
          <Card key={author.id}>
            <CardContent className="p-6">
              <div className="flex items-start justify-between">
                <div className="flex gap-4 flex-1">
                  {author.avatar_url && (
                    <img
                      src={author.avatar_url}
                      alt={author.display_name}
                      className="w-16 h-16 rounded-full object-cover"
                    />
                  )}
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <h3 className="text-lg font-semibold">{author.display_name}</h3>
                      {author.is_ai_author && (
                        <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-primary/10 text-primary text-xs font-medium">
                          <Sparkles className="h-3 w-3" />
                          AI Assistant
                        </span>
                      )}
                    </div>
                    {author.credentials && (
                      <p className="text-sm text-muted-foreground">{author.credentials}</p>
                    )}
                    {author.bio && (
                      <p className="mt-2 text-sm line-clamp-2">{author.bio}</p>
                    )}
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => {
                      setSelectedAuthor(author);
                      setDialogOpen(true);
                    }}
                  >
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => {
                      setAuthorToDelete(author);
                      setDeleteDialogOpen(true);
                    }}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}

        {authors.length === 0 && (
          <Card>
            <CardContent className="p-12 text-center">
              <p className="text-muted-foreground">No authors yet. Create your first author to get started.</p>
            </CardContent>
          </Card>
        )}
      </div>

      <AuthorManagementDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        author={selectedAuthor}
        onSave={handleSaveAuthor}
      />

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Author</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete "{authorToDelete?.display_name}"? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteAuthor} className="bg-destructive text-destructive-foreground">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
