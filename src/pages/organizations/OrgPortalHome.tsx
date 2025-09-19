import React from 'react';
import { useNavigate } from 'react-router-dom';
import { OrgCard as Card, OrgCardContent as CardContent, OrgCardDescription as CardDescription, OrgCardHeader as CardHeader, OrgCardTitle as CardTitle } from '@/components/organizations/OrgCard';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
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
import { useOrgStatistics } from '@/hooks/useOrgStatistics';
import { useOrgAnalytics } from '@/hooks/useOrgAnalytics';
import { OrgLogo } from '@/components/branding/OrgLogo';
import { useOrgBranding } from '@/hooks/useOrgBranding';
import { useEnhancedOrgBranding } from '@/hooks/useEnhancedOrgBranding';

export default function OrgPortalHome() {
  const navigate = useNavigate();
  const { currentOrg } = useOrgContext();
  const { data: branding } = useOrgBranding(currentOrg?.organization_id || null);
  const { data: enhancedBranding } = useEnhancedOrgBranding(currentOrg?.organization_id || null);
  const { data: statistics, isLoading: statsLoading, error: statsError } = useOrgStatistics();
  const { analytics, isLoading: analyticsLoading } = useOrgAnalytics();

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

  if (statsLoading || analyticsLoading) {
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

  const stats = [
    { 
      label: 'Active Students', 
      value: statistics?.studentCount?.toString() || '0', 
      icon: Users, 
      color: 'text-blue-600' 
    },
    { 
      label: 'Course Assignments', 
      value: statistics?.courseAssignments?.toString() || '0', 
      icon: BookOpen, 
      color: 'text-green-600' 
    },
    { 
      label: 'Active Goals', 
      value: statistics?.activeGoals?.toString() || '0', 
      icon: Target, 
      color: 'text-purple-600' 
    },
    { 
      label: 'Completion Rate', 
      value: `${statistics?.completionRate || 0}%`, 
      icon: TrendingUp, 
      color: 'text-orange-600' 
    },
  ];

  const recentActivity: any[] = [];

  return (
    <div className="space-y-6">
      {/* Branded Hero Section */}
      <Card className="bg-orange-500/65 border-orange-400/50">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <OrgLogo size="lg" />
              <div>
                <h1 className="text-2xl font-bold text-white">
                  Welcome to {currentOrg.organizations.name}
                </h1>
                <p className="text-white/80 mt-1">
                  {currentOrg.organizations.plan.charAt(0).toUpperCase() + currentOrg.organizations.plan.slice(1)} Plan Organization
                </p>
              </div>
            </div>
            <Badge variant="secondary" className="text-sm bg-white/20 text-white border-white/30">
              {currentOrg.role.charAt(0).toUpperCase() + currentOrg.role.slice(1)}
            </Badge>
          </div>
        </CardContent>
      </Card>

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
              <span>Progress Overview</span>
            </CardTitle>
            <CardDescription className="text-white/80">
              Current completion rates across all courses
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="text-center py-8">
              <TrendingUp className="h-8 w-8 mx-auto text-white/70 mb-2" />
              <p className="text-sm text-white/80">No progress data available yet</p>
            </div>
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
              Latest updates from your organization
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
                        {activity.student_name}: {activity.activity}
                      </p>
                      <p className="text-sm text-white/80">
                        {new Date(activity.timestamp).toLocaleString()}
                      </p>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8">
                  <Calendar className="h-8 w-8 mx-auto text-white/70 mb-2" />
                  <p className="text-sm text-white/80">No recent activity</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card className="bg-orange-500/65 border-orange-400/50">
        <CardHeader>
          <CardTitle className="text-white">Quick Actions</CardTitle>
          <CardDescription className="text-white/80">
            Common tasks for organization management
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-4">
            <Button 
              className="flex items-center space-x-2 bg-white/20 hover:bg-white/30 text-white border-white/30"
              onClick={() => navigate(`/org/${currentOrg?.organization_id}/invite`)}
            >
              <Users className="h-4 w-4" />
              <span>Invite Members</span>
            </Button>
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
              className="flex items-center space-x-2 border-white/30 text-white hover:bg-white/20"
              onClick={() => navigate(`/org/${currentOrg?.organization_id}/goals`)}
            >
              <Target className="h-4 w-4" />
              <span>Create Goal</span>
            </Button>
            <Button 
              variant="outline" 
              className="flex items-center space-x-2 border-white/30 text-white hover:bg-white/20"
              onClick={() => navigate(`/org/${currentOrg?.organization_id}/analytics`)}
            >
              <Award className="h-4 w-4" />
              <span>View Reports</span>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}