import { useParams, Link } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  ArrowLeft, 
  Building2, 
  Users, 
  Calendar,
  Settings,
  Mail,
  AlertCircle,
  CheckCircle,
  Clock
} from 'lucide-react';
import { useOrganization } from '@/hooks/useOrganization';
import { OrganizationActionsDropdown } from '@/components/admin/OrganizationActionsDropdown';
import { format } from 'date-fns';

export default function OrganizationDetail() {
  const { id } = useParams<{ id: string }>();
  const { data: organization, isLoading, error } = useOrganization(id || '');

  const getTierVariant = (tier: string) => {
    switch (tier) {
      case 'basic': return 'secondary';
      case 'standard': return 'default';
      case 'premium': return 'destructive';
      default: return 'outline';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active': return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'suspended': return <AlertCircle className="h-4 w-4 text-orange-600" />;
      case 'inactive': return <Clock className="h-4 w-4 text-gray-600" />;
      default: return <AlertCircle className="h-4 w-4 text-gray-600" />;
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">Loading organization...</div>
      </div>
    );
  }

  if (!id || error || !organization) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-lg font-semibold mb-2">Organization not found</h2>
          <p className="text-muted-foreground mb-4">The organization you're looking for doesn't exist.</p>
          <Button asChild>
            <Link to="/dashboard/admin/organizations">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Organizations
            </Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="outline" size="sm" asChild>
            <Link to="/dashboard/admin/organizations">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Link>
          </Button>
          <div>
            <h1 className="text-3xl font-bold">{organization.name}</h1>
            <p className="text-muted-foreground">Organization Details</p>
          </div>
        </div>
        <OrganizationActionsDropdown organization={organization} />
      </div>

      {/* Status and Key Info Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Status</CardTitle>
            {getStatusIcon(organization.status)}
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold capitalize">{organization.status}</div>
            {organization.suspended_at && (
              <p className="text-xs text-muted-foreground mt-1">
                Suspended {format(new Date(organization.suspended_at), 'MMM d, yyyy')}
              </p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Subscription</CardTitle>
            <Settings className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <Badge variant={getTierVariant(organization.plan) as any} className="text-sm">
              {organization.plan.toUpperCase()}
            </Badge>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Seat Usage</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {organization.seats_used}/{organization.seat_cap}
            </div>
            <p className="text-xs text-muted-foreground">
              {Math.round((organization.seats_used / organization.seat_cap) * 100)}% utilized
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Instructor Usage</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {organization.instructors_used || 0}/{organization.instructor_limit || 1}
            </div>
            <p className="text-xs text-muted-foreground">
              {Math.round(((organization.instructors_used || 0) / (organization.instructor_limit || 1)) * 100)}% utilized
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Created</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-lg font-semibold">
              {format(new Date(organization.created_at), 'MMM d, yyyy')}
            </div>
            <p className="text-xs text-muted-foreground">
              {format(new Date(organization.created_at), 'h:mm a')}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Detailed Information */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Organization Details */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Building2 className="h-5 w-5" />
              Organization Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-sm font-medium text-muted-foreground">Organization Name</label>
              <p className="text-lg font-semibold">{organization.name}</p>
            </div>
            
            {organization.description && (
              <div>
                <label className="text-sm font-medium text-muted-foreground">Description</label>
                <p className="text-sm">{organization.description}</p>
              </div>
            )}

            <div>
              <label className="text-sm font-medium text-muted-foreground">Owner ID</label>
              <p className="text-sm font-mono">{organization.owner_id}</p>
            </div>

            <div>
              <label className="text-sm font-medium text-muted-foreground">Organization ID</label>
              <p className="text-sm font-mono">{organization.id}</p>
            </div>
          </CardContent>
        </Card>

        {/* Suspension Details */}
        {organization.status === 'suspended' && organization.suspended_reason && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-orange-600">
                <AlertCircle className="h-5 w-5" />
                Suspension Details
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium text-muted-foreground">Reason</label>
                <p className="text-sm">{organization.suspended_reason}</p>
              </div>
              
              {organization.suspended_at && (
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Suspended On</label>
                  <p className="text-sm">{format(new Date(organization.suspended_at), 'MMMM d, yyyy h:mm a')}</p>
                </div>
              )}

              {organization.suspended_by && (
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Suspended By</label>
                  <p className="text-sm font-mono">{organization.suspended_by}</p>
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Common administrative actions for this organization</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button variant="outline" className="w-full justify-start" asChild>
              <Link to={`/dashboard/admin/organizations/${organization.id}/members`}>
                <Users className="h-4 w-4 mr-2" />
                Manage Members
              </Link>
            </Button>
            
            <Button variant="outline" className="w-full justify-start" asChild>
              <Link to={`/dashboard/admin/organizations/${organization.id}/analytics`}>
                <Calendar className="h-4 w-4 mr-2" />
                View Analytics
              </Link>
            </Button>
            
            <Button variant="outline" className="w-full justify-start">
              <Mail className="h-4 w-4 mr-2" />
              Send Notification
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}