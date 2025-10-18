import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Plus, Pencil, Trash2, Sparkles } from 'lucide-react';
import { useBlogAuthors, useCreateBlogAuthor, useUpdateBlogAuthor, useDeleteBlogAuthor } from '@/hooks/useBlogAuthors';
import { AuthorManagementDialog } from '@/components/blog/AuthorManagementDialog';
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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { TransparentTile } from '@/components/ui/transparent-tile';

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
    if (selectedAuthor) {
      await updateAuthor.mutateAsync({ id: selectedAuthor.id, ...data });
    } else {
      await createAuthor.mutateAsync(data);
    }
  };

  const handleDeleteAuthor = async () => {
    if (!authorToDelete) return;
    await deleteAuthor.mutateAsync(authorToDelete.id);
    setDeleteDialogOpen(false);
    setAuthorToDelete(null);
  };

  if (isLoading) {
    return (
      <div className="space-y-3">
        <div className="h-12 bg-muted animate-pulse rounded" />
        <div className="h-12 bg-muted animate-pulse rounded" />
        <div className="h-12 bg-muted animate-pulse rounded" />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <TransparentTile className="p-4">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold">Authors</h2>
            <p className="text-sm text-muted-foreground">Manage content contributors</p>
          </div>
          <Button onClick={() => {
            setSelectedAuthor(null);
            setDialogOpen(true);
          }}>
            <Plus className="mr-2 h-4 w-4" />
            New Author
          </Button>
        </div>
      </TransparentTile>

      <div className="border rounded-lg bg-card">
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-transparent">
              <TableHead className="font-semibold">Author</TableHead>
              <TableHead className="hidden md:table-cell font-semibold">Credentials</TableHead>
              <TableHead className="hidden lg:table-cell font-semibold">Type</TableHead>
              <TableHead className="text-right font-semibold">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {authors.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4} className="text-center py-12 text-muted-foreground">
                  No authors yet. Create your first author to get started.
                </TableCell>
              </TableRow>
            ) : (
              authors.map((author) => (
                <TableRow key={author.id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      {author.avatar_url && (
                        <img
                          src={author.avatar_url}
                          alt={author.display_name}
                          className="w-10 h-10 rounded-full object-cover"
                        />
                      )}
                      <div className="space-y-0.5">
                        <div className="font-medium">{author.display_name}</div>
                        {author.bio && (
                          <div className="text-xs text-muted-foreground line-clamp-1 md:hidden">
                            {author.bio}
                          </div>
                        )}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="hidden md:table-cell text-sm text-muted-foreground">
                    {author.credentials || '-'}
                  </TableCell>
                  <TableCell className="hidden lg:table-cell">
                    {author.is_ai_author ? (
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-primary/10 text-primary text-xs font-medium border border-primary/20">
                        <Sparkles className="h-3 w-3" />
                        AI Assistant
                      </span>
                    ) : (
                      <span className="inline-flex items-center px-2.5 py-1 rounded-full bg-muted text-muted-foreground text-xs font-medium border">
                        Human
                      </span>
                    )}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8"
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
                        className="h-8 w-8"
                        onClick={() => {
                          setAuthorToDelete(author);
                          setDeleteDialogOpen(true);
                        }}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
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
