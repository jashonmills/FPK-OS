
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { Users, BookOpen, BarChart3, Settings, Database, Download, RefreshCw, CheckCircle, AlertTriangle, Building2, GraduationCap } from 'lucide-react';
import { useQuickStats } from '@/hooks/useQuickStats';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const { data: stats, isLoading, error, refetch } = useQuickStats();

  const adminSections = [
    {
      title: "User Management",
      description: "Manage users, roles, and permissions",
      icon: Users,
      path: "/dashboard/admin/user-management",
      color: "text-blue-600"
    },
    {
      title: "Organization Management",
      description: "Manage organizations, subscriptions, and seat usage",
      icon: Building2,
      path: "/dashboard/admin/organizations",
      color: "text-orange-600"
    },
    {
      title: "Instructor Console",
      description: "Monitor instructor dashboards and organization activity",
      icon: GraduationCap,
      path: "/dashboard/admin/instructor-console",
      color: "text-purple-600"
    },
    {
      title: "Course Manager",
      description: "Create and manage learning courses",
      icon: BookOpen,
      path: "/dashboard/admin/course-manager",
      color: "text-green-600"
    },
    {
      title: "EPUB Storage",
      description: "Manage EPUB downloads and storage",
      icon: Download,
      path: "/dashboard/admin/epub-storage",
      color: "text-indigo-600"
    },
    {
      title: "Analytics",
      description: "View detailed analytics and reports",
      icon: BarChart3,
      path: "/dashboard/admin/analytics",
      color: "text-pink-600"
    },
    {
      title: "System Settings",
      description: "Configure system-wide settings",
      icon: Settings,
      path: "/dashboard/admin/settings",
      color: "text-gray-600"
    }
  ];

  const formatLastRefreshed = () => {
    const now = new Date();
    return now.toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: true 
    });
  };

  const getStatValue = (value: number | null, loading: boolean) => {
    if (loading) return <div className="animate-pulse h-6 w-8 bg-gray-200 rounded"></div>;
    if (value === null) return "––";
    return value.toLocaleString();
  };

  const getHealthDisplay = () => {
    if (isLoading) {
      return <div className="animate-pulse h-6 w-16 bg-gray-200 rounded"></div>;
    }
    
    if (!stats?.systemHealth) {
      return <span className="text-red-600">––</span>;
    }

    if (stats.systemHealth.status === 'ok') {
      return (
        <span className="text-green-600 flex items-center gap-1">
          <CheckCircle className="h-4 w-4" />
          Healthy
        </span>
      );
    }

    return (
      <span className="text-red-600 flex items-center gap-1">
        <AlertTriangle className="h-4 w-4" />
        Degraded
      </span>
    );
  };

  return (
    <div className="container mx-auto p-4 sm:p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Admin Dashboard</h1>
        <p className="text-muted-foreground mt-2">
          Manage your learning platform from this central dashboard
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        {adminSections.map((section) => {
          const IconComponent = section.icon;
          return (
            <Card key={section.path} className="hover:shadow-lg transition-shadow cursor-pointer bg-white/60 backdrop-blur-sm border-white/30">
              <CardHeader className="p-4 sm:p-6">
                <CardTitle className="flex items-center gap-3 text-base sm:text-lg">
                  <IconComponent className={`h-6 w-6 ${section.color} flex-shrink-0`} />
                  <span className="truncate">{section.title}</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="p-4 sm:p-6 pt-0">
                <p className="text-muted-foreground mb-4 text-sm">
                  {section.description}
                </p>
                <Button 
                  onClick={() => navigate(section.path)}
                  className="w-full text-sm"
                >
                  Access {section.title}
                </Button>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <Card className="bg-white/60 backdrop-blur-sm border-white/30">
        <CardHeader className="p-4 sm:p-6">
          <CardTitle className="flex items-center gap-2 justify-between">
            <div className="flex items-center gap-2">
              <Database className="h-5 w-5" />
              Quick Stats
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => refetch()}
              disabled={isLoading}
              className="ml-auto"
            >
              <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent className="p-4 sm:p-6 pt-0">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-7 gap-4">
            <div 
              className="text-center cursor-pointer hover:bg-white/20 rounded-lg p-3 transition-colors"
              onClick={() => navigate('/dashboard/admin/user-management')}
            >
              <div className="text-2xl font-bold text-blue-600">
                {getStatValue(stats?.activeUsers || null, isLoading)}
              </div>
              <div className="text-sm text-muted-foreground">Active Users</div>
            </div>
            
            <div 
              className="text-center cursor-pointer hover:bg-white/20 rounded-lg p-3 transition-colors"
              onClick={() => navigate('/dashboard/admin/organizations')}
            >
              <div className="text-2xl font-bold text-orange-600">
                {getStatValue(stats?.organizations || null, isLoading)}
              </div>
              <div className="text-sm text-muted-foreground">Organizations</div>
            </div>
            
            <div 
              className="text-center cursor-pointer hover:bg-white/20 rounded-lg p-3 transition-colors"
              onClick={() => navigate('/dashboard/admin/instructor-console')}
            >
              <div className="text-2xl font-bold text-purple-600">
                {getStatValue(stats?.totalInstructors || null, isLoading)}
              </div>
              <div className="text-sm text-muted-foreground">Instructors</div>
            </div>
            
            <div 
              className="text-center cursor-pointer hover:bg-white/20 rounded-lg p-3 transition-colors"
              onClick={() => navigate('/dashboard/admin/organizations')}
            >
              <div className="text-2xl font-bold text-green-600">
                {getStatValue(stats?.totalStudents || null, isLoading)}
              </div>
              <div className="text-sm text-muted-foreground">Students</div>
            </div>
            
            <div 
              className="text-center cursor-pointer hover:bg-white/20 rounded-lg p-3 transition-colors"
              onClick={() => navigate('/dashboard/admin/course-manager')}
            >
              <div className="text-2xl font-bold text-indigo-600">
                {getStatValue(stats?.courses || null, isLoading)}
              </div>
              <div className="text-sm text-muted-foreground">Courses</div>
            </div>
            
            <div 
              className="text-center cursor-pointer hover:bg-white/20 rounded-lg p-3 transition-colors"
              onClick={() => navigate('/dashboard/admin/epub-storage')}
            >
              <div className="text-2xl font-bold text-pink-600">
                {getStatValue(stats?.booksInStorage || null, isLoading)}
              </div>
              <div className="text-sm text-muted-foreground">Books</div>
            </div>
            
            <div className="text-center">
              <div className="text-lg font-bold text-red-600 min-h-[2rem] flex items-center justify-center">
                {getHealthDisplay()}
              </div>
              <div className="text-sm text-muted-foreground">System Health</div>
            </div>
          </div>
          
          {!isLoading && (
            <div className="text-center mt-4 pt-4 border-t">
              <p className="text-xs text-muted-foreground">
                Last refreshed: {formatLastRefreshed()}
              </p>
            </div>
          )}
          
          {error && (
            <div className="text-center mt-4 pt-4 border-t">
              <p className="text-xs text-red-600">
                Error loading stats: {error.message}
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminDashboard;
