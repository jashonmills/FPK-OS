
import React from 'react';
import { useAccessibility } from '@/hooks/useAccessibility';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Users, BookOpen, Upload, Settings, BarChart3, AlertTriangle } from 'lucide-react';
import { Link } from 'react-router-dom';
import PopulateApprovedBooks from '@/components/admin/PopulateApprovedBooks';
import CommunityBooksApproval from '@/components/admin/CommunityBooksApproval';
import XPBackfillAdmin from '@/components/admin/XPBackfillAdmin';

const AdminDashboard = () => {
  const { getAccessibilityClasses } = useAccessibility();

  const adminCards = [
    {
      title: "User Management",
      description: "Manage users, roles, and permissions",
      icon: Users,
      href: "/dashboard/admin/users",
      badge: "Active"
    },
    {
      title: "Course Manager",
      description: "Create and manage learning courses",
      icon: BookOpen,
      href: "/dashboard/admin/courses",
      badge: "New"
    },
    {
      title: "Analytics",
      description: "View platform analytics and insights",
      icon: BarChart3,
      href: "/dashboard/admin/analytics",
      badge: "Beta"
    },
    {
      title: "Threshold Management",
      description: "Configure anomaly detection and thresholds",
      icon: AlertTriangle,
      href: "/dashboard/admin/thresholds",
      badge: "Enterprise"
    },
    {
      title: "Module Manager",
      description: "Manage course modules and content",
      icon: Upload,
      href: "/dashboard/admin/modules",
      badge: "Active"
    }
  ];

  return (
    <div className={`min-h-screen bg-background ${getAccessibilityClasses('container')}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-8">
        {/* Header */}
        <div className="space-y-2">
          <h1 className={`text-3xl font-bold ${getAccessibilityClasses('text')}`}>
            Admin Dashboard
          </h1>
          <p className={`text-muted-foreground ${getAccessibilityClasses('text')}`}>
            Manage your learning platform and monitor system performance
          </p>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {adminCards.map((card) => {
            const Icon = card.icon;
            return (
              <Card key={card.title} className="hover:shadow-md transition-shadow">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <Icon className="h-8 w-8 text-primary" />
                    <Badge variant="secondary" className="text-xs">
                      {card.badge}
                    </Badge>
                  </div>
                  <CardTitle className="text-lg">{card.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-4">
                    {card.description}
                  </p>
                  <Button asChild className="w-full">
                    <Link to={card.href}>
                      Manage
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* XP System Initialization */}
        <div className="space-y-6">
          <h2 className={`text-2xl font-semibold ${getAccessibilityClasses('text')}`}>
            System Initialization
          </h2>
          
          <XPBackfillAdmin />
        </div>

        {/* Library Management Section */}
        <div className="space-y-6">
          <h2 className={`text-2xl font-semibold ${getAccessibilityClasses('text')}`}>
            Library Management
          </h2>
          
          {/* Community Books Approval Panel */}
          <CommunityBooksApproval />
          
          <PopulateApprovedBooks />
        </div>

        {/* System Status */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings className="h-5 w-5" />
              System Status
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">Online</div>
                <div className="text-sm text-muted-foreground">System Status</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">99.9%</div>
                <div className="text-sm text-muted-foreground">Uptime</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-600">v2.1.0</div>
                <div className="text-sm text-muted-foreground">Platform Version</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminDashboard;
