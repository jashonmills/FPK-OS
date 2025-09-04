import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  ArrowLeft, 
  TrendingUp, 
  BookOpen, 
  MessageCircle, 
  Target, 
  BarChart3, 
  User,
  Calendar,
  Mail,
  Clock
} from 'lucide-react';
import RouteBoundary from '@/components/RouteBoundary';
import { useUser } from '@/hooks/useUser';
import RequireAdmin from '@/components/guards/RequireAdmin';
import { getRoleBadgeVariant } from '@/types/user';

// Import analytics components
import ReadingAnalyticsCard from '@/components/analytics/ReadingAnalyticsCard';
import AICoachEngagementCard from '@/components/analytics/AICoachEngagementCard';
import XPBreakdownCard from '@/components/analytics/XPBreakdownCard';

// Dynamic imports for specialized analytics - these need userId prop support
const LibraryReadingAnalytics = React.lazy(() => 
  import('@/components/analytics/LibraryReadingAnalytics').catch((error) => {
    console.error('Failed to load LibraryReadingAnalytics:', error);
    return {
      default: () => (
        <div className="p-4 text-center text-gray-500">
          <p>Reading analytics unavailable</p>
        </div>
      )
    };
  })
);

const GoalsGamificationAnalytics = React.lazy(() => 
  import('@/components/analytics/GoalsGamificationAnalytics').catch((error) => {
    console.error('Failed to load GoalsGamificationAnalytics:', error);
    return {
      default: () => (
        <div className="p-4 text-center text-gray-500">
          <p>Goals analytics unavailable</p>
        </div>
      )
    };
  })
);

const AICoachAnalytics = React.lazy(() => 
  import('@/components/analytics/AICoachAnalytics').catch((error) => {
    console.error('Failed to load AICoachAnalytics:', error);
    return {
      default: () => (
        <div className="p-4 text-center text-gray-500">
          <p>AI Coach analytics unavailable</p>
        </div>
      )
    };
  })
);

const AdminUserAnalytics = () => {
  const { userId } = useParams<{ userId: string }>();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview');
  const { user: targetUser, isLoading: userLoading } = useUser(userId);

  if (!userId) {
    return (
      <div className="p-6">
        <div className="text-center">
          <p className="text-red-600">Invalid user ID</p>
          <Button onClick={() => navigate('/dashboard/admin/users')} className="mt-4">
            Back to User Management
          </Button>
        </div>
      </div>
    );
  }

  if (userLoading) {
    return (
      <div className="p-6">
        <div className="flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
        </div>
      </div>
    );
  }

  if (!targetUser) {
    return (
      <div className="p-6">
        <div className="text-center">
          <p className="text-red-600">User not found</p>
          <Button onClick={() => navigate('/dashboard/admin/users')} className="mt-4">
            Back to User Management
          </Button>
        </div>
      </div>
    );
  }

  return (
    <RequireAdmin>
      <div className="container mx-auto p-4 sm:p-6 space-y-6">
        {/* Header with user info */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => navigate('/dashboard/admin/users')}
              className="flex items-center gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Users
            </Button>
          </div>
        </div>

        {/* User Profile Card */}
        <Card>
          <CardHeader>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="h-12 w-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                  <User className="h-6 w-6 text-white" />
                </div>
                <div>
                  <CardTitle className="text-xl">{targetUser.full_name}</CardTitle>
                  <p className="text-sm text-muted-foreground flex items-center gap-2 mt-1">
                    <Mail className="h-4 w-4" />
                    {targetUser.email}
                  </p>
                  <p className="text-sm text-muted-foreground flex items-center gap-2 mt-1">
                    <Calendar className="h-4 w-4" />
                    Joined {new Date(targetUser.created_at).toLocaleDateString()}
                  </p>
                </div>
              </div>
              <div className="flex flex-wrap gap-2">
                {targetUser.roles?.map((role) => (
                  <Badge key={role} variant={getRoleBadgeVariant(role)}>
                    {role}
                  </Badge>
                ))}
              </div>
            </div>
          </CardHeader>
        </Card>

        {/* Analytics Content */}
        <div className="flex flex-col items-center gap-2 mb-4">
          <h1 className="text-3xl font-bold text-foreground">User Analytics Dashboard</h1>
          <p className="text-muted-foreground text-center">
            Track {targetUser.full_name}'s learning progress and activities
          </p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2 lg:grid-cols-4">
            <TabsTrigger value="overview" className="flex items-center gap-2">
              <BarChart3 className="h-4 w-4" />
              <span className="hidden sm:inline">Overview</span>
            </TabsTrigger>
            <TabsTrigger value="reading" className="flex items-center gap-2">
              <BookOpen className="h-4 w-4" />
              <span className="hidden sm:inline">Reading</span>
            </TabsTrigger>
            <TabsTrigger value="ai-coach" className="flex items-center gap-2">
              <MessageCircle className="h-4 w-4" />
              <span className="hidden sm:inline">AI Coach</span>
            </TabsTrigger>
            <TabsTrigger value="goals" className="flex items-center gap-2">
              <Target className="h-4 w-4" />
              <span className="hidden sm:inline">Goals</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="mt-6">
            <RouteBoundary>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
                <ReadingAnalyticsCard userId={userId} />
                <AICoachEngagementCard userId={userId} />
                <XPBreakdownCard userId={userId} />
                <Card className="border-0 shadow-lg">
                  <CardHeader className="p-4 sm:p-6">
                    <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
                      <TrendingUp className="h-4 w-4 sm:h-5 sm:w-5 text-green-600" />
                      Quick Stats
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-4 sm:p-6 pt-0">
                    <div className="grid grid-cols-2 gap-4">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-blue-600 mb-1">
                        {targetUser.roles.length}
                      </div>
                      <p className="text-xs text-gray-500">Active Roles</p>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-green-600 mb-1">
                        0h
                      </div>
                      <p className="text-xs text-gray-500">Hours Learned</p>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-purple-600 mb-1">
                        0
                      </div>
                      <p className="text-xs text-gray-500">Enrollments</p>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-orange-600 mb-1">
                        0
                      </div>
                      <p className="text-xs text-gray-500">Goals Met</p>
                    </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </RouteBoundary>
          </TabsContent>

          <TabsContent value="reading" className="mt-6">
            <RouteBoundary>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <BookOpen className="h-5 w-5 text-blue-600" />
                      Reading Sessions
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-center py-8">
                      <div className="text-3xl font-bold text-blue-600 mb-2">0</div>
                      <p className="text-sm text-muted-foreground">Total reading sessions</p>
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Clock className="h-5 w-5 text-green-600" />
                      Reading Time
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-center py-8">
                      <div className="text-3xl font-bold text-green-600 mb-2">0h</div>
                      <p className="text-sm text-muted-foreground">Total time spent reading</p>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </RouteBoundary>
          </TabsContent>

          <TabsContent value="ai-coach" className="mt-6">
            <RouteBoundary>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <MessageCircle className="h-5 w-5 text-purple-600" />
                      Chat Sessions
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-center py-8">
                      <div className="text-3xl font-bold text-purple-600 mb-2">0</div>
                      <p className="text-sm text-muted-foreground">Total AI coach sessions</p>
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <TrendingUp className="h-5 w-5 text-orange-600" />
                      Messages Sent
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-center py-8">
                      <div className="text-3xl font-bold text-orange-600 mb-2">0</div>
                      <p className="text-sm text-muted-foreground">Messages to AI coach</p>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </RouteBoundary>
          </TabsContent>

          <TabsContent value="goals" className="mt-6">
            <RouteBoundary>
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Target className="h-5 w-5 text-blue-600" />
                      Active Goals
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-center py-8">
                      <div className="text-3xl font-bold text-blue-600 mb-2">0</div>
                      <p className="text-sm text-muted-foreground">Currently active goals</p>
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Target className="h-5 w-5 text-green-600" />
                      Completed Goals  
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-center py-8">
                      <div className="text-3xl font-bold text-green-600 mb-2">0</div>
                      <p className="text-sm text-muted-foreground">Successfully completed</p>
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <TrendingUp className="h-5 w-5 text-purple-600" />
                      Success Rate
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-center py-8">
                      <div className="text-3xl font-bold text-purple-600 mb-2">0%</div>
                      <p className="text-sm text-muted-foreground">Goal completion rate</p>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </RouteBoundary>
          </TabsContent>
        </Tabs>
      </div>
    </RequireAdmin>
  );
};

export default AdminUserAnalytics;