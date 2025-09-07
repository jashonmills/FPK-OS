import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Users, UserPlus, Search, Filter, MoreHorizontal } from 'lucide-react';
import { useOrgContext } from '@/components/organizations/OrgContext';
import { useOrgMembers } from '@/hooks/useOrgMembers';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

export default function StudentsManagement() {
  const { currentOrg } = useOrgContext();
  const [searchQuery, setSearchQuery] = useState('');
  const { members, isLoading } = useOrgMembers(searchQuery, 'student');
  
  const students = members.filter(m => m.role === 'student');

  if (!currentOrg) {
    return (
      <div className="container max-w-6xl mx-auto py-8">
        <Card>
          <CardContent className="p-8 text-center">
            <p className="text-muted-foreground">No organization selected</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container max-w-6xl mx-auto py-8 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Students</h1>
          <p className="text-muted-foreground mt-2">
            Manage and monitor your organization's students
          </p>
        </div>
        <Button>
          <UserPlus className="w-4 h-4 mr-2" />
          Invite Students
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4 text-muted-foreground" />
              <span className="text-sm font-medium">Total Students</span>
            </div>
            <div className="text-2xl font-bold mt-2">
              {students.length}
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium">Active This Week</span>
            </div>
            <div className="text-2xl font-bold mt-2 text-green-600">{students.filter(s => {
              const lastActivity = new Date(s.last_activity || s.joined_at);
              const weekAgo = new Date();
              weekAgo.setDate(weekAgo.getDate() - 7);
              return lastActivity >= weekAgo;
            }).length}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium">Average Progress</span>
            </div>
            <div className="text-2xl font-bold mt-2">{students.length > 0 ? Math.round(
              students.reduce((acc, s) => acc + (s.progress || 0), 0) / students.length
            ) : 0}%</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium">Completion Rate</span>
            </div>
            <div className="text-2xl font-bold mt-2">{students.length > 0 ? Math.round(
              students.filter(s => (s.courses_completed || 0) > 0).length / students.length * 100
            ) : 0}%</div>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filters */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input 
                placeholder="Search students..." 
                className="pl-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Button variant="outline">
              <Filter className="w-4 h-4 mr-2" />
              Filters
            </Button>
          </div>
        </CardHeader>
      </Card>

      {/* Students List */}
      <Card>
        <CardHeader>
          <CardTitle>Student Roster</CardTitle>
          <CardDescription>
            Overview of all students in your organization
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {students.map((student) => (
              <div key={student.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                    <span className="text-sm font-semibold text-primary">
                      {(student.full_name || student.display_name || 'User')
                        .split(' ')
                        .map(n => n[0])
                        .join('')
                        .toUpperCase()}
                    </span>
                  </div>
                  <div>
                    <div className="font-medium">{student.full_name || student.display_name || 'Anonymous User'}</div>
                    <div className="text-sm text-muted-foreground">ID: {student.user_id.slice(0, 8)}</div>
                  </div>
                </div>
                
                <div className="flex items-center gap-6">
                  <div className="text-center">
                    <div className="text-sm font-medium">{student.progress || 0}%</div>
                    <div className="text-xs text-muted-foreground">Progress</div>
                  </div>
                  
                  <div className="text-center">
                    <div className="text-sm font-medium">{student.courses_completed || 0}</div>
                    <div className="text-xs text-muted-foreground">Completed</div>
                  </div>
                  
                  <Badge variant={student.status === 'active' ? 'default' : 'secondary'}>
                    {student.status}
                  </Badge>
                  
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm">
                        <MoreHorizontal className="w-4 h-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem>View Profile</DropdownMenuItem>
                      <DropdownMenuItem>View Progress</DropdownMenuItem>
                      <DropdownMenuItem>Send Message</DropdownMenuItem>
                      <DropdownMenuItem>Reset Progress</DropdownMenuItem>
                      <DropdownMenuItem className="text-destructive">
                        Remove Student
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
            ))}
            
            {students.length === 0 && !isLoading && (
              <div className="text-center py-8">
                <Users className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold mb-2">No Students Found</h3>
                <p className="text-muted-foreground mb-4">
                  Invite students to join your organization.
                </p>
                <Button>
                  <UserPlus className="w-4 h-4 mr-2" />
                  Invite Students
                </Button>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}