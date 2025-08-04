import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Shield, 
  AlertTriangle, 
  CheckCircle, 
  FileText, 
  Users, 
  TrendingUp,
  Calendar,
  Download,
  Eye,
  Settings
} from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { HIPAAAccessControl } from './HIPAAAccessControl';
import { SecurityIncidentManager } from './SecurityIncidentManager';
import { ComplianceTrainingCenter } from './ComplianceTrainingCenter';

interface ComplianceMetric {
  name: string;
  value: number;
  target: number;
  status: 'good' | 'warning' | 'critical';
  trend: 'up' | 'down' | 'stable';
}

interface ComplianceAssessment {
  id: string;
  assessment_name: string;
  framework: string;
  overall_score: number;
  risk_level: string;
  status: string;
  assessment_date: string;
  next_assessment_due: string;
}

export function AdminComplianceCenter() {
  const [selectedTab, setSelectedTab] = useState('dashboard');

  // Fetch compliance assessments
  const { data: assessments } = useQuery({
    queryKey: ['compliance-assessments'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('compliance_assessments')
        .select('*')
        .order('assessment_date', { ascending: false });
      
      if (error) throw error;
      return data as ComplianceAssessment[];
    },
  });

  // Fetch security incidents summary
  const { data: incidentsSummary } = useQuery({
    queryKey: ['incidents-summary'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('security_incidents')
        .select('severity_level, incident_status')
        .gte('detection_timestamp', new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString());
      
      if (error) throw error;
      return data;
    },
  });

  // Fetch training completion stats
  const { data: trainingStats } = useQuery({
    queryKey: ['training-stats'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('user_training_completions')
        .select('passed, training_module_id, user_id')
        .gte('completion_date', new Date(Date.now() - 90 * 24 * 60 * 60 * 1000).toISOString());
      
      if (error) throw error;
      return data;
    },
  });

  // Calculate compliance metrics
  const getComplianceMetrics = (): ComplianceMetric[] => {
    const totalUsers = 100; // This would come from user count query
    const completedTraining = trainingStats?.filter(t => t.passed).length || 0;
    const trainingCompletionRate = totalUsers > 0 ? (completedTraining / totalUsers) * 100 : 0;

    const openIncidents = incidentsSummary?.filter(i => i.incident_status === 'open').length || 0;
    const criticalIncidents = incidentsSummary?.filter(i => i.severity_level === 'critical').length || 0;

    const latestAssessment = assessments?.[0];
    const complianceScore = latestAssessment?.overall_score || 0;

    return [
      {
        name: 'Overall Compliance Score',
        value: complianceScore,
        target: 90,
        status: complianceScore >= 90 ? 'good' : complianceScore >= 75 ? 'warning' : 'critical',
        trend: 'up'
      },
      {
        name: 'Training Completion Rate',
        value: trainingCompletionRate,
        target: 95,
        status: trainingCompletionRate >= 95 ? 'good' : trainingCompletionRate >= 80 ? 'warning' : 'critical',
        trend: 'up'
      },
      {
        name: 'Open Security Incidents',
        value: openIncidents,
        target: 0,
        status: openIncidents === 0 ? 'good' : openIncidents <= 2 ? 'warning' : 'critical',
        trend: 'stable'
      },
      {
        name: 'Critical Incidents (30d)',
        value: criticalIncidents,
        target: 0,
        status: criticalIncidents === 0 ? 'good' : 'critical',
        trend: 'down'
      }
    ];
  };

  const metrics = getComplianceMetrics();

  const getMetricColor = (status: string) => {
    switch (status) {
      case 'good': return 'text-green-600';
      case 'warning': return 'text-yellow-600';
      case 'critical': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  const getRiskLevelColor = (level: string) => {
    switch (level?.toLowerCase()) {
      case 'low': return 'bg-green-100 text-green-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'high': return 'bg-orange-100 text-orange-800';
      case 'critical': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getFrameworkIcon = (framework: string) => {
    switch (framework?.toUpperCase()) {
      case 'HIPAA': return '🏥';
      case 'GDPR': return '🇪🇺';
      case 'SOC2': return '🔐';
      case 'ISO27001': return '📋';
      default: return '📊';
    }
  };

  if (selectedTab !== 'dashboard') {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Button 
            variant="outline" 
            onClick={() => setSelectedTab('dashboard')}
            className="mb-4"
          >
            ← Back to Dashboard
          </Button>
        </div>
        
        {selectedTab === 'hipaa' && <HIPAAAccessControl />}
        {selectedTab === 'incidents' && <SecurityIncidentManager />}
        {selectedTab === 'training' && <ComplianceTrainingCenter />}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Admin Compliance Center</h1>
          <p className="text-muted-foreground">Comprehensive compliance management and monitoring</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Export Report
          </Button>
          <Button>
            <Settings className="h-4 w-4 mr-2" />
            Settings
          </Button>
        </div>
      </div>

      {/* Compliance Metrics Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {metrics.map((metric) => (
          <Card key={metric.name}>
            <CardContent className="p-4">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">{metric.name}</span>
                  <TrendingUp className={`h-4 w-4 ${metric.trend === 'up' ? 'text-green-600' : 
                    metric.trend === 'down' ? 'text-red-600' : 'text-gray-600'}`} />
                </div>
                <div className="flex items-center justify-between">
                  <span className={`text-2xl font-bold ${getMetricColor(metric.status)}`}>
                    {metric.value.toFixed(metric.name.includes('Rate') ? 1 : 0)}
                    {metric.name.includes('Rate') ? '%' : ''}
                  </span>
                  <Badge className={
                    metric.status === 'good' ? 'bg-green-100 text-green-800' :
                    metric.status === 'warning' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-red-100 text-red-800'
                  }>
                    {metric.status}
                  </Badge>
                </div>
                <Progress 
                  value={metric.name.includes('Incidents') ? 
                    Math.max(0, 100 - (metric.value / Math.max(metric.target, 1)) * 100) :
                    (metric.value / metric.target) * 100
                  } 
                  className="h-2" 
                />
                <p className="text-xs text-muted-foreground">
                  Target: {metric.target}{metric.name.includes('Rate') ? '%' : ''}
                </p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="cursor-pointer hover:bg-accent/50" onClick={() => setSelectedTab('hipaa')}>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-blue-100 rounded-lg">
                <Shield className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <h3 className="font-semibold">HIPAA Access Control</h3>
                <p className="text-sm text-muted-foreground">Manage access roles and certifications</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="cursor-pointer hover:bg-accent/50" onClick={() => setSelectedTab('incidents')}>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-red-100 rounded-lg">
                <AlertTriangle className="h-6 w-6 text-red-600" />
              </div>
              <div>
                <h3 className="font-semibold">Security Incidents</h3>
                <p className="text-sm text-muted-foreground">Monitor and respond to threats</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="cursor-pointer hover:bg-accent/50" onClick={() => setSelectedTab('training')}>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-green-100 rounded-lg">
                <Users className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <h3 className="font-semibold">Training Center</h3>
                <p className="text-sm text-muted-foreground">Track compliance training</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Assessments */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Recent Compliance Assessments</CardTitle>
            <Button variant="outline" size="sm">
              <Eye className="h-4 w-4 mr-2" />
              View All
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {assessments?.slice(0, 3).map((assessment) => (
              <div key={assessment.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center gap-4">
                  <div className="text-2xl">{getFrameworkIcon(assessment.framework)}</div>
                  <div>
                    <h4 className="font-medium">{assessment.assessment_name}</h4>
                    <p className="text-sm text-muted-foreground">
                      {assessment.framework} • {new Date(assessment.assessment_date).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-center">
                    <p className="text-2xl font-bold">{assessment.overall_score?.toFixed(1) || 'N/A'}</p>
                    <p className="text-xs text-muted-foreground">Score</p>
                  </div>
                  <Badge className={getRiskLevelColor(assessment.risk_level)}>
                    {assessment.risk_level || 'Unknown'} Risk
                  </Badge>
                  <Badge variant="outline">
                    {assessment.status}
                  </Badge>
                </div>
              </div>
            ))}

            {(!assessments || assessments.length === 0) && (
              <div className="text-center py-8">
                <FileText className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium mb-2">No Assessments Yet</h3>
                <p className="text-muted-foreground mb-4">
                  Start your first compliance assessment to track your progress.
                </p>
                <Button>
                  <FileText className="h-4 w-4 mr-2" />
                  Create Assessment
                </Button>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Compliance Alerts */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-orange-700">Compliance Alerts</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Alert>
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>
                5 users have expired HIPAA training certificates
              </AlertDescription>
            </Alert>
            <Alert>
              <Calendar className="h-4 w-4" />
              <AlertDescription>
                Annual GDPR assessment due in 15 days
              </AlertDescription>
            </Alert>
            <Alert>
              <FileText className="h-4 w-4" />
              <AlertDescription>
                Data retention policy requires review
              </AlertDescription>
            </Alert>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-green-700">Recent Achievements</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center gap-3">
              <CheckCircle className="h-5 w-5 text-green-600" />
              <span className="text-sm">100% data breach response procedures updated</span>
            </div>
            <div className="flex items-center gap-3">
              <CheckCircle className="h-5 w-5 text-green-600" />
              <span className="text-sm">Zero critical security incidents this month</span>
            </div>
            <div className="flex items-center gap-3">
              <CheckCircle className="h-5 w-5 text-green-600" />
              <span className="text-sm">SOC2 Type II certification maintained</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Compliance Status Summary */}
      <Alert>
        <Shield className="h-4 w-4" />
        <AlertDescription>
          <strong>Compliance Status: EXCELLENT</strong> - All critical requirements are met. 
          Continue monitoring and maintain current procedures for optimal compliance posture.
        </AlertDescription>
      </Alert>
    </div>
  );
}