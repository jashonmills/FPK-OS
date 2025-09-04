
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search, UserPlus, AlertCircle, Building2 } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useUsersWithMetrics } from '@/hooks/useUsersWithMetrics';
import { EnhancedUsersTable } from '@/components/admin/EnhancedUsersTable';
import { AdminOrgCreationModal } from '@/components/admin/AdminOrgCreationModal';
import { AVAILABLE_ROLES } from '@/types/user';

const UserManagement = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [showOrgModal, setShowOrgModal] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  
  const { data, isLoading, error } = useUsersWithMetrics({
    search: searchQuery,
    role: roleFilter,
    page: currentPage,
    pageSize: 20
  });

  if (error) {
    return (
      <div className="p-4 md:p-6">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Failed to load users: {error.message}
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="w-full max-w-full overflow-x-hidden p-4 md:p-6 space-y-4 md:space-y-6">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold">User Management</h1>
          <p className="text-sm md:text-base text-muted-foreground">
            Manage users, roles, and permissions
          </p>
        </div>
        <div className="flex gap-2 w-full sm:w-auto">
          <Button 
            onClick={() => setShowOrgModal(true)}
            variant="outline" 
            className="flex-1 sm:flex-none"
          >
            <Building2 className="h-4 w-4 mr-2" />
            Create Organization
          </Button>
          <Button className="fpk-gradient text-white flex-1 sm:flex-none">
            <UserPlus className="h-4 w-4 mr-2" />
            Invite User
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg md:text-xl">User Directory</CardTitle>
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search users..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={roleFilter} onValueChange={setRoleFilter}>
              <SelectTrigger className="w-full sm:w-48">
                <SelectValue placeholder="Filter by role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Roles</SelectItem>
                {AVAILABLE_ROLES.map((role) => (
                  <SelectItem key={role} value={role}>
                    {role.charAt(0).toUpperCase() + role.slice(1)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="text-center py-8">Loading users...</div>
          ) : !data?.users || data.users.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-muted-foreground">No users found.</p>
              <p className="text-sm text-muted-foreground mt-2">
                Current filter: {roleFilter === 'all' ? 'All roles' : roleFilter}
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="text-sm text-muted-foreground">
                Found {data.pagination.total} user{data.pagination.total !== 1 ? 's' : ''}
                {roleFilter !== 'all' && ` with role: ${roleFilter}`}
              </div>
              <EnhancedUsersTable
                users={data.users}
                isLoading={isLoading}
                onAssignRole={(userId, role) => {
                  // TODO: Implement role assignment
                  console.log('Assign role:', userId, role);
                }}
                onRemoveRole={(userId, role) => {
                  // TODO: Implement role removal
                  console.log('Remove role:', userId, role);
                }}
                isAssigning={false}
                isRemoving={false}
                pagination={data.pagination}
                onPaginationChange={(page) => setCurrentPage(page)}
                onFiltersChange={(filters) => {
                  // TODO: Implement filter changes
                  console.log('Filters changed:', filters);
                }}
              />
            </div>
          )}
        </CardContent>
      </Card>
      
      <AdminOrgCreationModal 
        open={showOrgModal} 
        onOpenChange={setShowOrgModal} 
      />
    </div>
  );
};

export default UserManagement;
