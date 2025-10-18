import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { AuthorsManager } from './AuthorsManager';
import { Users, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { TransparentTile } from '@/components/ui/transparent-tile';

export default function ContentManager() {
  const navigate = useNavigate();
  
  return (
    <div className="px-6 pt-12 pb-6 space-y-6">
      <Button variant="outline" size="sm" onClick={() => navigate('/dashboard/admin/blog')} className="bg-background/50 backdrop-blur-sm">
        <ArrowLeft className="h-4 w-4 mr-2" />
        Back to Blog Hub
      </Button>

      <TransparentTile className="p-6">
        <h1 className="text-3xl font-bold flex items-center gap-2">
          <Users className="h-8 w-8" />
          Content Manager
        </h1>
        <p className="text-muted-foreground mt-1">Manage articles, categories, and authors • Super Admin Only</p>
      </TransparentTile>

      <Tabs defaultValue="authors" className="space-y-6">
        <TabsList>
          <TabsTrigger value="authors">
            <Users className="h-4 w-4 mr-2" />
            Authors
          </TabsTrigger>
        </TabsList>

        <TabsContent value="authors">
          <AuthorsManager />
        </TabsContent>
      </Tabs>
    </div>
  );
}
