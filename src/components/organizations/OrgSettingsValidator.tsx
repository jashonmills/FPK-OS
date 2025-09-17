import React from 'react';
import { useOrgContext } from './OrgContext';
import { useParams } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CheckCircle2, AlertTriangle, XCircle } from 'lucide-react';

export function OrgSettingsValidator() {
  const { currentOrg, activeOrgId, getUserRole } = useOrgContext();
  const { orgId } = useParams();
  const userRole = getUserRole();

  const validations = [
    {
      label: 'URL Parameter',
      value: orgId || 'Missing',
      status: orgId ? 'success' : 'error',
      icon: orgId ? CheckCircle2 : XCircle,
    },
    {
      label: 'Active Org ID',
      value: activeOrgId || 'None',
      status: activeOrgId ? 'success' : 'warning',
      icon: activeOrgId ? CheckCircle2 : AlertTriangle,
    },
    {
      label: 'Current Org',
      value: currentOrg?.organizations?.name || 'Not loaded',
      status: currentOrg ? 'success' : 'error',
      icon: currentOrg ? CheckCircle2 : XCircle,
    },
    {
      label: 'User Role',
      value: userRole || 'None',
      status: userRole === 'owner' ? 'success' : userRole ? 'warning' : 'error',
      icon: userRole === 'owner' ? CheckCircle2 : userRole ? AlertTriangle : XCircle,
    },
    {
      label: 'Settings Access',
      value: userRole === 'owner' ? 'Allowed' : 'View Only',
      status: userRole === 'owner' ? 'success' : 'warning',
      icon: userRole === 'owner' ? CheckCircle2 : AlertTriangle,
    },
  ];

  const hasErrors = validations.some(v => v.status === 'error');
  const hasWarnings = validations.some(v => v.status === 'warning');

  return (
    <Card className={`mb-4 ${hasErrors ? 'border-red-200 bg-red-50' : hasWarnings ? 'border-yellow-200 bg-yellow-50' : 'border-green-200 bg-green-50'}`}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-sm">
          <Badge variant={hasErrors ? 'destructive' : hasWarnings ? 'secondary' : 'default'}>
            Organization Settings Status
          </Badge>
        </CardTitle>
        <CardDescription className="text-xs">
          Validation of organization context and permissions
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2 text-xs">
          {validations.map((validation) => {
            const Icon = validation.icon;
            return (
              <div key={validation.label} className="flex items-center gap-2 p-2 rounded border">
                <Icon className={`h-3 w-3 ${
                  validation.status === 'success' ? 'text-green-500' :
                  validation.status === 'warning' ? 'text-yellow-500' : 'text-red-500'
                }`} />
                <div className="flex-1">
                  <div className="font-medium">{validation.label}</div>
                  <div className="text-muted-foreground truncate">{validation.value}</div>
                </div>
              </div>
            );
          })}
        </div>
        
        {hasErrors && (
          <div className="mt-3 p-2 bg-red-100 border border-red-200 rounded text-xs text-red-700">
            <strong>Issues detected:</strong> Organization context is not properly configured. 
            Check that you're accessing the settings through the organization navigation.
          </div>
        )}
        
        {!hasErrors && hasWarnings && (
          <div className="mt-3 p-2 bg-yellow-100 border border-yellow-200 rounded text-xs text-yellow-700">
            <strong>Limited access:</strong> You have view-only access to these settings. 
            Only organization owners can modify settings.
          </div>
        )}
      </CardContent>
    </Card>
  );
}