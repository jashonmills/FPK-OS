import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { 
  Users, 
  Search, 
  MoreHorizontal, 
  UserMinus, 
  BarChart3,
  Calendar,
  BookOpen,
  Target,
  FileText,
  Mail,
  Eye
} from 'lucide-react';
import { useOrgMembers } from '@/hooks/useOrganization';
import { useOrgMemberManagement } from '@/hooks/useOrgMemberManagement';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { format } from 'date-fns';
import InviteLinkManager from './InviteLinkManager';
import type { OrgMember } from '@/types/organization';

interface EnhancedStudentsTabProps {
  organizationId: string;
  organizationName: string;
}

export default function EnhancedStudentsTab({ organizationId, organizationName }: EnhancedStudentsTabProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [studentToRemove, setStudentToRemove] = useState<OrgMember | null>(null);
  
  const navigate = useNavigate();
  const { toast } = useToast();
  const { data: members, isLoading } = useOrgMembers(organizationId);
  const { removeMember } = useOrgMemberManagement(organizationId);

  const students = members?.filter(member => 
    member.role === 'student' && 
    member.status === 'active'
  ) || [];

  const filteredStudents = students.filter(student =>
    student.profiles?.full_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    student.profiles?.display_name?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleRemoveStudent = async () => {
    if (!studentToRemove) return;
    
    try {
      await removeMember(studentToRemove.id);
      toast({
        title: "Student Removed",
        description: `${studentToRemove.profiles?.full_name} has been removed from the organization.`,
      });
      setStudentToRemove(null);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to remove student. Please try again.",
        variant: "destructive"
      });
    }
  };

  const navigateToStudentAnalytics = (studentId: string) => {
    navigate(`/dashboard/instructor/students/${studentId}/progress`);
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="text-center py-8">Loading students...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Invite Link Management */}
      <InviteLinkManager 
        organizationId={organizationId}
        organizationName={organizationName}
      />

      {/* Students Management */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                Students ({filteredStudents.length})
              </CardTitle>
              <CardDescription>
                Manage your students and track their progress
              </CardDescription>
            </div>
            
            <div className="flex items-center gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search students..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 w-64"
                />
              </div>
            </div>
          </div>
        </CardHeader>

        <CardContent>
          {filteredStudents.length === 0 ? (
            <div className="text-center py-12">
              <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium mb-2">No students yet</h3>
              <p className="text-muted-foreground mb-4">
                Create invitation links to add students to your organization
              </p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Student</TableHead>
                  <TableHead>Joined</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredStudents.map((student) => (
                  <TableRow key={student.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar>
                          <AvatarImage src="" alt={student.profiles?.full_name} />
                          <AvatarFallback>
                            {getInitials(student.profiles?.full_name || 'Unknown')}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="font-medium">
                            {student.profiles?.full_name || 'Unknown'}
                          </div>
                          <div className="text-sm text-muted-foreground">
                            {student.profiles?.display_name}
                          </div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                        {student.joined_at 
                          ? format(new Date(student.joined_at), 'MMM d, yyyy')
                          : 'Unknown'
                        }
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant={
                        student.status === 'active' ? 'default' : 
                        student.status === 'paused' ? 'secondary' :
                        'destructive'
                      }>
                        {student.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem 
                            onClick={() => navigateToStudentAnalytics(student.user_id)}
                          >
                            <Eye className="h-4 w-4 mr-2" />
                            View Progress
                          </DropdownMenuItem>
                          
                          <DropdownMenuItem 
                            onClick={() => navigate(`/dashboard/instructor/students/${student.user_id}/courses`)}
                          >
                            <BookOpen className="h-4 w-4 mr-2" />
                            Assign Courses
                          </DropdownMenuItem>
                          
                          <DropdownMenuItem 
                            onClick={() => navigate(`/dashboard/instructor/students/${student.user_id}/goals`)}
                          >
                            <Target className="h-4 w-4 mr-2" />
                            Manage Goals
                          </DropdownMenuItem>
                          
                          <DropdownMenuItem 
                            onClick={() => navigate(`/dashboard/instructor/students/${student.user_id}/notes`)}
                          >
                            <FileText className="h-4 w-4 mr-2" />
                            View Notes
                          </DropdownMenuItem>

                          <DropdownMenuSeparator />
                          
                          <DropdownMenuItem 
                            onClick={() => setStudentToRemove(student)}
                            className="text-destructive"
                          >
                            <UserMinus className="h-4 w-4 mr-2" />
                            Remove Student
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Remove Student Confirmation Dialog */}
      <AlertDialog open={!!studentToRemove} onOpenChange={() => setStudentToRemove(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Remove Student?</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to remove <strong>{studentToRemove?.profiles?.full_name}</strong> from {organizationName}? 
              They will lose access to all assigned courses and their progress will be preserved but inaccessible 
              until they get their own subscription or are re-added to an organization.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleRemoveStudent} className="bg-destructive text-destructive-foreground">
              Remove Student
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}