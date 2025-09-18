import React, { useState } from 'react';
import { useOrgContext } from '@/components/organizations/OrgContext';
import { supabase } from '@/integrations/supabase/client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
// Card imports removed - using OrgCard components
import { OrgCard, OrgCardContent, OrgCardDescription, OrgCardHeader, OrgCardTitle } from '@/components/organizations/OrgCard';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { 
  Users, 
  UserPlus, 
  Search, 
  MoreHorizontal, 
  Trash2, 
  Eye,
  Mail,
  Calendar,
  BookOpen,
  Target
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { DebugInviteDialog } from '@/components/org/DebugInviteDialog';
import { assertOrg } from '@/lib/org/context';
import { useNavigate } from 'react-router-dom';

interface OrgMember {
  id: string;
  org_id: string;
  user_id: string;
  role: string;
  status: string;
  created_at: string;
  profiles: {
    id: string;
    email: string;
    full_name?: string;
    avatar_url?: string;
  };
}

export default function StudentsPage() {
  const { currentOrg, getUserRole } = useOrgContext();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const userRole = getUserRole();
  const orgId = assertOrg();
  
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStudent, setSelectedStudent] = useState<OrgMember | null>(null);
  const [showInviteDialog, setShowInviteDialog] = useState(false);

  // Fetch organization members
  const { data: members = [], isLoading } = useQuery({
    queryKey: ['org-members', orgId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('org_members')
        .select('*')
        .eq('org_id', orgId)
        .eq('status', 'active')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching org members:', error);
        throw error;
      }

      // For now, return basic member data without profiles
      return data.map(member => ({
        ...member,
        profiles: {
          id: member.user_id,
          email: 'user@example.com',
          full_name: 'User Name',
          avatar_url: undefined
        }
      })) as OrgMember[];
    },
    staleTime: 1000 * 60 * 2,
  });

  // Remove member mutation
  const removeMemberMutation = useMutation({
    mutationFn: async (userId: string) => {
      const { error } = await supabase
        .from('org_members')
        .delete()
        .eq('org_id', orgId)
        .eq('user_id', userId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['org-members'] });
      toast({
        title: "Success",
        description: "Member removed from organization.",
      });
    },
    onError: (error) => {
      console.error('Error removing member:', error);
      toast({
        title: "Error",
        description: "Failed to remove member.",
        variant: "destructive",
      });
    },
  });

  if (!currentOrg) {
    return (
      <div className="container mx-auto p-6">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">No Organization Selected</h1>
          <p className="text-muted-foreground">Please select an organization to view students.</p>
        </div>
      </div>
    );
  }

  const canManageMembers = userRole === 'owner' || userRole === 'instructor';
  const students = members.filter(member => member.role === 'student');
  const instructors = members.filter(member => member.role === 'instructor');
  
  // Debug logging
  console.log('StudentsPage render - showInviteDialog state:', showInviteDialog);
  console.log('StudentsPage render - canManageMembers:', canManageMembers);
  console.log('StudentsPage render - userRole:', userRole);
  
  const filteredStudents = students.filter(student => 
    student.profiles?.full_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    student.profiles?.email?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getInitials = (name?: string, email?: string) => {
    if (name) {
      return name.split(' ').map(n => n[0]).join('').toUpperCase();
    }
    if (email) {
      return email.substring(0, 2).toUpperCase();
    }
    return 'U';
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Users className="h-8 w-8" />
          <div>
            <h1 className="text-3xl font-bold text-white drop-shadow-lg">Students</h1>
          <p className="text-white/80 drop-shadow">
            {filteredStudents.length} students in organization
          </p>
          </div>
        </div>
        
        {canManageMembers && (
          <Button 
            className="flex items-center gap-2"
            onClick={() => {
              console.log('Invite button clicked - setting showInviteDialog to true');
              setShowInviteDialog(true);
            }}
          >
            <UserPlus className="h-4 w-4" />
            Invite Students
          </Button>
        )}
      </div>

      {/* Stats Cards */}
      <div className="grid md:grid-cols-3 gap-4">
        <OrgCard className="bg-orange-500/65 border-orange-400/50">
          <OrgCardHeader className="pb-2">
            <OrgCardTitle className="text-sm font-medium text-white">Total Students</OrgCardTitle>
          </OrgCardHeader>
          <OrgCardContent>
            <div className="text-2xl font-bold text-white">{students.length}</div>
            <p className="text-xs text-white/80">
              Active students
            </p>
          </OrgCardContent>
        </OrgCard>
        
        <OrgCard>
          <OrgCardHeader className="pb-2">
            <OrgCardTitle className="text-sm font-medium text-purple-100">Instructors</OrgCardTitle>
          </OrgCardHeader>
          <OrgCardContent>
            <div className="text-2xl font-bold text-white">{instructors.length}</div>
            <p className="text-xs text-purple-200">
              Active instructors
            </p>
          </OrgCardContent>
        </OrgCard>
        
        <OrgCard>
          <OrgCardHeader className="pb-2">
            <OrgCardTitle className="text-sm font-medium text-purple-100">Active Members</OrgCardTitle>
          </OrgCardHeader>
          <OrgCardContent>
            <div className="text-2xl font-bold text-white">{members.length}</div>
            <p className="text-xs text-purple-200">All roles combined</p>
          </OrgCardContent>
        </OrgCard>
      </div>

      {/* Search Bar */}
      <div className="flex items-center gap-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search students..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 bg-transparent border-white/20 text-white placeholder:text-white/60"
          />
        </div>
      </div>

      {/* Students List */}
      <OrgCard>
        <OrgCardHeader>
          <OrgCardTitle className="text-white">Student Roster</OrgCardTitle>
          <OrgCardDescription className="text-purple-200">Manage your organization's students</OrgCardDescription>
        </OrgCardHeader>
        <OrgCardContent>
          {isLoading ? (
            <div className="text-center py-8">
              <p className="text-muted-foreground">Loading students...</p>
            </div>
          ) : filteredStudents.length === 0 ? (
            <div className="text-center py-8">
              <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">No Students Found</h3>
              <p className="text-muted-foreground mb-4">
                {searchQuery ? 'No students match your search.' : 'Start by inviting students to your organization.'}
              </p>
              {canManageMembers && !searchQuery && (
                <Button onClick={() => {
                  console.log('Invite button (empty state) clicked - setting showInviteDialog to true');
                  setShowInviteDialog(true);
                }}>
                  <UserPlus className="h-4 w-4 mr-2" />
                  Invite Students
                </Button>
              )}
            </div>
          ) : (
            <div className="space-y-4">
              {filteredStudents.map((student) => (
                <div key={student.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <Avatar>
                      <AvatarImage src={student.profiles?.avatar_url} />
                      <AvatarFallback>
                        {getInitials(student.profiles?.full_name, student.profiles?.email)}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="font-medium">
                        {student.profiles?.full_name || 'Unnamed User'}
                      </div>
                      <div className="text-sm text-muted-foreground flex items-center gap-1">
                        <Mail className="h-3 w-3" />
                        {student.profiles?.email}
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Badge variant="secondary">{student.role}</Badge>
                    <Badge variant="outline" className="text-xs">
                      <Calendar className="h-3 w-3 mr-1" />
                      {new Date(student.created_at).toLocaleDateString()}
                    </Badge>
                    
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm" className="bg-transparent hover:bg-white/10">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 z-50">
                        <DropdownMenuItem onClick={() => setSelectedStudent(student)}>
                          <Eye className="h-4 w-4 mr-2" />
                          View Progress
                        </DropdownMenuItem>
                        {canManageMembers && (
                          <DropdownMenuItem
                            onClick={() => removeMemberMutation.mutate(student.user_id)}
                            className="text-destructive"
                          >
                            <Trash2 className="h-4 w-4 mr-2" />
                            Remove from Org
                          </DropdownMenuItem>
                        )}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
              ))}
            </div>
          )}
        </OrgCardContent>
      </OrgCard>

      {/* Student Detail Sheet */}
      <Sheet open={!!selectedStudent} onOpenChange={() => setSelectedStudent(null)}>
        <SheetContent className="w-[400px] sm:w-[540px]">
          <SheetHeader>
            <SheetTitle className="flex items-center gap-2">
              <Avatar>
                <AvatarImage src={selectedStudent?.profiles?.avatar_url} />
                <AvatarFallback>
                  {getInitials(selectedStudent?.profiles?.full_name, selectedStudent?.profiles?.email)}
                </AvatarFallback>
              </Avatar>
              {selectedStudent?.profiles?.full_name || 'Student Details'}
            </SheetTitle>
            <SheetDescription>
              View student progress and activity
            </SheetDescription>
          </SheetHeader>
          
          {selectedStudent && (
            <div className="mt-6 space-y-6">
              <div>
                <h3 className="font-semibold mb-3">Contact Information</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2">
                    <Mail className="h-4 w-4 text-muted-foreground" />
                    {selectedStudent.profiles?.email}
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    Joined {new Date(selectedStudent.created_at).toLocaleDateString()}
                  </div>
                </div>
              </div>
              
              <div>
                <h3 className="font-semibold mb-3 flex items-center gap-2">
                  <BookOpen className="h-4 w-4" />
                  Course Progress
                </h3>
                <div className="space-y-3">
                  <div className="p-3 bg-muted/50 rounded-lg">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm font-medium">Introduction to Programming</span>
                      <Badge variant="secondary">85%</Badge>
                    </div>
                    <div className="w-full bg-background rounded-full h-2">
                      <div className="bg-primary h-2 rounded-full" style={{ width: '85%' }}></div>
                    </div>
                  </div>
                  <div className="p-3 bg-muted/50 rounded-lg">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm font-medium">Web Development Basics</span>
                      <Badge variant="default">100%</Badge>
                    </div>
                    <div className="w-full bg-background rounded-full h-2">
                      <div className="bg-green-500 h-2 rounded-full" style={{ width: '100%' }}></div>
                    </div>
                  </div>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => navigate(`/dashboard/instructor/students/${selectedStudent?.user_id}/progress`)}
                    className="w-full mt-3"
                  >
                    <Eye className="h-4 w-4 mr-2" />
                    View Detailed Progress
                  </Button>
                </div>
              </div>
              
              <div>
                <h3 className="font-semibold mb-3 flex items-center gap-2">
                  <Target className="h-4 w-4" />
                  Active Goals
                </h3>
                <div className="space-y-2">
                  <div className="flex items-center justify-between p-2 bg-muted/30 rounded">
                    <span className="text-sm">Complete Programming Fundamentals</span>
                    <Badge variant="secondary">75%</Badge>
                  </div>
                  <div className="flex items-center justify-between p-2 bg-muted/30 rounded">
                    <span className="text-sm">Build First Web Application</span>
                    <Badge variant="outline">30%</Badge>
                  </div>
                </div>
              </div>
            </div>
          )}
        </SheetContent>
      </Sheet>

      {/* Invite Dialog */}
      <DebugInviteDialog 
        open={showInviteDialog}
        onOpenChange={(open) => {
          console.log('DebugInviteDialog onOpenChange called with:', open);
          setShowInviteDialog(open);
        }}
        organizationId={orgId}
      />
      
      {/* Debug indicator */}
      {showInviteDialog && (
        <div className="fixed top-4 right-4 z-[102] bg-green-500 text-white px-4 py-2 rounded-lg shadow-lg">
          Dialog State: OPEN
        </div>
      )}
    </div>
  );
}