import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { OrgCard, OrgCardContent, OrgCardDescription, OrgCardHeader, OrgCardTitle } from '@/components/organizations/OrgCard';
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
        <OrgCard>
          <OrgCardContent className="p-8 text-center">
            <p className="text-purple-200">No organization selected</p>
          </OrgCardContent>
        </OrgCard>
      </div>
    );
  }

  return (
    <div className="container max-w-6xl mx-auto py-8 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-white drop-shadow-lg">Students</h1>
          <p className="text-white/80 mt-2 drop-shadow">
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
        <OrgCard className="bg-orange-500/65 border-orange-400/50">
          <OrgCardContent className="p-6">
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4 text-white/70" />
              <span className="text-sm font-medium text-white">Total Students</span>
            </div>
            <div className="text-2xl font-bold mt-2 text-white">
              {students.length}
            </div>
          </OrgCardContent>
        </OrgCard>
        
        <OrgCard className="bg-orange-500/65 border-orange-400/50">
          <OrgCardContent className="p-6">
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-white">Active This Week</span>
            </div>
            <div className="text-2xl font-bold mt-2 text-green-300">{students.filter(s => {
              const lastActivity = new Date(s.last_activity || s.joined_at);
              const weekAgo = new Date();
              weekAgo.setDate(weekAgo.getDate() - 7);
              return lastActivity >= weekAgo;
            }).length}</div>
          </OrgCardContent>
        </OrgCard>
        
        <OrgCard className="bg-orange-500/65 border-orange-400/50">
          <OrgCardContent className="p-6">
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-white">Average Progress</span>
            </div>
            <div className="text-2xl font-bold mt-2 text-white">{students.length > 0 ? Math.round(
              students.reduce((acc, s) => acc + (s.progress || 0), 0) / students.length
            ) : 0}%</div>
          </OrgCardContent>
        </OrgCard>
        
        <OrgCard className="bg-orange-500/65 border-orange-400/50">
          <OrgCardContent className="p-6">
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-white">Completion Rate</span>
            </div>
            <div className="text-2xl font-bold mt-2 text-white">{students.length > 0 ? Math.round(
              students.filter(s => (s.courses_completed || 0) > 0).length / students.length * 100
            ) : 0}%</div>
          </OrgCardContent>
        </OrgCard>
      </div>

      {/* Search and Filters */}
      <OrgCard className="bg-orange-500/65 border-orange-400/50">
        <OrgCardHeader>
          <div className="flex items-center gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-white/70" />
              <Input 
                placeholder="Search students..." 
                className="pl-10 bg-white/20 border-white/30 text-white placeholder:text-white/70"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Button variant="outline" className="border-white/30 text-white hover:bg-white/20">
              <Filter className="w-4 h-4 mr-2" />
              Filters
            </Button>
          </div>
        </OrgCardHeader>
      </OrgCard>

      {/* Students List */}
      <OrgCard className="bg-orange-500/65 border-orange-400/50">
        <OrgCardHeader>
          <OrgCardTitle className="text-white">Student Roster</OrgCardTitle>
          <OrgCardDescription className="text-white/80">
            Overview of all students in your organization
          </OrgCardDescription>
        </OrgCardHeader>
        <OrgCardContent>
          <div className="space-y-4">
            {students.map((student) => (
              <div key={student.id} className="flex items-center justify-between p-4 border rounded-lg border-white/20 bg-white/10">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                    <span className="text-sm font-semibold text-white">
                      {(student.full_name || student.display_name || 'User')
                        .split(' ')
                        .map(n => n[0])
                        .join('')
                        .toUpperCase()}
                    </span>
                  </div>
                  <div>
                    <div className="font-medium text-white">{student.full_name || student.display_name || 'Anonymous User'}</div>
                    <div className="text-sm text-white/70">ID: {student.user_id.slice(0, 8)}</div>
                  </div>
                </div>
                
                <div className="flex items-center gap-6">
                  <div className="text-center">
                    <div className="text-sm font-medium text-white">{student.progress || 0}%</div>
                    <div className="text-xs text-white/70">Progress</div>
                  </div>
                  
                  <div className="text-center">
                    <div className="text-sm font-medium text-white">{student.courses_completed || 0}</div>
                    <div className="text-xs text-white/70">Completed</div>
                  </div>
                  
                  <Badge variant={student.status === 'active' ? 'default' : 'secondary'} className="bg-white/20 text-white border-white/30">
                    {student.status}
                  </Badge>
                  
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm" className="text-white hover:bg-white/20">
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
                <Users className="h-12 w-12 mx-auto text-white/70 mb-4" />
                <h3 className="text-lg font-semibold mb-2 text-white">No Students Found</h3>
                <p className="text-white/80 mb-4">
                  Invite students to join your organization.
                </p>
                <Button className="bg-white/20 hover:bg-white/30 text-white border-white/30">
                  <UserPlus className="w-4 h-4 mr-2" />
                  Invite Students
                </Button>
              </div>
            )}
          </div>
        </OrgCardContent>
      </OrgCard>
    </div>
  );
}