import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Upload, Package, Play, Settings, BarChart3, 
  FileText, Clock, Users, ChevronRight, Plus,
  Search, Filter, MoreVertical, Eye, Edit, Trash2
} from 'lucide-react';
import { Input } from '@/components/ui/input';
import { useScormPackages } from '@/hooks/useScormPackages';
import { useNavigate } from 'react-router-dom';
import { formatDistanceToNow } from 'date-fns';

export const ScormStudio: React.FC = () => {
  const navigate = useNavigate();
  const { packages, isLoading } = useScormPackages();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  const filteredPackages = packages.filter(pkg => {
    const matchesSearch = pkg.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         pkg.description?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || pkg.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ready': return 'bg-green-100 text-green-800';
      case 'parsing': return 'bg-blue-100 text-blue-800';
      case 'uploading': return 'bg-yellow-100 text-yellow-800';
      case 'error': return 'bg-red-100 text-red-800';
      case 'archived': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const stats = {
    totalPackages: packages.length,
    readyPackages: packages.filter(p => p.status === 'ready').length,
    totalViews: packages.reduce((sum, p) => sum + (p.access_count || 0), 0),
    averageScore: 85 // Mock data
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b bg-card">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold">SCORM Studio</h1>
              <p className="text-muted-foreground">Manage your SCORM packages and track performance</p>
            </div>
            <div className="flex items-center gap-3">
              <Button variant="outline" size="sm">
                <Settings className="h-4 w-4 mr-2" />
                Settings
              </Button>
              <Button onClick={() => navigate('/scorm/upload')}>
                <Upload className="h-4 w-4 mr-2" />
                Upload Package
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 py-6">
        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Total Packages</p>
                  <p className="text-2xl font-bold">{stats.totalPackages}</p>
                </div>
                <Package className="h-8 w-8 text-primary" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Ready to Launch</p>
                  <p className="text-2xl font-bold">{stats.readyPackages}</p>
                </div>
                <Play className="h-8 w-8 text-green-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Total Views</p>
                  <p className="text-2xl font-bold">{stats.totalViews}</p>
                </div>
                <Users className="h-8 w-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Avg. Score</p>
                  <p className="text-2xl font-bold">{stats.averageScore}%</p>
                </div>
                <BarChart3 className="h-8 w-8 text-purple-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters and Search */}
        <Card className="mb-6">
          <CardContent className="p-6">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search packages..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              <div className="flex gap-2">
                <Button
                  variant={statusFilter === 'all' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setStatusFilter('all')}
                >
                  All
                </Button>
                <Button
                  variant={statusFilter === 'ready' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setStatusFilter('ready')}
                >
                  Ready
                </Button>
                <Button
                  variant={statusFilter === 'parsing' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setStatusFilter('parsing')}
                >
                  Processing
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Packages List */}
        <div className="space-y-4">
          {filteredPackages.length === 0 ? (
            <Card>
              <CardContent className="p-12 text-center">
                <Package className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">No SCORM packages found</h3>
                <p className="text-muted-foreground mb-4">
                  {packages.length === 0 
                    ? "Get started by uploading your first SCORM package."
                    : "Try adjusting your search or filter criteria."
                  }
                </p>
                {packages.length === 0 && (
                  <Button onClick={() => navigate('/scorm/upload')}>
                    <Plus className="h-4 w-4 mr-2" />
                    Upload First Package
                  </Button>
                )}
              </CardContent>
            </Card>
          ) : (
            filteredPackages.map((pkg) => (
              <Card key={pkg.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-lg font-semibold">{pkg.title}</h3>
                        <Badge className={getStatusColor(pkg.status)}>
                          {pkg.status}
                        </Badge>
                        {pkg.scorm_version && (
                          <Badge variant="outline">
                            {pkg.scorm_version}
                          </Badge>
                        )}
                      </div>
                      
                      {pkg.description && (
                        <p className="text-muted-foreground mb-3 line-clamp-2">
                          {pkg.description}
                        </p>
                      )}

                      <div className="flex items-center gap-6 text-sm text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <Clock className="h-4 w-4" />
                          <span>
                            {formatDistanceToNow(new Date(pkg.updated_at), { addSuffix: true })}
                          </span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Eye className="h-4 w-4" />
                          <span>{pkg.access_count || 0} views</span>
                        </div>
                        {pkg.is_public && (
                          <Badge variant="secondary" className="text-xs">
                            Public
                          </Badge>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-2 ml-4">
                      {pkg.status === 'ready' && (
                        <>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => navigate(`/scorm/player/${pkg.id}?mode=preview`)}
                          >
                            <Eye className="h-4 w-4 mr-1" />
                            Preview
                          </Button>
                          <Button
                            size="sm"
                            onClick={() => navigate(`/scorm/player/${pkg.id}?mode=launch`)}
                          >
                            <Play className="h-4 w-4 mr-1" />
                            Launch
                          </Button>
                        </>
                      )}
                      
                      <Button variant="outline" size="sm">
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </div>
    </div>
  );
};