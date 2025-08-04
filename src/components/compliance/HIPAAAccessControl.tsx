import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Shield, AlertTriangle, Clock, User, CheckCircle, XCircle } from 'lucide-react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { toast } from 'sonner';

interface EmergencyAccessRequest {
  id: string;
  requestor_id: string;
  requested_resource: string;
  justification: string;
  emergency_type: string;
  approval_status: 'pending' | 'approved' | 'denied' | 'expired';
  expires_at: string;
  created_at: string;
}

interface UserCertification {
  id: string;
  user_id: string;
  certification_type: string;
  status: string;
  expiry_date: string;
  training_completed: boolean;
}

export function HIPAAAccessControl() {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [selectedTab, setSelectedTab] = useState('roles');
  const [showEmergencyRequest, setShowEmergencyRequest] = useState(false);

  // Fetch HIPAA access roles
  const { data: hipaaRoles } = useQuery({
    queryKey: ['hipaa-roles'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('hipaa_access_roles')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data;
    },
  });

  // Fetch emergency access requests
  const { data: emergencyRequests } = useQuery({
    queryKey: ['emergency-requests'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('emergency_access_requests')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data as EmergencyAccessRequest[];
    },
  });

  // Fetch user certifications
  const { data: certifications } = useQuery({
    queryKey: ['user-certifications'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('user_access_certifications')
        .select('*')
        .order('expiry_date', { ascending: true });
      
      if (error) throw error;
      return data as UserCertification[];
    },
  });

  // Create emergency access request mutation
  const createEmergencyRequest = useMutation({
    mutationFn: async (requestData: {
      requested_resource: string;
      justification: string;
      emergency_type: string;
      expires_at: string;
    }) => {
      const { data, error } = await supabase
        .from('emergency_access_requests')
        .insert({
          ...requestData,
          requestor_id: user?.id,
        });
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['emergency-requests'] });
      toast.success('Emergency access request submitted');
      setShowEmergencyRequest(false);
    },
    onError: (error) => {
      toast.error('Failed to submit emergency request: ' + error.message);
    },
  });

  // Approve/deny emergency request mutation
  const updateEmergencyRequest = useMutation({
    mutationFn: async ({ id, status }: { id: string; status: 'approved' | 'denied' }) => {
      const { data, error } = await supabase
        .from('emergency_access_requests')
        .update({
          approval_status: status,
          approved_by: user?.id,
          approved_at: new Date().toISOString(),
          access_granted: status === 'approved',
        })
        .eq('id', id);
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['emergency-requests'] });
      toast.success('Emergency request updated');
    },
    onError: (error) => {
      toast.error('Failed to update request: ' + error.message);
    },
  });

  const handleEmergencyRequestSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    
    const requestData = {
      requested_resource: formData.get('resource') as string,
      justification: formData.get('justification') as string,
      emergency_type: formData.get('emergency_type') as string,
      expires_at: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(), // 24 hours from now
    };
    
    createEmergencyRequest.mutate(requestData);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved': return 'bg-green-100 text-green-800';
      case 'denied': return 'bg-red-100 text-red-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'expired': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getCertificationStatus = (cert: UserCertification) => {
    const expiryDate = new Date(cert.expiry_date);
    const now = new Date();
    const daysUntilExpiry = Math.ceil((expiryDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
    
    if (daysUntilExpiry <= 0) return { status: 'expired', color: 'bg-red-100 text-red-800' };
    if (daysUntilExpiry <= 30) return { status: 'expiring', color: 'bg-yellow-100 text-yellow-800' };
    return { status: 'active', color: 'bg-green-100 text-green-800' };
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">HIPAA Access Control</h2>
          <p className="text-muted-foreground">Manage access controls and certifications</p>
        </div>
        <Dialog open={showEmergencyRequest} onOpenChange={setShowEmergencyRequest}>
          <DialogTrigger asChild>
            <Button variant="outline" className="text-orange-600">
              <AlertTriangle className="h-4 w-4 mr-2" />
              Emergency Access
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Request Emergency Access</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleEmergencyRequestSubmit} className="space-y-4">
              <div>
                <Label htmlFor="resource">Requested Resource</Label>
                <Input
                  id="resource"
                  name="resource"
                  placeholder="e.g., Patient Record #12345"
                  required
                />
              </div>
              <div>
                <Label htmlFor="emergency_type">Emergency Type</Label>
                <Select name="emergency_type" required>
                  <SelectTrigger>
                    <SelectValue placeholder="Select emergency type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="medical_emergency">Medical Emergency</SelectItem>
                    <SelectItem value="system_outage">System Outage</SelectItem>
                    <SelectItem value="security_incident">Security Incident</SelectItem>
                    <SelectItem value="regulatory_inquiry">Regulatory Inquiry</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="justification">Justification</Label>
                <Textarea
                  id="justification"
                  name="justification"
                  placeholder="Detailed justification for emergency access..."
                  required
                  rows={4}
                />
              </div>
              <div className="flex gap-2">
                <Button type="submit" disabled={createEmergencyRequest.isPending}>
                  Submit Request
                </Button>
                <Button type="button" variant="outline" onClick={() => setShowEmergencyRequest(false)}>
                  Cancel
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Tabs value={selectedTab} onValueChange={setSelectedTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="roles">Access Roles</TabsTrigger>
          <TabsTrigger value="emergency">Emergency Requests</TabsTrigger>
          <TabsTrigger value="certifications">Certifications</TabsTrigger>
          <TabsTrigger value="audit">Audit Log</TabsTrigger>
        </TabsList>

        <TabsContent value="roles" className="space-y-4">
          <Alert>
            <Shield className="h-4 w-4" />
            <AlertDescription>
              HIPAA access roles define the minimum necessary access levels for different user types.
            </AlertDescription>
          </Alert>

          <div className="grid gap-4">
            {hipaaRoles?.map((role) => (
              <Card key={role.id}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">{role.role_name}</CardTitle>
                    <Badge variant="outline" className={
                      role.access_level === 'administrative' ? 'border-red-200 text-red-700' :
                      role.access_level === 'emergency' ? 'border-orange-200 text-orange-700' :
                      'border-blue-200 text-blue-700'
                    }>
                      {role.access_level.replace('_', ' ')}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-3">{role.description}</p>
                  <div className="flex flex-wrap gap-2">
                    {Object.entries(role.permissions || {}).map(([key, value]) => (
                      value && (
                        <Badge key={key} variant="secondary" className="text-xs">
                          {key.replace('_', ' ')}
                        </Badge>
                      )
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="emergency" className="space-y-4">
          <Alert>
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              Emergency access requests provide temporary elevated access during critical situations.
            </AlertDescription>
          </Alert>

          <div className="grid gap-4">
            {emergencyRequests?.map((request) => (
              <Card key={request.id}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">{request.requested_resource}</CardTitle>
                    <div className="flex items-center gap-2">
                      <Badge className={getStatusColor(request.approval_status)}>
                        {request.approval_status}
                      </Badge>
                      <Badge variant="outline">
                        {request.emergency_type.replace('_', ' ')}
                      </Badge>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <p className="text-sm">{request.justification}</p>
                    <div className="flex items-center text-xs text-muted-foreground gap-4">
                      <span className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        Requested: {new Date(request.created_at).toLocaleDateString()}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        Expires: {new Date(request.expires_at).toLocaleDateString()}
                      </span>
                    </div>
                    {request.approval_status === 'pending' && (
                      <div className="flex gap-2 pt-2">
                        <Button
                          size="sm"
                          onClick={() => updateEmergencyRequest.mutate({ id: request.id, status: 'approved' })}
                          className="bg-green-600 hover:bg-green-700"
                        >
                          <CheckCircle className="h-4 w-4 mr-1" />
                          Approve
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => updateEmergencyRequest.mutate({ id: request.id, status: 'denied' })}
                          className="text-red-600 border-red-200"
                        >
                          <XCircle className="h-4 w-4 mr-1" />
                          Deny
                        </Button>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="certifications" className="space-y-4">
          <Alert>
            <User className="h-4 w-4" />
            <AlertDescription>
              Track user access certifications and training completion status.
            </AlertDescription>
          </Alert>

          <div className="grid gap-4">
            {certifications?.map((cert) => {
              const statusInfo = getCertificationStatus(cert);
              return (
                <Card key={cert.id}>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg">{cert.certification_type}</CardTitle>
                      <div className="flex items-center gap-2">
                        <Badge className={statusInfo.color}>
                          {statusInfo.status}
                        </Badge>
                        {cert.training_completed && (
                          <Badge variant="outline" className="bg-blue-50 text-blue-700">
                            Training Complete
                          </Badge>
                        )}
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="text-sm text-muted-foreground">
                      <p>Expires: {new Date(cert.expiry_date).toLocaleDateString()}</p>
                      <p>Status: {cert.status}</p>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </TabsContent>

        <TabsContent value="audit" className="space-y-4">
          <Alert>
            <Shield className="h-4 w-4" />
            <AlertDescription>
              HIPAA audit logs track all PHI access and system activities for compliance monitoring.
            </AlertDescription>
          </Alert>
          
          <Card>
            <CardHeader>
              <CardTitle>Audit Log Access</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">
                Detailed audit logs are available through the compliance dashboard for authorized personnel.
              </p>
              <Button variant="outline">
                View Full Audit Trail
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}