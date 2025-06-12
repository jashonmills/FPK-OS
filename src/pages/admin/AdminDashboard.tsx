
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { 
  GraduationCap, 
  Users, 
  Book, 
  BarChart3,
  Settings,
  Plus,
  TrendingUp,
  Activity,
  Database,
  Shield
} from 'lucide-react';
import { useUserRole } from '@/hooks/useUserRole';
import { Alert, AlertDescription } from '@/components/ui/alert';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const { isAdmin, isLoading } = useUserRole();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-lg">Loading...</div>
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="p-4 md:p-6">
        <Alert>
          <AlertDescription>
            Access denied. You need administrator privileges to view this page.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  const adminCards = [
    {
      title: 'Course Management',
      description: 'Create, edit, and manage courses',
      icon: GraduationCap,
      action: () => navigate('/dashboard/admin/courses'),
      actionLabel: 'Manage Courses',
      color: 'text-blue-600'
    },
    {
      title: 'Module Management',
      description: 'Organize course modules and content',
      icon: Book,
      action: () => navigate('/dashboard/admin/modules'),
      actionLabel: 'Manage Modules',
      color: 'text-green-600'
    },
    {
      title: 'User Management',
      description: 'Manage users and their roles',
      icon: Users,
      action: () => navigate('/dashboard/admin/users'),
      actionLabel: 'Manage Users',
      color: 'text-purple-600'
    },
    {
      title: 'Analytics',
      description: 'View system-wide analytics and reports',
      icon: BarChart3,
      action: () => navigate('/dashboard/admin/analytics'),
      actionLabel: 'View Analytics',
      color: 'text-amber-600'
    }
  ];

  return (
    <div className="p-4 md:p-6 space-y-6 fade-in bg-gradient-to-br from-background to-secondary/10 min-h-full">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
        <div className="space-y-1">
          <h1 className="text-3xl md:text-4xl font-bold fpk-gradient-text">
            Admin Dashboard
          </h1>
          <p className="text-muted-foreground">
            Manage your FPK University learning platform
          </p>
        </div>
        <Button className="btn-primary w-full sm:w-auto">
          <Plus className="h-4 w-4 mr-2" />
          Quick Actions
        </Button>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        <Card className="stat-card fpk-hover-glow">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="metric-label">Total Users</p>
                <p className="metric-value">3</p>
                <p className="text-xs text-green-600 mt-1 font-medium">+3 this week</p>
              </div>
              <div className="p-3 rounded-full bg-blue-500/10">
                <Users className="h-8 w-8 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="stat-card fpk-hover-glow">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="metric-label">Published Courses</p>
                <p className="metric-value">0</p>
                <p className="text-xs text-muted-foreground mt-1">1 total courses</p>
              </div>
              <div className="p-3 rounded-full bg-green-500/10">
                <Book className="h-8 w-8 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="stat-card fpk-hover-glow">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="metric-label">Study Sessions</p>
                <p className="metric-value">12</p>
                <p className="text-xs text-muted-foreground mt-1">1 min avg</p>
              </div>
              <div className="p-3 rounded-full bg-purple-500/10">
                <Activity className="h-8 w-8 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="stat-card fpk-hover-glow">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="metric-label">Overall Accuracy</p>
                <p className="metric-value">23%</p>
                <p className="text-xs text-green-600 mt-1 font-medium">85% retention</p>
              </div>
              <div className="p-3 rounded-full bg-amber-500/10">
                <TrendingUp className="h-8 w-8 text-amber-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Admin Actions */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        {adminCards.map((card, index) => (
          <Card key={index} className="admin-card fpk-hover-lift cursor-pointer group" onClick={card.action}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
              <CardTitle className="text-lg font-semibold group-hover:fpk-gradient-text transition-all duration-300">
                {card.title}
              </CardTitle>
              <div className="p-2 rounded-lg bg-primary/10 group-hover:bg-primary/20 transition-colors">
                <card.icon className={`h-6 w-6 ${card.color} group-hover:scale-110 transition-transform`} />
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-muted-foreground">
                {card.description}
              </p>
              <Button 
                variant="outline" 
                size="sm" 
                className="w-full hover:bg-primary hover:text-primary-foreground transition-colors group-hover:scale-105 transition-transform"
              >
                {card.actionLabel}
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Dashboard Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="fpk-enhanced-card fpk-hover-glow">
          <CardHeader className="border-b border-border/20">
            <CardTitle className="flex items-center gap-2">
              <div className="p-2 rounded-lg bg-primary/10">
                <Activity className="h-5 w-5 text-primary" />
              </div>
              Recent Activity
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="space-y-3">
              <div className="flex items-center justify-between p-4 bg-gradient-to-r from-secondary/20 to-secondary/10 rounded-lg border border-border/20 hover:shadow-md transition-shadow">
                <span className="text-sm font-medium">New user registration</span>
                <span className="text-xs text-muted-foreground bg-green-100 text-green-700 px-2 py-1 rounded-full">2 hours ago</span>
              </div>
              <div className="flex items-center justify-between p-4 bg-gradient-to-r from-secondary/20 to-secondary/10 rounded-lg border border-border/20 hover:shadow-md transition-shadow">
                <span className="text-sm font-medium">Course module updated</span>
                <span className="text-xs text-muted-foreground bg-blue-100 text-blue-700 px-2 py-1 rounded-full">4 hours ago</span>
              </div>
              <div className="flex items-center justify-between p-4 bg-gradient-to-r from-secondary/20 to-secondary/10 rounded-lg border border-border/20 hover:shadow-md transition-shadow">
                <span className="text-sm font-medium">Analytics report generated</span>
                <span className="text-xs text-muted-foreground bg-purple-100 text-purple-700 px-2 py-1 rounded-full">1 day ago</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="fpk-enhanced-card fpk-hover-glow">
          <CardHeader className="border-b border-border/20">
            <CardTitle className="flex items-center gap-2">
              <div className="p-2 rounded-lg bg-primary/10">
                <Settings className="h-5 w-5 text-primary" />
              </div>
              System Status
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="space-y-4">
              <div className="flex justify-between items-center p-4 bg-gradient-to-r from-green-50 to-green-100 rounded-lg border border-green-200 shadow-sm">
                <div className="flex items-center gap-3">
                  <div className="p-1.5 rounded-full bg-green-500">
                    <Database className="h-4 w-4 text-white" />
                  </div>
                  <span className="text-sm font-medium text-green-900">Platform Status</span>
                </div>
                <span className="status-online bg-green-100 px-3 py-1 rounded-full text-green-700 font-semibold">Online</span>
              </div>
              <div className="flex justify-between items-center p-4 bg-gradient-to-r from-green-50 to-green-100 rounded-lg border border-green-200 shadow-sm">
                <div className="flex items-center gap-3">
                  <div className="p-1.5 rounded-full bg-green-500">
                    <Database className="h-4 w-4 text-white" />
                  </div>
                  <span className="text-sm font-medium text-green-900">Database</span>
                </div>
                <span className="status-connected bg-green-100 px-3 py-1 rounded-full text-green-700 font-semibold">Connected</span>
              </div>
              <div className="flex justify-between items-center p-4 bg-gradient-to-r from-green-50 to-green-100 rounded-lg border border-green-200 shadow-sm">
                <div className="flex items-center gap-3">
                  <div className="p-1.5 rounded-full bg-green-500">
                    <Shield className="h-4 w-4 text-white" />
                  </div>
                  <span className="text-sm font-medium text-green-900">Authentication</span>
                </div>
                <span className="status-active bg-green-100 px-3 py-1 rounded-full text-green-700 font-semibold">Active</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminDashboard;
