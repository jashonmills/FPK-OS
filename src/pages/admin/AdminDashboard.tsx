
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
  Download
} from 'lucide-react';
import { useUserRole } from '@/hooks/useUserRole';
import { Alert, AlertDescription } from '@/components/ui/alert';
import EPUBIngestionManager from '@/components/admin/EPUBIngestionManager';

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
      actionLabel: 'Manage Courses'
    },
    {
      title: 'Module Management',
      description: 'Organize course modules and content',
      icon: Book,
      action: () => navigate('/dashboard/admin/modules'),
      actionLabel: 'Manage Modules'
    },
    {
      title: 'User Management',
      description: 'Manage users and their roles',
      icon: Users,
      action: () => navigate('/dashboard/admin/users'),
      actionLabel: 'Manage Users'
    },
    {
      title: 'Analytics',
      description: 'View system-wide analytics and reports',
      icon: BarChart3,
      action: () => navigate('/dashboard/admin/analytics'),
      actionLabel: 'View Analytics'
    }
  ];

  return (
    <div className="p-4 md:p-6 space-y-4 md:space-y-6">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold">Admin Dashboard</h1>
          <p className="text-sm md:text-base text-muted-foreground">
            Manage your FPK University learning platform
          </p>
        </div>
        <Button className="fpk-gradient text-white w-full sm:w-auto">
          <Plus className="h-4 w-4 mr-2" />
          Quick Actions
        </Button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        {adminCards.map((card, index) => (
          <Card key={index} className="hover:shadow-lg transition-shadow cursor-pointer">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {card.title}
              </CardTitle>
              <card.icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <p className="text-xs text-muted-foreground mb-4">
                {card.description}
              </p>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={card.action}
                className="w-full min-h-[40px]"
              >
                {card.actionLabel}
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg md:text-xl">Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm md:text-base text-muted-foreground">
              Recent platform activity will appear here.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg md:text-xl">System Status</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm md:text-base">Platform Status</span>
                <span className="text-green-600 text-sm md:text-base">Online</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm md:text-base">Database</span>
                <span className="text-green-600 text-sm md:text-base">Connected</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm md:text-base">Authentication</span>
                <span className="text-green-600 text-sm md:text-base">Active</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* EPUB Ingestion Manager */}
      <div className="mt-6">
        <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
          <Download className="h-5 w-5" />
          Library Management
        </h2>
        <EPUBIngestionManager />
      </div>
    </div>
  );
};

export default AdminDashboard;
