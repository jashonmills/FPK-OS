import React, { useState } from 'react';
import { UserFilters } from '@/types/common';
import { Button } from '@/components/ui/button';
import UserRowCard from './UserRowCard';

interface UserWithMetrics {
  id: string;
  name: string;
  email: string;
  roles: string[];
  createdAt: string;
  lastActiveAt: string | null;
  weeklySeconds: number;
  enrollmentCount: number;
  avgProgressPercent: number;
  goalsActive: number;
  goalsCompleted: number;
}

interface EnhancedUsersTableProps {
  users: UserWithMetrics[];
  isLoading: boolean;
  onAssignRole: (userId: string, role: string) => void;
  onRemoveRole: (userId: string, role: string) => void;
  isAssigning: boolean;
  isRemoving: boolean;
  pagination: {
    page: number;
    pageSize: number;
    total: number;
    totalPages: number;
  };
  onPaginationChange: (page: number, pageSize: number) => void;
  onFiltersChange: (filters: UserFilters) => void;
}

export const EnhancedUsersTable: React.FC<EnhancedUsersTableProps> = ({
  users,
  isLoading,
  onAssignRole,
  onRemoveRole,
  isAssigning,
  isRemoving,
  pagination,
  onPaginationChange,
  onFiltersChange
}) => {
  return (
    <div className="w-full max-w-full overflow-x-hidden space-y-4">
      {/* Responsive Grid Cards */}
      <div className="w-full max-w-full overflow-x-hidden space-y-3">
        {users.map((user) => (
          <UserRowCard
            key={user.id}
            id={user.id}
            name={user.name}
            email={user.email}
            roles={user.roles}
            lastActiveAt={user.lastActiveAt}
            enrollmentCount={user.enrollmentCount}
            avgProgressPercent={user.avgProgressPercent}
            goalsActive={user.goalsActive}
            goalsCompleted={user.goalsCompleted}
            weeklySeconds={user.weeklySeconds}
            createdAt={user.createdAt}
          />
        ))}
      </div>

      {/* Pagination */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="text-sm text-muted-foreground">
          Showing {((pagination.page - 1) * pagination.pageSize) + 1} to {Math.min(pagination.page * pagination.pageSize, pagination.total)} of {pagination.total} users
        </div>
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onPaginationChange(pagination.page - 1, pagination.pageSize)}
            disabled={pagination.page <= 1}
          >
            Previous
          </Button>
          <div className="text-sm whitespace-nowrap">
            Page {pagination.page} of {pagination.totalPages}
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => onPaginationChange(pagination.page + 1, pagination.pageSize)}
            disabled={pagination.page >= pagination.totalPages}
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  );
};