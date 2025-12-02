import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, Shield, BookOpen, GraduationCap, MoreVertical, Loader2, Crown, Eye, Users, Ban, History, UserCog, CheckCircle, UserPlus, Mail } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import { useAIGovernanceUsers, AIGovernanceUser } from '@/hooks/useAIGovernanceUsers';
import PlatformAdminOrgSelector from './PlatformAdminOrgSelector';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { supabase } from '@/integrations/supabase/client';

interface AIGovernanceUsersProps {
  orgId?: string;
}

const INVITE_ROLES = [
  { value: 'admin', label: 'Admin', description: 'Full access to manage organization' },
  { value: 'instructor', label: 'Instructor', description: 'Can manage courses and students' },
  { value: 'instructor_aide', label: 'Instructor Aide', description: 'Can assist with teaching' },
  { value: 'viewer', label: 'Viewer', description: 'Read-only access' },
  { value: 'student', label: 'Student', description: 'Learner access' },
];

const AIGovernanceUsers: React.FC<AIGovernanceUsersProps> = ({ orgId: propOrgId }) => {
  const [selectedOrgId, setSelectedOrgId] = useState<string | null>(propOrgId || null);
  const effectiveOrgId = propOrgId || selectedOrgId;
  const { users, isLoading, refetch } = useAIGovernanceUsers(effectiveOrgId);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRole, setFilterRole] = useState('all');
  
  // Dialog states
  const [selectedUser, setSelectedUser] = useState<AIGovernanceUser | null>(null);
  const [editRoleDialogOpen, setEditRoleDialogOpen] = useState(false);
  const [revokeDialogOpen, setRevokeDialogOpen] = useState(false);
  const [detailsDialogOpen, setDetailsDialogOpen] = useState(false);
  const [newRole, setNewRole] = useState<string>('');
  const [isUpdating, setIsUpdating] = useState(false);

  // Invite dialog states
  const [inviteDialogOpen, setInviteDialogOpen] = useState(false);
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteRole, setInviteRole] = useState<string>('student');
  const [isInviting, setIsInviting] = useState(false);

  const handleEditRole = (user: AIGovernanceUser) => {
    setSelectedUser(user);
    setNewRole(user.role);
    setEditRoleDialogOpen(true);
  };

  const handleRevokeAccess = (user: AIGovernanceUser) => {
    setSelectedUser(user);
    setRevokeDialogOpen(true);
  };

  const handleViewDetails = (user: AIGovernanceUser) => {
    setSelectedUser(user);
    setDetailsDialogOpen(true);
  };

  const saveRoleChange = async () => {
    if (!selectedUser || !effectiveOrgId || !newRole) return;
    
    setIsUpdating(true);
    try {
      const { error } = await supabase
        .from('org_members')
        .update({ role: newRole as 'owner' | 'admin' | 'instructor' | 'instructor_aide' | 'viewer' | 'student' })
        .eq('org_id', effectiveOrgId)
        .eq('user_id', selectedUser.id);

      if (error) throw error;
      
      toast.success(`Role updated to ${newRole.replace('_', ' ')}`);
      setEditRoleDialogOpen(false);
      refetch();
    } catch (error) {
      console.error('Error updating role:', error);
      toast.error('Failed to update role');
    } finally {
      setIsUpdating(false);
    }
  };

  const confirmRevokeAccess = async () => {
    if (!selectedUser || !effectiveOrgId) return;
    
    setIsUpdating(true);
    try {
      const { error } = await supabase
        .from('org_members')
        .delete()
        .eq('org_id', effectiveOrgId)
        .eq('user_id', selectedUser.id);

      if (error) throw error;
      
      toast.success(`${selectedUser.full_name || 'User'} removed from organization`);
      setRevokeDialogOpen(false);
      refetch();
    } catch (error) {
      console.error('Error removing user:', error);
      toast.error('Failed to remove user');
    } finally {
      setIsUpdating(false);
    }
  };

  const handleInviteUser = async () => {
    if (!inviteEmail || !effectiveOrgId || !inviteRole) {
      toast.error('Please fill in all fields');
      return;
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(inviteEmail)) {
      toast.error('Please enter a valid email address');
      return;
    }

    setIsInviting(true);
    try {
      // Generate invite code
      const { data: inviteData, error: inviteError } = await supabase.functions.invoke('generate-org-invite', {
        body: { orgId: effectiveOrgId, role: inviteRole }
      });

      if (inviteError) throw inviteError;

      // Get organization name
      const { data: orgData } = await supabase
        .from('organizations')
        .select('name')
        .eq('id', effectiveOrgId)
        .single();

      // Send email invitation
      const { error: emailError } = await supabase.functions.invoke('send-invitation-email', {
        body: { 
          email: inviteEmail, 
          inviteCode: inviteData.code,
          orgName: orgData?.name || 'the organization'
        }
      });

      if (emailError) {
        console.warn('Email sending failed, but invite was created:', emailError);
        toast.success(`Invitation created! Code: ${inviteData.code}`, {
          description: 'Email sending failed. Please share the code manually.'
        });
      } else {
        toast.success(`Invitation sent to ${inviteEmail}`);
      }

      setInviteDialogOpen(false);
      setInviteEmail('');
      setInviteRole('student');
    } catch (error: any) {
      console.error('Error inviting user:', error);
      toast.error(error.message || 'Failed to send invitation');
    } finally {
      setIsInviting(false);
    }
  };

  const filteredUsers = users.filter(user => {
    const matchesSearch = (user.full_name?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
                         (user.email?.toLowerCase() || '').includes(searchTerm.toLowerCase());
    const matchesFilter = filterRole === 'all' || user.role === filterRole;
    return matchesSearch && matchesFilter;
  });

  const getRoleIcon = (role: string) => {
    switch(role) {
      case 'owner': return Crown;
      case 'admin': return Shield;
      case 'instructor': return BookOpen;
      case 'instructor_aide': return Users;
      case 'viewer': return Eye;
      case 'student': return GraduationCap;
      default: return Shield;
    }
  };

  const getRoleColor = (role: string) => {
    switch(role) {
      case 'owner': return 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400';
      case 'admin': return 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400';
      case 'instructor': return 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400';
      case 'instructor_aide': return 'bg-cyan-100 text-cyan-700 dark:bg-cyan-900/30 dark:text-cyan-400';
      case 'viewer': return 'bg-gray-100 text-gray-700 dark:bg-gray-900/30 dark:text-gray-400';
      case 'student': return 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  const formatLastUsage = (timestamp: string | null) => {
    if (!timestamp) return 'Never';
    const date = new Date(timestamp);
    return date.toLocaleDateString();
  };

  const formatRoleLabel = (role: string) => {
    return role.replace('_', ' ');
  };

  return (
    <div className="space-y-6" data-cy="governance-tab-users">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-foreground">User Management</h2>
          <p className="text-muted-foreground mt-1">Manage users and their AI access permissions</p>
        </div>
        {effectiveOrgId && (
          <Button
            data-cy="add-user-button"
            onClick={() => setInviteDialogOpen(true)}
            className="bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700"
          >
            <UserPlus className="h-4 w-4 mr-2" />
            Invite User
          </Button>
        )}
      </div>

      {!propOrgId && (
        <PlatformAdminOrgSelector
          selectedOrgId={selectedOrgId}
          onOrgChange={setSelectedOrgId}
        />
      )}

      {!effectiveOrgId ? (
        <div className="bg-card rounded-xl shadow-sm border border-border p-12 text-center">
          <Users className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
          <h3 className="text-lg font-medium text-foreground mb-2">Select an Organization</h3>
          <p className="text-muted-foreground">Choose an organization above to view and manage its users.</p>
        </div>
      ) : isLoading ? (
        <div className="flex items-center justify-center h-64">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : (
        <div className="bg-card rounded-xl shadow-sm border border-border p-6">
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Search users..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            
            <Select value={filterRole} onValueChange={setFilterRole}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter by role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Roles</SelectItem>
                <SelectItem value="owner">Owners</SelectItem>
                <SelectItem value="admin">Admins</SelectItem>
                <SelectItem value="instructor">Instructors</SelectItem>
                <SelectItem value="instructor_aide">Instructor Aides</SelectItem>
                <SelectItem value="viewer">Viewers</SelectItem>
                <SelectItem value="student">Students</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left py-3 px-4 text-sm font-semibold text-muted-foreground">User</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-muted-foreground">Role</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-muted-foreground">AI Usage</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-muted-foreground">Last Used</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-muted-foreground">Status</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-muted-foreground">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.map((user, index) => {
                  const RoleIcon = getRoleIcon(user.role);
                  return (
                    <motion.tr
                      key={user.id}
                      data-cy={`user-row-${user.email}`}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: index * 0.05 }}
                      className="border-b border-border/50 hover:bg-muted/50 transition-colors"
                    >
                      <td className="py-4 px-4">
                        <div>
                          <p className="font-medium text-foreground">{user.full_name || 'Unknown'}</p>
                          <p className="text-sm text-muted-foreground">{user.email}</p>
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        <span className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium ${getRoleColor(user.role)} capitalize`}>
                          <RoleIcon className="h-3 w-3" />
                          {formatRoleLabel(user.role)}
                        </span>
                      </td>
                      <td className="py-4 px-4">
                        <div className="flex items-center gap-2">
                          <span className="text-sm text-foreground font-medium">{user.ai_usage_count}</span>
                          <span className="text-sm text-muted-foreground">sessions</span>
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        <span className="text-sm text-muted-foreground">
                          {formatLastUsage(user.last_ai_usage)}
                        </span>
                      </td>
                      <td className="py-4 px-4">
                        <span className={`inline-flex px-2 py-1 rounded-full text-xs font-medium capitalize ${
                          user.status === 'active' 
                            ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                            : 'bg-muted text-muted-foreground'
                        }`}>
                          {user.status}
                        </span>
                      </td>
                      <td className="py-4 px-4">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <MoreVertical className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => handleViewDetails(user)}>
                              <History className="h-4 w-4 mr-2" />
                              View Details
                            </DropdownMenuItem>
                            <DropdownMenuItem data-cy="edit-user-button" onClick={() => handleEditRole(user)}>
                              <UserCog className="h-4 w-4 mr-2" />
                              Edit Role
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem 
                              data-cy="delete-user-button"
                              onClick={() => handleRevokeAccess(user)}
                              className="text-destructive focus:text-destructive"
                            >
                              <Ban className="h-4 w-4 mr-2" />
                              Remove from Org
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </td>
                    </motion.tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {filteredUsers.length === 0 && (
            <div className="text-center py-12">
              <p className="text-muted-foreground">No users found matching your criteria</p>
            </div>
          )}
        </div>
      )}

      {/* Invite User Dialog */}
      <Dialog open={inviteDialogOpen} onOpenChange={setInviteDialogOpen}>
        <DialogContent data-cy="invite-dialog">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Mail className="h-5 w-5" />
              Invite User
            </DialogTitle>
            <DialogDescription>
              Send an invitation email to add a new user to your organization.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="invite-email">Email Address</Label>
              <Input
                id="invite-email"
                data-cy="invite-email-input"
                type="email"
                placeholder="user@example.com"
                value={inviteEmail}
                onChange={(e) => setInviteEmail(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="invite-role">Role</Label>
              <Select value={inviteRole} onValueChange={setInviteRole}>
                <SelectTrigger data-cy="invite-role-select">
                  <SelectValue placeholder="Select a role" />
                </SelectTrigger>
                <SelectContent>
                  {INVITE_ROLES.map(role => (
                    <SelectItem key={role.value} value={role.value}>
                      <div className="flex flex-col">
                        <span>{role.label}</span>
                        <span className="text-xs text-muted-foreground">{role.description}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setInviteDialogOpen(false)}>
              Cancel
            </Button>
            <Button 
              data-cy="send-invite-button"
              onClick={handleInviteUser} 
              disabled={isInviting || !inviteEmail}
              className="bg-gradient-to-r from-indigo-500 to-purple-600"
            >
              {isInviting ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Mail className="h-4 w-4 mr-2" />}
              Send Invitation
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Role Dialog */}
      <Dialog open={editRoleDialogOpen} onOpenChange={setEditRoleDialogOpen}>
        <DialogContent data-cy="edit-role-dialog">
          <DialogHeader>
            <DialogTitle>Edit User Role</DialogTitle>
            <DialogDescription>
              Change the role for {selectedUser?.full_name || selectedUser?.email}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Role</Label>
              <Select value={newRole} onValueChange={setNewRole} data-cy="edit-role-select">
                <SelectTrigger>
                  <SelectValue placeholder="Select a role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="owner">Owner</SelectItem>
                  <SelectItem value="admin">Admin</SelectItem>
                  <SelectItem value="instructor">Instructor</SelectItem>
                  <SelectItem value="instructor_aide">Instructor Aide</SelectItem>
                  <SelectItem value="viewer">Viewer</SelectItem>
                  <SelectItem value="student">Student</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditRoleDialogOpen(false)}>
              Cancel
            </Button>
            <Button data-cy="save-user-button" onClick={saveRoleChange} disabled={isUpdating}>
              {isUpdating ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Remove User Dialog */}
      <Dialog open={revokeDialogOpen} onOpenChange={setRevokeDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Remove User from Organization</DialogTitle>
            <DialogDescription>
              Are you sure you want to remove {selectedUser?.full_name || selectedUser?.email} from this organization? They will lose access to all organization resources.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setRevokeDialogOpen(false)}>
              Cancel
            </Button>
            <Button data-cy="confirm-delete-button" variant="destructive" onClick={confirmRevokeAccess} disabled={isUpdating}>
              {isUpdating ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
              Remove User
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* User Details Dialog */}
      <Dialog open={detailsDialogOpen} onOpenChange={setDetailsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>User Details</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className="text-muted-foreground text-xs">Name</Label>
                <p className="font-medium">{selectedUser?.full_name || 'Unknown'}</p>
              </div>
              <div>
                <Label className="text-muted-foreground text-xs">Email</Label>
                <p className="font-medium">{selectedUser?.email || 'N/A'}</p>
              </div>
              <div>
                <Label className="text-muted-foreground text-xs">Role</Label>
                <p className="font-medium capitalize">{selectedUser?.role?.replace('_', ' ')}</p>
              </div>
              <div>
                <Label className="text-muted-foreground text-xs">Status</Label>
                <p className="font-medium capitalize">{selectedUser?.status}</p>
              </div>
              <div>
                <Label className="text-muted-foreground text-xs">AI Sessions</Label>
                <p className="font-medium">{selectedUser?.ai_usage_count || 0}</p>
              </div>
              <div>
                <Label className="text-muted-foreground text-xs">Last AI Usage</Label>
                <p className="font-medium">{formatLastUsage(selectedUser?.last_ai_usage ?? null)}</p>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDetailsDialogOpen(false)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AIGovernanceUsers;
