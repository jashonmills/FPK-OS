import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { useOrgGroups, type OrgGroup } from '@/hooks/useOrgGroups';
import { Users, MoreHorizontal, Edit, Trash2, UserPlus, BookOpen, MessageSquare } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useOrgContext } from '@/components/organizations/OrgContext';
import { GroupCourseAssignmentDialog } from '@/components/org/groups/GroupCourseAssignmentDialog';
import { EditGroupDialog } from '@/components/org/groups/EditGroupDialog';
import { useState } from 'react';

interface GroupCardProps {
  group: OrgGroup;
}

export function GroupCard({ group }: GroupCardProps) {
  const { deleteGroup, updateGroup, toggleMessaging, isDeleting, isUpdating, isTogglingMessaging } = useOrgGroups();
  const navigate = useNavigate();
  const { currentOrg } = useOrgContext();
  const [assignDialogOpen, setAssignDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);

  const handleDelete = () => {
    if (window.confirm(`Are you sure you want to delete "${group.name}"?`)) {
      deleteGroup(group.id);
    }
  };

  const handleManageMembers = () => {
    navigate(`/org/${currentOrg?.organization_id}/groups/${group.id}`);
  };

  const handleToggleMessaging = () => {
    toggleMessaging({
      groupId: group.id,
      enabled: !group.messaging_enabled
    });
  };

  return (
    <Card className="bg-orange-500/80 backdrop-blur-sm border border-orange-400/50 hover:bg-orange-500/85 transition-colors">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-2">
            <Users className="w-5 h-5 text-orange-300" />
            <CardTitle className="text-orange-200">{group.name}</CardTitle>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="text-orange-200 hover:bg-orange-500/20">
                <MoreHorizontal className="w-4 h-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={handleManageMembers}>
                <UserPlus className="w-4 h-4 mr-2" />
                Manage Members
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setAssignDialogOpen(true)}>
                <BookOpen className="w-4 h-4 mr-2" />
                Assign Course
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setEditDialogOpen(true)}>
                <Edit className="w-4 h-4 mr-2" />
                Edit Group
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem 
                onClick={handleToggleMessaging}
                disabled={isTogglingMessaging}
              >
                <MessageSquare className="w-4 h-4 mr-2" />
                {group.messaging_enabled ? 'Disable Student Messaging' : 'Enable Student Messaging'}
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem 
                onClick={handleDelete} 
                disabled={isDeleting}
                className="text-destructive"
              >
                <Trash2 className="w-4 h-4 mr-2" />
                Delete Group
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        {group.description && (
          <p className="text-sm text-orange-100/80">{group.description}</p>
        )}
        
        <div className="flex items-center justify-between flex-wrap gap-2">
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="bg-orange-500/20 text-orange-200 border-orange-400/30">
              {group.member_count || 0} members
            </Badge>
            
            {group.messaging_enabled && (
              <Badge 
                variant="outline" 
                className="bg-green-500/20 text-green-200 border-green-400/30 flex items-center gap-1"
              >
                <MessageSquare className="w-3 h-3" />
                Messaging On
              </Badge>
            )}
          </div>
          
          <div className="text-xs text-orange-200/60">
            Created {new Date(group.created_at).toLocaleDateString()}
          </div>
        </div>
      </CardContent>

      <GroupCourseAssignmentDialog
        open={assignDialogOpen}
        onOpenChange={setAssignDialogOpen}
        groupId={group.id}
        groupName={group.name}
      />

      <EditGroupDialog
        open={editDialogOpen}
        onOpenChange={setEditDialogOpen}
        groupId={group.id}
        groupName={group.name}
        groupDescription={group.description}
        messagingEnabled={group.messaging_enabled}
        onUpdate={updateGroup}
        isUpdating={isUpdating}
      />
    </Card>
  );
}
