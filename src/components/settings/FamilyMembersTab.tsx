import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useFamily } from "@/contexts/FamilyContext";
import { InviteMemberForm } from "./InviteMemberForm";
import { CurrentMembersList } from "./CurrentMembersList";
import { PendingInvitesList } from "./PendingInvitesList";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Info } from "lucide-react";

export const FamilyMembersTab = () => {
  const { selectedFamily, familyMembership } = useFamily();
  const isOwner = familyMembership?.role === 'owner';

  if (!selectedFamily) {
    return (
      <Alert>
        <Info className="h-4 w-4" />
        <AlertDescription>
          Please select a family to manage members.
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="space-y-6">
      {isOwner && (
        <Card>
          <CardHeader>
            <CardTitle>Invite New Member</CardTitle>
            <CardDescription>
              Add a team member to collaborate on {selectedFamily.family_name}'s progress
            </CardDescription>
          </CardHeader>
          <CardContent>
            <InviteMemberForm familyId={selectedFamily.id} familyName={selectedFamily.family_name} />
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Current Members</CardTitle>
          <CardDescription>
            Team members who have access to this family hub
          </CardDescription>
        </CardHeader>
        <CardContent>
          <CurrentMembersList familyId={selectedFamily.id} isOwner={isOwner} />
        </CardContent>
      </Card>

      {isOwner && (
        <Card>
          <CardHeader>
            <CardTitle>Pending Invitations</CardTitle>
            <CardDescription>
              Invitations waiting to be accepted
            </CardDescription>
          </CardHeader>
          <CardContent>
            <PendingInvitesList familyId={selectedFamily.id} />
          </CardContent>
        </Card>
      )}
    </div>
  );
};
