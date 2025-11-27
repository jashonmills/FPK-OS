import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { 
  Users, 
  Search, 
  UserX, 
  UserCheck, 
  Ban, 
  Mail, 
  MoreHorizontal,
  Crown,
  GraduationCap,
  User
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { supabase } from '@/integrations/supabase/client';
import { useOrgMemberManagement } from '@/hooks/useOrgMemberManagement';
import type { Organization, OrgMember } from '@/types/organization';

interface ManageMembersDialogProps {
  organization: Organization;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ManageMembersDialog({ organization, open, onOpenChange }: ManageMembersDialogProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedMembers, setSelectedMembers] = useState<string[]>([]);
  
  const { removeMember, pauseMember, restoreMember } = useOrgMemberManagement(organization.id);

  const { data: members = [], isLoading } = useQuery({
    queryKey: ['orgMembers', organization.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('org_members')
        .select('*')
        .eq('org_id', organization.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data || [];
    },
    enabled: open,
  });

  const filteredMembers = members.filter(member => {
    // Simple filter since we don't have profile data in this query
    return member.user_id?.toLowerCase().includes(searchQuery.toLowerCase()) || 
           member.role?.toLowerCase().includes(searchQuery.toLowerCase());
  });

  const handleSelectMember = (memberId: string, checked: boolean) => {
    if (checked) {
      setSelectedMembers(prev => [...prev, memberId]);
    } else {
      setSelectedMembers(prev => prev.filter(id => id !== memberId));
    }
  };

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedMembers(filteredMembers.map(m => m.id));
    } else {
      setSelectedMembers([]);
    }
  };

  const handleBulkAction = async (action: 'pause' | 'restore' | 'remove') => {
    const promises = selectedMembers.map(memberId => {
      switch (action) {
        case 'pause':
          return pauseMember(memberId);
        case 'restore':
          return restoreMember(memberId);
        case 'remove':
          return removeMember(memberId);
        default:
          return Promise.resolve();
      }
    });

    await Promise.all(promises);
    setSelectedMembers([]);
  };

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'owner': return <Crown className="h-4 w-4 text-yellow-500" />;
      case 'instructor': return <GraduationCap className="h-4 w-4 text-blue-500" />;
      case 'student': return <User className="h-4 w-4 text-green-500" />;
      default: return <User className="h-4 w-4 text-muted-foreground" />;
    }
  };

  const getStatusVariant = (status: string) => {
    switch (status) {
      case 'active': return 'default';
      case 'paused': return 'secondary';
      case 'blocked': return 'destructive';
      case 'removed': return 'outline';
      default: return 'secondary';
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[900px] max-h-[80vh] bg-background border border-border">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-foreground">
            <Users className="h-5 w-5" />
            Manage Members - {organization.name}
          </DialogTitle>
          <DialogDescription className="text-muted-foreground">
            View and manage organization members. You can bulk select members for actions.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Search and Bulk Actions */}
          <div className="flex items-center justify-between gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search members..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 bg-input border-border text-foreground"
              />
            </div>
            
            {selectedMembers.length > 0 && (
              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground">
                  {selectedMembers.length} selected
                </span>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleBulkAction('pause')}
                  className="border-border text-muted-foreground hover:bg-muted"
                >
                  <Ban className="h-4 w-4 mr-1" />
                  Pause
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleBulkAction('restore')}
                  className="border-border text-muted-foreground hover:bg-muted"
                >
                  <UserCheck className="h-4 w-4 mr-1" />
                  Restore
                </Button>
                <Button
                  size="sm"
                  variant="destructive"
                  onClick={() => handleBulkAction('remove')}
                >
                  <UserX className="h-4 w-4 mr-1" />
                  Remove
                </Button>
              </div>
            )}
          </div>

          {/* Members Table */}
          <div className="border border-border rounded-lg">
            <Table>
              <TableHeader>
                <TableRow className="hover:bg-muted/50">
                  <TableHead className="w-12">
                    <Checkbox
                      checked={selectedMembers.length === filteredMembers.length && filteredMembers.length > 0}
                      onCheckedChange={handleSelectAll}
                      className="border-border data-[state=checked]:bg-primary data-[state=checked]:border-primary"
                    />
                  </TableHead>
                  <TableHead className="text-foreground">Member</TableHead>
                  <TableHead className="text-foreground">Role</TableHead>
                  <TableHead className="text-foreground">Status</TableHead>
                  <TableHead className="text-foreground">Joined</TableHead>
                  <TableHead className="w-12"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                      Loading members...
                    </TableCell>
                  </TableRow>
                ) : filteredMembers.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                      No members found
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredMembers.map((member) => (
                    <TableRow key={member.id} className="hover:bg-muted/50">
                      <TableCell>
                        <Checkbox
                          checked={selectedMembers.includes(member.id)}
                          onCheckedChange={(checked) => handleSelectMember(member.id, !!checked)}
                          className="border-border data-[state=checked]:bg-primary data-[state=checked]:border-primary"
                        />
                      </TableCell>
                      <TableCell>
                        <div>
                          <div className="font-medium text-foreground">
                            {member.user_id}
                          </div>
                          <div className="text-sm text-muted-foreground">
                            Member ID: {member.id.slice(0, 8)}...
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          {getRoleIcon(member.role)}
                          <span className="capitalize text-foreground">{member.role}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant={getStatusVariant(member.status)}>
                          {member.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        {member.joined_at ? new Date(member.joined_at).toLocaleDateString() : 'N/A'}
                      </TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0 hover:bg-muted">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="bg-background border border-border">
                            {member.status === 'active' && (
                              <DropdownMenuItem 
                                onClick={() => pauseMember(member.id)}
                                className="cursor-pointer hover:bg-muted"
                              >
                                <Ban className="mr-2 h-4 w-4" />
                                Pause Access
                              </DropdownMenuItem>
                            )}
                            {member.status === 'paused' && (
                              <DropdownMenuItem 
                                onClick={() => restoreMember(member.id)}
                                className="cursor-pointer hover:bg-muted"
                              >
                                <UserCheck className="mr-2 h-4 w-4" />
                                Restore Access
                              </DropdownMenuItem>
                            )}
                            <DropdownMenuItem 
                              onClick={() => removeMember(member.id)}
                              className="cursor-pointer hover:bg-destructive/10 text-destructive"
                            >
                              <UserX className="mr-2 h-4 w-4" />
                              Remove Member
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>

          {/* Summary Stats */}
          <div className="grid grid-cols-4 gap-4 pt-4 border-t border-border">
            <div className="text-center">
              <div className="text-2xl font-bold text-foreground">{members.length}</div>
              <div className="text-sm text-muted-foreground">Total Members</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-success">
                {members.filter(m => m.status === 'active').length}
              </div>
              <div className="text-sm text-muted-foreground">Active</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-warning">
                {members.filter(m => m.status === 'paused').length}
              </div>
              <div className="text-sm text-muted-foreground">Paused</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-destructive">
                {members.filter(m => m.status === 'removed').length}
              </div>
              <div className="text-sm text-muted-foreground">Removed</div>
            </div>
          </div>
        </div>

        <div className="flex justify-end pt-4">
          <Button 
            onClick={() => onOpenChange(false)}
            className="bg-primary text-primary-foreground hover:bg-primary/90"
          >
            Close
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}