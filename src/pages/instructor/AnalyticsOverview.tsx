import React from 'react';
// Card imports removed - using OrgCard components
import { OrgCard, OrgCardContent, OrgCardDescription, OrgCardHeader, OrgCardTitle } from '@/components/organizations/OrgCard';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { BarChart3, TrendingUp, Users, BookOpen, Clock, Target, Loader2 } from 'lucide-react';
import { useOrgContext } from '@/components/organizations/OrgContext';
import { useOrgStatistics } from '@/hooks/useOrgStatistics';
import { useOrgAnalytics } from '@/hooks/useOrgAnalytics';

export default function AnalyticsOverview() {
  const { currentOrg } = useOrgContext();
  
  // Fetch real analytics data
  const { data: orgStatistics, isLoading: statsLoading, error: statsError } = useOrgStatistics(currentOrg?.organizations?.id);
  const { analytics: orgAnalytics, isLoading: analyticsLoading, error: analyticsError } = useOrgAnalytics(currentOrg?.organizations?.id);

  if (!currentOrg) {
    return (
      <div className="w-full max-w-6xl mx-auto px-6 py-8">
        <OrgCard>
          <OrgCardContent className="p-8 text-center">
            <p className="text-purple-200">No organization selected</p>
          </OrgCardContent>
        </OrgCard>
      </div>
    );
  }

  // Show loading state
  if (statsLoading || analyticsLoading) {
    return (
      <div className="w-full max-w-6xl mx-auto px-6 py-8">
        <OrgCard>
          <OrgCardContent className="p-8 text-center">
            <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-white" />
            <p className="text-white">Loading analytics...</p>
          </OrgCardContent>
        </OrgCard>
      </div>
    );
  }

  // Show error state
  if (statsError || analyticsError) {
    return (
      <div className="w-full max-w-6xl mx-auto px-6 py-8">
        <OrgCard>
          <OrgCardContent className="p-8 text-center">
            <p className="text-red-300">Error loading analytics data</p>
            <p className="text-white/70 text-sm mt-2">Please try refreshing the page</p>
          </OrgCardContent>
        </OrgCard>
      </div>
    );
  }

  // Use real data from hooks, with fallbacks for empty states
  const analyticsData = {
    totalStudents: orgStatistics?.studentCount || 0,
    activeStudents: orgStatistics?.activeMembers || 0,
    totalCourses: orgStatistics?.totalCourses || 0,
    completionRate: orgStatistics?.completionRate || 0,
    avgSessionTime: 0, // No session time data available yet
    weeklyEngagement: Math.round(orgStatistics?.averageProgress) || 0,
    monthlyProgress: [0, 0, 0, 0, 0, Math.round(orgStatistics?.averageProgress || 0)], // Simplified for now
    topCourses: [] // Will be populated from actual course data in future enhancement
  };

  return (
    <div className="w-full max-w-6xl mx-auto px-6 py-8 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-white drop-shadow-lg">Analytics</h1>
          <p className="text-white/80 mt-2 drop-shadow">
            Monitor your organization's learning performance and engagement
          </p>
        </div>
        <Button variant="outline">
          <BarChart3 className="w-4 h-4 mr-2" />
          Export Report
        </Button>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <OrgCard className="bg-orange-500/65 border-orange-400/50">
          <OrgCardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-white">Total Students</p>
                <p className="text-2xl font-bold text-white">{analyticsData.totalStudents}</p>
              </div>
              <Users className="w-8 h-8 text-white/70" />
            </div>
          </OrgCardContent>
        </OrgCard>

        <OrgCard className="bg-orange-500/65 border-orange-400/50">
          <OrgCardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-white">Active This Week</p>
                <p className="text-2xl font-bold text-white">{analyticsData.activeStudents}</p>
                {analyticsData.activeStudents > 0 ? (
                  <p className="text-xs text-green-300">
                    Students active this week
                  </p>
                ) : (
                  <p className="text-xs text-white/70">
                    No activity this week
                  </p>
                )}
              </div>
              <TrendingUp className="w-8 h-8 text-green-300" />
            </div>
          </OrgCardContent>
        </OrgCard>

        <OrgCard className="bg-orange-500/65 border-orange-400/50">
          <OrgCardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-white">Completion Rate</p>
                <p className="text-2xl font-bold text-white">{analyticsData.completionRate}%</p>
                {analyticsData.completionRate > 0 ? (
                  <p className="text-xs text-blue-300">
                    Overall completion rate
                  </p>
                ) : (
                  <p className="text-xs text-white/70">
                    No completions yet
                  </p>
                )}
              </div>
              <Target className="w-8 h-8 text-blue-300" />
            </div>
          </OrgCardContent>
        </OrgCard>

        <OrgCard className="bg-orange-500/65 border-orange-400/50">
          <OrgCardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-white">Avg Session Time</p>
                <p className="text-2xl font-bold text-white">{analyticsData.avgSessionTime}m</p>
                {analyticsData.avgSessionTime > 0 ? (
                  <p className="text-xs text-white/70">
                    Average session time
                  </p>
                ) : (
                  <p className="text-xs text-white/70">
                    No sessions yet
                  </p>
                )}
              </div>
              <Clock className="w-8 h-8 text-white/70" />
            </div>
          </OrgCardContent>
        </OrgCard>
      </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Progress Trend */}
          <OrgCard className="bg-orange-500/65 border-orange-400/50">
            <OrgCardHeader>
              <OrgCardTitle className="text-white">Learning Progress Trend</OrgCardTitle>
              <OrgCardDescription className="text-white/80">
                Average completion percentage over the last 6 months
              </OrgCardDescription>
            </OrgCardHeader>
            <OrgCardContent>
              <div className="space-y-4">
                <div className="h-48 bg-white/10 rounded-lg flex items-center justify-center">
                  <div className="text-center text-white/70">
                    <BarChart3 className="w-12 h-12 mx-auto mb-2" />
                    {analyticsData.totalStudents > 0 ? (
                      <>
                        <p className="text-sm">Progress Tracking</p>
                        <p className="text-xs">Current progress: {analyticsData.weeklyEngagement}%</p>
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
                    <div className="text-xl font-bold text-white">{analyticsData.weeklyEngagement}%</div>
                  </div>
                  <div>
                    <div className="text-sm text-white/70">Active Students</div>
                    <div className="text-xl font-bold text-white">{analyticsData.activeStudents}</div>
                  </div>
                  <div>
                    <div className="text-sm text-white/70">Total Students</div>
                    <div className="text-xl font-bold text-white">{analyticsData.totalStudents}</div>
                  </div>
                </div>
              </div>
          </OrgCardContent>
        </OrgCard>

          {/* Engagement Metrics */}
          <OrgCard className="bg-orange-500/65 border-orange-400/50">
            <OrgCardHeader>
              <OrgCardTitle className="text-white">Student Engagement</OrgCardTitle>
              <OrgCardDescription className="text-white/80">
                Weekly engagement metrics and activity levels
              </OrgCardDescription>
            </OrgCardHeader>
            <OrgCardContent>
              <div className="space-y-4">
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-white">Weekly Engagement</span>
                    <Badge variant="default" className="bg-white/20 text-white border-white/30">{analyticsData.weeklyEngagement}%</Badge>
                  </div>
                  <div className="w-full bg-white/20 rounded-full h-2">
                    <div 
                      className="bg-purple-400 h-2 rounded-full"
                      style={{ width: `${analyticsData.weeklyEngagement}%` }}
                    />
                  </div>
                </div>
                
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-white">Course Completion</span>
                    <Badge variant="secondary" className="bg-white/20 text-white border-white/30">{analyticsData.completionRate}%</Badge>
                  </div>
                  <div className="w-full bg-white/20 rounded-full h-2">
                    <div 
                      className="bg-green-400 h-2 rounded-full"
                      style={{ width: `${analyticsData.completionRate}%` }}
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
          </OrgCardContent>
        </OrgCard>
      </div>

        {/* Course Performance */}
        <OrgCard className="bg-orange-500/65 border-orange-400/50">
          <OrgCardHeader>
            <OrgCardTitle className="flex items-center gap-2 text-white">
              <BookOpen className="w-5 h-5" />
              Course Performance
            </OrgCardTitle>
            <OrgCardDescription className="text-white/80">
              Enrollment and completion metrics for each course
            </OrgCardDescription>
          </OrgCardHeader>
          <OrgCardContent>
            {analyticsData.totalCourses > 0 ? (
              <div className="space-y-4">
                <div className="text-center p-8 text-white/70">
                  <BookOpen className="w-12 h-12 mx-auto mb-4" />
                  <p className="text-sm">Course performance data will appear here</p>
                  <p className="text-xs">when students start engaging with courses</p>
                </div>
              </div>
            ) : (
              <div className="text-center p-8 text-white/70">
                <BookOpen className="w-12 h-12 mx-auto mb-4" />
                <p className="text-sm">No courses assigned yet</p>
                <p className="text-xs">Assign courses to students to see performance metrics</p>
                <Button variant="outline" className="mt-4 bg-white/10 text-white border-white/30 hover:bg-white/20">
                  Go to Courses
                </Button>
              </div>
            )}
        </OrgCardContent>
      </OrgCard>

        {/* Quick Actions */}
        <OrgCard className="bg-orange-500/65 border-orange-400/50">
          <OrgCardHeader>
            <OrgCardTitle className="text-white">Analytics Actions</OrgCardTitle>
            <OrgCardDescription className="text-white/80">
              Common analytics tasks and reports
            </OrgCardDescription>
          </OrgCardHeader>
          <OrgCardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Button variant="outline" className="h-auto p-4 flex flex-col items-start bg-white/10 text-white border-white/30 hover:bg-white/20">
                <BarChart3 className="w-5 h-5 mb-2" />
                <div className="text-left">
                  <div className="font-medium">Generate Report</div>
                  <div className="text-xs text-white/70">Export detailed analytics</div>
                </div>
              </Button>
              
              <Button variant="outline" className="h-auto p-4 flex flex-col items-start bg-white/10 text-white border-white/30 hover:bg-white/20">
                <TrendingUp className="w-5 h-5 mb-2" />
                <div className="text-left">
                  <div className="font-medium">Performance Insights</div>
                  <div className="text-xs text-white/70">AI-powered recommendations</div>
                </div>
              </Button>
              
              <Button variant="outline" className="h-auto p-4 flex flex-col items-start bg-white/10 text-white border-white/30 hover:bg-white/20">
                <Users className="w-5 h-5 mb-2" />
                <div className="text-left">
                  <div className="font-medium">Student Analytics</div>
                  <div className="text-xs text-white/70">Individual progress tracking</div>
                </div>
              </Button>
            </div>
        </OrgCardContent>
      </OrgCard>
    </div>
  );
}