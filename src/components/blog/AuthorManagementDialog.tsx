import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Loader2 } from 'lucide-react';
import { slugify } from '@/lib/slug';

interface AuthorManagementDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  author?: {
    id: string;
    display_name: string;
    author_slug?: string;
    bio?: string;
    credentials?: string;
    avatar_url?: string;
    is_ai_author?: boolean;
    social_links?: any;
  };
  onSave: (data: any) => Promise<void>;
}

export function AuthorManagementDialog({
  open,
  onOpenChange,
  author,
  onSave
}: AuthorManagementDialogProps) {
  const [formData, setFormData] = useState({
    display_name: '',
    author_slug: '',
    credentials: '',
    bio: '',
    avatar_url: '',
    linkedin_url: '',
    is_ai_author: false
  });
  const [isSaving, setIsSaving] = useState(false);
  const [slugManuallyEdited, setSlugManuallyEdited] = useState(false);

  useEffect(() => {
    if (author) {
      setFormData({
        display_name: author.display_name || '',
        author_slug: author.author_slug || '',
        credentials: author.credentials || '',
        bio: author.bio || '',
        avatar_url: author.avatar_url || '',
        linkedin_url: author.social_links?.linkedin || '',
        is_ai_author: author.is_ai_author || false
      });
      setSlugManuallyEdited(!!author.author_slug);
    } else {
      setFormData({
        display_name: '',
        author_slug: '',
        credentials: '',
        bio: '',
        avatar_url: '',
        linkedin_url: '',
        is_ai_author: false
      });
      setSlugManuallyEdited(false);
    }
  }, [author, open]);

  // Auto-generate slug from display name for new authors
  useEffect(() => {
    if (!author && formData.display_name && !slugManuallyEdited) {
      const autoSlug = slugify(formData.display_name);
      setFormData(prev => ({ ...prev, author_slug: autoSlug }));
    }
  }, [formData.display_name, author, slugManuallyEdited]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      await onSave({
        display_name: formData.display_name,
        author_slug: formData.author_slug || formData.display_name.toLowerCase().replace(/\s+/g, '-'),
        credentials: formData.credentials,
        bio: formData.bio,
        avatar_url: formData.avatar_url,
        is_ai_author: formData.is_ai_author,
        social_links: {
          linkedin: formData.linkedin_url
        }
      });
      onOpenChange(false);
    } catch (error) {
      console.error('Failed to save author:', error);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{author ? 'Edit Author' : 'New Author'}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="display_name">Name *</Label>
            <Input
              id="display_name"
              value={formData.display_name}
              onChange={(e) => setFormData({ ...formData, display_name: e.target.value })}
              required
            />
          </div>

          <div>
            <Label htmlFor="author_slug">Slug *</Label>
            <Input
              id="author_slug"
              value={formData.author_slug}
              onChange={(e) => {
                setFormData({ ...formData, author_slug: e.target.value });
                setSlugManuallyEdited(true);
              }}
              placeholder="URL-friendly version of the name (auto-generated)"
            />
            <p className="text-sm text-muted-foreground mt-1">
              Auto-generated from name. Edit manually to customize.
            </p>
          </div>

          <div>
            <Label htmlFor="credentials">Credentials</Label>
            <Input
              id="credentials"
              value={formData.credentials}
              onChange={(e) => setFormData({ ...formData, credentials: e.target.value })}
              placeholder="PhD in Special Education, BCBA"
            />
          </div>

          <div>
            <Label htmlFor="bio">Bio</Label>
            <Textarea
              id="bio"
              value={formData.bio}
              onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
              placeholder="Brief professional biography..."
              rows={4}
              maxLength={1000}
            />
            <p className="text-sm text-muted-foreground mt-1">
              {formData.bio.length}/1000 characters
            </p>
          </div>

          <div>
            <Label htmlFor="avatar_url">Photo URL</Label>
            <Input
              id="avatar_url"
              type="url"
              value={formData.avatar_url}
              onChange={(e) => setFormData({ ...formData, avatar_url: e.target.value })}
              placeholder="https://example.com/photo.jpg"
            />
          </div>

          <div>
            <Label htmlFor="linkedin_url">LinkedIn URL</Label>
            <Input
              id="linkedin_url"
              type="url"
              value={formData.linkedin_url}
              onChange={(e) => setFormData({ ...formData, linkedin_url: e.target.value })}
              placeholder="https://linkedin.com/in/username"
            />
          </div>

          <div className="flex items-center justify-between p-4 border rounded-lg">
            <div className="space-y-0.5">
              <Label htmlFor="is_ai_author">AI Author</Label>
              <p className="text-sm text-muted-foreground">
                Mark this author as AI-generated content
              </p>
            </div>
            <Switch
              id="is_ai_author"
              checked={formData.is_ai_author}
              onCheckedChange={(checked) => setFormData({ ...formData, is_ai_author: checked })}
            />
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSaving}>
              {isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {author ? 'Update Author' : 'Create Author'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
