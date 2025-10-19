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
    <div className="container mx-auto px-3 py-4 sm:px-4 sm:py-6 max-w-7xl">
      <Button 
        variant="outline" 
        size="sm" 
        onClick={() => navigate('/dashboard/admin/blog')} 
        className="bg-background/50 backdrop-blur-sm min-h-[44px] mb-4"
      >
        <ArrowLeft className="h-4 w-4 mr-2" />
        Back to Blog Hub
      </Button>

      <TransparentTile className="p-4 sm:p-6 mb-4">
        <h1 className="text-xl sm:text-2xl md:text-3xl font-bold flex items-center gap-2 flex-wrap">
          <Users className="h-6 w-6 sm:h-8 sm:w-8 shrink-0" />
          <span>Content Manager</span>
        </h1>
        <p className="text-muted-foreground mt-2 text-sm sm:text-base">
          Manage articles, categories, and authors • Super Admin Only
        </p>
      </TransparentTile>

      <Tabs defaultValue="posts" className="space-y-4">
        <div className="w-full overflow-x-auto">
          <ScrollArea className="w-full">
            <TabsList className="inline-flex h-10 sm:h-11 items-center justify-start rounded-md bg-muted p-1 text-muted-foreground w-full sm:w-auto">
              <TabsTrigger value="posts" className="whitespace-nowrap px-3 sm:px-4 min-h-[44px] sm:min-h-0">
                <FileText className="h-4 w-4 mr-2 shrink-0" />
                <span className="text-xs sm:text-sm">Posts</span>
              </TabsTrigger>
              <TabsTrigger value="authors" className="whitespace-nowrap px-3 sm:px-4 min-h-[44px] sm:min-h-0">
                <Users className="h-4 w-4 mr-2 shrink-0" />
                <span className="text-xs sm:text-sm">Authors</span>
              </TabsTrigger>
              <TabsTrigger value="partners" className="whitespace-nowrap px-3 sm:px-4 min-h-[44px] sm:min-h-0">
                <Handshake className="h-4 w-4 mr-2 shrink-0" />
                <span className="text-xs sm:text-sm">Partners</span>
              </TabsTrigger>
            </TabsList>
            <ScrollBar orientation="horizontal" className="h-2" />
          </ScrollArea>
        </div>

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
