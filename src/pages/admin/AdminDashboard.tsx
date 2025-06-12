
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
    <div className="p-4 md:p-6 space-y-6 fade-in">
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
        <Button className="fpk-gradient-button w-full sm:w-auto">
          <Plus className="h-4 w-4 mr-2" />
          Quick Actions
        </Button>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        <Card className="stat-card">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="metric-label">Total Users</p>
                <p className="metric-value">3</p>
                <p className="text-xs text-green-600 mt-1">+3 this week</p>
              </div>
              <Users className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="stat-card">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="metric-label">Published Courses</p>
                <p className="metric-value">0</p>
                <p className="text-xs text-muted-foreground mt-1">1 total courses</p>
              </div>
              <Book className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="stat-card">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="metric-label">Study Sessions</p>
                <p className="metric-value">12</p>
                <p className="text-xs text-muted-foreground mt-1">1 min avg</p>
              </div>
              <Activity className="h-8 w-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="stat-card">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="metric-label">Overall Accuracy</p>
                <p className="metric-value">23%</p>
                <p className="text-xs text-green-600 mt-1">85% retention</p>
              </div>
              <TrendingUp className="h-8 w-8 text-amber-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Admin Actions */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        {adminCards.map((card, index) => (
          <Card key={index} className="admin-card fpk-hover-lift cursor-pointer" onClick={card.action}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
              <CardTitle className="text-lg font-semibold">
                {card.title}
              </CardTitle>
              <card.icon className={`h-6 w-6 ${card.color}`} />
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-muted-foreground">
                {card.description}
              </p>
              <Button 
                variant="outline" 
                size="sm" 
                className="w-full hover:bg-primary hover:text-primary-foreground transition-colors"
              >
                {card.actionLabel}
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Dashboard Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="fpk-enhanced-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-5 w-5 text-primary" />
              Recent Activity
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-secondary/20 rounded-lg">
                <span className="text-sm">New user registration</span>
                <span className="text-xs text-muted-foreground">2 hours ago</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-secondary/20 rounded-lg">
                <span className="text-sm">Course module updated</span>
                <span className="text-xs text-muted-foreground">4 hours ago</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-secondary/20 rounded-lg">
                <span className="text-sm">Analytics report generated</span>
                <span className="text-xs text-muted-foreground">1 day ago</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="fpk-enhanced-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings className="h-5 w-5 text-primary" />
              System Status
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg border border-green-200">
                <div className="flex items-center gap-2">
                  <Database className="h-4 w-4 text-green-600" />
                  <span className="text-sm font-medium">Platform Status</span>
                </div>
                <span className="status-online">Online</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg border border-green-200">
                <div className="flex items-center gap-2">
                  <Database className="h-4 w-4 text-green-600" />
                  <span className="text-sm font-medium">Database</span>
                </div>
                <span className="status-connected">Connected</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg border border-green-200">
                <div className="flex items-center gap-2">
                  <Shield className="h-4 w-4 text-green-600" />
                  <span className="text-sm font-medium">Authentication</span>
                </div>
                <span className="status-active">Active</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminDashboard;
