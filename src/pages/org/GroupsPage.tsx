import { GroupsList } from '@/components/groups/GroupsList';
import { CreateGroupDialog } from '@/components/groups/CreateGroupDialog';
import { Button } from '@/components/ui/button';
import { Plus, Users } from 'lucide-react';
import { useState } from 'react';
import { useOrgGroups } from '@/hooks/useOrgGroups';
export default function GroupsPage() {
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const {
    groups
  } = useOrgGroups();
  const totalGroups = groups.length;
  const totalMembers = groups.reduce((sum, group) => sum + (group.member_count || 0), 0);
  const avgGroupSize = totalGroups > 0 ? Math.round(totalMembers / totalGroups) : 0;
  return <div className="container max-w-6xl mx-auto py-8 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-white drop-shadow-lg">Student Groups</h1>
          <p className="mt-2 drop-shadow text-gray-950 font-semibold">
            Organize students into groups for better course management and assignments
          </p>
        </div>
        <CreateGroupDialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen} trigger={<Button onClick={() => setIsCreateDialogOpen(true)}>
              <Plus className="w-4 h-4 mr-2" />
              Create Group
            </Button>} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="bg-orange-500/80 backdrop-blur-sm border border-orange-400/50 rounded-lg p-4">
          <div className="flex items-center gap-2 text-orange-100 mb-2">
            <Users className="w-5 h-5" />
            <h3 className="font-medium">Total Groups</h3>
          </div>
          <p className="text-2xl font-bold text-white">{totalGroups}</p>
        </div>

        <div className="bg-orange-500/80 backdrop-blur-sm border border-orange-400/50 rounded-lg p-4">
          <div className="flex items-center gap-2 text-orange-100 mb-2">
            <Users className="w-5 h-5" />
            <h3 className="font-medium">Active Groups</h3>
          </div>
          <p className="text-2xl font-bold text-white">{totalGroups}</p>
        </div>

        <div className="bg-orange-500/80 backdrop-blur-sm border border-orange-400/50 rounded-lg p-4">
          <div className="flex items-center gap-2 text-orange-100 mb-2">
            <Users className="w-5 h-5" />
            <h3 className="font-medium">Total Members</h3>
          </div>
          <p className="text-2xl font-bold text-white">{totalMembers}</p>
        </div>

        <div className="bg-orange-500/80 backdrop-blur-sm border border-orange-400/50 rounded-lg p-4">
          <div className="flex items-center gap-2 text-orange-100 mb-2">
            <Users className="w-5 h-5" />
            <h3 className="font-medium">Avg Group Size</h3>
          </div>
          <p className="text-2xl font-bold text-white">{avgGroupSize}</p>
        </div>
      </div>

      <div className="bg-orange-500/80 backdrop-blur-sm border border-orange-400/50 rounded-lg p-4">
        <div className="flex items-center gap-2 text-orange-100 mb-2">
          <Users className="w-5 h-5" />
          <h3 className="font-medium">Group Management</h3>
        </div>
        <p className="text-orange-50/90 text-sm">
          Create and manage student groups to streamline course assignments and track progress more effectively.
        </p>
      </div>

      <GroupsList />
    </div>;
}