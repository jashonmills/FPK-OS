import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useIsMobile } from '@/hooks/use-mobile';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Badge } from '@/components/ui/badge';
import { Tag, ArrowLeft, Plus, Edit, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';
import { TransparentTile } from '@/components/ui/transparent-tile';
import { slugify } from '@/lib/slug';

interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string;
  is_active: boolean;
  display_order: number;
}

export default function CategoryManager() {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const [editCategory, setEditCategory] = useState<Category | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  
  // Form state
  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    description: '',
    display_order: 0,
    is_active: true
  });
  const [slugManuallyEdited, setSlugManuallyEdited] = useState(false);

  // Load form data when editing
  useEffect(() => {
    if (editCategory) {
      setFormData({
        name: editCategory.name || '',
        slug: editCategory.slug || '',
        description: editCategory.description || '',
        display_order: editCategory.display_order || 0,
        is_active: editCategory.is_active ?? true
      });
      setSlugManuallyEdited(!!editCategory.slug);
    } else if (!isDialogOpen) {
      // Reset form when dialog closes
      setFormData({
        name: '',
        slug: '',
        description: '',
        display_order: 0,
        is_active: true
      });
      setSlugManuallyEdited(false);
    }
  }, [editCategory, isDialogOpen]);

  // Auto-generate slug from name for new categories
  useEffect(() => {
    if (!editCategory && formData.name && !slugManuallyEdited) {
      const autoSlug = slugify(formData.name);
      setFormData(prev => ({ ...prev, slug: autoSlug }));
    }
  }, [formData.name, editCategory, slugManuallyEdited]);

  const { data: categories, isLoading } = useQuery({
    queryKey: ['blog-categories'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('blog_categories')
        .select('*')
        .order('display_order');
      if (error) throw error;
      return data as Category[];
    },
  });

  const saveMutation = useMutation({
    mutationFn: async (category: Partial<Category>) => {
      if (category.id) {
        const { error } = await supabase
          .from('blog_categories')
          .update(category)
          .eq('id', category.id);
        if (error) throw error;
      } else {
        const { name, slug, description, is_active, display_order } = category;
        const { error } = await supabase
          .from('blog_categories')
          .insert([{ name: name!, slug: slug!, description, is_active, display_order }]);
        if (error) throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['blog-categories'] });
      toast.success('Category saved successfully');
      setIsDialogOpen(false);
      setEditCategory(null);
    },
    onError: () => {
      toast.error('Failed to save category');
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('blog_categories')
        .delete()
        .eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['blog-categories'] });
      toast.success('Category deleted');
      setDeleteId(null);
    },
    onError: () => {
      toast.error('Failed to delete category');
    },
  });

  const handleSave = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    saveMutation.mutate({
      id: editCategory?.id,
      name: formData.name,
      slug: formData.slug || slugify(formData.name),
      description: formData.description,
      is_active: formData.is_active,
      display_order: formData.display_order,
    });
  };

  return (
    <div className="space-y-6">
      <TransparentTile className="mobile-card-padding">
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div>
            <h2 className="mobile-heading-md flex items-center gap-2">
              <Tag className="h-5 w-5 sm:h-6 sm:w-6 shrink-0" />
              Categories
            </h2>
            <p className="text-muted-foreground mt-1 text-xs sm:text-sm">Organize your blog content</p>
          </div>
          <Button onClick={() => { setEditCategory(null); setIsDialogOpen(true); }} className="w-full sm:w-auto min-h-[44px]">
            <Plus className="h-4 w-4 mr-2" />
            New Category
          </Button>
        </div>
      </TransparentTile>

      {/* Mobile Card View / Desktop Table */}
      {isMobile ? (
        /* Mobile Card Grid */
        <div className="space-y-3">
          {isLoading ? (
            <div className="text-center py-6">Loading...</div>
          ) : categories?.length === 0 ? (
            <div className="text-center text-muted-foreground py-12 text-sm">
              No categories yet. Create your first one!
            </div>
          ) : (
            categories?.map((cat) => (
              <div key={cat.id} className="bg-card border rounded-lg p-4 space-y-3">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1 min-w-0 space-y-1">
                    <h3 className="font-semibold text-base">{cat.name}</h3>
                    <code className="text-xs text-muted-foreground">{cat.slug}</code>
                    {cat.description && (
                      <p className="text-sm text-muted-foreground line-clamp-2">{cat.description}</p>
                    )}
                  </div>
                  <Badge variant={cat.is_active ? 'default' : 'secondary'} className="shrink-0">
                    {cat.is_active ? 'Active' : 'Inactive'}
                  </Badge>
                </div>
                <div className="flex items-center justify-between pt-2 border-t">
                  <span className="text-xs text-muted-foreground">Order: {cat.display_order}</span>
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      className="min-h-[40px]"
                      onClick={() => { setEditCategory(cat); setIsDialogOpen(true); }}
                    >
                      <Edit className="h-4 w-4 mr-2" />
                      Edit
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      className="min-h-[40px]"
                      onClick={() => setDeleteId(cat.id)}
                    >
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      ) : (
        /* Desktop Table */
        <div className="border rounded-lg bg-card">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Slug</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Order</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center">Loading...</TableCell>
                </TableRow>
              ) : categories?.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center text-muted-foreground">
                    No categories yet. Create your first one!
                  </TableCell>
                </TableRow>
              ) : (
                categories?.map((cat) => (
                  <TableRow key={cat.id}>
                    <TableCell className="font-medium">{cat.name}</TableCell>
                    <TableCell><code className="text-xs">{cat.slug}</code></TableCell>
                    <TableCell>{cat.description || '—'}</TableCell>
                    <TableCell>{cat.display_order}</TableCell>
                    <TableCell>
                      <Badge variant={cat.is_active ? 'default' : 'secondary'}>
                        {cat.is_active ? 'Active' : 'Inactive'}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => { setEditCategory(cat); setIsDialogOpen(true); }}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => setDeleteId(cat.id)}
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
      )}

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editCategory ? 'Edit' : 'New'} Category</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSave} className="space-y-4">
            <div>
              <label className="text-sm font-medium">Name *</label>
              <Input 
                name="name" 
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                required 
              />
            </div>
            <div>
              <label className="text-sm font-medium">Slug *</label>
              <Input 
                name="slug" 
                value={formData.slug}
                onChange={(e) => {
                  setFormData(prev => ({ ...prev, slug: e.target.value }));
                  setSlugManuallyEdited(true);
                }}
                placeholder="Auto-generated from name"
                required 
              />
              <p className="text-sm text-muted-foreground mt-1">
                Auto-generated from name. Edit manually to customize.
              </p>
            </div>
            <div>
              <label className="text-sm font-medium">Description</label>
              <Textarea 
                name="description" 
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              />
            </div>
            <div>
              <label className="text-sm font-medium">Display Order</label>
              <Input 
                type="number" 
                name="display_order" 
                value={formData.display_order}
                onChange={(e) => setFormData(prev => ({ ...prev, display_order: parseInt(e.target.value) || 0 }))}
              />
            </div>
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                name="is_active"
                id="is_active"
                checked={formData.is_active}
                onChange={(e) => setFormData(prev => ({ ...prev, is_active: e.target.checked }))}
              />
              <label htmlFor="is_active" className="text-sm">Active</label>
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                Cancel
              </Button>
              <Button type="submit">Save</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Category</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure? This will remove the category from all posts.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={() => deleteId && deleteMutation.mutate(deleteId)}>
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
