import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  BarChart3, Users, Package, TrendingUp, Download, Search,
  Calendar, Filter, RefreshCw, AlertCircle, Eye, ArrowUpRight
} from 'lucide-react';
import {
  useScormKPIs,
  usePackagePerformance,
  useLearnerProgress,
  useScormTrends,
  useScormPackagesList,
  exportAnalytics
} from '@/hooks/useScormAnalytics';
import { formatDistanceToNow } from 'date-fns';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, BarChart, Bar, AreaChart, Area } from 'recharts';
import { useToast } from '@/hooks/use-toast';

export const ScormAnalytics: React.FC = () => {
  const { toast } = useToast();
  const [filters, setFilters] = useState({
    packageId: undefined as string | undefined,
    dateRange: '30',
    search: '',
    page: 1,
    pageSize: 25
  });

  // Calculate date range
  const dateRange = useMemo(() => {
    const days = parseInt(filters.dateRange);
    const dateTo = new Date().toISOString();
    const dateFrom = new Date(Date.now() - days * 24 * 60 * 60 * 1000).toISOString();
    return { dateFrom, dateTo };
  }, [filters.dateRange]);

  // Data hooks
  const kpisQuery = useScormKPIs({ ...filters, ...dateRange });
  const performanceQuery = usePackagePerformance({ ...filters, ...dateRange });
  const progressQuery = useLearnerProgress({ ...filters, ...dateRange });
  const trendsQuery = useScormTrends({ ...filters, ...dateRange });
  const packagesQuery = useScormPackagesList();

  const handleExport = async (view: 'packages' | 'learners' | 'trends') => {
    try {
      await exportAnalytics(view, { ...filters, ...dateRange });
      toast({
        title: "Export Started",
        description: "Your analytics data is being prepared for download.",
      });
    } catch (error: any) {
      toast({
        title: "Export Failed",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const updateFilters = (updates: Partial<typeof filters>) => {
    setFilters(prev => ({ ...prev, ...updates, page: 1 }));
  };

  return (
    <div className="space-y-6">
      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Analytics Filters
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="package-select">Package</Label>
              <Select
                value={filters.packageId || 'all'}
                onValueChange={(value) => updateFilters({ packageId: value === 'all' ? undefined : value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="All Packages" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Packages</SelectItem>
                  {packagesQuery.data?.map((pkg) => (
                    <SelectItem key={pkg.id} value={pkg.id}>
                      {pkg.title}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="date-range">Date Range</Label>
              <Select
                value={filters.dateRange}
                onValueChange={(value) => updateFilters({ dateRange: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="7">Last 7 days</SelectItem>
                  <SelectItem value="30">Last 30 days</SelectItem>
                  <SelectItem value="90">Last 90 days</SelectItem>
                  <SelectItem value="365">Last year</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="search">Search Learners</Label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="search"
                  placeholder="Search by name or email..."
                  value={filters.search}
                  onChange={(e) => updateFilters({ search: e.target.value })}
                  className="pl-10"
                />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
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
              <TrendingUp className="h-8 w-8 text-green-600" />
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

      {/* Tabs */}
      <Tabs defaultValue="packages" className="space-y-4">
        <TabsList>
          <TabsTrigger value="packages">Package Performance</TabsTrigger>
          <TabsTrigger value="learners">Learner Progress</TabsTrigger>
          <TabsTrigger value="trends">Trends</TabsTrigger>
        </TabsList>

        <TabsContent value="packages" className="space-y-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Package Performance</CardTitle>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleExport('packages')}
                disabled={performanceQuery.isLoading}
              >
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>
            </CardHeader>
            <CardContent>
              {performanceQuery.isLoading ? (
                <div className="space-y-3">
                  {[...Array(5)].map((_, i) => (
                    <div key={i} className="h-16 bg-muted animate-pulse rounded" />
                  ))}
                </div>
              ) : performanceQuery.data?.length === 0 ? (
                <div className="text-center py-8">
                  <AlertCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">No Data Available</h3>
                  <p className="text-muted-foreground">No packages found for the selected criteria.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {performanceQuery.data?.map((pkg) => (
                    <div key={pkg.packageId} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex-1">
                        <h4 className="font-medium">{pkg.packageTitle}</h4>
                        <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
                          <span>{pkg.enrollments} enrollments</span>
                          <span>{pkg.completions} completions</span>
                          <Badge variant={pkg.completionRate > 70 ? 'default' : 'secondary'}>
                            {pkg.completionRate}% completion
                          </Badge>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-2xl font-bold">{Math.round(pkg.avgScore)}%</p>
                        <p className="text-sm text-muted-foreground">avg score</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="learners" className="space-y-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Learner Progress</CardTitle>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleExport('learners')}
                disabled={progressQuery.isLoading}
              >
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>
            </CardHeader>
            <CardContent>
              {progressQuery.isLoading ? (
                <div className="space-y-3">
                  {[...Array(10)].map((_, i) => (
                    <div key={i} className="h-12 bg-muted animate-pulse rounded" />
                  ))}
                </div>
              ) : progressQuery.data?.data.length === 0 ? (
                <div className="text-center py-8">
                  <AlertCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">No Progress Data</h3>
                  <p className="text-muted-foreground">No learner progress found for the selected criteria.</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {progressQuery.data?.data.map((learner) => (
                    <div key={`${learner.userId}-${learner.packageId}`} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex-1">
                        <div className="flex items-center gap-3">
                          <div>
                            <p className="font-medium">{learner.learnerName}</p>
                            <p className="text-sm text-muted-foreground">{learner.packageTitle}</p>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="text-center">
                          <p className="text-sm font-medium">{learner.progressPct}%</p>
                          <p className="text-xs text-muted-foreground">
                            {learner.scosCompleted}/{learner.scosTotal} SCOs
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm text-muted-foreground">
                            {learner.lastActivity 
                              ? formatDistanceToNow(new Date(learner.lastActivity), { addSuffix: true })
                              : 'Never'
                            }
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                  
                  {/* Pagination */}
                  {progressQuery.data && progressQuery.data.total > filters.pageSize && (
                    <div className="flex items-center justify-between pt-4">
                      <p className="text-sm text-muted-foreground">
                        Showing {((filters.page - 1) * filters.pageSize) + 1} to{' '}
                        {Math.min(filters.page * filters.pageSize, progressQuery.data.total)} of{' '}
                        {progressQuery.data.total} results
                      </p>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          disabled={filters.page === 1}
                          onClick={() => updateFilters({ page: filters.page - 1 })}
                        >
                          Previous
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          disabled={filters.page * filters.pageSize >= progressQuery.data.total}
                          onClick={() => updateFilters({ page: filters.page + 1 })}
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

        <TabsContent value="trends" className="space-y-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Analytics Trends</CardTitle>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleExport('trends')}
                disabled={trendsQuery.isLoading}
              >
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>
            </CardHeader>
            <CardContent>
              {trendsQuery.isLoading ? (
                <div className="h-80 bg-muted animate-pulse rounded" />
              ) : trendsQuery.data?.length === 0 ? (
                <div className="text-center py-16">
                  <AlertCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">No Trend Data</h3>
                  <p className="text-muted-foreground">No activity found for the selected period.</p>
                </div>
              ) : (
                <div className="space-y-6">
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={trendsQuery.data}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="date" />
                        <YAxis />
                        <Tooltip />
                        <Line type="monotone" dataKey="enrollments" stroke="#8884d8" name="Enrollments" />
                        <Line type="monotone" dataKey="activeLearners" stroke="#82ca9d" name="Active Learners" />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>

                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={trendsQuery.data}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="date" />
                        <YAxis />
                        <Tooltip />
                        <Area type="monotone" dataKey="avgScore" stroke="#ffc658" fill="#ffc658" name="Avg Score %" />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};