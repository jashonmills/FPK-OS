import React, { useState } from 'react';
import { useParams, Navigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { useCollections } from '@/hooks/useCollections';
import PageShell from '@/components/dashboard/PageShell';
import { Plus, BookOpen, Users, Globe, Lock, Trash2 } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';

export default function OrgCollections() {
  const { orgId } = useParams<{ orgId: string }>();
  const { toast } = useToast();
  const { collections, isLoading, createCollection, removeFromCollection } = useCollections(orgId);
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [newCollection, setNewCollection] = useState({
    name: '',
    description: '',
    isPublic: false
  });

  if (!orgId) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center space-y-4">
          <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="text-muted-foreground text-sm">Loading organization...</p>
        </div>
      </div>
    );
  }

  const handleCreateCollection = async () => {
    if (!newCollection.name.trim()) {
      toast({
        title: "Validation Error",
        description: "Collection name is required.",
        variant: "destructive",
      });
      return;
    }

    try {
        await createCollection.mutateAsync({
          name: newCollection.name,
          description: newCollection.description,
          is_public: newCollection.isPublic
        });

      setNewCollection({ name: '', description: '', isPublic: false });
      setShowCreateDialog(false);
    } catch (error) {
      console.error('Failed to create collection:', error);
    }
  };

  const handleRemoveFromCollection = async (collectionId: string, courseId: string) => {
    try {
      await removeFromCollection.mutateAsync({ collectionId, courseId });
    } catch (error) {
      console.error('Failed to remove course from collection:', error);
    }
  };

  if (isLoading) {
    return (
      <PageShell>
        <div className="p-6">
          <div className="mb-6">
            <h1 className="text-2xl font-bold">Course Collections</h1>
            <p className="text-muted-foreground">
              Organize and manage your course collections
            </p>
          </div>
          <div className="flex items-center justify-center h-64">
            <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
          </div>
        </div>
      </PageShell>
    );
  }

  return (
    <PageShell>
      <div className="p-6">
        <div className="mb-6">
          <h1 className="text-2xl font-bold">Course Collections</h1>
          <p className="text-muted-foreground">
            Organize and manage your course collections
          </p>
        </div>
      <div className="space-y-6">
        {/* Header with Create Button */}
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-bold">Collections</h2>
            <p className="text-muted-foreground">
              Organize courses into collections for better management and sharing.
            </p>
          </div>
          
          <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="w-4 h-4 mr-2" />
                New Collection
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Create New Collection</DialogTitle>
                <DialogDescription>
                  Create a new collection to organize your courses.
                </DialogDescription>
              </DialogHeader>
              
              <div className="space-y-4">
                <div>
                  <Label htmlFor="name">Collection Name</Label>
                  <Input
                    id="name"
                    value={newCollection.name}
                    onChange={(e) => setNewCollection(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="Enter collection name"
                  />
                </div>
                
                <div>
                  <Label htmlFor="description">Description (Optional)</Label>
                  <Textarea
                    id="description"
                    value={newCollection.description}
                    onChange={(e) => setNewCollection(prev => ({ ...prev, description: e.target.value }))}
                    placeholder="Describe this collection"
                    rows={3}
                  />
                </div>
                
                <div className="flex items-center space-x-2">
                  <Switch
                    id="public"
                    checked={newCollection.isPublic}
                    onCheckedChange={(checked) => setNewCollection(prev => ({ ...prev, isPublic: checked }))}
                  />
                  <Label htmlFor="public">Make collection public</Label>
                </div>
              </div>
              
              <DialogFooter>
                <Button variant="outline" onClick={() => setShowCreateDialog(false)}>
                  Cancel
                </Button>
                <Button onClick={handleCreateCollection} disabled={createCollection.isPending}>
                  {createCollection.isPending ? 'Creating...' : 'Create Collection'}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        {/* Collections Grid */}
        {collections && collections.length > 0 ? (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {collections.map((collection) => (
              <Card key={collection.id} className="hover:shadow-md transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="flex items-center space-x-2">
                        <BookOpen className="w-5 h-5" />
                        <span className="truncate">{collection.name}</span>
                      </CardTitle>
                      {collection.description && (
                        <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                          {collection.description}
                        </p>
                      )}
                    </div>
                    <div className="flex items-center space-x-1 ml-2">
                      {collection.is_public ? (
                        <Badge variant="secondary" className="text-xs">
                          <Globe className="w-3 h-3 mr-1" />
                          Public
                        </Badge>
                      ) : (
                        <Badge variant="outline" className="text-xs">
                          <Lock className="w-3 h-3 mr-1" />
                          Private
                        </Badge>
                      )}
                    </div>
                  </div>
                </CardHeader>
                
                <CardContent>
                  <div className="space-y-3">
                    {/* Course Count */}
                    <div className="flex items-center text-sm text-muted-foreground">
                      <Users className="w-4 h-4 mr-1" />
                      <span>Collection created on {new Date(collection.created_at).toLocaleDateString()}</span>
                    </div>
                    
                    {/* Empty State for now - items would need to be fetched separately */}
                    <div className="text-center py-4 text-muted-foreground">
                      <BookOpen className="w-8 h-8 mx-auto mb-2 opacity-50" />
                      <p className="text-sm">Collection ready for courses</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <Card>
            <CardContent className="text-center py-12">
              <BookOpen className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">No Collections Yet</h3>
              <p className="text-muted-foreground mb-6">
                Create your first collection to organize courses and make them easier to manage.
              </p>
              <Button onClick={() => setShowCreateDialog(true)}>
                <Plus className="w-4 h-4 mr-2" />
                Create Your First Collection
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  </PageShell>
);
}