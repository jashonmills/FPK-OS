import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { TransparentTile } from '@/components/ui/transparent-tile';
import { FileText, Tag, Image, BarChart3, Sparkles, Database } from 'lucide-react';

export default function BlogHub() {
  const navigate = useNavigate();

  const sections = [
    {
      title: 'AI Content Generator',
      description: 'Create SEO-optimized posts with AI',
      icon: Sparkles,
      path: '/dashboard/admin/blog/posts',
      color: 'text-pink-600',
      featured: true
    },
    {
      title: 'Content Manager',
      description: 'Manage posts, categories, and authors',
      icon: FileText,
      path: '/dashboard/admin/blog/content',
      color: 'text-blue-600'
    },
    {
      title: 'Categories',
      description: 'Organize content with categories',
      icon: Tag,
      path: '/dashboard/admin/blog/categories',
      color: 'text-green-600'
    },
    {
      title: 'Knowledge Base Command Center',
      description: 'Ingest content from academic & clinical sources',
      icon: Database,
      path: '/dashboard/admin/blog/knowledge-base',
      color: 'text-indigo-600',
      featured: true
    },
    {
      title: 'Media Library',
      description: 'Upload and manage images',
      icon: Image,
      path: '/dashboard/admin/blog/media',
      color: 'text-purple-600'
    },
    {
      title: 'Analytics',
      description: 'Track performance metrics',
      icon: BarChart3,
      path: '/dashboard/admin/blog/analytics',
      color: 'text-orange-600'
    },
  ];

  return (
    <div className="p-6 space-y-6">
      <TransparentTile className="p-6">
        <h1 className="text-3xl font-bold">Content Management</h1>
        <p className="text-muted-foreground mt-1">Manage your SEO-optimized blog</p>
      </TransparentTile>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
        {sections.map((section) => {
          const Icon = section.icon;
          return (
            <Card
              key={section.path}
              className={`cursor-pointer hover:shadow-lg transition-shadow bg-background/80 backdrop-blur-sm ${
                section.featured ? 'border-pink-500/50 bg-gradient-to-br from-pink-500/5 to-purple-500/5' : ''
              }`}
              onClick={() => navigate(section.path)}
            >
              <CardHeader>
                <CardTitle className="flex items-center gap-3">
                  <Icon className={`h-6 w-6 ${section.color}`} />
                  {section.title}
                  {section.featured && (
                    <Badge className="ml-auto bg-gradient-to-r from-pink-500 to-purple-500">New</Badge>
                  )}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">{section.description}</p>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
