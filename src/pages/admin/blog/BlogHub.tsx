import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { TransparentTile } from '@/components/ui/transparent-tile';
import { Shield, FileText, Tag, Users, Database, Image, BarChart3 } from 'lucide-react';
import { PostsManager } from './PostsManager';
import { AuthorsManager } from './AuthorsManager';
import CategoryManager from './CategoryManager';
import KnowledgeBaseCommandCenter from './KnowledgeBaseCommandCenter';
import BlogAnalytics from './BlogAnalytics';
import MediaLibrary from './MediaLibrary';

export default function BlogHub() {
  const [activeTab, setActiveTab] = useState('articles');

  return (
    <div className="px-6 pt-20 pb-6 space-y-6">
      <TransparentTile className="p-6">
        <div className="flex items-center gap-3">
          <Shield className="h-8 w-8 text-primary" />
          <div>
            <h1 className="text-3xl font-bold">Content Manager</h1>
            <p className="text-muted-foreground mt-1">Manage articles, categories, and authors • Super Admin Only</p>
          </div>
        </div>
      </TransparentTile>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="bg-background/80 backdrop-blur-sm border">
          <TabsTrigger value="articles">
            <FileText className="h-4 w-4 mr-2" />
            Articles
          </TabsTrigger>
          <TabsTrigger value="categories">
            <Tag className="h-4 w-4 mr-2" />
            Categories
          </TabsTrigger>
          <TabsTrigger value="authors">
            <Users className="h-4 w-4 mr-2" />
            Authors
          </TabsTrigger>
          <TabsTrigger value="knowledge-base">
            <Database className="h-4 w-4 mr-2" />
            Knowledge Base
          </TabsTrigger>
          <TabsTrigger value="media">
            <Image className="h-4 w-4 mr-2" />
            Media Library
          </TabsTrigger>
          <TabsTrigger value="analytics">
            <BarChart3 className="h-4 w-4 mr-2" />
            Analytics
          </TabsTrigger>
        </TabsList>

        <TabsContent value="articles" className="space-y-4">
          <PostsManager />
        </TabsContent>

        <TabsContent value="categories" className="space-y-4">
          <div className="border rounded-lg bg-background/80 backdrop-blur-sm p-6">
            <CategoryManager />
          </div>
        </TabsContent>

        <TabsContent value="authors" className="space-y-4">
          <AuthorsManager />
        </TabsContent>

        <TabsContent value="knowledge-base" className="space-y-4">
          <div className="bg-background/80 backdrop-blur-sm rounded-lg">
            <KnowledgeBaseCommandCenter />
          </div>
        </TabsContent>

        <TabsContent value="media" className="space-y-4">
          <div className="bg-background/80 backdrop-blur-sm rounded-lg">
            <MediaLibrary />
          </div>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-4">
          <div className="bg-background/80 backdrop-blur-sm rounded-lg">
            <BlogAnalytics />
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
