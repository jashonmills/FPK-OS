import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { 
  Building2, 
  Users, 
  Plus, 
  ArrowUpRight, 
  UserMinus,
  Calendar,
  Send
} from 'lucide-react';
import { useOrgContext } from '@/components/organizations/OrgContext';
import { useNavigate } from 'react-router-dom';
import { useOrganizationInvitation } from '@/hooks/useOrganizationInvitation';
import { useToast } from '@/hooks/use-toast';

const OrgHub = () => {
  const { organizations, isLoading, switchOrganization } = useOrgContext();
  const navigate = useNavigate();
  const { joinWithCode, isJoining } = useOrganizationInvitation();
  const [inviteCode, setInviteCode] = useState('');

  const handleJoinWithCode = async (e: React.FormEvent) => {
    e.preventDefault();
    const result = await joinWithCode(inviteCode);
    
    if (result.success) {
      setInviteCode('');
      // Organization switching and navigation is handled by the hook
    }
  };

  const handleOpenOrganization = (org: any) => {
    // Use the context switching function to properly update state and navigate
    switchOrganization(org.organization_id);
  };

  const { toast } = useToast();

  const handleLeaveOrganization = async (orgId: string) => {
    // This would need to be implemented in the backend
    toast({
      title: "Feature Coming Soon",
      description: "Leave organization functionality will be available soon.",
    });
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="h-8 bg-muted animate-pulse rounded" />
        <div className="grid gap-6 md:grid-cols-2">
          <div className="h-64 bg-muted animate-pulse rounded-lg" />
          <div className="h-64 bg-muted animate-pulse rounded-lg" />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-white">Organizations</h1>
        <p className="text-white mt-2">
          Manage your organizations, join new ones, or create your own.
        </p>
      </div>

      {/* Action Cards Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {/* My Organizations */}
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Building2 className="h-5 w-5" />
              My Organizations
            </CardTitle>
            <CardDescription>
              Organizations you belong to and your role in each
            </CardDescription>
          </CardHeader>
          <CardContent>
            {organizations.length === 0 ? (
              <div className="text-center py-8">
                <Building2 className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground mb-4">
                  You're not a member of any organizations yet.
                </p>
                <Button onClick={() => navigate('/org/create')}>
                  Create Your First Organization
                </Button>
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead>Plan</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {organizations.map((org) => (
                    <TableRow key={org.organization_id}>
                      <TableCell className="font-medium">
                        {org.organizations.name}
                      </TableCell>
                      <TableCell>
                        <Badge variant={
                          org.role === 'owner' ? 'default' : 
                          org.role === 'instructor' ? 'secondary' : 'outline'
                        }>
                          {org.role}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">
                          {org.organizations.plan}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Button
                            size="sm"
                            onClick={() => handleOpenOrganization(org)}
                          >
                            <ArrowUpRight className="h-4 w-4 mr-1" />
                            Open
                          </Button>
                          {org.role !== 'owner' && (
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleLeaveOrganization(org.organization_id)}
                            >
                              <UserMinus className="h-4 w-4 mr-1" />
                              Leave
                            </Button>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>

        {/* Join with Code */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Send className="h-5 w-5" />
              Join with Code
            </CardTitle>
            <CardDescription>
              Enter an invitation code to join an organization
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleJoinWithCode} className="space-y-4">
              <div>
                <Label htmlFor="inviteCode">Invitation Code</Label>
                <Input
                  id="inviteCode"
                  value={inviteCode}
                  onChange={(e) => setInviteCode(e.target.value)}
                  placeholder="Enter your invitation code"
                  disabled={isJoining}
                />
              </div>
              <Button type="submit" className="w-full" disabled={isJoining}>
                {isJoining ? 'Joining...' : 'Join Organization'}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>

      {/* Bottom Action Cards */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Create Organization */}
        <Card className="cursor-pointer hover:shadow-md transition-shadow" 
              onClick={() => navigate('/org/create')}>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Plus className="h-5 w-5" />
              Create Organization
            </CardTitle>
            <CardDescription>
              Start your own organization and invite members
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button className="w-full">
              Create New Organization
            </Button>
          </CardContent>
        </Card>

        {/* Invitations */}
        <Card className="cursor-pointer hover:shadow-md transition-shadow"
              onClick={() => {
                // Navigate to correct invitations page based on context
                if (switchOrganization && organizations.length > 0) {
                  // If user has orgs, show org invitations
                  navigate('/org/invitations');
                } else {
                  // For personal mode, show join organization functionality
                  navigate('/join');
                }
              }}>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              {organizations.length > 0 ? 'Pending Invitations' : 'Join Organization'}
            </CardTitle>
            <CardDescription>
              {organizations.length > 0 
                ? 'View and manage your pending organization invitations'
                : 'Join an organization with an invitation code'
              }
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button variant="outline" className="w-full">
              {organizations.length > 0 ? 'View Invitations' : 'Join Organization'}
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default OrgHub;