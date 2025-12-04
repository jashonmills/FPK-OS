import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useMediaAsset, useMediaUsage, useCreateMediaAsset, useUpdateMediaAsset, useDeleteMediaAsset } from '@/hooks/useMediaAssets';
import { Loader2, ExternalLink, Trash2, Copy, Check } from 'lucide-react';
import { toast } from 'sonner';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Link } from 'react-router-dom';

interface MediaAssetDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  storagePath: string;
  publicUrl: string;
}

export function MediaAssetDialog({ open, onOpenChange, storagePath, publicUrl }: MediaAssetDialogProps) {
  const { data: asset, isLoading: assetLoading } = useMediaAsset(storagePath);
  const { data: usage = [] } = useMediaUsage(asset?.id || '');
  const createAsset = useCreateMediaAsset();
  const updateAsset = useUpdateMediaAsset();
  const deleteAsset = useDeleteMediaAsset();
  const [copied, setCopied] = useState(false);

  const [formData, setFormData] = useState({
    title: '',
    alt_text: '',
    description: '',
    asset_type: 'general',
  });

  // Fetch usage details (blog posts and authors)
  const { data: usageDetails } = useQuery({
    queryKey: ['media-usage-details', usage],
    queryFn: async () => {
      if (!usage.length) return { posts: [], authors: [] };

      const postIds = usage.filter(u => u.usage_type.includes('blog')).map(u => u.reference_id);
      const authorIds = usage.filter(u => u.usage_type === 'author_avatar').map(u => u.reference_id);

      const [postsData, authorsData] = await Promise.all([
        postIds.length ? supabase.from('blog_posts').select('id, title, slug').in('id', postIds) : { data: [] },
        authorIds.length ? supabase.from('blog_authors').select('id, display_name, author_slug').in('id', authorIds) : { data: [] },
      ]);

      return {
        posts: postsData.data || [],
        authors: authorsData.data || [],
      };
    },
    enabled: usage.length > 0,
  });

  useEffect(() => {
    if (asset) {
      setFormData({
        title: asset.title || '',
        alt_text: asset.alt_text || '',
        description: asset.description || '',
        asset_type: asset.asset_type || 'general',
      });
    } else if (open) {
      // Auto-generate title from filename
      const fileName = storagePath.split('/').pop() || '';
      const cleanTitle = fileName
        .replace(/^\d+-/, '') // Remove timestamp prefix
        .replace(/\.[^/.]+$/, '') // Remove extension
        .replace(/[-_]/g, ' ') // Replace dashes/underscores with spaces
        .replace(/\b\w/g, l => l.toUpperCase()); // Capitalize words
      
      setFormData({
        title: cleanTitle,
        alt_text: '',
        description: '',
        asset_type: 'general',
      });
    }
  }, [asset, storagePath, open]);

  const handleSave = async () => {
    try {
      if (asset) {
        await updateAsset.mutateAsync({
          id: asset.id,
          ...formData,
        });
      } else {
        await createAsset.mutateAsync({
          storage_path: storagePath,
          ...formData,
          file_size: null,
          mime_type: null,
          dimensions: null,
        });
      }
      onOpenChange(false);
    } catch (error) {
      console.error('Failed to save media asset:', error);
    }
  };

  const handleDelete = async () => {
    if (!asset) return;
    
    if (window.confirm('Are you sure you want to delete this media asset metadata? The file will remain in storage.')) {
      try {
        await deleteAsset.mutateAsync(asset.id);
        onOpenChange(false);
      } catch (error) {
        console.error('Failed to delete media asset:', error);
      }
    }
  };

  const handleCopyUrl = () => {
    navigator.clipboard.writeText(publicUrl);
    setCopied(true);
    toast.success('URL copied!');
    setTimeout(() => setCopied(false), 2000);
  };

  if (assetLoading) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-3xl">
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-8 w-8 animate-spin" />
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Media Asset Details</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Image Preview */}
          <div className="relative rounded-lg overflow-hidden bg-muted">
            <img src={publicUrl} alt={formData.title} className="w-full h-auto max-h-96 object-contain" />
          </div>

          {/* Form Fields */}
          <div className="space-y-4">
            <div>
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="Enter image title"
              />
            </div>

            <div>
              <Label htmlFor="alt_text">Alt Text (SEO)</Label>
              <Input
                id="alt_text"
                value={formData.alt_text}
                onChange={(e) => setFormData({ ...formData, alt_text: e.target.value })}
                placeholder="Describe the image for accessibility"
              />
            </div>

            <div>
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Add additional details about this image"
                rows={3}
              />
            </div>

            <div>
              <Label htmlFor="asset_type">Asset Type</Label>
              <Select value={formData.asset_type} onValueChange={(value) => setFormData({ ...formData, asset_type: value })}>
                <SelectTrigger id="asset_type">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="general">General</SelectItem>
                  <SelectItem value="blog_featured">Blog Featured Image</SelectItem>
                  <SelectItem value="author_avatar">Author Avatar</SelectItem>
                  <SelectItem value="inline_content">Inline Content</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Usage Information */}
          {usage.length > 0 && (
            <div className="border-t pt-4 space-y-3">
              <h3 className="font-semibold">Used In:</h3>
              
              {usageDetails?.posts && usageDetails.posts.length > 0 && (
                <div>
                  <p className="text-sm text-muted-foreground mb-2">Blog Posts ({usageDetails.posts.length})</p>
                  <ul className="space-y-1">
                    {usageDetails.posts.map((post: any) => (
                      <li key={post.id} className="text-sm">
                        <Link 
                          to={`/dashboard/admin/blog/edit/${post.id}`}
                          className="text-primary hover:underline flex items-center gap-2"
                        >
                          {post.title}
                          <ExternalLink className="h-3 w-3" />
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {usageDetails?.authors && usageDetails.authors.length > 0 && (
                <div>
                  <p className="text-sm text-muted-foreground mb-2">Author Avatars ({usageDetails.authors.length})</p>
                  <ul className="space-y-1">
                    {usageDetails.authors.map((author: any) => (
                      <li key={author.id} className="text-sm">
                        <span className="text-foreground">{author.display_name}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}

          {/* Technical Details */}
          <div className="border-t pt-4 space-y-2 text-sm text-muted-foreground">
            <p><strong>Storage Path:</strong> {storagePath}</p>
            {asset?.created_at && (
              <p><strong>Uploaded:</strong> {new Date(asset.created_at).toLocaleDateString()}</p>
            )}
          </div>
        </div>

        <DialogFooter className="gap-2">
          <Button variant="outline" onClick={handleCopyUrl}>
            {copied ? <Check className="h-4 w-4 mr-2" /> : <Copy className="h-4 w-4 mr-2" />}
            Copy URL
          </Button>
          {asset && (
            <Button variant="destructive" onClick={handleDelete}>
              <Trash2 className="h-4 w-4 mr-2" />
              Delete Metadata
            </Button>
          )}
          <Button onClick={handleSave} disabled={createAsset.isPending || updateAsset.isPending}>
            {(createAsset.isPending || updateAsset.isPending) && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Save
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
