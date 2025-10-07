import React from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { MoreHorizontal, Mail, Edit, Trash2, UserCheck, Eye, Link2 } from 'lucide-react';
import { OrgStudent } from '@/hooks/useOrgStudents';
import { format, parseISO } from 'date-fns';

interface StudentsTableProps {
  students: OrgStudent[];
  onEditStudent: (student: OrgStudent) => void;
  onDeleteStudent: (studentId: string) => void;
  onSendInvite: (student: OrgStudent) => void;
  onGenerateActivationLink: (student: OrgStudent) => void;
}

export function StudentsTable({
  students,
  onEditStudent,
  onDeleteStudent,
  onSendInvite,
  onGenerateActivationLink,
}: StudentsTableProps) {
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(part => part[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const getStatusBadge = (status: string, hasLinkedUser: boolean, activationStatus?: string) => {
    if (hasLinkedUser) {
      return <Badge variant="default" className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100">Active Account</Badge>;
    }
    
    if (activationStatus === 'pending') {
      return <Badge variant="outline" className="bg-yellow-50 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-200">Activation Pending</Badge>;
    }
    
    if (activationStatus === 'expired') {
      return <Badge variant="outline" className="bg-orange-50 text-orange-800 dark:bg-orange-900/20 dark:text-orange-200">Link Expired</Badge>;
    }
    
    switch (status) {
      case 'active':
        return <Badge variant="secondary">Profile Only</Badge>;
      case 'inactive':
        return <Badge variant="destructive">Inactive</Badge>;
      case 'graduated':
        return <Badge variant="outline">Graduated</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  if (students.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-muted-foreground mb-4">No students found</div>
        <p className="text-sm text-muted-foreground">
          Add students manually or invite them to join your organization.
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Student</TableHead>
            <TableHead>Grade</TableHead>
            <TableHead>Student ID</TableHead>
            <TableHead>Parent Email</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Added</TableHead>
            <TableHead className="w-[50px]"></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {students.map((student) => (
            <TableRow key={student.id}>
              <TableCell>
                <div className="flex items-center space-x-3">
                  <Avatar className="h-8 w-8">
                    <AvatarFallback className="text-xs">
                      {getInitials(student.full_name)}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="font-medium">{student.full_name}</div>
                    {student.date_of_birth && (
                      <div className="text-sm text-muted-foreground">
                        Born {format(parseISO(student.date_of_birth), 'MMM d, yyyy')}
                      </div>
                    )}
                  </div>
                </div>
              </TableCell>
              <TableCell>
                {student.grade_level || <span className="text-muted-foreground">-</span>}
              </TableCell>
              <TableCell>
                {student.student_id || <span className="text-muted-foreground">-</span>}
              </TableCell>
              <TableCell>
                {student.parent_email || <span className="text-muted-foreground">-</span>}
              </TableCell>
              <TableCell>
                {getStatusBadge(student.status, !!student.linked_user_id, student.activation_status)}
              </TableCell>
              <TableCell className="text-sm text-muted-foreground">
                {format(parseISO(student.created_at), 'MMM d, yyyy')}
              </TableCell>
              <TableCell>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => window.location.href = `/org/${student.org_id}/students/${student.id}`}>
                        <Eye className="h-4 w-4 mr-2" />
                        View Profile
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => onEditStudent(student)}>
                        <Edit className="h-4 w-4 mr-2" />
                        Edit Profile
                      </DropdownMenuItem>
                    {!student.linked_user_id && (
                      <DropdownMenuItem onClick={() => onGenerateActivationLink(student)}>
                        <Link2 className="h-4 w-4 mr-2" />
                        Generate Activation Link
                      </DropdownMenuItem>
                    )}
                    {student.parent_email && !student.linked_user_id && (
                      <DropdownMenuItem onClick={() => onSendInvite(student)}>
                        <Mail className="h-4 w-4 mr-2" />
                        Send Invite
                      </DropdownMenuItem>
                    )}
                    {student.linked_user_id && (
                      <DropdownMenuItem disabled>
                        <UserCheck className="h-4 w-4 mr-2" />
                        Account Linked
                      </DropdownMenuItem>
                    )}
                    <DropdownMenuItem
                      onClick={() => onDeleteStudent(student.id)}
                      className="text-destructive"
                    >
                      <Trash2 className="h-4 w-4 mr-2" />
                      Remove Student
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}