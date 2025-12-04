import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { 
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { 
  BarChart3, 
  Users, 
  Clock, 
  TrendingUp, 
  Download,
  Calendar,
  CheckCircle,
  XCircle,
  AlertCircle
} from "lucide-react";

export function ScormAnalytics() {
  const [selectedPackage, setSelectedPackage] = useState("all");
  const [timeRange, setTimeRange] = useState("30d");

  // Mock data for analytics
  const mockPackages = [
    { id: "1", title: "Safety Training Module", enrollments: 45, completions: 38, avgScore: 87 },
    { id: "2", title: "Compliance Training", enrollments: 32, completions: 29, avgScore: 92 },
    { id: "3", title: "Product Knowledge", enrollments: 28, completions: 22, avgScore: 78 }
  ];

  const mockLearnerData = [
    { 
      id: "1", 
      name: "John Doe", 
      email: "john@example.com",
      package: "Safety Training Module",
      status: "completed",
      score: 95,
      timeSpent: "42 min",
      lastAccess: "2 hours ago"
    },
    { 
      id: "2", 
      name: "Sarah Johnson", 
      email: "sarah@example.com",
      package: "Compliance Training",
      status: "in_progress",
      score: null,
      timeSpent: "18 min",
      lastAccess: "1 day ago"
    },
    { 
      id: "3", 
      name: "Mike Wilson", 
      email: "mike@example.com",
      package: "Product Knowledge",
      status: "failed",
      score: 65,
      timeSpent: "35 min",
      lastAccess: "3 days ago"
    }
  ];

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'failed':
        return <XCircle className="h-4 w-4 text-red-500" />;
      case 'in_progress':
        return <AlertCircle className="h-4 w-4 text-yellow-500" />;
      default:
        return <AlertCircle className="h-4 w-4 text-gray-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
      case 'failed':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300';
      case 'in_progress':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header with Filters */}
      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between space-y-4 sm:space-y-0">
            <div>
              <CardTitle>SCORM Analytics</CardTitle>
              <CardDescription>
                Track learner progress, completion rates, and performance metrics
              </CardDescription>
            </div>
            <div className="flex items-center space-x-2">
              <Select value={selectedPackage} onValueChange={setSelectedPackage}>
                <SelectTrigger className="w-48">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Packages</SelectItem>
                  {mockPackages.map(pkg => (
                    <SelectItem key={pkg.id} value={pkg.id}>{pkg.title}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              
              <Select value={timeRange} onValueChange={setTimeRange}>
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="7d">7 days</SelectItem>
                  <SelectItem value="30d">30 days</SelectItem>
                  <SelectItem value="90d">90 days</SelectItem>
                  <SelectItem value="1y">1 year</SelectItem>
                </SelectContent>
              </Select>

              <Button variant="outline">
                <Download className="mr-2 h-4 w-4" />
                Export
              </Button>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Users className="h-5 w-5 text-primary" />
              <div>
                <p className="text-2xl font-bold">105</p>
                <p className="text-sm text-muted-foreground">Total Enrollments</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <CheckCircle className="h-5 w-5 text-green-500" />
              <div>
                <p className="text-2xl font-bold">89</p>
                <p className="text-sm text-muted-foreground">Completed</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <BarChart3 className="h-5 w-5 text-blue-500" />
              <div>
                <p className="text-2xl font-bold">85%</p>
                <p className="text-sm text-muted-foreground">Avg Score</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Clock className="h-5 w-5 text-purple-500" />
              <div>
                <p className="text-2xl font-bold">38m</p>
                <p className="text-sm text-muted-foreground">Avg Time</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Analytics Tabs */}
      <Tabs defaultValue="packages" className="space-y-4">
        <TabsList>
          <TabsTrigger value="packages">Package Performance</TabsTrigger>
          <TabsTrigger value="learners">Learner Progress</TabsTrigger>
          <TabsTrigger value="trends">Trends</TabsTrigger>
        </TabsList>

        <TabsContent value="packages">
          <Card>
            <CardHeader>
              <CardTitle>Package Performance</CardTitle>
              <CardDescription>
                Completion rates and scores by SCORM package
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Package</TableHead>
                    <TableHead>Enrollments</TableHead>
                    <TableHead>Completions</TableHead>
                    <TableHead>Completion Rate</TableHead>
                    <TableHead>Avg Score</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {mockPackages.map((pkg) => (
                    <TableRow key={pkg.id}>
                      <TableCell className="font-medium">{pkg.title}</TableCell>
                      <TableCell>{pkg.enrollments}</TableCell>
                      <TableCell>{pkg.completions}</TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          <div className="flex-1 bg-gray-200 rounded-full h-2">
                            <div 
                              className="bg-primary h-2 rounded-full" 
                              style={{
                                width: `${(pkg.completions / pkg.enrollments) * 100}%`
                              }}
                            />
                          </div>
                          <span className="text-sm font-medium">
                            {Math.round((pkg.completions / pkg.enrollments) * 100)}%
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">{pkg.avgScore}%</Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="learners">
          <Card>
            <CardHeader>
              <CardTitle>Learner Progress</CardTitle>
              <CardDescription>
                Individual learner performance and progress tracking
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Learner</TableHead>
                    <TableHead>Package</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Score</TableHead>
                    <TableHead>Time Spent</TableHead>
                    <TableHead>Last Access</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {mockLearnerData.map((learner) => (
                    <TableRow key={learner.id}>
                      <TableCell>
                        <div>
                          <p className="font-medium">{learner.name}</p>
                          <p className="text-sm text-muted-foreground">{learner.email}</p>
                        </div>
                      </TableCell>
                      <TableCell>{learner.package}</TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          {getStatusIcon(learner.status)}
                          <Badge className={getStatusColor(learner.status)}>
                            {learner.status.replace('_', ' ')}
                          </Badge>
                        </div>
                      </TableCell>
                      <TableCell>
                        {learner.score ? `${learner.score}%` : "-"}
                      </TableCell>
                      <TableCell>{learner.timeSpent}</TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {learner.lastAccess}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="trends">
          <Card>
            <CardHeader>
              <CardTitle>Performance Trends</CardTitle>
              <CardDescription>
                Historical performance and engagement metrics
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-12">
                <TrendingUp className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold mb-2">Trends Coming Soon</h3>
                <p className="text-muted-foreground">
                  Historical trends and analytics charts will be available in the next update.
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}