import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Search, ChevronUp, ChevronDown } from 'lucide-react';
import { useSearchParams } from 'react-router-dom';
import { AVAILABLE_ROLES } from '@/types/user';
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
  onFiltersChange: (filters: any) => void;
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
  const [searchParams, setSearchParams] = useSearchParams();
  
  // State from URL params
  const [searchQuery, setSearchQuery] = useState(searchParams.get('search') || '');
  const [roleFilter, setRoleFilter] = useState(searchParams.get('role') || 'all');
  const [activityFilter, setActivityFilter] = useState(searchParams.get('activity') || 'all');
  const [progressFilter, setProgressFilter] = useState(searchParams.get('progressBand') || 'all');
  const [goalsFilter, setGoalsFilter] = useState(searchParams.get('hasGoals') || 'all');
  const [sortBy, setSortBy] = useState(searchParams.get('sortBy') || 'createdAt');
  const [sortDir, setSortDir] = useState(searchParams.get('sortDir') || 'desc');

  // Update URL params when filters change
  const updateFilters = (newFilters: any) => {
    const params = new URLSearchParams(searchParams);
    Object.entries(newFilters).forEach(([key, value]) => {
      if (value && value !== 'all') {
        params.set(key, value as string);
      } else {
        params.delete(key);
      }
    });
    setSearchParams(params);
    onFiltersChange(newFilters);
  };

  const handleSort = (field: string) => {
    const newSortDir = sortBy === field && sortDir === 'asc' ? 'desc' : 'asc';
    setSortBy(field);
    setSortDir(newSortDir);
    updateFilters({ sortBy: field, sortDir: newSortDir });
  };

  const SortButton = ({ field, children }: { field: string; children: React.ReactNode }) => (
    <Button
      variant="ghost"
      size="sm"
      className="h-auto p-0 font-medium"
      onClick={() => handleSort(field)}
    >
      {children}
      {sortBy === field && (
        sortDir === 'asc' ? <ChevronUp className="ml-2 h-4 w-4" /> : <ChevronDown className="ml-2 h-4 w-4" />
      )}
    </Button>
  );

  return (
    <div className="w-full max-w-full overflow-x-hidden space-y-4">
      {/* Filters */}
      <div className="flex flex-col lg:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search users..."
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              updateFilters({ search: e.target.value });
            }}
            className="pl-10"
          />
        </div>
        
        <div className="flex flex-wrap gap-2">
          <Select value={roleFilter} onValueChange={(value) => {
            setRoleFilter(value);
            updateFilters({ role: value });
          }}>
            <SelectTrigger className="w-full sm:w-32">
              <SelectValue placeholder="Role" />
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

          <Select value={activityFilter} onValueChange={(value) => {
            setActivityFilter(value);
            updateFilters({ activity: value });
          }}>
            <SelectTrigger className="w-full sm:w-36">
              <SelectValue placeholder="Activity" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Activity</SelectItem>
              <SelectItem value="active_7d">Active last 7d</SelectItem>
              <SelectItem value="inactive_14d">Inactive &gt;14d</SelectItem>
            </SelectContent>
          </Select>

          <Select value={progressFilter} onValueChange={(value) => {
            setProgressFilter(value);
            updateFilters({ progressBand: value });
          }}>
            <SelectTrigger className="w-full sm:w-32">
              <SelectValue placeholder="Progress" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Progress</SelectItem>
              <SelectItem value="0-25">0-25%</SelectItem>
              <SelectItem value="26-50">26-50%</SelectItem>
              <SelectItem value="51-75">51-75%</SelectItem>
              <SelectItem value="76-100">76-100%</SelectItem>
            </SelectContent>
          </Select>

          <Select value={goalsFilter} onValueChange={(value) => {
            setGoalsFilter(value);
            updateFilters({ hasGoals: value });
          }}>
            <SelectTrigger className="w-full sm:w-28">
              <SelectValue placeholder="Goals" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All</SelectItem>
              <SelectItem value="yes">Has Goals</SelectItem>
              <SelectItem value="no">No Goals</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

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