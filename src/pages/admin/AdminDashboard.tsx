
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { Users, BookOpen, BarChart3, Settings, Database, Download } from 'lucide-react';

const AdminDashboard = () => {
  const navigate = useNavigate();

  const adminSections = [
    {
      title: "User Management",
      description: "Manage users, roles, and permissions",
      icon: Users,
      path: "/admin/user-management",
      color: "text-blue-600"
    },
    {
      title: "Course Manager",
      description: "Create and manage learning courses",
      icon: BookOpen,
      path: "/admin/course-manager",
      color: "text-green-600"
    },
    {
      title: "EPUB Storage",
      description: "Manage EPUB downloads and storage",
      icon: Download,
      path: "/admin/epub-storage",
      color: "text-purple-600"
    },
    {
      title: "Analytics",
      description: "View detailed analytics and reports",
      icon: BarChart3,
      path: "/admin/analytics",
      color: "text-orange-600"
    },
    {
      title: "System Settings",
      description: "Configure system-wide settings",
      icon: Settings,
      path: "/admin/settings",
      color: "text-gray-600"
    }
  ];

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Admin Dashboard</h1>
        <p className="text-muted-foreground mt-2">
          Manage your learning platform from this central dashboard
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {adminSections.map((section) => {
          const IconComponent = section.icon;
          return (
            <Card key={section.path} className="hover:shadow-lg transition-shadow cursor-pointer">
              <CardHeader>
                <CardTitle className="flex items-center gap-3">
                  <IconComponent className={`h-6 w-6 ${section.color}`} />
                  {section.title}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4">
                  {section.description}
                </p>
                <Button 
                  onClick={() => navigate(section.path)}
                  className="w-full"
                >
                  Access {section.title}
                </Button>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Database className="h-5 w-5" />
            Quick Stats
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">--</div>
              <div className="text-sm text-muted-foreground">Active Users</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">--</div>
              <div className="text-sm text-muted-foreground">Courses</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">--</div>
              <div className="text-sm text-muted-foreground">Books in Storage</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-600">--</div>
              <div className="text-sm text-muted-foreground">System Health</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminDashboard;
