import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Progress } from '@/components/ui/progress';
import { 
  AlertTriangle, 
  Shield, 
  Clock, 
  CheckCircle, 
  XCircle, 
  AlertCircle,
  Activity,
  FileText,
  Users
} from 'lucide-react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { toast } from 'sonner';

interface SecurityIncidentSystems {
  systems?: string[];
  components?: string[];
  [key: string]: unknown;
}

interface SecurityIncidentDataTypes {
  phi?: boolean;
  personal_data?: boolean;
  financial?: boolean;
  [key: string]: unknown;
}

interface SecurityIncident {
  id: string;
  incident_type: string;
  severity_level: 'low' | 'medium' | 'high' | 'critical';
  description: string;
  incident_status: string;
  detection_timestamp: string;
  affected_users_count: number;
  regulatory_reporting_required: boolean;
  notifications_sent: SecurityIncidentSystems | null;
}

interface IncidentAction {
  id: string;
  incident_id: string;
  action_type: string;
  action_description: string;
  status: string;
  performed_at: string;
}

export function SecurityIncidentManager() {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [showCreateIncident, setShowCreateIncident] = useState(false);
  const [selectedIncident, setSelectedIncident] = useState<string | null>(null);

  // Fetch security incidents
  const { data: incidents, isLoading } = useQuery({
    queryKey: ['security-incidents'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('security_incidents')
        .select('*')
        .order('detection_timestamp', { ascending: false });
      
      if (error) throw error;
      return data as SecurityIncident[];
    },
  });

  // Fetch incident actions
  const { data: incidentActions } = useQuery({
    queryKey: ['incident-actions', selectedIncident],
    queryFn: async () => {
      if (!selectedIncident) return [];
      
      const { data, error } = await supabase
        .from('incident_response_actions')
        .select('*')
        .eq('incident_id', selectedIncident)
        .order('performed_at', { ascending: false });
      
      if (error) throw error;
      return data as IncidentAction[];
    },
    enabled: !!selectedIncident,
  });

  // Create incident mutation
  const createIncident = useMutation({
    mutationFn: async (incidentData: {
      incident_type: string;
      description: string;
      severity_level: string;
      affected_systems?: SecurityIncidentSystems;
      data_types_affected?: SecurityIncidentDataTypes;
    }) => {
      const { data, error } = await supabase.rpc('detect_security_incident', {
        p_incident_type: incidentData.incident_type,
        p_description: incidentData.description,
        p_severity_level: incidentData.severity_level,
        p_affected_systems: incidentData.affected_systems || null,
        p_data_types_affected: incidentData.data_types_affected || null,
      });
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['security-incidents'] });
      toast.success('Security incident created and response initiated');
      setShowCreateIncident(false);
    },
    onError: (error) => {
      toast.error('Failed to create incident: ' + error.message);
    },
  });

  // Update incident status mutation
  const updateIncidentStatus = useMutation({
    mutationFn: async ({ id, status }: { id: string; status: string }) => {
      const { data, error } = await supabase
        .from('security_incidents')
        .update({ 
          incident_status: status,
          ...(status === 'contained' && { containment_timestamp: new Date().toISOString() }),
          ...(status === 'resolved' && { resolution_timestamp: new Date().toISOString() }),
        })
        .eq('id', id);
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['security-incidents'] });
      toast.success('Incident status updated');
    },
    onError: (error) => {
      toast.error('Failed to update status: ' + error.message);
    },
  });

  // Add response action mutation
  const addResponseAction = useMutation({
    mutationFn: async (actionData: {
      incident_id: string;
      action_type: string;
      action_description: string;
    }) => {
      const { data, error } = await supabase
        .from('incident_response_actions')
        .insert({
          ...actionData,
          performed_by: user?.id,
        });
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['incident-actions'] });
      toast.success('Response action added');
    },
    onError: (error) => {
      toast.error('Failed to add action: ' + error.message);
    },
  });

  const handleCreateIncident = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    
    const incidentData = {
      incident_type: formData.get('incident_type') as string,
      description: formData.get('description') as string,
      severity_level: formData.get('severity_level') as string,
      affected_systems: formData.get('affected_systems') ? 
        JSON.parse(formData.get('affected_systems') as string) : null,
      data_types_affected: formData.get('data_types') ? 
        JSON.parse(formData.get('data_types') as string) : null,
    };
    
    createIncident.mutate(incidentData);
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'bg-red-100 text-red-800 border-red-200';
      case 'high': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low': return 'bg-blue-100 text-blue-800 border-blue-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'resolved': return 'bg-green-100 text-green-800';
      case 'contained': return 'bg-blue-100 text-blue-800';
      case 'investigating': return 'bg-yellow-100 text-yellow-800';
      case 'open': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getIncidentProgress = (incident: SecurityIncident) => {
    const statusOrder = ['open', 'investigating', 'contained', 'resolved', 'closed'];
    const currentIndex = statusOrder.indexOf(incident.incident_status);
    return ((currentIndex + 1) / statusOrder.length) * 100;
  };

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case 'critical': return <AlertTriangle className="h-5 w-5 text-red-600" />;
      case 'high': return <AlertCircle className="h-5 w-5 text-orange-600" />;
      case 'medium': return <Activity className="h-5 w-5 text-yellow-600" />;
      case 'low': return <Shield className="h-5 w-5 text-blue-600" />;
      default: return <Activity className="h-5 w-5 text-gray-600" />;
    }
  };

  if (isLoading) {
    return <div className="flex items-center justify-center p-8">Loading incidents...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Security Incident Management</h2>
          <p className="text-muted-foreground">Automated breach detection and response system</p>
        </div>
        <Dialog open={showCreateIncident} onOpenChange={setShowCreateIncident}>
          <DialogTrigger asChild>
            <Button className="bg-red-600 hover:bg-red-700">
              <AlertTriangle className="h-4 w-4 mr-2" />
              Report Incident
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Report Security Incident</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleCreateIncident} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="incident_type">Incident Type</Label>
                  <Select name="incident_type" required>
                    <SelectTrigger>
                      <SelectValue placeholder="Select incident type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="data_breach">Data Breach</SelectItem>
                      <SelectItem value="unauthorized_access">Unauthorized Access</SelectItem>
                      <SelectItem value="system_compromise">System Compromise</SelectItem>
                      <SelectItem value="malware_detection">Malware Detection</SelectItem>
                      <SelectItem value="phishing_attack">Phishing Attack</SelectItem>
                      <SelectItem value="insider_threat">Insider Threat</SelectItem>
                      <SelectItem value="ddos_attack">DDoS Attack</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="severity_level">Severity Level</Label>
                  <Select name="severity_level" required>
                    <SelectTrigger>
                      <SelectValue placeholder="Select severity" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="low">Low</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="high">High</SelectItem>
                      <SelectItem value="critical">Critical</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  name="description"
                  placeholder="Detailed description of the incident..."
                  required
                  rows={4}
                />
              </div>
              
              <div>
                <Label htmlFor="affected_systems">Affected Systems (JSON)</Label>
                <Textarea
                  id="affected_systems"
                  name="affected_systems"
                  placeholder='{"systems": ["web_app", "database"], "components": ["auth", "user_data"]}'
                  rows={2}
                />
              </div>
              
              <div>
                <Label htmlFor="data_types">Data Types Affected (JSON)</Label>
                <Textarea
                  id="data_types"
                  name="data_types"
                  placeholder='{"phi": true, "personal_data": true, "financial": false}'
                  rows={2}
                />
              </div>
              
              <div className="flex gap-2">
                <Button type="submit" disabled={createIncident.isPending}>
                  Create Incident
                </Button>
                <Button type="button" variant="outline" onClick={() => setShowCreateIncident(false)}>
                  Cancel
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Incident Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {['critical', 'high', 'medium', 'low'].map((severity) => {
          const count = incidents?.filter(i => i.severity_level === severity).length || 0;
          return (
            <Card key={severity}>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-2xl font-bold">{count}</p>
                    <p className="text-sm text-muted-foreground capitalize">{severity} Severity</p>
                  </div>
                  {getSeverityIcon(severity)}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Active Incidents */}
      <div className="grid gap-4">
        {incidents?.map((incident) => (
          <Card key={incident.id} className="cursor-pointer hover:bg-accent/50" 
                onClick={() => setSelectedIncident(incident.id === selectedIncident ? null : incident.id)}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  {getSeverityIcon(incident.severity_level)}
                  <div>
                    <CardTitle className="text-lg">{incident.incident_type.replace('_', ' ')}</CardTitle>
                    <p className="text-sm text-muted-foreground">
                      {new Date(incident.detection_timestamp).toLocaleString()}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge className={getSeverityColor(incident.severity_level)}>
                    {incident.severity_level}
                  </Badge>
                  <Badge className={getStatusColor(incident.incident_status)}>
                    {incident.incident_status}
                  </Badge>
                  {incident.regulatory_reporting_required && (
                    <Badge variant="outline" className="bg-purple-50 text-purple-700">
                      Regulatory Report Required
                    </Badge>
                  )}
                </div>
              </div>
              <Progress value={getIncidentProgress(incident)} className="mt-2" />
            </CardHeader>
            
            <CardContent>
              <div className="space-y-3">
                <p className="text-sm">{incident.description}</p>
                
                <div className="flex items-center gap-4 text-xs text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <Users className="h-3 w-3" />
                    {incident.affected_users_count} users affected
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    Detected: {new Date(incident.detection_timestamp).toLocaleDateString()}
                  </span>
                </div>

                {selectedIncident === incident.id && (
                  <div className="mt-4 space-y-4 border-t pt-4">
                    <div className="flex items-center justify-between">
                      <h4 className="font-medium">Incident Management</h4>
                      <div className="flex gap-2">
                        <Select onValueChange={(status) => updateIncidentStatus.mutate({ id: incident.id, status })}>
                          <SelectTrigger className="w-40">
                            <SelectValue placeholder="Update status" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="investigating">Investigating</SelectItem>
                            <SelectItem value="contained">Contained</SelectItem>
                            <SelectItem value="resolved">Resolved</SelectItem>
                            <SelectItem value="closed">Closed</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    {/* Response Actions */}
                    <div className="space-y-2">
                      <h5 className="font-medium text-sm">Response Actions</h5>
                      {incidentActions?.map((action) => (
                        <div key={action.id} className="flex items-center justify-between p-2 bg-muted rounded">
                          <div>
                            <p className="text-sm font-medium">{action.action_type.replace('_', ' ')}</p>
                            <p className="text-xs text-muted-foreground">{action.action_description}</p>
                          </div>
                          <Badge variant="outline" className={
                            action.status === 'completed' ? 'bg-green-50 text-green-700' :
                            action.status === 'in_progress' ? 'bg-blue-50 text-blue-700' :
                            'bg-yellow-50 text-yellow-700'
                          }>
                            {action.status.replace('_', ' ')}
                          </Badge>
                        </div>
                      ))}
                    </div>

                    {/* Quick Actions */}
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline">
                        <FileText className="h-4 w-4 mr-1" />
                        Generate Report
                      </Button>
                      <Button size="sm" variant="outline">
                        <Users className="h-4 w-4 mr-1" />
                        Notify Stakeholders
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {incidents?.length === 0 && (
        <Card>
          <CardContent className="p-8 text-center">
            <Shield className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium mb-2">No Security Incidents</h3>
            <p className="text-muted-foreground">
              All systems are secure. Automated monitoring is active.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}