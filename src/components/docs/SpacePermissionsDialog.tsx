import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { X, Plus, Shield, Users, Globe } from 'lucide-react';

interface SpacePermissionsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  spaceId: string;
  spaceName: string;
}

export const SpacePermissionsDialog = ({ open, onOpenChange, spaceId, spaceName }: SpacePermissionsDialogProps) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [searchEmail, setSearchEmail] = useState('');
  const [showAddUser, setShowAddUser] = useState(false);

  // Fetch space details
  const { data: space } = useQuery({
    queryKey: ['space-details', spaceId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('doc_spaces')
        .select('is_public, is_personal, created_by')
        .eq('id', spaceId)
        .single();
      if (error) throw error;
      return data;
    },
    enabled: open,
  });

  // Fetch permissions
  const { data: permissions } = useQuery({
    queryKey: ['space-permissions', spaceId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('space_permissions')
        .select('id, user_id, role, profiles:user_id(full_name, email)')
        .eq('space_id', spaceId)
        .order('granted_at');
      if (error) throw error;
      return data;
    },
    enabled: open,
  });

  // Search users
  const { data: searchResults } = useQuery({
    queryKey: ['search-users', searchEmail],
    queryFn: async () => {
      if (!searchEmail || searchEmail.length < 2) return [];
      const { data, error } = await supabase
        .from('profiles')
        .select('id, full_name, email')
        .or(`email.ilike.%${searchEmail}%,full_name.ilike.%${searchEmail}%`)
        .limit(10);
      if (error) throw error;
      return data;
    },
    enabled: showAddUser && searchEmail.length >= 2,
  });

  // Toggle public access
  const togglePublicMutation = useMutation({
    mutationFn: async (isPublic: boolean) => {
      const { error } = await supabase
        .from('doc_spaces')
        .update({ is_public: isPublic })
        .eq('id', spaceId);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['space-details'] });
      queryClient.invalidateQueries({ queryKey: ['documentation-spaces'] });
      toast({
        title: 'Success',
        description: 'Space visibility updated',
      });
    },
  });

  // Add user permission
  const addPermissionMutation = useMutation({
    mutationFn: async ({ userId, role }: { userId: string; role: string }) => {
      const { error } = await supabase
        .from('space_permissions')
        .insert({
          space_id: spaceId,
          user_id: userId,
          role: role as any,
          granted_by: user?.id,
        });
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['space-permissions'] });
      setSearchEmail('');
      setShowAddUser(false);
      toast({
        title: 'Success',
        description: 'User access granted',
      });
    },
    onError: () => {
      toast({
        title: 'Error',
        description: 'Failed to grant access',
        variant: 'destructive',
      });
    },
  });

  // Update user permission
  const updatePermissionMutation = useMutation({
    mutationFn: async ({ permissionId, role }: { permissionId: string; role: string }) => {
      const { error } = await supabase
        .from('space_permissions')
        .update({ role: role as any })
        .eq('id', permissionId);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['space-permissions'] });
      toast({
        title: 'Success',
        description: 'Permission updated',
      });
    },
  });

  // Remove user permission
  const removePermissionMutation = useMutation({
    mutationFn: async (permissionId: string) => {
      const { error } = await supabase
        .from('space_permissions')
        .delete()
        .eq('id', permissionId);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['space-permissions'] });
      toast({
        title: 'Success',
        description: 'Access removed',
      });
    },
  });

  const getRoleLabel = (role: string) => {
    const labels: Record<string, string> = {
      admin: 'Admin',
      editor: 'Editor',
      commenter: 'Commenter',
      viewer: 'Viewer',
    };
    return labels[role] || role;
  };

  const getRoleDescription = (role: string) => {
    const descriptions: Record<string, string> = {
      admin: 'Full control over space and permissions',
      editor: 'Can edit pages and content',
      commenter: 'Can comment on pages',
      viewer: 'Can only view pages',
    };
    return descriptions[role] || '';
  };

  if (space?.is_personal) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Personal Space</DialogTitle>
          </DialogHeader>
          <div className="py-6 text-center text-muted-foreground">
            <Shield className="h-12 w-12 mx-auto mb-3 opacity-50" />
            <p>This is your personal space. Only you have access to it.</p>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Space Permissions: {spaceName}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Public Access Toggle */}
          <div className="flex items-center justify-between p-4 border rounded-lg">
            <div className="flex items-center gap-3">
              <Globe className="h-5 w-5 text-muted-foreground" />
              <div>
                <Label className="font-medium">Public Access</Label>
                <p className="text-sm text-muted-foreground">
                  Anyone in the organization can view this space
                </p>
              </div>
            </div>
            <Switch
              checked={space?.is_public || false}
              onCheckedChange={(checked) => togglePublicMutation.mutate(checked)}
            />
          </div>

          {/* User Permissions List */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <Label className="font-medium flex items-center gap-2">
                <Users className="h-4 w-4" />
                User Access ({permissions?.length || 0})
              </Label>
              <Button
                onClick={() => setShowAddUser(!showAddUser)}
                variant="outline"
                size="sm"
                className="gap-2"
              >
                <Plus className="h-4 w-4" />
                Add User
              </Button>
            </div>

            {/* Add User Interface */}
            {showAddUser && (
              <div className="mb-4 p-3 border rounded-lg bg-accent/50">
                <Input
                  placeholder="Search by email or name..."
                  value={searchEmail}
                  onChange={(e) => setSearchEmail(e.target.value)}
                  className="mb-2"
                />
                {searchResults && searchResults.length > 0 && (
                  <ScrollArea className="h-40">
                    <div className="space-y-1">
                      {searchResults.map((result) => (
                        <div
                          key={result.id}
                          className="flex items-center justify-between p-2 hover:bg-accent rounded"
                        >
                          <div className="flex items-center gap-2">
                            <Avatar className="h-8 w-8">
                              <AvatarFallback>
                                {result.full_name?.split(' ').map((n: string) => n[0]).join('') || 'U'}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <p className="text-sm font-medium">{result.full_name}</p>
                              <p className="text-xs text-muted-foreground">{result.email}</p>
                            </div>
                          </div>
                          <Select
                            defaultValue="viewer"
                            onValueChange={(role) => {
                              addPermissionMutation.mutate({ userId: result.id, role });
                            }}
                          >
                            <SelectTrigger className="w-32">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="admin">Admin</SelectItem>
                              <SelectItem value="editor">Editor</SelectItem>
                              <SelectItem value="commenter">Commenter</SelectItem>
                              <SelectItem value="viewer">Viewer</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      ))}
                    </div>
                  </ScrollArea>
                )}
              </div>
            )}

            {/* Existing Permissions */}
            <ScrollArea className="h-64">
              <div className="space-y-2">
                {permissions && permissions.length > 0 ? (
                  permissions.map((permission) => {
                    const profile = permission.profiles as any;
                    return (
                      <div
                        key={permission.id}
                        className="flex items-center justify-between p-3 border rounded-lg hover:bg-accent/50 transition-colors"
                      >
                        <div className="flex items-center gap-3 flex-1">
                          <Avatar className="h-10 w-10">
                            <AvatarFallback>
                              {profile?.full_name?.split(' ').map((n: string) => n[0]).join('') || 'U'}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex-1">
                            <p className="font-medium">{profile?.full_name || 'Unknown'}</p>
                            <p className="text-sm text-muted-foreground">{profile?.email}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Select
                            value={permission.role}
                            onValueChange={(role) => {
                              updatePermissionMutation.mutate({ permissionId: permission.id, role });
                            }}
                          >
                            <SelectTrigger className="w-36">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="admin">
                                <div>
                                  <div className="font-medium">Admin</div>
                                  <div className="text-xs text-muted-foreground">Full control</div>
                                </div>
                              </SelectItem>
                              <SelectItem value="editor">
                                <div>
                                  <div className="font-medium">Editor</div>
                                  <div className="text-xs text-muted-foreground">Can edit</div>
                                </div>
                              </SelectItem>
                              <SelectItem value="commenter">
                                <div>
                                  <div className="font-medium">Commenter</div>
                                  <div className="text-xs text-muted-foreground">Can comment</div>
                                </div>
                              </SelectItem>
                              <SelectItem value="viewer">
                                <div>
                                  <div className="font-medium">Viewer</div>
                                  <div className="text-xs text-muted-foreground">Read only</div>
                                </div>
                              </SelectItem>
                            </SelectContent>
                          </Select>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => removePermissionMutation.mutate(permission.id)}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    No users have been granted access yet
                  </div>
                )}
              </div>
            </ScrollArea>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
