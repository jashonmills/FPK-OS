import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { OrgCard as Card, OrgCardContent as CardContent, OrgCardDescription as CardDescription, OrgCardHeader as CardHeader, OrgCardTitle as CardTitle } from '@/components/organizations/OrgCard';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { DetailedAnalyticsModal } from '@/components/organizations/DetailedAnalyticsModal';
import { Loader2 } from 'lucide-react';
import { 
  Users, 
  BookOpen, 
  Target, 
  TrendingUp, 
  Calendar,
  Award
} from 'lucide-react';
import { useOrgContext } from '@/components/organizations/OrgContext';
import { useStudentOrgStatistics } from '@/hooks/useStudentOrgStatistics';
import { useComprehensiveOrgAnalytics } from '@/hooks/useComprehensiveOrgAnalytics';
import { OrgLogo } from '@/components/branding/OrgLogo';
import { useOrgBranding } from '@/hooks/useOrgBranding';
import { useEnhancedOrgBranding } from '@/hooks/useEnhancedOrgBranding';

export default function OrgPortalHome() {
  const navigate = useNavigate();
  const { currentOrg } = useOrgContext();
  const { data: branding } = useOrgBranding(currentOrg?.organization_id || null);
  const { data: enhancedBranding } = useEnhancedOrgBranding(currentOrg?.organization_id || null);
  const [showProgressModal, setShowProgressModal] = useState(false);
  const [showDetailedAnalytics, setShowDetailedAnalytics] = useState(false);
  
  // Role-based statistics loading
  const isStudent = currentOrg?.role === 'student';
  const { analytics, isLoading: analyticsLoading, error: analyticsError } = useComprehensiveOrgAnalytics(
    isStudent ? undefined : currentOrg?.organization_id
  );
  const { data: studentStats, isLoading: studentStatsLoading, error: studentStatsError } = useStudentOrgStatistics(
    isStudent ? currentOrg?.organization_id : undefined
  );

  // Use appropriate loading state
  const statsLoading = isStudent ? studentStatsLoading : analyticsLoading;
  const statsError = isStudent ? studentStatsError : analyticsError;

  // Redirect students to their proper portal
  React.useEffect(() => {
    if (currentOrg && isStudent && currentOrg.organizations?.slug) {
      const slug = currentOrg.organizations.slug;
      console.log('🔀 Student detected, redirecting to:', `/${slug}/student-portal`);
      navigate(`/${slug}/student-portal`, { replace: true });
    }
  }, [currentOrg, isStudent, navigate]);

  // Handle no org state AFTER all hooks
  if (!currentOrg) {
    return (
      <div className="w-full max-w-6xl mx-auto px-6 py-8">
        <Card>
          <CardHeader>
            <CardTitle>Welcome to Organizations</CardTitle>
            <CardDescription>
              Join or create an organization to get started.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex space-x-4">
              <Button>Create Organization</Button>
              <Button variant="outline">Join with Code</Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (statsLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (statsError) {
    return (
      <div className="container mx-auto py-8">
        <Card>
          <CardHeader>
            <CardTitle>Error Loading Statistics</CardTitle>
            <CardDescription>
              Unable to load organization statistics. Please try again later.
            </CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }

  // Role-based statistics cards
  const stats = isStudent ? [
    { 
      label: 'My Enrollments', 
      value: (studentStats?.myEnrollments || 0).toString(), 
      icon: BookOpen, 
      color: 'text-blue-600' 
    },
    { 
      label: 'My Progress', 
      value: `${studentStats?.myProgress || 0}%`, 
      icon: TrendingUp, 
      color: 'text-green-600' 
    },
    { 
      label: 'My Goals', 
      value: (studentStats?.myGoals || 0).toString(), 
      icon: Target, 
      color: 'text-purple-600' 
    },
    { 
      label: 'Completed Courses', 
      value: (studentStats?.completedCourses || 0).toString(), 
      icon: Award, 
      color: 'text-orange-600' 
    },
  ] : [
    { 
      label: 'Total Students', 
      value: (analytics?.totalStudents || 0).toString(), 
      icon: Users, 
      color: 'text-blue-600' 
    },
    { 
      label: 'Course Assignments', 
      value: (analytics?.courseAssignments || 0).toString(), 
      icon: BookOpen, 
      color: 'text-green-600' 
    },
    { 
      label: 'Active Goals', 
      value: (analytics?.activeGoals || 0).toString(), 
      icon: Target, 
      color: 'text-purple-600' 
    },
    { 
      label: 'Completion Rate', 
      value: `${analytics?.completionRate || 0}%`, 
      icon: TrendingUp, 
      color: 'text-orange-600' 
    },
  ];

  const recentActivity = isStudent ? (studentStats?.recentActivity || []) : (analytics?.recentActivity || []);

  return (
    <div className="space-y-6">

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <Card key={index} className="bg-orange-500/65 border-orange-400/50">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-white/80">{stat.label}</CardTitle>
              <stat.icon className="h-4 w-4 text-white/70" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">{stat.value}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Progress Overview */}
        <Card className="bg-orange-500/65 border-orange-400/50">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2 text-white">
              <TrendingUp className="h-5 w-5 text-white/70" />
              <span>{isStudent ? 'My Progress' : 'Progress Overview'}</span>
            </CardTitle>
            <CardDescription className="text-white/80">
              {isStudent 
                ? 'Your personal learning progress in this organization'
                : 'Current completion rates across all courses'
              }
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {isStudent && studentStats?.myProgress ? (
              <div className="space-y-3">
                <div className="flex justify-between text-sm text-white/80">
                  <span>Overall Progress</span>
                  <span>{studentStats.myProgress}%</span>
                </div>
                <Progress value={studentStats.myProgress} className="h-2" />
                <div className="grid grid-cols-2 gap-4 text-center">
                  <div>
                    <div className="text-2xl font-bold text-white">{studentStats.myEnrollments}</div>
                    <div className="text-xs text-white/80">Enrolled</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-white">{studentStats.completedCourses}</div>
                    <div className="text-xs text-white/80">Completed</div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-8">
                <TrendingUp className="h-8 w-8 mx-auto text-white/70 mb-2" />
                <p className="text-sm text-white/80">
                  {isStudent ? 'No courses enrolled yet' : 'No progress data available yet'}
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <Card className="bg-orange-500/65 border-orange-400/50">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2 text-white">
              <Calendar className="h-5 w-5 text-white/70" />
              <span>Recent Activity</span>
            </CardTitle>
            <CardDescription className="text-white/80">
              {isStudent 
                ? 'Your recent learning activity'
                : 'Latest updates from your organization'
              }
            </CardDescription>
          </CardHeader>
          <CardContent>
           <div className="space-y-4">
              {recentActivity.length > 0 ? (
                recentActivity.map((activity, index) => (
                  <div key={index} className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-white/70 rounded-full mt-2" />
                     <div className="flex-1 space-y-1">
                       <p className="text-sm font-medium leading-none text-white">
                         {activity.event}
                       </p>
                       <p className="text-sm text-white/80">
                         {new Date(activity.created_at).toLocaleString()}
                       </p>
                     </div>
                  </div>
                ))
              ) : (
                 <div className="text-center py-8">
                   <Calendar className="h-8 w-8 mx-auto text-white/70 mb-2" />
                   <p className="text-sm text-white/80">
                     {isStudent ? 'No recent activity' : 'No recent activity'}
                   </p>
                 </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Analytics Section - Only show for admin/instructors */}
      {!isStudent && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Progress Trend */}
          <Card className="bg-orange-500/65 border-orange-400/50">
            <CardHeader>
              <CardTitle className="text-white">Learning Progress Trend</CardTitle>
              <CardDescription className="text-white/80">
                Average completion percentage over the last 6 months
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="h-48 bg-white/10 rounded-lg flex items-center justify-center">
                  <div className="text-center text-white/70">
                    <TrendingUp className="w-12 h-12 mx-auto mb-2" />
                    {analytics && analytics.totalStudents > 0 ? (
                      <>
                        <p className="text-sm">Progress Tracking</p>
                        <p className="text-xs">Current progress: {Math.round(analytics.averageProgress || 0)}%</p>
                      </>
                    ) : (
                      <>
                        <p className="text-sm">No Progress Data</p>
                        <p className="text-xs">Invite students to see progress trends</p>
                      </>
                    )}
                  </div>
                </div>
                
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div>
                    <div className="text-sm text-white/70">Current Progress</div>
                    <div className="text-xl font-bold text-white">{Math.round(analytics?.averageProgress || 0)}%</div>
                  </div>
                  <div>
                    <div className="text-sm text-white/70">Active Students</div>
                    <div className="text-xl font-bold text-white">{analytics?.activeStudents || 0}</div>
                  </div>
                  <div>
                    <div className="text-sm text-white/70">Total Students</div>
                    <div className="text-xl font-bold text-white">{analytics?.totalStudents || 0}</div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Engagement Metrics */}
          <Card className="bg-orange-500/65 border-orange-400/50">
            <CardHeader>
              <CardTitle className="text-white">Student Engagement</CardTitle>
              <CardDescription className="text-white/80">
                Weekly engagement metrics and activity levels
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-white">Weekly Engagement</span>
                    <Badge variant="default" className="bg-white/20 text-white border-white/30">
                      {Math.round(analytics?.averageProgress || 0)}%
                    </Badge>
                  </div>
                  <div className="w-full bg-white/20 rounded-full h-2">
                    <div 
                      className="bg-purple-400 h-2 rounded-full"
                      style={{ width: `${Math.round(analytics?.averageProgress || 0)}%` }}
                    />
                  </div>
                </div>
                
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-white">Course Completion</span>
                    <Badge variant="secondary" className="bg-white/20 text-white border-white/30">
                      {analytics?.completionRate || 0}%
                    </Badge>
                  </div>
                  <div className="w-full bg-white/20 rounded-full h-2">
                    <div 
                      className="bg-green-400 h-2 rounded-full"
                      style={{ width: `${analytics?.completionRate || 0}%` }}
                    />
                  </div>
                </div>
                
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-white">Assignment Submission</span>
                    <Badge variant="outline" className="bg-white/20 text-white border-white/30">0%</Badge>
                  </div>
                  <div className="w-full bg-white/20 rounded-full h-2">
                    <div 
                      className="bg-blue-400 h-2 rounded-full"
                      style={{ width: '0%' }}
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Quick Actions */}
      <Card className="bg-orange-500/65 border-orange-400/50">
        <CardHeader>
          <CardTitle className="text-white">Quick Actions</CardTitle>
          <CardDescription className="text-white/80">
            {isStudent 
              ? 'Common tasks for your learning'
              : 'Common tasks for organization management'
            }
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-4">
            {isStudent ? (
              <>
                <Button 
                  className="flex items-center space-x-2 bg-white/20 hover:bg-white/30 text-white border-white/30"
                  onClick={() => navigate(`/org/${currentOrg?.organization_id}/courses`)}
                >
                  <BookOpen className="h-4 w-4" />
                  <span>View My Courses</span>
                </Button>
                <Button 
                  variant="outline" 
                  className="flex items-center space-x-2 border-border text-foreground hover:bg-accent"
                  onClick={() => navigate(`/org/${currentOrg?.organization_id}/goals-notes`)}
                >
                  <Target className="h-4 w-4" />
                  <span>My Goals</span>
                </Button>
                <Button 
                  variant="outline" 
                  className="flex items-center space-x-2 border-border text-foreground hover:bg-accent"
                  onClick={() => setShowProgressModal(true)}
                >
                  <TrendingUp className="h-4 w-4" />
                  <span>My Progress</span>
                </Button>
              </>
            ) : (
              <>
                <Button 
                  variant="outline" 
                  className="flex items-center space-x-2 border-border text-foreground hover:bg-accent"
                  onClick={() => navigate(`/org/${currentOrg?.organization_id}/courses`)}
                >
                  <BookOpen className="h-4 w-4" />
                  <span>Assign Course</span>
                </Button>
                <Button 
                  variant="outline" 
                  className="flex items-center space-x-2 border-border text-foreground hover:bg-accent"
                  onClick={() => navigate(`/org/${currentOrg?.organization_id}/goals-notes`)}
                >
                  <Target className="h-4 w-4" />
                  <span>Create Goal</span>
                </Button>
              </>
            )}
          </div>
        </CardContent>
      </Card>

      {/* My Progress Modal */}
      <Dialog open={showProgressModal} onOpenChange={setShowProgressModal}>
        <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              My Learning Progress
            </DialogTitle>
            <DialogDescription>
              Your personal learning progress in this organization
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-6 mt-4">
            {/* Overview Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="p-4 rounded-lg bg-muted">
                <div className="text-2xl font-bold">{studentStats?.myEnrollments || 0}</div>
                <div className="text-sm text-muted-foreground">Enrollments</div>
              </div>
              <div className="p-4 rounded-lg bg-muted">
                <div className="text-2xl font-bold">{studentStats?.completedCourses || 0}</div>
                <div className="text-sm text-muted-foreground">Completed</div>
              </div>
              <div className="p-4 rounded-lg bg-muted">
                <div className="text-2xl font-bold">{studentStats?.myGoals || 0}</div>
                <div className="text-sm text-muted-foreground">Active Goals</div>
              </div>
              <div className="p-4 rounded-lg bg-muted">
                <div className="text-2xl font-bold">{Math.round(studentStats?.myProgress || 0)}%</div>
                <div className="text-sm text-muted-foreground">Avg Progress</div>
              </div>
            </div>

            {/* Overall Progress */}
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="font-medium">Overall Progress</span>
                <span className="text-muted-foreground">{Math.round(studentStats?.myProgress || 0)}%</span>
              </div>
              <Progress value={studentStats?.myProgress || 0} className="h-2" />
            </div>

            {/* Course Progress Details */}
            {studentStats?.myEnrollments > 0 ? (
              <div className="space-y-3">
                <h3 className="font-semibold text-sm">Course Details</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between py-2 border-b">
                    <span className="text-muted-foreground">Total Courses</span>
                    <span className="font-medium">{studentStats.myEnrollments}</span>
                  </div>
                  <div className="flex justify-between py-2 border-b">
                    <span className="text-muted-foreground">In Progress</span>
                    <span className="font-medium">
                      {(studentStats.myEnrollments || 0) - (studentStats.completedCourses || 0)}
                    </span>
                  </div>
                  <div className="flex justify-between py-2 border-b">
                    <span className="text-muted-foreground">Completed</span>
                    <span className="font-medium">{studentStats.completedCourses}</span>
                  </div>
                  <div className="flex justify-between py-2">
                    <span className="text-muted-foreground">Active Goals</span>
                    <span className="font-medium">{studentStats.myGoals}</span>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                <BookOpen className="h-12 w-12 mx-auto mb-3 opacity-50" />
                <p>No courses enrolled yet</p>
                <p className="text-sm mt-2">Start by viewing available courses</p>
                <Button 
                  className="mt-4"
                  onClick={() => {
                    setShowProgressModal(false);
                    navigate(`/org/${currentOrg?.organization_id}/courses`);
                  }}
                >
                  View Courses
                </Button>
              </div>
            )}

            {/* Quick Actions */}
            <div className="flex gap-2 pt-4 border-t">
              <Button 
                variant="outline" 
                className="flex-1"
                onClick={() => {
                  setShowProgressModal(false);
                  navigate(`/org/${currentOrg?.organization_id}/courses`);
                }}
              >
                <BookOpen className="h-4 w-4 mr-2" />
                My Courses
              </Button>
              <Button 
                variant="outline" 
                className="flex-1"
                onClick={() => {
                  setShowProgressModal(false);
                  setShowDetailedAnalytics(true);
                }}
              >
                <TrendingUp className="h-4 w-4 mr-2" />
                Detailed Analytics
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Detailed Analytics Modal */}
      {isStudent && currentOrg?.organization_id && (
        <DetailedAnalyticsModal 
          open={showDetailedAnalytics}
          onOpenChange={setShowDetailedAnalytics}
          organizationId={currentOrg.organization_id}
        />
      )}
    </div>
  );
}