import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { 
  Plus, 
  Mail, 
  QrCode, 
  Search, 
  MoreHorizontal,
  Eye,
  MessageSquare,
  UserMinus,
  UserCheck,
  UserX,
  RefreshCw
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { useOrgMembers, useOrgInvitations } from '@/hooks/useOrganization';
import { useOrgInvitations as useInviteActions } from '@/hooks/useOrgInvitations';
import { useOrgMemberManagement } from '@/hooks/useOrgMemberManagement';
import InviteStudentDialog from './InviteStudentDialog';
import type { MemberStatus } from '@/types/organization';

interface StudentsTabProps {
  organizationId: string;
}

export default function StudentsTab({ organizationId }: StudentsTabProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [showInviteDialog, setShowInviteDialog] = useState(false);
  const { toast } = useToast();
  
  const { data: members, isLoading, refetch } = useOrgMembers(organizationId);
  const { data: invitations } = useOrgInvitations(organizationId);
  const { deactivateInvitation, isDeactivating } = useInviteActions(organizationId);
  const { 
    removeMember, 
    pauseMember, 
    restoreMember, 
    isRemoving, 
    isPausing, 
    isRestoring 
  } = useOrgMemberManagement(organizationId);

  const students = members?.filter(m => m.role === 'student') || [];
  const activeStudents = students.filter(s => s.status === 'active');
  const pendingInvitations = invitations?.filter(i => i.status === 'pending') || [];

  // Removed excessive debug logging for performance

  const filteredStudents = students.filter(student => {
    const name = student.profiles?.display_name || student.profiles?.full_name || 'Unknown';
    return name.toLowerCase().includes(searchQuery.toLowerCase());
  });

  const getStatusColor = (status: MemberStatus) => {
    switch (status) {
      case 'active': return 'default';
      case 'paused': return 'secondary';
      case 'blocked': return 'destructive';
      case 'removed': return 'outline';
      default: return 'secondary';
    }
  };

  const handleRemoveStudent = async (memberId: string, studentName: string) => {
    if (confirm(`Are you sure you want to remove ${studentName}? They will lose access to the organization.`)) {
      removeMember(memberId);
    }
  };

  const handlePauseStudent = async (memberId: string, studentName: string) => {
    if (confirm(`Are you sure you want to pause access for ${studentName}?`)) {
      pauseMember(memberId);
    }
  };

  const handleRestoreStudent = async (memberId: string, studentName: string) => {
    if (confirm(`Are you sure you want to restore access for ${studentName}?`)) {
      restoreMember(memberId);
    }
  };

  const handleViewProgress = (studentName: string) => {
    // TODO: Navigate to student progress page
    toast({
      title: "View Progress",
      description: `Coming soon: View progress for ${studentName}`,
    });
  };

  const handleSendMessage = (studentName: string) => {
    // TODO: Open message dialog
    toast({
      title: "Send Message",
      description: `Coming soon: Send message to ${studentName}`,
    });
  };

  const handleCancelInvitation = async (invitationId: string) => {
    if (confirm('Are you sure you want to cancel this invitation?')) {
      deactivateInvitation(invitationId);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header with stats and actions */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="text-sm text-muted-foreground">
            <span className="font-medium text-foreground">{activeStudents.length}</span> active students
            {pendingInvitations.length > 0 && (
              <span className="ml-2">
                • <span className="font-medium text-foreground">{pendingInvitations.length}</span> pending invitations
              </span>
            )}
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={() => refetch()}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
          <Button onClick={() => setShowInviteDialog(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Invite Students
          </Button>
        </div>
      </div>

      {/* Search and filters */}
      <div className="flex items-center gap-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search students..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      {/* Students table */}
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Student</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Joined</TableHead>
                <TableHead>Last Active</TableHead>
                <TableHead className="w-[50px]"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredStudents.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                    {searchQuery ? 'No students found matching your search' : 'No students yet'}
                  </TableCell>
                </TableRow>
              ) : (
                filteredStudents.map((student) => (
                  <TableRow key={student.id}>
                    <TableCell>
                      <div>
                        <div className="font-medium">
                          {student.profiles?.display_name || student.profiles?.full_name || 'Unknown User'}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          Student ID: {student.user_id.slice(0, 8)}...
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant={getStatusColor(student.status)}>
                        {student.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {student.joined_at 
                        ? new Date(student.joined_at).toLocaleDateString()
                        : 'Not joined'
                      }
                    </TableCell>
                    <TableCell>
                      <span className="text-muted-foreground">
                        {/* TODO: Add last active tracking */}
                        -
                      </span>
                    </TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => handleViewProgress(student.profiles?.display_name || student.profiles?.full_name || 'Unknown User')}>
                            <Eye className="h-4 w-4 mr-2" />
                            View Progress
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleSendMessage(student.profiles?.display_name || student.profiles?.full_name || 'Unknown User')}>
                            <MessageSquare className="h-4 w-4 mr-2" />
                            Send Message
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          {student.status === 'active' && (
                            <DropdownMenuItem 
                              onClick={() => handlePauseStudent(student.id, student.profiles?.display_name || student.profiles?.full_name || 'Unknown User')}
                              disabled={isPausing}
                            >
                              <UserX className="h-4 w-4 mr-2" />
                              {isPausing ? 'Pausing...' : 'Pause Access'}
                            </DropdownMenuItem>
                          )}
                          {student.status === 'paused' && (
                            <DropdownMenuItem 
                              onClick={() => handleRestoreStudent(student.id, student.profiles?.display_name || student.profiles?.full_name || 'Unknown User')}
                              disabled={isRestoring}
                            >
                              <UserCheck className="h-4 w-4 mr-2" />
                              {isRestoring ? 'Restoring...' : 'Resume Access'}
                            </DropdownMenuItem>
                          )}
                          <DropdownMenuSeparator />
                          <DropdownMenuItem 
                            className="text-destructive"
                            onClick={() => handleRemoveStudent(student.id, student.profiles?.display_name || student.profiles?.full_name || 'Unknown User')}
                            disabled={isRemoving}
                          >
                            <UserMinus className="h-4 w-4 mr-2" />
                            {isRemoving ? 'Removing...' : 'Remove Student'}
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Pending invitations */}
      {pendingInvitations.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Pending Invitations</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {pendingInvitations.map((invitation) => (
                <div key={invitation.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <div className="font-medium">
                      {invitation.email || `Code: ${invitation.code}`}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      Expires {new Date(invitation.expires_at).toLocaleDateString()}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="secondary">Pending</Badge>
                    <Button 
                      variant="destructive" 
                      size="sm"
                      onClick={() => handleCancelInvitation(invitation.id)}
                      disabled={isDeactivating}
                    >
                      {isDeactivating ? 'Deleting...' : 'Delete'}
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      <InviteStudentDialog
        open={showInviteDialog}
        onOpenChange={setShowInviteDialog}
        organizationId={organizationId}
      />
    </div>
  );
}