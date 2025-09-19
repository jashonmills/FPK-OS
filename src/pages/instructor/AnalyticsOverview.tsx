import React from 'react';
// Card imports removed - using OrgCard components
import { OrgCard, OrgCardContent, OrgCardDescription, OrgCardHeader, OrgCardTitle } from '@/components/organizations/OrgCard';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { BarChart3, TrendingUp, Users, BookOpen, Clock, Target } from 'lucide-react';
import { useOrgContext } from '@/components/organizations/OrgContext';

export default function AnalyticsOverview() {
  const { currentOrg } = useOrgContext();

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

  // Mock analytics data for demonstration
  const analyticsData = {
    totalStudents: 12,
    activeStudents: 10,
    totalCourses: 3,
    completionRate: 78,
    avgSessionTime: 32,
    weeklyEngagement: 85,
    monthlyProgress: [65, 72, 78, 85, 82, 78],
    topCourses: [
      { title: 'Introduction to Learning State', enrollments: 12, completion: 85 },
      { title: 'Emotional Intelligence Basics', enrollments: 8, completion: 70 },
      { title: 'Advanced Study Techniques', enrollments: 0, completion: 0 }
    ]
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
                <p className="text-xs text-green-300">
                  +12% from last week
                </p>
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
                <p className="text-xs text-blue-300">
                  +5% from last month
                </p>
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
                <p className="text-xs text-white/70">
                  +3m from last week
                </p>
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
                    <p className="text-sm">Progress Chart Placeholder</p>
                    <p className="text-xs">Monthly trend: {analyticsData.monthlyProgress.join('% → ')}%</p>
                  </div>
                </div>
                
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div>
                    <div className="text-sm text-white/70">This Month</div>
                    <div className="text-xl font-bold text-white">{analyticsData.monthlyProgress[analyticsData.monthlyProgress.length - 1]}%</div>
                  </div>
                  <div>
                    <div className="text-sm text-white/70">Last Month</div>
                    <div className="text-xl font-bold text-white">{analyticsData.monthlyProgress[analyticsData.monthlyProgress.length - 2]}%</div>
                  </div>
                  <div>
                    <div className="text-sm text-white/70">Avg Growth</div>
                    <div className="text-xl font-bold text-green-300">+3.2%</div>
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
                    <Badge variant="outline" className="bg-white/20 text-white border-white/30">74%</Badge>
                  </div>
                  <div className="w-full bg-white/20 rounded-full h-2">
                    <div 
                      className="bg-blue-400 h-2 rounded-full"
                      style={{ width: '74%' }}
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
            <div className="space-y-4">
              {analyticsData.topCourses.map((course, index) => (
                <div key={index} className="flex items-center justify-between p-4 border border-white/20 rounded-lg bg-white/10">
                  <div className="flex-1">
                    <h4 className="font-medium text-white">{course.title}</h4>
                    <div className="flex items-center gap-4 mt-2 text-sm text-white/70">
                      <span>{course.enrollments} enrollments</span>
                      <span>{course.completion}% completion rate</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <div className="text-sm font-medium text-white">{course.completion}%</div>
                      <div className="w-24 bg-white/20 rounded-full h-2 mt-1">
                        <div 
                          className="bg-purple-400 h-2 rounded-full"
                          style={{ width: `${course.completion}%` }}
                        />
                      </div>
                    </div>
                    
                    <Button variant="outline" size="sm" className="bg-white/10 text-white border-white/30 hover:bg-white/20">
                      View Details
                    </Button>
                  </div>
                </div>
              ))}
            </div>
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