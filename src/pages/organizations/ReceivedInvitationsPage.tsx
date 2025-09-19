import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Calendar, ArrowLeft, Check, X, Mail } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const OrgInvitationsPage = () => {
  const navigate = useNavigate();
  
  // Mock data - in a real app, this would come from an API
  const pendingInvitations = [
    // This would be populated from a real API call
    // For now, we'll show empty state
  ];

  const handleAcceptInvitation = (invitationId: string) => {
    // This would handle accepting an invitation
    console.log('Accept invitation:', invitationId);
  };

  const handleDeclineInvitation = (invitationId: string) => {
    // This would handle declining an invitation
    console.log('Decline invitation:', invitationId);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="sm" onClick={() => navigate('/org')}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Organizations
        </Button>
      </div>

      <div>
        <h1 className="text-3xl font-bold flex items-center gap-2">
          <Calendar className="h-8 w-8" />
          Pending Invitations
        </h1>
        <p className="text-muted-foreground mt-2">
          View and manage your pending organization invitations.
        </p>
      </div>

      {/* Invitations */}
      <Card>
        <CardHeader>
          <CardTitle>Organization Invitations</CardTitle>
          <CardDescription>
            Invitations waiting for your response
          </CardDescription>
        </CardHeader>
        <CardContent>
          {pendingInvitations.length === 0 ? (
            <div className="text-center py-12">
              <Mail className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">No Pending Invitations</h3>
              <p className="text-muted-foreground mb-4">
                You don't have any pending organization invitations at the moment.
              </p>
              <div className="space-y-2">
                <Button onClick={() => navigate('/org/join')}>
                  Join with Invitation Code
                </Button>
                <br />
                <Button variant="outline" onClick={() => navigate('/org/create')}>
                  Create Your Own Organization
                </Button>
              </div>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Organization</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Invited By</TableHead>
                  <TableHead>Received</TableHead>
                  <TableHead>Expires</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {pendingInvitations.map((invitation: any) => (
                  <TableRow key={invitation.id}>
                    <TableCell className="font-medium">
                      {invitation.organizationName}
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">
                        {invitation.role}
                      </Badge>
                    </TableCell>
                    <TableCell>{invitation.invitedBy}</TableCell>
                    <TableCell>{invitation.receivedAt}</TableCell>
                    <TableCell>
                      <Badge variant="destructive">
                        {invitation.expiresAt}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Button
                          size="sm"
                          onClick={() => handleAcceptInvitation(invitation.id)}
                        >
                          <Check className="h-4 w-4 mr-1" />
                          Accept
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleDeclineInvitation(invitation.id)}
                        >
                          <X className="h-4 w-4 mr-1" />
                          Decline
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Help Information */}
      <Alert>
        <Calendar className="h-4 w-4" />
        <AlertDescription>
          <strong>About Invitations:</strong>
          <br />
          Organization invitations are typically sent via email and may have expiration dates. 
          If you have an invitation code, you can also join directly using the "Join with Code" option.
        </AlertDescription>
      </Alert>
    </div>
  );
};

export default OrgInvitationsPage;