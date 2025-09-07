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
import { useOrgInvitations } from '@/hooks/useOrgInvitations';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

const OrgHub = () => {
  const { organizations, isLoading } = useOrgContext();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [inviteCode, setInviteCode] = useState('');
  const [isJoining, setIsJoining] = useState(false);

  const handleJoinWithCode = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inviteCode.trim()) {
      toast({
        title: "Invalid Code",
        description: "Please enter a valid invitation code.",
        variant: "destructive",
      });
      return;
    }

    setIsJoining(true);
    try {
      const { data, error } = await supabase.rpc('accept_invite', {
        p_code: inviteCode.trim()
      });

      if (error) throw error;

      const result = data as any;
      if (result?.success) {
        toast({
          title: "Successfully Joined!",
          description: "You have been added to the organization.",
        });
        
        // Route based on role
        const role = result.role;
        if (role === 'owner' || role === 'instructor') {
          navigate(`/dashboard/instructor?org=${result.org_id}`);
        } else {
          navigate(`/dashboard/learner?org=${result.org_id}`);
        }
      } else {
        throw new Error(result?.error || 'Failed to join organization');
      }
    } catch (error: any) {
      console.error('Error joining organization:', error);
      toast({
        title: "Failed to Join",
        description: error.message || "Please check your invitation code and try again.",
        variant: "destructive",
      });
    } finally {
      setIsJoining(false);
      setInviteCode('');
    }
  };

  const handleOpenOrganization = (org: any) => {
    const role = org.role;
    if (role === 'owner' || role === 'instructor') {
      navigate(`/dashboard/instructor?org=${org.organization_id}`);
    } else {
      navigate(`/dashboard/learner?org=${org.organization_id}`);
    }
  };

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
        <h1 className="text-3xl font-bold">Organizations</h1>
        <p className="text-muted-foreground mt-2">
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
              onClick={() => navigate('/org/invitations')}>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Pending Invitations
            </CardTitle>
            <CardDescription>
              View and manage your pending organization invitations
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button variant="outline" className="w-full">
              View Invitations
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default OrgHub;