import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
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
  UserX
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
import { useOrgMembers, useOrgInvitations, useRemoveMember } from '@/hooks/useOrganization';
import InviteStudentDialog from './InviteStudentDialog';
import type { MemberStatus } from '@/types/organization';

interface StudentsTabProps {
  organizationId: string;
}

export default function StudentsTab({ organizationId }: StudentsTabProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [showInviteDialog, setShowInviteDialog] = useState(false);
  
  const { data: members, isLoading } = useOrgMembers(organizationId);
  const { data: invitations } = useOrgInvitations(organizationId);
  const removeMemberMutation = useRemoveMember();

  const students = members?.filter(m => m.role === 'student') || [];
  const activeStudents = students.filter(s => s.status === 'active');
  const pendingInvitations = invitations?.filter(i => i.status === 'pending') || [];

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

  const handleRemoveStudent = async (memberId: string) => {
    if (confirm('Are you sure you want to remove this student? They will lose access to the organization.')) {
      await removeMemberMutation.mutateAsync({ memberId, orgId: organizationId });
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
        
        <Button onClick={() => setShowInviteDialog(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Invite Students
        </Button>
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
                      {invitation.email || `Code: ${invitation.invitation_code}`}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      Expires {new Date(invitation.expires_at).toLocaleDateString()}
                    </div>
                  </div>
                  <Badge variant="secondary">Pending</Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

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
                          {student.profiles?.display_name || student.profiles?.full_name || 'Unknown'}
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
                          <DropdownMenuItem>
                            <Eye className="h-4 w-4 mr-2" />
                            View Progress
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <MessageSquare className="h-4 w-4 mr-2" />
                            Send Message
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          {student.status === 'active' && (
                            <DropdownMenuItem>
                              <UserX className="h-4 w-4 mr-2" />
                              Pause Access
                            </DropdownMenuItem>
                          )}
                          {student.status === 'paused' && (
                            <DropdownMenuItem>
                              <UserCheck className="h-4 w-4 mr-2" />
                              Resume Access
                            </DropdownMenuItem>
                          )}
                          <DropdownMenuSeparator />
                          <DropdownMenuItem 
                            className="text-destructive"
                            onClick={() => handleRemoveStudent(student.id)}
                          >
                            <UserMinus className="h-4 w-4 mr-2" />
                            Remove Student
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

      <InviteStudentDialog
        open={showInviteDialog}
        onOpenChange={setShowInviteDialog}
        organizationId={organizationId}
      />
    </div>
  );
}