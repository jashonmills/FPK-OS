import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  Upload, Package, Play, Settings, BarChart3, 
  FileText, Clock, Users, ChevronRight, Plus,
  Search, Filter, MoreVertical, Eye, Edit, Trash2, AlertCircle
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { formatDistanceToNow } from 'date-fns';
import { ScormAnalytics } from '@/scorm/analytics/ScormAnalytics';
import { 
  useScormSummary, 
  useScormPackages, 
  exportToCSV,
  type PackageMetric 
} from '@/hooks/scorm/useScormAnalytics';

export const ScormStudio: React.FC = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;

  // Get real analytics data for the header KPIs
  const summaryQuery = useScormSummary({});
  
  // Get packages data
  const packagesQuery = useScormPackages({
    limit: pageSize,
    offset: (currentPage - 1) * pageSize,
    search: searchTerm,
    status: statusFilter
  });

  const handleExportPackages = () => {
    if (summaryQuery.data?.packages) {
      exportToCSV(summaryQuery.data.packages, 'scorm-packages');
    }
  };

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

  return (
    <div className="space-y-6">
      {/* Header KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Packages</p>
                {summaryQuery.isLoading ? (
                  <div className="h-8 w-16 bg-muted animate-pulse rounded" />
                ) : (
                  <p className="text-2xl font-bold">{summaryQuery.data?.totalPackages || 0}</p>
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
              <BarChart3 className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Avg Time</p>
                {summaryQuery.isLoading ? (
                  <div className="h-8 w-16 bg-muted animate-pulse rounded" />
                ) : (
                  <p className="text-2xl font-bold">{summaryQuery.data?.avgMinutes || 0}m</p>
                )}
              </div>
              <Clock className="h-8 w-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content with Tabs */}
      <Tabs defaultValue="packages" className="space-y-4">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="packages">Packages</TabsTrigger>
          <TabsTrigger value="upload">Upload</TabsTrigger>
          <TabsTrigger value="catalog">Catalog</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="qa">QA Tests</TabsTrigger>
        </TabsList>

        <TabsContent value="packages" className="space-y-4">
          {/* Filters */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>SCORM Packages</span>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" onClick={handleExportPackages}>
                    <FileText className="h-4 w-4 mr-2" />
                    Export CSV
                  </Button>
                  <Button onClick={() => navigate('/scorm/upload')}>
                    <Upload className="h-4 w-4 mr-2" />
                    Upload Package
                  </Button>
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-4 mb-4">
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

          {/* Packages List */}
          <Card>
            <CardContent className="p-0">
              {packagesQuery.isLoading ? (
                <div className="p-6">
                  <div className="space-y-3">
                    {[...Array(5)].map((_, i) => (
                      <div key={i} className="h-16 bg-muted animate-pulse rounded" />
                    ))}
                  </div>
                </div>
              ) : packagesQuery.data?.packages.length === 0 ? (
                <div className="text-center py-12">
                  <Package className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                  <h3 className="text-lg font-semibold mb-2">No SCORM packages found</h3>
                  <p className="text-muted-foreground mb-4">
                    {searchTerm || statusFilter !== 'all' 
                      ? "No packages match your search criteria." 
                      : "Upload your first SCORM package to get started."}
                  </p>
                  <Button onClick={() => navigate('/scorm/upload')}>
                    <Upload className="mr-2 h-4 w-4" />
                    Upload Package
                  </Button>
                </div>
              ) : (
                <div className="p-6">
                  <div className="space-y-4">
                    {packagesQuery.data?.packages.map((pkg: any) => (
                      <div key={pkg.id} className="flex items-center justify-between p-4 border rounded-lg">
                        <div className="flex-1">
                          <div className="flex items-center gap-3">
                            <div className="p-2 bg-primary/10 rounded-lg">
                              <Package className="h-5 w-5 text-primary" />
                            </div>
                            <div>
                              <h4 className="font-medium">{pkg.title}</h4>
                              <p className="text-sm text-muted-foreground">
                                {pkg.description || 'No description provided'}
                              </p>
                              <div className="flex items-center gap-2 mt-1">
                                <Badge className={getStatusColor(pkg.status)}>
                                  {pkg.status}
                                </Badge>
                                <span className="text-xs text-muted-foreground">
                                  Updated {formatDistanceToNow(new Date(pkg.updated_at), { addSuffix: true })}
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => navigate(`/scorm/packages/${pkg.id}`)}
                          >
                            <Eye className="mr-1 h-3 w-3" />
                            View
                          </Button>
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => navigate(`/scorm/player/${pkg.id}`)}
                          >
                            <Play className="mr-1 h-3 w-3" />
                            Launch
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Pagination */}
                  {packagesQuery.data && packagesQuery.data.total > pageSize && (
                    <div className="flex items-center justify-between pt-4 mt-4 border-t">
                      <p className="text-sm text-muted-foreground">
                        Showing {((currentPage - 1) * pageSize) + 1} to{' '}
                        {Math.min(currentPage * pageSize, packagesQuery.data.total)} of{' '}
                        {packagesQuery.data.total} results
                      </p>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          disabled={currentPage === 1}
                          onClick={() => setCurrentPage(currentPage - 1)}
                        >
                          Previous
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          disabled={currentPage * pageSize >= packagesQuery.data.total}
                          onClick={() => setCurrentPage(currentPage + 1)}
                        >
                          Next
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="upload" className="space-y-4">
          <Card>
            <CardContent className="p-12 text-center">
              <Upload className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">Upload SCORM Package</h3>
              <p className="text-muted-foreground mb-4">
                Upload and deploy SCORM 1.2 or SCORM 2004 packages to your learning platform.
              </p>
              <Button onClick={() => navigate('/scorm/upload')}>
                <Upload className="mr-2 h-4 w-4" />
                Start Upload
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="catalog" className="space-y-4">
          <Card>
            <CardContent className="p-12 text-center">
              <Package className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">Package Catalog</h3>
              <p className="text-muted-foreground mb-4">
                Browse and manage your SCORM package library with advanced filtering and search.
              </p>
              <Button onClick={() => navigate('/scorm/packages')}>
                <Eye className="mr-2 h-4 w-4" />
                Browse Catalog
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-4">
          <ScormAnalytics />
        </TabsContent>

        <TabsContent value="qa" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="h-5 w-5" />
                QA Tests & Dev Tools
                <Badge variant="secondary">Admin Only</Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <p className="text-muted-foreground">
                  Development and quality assurance tools for SCORM package testing.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Card>
                    <CardContent className="p-4">
                      <h4 className="font-medium mb-2">Package Validation</h4>
                      <p className="text-sm text-muted-foreground mb-3">
                        Validate SCORM package structure and manifest files.
                      </p>
                      <Button variant="outline" size="sm">Run Validation</Button>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="p-4">
                      <h4 className="font-medium mb-2">Runtime Testing</h4>
                      <p className="text-sm text-muted-foreground mb-3">
                        Test SCORM runtime API calls and data persistence.
                      </p>
                      <Button variant="outline" size="sm">Test Runtime</Button>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};