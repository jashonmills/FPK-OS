import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { useCollections } from '@/hooks/useCollections';
import { Badge } from '@/components/ui/badge';
import { Plus, BookOpen, Users, Globe } from 'lucide-react';
import { useParams } from 'react-router-dom';

interface CollectionSelectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  courseId: string;
  courseTitle: string;
}

export function CollectionSelectionModal({
  isOpen,
  onClose,
  courseId,
  courseTitle,
}: CollectionSelectionModalProps) {
  const { orgId } = useParams<{ orgId: string }>();
  const { collections, createCollection, addToCollection } = useCollections(orgId);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newCollectionData, setNewCollectionData] = useState({
    name: '',
    description: '',
    is_public: false,
  });

  const handleCreateCollection = async () => {
    if (!newCollectionData.name.trim()) return;
    
    try {
      await createCollection.mutateAsync(newCollectionData);
      setNewCollectionData({ name: '', description: '', is_public: false });
      setShowCreateForm(false);
    } catch (error) {
      console.error('Failed to create collection:', error);
    }
  };

  const handleAddToCollection = async (collectionId: string) => {
    try {
      await addToCollection.mutateAsync({ collectionId, courseId });
      onClose();
    } catch (error) {
      console.error('Failed to add to collection:', error);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Add "{courseTitle}" to Collection</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {!showCreateForm ? (
            <>
              {collections.length > 0 ? (
                <div className="space-y-2 max-h-60 overflow-y-auto">
                  {collections.map((collection) => (
                    <div
                      key={collection.id}
                      className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/50 cursor-pointer"
                      onClick={() => handleAddToCollection(collection.id)}
                    >
                      <div className="flex items-center space-x-3">
                        <BookOpen className="h-4 w-4 text-muted-foreground" />
                        <div>
                          <div className="font-medium">{collection.name}</div>
                          {collection.description && (
                            <div className="text-sm text-muted-foreground line-clamp-1">
                              {collection.description}
                            </div>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center space-x-1">
                        {collection.is_public ? (
                          <Badge variant="outline" className="text-xs">
                            <Globe className="h-3 w-3 mr-1" />
                            Public
                          </Badge>
                        ) : (
                          <Badge variant="secondary" className="text-xs">
                            <Users className="h-3 w-3 mr-1" />
                            Private
                          </Badge>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  <BookOpen className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>No collections found</p>
                  <p className="text-sm">Create your first collection to organize courses</p>
                </div>
              )}

              <Button
                variant="outline"
                onClick={() => setShowCreateForm(true)}
                className="w-full"
              >
                <Plus className="h-4 w-4 mr-2" />
                Create New Collection
              </Button>
            </>
          ) : (
            <div className="space-y-4">
              <div>
                <Label htmlFor="collection-name">Collection Name</Label>
                <Input
                  id="collection-name"
                  value={newCollectionData.name}
                  onChange={(e) =>
                    setNewCollectionData({ ...newCollectionData, name: e.target.value })
                  }
                  placeholder="Enter collection name"
                />
              </div>

              <div>
                <Label htmlFor="collection-description">Description (Optional)</Label>
                <Textarea
                  id="collection-description"
                  value={newCollectionData.description}
                  onChange={(e) =>
                    setNewCollectionData({ ...newCollectionData, description: e.target.value })
                  }
                  placeholder="Describe this collection"
                  rows={3}
                />
              </div>

              <div className="flex items-center space-x-2">
                <Switch
                  id="collection-public"
                  checked={newCollectionData.is_public}
                  onCheckedChange={(checked) =>
                    setNewCollectionData({ ...newCollectionData, is_public: checked })
                  }
                />
                <Label htmlFor="collection-public">Make collection public</Label>
              </div>

              <div className="flex space-x-2">
                <Button
                  onClick={handleCreateCollection}
                  disabled={!newCollectionData.name.trim() || createCollection.isPending}
                  className="flex-1"
                >
                  {createCollection.isPending ? 'Creating...' : 'Create & Add Course'}
                </Button>
                <Button
                  variant="outline"
                  onClick={() => {
                    setShowCreateForm(false);
                    setNewCollectionData({ name: '', description: '', is_public: false });
                  }}
                >
                  Cancel
                </Button>
              </div>
            </div>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}