import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { AuthorsManager } from './AuthorsManager';
import { Users, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

export default function ContentManager() {
  const navigate = useNavigate();
  
  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center gap-4 mb-4">
        <Button variant="ghost" size="sm" onClick={() => navigate('/dashboard/admin/blog')}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Blog Hub
        </Button>
      </div>

      <div className="mb-6">
        <h1 className="text-3xl font-bold">Content Manager</h1>
        <p className="text-muted-foreground">Manage articles, categories, and authors • Super Admin Only</p>
      </div>

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
