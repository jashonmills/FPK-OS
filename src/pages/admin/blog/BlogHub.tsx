import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
import { TransparentTile } from '@/components/ui/transparent-tile';
import { Shield, FileText, Tag, Users, Database, Image, BarChart3, Handshake } from 'lucide-react';
import { PostsManager } from './PostsManager';
import { AuthorsManager } from './AuthorsManager';
import { PartnersManager } from './PartnersManager';
import CategoryManager from './CategoryManager';
import KnowledgeBaseCommandCenter from './KnowledgeBaseCommandCenter';
import BlogAnalytics from './BlogAnalytics';
import MediaLibrary from './MediaLibrary';

export default function BlogHub() {
  const [activeTab, setActiveTab] = useState('articles');

  return (
    <div className="mobile-page-container mobile-section-spacing">
      <TransparentTile className="mobile-card-padding">
        <div className="flex items-center gap-3">
          <Shield className="h-6 w-6 sm:h-8 sm:w-8 text-primary shrink-0" />
          <div>
            <h1 className="mobile-heading-lg">Content Manager</h1>
            <p className="text-muted-foreground mt-1 text-xs sm:text-sm">Manage articles, categories, and authors • Super Admin Only</p>
          </div>
        </div>
      </TransparentTile>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="mobile-stack">
        <div className="w-full overflow-x-auto">
          <ScrollArea className="w-full">
            <TabsList className="inline-flex h-10 sm:h-11 items-center justify-start rounded-md bg-muted p-1 text-muted-foreground w-full sm:w-auto">
              <TabsTrigger value="articles" className="whitespace-nowrap px-3 sm:px-4 min-h-[44px] sm:min-h-0">
                <FileText className="h-4 w-4 mr-2 shrink-0" />
                <span className="text-xs sm:text-sm">Articles</span>
              </TabsTrigger>
              <TabsTrigger value="categories" className="whitespace-nowrap px-3 sm:px-4 min-h-[44px] sm:min-h-0">
                <Tag className="h-4 w-4 mr-2 shrink-0" />
                <span className="text-xs sm:text-sm">Categories</span>
              </TabsTrigger>
              <TabsTrigger value="authors" className="whitespace-nowrap px-3 sm:px-4 min-h-[44px] sm:min-h-0">
                <Users className="h-4 w-4 mr-2 shrink-0" />
                <span className="text-xs sm:text-sm">Authors</span>
              </TabsTrigger>
              <TabsTrigger value="partners" className="whitespace-nowrap px-3 sm:px-4 min-h-[44px] sm:min-h-0">
                <Handshake className="h-4 w-4 mr-2 shrink-0" />
                <span className="text-xs sm:text-sm">Partners</span>
              </TabsTrigger>
              <TabsTrigger value="knowledge-base" className="whitespace-nowrap px-3 sm:px-4 min-h-[44px] sm:min-h-0">
                <Database className="h-4 w-4 mr-2 shrink-0" />
                <span className="text-xs sm:text-sm">Knowledge</span>
              </TabsTrigger>
              <TabsTrigger value="media" className="whitespace-nowrap px-3 sm:px-4 min-h-[44px] sm:min-h-0">
                <Image className="h-4 w-4 mr-2 shrink-0" />
                <span className="text-xs sm:text-sm">Media</span>
              </TabsTrigger>
              <TabsTrigger value="analytics" className="whitespace-nowrap px-3 sm:px-4 min-h-[44px] sm:min-h-0">
                <BarChart3 className="h-4 w-4 mr-2 shrink-0" />
                <span className="text-xs sm:text-sm">Analytics</span>
              </TabsTrigger>
            </TabsList>
            <ScrollBar orientation="horizontal" className="h-2" />
          </ScrollArea>
        </div>

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

        <TabsContent value="partners" className="space-y-4">
          <PartnersManager />
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
