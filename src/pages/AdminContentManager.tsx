import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Navigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { Plus, Edit, Trash2, Eye, FileText, Users, FolderTree, Sparkles, Shield } from 'lucide-react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { format } from 'date-fns';
import { useIsSuperAdmin } from '@/hooks/useAuth';

export default function AdminContentManager() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { data: isSuperAdmin, isLoading: isCheckingRole } = useIsSuperAdmin();
  const [selectedArticle, setSelectedArticle] = useState<any>(null);
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [isGeneratorOpen, setIsGeneratorOpen] = useState(false);
  const [selectedAuthor, setSelectedAuthor] = useState<any>(null);
  const [isAuthorEditorOpen, setIsAuthorEditorOpen] = useState(false);

  // Fetch articles
  const { data: articles } = useQuery({
    queryKey: ['admin-articles'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('public_articles')
        .select(`
          *,
          author:article_authors(name),
          category:article_categories(name)
        `)
        .order('created_at', { ascending: false });
      if (error) throw error;
      return data;
    },
  });

  // Fetch categories
  const { data: categories } = useQuery({
    queryKey: ['admin-categories'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('article_categories')
        .select('*')
        .order('display_order');
      if (error) throw error;
      return data;
    },
  });

  // Fetch authors
  const { data: authors } = useQuery({
    queryKey: ['admin-authors'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('article_authors')
        .select('*')
        .order('name');
      if (error) throw error;
      return data;
    },
  });

  // Delete article mutation
  const deleteArticle = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('public_articles')
        .delete()
        .eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-articles'] });
      toast({
        title: 'Article deleted',
        description: 'The article has been successfully deleted.',
      });
    },
  });

  // Delete author mutation
  const deleteAuthor = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('article_authors')
        .delete()
        .eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-authors'] });
      toast({
        title: 'Author deleted',
        description: 'The author has been successfully deleted.',
      });
    },
  });

  // Toggle publish mutation
  const togglePublish = useMutation({
    mutationFn: async ({ id, isPublished }: { id: string; isPublished: boolean }) => {
      const { error } = await supabase
        .from('public_articles')
        .update({ 
          is_published: !isPublished,
          published_at: !isPublished ? new Date().toISOString() : null
        })
        .eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-articles'] });
      toast({
        title: 'Status updated',
        description: 'The article publish status has been updated.',
      });
    },
  });

  // Generate articles from knowledge base
  const generateArticles = useMutation({
    mutationFn: async ({ topic, categorySlug, count }: { topic: string; categorySlug: string; count: number }) => {
      const author = authors?.[0];
      if (!author) throw new Error('No authors found');

      const { data, error } = await supabase.functions.invoke('generate-articles-from-kb', {
        body: { topic, categorySlug, authorId: author.id, count }
      });
      
      if (error) throw error;
      return data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['admin-articles'] });
      toast({
        title: 'Articles generated',
        description: `Successfully generated ${data.count} article(s) from knowledge base.`,
      });
      setIsGeneratorOpen(false);
    },
    onError: (error: any) => {
      toast({
        variant: 'destructive',
        title: 'Generation failed',
        description: error.message || 'Failed to generate articles',
      });
    },
  });

  // Check super admin access
  if (isCheckingRole) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center space-y-4">
          <Shield className="w-12 h-12 mx-auto text-primary animate-pulse" />
          <p className="text-muted-foreground">Verifying access permissions...</p>
        </div>
      </div>
    );
  }

  if (!isSuperAdmin) {
    return <Navigate to="/overview" replace />;
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Shield className="w-8 h-8 text-primary" />
          <div>
            <h1 className="text-3xl font-bold text-primary">Content Manager</h1>
            <p className="text-muted-foreground">Manage articles, categories, and authors • Super Admin Only</p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => setIsGeneratorOpen(true)}>
            <Sparkles className="w-4 h-4 mr-2" />
            Generate from KB
          </Button>
          <Button onClick={() => { setSelectedArticle(null); setIsEditorOpen(true); }}>
            <Plus className="w-4 h-4 mr-2" />
            New Article
          </Button>
        </div>
      </div>

      <Tabs defaultValue="articles" className="space-y-4">
        <TabsList>
          <TabsTrigger value="articles">
            <FileText className="w-4 h-4 mr-2" />
            Articles
          </TabsTrigger>
          <TabsTrigger value="categories">
            <FolderTree className="w-4 h-4 mr-2" />
            Categories
          </TabsTrigger>
          <TabsTrigger value="authors">
            <Users className="w-4 h-4 mr-2" />
            Authors
          </TabsTrigger>
        </TabsList>

        <TabsContent value="articles">
          <Card>
            <CardHeader>
              <CardTitle>All Articles</CardTitle>
              <CardDescription>Manage your published and draft content</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Title</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Author</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Views</TableHead>
                    <TableHead>Updated</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {articles?.map((article) => (
                    <TableRow key={article.id}>
                      <TableCell className="font-medium">{article.title}</TableCell>
                      <TableCell>{article.category?.name || '-'}</TableCell>
                      <TableCell>{article.author?.name || '-'}</TableCell>
                      <TableCell>
                        <Badge variant={article.is_published ? 'default' : 'secondary'}>
                          {article.is_published ? 'Published' : 'Draft'}
                        </Badge>
                      </TableCell>
                      <TableCell>{article.view_count || 0}</TableCell>
                      <TableCell>{format(new Date(article.updated_at), 'MMM d, yyyy')}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          {article.is_published && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => {
                                const category = Array.isArray(article.category) ? article.category[0] : article.category;
                                const categorySlug = (category as any)?.slug || 'general';
                                window.open(`/guides/${categorySlug}/${article.slug}`, '_blank');
                              }}
                            >
                              <Eye className="w-4 h-4" />
                            </Button>
                          )}
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => { setSelectedArticle(article); setIsEditorOpen(true); }}
                          >
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => togglePublish.mutate({ id: article.id, isPublished: article.is_published })}
                          >
                            {article.is_published ? 'Unpublish' : 'Publish'}
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                              if (confirm('Are you sure you want to delete this article?')) {
                                deleteArticle.mutate(article.id);
                              }
                            }}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="categories">
          <Card>
            <CardHeader>
              <CardTitle>Categories</CardTitle>
              <CardDescription>Organize your content by topic</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {categories?.map((category) => (
                  <div key={category.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <h3 className="font-semibold">{category.name}</h3>
                      <p className="text-sm text-muted-foreground">{category.description}</p>
                      <Badge variant="outline" className="mt-2">{category.slug}</Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="authors">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Authors</CardTitle>
                <CardDescription>Manage content contributors</CardDescription>
              </div>
              <Button onClick={() => { setSelectedAuthor(null); setIsAuthorEditorOpen(true); }}>
                <Plus className="w-4 h-4 mr-2" />
                New Author
              </Button>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {authors?.map((author) => (
                  <div key={author.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-4">
                      {author.photo_url && (
                        <img src={author.photo_url} alt={author.name} className="w-12 h-12 rounded-full" />
                      )}
                      <div className="flex-1">
                        <h3 className="font-semibold">{author.name}</h3>
                        {author.credentials && (
                          <p className="text-sm text-muted-foreground">{author.credentials}</p>
                        )}
                        {author.bio && (
                          <p className="text-sm text-muted-foreground mt-1 line-clamp-2">{author.bio}</p>
                        )}
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => { setSelectedAuthor(author); setIsAuthorEditorOpen(true); }}
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          if (confirm('Are you sure you want to delete this author?')) {
                            deleteAuthor.mutate(author.id);
                          }
                        }}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <ArticleEditorDialog
        article={selectedArticle}
        isOpen={isEditorOpen}
        onClose={() => { setIsEditorOpen(false); setSelectedArticle(null); }}
        categories={categories || []}
        authors={authors || []}
      />

      <ArticleGeneratorDialog
        isOpen={isGeneratorOpen}
        onClose={() => setIsGeneratorOpen(false)}
        onGenerate={generateArticles.mutate}
        categories={categories || []}
        isLoading={generateArticles.isPending}
      />

      <AuthorEditorDialog
        author={selectedAuthor}
        isOpen={isAuthorEditorOpen}
        onClose={() => { setIsAuthorEditorOpen(false); setSelectedAuthor(null); }}
      />
    </div>
  );
}

interface ArticleEditorDialogProps {
  article: any;
  isOpen: boolean;
  onClose: () => void;
  categories: any[];
  authors: any[];
}

function ArticleEditorDialog({ article, isOpen, onClose, categories, authors }: ArticleEditorDialogProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [formData, setFormData] = useState({
    title: article?.title || '',
    slug: article?.slug || '',
    description: article?.description || '',
    excerpt: article?.excerpt || '',
    content: article?.content || '',
    category_id: article?.category_id || '',
    author_id: article?.author_id || '',
    meta_title: article?.meta_title || '',
    meta_description: article?.meta_description || '',
    keywords: article?.keywords?.join(', ') || '',
    is_published: article?.is_published || false,
  });

  const saveArticle = useMutation({
    mutationFn: async (data: any) => {
      const payload = {
        ...data,
        keywords: data.keywords.split(',').map((k: string) => k.trim()).filter(Boolean),
        slug: data.slug || data.title.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
        reading_time_minutes: Math.ceil(data.content.split(' ').length / 200),
      };

      if (article?.id) {
        const { error } = await supabase
          .from('public_articles')
          .update(payload)
          .eq('id', article.id);
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('public_articles')
          .insert(payload);
        if (error) throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-articles'] });
      toast({
        title: article?.id ? 'Article updated' : 'Article created',
        description: 'Your changes have been saved successfully.',
      });
      onClose();
    },
  });

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{article ? 'Edit Article' : 'Create New Article'}</DialogTitle>
          <DialogDescription>
            {article ? 'Update your article content and settings' : 'Create a new article for your guides section'}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="title">Title *</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="Enter article title"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="slug">URL Slug *</Label>
              <Input
                id="slug"
                value={formData.slug}
                onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                placeholder="article-url-slug"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="category">Category</Label>
              <Select value={formData.category_id} onValueChange={(value) => setFormData({ ...formData, category_id: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((cat) => (
                    <SelectItem key={cat.id} value={cat.id}>{cat.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="author">Author</Label>
              <Select value={formData.author_id} onValueChange={(value) => setFormData({ ...formData, author_id: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="Select author" />
                </SelectTrigger>
                <SelectContent>
                  {authors.map((author) => (
                    <SelectItem key={author.id} value={author.id}>{author.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="excerpt">Excerpt</Label>
            <Textarea
              id="excerpt"
              value={formData.excerpt}
              onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
              placeholder="Brief summary (shown in article cards)"
              rows={2}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="content">Content (HTML) *</Label>
            <Textarea
              id="content"
              value={formData.content}
              onChange={(e) => setFormData({ ...formData, content: e.target.value })}
              placeholder="Article content in HTML format"
              rows={10}
              className="font-mono text-sm"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="meta_title">Meta Title (SEO)</Label>
              <Input
                id="meta_title"
                value={formData.meta_title}
                onChange={(e) => setFormData({ ...formData, meta_title: e.target.value })}
                placeholder="Leave blank to use title"
                maxLength={60}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="keywords">Keywords (comma-separated)</Label>
              <Input
                id="keywords"
                value={formData.keywords}
                onChange={(e) => setFormData({ ...formData, keywords: e.target.value })}
                placeholder="keyword1, keyword2, keyword3"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="meta_description">Meta Description (SEO)</Label>
            <Textarea
              id="meta_description"
              value={formData.meta_description}
              onChange={(e) => setFormData({ ...formData, meta_description: e.target.value })}
              placeholder="Leave blank to use excerpt"
              rows={2}
              maxLength={160}
            />
          </div>

          <div className="flex items-center space-x-2">
            <Switch
              id="is_published"
              checked={formData.is_published}
              onCheckedChange={(checked) => setFormData({ ...formData, is_published: checked })}
            />
            <Label htmlFor="is_published">Publish immediately</Label>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button onClick={() => saveArticle.mutate(formData)} disabled={!formData.title || !formData.content}>
            {article ? 'Update Article' : 'Create Article'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

interface ArticleGeneratorDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onGenerate: (params: { topic: string; categorySlug: string; count: number }) => void;
  categories: any[];
  isLoading: boolean;
}

function ArticleGeneratorDialog({ isOpen, onClose, onGenerate, categories, isLoading }: ArticleGeneratorDialogProps) {
  const [topic, setTopic] = useState('');
  const [categorySlug, setCategorySlug] = useState('');
  const [count, setCount] = useState(1);

  const handleGenerate = () => {
    if (!topic || !categorySlug) return;
    onGenerate({ topic, categorySlug, count });
    // Reset form
    setTopic('');
    setCategorySlug('');
    setCount(1);
  };

  const handleClose = () => {
    // Reset form on close
    setTopic('');
    setCategorySlug('');
    setCount(1);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            <Sparkles className="w-5 h-5 inline mr-2" />
            Generate Articles from Knowledge Base
          </DialogTitle>
          <DialogDescription>
            AI will synthesize your knowledge base content into SEO-optimized guide articles
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="topic">Topic *</Label>
            <Input
              id="topic"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              placeholder="e.g., IEP planning, autism communication strategies"
            />
            <p className="text-xs text-muted-foreground">
              The AI will search the knowledge base for relevant content on this topic
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="category">Category *</Label>
            <Select value={categorySlug} onValueChange={setCategorySlug}>
              <SelectTrigger>
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((cat) => (
                  <SelectItem key={cat.id} value={cat.slug}>{cat.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="count">Number of Articles</Label>
            <Input
              id="count"
              type="number"
              min={1}
              max={5}
              value={count}
              onChange={(e) => setCount(parseInt(e.target.value) || 1)}
            />
            <p className="text-xs text-muted-foreground">
              Generate 1-5 articles with different angles on the same topic
            </p>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={handleClose} disabled={isLoading}>
            Cancel
          </Button>
          <Button onClick={handleGenerate} disabled={!topic || !categorySlug || isLoading}>
            {isLoading ? 'Generating...' : 'Generate Articles'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// Author Editor Dialog Component
function AuthorEditorDialog({ author, isOpen, onClose }: { 
  author: any; 
  isOpen: boolean; 
  onClose: () => void; 
}) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [name, setName] = useState('');
  const [slug, setSlug] = useState('');
  const [credentials, setCredentials] = useState('');
  const [bio, setBio] = useState('');
  const [photoUrl, setPhotoUrl] = useState('');
  const [linkedinUrl, setLinkedinUrl] = useState('');

  // Initialize form when author changes
  useState(() => {
    if (author) {
      setName(author.name || '');
      setSlug(author.slug || '');
      setCredentials(author.credentials || '');
      setBio(author.bio || '');
      setPhotoUrl(author.photo_url || '');
      setLinkedinUrl(author.linkedin_url || '');
    } else {
      setName('');
      setSlug('');
      setCredentials('');
      setBio('');
      setPhotoUrl('');
      setLinkedinUrl('');
    }
  });

  // Auto-generate slug from name
  const handleNameChange = (value: string) => {
    setName(value);
    if (!author) {
      const generatedSlug = value
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '');
      setSlug(generatedSlug);
    }
  };

  const saveAuthor = useMutation({
    mutationFn: async () => {
      // Basic validation
      if (!name.trim() || !slug.trim()) {
        throw new Error('Name and slug are required');
      }

      if (name.length > 100) {
        throw new Error('Name must be less than 100 characters');
      }

      if (bio.length > 1000) {
        throw new Error('Bio must be less than 1000 characters');
      }

      const authorData = {
        name: name.trim(),
        slug: slug.trim(),
        credentials: credentials.trim() || null,
        bio: bio.trim() || null,
        photo_url: photoUrl.trim() || null,
        linkedin_url: linkedinUrl.trim() || null,
      };

      if (author) {
        // Update existing author
        const { error } = await supabase
          .from('article_authors')
          .update(authorData)
          .eq('id', author.id);
        if (error) throw error;
      } else {
        // Create new author
        const { error } = await supabase
          .from('article_authors')
          .insert(authorData);
        if (error) throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-authors'] });
      toast({
        title: author ? 'Author updated' : 'Author created',
        description: `The author has been successfully ${author ? 'updated' : 'created'}.`,
      });
      onClose();
    },
    onError: (error: Error) => {
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive',
      });
    },
  });

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{author ? 'Edit Author' : 'New Author'}</DialogTitle>
          <DialogDescription>
            {author ? 'Update author information' : 'Create a new content contributor'}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Name *</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => handleNameChange(e.target.value)}
              placeholder="Dr. Sarah Mitchell"
              maxLength={100}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="slug">Slug *</Label>
            <Input
              id="slug"
              value={slug}
              onChange={(e) => setSlug(e.target.value)}
              placeholder="dr-sarah-mitchell"
              maxLength={100}
            />
            <p className="text-xs text-muted-foreground">
              URL-friendly version of the name (auto-generated)
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="credentials">Credentials</Label>
            <Input
              id="credentials"
              value={credentials}
              onChange={(e) => setCredentials(e.target.value)}
              placeholder="PhD in Special Education, BCBA"
              maxLength={200}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="bio">Bio</Label>
            <Textarea
              id="bio"
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              placeholder="Brief professional biography..."
              rows={4}
              maxLength={1000}
            />
            <p className="text-xs text-muted-foreground">
              {bio.length}/1000 characters
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="photoUrl">Photo URL</Label>
            <Input
              id="photoUrl"
              value={photoUrl}
              onChange={(e) => setPhotoUrl(e.target.value)}
              placeholder="https://example.com/photo.jpg"
              type="url"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="linkedinUrl">LinkedIn URL</Label>
            <Input
              id="linkedinUrl"
              value={linkedinUrl}
              onChange={(e) => setLinkedinUrl(e.target.value)}
              placeholder="https://linkedin.com/in/username"
              type="url"
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose} disabled={saveAuthor.isPending}>
            Cancel
          </Button>
          <Button onClick={() => saveAuthor.mutate()} disabled={saveAuthor.isPending || !name || !slug}>
            {saveAuthor.isPending ? 'Saving...' : author ? 'Update Author' : 'Create Author'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
