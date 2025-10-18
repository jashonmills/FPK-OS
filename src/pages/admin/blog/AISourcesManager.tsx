import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { toast } from '@/hooks/use-toast';
import { ArrowLeft, Plus, Pencil, Trash2, Loader2, TestTube, Database } from 'lucide-react';
import { useBlogCategories } from '@/hooks/useBlogPosts';
import { TransparentTile } from '@/components/ui/transparent-tile';

export default function AISourcesManager() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [showDialog, setShowDialog] = useState(false);
  const [editingSource, setEditingSource] = useState<any>(null);
  const [testingUrl, setTestingUrl] = useState<string | null>(null);
  
  const [formData, setFormData] = useState({
    source_name: '',
    url: '',
    description: '',
    category_id: '',
    is_active: true
  });

  const { data: categories } = useBlogCategories();
  
  const { data: sources, isLoading } = useQuery({
    queryKey: ['ai_knowledge_sources'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('ai_knowledge_sources')
        .select('*, blog_categories(name)')
        .order('source_name');
      if (error) throw error;
      return data;
    }
  });

  const createMutation = useMutation({
    mutationFn: async (data: any) => {
      const { error } = await supabase
        .from('ai_knowledge_sources')
        .insert([data]);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['ai_knowledge_sources'] });
      setShowDialog(false);
      resetForm();
      toast({ title: 'Source added successfully' });
    }
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, ...data }: any) => {
      const { error } = await supabase
        .from('ai_knowledge_sources')
        .update(data)
        .eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['ai_knowledge_sources'] });
      setShowDialog(false);
      setEditingSource(null);
      resetForm();
      toast({ title: 'Source updated successfully' });
    }
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('ai_knowledge_sources')
        .delete()
        .eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['ai_knowledge_sources'] });
      toast({ title: 'Source deleted successfully' });
    }
  });

  const testScrapeMutation = useMutation({
    mutationFn: async (url: string) => {
      const { data, error } = await supabase.functions.invoke('scrape-and-cache-source', {
        body: { source_url: url }
      });
      if (error) throw error;
      return data;
    },
    onSuccess: (data) => {
      toast({
        title: 'Scrape Test Successful',
        description: `Extracted ${data.content_length} characters of content`
      });
      setTestingUrl(null);
    },
    onError: (error: Error) => {
      toast({
        title: 'Scrape Test Failed',
        description: error.message,
        variant: 'destructive'
      });
      setTestingUrl(null);
    }
  });

  const resetForm = () => {
    setFormData({
      source_name: '',
      url: '',
      description: '',
      category_id: '',
      is_active: true
    });
  };

  const handleEdit = (source: any) => {
    setEditingSource(source);
    setFormData({
      source_name: source.source_name,
      url: source.url,
      description: source.description || '',
      category_id: source.category_id || '',
      is_active: source.is_active
    });
    setShowDialog(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingSource) {
      updateMutation.mutate({ id: editingSource.id, ...formData });
    } else {
      createMutation.mutate(formData);
    }
  };

  return (
    <div className="container mx-auto px-6 pt-12 pb-6 space-y-6">
      <Button variant="outline" size="sm" onClick={() => navigate('/dashboard/admin/blog')} className="bg-background/50 backdrop-blur-sm">
        <ArrowLeft className="h-4 w-4 mr-2" />
        Back to Blog Hub
      </Button>
      
      <TransparentTile className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold flex items-center gap-2">
              <Database className="h-8 w-8" />
              AI Knowledge Base
            </h1>
            <p className="text-muted-foreground mt-1">Manage research sources for AI blog generation</p>
          </div>
          <Button onClick={() => setShowDialog(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Add Source
          </Button>
        </div>
      </TransparentTile>

      {isLoading ? (
        <div className="flex justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      ) : (
        <div className="bg-background/80 backdrop-blur-sm border rounded-lg">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Source Name</TableHead>
                <TableHead>URL</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sources?.map((source) => (
                <TableRow key={source.id}>
                  <TableCell className="font-medium">{source.source_name}</TableCell>
                  <TableCell>
                    <a href={source.url} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline truncate block max-w-[300px]">
                      {source.url}
                    </a>
                  </TableCell>
                  <TableCell>
                    {(source as any).blog_categories?.name || 'All Categories'}
                  </TableCell>
                  <TableCell>
                    <Badge variant={source.is_active ? 'default' : 'secondary'}>
                      {source.is_active ? 'Active' : 'Inactive'}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right space-x-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => {
                        setTestingUrl(source.url);
                        testScrapeMutation.mutate(source.url);
                      }}
                      disabled={testingUrl === source.url}
                    >
                      {testingUrl === source.url ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <TestTube className="h-4 w-4" />
                      )}
                    </Button>
                    <Button variant="ghost" size="icon" onClick={() => handleEdit(source)}>
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => deleteMutation.mutate(source.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}

      <Dialog open={showDialog} onOpenChange={(open) => {
        setShowDialog(open);
        if (!open) {
          setEditingSource(null);
          resetForm();
        }
      }}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editingSource ? 'Edit Source' : 'Add New Source'}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="source_name">Source Name</Label>
              <Input
                id="source_name"
                value={formData.source_name}
                onChange={(e) => setFormData({ ...formData, source_name: e.target.value })}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="url">URL</Label>
              <Input
                id="url"
                type="url"
                value={formData.url}
                onChange={(e) => setFormData({ ...formData, url: e.target.value })}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={3}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="category">Primary Category (Optional)</Label>
              <Select
                value={formData.category_id || 'none'}
                onValueChange={(value) => setFormData({ ...formData, category_id: value === 'none' ? '' : value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="All Categories" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">All Categories</SelectItem>
                  {categories?.map((cat) => (
                    <SelectItem key={cat.id} value={cat.id}>
                      {cat.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center space-x-2">
              <Switch
                id="is_active"
                checked={formData.is_active}
                onCheckedChange={(checked) => setFormData({ ...formData, is_active: checked })}
              />
              <Label htmlFor="is_active">Active</Label>
            </div>

            <div className="flex justify-end gap-2">
              <Button type="button" variant="outline" onClick={() => setShowDialog(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={createMutation.isPending || updateMutation.isPending}>
                {(createMutation.isPending || updateMutation.isPending) && (
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                )}
                {editingSource ? 'Update' : 'Create'}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
