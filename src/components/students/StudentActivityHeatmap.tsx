import React, { useState } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { OrgButton } from '@/components/org/OrgButton';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { useStudentActivityHeatmap, StudentActivityData } from '@/hooks/useStudentActivityHeatmap';
import { AlertTriangle, CheckCircle, Clock, Zap } from 'lucide-react';
import { cn } from '@/lib/utils';

interface StudentActivityHeatmapProps {
  orgId: string;
  className?: string;
}

export function StudentActivityHeatmap({ orgId, className }: StudentActivityHeatmapProps) {
  const { data: students = [], isLoading, error } = useStudentActivityHeatmap(orgId);
  const [filterStatus, setFilterStatus] = useState<string>('all');

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'border-green-500 bg-green-50 hover:bg-green-100';
      case 'caution':
        return 'border-yellow-500 bg-yellow-50 hover:bg-yellow-100';
      case 'struggling':
        return 'border-red-500 bg-red-50 hover:bg-red-100';
      default:
        return 'border-gray-300 bg-gray-50 hover:bg-gray-100';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active':
        return <CheckCircle className="h-3 w-3 text-green-600" />;
      case 'caution':
        return <Clock className="h-3 w-3 text-yellow-600" />;
      case 'struggling':
        return <AlertTriangle className="h-3 w-3 text-red-600" />;
      default:
        return null;
    }
  };

  const getStatusDescription = (status: string) => {
    switch (status) {
      case 'active':
        return 'Student is actively engaged and making progress';
      case 'caution':
        return 'Student showing some engagement issues - may need attention';
      case 'struggling':
        return 'Student inactive or struggling - intervention recommended';
      default:
        return 'Unknown status';
    }
  };

  const getInitials = (name: string, email: string) => {
    if (name && name !== 'Unnamed Student') {
      return name.split(' ').map(n => n[0]).join('').toUpperCase();
    }
    if (email && email !== 'No email') {
      return email.substring(0, 2).toUpperCase();
    }
    return 'S';
  };

  const formatTimeAgo = (dateString?: string) => {
    if (!dateString) return 'Never';
    
    const date = new Date(dateString);
    const now = new Date();
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 1) return 'Just now';
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`;
    return `${Math.floor(diffInMinutes / 1440)}d ago`;
  };

  const filteredStudents = students.filter(student => {
    if (filterStatus === 'all') return true;
    return student.activity_status === filterStatus;
  });

  const statusCounts = {
    active: students.filter(s => s.activity_status === 'active').length,
    caution: students.filter(s => s.activity_status === 'caution').length,
    struggling: students.filter(s => s.activity_status === 'struggling').length,
  };

  if (isLoading) {
    return (
      <Card className={cn("org-tile", className)}>
        <CardContent className="p-6">
          <div className="flex items-center justify-center h-32">
            <div className="animate-pulse text-muted-foreground">Loading student activity...</div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error || students.length === 0) {
    return (
      <Card className={cn("org-tile", className)}>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Zap className="h-5 w-5" />
            Student Activity Monitor
          </CardTitle>
          <CardDescription>
            {error ? 'Error loading student activity data' : 'No student activity data available'}
          </CardDescription>
        </CardHeader>
      </Card>
    );
  }

  return (
    <Card className={cn("org-tile", className)}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Zap className="h-5 w-5" />
              Student Activity Monitor
            </CardTitle>
            <CardDescription>
              Real-time student engagement status - Green: Active, Yellow: Caution, Red: Needs Help
            </CardDescription>
          </div>
          
          {/* Status Filter Buttons */}
          <div className="flex gap-1">
            <OrgButton
              variant={filterStatus === 'all' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setFilterStatus('all')}
              className="text-xs"
            >
              All ({students.length})
            </OrgButton>
            <OrgButton
              variant={filterStatus === 'active' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setFilterStatus('active')}
              className="text-xs text-green-600 border-green-300 hover:bg-green-50"
            >
              Active ({statusCounts.active})
            </OrgButton>
            <OrgButton
              variant={filterStatus === 'caution' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setFilterStatus('caution')}
              className="text-xs text-yellow-600 border-yellow-300 hover:bg-yellow-50"
            >
              Caution ({statusCounts.caution})
            </OrgButton>
            <OrgButton
              variant={filterStatus === 'struggling' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setFilterStatus('struggling')}
              className="text-xs text-red-600 border-red-300 hover:bg-red-50"
            >
              Help Needed ({statusCounts.struggling})
            </OrgButton>
          </div>
        </div>
      </CardHeader>
      
      <CardContent>
        {filteredStudents.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            No students in the selected status filter
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 xl:grid-cols-10 gap-3">
            <TooltipProvider>
              {filteredStudents.map((student: StudentActivityData) => (
                <Tooltip key={student.student_id}>
                  <TooltipTrigger asChild>
                    <div
                      className={cn(
                        "relative flex flex-col items-center p-3 rounded-lg border-2 transition-all duration-200 cursor-pointer",
                        getStatusColor(student.activity_status)
                      )}
                    >
                      {/* Status indicator */}
                      <div className="absolute -top-1 -right-1 z-10">
                        {getStatusIcon(student.activity_status)}
                      </div>
                      
                      {/* Student avatar */}
                      <Avatar className="h-8 w-8 mb-2">
                        <AvatarImage 
                          src={student.avatar_url} 
                          alt={student.student_name}
                        />
                        <AvatarFallback className="text-xs font-medium">
                          {getInitials(student.student_name, student.student_email)}
                        </AvatarFallback>
                      </Avatar>
                      
                      {/* Student name (truncated) */}
                      <div className="text-xs font-medium text-center w-full truncate">
                        {student.student_name === 'Unnamed Student' 
                          ? student.student_email.split('@')[0] 
                          : student.student_name.split(' ')[0]}
                      </div>
                      
                      {/* Engagement score indicator */}
                      <div className="w-full bg-gray-200 rounded-full h-1 mt-1">
                        <div 
                          className={cn(
                            "h-1 rounded-full transition-all duration-300",
                            student.activity_status === 'active' ? 'bg-green-500' :
                            student.activity_status === 'caution' ? 'bg-yellow-500' : 'bg-red-500'
                          )}
                          style={{ width: `${Math.min(student.engagement_score, 100)}%` }}
                        />
                      </div>
                    </div>
                  </TooltipTrigger>
                  
                  <TooltipContent className="max-w-xs" side="bottom">
                    <div className="space-y-2">
                      <div className="font-semibold flex items-center gap-2">
                        {getStatusIcon(student.activity_status)}
                        {student.student_name}
                      </div>
                      
                      <div className="text-sm text-muted-foreground">
                        {getStatusDescription(student.activity_status)}
                      </div>
                      
                      <div className="space-y-1 text-xs">
                        <div className="flex justify-between">
                          <span>Engagement Score:</span>
                          <Badge variant="outline" className="text-xs">
                            {Math.round(student.engagement_score)}/100
                          </Badge>
                        </div>
                        
                        <div className="flex justify-between">
                          <span>Today's Time:</span>
                          <span className="font-medium">
                            {student.time_spent_today_minutes}min
                          </span>
                        </div>
                        
                        {student.last_activity_at && (
                          <div className="flex justify-between">
                            <span>Last Active:</span>
                            <span className="font-medium">
                              {formatTimeAgo(student.last_activity_at)}
                            </span>
                          </div>
                        )}
                        
                        {student.current_lesson_id && (
                          <div className="flex justify-between">
                            <span>Current Course:</span>
                            <span className="font-medium truncate max-w-20" title={student.current_lesson_id}>
                              {student.current_lesson_id}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  </TooltipContent>
                </Tooltip>
              ))}
            </TooltipProvider>
          </div>
        )}
      </CardContent>
    </Card>
  );
}