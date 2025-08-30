import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Package, 
  Play, 
  Settings, 
  Users, 
  Calendar,
  MoreVertical,
  Eye,
  Trash2,
  Archive
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

const ScormPackages = () => {
  // Mock data - will be replaced with real data from hooks
  const packages = [
    {
      id: 'pkg-1',
      title: 'Introduction to Safety Training',
      description: 'Comprehensive workplace safety training module',
      version: '1.2',
      status: 'ready',
      scoCount: 5,
      createdAt: '2024-01-15',
      enrollments: 12
    },
    {
      id: 'pkg-2', 
      title: 'Customer Service Excellence',
      description: 'Advanced customer service skills and techniques',
      version: '1.2',
      status: 'ready',
      scoCount: 8,
      createdAt: '2024-01-12',
      enrollments: 25
    },
    {
      id: 'pkg-3',
      title: 'Data Security Fundamentals',
      description: 'Essential data protection and security practices',
      version: '2004',
      status: 'parsed',
      scoCount: 3,
      createdAt: '2024-01-10',
      enrollments: 0
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ready': return 'bg-green-100 text-green-800 border-green-200';
      case 'parsed': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'uploaded': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'archived': return 'bg-gray-100 text-gray-800 border-gray-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'ready': return 'Ready';
      case 'parsed': return 'Parsed';
      case 'uploaded': return 'Uploaded';
      case 'archived': return 'Archived';
      default: return 'Unknown';
    }
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">SCORM Packages</h1>
          <p className="text-muted-foreground">Manage and organize your SCORM content packages</p>
        </div>
        <Button>
          <Package className="h-4 w-4 mr-2" />
          Upload New Package
        </Button>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Packages</p>
                <p className="text-2xl font-bold">12</p>
              </div>
              <Package className="h-8 w-8 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Ready to Use</p>
                <p className="text-2xl font-bold">8</p>
              </div>
              <Play className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Active Enrollments</p>
                <p className="text-2xl font-bold">247</p>
              </div>
              <Users className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">This Month</p>
                <p className="text-2xl font-bold">3</p>
              </div>
              <Calendar className="h-8 w-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Packages List */}
      <Card>
        <CardHeader>
          <CardTitle>All Packages</CardTitle>
          <CardDescription>Browse and manage your SCORM packages</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {packages.map((pkg) => (
              <div key={pkg.id} className="flex items-center justify-between p-4 border rounded-lg hover:shadow-md transition-shadow">
                <div className="flex items-center gap-4">
                  <div className="h-12 w-12 rounded-lg bg-accent flex items-center justify-center">
                    <Package className="h-6 w-6" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold">{pkg.title}</h3>
                      <Badge 
                        variant="outline" 
                        className={getStatusColor(pkg.status)}
                      >
                        {getStatusLabel(pkg.status)}
                      </Badge>
                      <Badge variant="secondary">
                        SCORM {pkg.version}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mb-1">{pkg.description}</p>
                    <div className="flex items-center gap-4 text-xs text-muted-foreground">
                      <span>{pkg.scoCount} SCOs</span>
                      <span>{pkg.enrollments} enrollments</span>
                      <span>Created {pkg.createdAt}</span>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  {pkg.status === 'ready' && (
                    <Button variant="outline" size="sm">
                      <Play className="h-4 w-4 mr-1" />
                      Preview
                    </Button>
                  )}
                  <Button variant="outline" size="sm">
                    <Users className="h-4 w-4 mr-1" />
                    Assign
                  </Button>
                  
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm">
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem>
                        <Eye className="h-4 w-4 mr-2" />
                        View Details
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <Settings className="h-4 w-4 mr-2" />
                        Edit Settings
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <Archive className="h-4 w-4 mr-2" />
                        Archive
                      </DropdownMenuItem>
                      <DropdownMenuItem className="text-red-600">
                        <Trash2 className="h-4 w-4 mr-2" />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ScormPackages;