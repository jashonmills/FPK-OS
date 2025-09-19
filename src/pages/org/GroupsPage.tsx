import { GroupsList } from '@/components/groups/GroupsList';
import { CreateGroupDialog } from '@/components/groups/CreateGroupDialog';
import { Button } from '@/components/ui/button';
import { Plus, Users } from 'lucide-react';
import { useState } from 'react';

export default function GroupsPage() {
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);

  return (
    <div className="container max-w-6xl mx-auto py-8 space-y-6">
      <div className="flex items-center justify-between">
        <div className="bg-black/30 backdrop-blur-sm rounded-lg p-6">
          <h1 className="text-3xl font-bold tracking-tight text-white drop-shadow-lg">Student Groups</h1>
          <p className="text-white/80 mt-2 drop-shadow">
            Organize students into groups for better course management and assignments
          </p>
        </div>
        <CreateGroupDialog 
          open={isCreateDialogOpen}
          onOpenChange={setIsCreateDialogOpen}
          trigger={
            <Button onClick={() => setIsCreateDialogOpen(true)}>
              <Plus className="w-4 h-4 mr-2" />
              Create Group
            </Button>
          }
        />
      </div>

      <div className="bg-orange-500/20 backdrop-blur-sm border border-orange-400/30 rounded-lg p-4">
        <div className="flex items-center gap-2 text-orange-200 mb-2">
          <Users className="w-5 h-5" />
          <h3 className="font-medium">Group Management</h3>
        </div>
        <p className="text-orange-100/90 text-sm">
          Create and manage student groups to streamline course assignments and track progress more effectively.
        </p>
      </div>

      <GroupsList />
    </div>
  );
}