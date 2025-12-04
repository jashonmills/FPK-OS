import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
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
import { useOrgMembers } from '@/hooks/useOrganization';
import { useOrgMemberManagement } from '@/hooks/useOrgMemberManagement';
import { useEmailInvitation } from '@/hooks/useInvitationSystem';
import type { MemberStatus } from '@/types/organization';

interface StudentsTabProps {
  organizationId: string;
}

export default function StudentsTab({ organizationId }: StudentsTabProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const { toast } = useToast();
  const navigate = useNavigate();
  const emailInviteMutation = useEmailInvitation();
  
  const { data: members, isLoading, refetch } = useOrgMembers(organizationId);
  const { removeMember, isRemoving } = useOrgMemberManagement();

  const students = members?.filter(m => m.role === 'student') || [];
  const activeStudents = students.filter(s => s.status === 'active');

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

  const handleViewProgress = (studentId: string, studentName: string) => {
    // Navigate to student analytics/progress page
    navigate(`/org/${organizationId}/analytics/students/${studentId}`);
  };

  const handleSendMessage = (studentId: string, studentName: string) => {
    // Navigate to messaging with student pre-selected
    navigate(`/org/${organizationId}/messages?newConversation=${studentId}`);
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
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={() => refetch()}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
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
                        {/* Feature implementation: Add last active tracking */}
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
                          <DropdownMenuItem onClick={() => handleViewProgress(student.user_id, student.profiles?.display_name || student.profiles?.full_name || 'Unknown User')}>
                            <Eye className="h-4 w-4 mr-2" />
                            View Progress
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleSendMessage(student.user_id, student.profiles?.display_name || student.profiles?.full_name || 'Unknown User')}>
                            <MessageSquare className="h-4 w-4 mr-2" />
                            Send Message
                          </DropdownMenuItem>
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
    </div>
  );
}