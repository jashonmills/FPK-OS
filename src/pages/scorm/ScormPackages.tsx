import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  Package, 
  Play, 
  Settings, 
  Users, 
  Calendar,
  MoreVertical,
  Eye,
  Trash2,
  Archive,
  Search,
  Upload,
  BarChart3
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useNavigate } from 'react-router-dom';
import { formatDistanceToNow } from 'date-fns';
import { useScormPackages, useScormPackageMutations } from '@/hooks/useScormPackages';
import { useScormSummary } from '@/hooks/scorm/useScormAnalytics';

const ScormPackages = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  
  // Get real data from hooks
  const summaryQuery = useScormSummary({});
  const { packages, isLoading, error } = useScormPackages();
  const { deletePackage, isDeleting } = useScormPackageMutations();

  // Filter packages based on search and status
  const filteredPackages = packages.filter(pkg => {
    const matchesSearch = pkg.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (pkg.description || '').toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || pkg.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ready': return 'bg-green-100 text-green-800 border-green-200';
      case 'parsing': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'uploading': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'error': return 'bg-red-100 text-red-800 border-red-200';
      case 'archived': return 'bg-gray-100 text-gray-800 border-gray-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'ready': return 'Ready';
      case 'parsing': return 'Parsing';
      case 'uploading': return 'Uploading';
      case 'error': return 'Error';
      case 'archived': return 'Archived';
      default: return status.charAt(0).toUpperCase() + status.slice(1);
    }
  };

  const handleDelete = async (packageId: string) => {
    if (window.confirm('Are you sure you want to delete this SCORM package?')) {
      deletePackage(packageId);
    }
  };

  if (isLoading) {
    return (
      <div className="container mx-auto p-6 space-y-6">
        <div className="space-y-3">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="h-16 bg-muted animate-pulse rounded" />
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto p-6">
        <Card>
          <CardContent className="p-6 text-center">
            <p className="text-red-600">Error loading SCORM packages: {error.message}</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">SCORM Packages</h1>
          <p className="text-muted-foreground">Manage and organize your SCORM content packages</p>
        </div>
        <Button onClick={() => navigate('/dashboard/scorm/upload')}>
          <Upload className="h-4 w-4 mr-2" />
          Upload New Package
        </Button>
      </div>

      {/* Search and Filter */}
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search packages..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="All Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="ready">Ready</SelectItem>
                <SelectItem value="parsing">Parsing</SelectItem>
                <SelectItem value="uploading">Uploading</SelectItem>
                <SelectItem value="error">Error</SelectItem>
                <SelectItem value="archived">Archived</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Packages</p>
                {summaryQuery.isLoading ? (
                  <div className="h-8 w-16 bg-muted animate-pulse rounded" />
                ) : (
                  <p className="text-2xl font-bold">{summaryQuery.data?.totalPackages || packages.length}</p>
                )}
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
                <p className="text-2xl font-bold">{packages.filter(pkg => pkg.status === 'ready').length}</p>
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
                {summaryQuery.isLoading ? (
                  <div className="h-8 w-16 bg-muted animate-pulse rounded" />
                ) : (
                  <p className="text-2xl font-bold">{summaryQuery.data?.totalEnrollments || 0}</p>
                )}
              </div>
              <Users className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Avg Score</p>
                {summaryQuery.isLoading ? (
                  <div className="h-8 w-16 bg-muted animate-pulse rounded" />
                ) : (
                  <p className="text-2xl font-bold">{summaryQuery.data?.avgScore || 0}%</p>
                )}
              </div>
              <BarChart3 className="h-8 w-8 text-purple-600" />
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
          {filteredPackages.length === 0 ? (
            <div className="text-center py-12">
              <Package className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">No SCORM packages found</h3>
              <p className="text-muted-foreground mb-4">
                {searchTerm || statusFilter !== 'all' 
                  ? "No packages match your search criteria." 
                  : "Upload your first SCORM package to get started."}
              </p>
              <Button onClick={() => navigate('/dashboard/scorm/upload')}>
                <Upload className="mr-2 h-4 w-4" />
                Upload Package
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredPackages.map((pkg) => (
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
                        {pkg.scorm_version && (
                          <Badge variant="secondary">
                            SCORM {pkg.scorm_version}
                          </Badge>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground mb-1">{pkg.description || 'No description available'}</p>
                      <div className="flex items-center gap-4 text-xs text-muted-foreground">
                        <span>Updated {formatDistanceToNow(new Date(pkg.updated_at), { addSuffix: true })}</span>
                        {pkg.access_count && <span>{pkg.access_count} views</span>}
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    {pkg.status === 'ready' && (
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => navigate(`/scorm/player/${pkg.id}`)}
                      >
                        <Play className="h-4 w-4 mr-1" />
                        Preview
                      </Button>
                    )}
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => navigate(`/dashboard/scorm/packages/${pkg.id}/assign`)}
                    >
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
                        <DropdownMenuItem onClick={() => navigate(`/dashboard/scorm/packages/${pkg.id}`)}>
                          <Eye className="h-4 w-4 mr-2" />
                          View Details
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => navigate(`/dashboard/scorm/packages/${pkg.id}/settings`)}>
                          <Settings className="h-4 w-4 mr-2" />
                          Edit Settings
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => navigate(`/dashboard/scorm/packages/${pkg.id}/analytics`)}>
                          <BarChart3 className="h-4 w-4 mr-2" />
                          Analytics
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Archive className="h-4 w-4 mr-2" />
                          Archive
                        </DropdownMenuItem>
                        <DropdownMenuItem 
                          className="text-red-600"
                          onClick={() => handleDelete(pkg.id)}
                          disabled={isDeleting}
                        >
                          <Trash2 className="h-4 w-4 mr-2" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default ScormPackages;