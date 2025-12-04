import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { 
  ArrowLeft, 
  Users, 
  Search, 
  Plus,
  CheckCircle,
  Clock,
  XCircle
} from 'lucide-react';
import { useScormPackage } from '@/hooks/useScormPackages';
import { useToast } from '@/hooks/use-toast';

export default function ScormAssignments() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const packageId = searchParams.get('packageId');
  
  const { package: scormPackage, isLoading } = useScormPackage(packageId || '');
  const [searchTerm, setSearchTerm] = useState('');

  // Mock assignments data - replace with real data from hooks
  const [assignments] = useState([
    {
      id: '1',
      title: 'Q1 Training Assignment',
      assignedUsers: 15,
      completedUsers: 12,
      dueDate: '2024-09-15',
      status: 'active'
    },
    {
      id: '2', 
      title: 'New Employee Onboarding',
      assignedUsers: 8,
      completedUsers: 3,
      dueDate: '2024-09-30',
      status: 'active'
    }
  ]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800 border-green-200';
      case 'draft': return 'bg-gray-100 text-gray-800 border-gray-200';
      case 'expired': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active': return <CheckCircle className="h-4 w-4" />;
      case 'draft': return <Clock className="h-4 w-4" />;
      case 'expired': return <XCircle className="h-4 w-4" />;
      default: return <Clock className="h-4 w-4" />;
    }
  };

  if (isLoading) {
    return (
      <div className="container mx-auto p-6 space-y-6">
        <div className="space-y-3">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-16 bg-muted animate-pulse rounded" />
          ))}
        </div>
      </div>
    );
  }

  if (!scormPackage) {
    return (
      <div className="container mx-auto p-6">
        <Card>
          <CardContent className="p-6 text-center">
            <p className="text-red-600">SCORM package not found</p>
            <Button 
              onClick={() => navigate('/dashboard/scorm/packages')}
              className="mt-4"
            >
              Back to Packages
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button 
            variant="ghost" 
            size="sm"
            onClick={() => navigate('/dashboard/scorm/packages')}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Packages
          </Button>
          <div>
            <h1 className="text-3xl font-bold">Assignments</h1>
            <p className="text-muted-foreground">{scormPackage.title}</p>
          </div>
        </div>
        <Button onClick={() => toast({ 
          title: "Create Assignment", 
          description: "Assignment creation feature coming soon!" 
        })}>
          <Plus className="h-4 w-4 mr-2" />
          Create Assignment
        </Button>
      </div>

      {/* Package Info */}
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center gap-4">
            <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center">
              <Users className="h-6 w-6 text-primary" />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold">{scormPackage.title}</h3>
              <p className="text-sm text-muted-foreground">
                {scormPackage.description || 'No description available'}
              </p>
              <div className="flex items-center gap-4 mt-2">
                <Badge variant="secondary">
                  SCORM {scormPackage.scorm_version || '1.2'}
                </Badge>
                <Badge variant={scormPackage.status === 'ready' ? 'default' : 'secondary'}>
                  {scormPackage.status}
                </Badge>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Search */}
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search assignments..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Assignments List */}
      <Card>
        <CardHeader>
          <CardTitle>Active Assignments</CardTitle>
          <CardDescription>
            Manage assignments for this SCORM package
          </CardDescription>
        </CardHeader>
        <CardContent>
          {assignments.length === 0 ? (
            <div className="text-center py-12">
              <Users className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">No assignments yet</h3>
              <p className="text-muted-foreground mb-4">
                Create your first assignment to start tracking learner progress.
              </p>
              <Button onClick={() => toast({ 
                title: "Create Assignment", 
                description: "Assignment creation feature coming soon!" 
              })}>
                <Plus className="mr-2 h-4 w-4" />
                Create First Assignment
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              {assignments.map((assignment) => (
                <div 
                  key={assignment.id} 
                  className="flex items-center justify-between p-4 border rounded-lg hover:shadow-md transition-shadow"
                >
                  <div className="flex items-center gap-4">
                    <div className="h-12 w-12 rounded-lg bg-accent flex items-center justify-center">
                      {getStatusIcon(assignment.status)}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold">{assignment.title}</h3>
                        <Badge 
                          variant="outline" 
                          className={getStatusColor(assignment.status)}
                        >
                          {assignment.status}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground mt-1">
                        <span>{assignment.assignedUsers} assigned</span>
                        <span>{assignment.completedUsers} completed</span>
                        <span>Due: {new Date(assignment.dueDate).toLocaleDateString()}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => toast({ 
                        title: "View Details", 
                        description: "Assignment details feature coming soon!" 
                      })}
                    >
                      View Details
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}