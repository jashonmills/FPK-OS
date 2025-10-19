import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
import { AuthorsManager } from './AuthorsManager';
import { PostsManager } from './PostsManager';
import { PartnersManager } from './PartnersManager';
import { Users, ArrowLeft, FileText, Handshake } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { TransparentTile } from '@/components/ui/transparent-tile';
import { useIsMobile } from '@/hooks/use-mobile';

export default function ContentManager() {
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  
  return (
    <div className="mobile-page-container mobile-section-spacing">
      <Button 
        variant="outline" 
        size="sm" 
        onClick={() => navigate('/dashboard/admin/blog')} 
        className="bg-background/50 backdrop-blur-sm min-h-[44px]"
      >
        <ArrowLeft className="h-4 w-4 mr-2" />
        Back to Blog Hub
      </Button>

      <TransparentTile className="mobile-card-padding">
        <h1 className="mobile-heading-lg flex items-center gap-2 flex-wrap">
          <Users className="h-6 w-6 sm:h-8 sm:w-8" />
          <span>Content Manager</span>
        </h1>
        <p className="text-muted-foreground mt-1 text-sm sm:text-base">
          Manage articles, categories, and authors • Super Admin Only
        </p>
      </TransparentTile>

      <Tabs defaultValue="posts" className="mobile-section-spacing">
        {isMobile ? (
          <ScrollArea className="w-full">
            <TabsList className="inline-flex h-10 items-center justify-start rounded-md bg-muted p-1 text-muted-foreground min-w-max w-full">
              <TabsTrigger value="posts" className="whitespace-nowrap">
                <FileText className="h-4 w-4 mr-2" />
                Posts
              </TabsTrigger>
              <TabsTrigger value="authors" className="whitespace-nowrap">
                <Users className="h-4 w-4 mr-2" />
                Authors
              </TabsTrigger>
              <TabsTrigger value="partners" className="whitespace-nowrap">
                <Handshake className="h-4 w-4 mr-2" />
                Partners
              </TabsTrigger>
            </TabsList>
            <ScrollBar orientation="horizontal" />
          </ScrollArea>
        ) : (
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="posts">
              <FileText className="h-4 w-4 mr-2" />
              Posts
            </TabsTrigger>
            <TabsTrigger value="authors">
              <Users className="h-4 w-4 mr-2" />
              Authors
            </TabsTrigger>
            <TabsTrigger value="partners">
              <Handshake className="h-4 w-4 mr-2" />
              Partners
            </TabsTrigger>
          </TabsList>
        )}

        <TabsContent value="posts">
          <PostsManager />
        </TabsContent>

        <TabsContent value="authors">
          <AuthorsManager />
        </TabsContent>

        <TabsContent value="partners">
          <PartnersManager />
        </TabsContent>
      </Tabs>
    </div>
  );
}
