import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Upload, Package, Play, Settings, BarChart3, 
  FileText, Clock, Users, ChevronRight, Plus,
  Search, Filter, MoreVertical, Eye, Edit, Trash2
} from 'lucide-react';
import { Input } from '@/components/ui/input';
import { useScormPackages } from '@/hooks/useScormPackages';
import { useNavigate } from 'react-router-dom';
import { formatDistanceToNow } from 'date-fns';
import { ScormAnalytics } from '@/scorm/analytics/ScormAnalytics';
import { useScormKPIs } from '@/hooks/useScormAnalytics';

export const ScormStudio: React.FC = () => {
  const navigate = useNavigate();
  const { packages, isLoading } = useScormPackages();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  // Get real analytics data for the header KPIs
  const kpisQuery = useScormKPIs({
    // Force fresh data by adding timestamp to query key
    _timestamp: Date.now()
  });

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
              <p className="text-muted-foreground">Upload, manage, and deploy SCORM packages for your learning platform</p>
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

      {/* Header KPIs */}
      <div className="border-b bg-muted/50">
        <div className="container mx-auto px-6 py-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Total Packages</p>
                    {kpisQuery.isLoading ? (
                      <div className="h-8 w-16 bg-muted animate-pulse rounded" />
                    ) : (
                      <p className="text-2xl font-bold">{kpisQuery.data?.totalPackages || 0}</p>
                    )}
                  </div>
                  <Package className="h-8 w-8 text-primary" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Active Enrollments</p>
                    {kpisQuery.isLoading ? (
                      <div className="h-8 w-16 bg-muted animate-pulse rounded" />
                    ) : (
                      <p className="text-2xl font-bold">{kpisQuery.data?.activeEnrollments || 0}</p>
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
                    <p className="text-sm font-medium text-muted-foreground">Completion Rate</p>
                    {kpisQuery.isLoading ? (
                      <div className="h-8 w-16 bg-muted animate-pulse rounded" />
                    ) : (
                      <p className="text-2xl font-bold">{Math.round(kpisQuery.data?.completionRate || 0)}%</p>
                    )}
                  </div>
                  <BarChart3 className="h-8 w-8 text-green-600" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Avg Score</p>
                    {kpisQuery.isLoading ? (
                      <div className="h-8 w-16 bg-muted animate-pulse rounded" />
                    ) : (
                      <p className="text-2xl font-bold">{Math.round(kpisQuery.data?.avgScore || 0)}%</p>
                    )}
                  </div>
                  <BarChart3 className="h-8 w-8 text-purple-600" />
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 py-6">
        <Tabs defaultValue="packages" className="space-y-6">
          <TabsList>
            <TabsTrigger value="packages">Packages</TabsTrigger>
            <TabsTrigger value="upload">Upload</TabsTrigger>
            <TabsTrigger value="catalog">Catalog</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
            <TabsTrigger value="qa-tests">QA Tests</TabsTrigger>
          </TabsList>

          <TabsContent value="packages" className="space-y-6">
            {/* Filters and Search */}
            <Card>
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
          </TabsContent>

          <TabsContent value="upload">
            <Card>
              <CardContent className="p-6">
                <div className="text-center py-8">
                  <Upload className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">Upload SCORM Package</h3>
                  <p className="text-muted-foreground mb-4">
                    Navigate to the upload page to add new SCORM packages.
                  </p>
                  <Button onClick={() => navigate('/scorm/upload')}>
                    <Upload className="h-4 w-4 mr-2" />
                    Go to Upload
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="catalog">
            <Card>
              <CardContent className="p-6">
                <div className="text-center py-8">
                  <Package className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">SCORM Catalog</h3>
                  <p className="text-muted-foreground mb-4">
                    View and manage published SCORM packages for learner assignment.
                  </p>
                  <Button>
                    <Package className="h-4 w-4 mr-2" />
                    View Catalog
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="analytics">
            <ScormAnalytics />
          </TabsContent>

          <TabsContent value="qa-tests">
            <Card>
              <CardContent className="p-6">
                <div className="text-center py-8">
                  <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">QA Tests</h3>
                  <p className="text-muted-foreground mb-4">
                    Test SCORM packages for compatibility and compliance.
                  </p>
                  <Button variant="outline">
                    <FileText className="h-4 w-4 mr-2" />
                    Coming Soon
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};