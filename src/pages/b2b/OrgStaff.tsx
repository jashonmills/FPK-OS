import { Users } from 'lucide-react';

export const OrgStaff = () => {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Staff Management</h1>
          <p className="text-muted-foreground mt-2">
            Manage your organization's staff members and permissions
          </p>
        </div>
      </div>
      
      <div className="bg-muted/50 rounded-lg p-12 text-center">
        <Users className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
        <h3 className="text-lg font-semibold mb-2">Coming Soon</h3>
        <p className="text-muted-foreground">
          Staff management features are under development and will be available in Phase 3.
        </p>
      </div>
    </div>
  );
};
