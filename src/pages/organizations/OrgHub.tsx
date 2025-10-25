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
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { 
  Building2, 
  Users, 
  Plus, 
  ArrowUpRight, 
  UserMinus,
  Calendar,
  Send,
  Trash2
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useOrganizationInvitation } from '@/hooks/useOrganizationInvitation';
import { useOrganizations } from '@/hooks/useOrganizations';
import { useToast } from '@/hooks/use-toast';
import { useUserOrganizations } from '@/hooks/useUserOrganization';
import { useIsMobile } from '@/hooks/use-mobile';
import { PageHeroWithTile } from '@/components/common/PageHeroWithTile';

const OrgHub = () => {
  const { data: organizations = [], isLoading } = useUserOrganizations();
  const navigate = useNavigate();
  const { joinWithCode, isJoining } = useOrganizationInvitation();
  const { deleteOrganization, isDeleting } = useOrganizations();
  const [inviteCode, setInviteCode] = useState('');
  const [orgToDelete, setOrgToDelete] = useState<string | null>(null);
  const isMobile = useIsMobile();

  const switchOrganization = (orgId: string) => {
    // Navigate to org route with proper context
    window.location.href = `/org/${orgId}`;
  };

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

  const handleDeleteOrganization = async () => {
    if (!orgToDelete) return;
    
    try {
      await deleteOrganization(orgToDelete);
      setOrgToDelete(null);
    } catch (error) {
      console.error('Failed to delete organization:', error);
    }
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
      {/* Hero Section with Contrast Tile */}
      <PageHeroWithTile
        title="Organizations"
        subtitle="Manage your organizations, join new ones, or create your own."
        className="mb-8"
      />

      {/* Action Cards Grid */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* My Organizations */}
        <Card className="lg:col-span-2">
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
            ) : isMobile ? (
              // Mobile: Card layout
              <div className="space-y-4">
                {organizations.map((org) => (
                  <Card key={org.organization_id} className="p-4">
                    <div className="flex flex-col space-y-3">
                      <div className="flex items-start justify-between">
                        <div>
                          <h3 className="font-semibold text-base line-clamp-2">
                            {org.organizations.name}
                          </h3>
                          <div className="flex items-center gap-2 mt-2">
                            <Badge variant={
                              org.role === 'owner' ? 'default' : 
                              org.role === 'instructor' ? 'secondary' : 'outline'
                            } className="text-xs">
                              {org.role}
                            </Badge>
                            <Badge variant="outline" className="text-xs">
                              {org.organizations.plan}
                            </Badge>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 pt-2">
                        <Button
                          size="sm"
                          onClick={() => handleOpenOrganization(org)}
                          className="flex-1"
                        >
                          <ArrowUpRight className="h-4 w-4 mr-1" />
                          Open
                        </Button>
                        {org.role === 'owner' ? (
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => setOrgToDelete(org.organization_id)}
                            disabled={isDeleting}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        ) : (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleLeaveOrganization(org.organization_id)}
                          >
                            <UserMinus className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            ) : (
              // Desktop: Table layout
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
                          {org.role === 'owner' ? (
                            <Button
                              size="sm"
                              variant="destructive"
                              onClick={() => setOrgToDelete(org.organization_id)}
                              disabled={isDeleting}
                            >
                              <Trash2 className="h-4 w-4 mr-1" />
                              Delete
                            </Button>
                          ) : (
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
            <Button className="w-full" onClick={() => navigate('/org/create')}>
              Create New Organization
            </Button>
          </CardContent>
        </Card>

        {/* Invitations */}
        <Card className="cursor-pointer hover:shadow-md transition-shadow"
              onClick={() => {
                // Navigate to correct invitations page based on context
                if (organizations.length > 0) {
                  // If user has orgs, show org invitations
                  navigate('/org/invitations');
                } else {
                  // For personal mode, show join organization functionality
                  navigate('/org/join');
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

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={!!orgToDelete} onOpenChange={(open) => !open && setOrgToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Organization?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the organization
              and remove all members, invitations, and associated data.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteOrganization}
              disabled={isDeleting}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {isDeleting ? 'Deleting...' : 'Delete Organization'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default OrgHub;