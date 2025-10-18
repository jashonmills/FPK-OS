import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useBlogPost, useCreateBlogPost, useUpdateBlogPost, useBlogCategories, useBlogTags } from '@/hooks/useBlogPosts';
import { useBlogAuthors } from '@/hooks/useBlogAuthors';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { TransparentTile } from '@/components/ui/transparent-tile';
import { ArrowLeft, Save, Eye, CheckCircle, XCircle } from 'lucide-react';
import { calculateSEOScore } from '@/utils/seoAnalyzer';
import MDEditor from '@uiw/react-md-editor';
import rehypeSanitize from 'rehype-sanitize';
import { Skeleton } from '@/components/ui/skeleton';

export default function BlogPostEditor() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const isNewPost = !slug || slug === 'new';

  const { data: existingPost, isLoading } = useBlogPost(slug || '');
  const createMutation = useCreateBlogPost();
  const updateMutation = useUpdateBlogPost();
  const { data: categories } = useBlogCategories();
  const { data: tags } = useBlogTags();
  const { data: authors } = useBlogAuthors();

  const [title, setTitle] = useState('');
  const [slugValue, setSlugValue] = useState('');
  const [metaTitle, setMetaTitle] = useState('');
  const [metaDescription, setMetaDescription] = useState('');
  const [content, setContent] = useState('');
  const [focusKeyword, setFocusKeyword] = useState('');
  const [status, setStatus] = useState<'draft' | 'published' | 'scheduled' | 'archived'>('draft');
  const [featuredImageAlt, setFeaturedImageAlt] = useState('');
  const [authorId, setAuthorId] = useState<string>(user?.id || '');

  useEffect(() => {
    if (existingPost && !isNewPost) {
      setTitle(existingPost.title);
      setSlugValue(existingPost.slug);
      setMetaTitle(existingPost.meta_title);
      setMetaDescription(existingPost.meta_description || '');
      setContent(existingPost.content);
      setFocusKeyword(existingPost.focus_keyword || '');
      setStatus(existingPost.status);
      setFeaturedImageAlt(existingPost.featured_image_alt || '');
      setAuthorId(existingPost.author_id || user?.id || '');
    }
  }, [existingPost, isNewPost, user?.id]);

  const seoAnalysis = calculateSEOScore(title, metaTitle, metaDescription, content, focusKeyword);

  const handleSave = async () => {
    const postData = {
      title,
      slug: slugValue || undefined,
      meta_title: metaTitle,
      meta_description: metaDescription,
      content,
      focus_keyword: focusKeyword,
      status,
      featured_image_alt: featuredImageAlt,
      author_id: authorId,
      seo_score: seoAnalysis.score,
    };

    if (isNewPost) {
      await createMutation.mutateAsync(postData);
      navigate('/dashboard/admin/blog');
    } else if (existingPost) {
      await updateMutation.mutateAsync({ ...postData, id: existingPost.id });
    }
  };

  if (isLoading && !isNewPost) {
    return (
      <div className="px-6 pt-12 pb-6 space-y-6">
        <Skeleton className="h-12 w-full" />
        <Skeleton className="h-96 w-full" />
      </div>
    );
  }

  return (
    <div className="px-6 pt-12 pb-6 space-y-6">
      <Button variant="outline" size="sm" onClick={() => navigate('/dashboard/admin/blog')} className="mb-6 bg-background/50 backdrop-blur-sm">
        <ArrowLeft className="h-4 w-4 mr-2" />
        Back
      </Button>

      <div className="flex items-center justify-between">
        <TransparentTile className="px-6 py-4 flex-1 mr-4">
          <h1 className="text-3xl font-bold">{isNewPost ? 'New Post' : 'Edit Post'}</h1>
        </TransparentTile>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => {}}>
            <Eye className="h-4 w-4 mr-2" />
            Preview
          </Button>
          <Button onClick={handleSave}>
            <Save className="h-4 w-4 mr-2" />
            Save
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-6">
        {/* Main Content Area */}
        <div className="col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Content</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label>Title</Label>
                <Input
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Enter post title"
                />
              </div>
              <div>
                <Label>URL Slug</Label>
                <Input
                  value={slugValue}
                  onChange={(e) => setSlugValue(e.target.value)}
                  placeholder="auto-generated-from-title"
                />
              </div>
              <div>
                <Label>Content</Label>
                <div data-color-mode="light">
                  <MDEditor
                    value={content}
                    onChange={(val) => setContent(val || '')}
                    height={600}
                    previewOptions={{
                      rehypePlugins: [[rehypeSanitize]],
                    }}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* SEO Sidebar */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Post Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label>Status</Label>
                <Select value={status} onValueChange={(val: any) => setStatus(val)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="draft">Draft</SelectItem>
                    <SelectItem value="published">Published</SelectItem>
                    <SelectItem value="scheduled">Scheduled</SelectItem>
                    <SelectItem value="archived">Archived</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label>Author</Label>
                <Select value={authorId} onValueChange={setAuthorId}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select an author" />
                  </SelectTrigger>
                  <SelectContent className="bg-background border shadow-lg z-50">
                    {authors?.map((author) => (
                      <SelectItem key={author.id} value={author.user_id}>
                        {author.display_name}{author.is_ai_author ? ' (AI)' : ''}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>SEO Score</CardTitle>
                <Badge variant={seoAnalysis.score >= 80 ? 'default' : seoAnalysis.score >= 60 ? 'secondary' : 'destructive'}>
                  {seoAnalysis.score}/100
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Progress value={seoAnalysis.score} className="h-2" />
              </div>

              <div>
                <Label>Focus Keyword</Label>
                <Input
                  value={focusKeyword}
                  onChange={(e) => setFocusKeyword(e.target.value)}
                  placeholder="primary-keyword"
                />
              </div>

              <div>
                <Label>Meta Title ({metaTitle.length}/60)</Label>
                <Input
                  value={metaTitle}
                  onChange={(e) => setMetaTitle(e.target.value)}
                  placeholder="SEO-optimized title"
                  maxLength={60}
                />
              </div>

              <div>
                <Label>Meta Description ({metaDescription.length}/160)</Label>
                <Textarea
                  value={metaDescription}
                  onChange={(e) => setMetaDescription(e.target.value)}
                  placeholder="Brief description for search engines"
                  maxLength={160}
                  rows={3}
                />
              </div>

              <div>
                <Label>Featured Image Alt Text</Label>
                <Input
                  value={featuredImageAlt}
                  onChange={(e) => setFeaturedImageAlt(e.target.value)}
                  placeholder="Describe the image"
                />
              </div>

              <div className="space-y-2">
                <Label className="text-sm font-semibold">SEO Checklist</Label>
                <div className="space-y-2 text-sm">
                  {Object.entries(seoAnalysis.checks).map(([key, check]) => (
                    <div key={key} className="flex items-start gap-2">
                      {check.passed ? (
                        <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                      ) : (
                        <XCircle className="h-4 w-4 text-destructive mt-0.5 flex-shrink-0" />
                      )}
                      <span className={check.passed ? 'text-muted-foreground' : ''}>
                        {check.message}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}