
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Settings, Users, History, TrendingUp, AlertTriangle } from 'lucide-react';
import { useThresholdManagement } from '@/hooks/useThresholdManagement';
import ThresholdConfigEditor from './ThresholdConfigEditor';
import UserSegmentManager from './UserSegmentManager';
import ThresholdAuditLog from './ThresholdAuditLog';

const ThresholdManagement: React.FC = () => {
  const { 
    thresholds, 
    userSegments, 
    auditLog, 
    isLoading, 
    updateThreshold, 
    createSegment,
    deleteThreshold 
  } = useThresholdManagement();

  const [activeTab, setActiveTab] = useState('configurations');

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'disabled':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-blue-100 text-blue-800';
    }
  };

  const getRiskLevelColor = (level: string) => {
    switch (level) {
      case 'critical':
        return 'text-red-600';
      case 'warning':
        return 'text-yellow-600';
      case 'info':
        return 'text-blue-600';
      default:
        return 'text-gray-600';
    }
  };

  if (isLoading) {
    return (
      <div className="p-6 space-y-6">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 rounded w-1/3"></div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-32 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Threshold Management</h1>
        <p className="text-gray-600">
          Configure anomaly detection thresholds, manage user segments, and monitor threshold performance.
        </p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="border-0 shadow-lg">
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <Settings className="h-8 w-8 text-blue-600" />
              <div>
                <p className="text-sm text-gray-500">Active Thresholds</p>
                <p className="text-2xl font-bold text-gray-900">
                  {thresholds.filter(t => t.status === 'active').length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg">
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <Users className="h-8 w-8 text-green-600" />
              <div>
                <p className="text-sm text-gray-500">User Segments</p>
                <p className="text-2xl font-bold text-gray-900">{userSegments.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg">
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <AlertTriangle className="h-8 w-8 text-red-600" />
              <div>
                <p className="text-sm text-gray-500">Critical Alerts</p>
                <p className="text-2xl font-bold text-gray-900">
                  {thresholds.filter(t => t.risk_level === 'critical').length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg">
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <TrendingUp className="h-8 w-8 text-purple-600" />
              <div>
                <p className="text-sm text-gray-500">Performance Score</p>
                <p className="text-2xl font-bold text-gray-900">87%</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="configurations">Threshold Configurations</TabsTrigger>
          <TabsTrigger value="segments">User Segments</TabsTrigger>
          <TabsTrigger value="audit">Audit Log</TabsTrigger>
        </TabsList>

        <TabsContent value="configurations" className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold">Threshold Configurations</h2>
            <Button onClick={() => {/* Handle create new threshold */}}>
              Create New Threshold
            </Button>
          </div>

          <div className="grid gap-4">
            {thresholds.map((threshold) => (
              <Card key={threshold.id} className="border-0 shadow-lg">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <h3 className="font-semibold text-lg">{threshold.metric_name}</h3>
                      <Badge className={getStatusColor(threshold.status)}>
                        {threshold.status}
                      </Badge>
                      <Badge variant="outline" className={getRiskLevelColor(threshold.risk_level)}>
                        {threshold.risk_level}
                      </Badge>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm">
                        Edit
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => deleteThreshold(threshold.id)}
                      >
                        Delete
                      </Button>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                    <div>
                      <span className="text-gray-500">Upper Threshold:</span>
                      <p className="font-medium">{threshold.upper_threshold}</p>
                    </div>
                    <div>
                      <span className="text-gray-500">Lower Threshold:</span>
                      <p className="font-medium">{threshold.lower_threshold}</p>
                    </div>
                    <div>
                      <span className="text-gray-500">Time Window:</span>
                      <p className="font-medium">{threshold.time_window}</p>
                    </div>
                    <div>
                      <span className="text-gray-500">Segment:</span>
                      <p className="font-medium">{threshold.user_segment || 'All Users'}</p>
                    </div>
                  </div>

                  {threshold.description && (
                    <p className="text-gray-600 mt-3">{threshold.description}</p>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="segments" className="space-y-6">
          <UserSegmentManager 
            segments={userSegments}
            onCreateSegment={createSegment}
          />
        </TabsContent>

        <TabsContent value="audit" className="space-y-6">
          <ThresholdAuditLog auditLog={auditLog} />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ThresholdManagement;
