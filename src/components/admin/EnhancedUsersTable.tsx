import React, { useState, useMemo } from 'react';
import { format, formatDistanceToNow } from 'date-fns';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { 
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { 
  MoreHorizontal, 
  ChevronUp, 
  ChevronDown,
  Search,
  Filter,
  TrendingUp,
  Clock,
  BookOpen,
  Target,
  User,
  AlertTriangle,
  BarChart3
} from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';
import { Link, useSearchParams } from 'react-router-dom';
import { AVAILABLE_ROLES } from '@/types/user';

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
  const isMobile = useIsMobile();
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

  const formatLastActive = (lastActiveAt: string | null) => {
    if (!lastActiveAt) return 'Never';
    
    const lastActive = new Date(lastActiveAt);
    const now = new Date();
    const diffMinutes = (now.getTime() - lastActive.getTime()) / (1000 * 60);
    
    if (diffMinutes <= 5) {
      return <Badge variant="secondary" className="text-green-600">Active now</Badge>;
    }
    
    return formatDistanceToNow(lastActive, { addSuffix: true });
  };

  const formatWeeklyTime = (seconds: number) => {
    if (seconds === 0) return '0m';
    
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    
    if (hours > 0) {
      return `${hours}h ${minutes}m`;
    }
    return `${minutes}m`;
  };

  const getActivityStatus = (lastActiveAt: string | null) => {
    if (!lastActiveAt) return null;
    
    const lastActive = new Date(lastActiveAt);
    const now = new Date();
    const diffDays = (now.getTime() - lastActive.getTime()) / (1000 * 60 * 60 * 24);
    
    if (diffDays > 30) {
      return <AlertTriangle className="h-4 w-4 text-orange-500" />;
    }
    return null;
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

  if (isMobile) {
    return (
      <div className="space-y-4">
        {/* Mobile Filters */}
        <div className="grid grid-cols-1 gap-2">
          <div className="relative">
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
          <div className="grid grid-cols-2 gap-2">
            <Select value={roleFilter} onValueChange={(value) => {
              setRoleFilter(value);
              updateFilters({ role: value });
            }}>
              <SelectTrigger>
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
                  <SelectTrigger>
                    <SelectValue placeholder="Activity" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Activity</SelectItem>
                    <SelectItem value="active_7d">Active last 7d</SelectItem>
                    <SelectItem value="inactive_14d">Inactive &gt;14d</SelectItem>
                  </SelectContent>
                </Select>
          </div>
        </div>

        {/* Mobile Cards */}
        <div className="space-y-3">
          {users.map((user) => (
            <Card key={user.id} className="p-4">
              <div className="space-y-3">
                {/* User Info */}
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                      <User className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <div className="font-medium">{user.name}</div>
                      <div className="text-sm text-muted-foreground">{user.email}</div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-1">
                    {getActivityStatus(user.lastActiveAt)}
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem asChild>
                          <Link to={`/dashboard/admin/users/${user.id}/analytics`}>
                            <BarChart3 className="h-4 w-4 mr-2" />
                            View Analytics
                          </Link>
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>

                {/* Roles */}
                <div className="flex flex-wrap gap-1">
                  {user.roles.map((role) => (
                    <Badge key={role} variant="secondary" className="text-xs">
                      {role}
                    </Badge>
                  ))}
                </div>

                {/* At-a-glance metrics */}
                <div className="bg-muted/50 rounded-lg p-3">
                  <div className="text-xs text-muted-foreground mb-2">At-a-glance</div>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div className="flex items-center space-x-2">
                      <Clock className="h-3 w-3 text-muted-foreground" />
                      <span>{formatLastActive(user.lastActiveAt)}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <BookOpen className="h-3 w-3 text-muted-foreground" />
                      <span>{user.enrollmentCount} courses</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <TrendingUp className="h-3 w-3 text-muted-foreground" />
                      <span>{user.avgProgressPercent}% avg</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Target className="h-3 w-3 text-muted-foreground" />
                      <span>{user.goalsActive} | {user.goalsCompleted}</span>
                    </div>
                  </div>
                  <div className="mt-2 flex items-center space-x-2 text-sm">
                    <Clock className="h-3 w-3 text-muted-foreground" />
                    <span>{formatWeeklyTime(user.weeklySeconds)} this week</span>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Desktop Filters */}
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
        
        <div className="flex gap-2">
          <Select value={roleFilter} onValueChange={(value) => {
            setRoleFilter(value);
            updateFilters({ role: value });
          }}>
            <SelectTrigger className="w-32">
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
            <SelectTrigger className="w-36">
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
            <SelectTrigger className="w-32">
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
            <SelectTrigger className="w-28">
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

      {/* Desktop Table */}
      <div className="border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>User</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Roles</TableHead>
              <TableHead>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <SortButton field="lastActive">Last Active</SortButton>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>When the user was last seen (relative time)</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </TableHead>
              <TableHead>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <SortButton field="courses">Courses</SortButton>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Number of active course enrollments</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </TableHead>
              <TableHead>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <SortButton field="avgProgress">Avg Progress</SortButton>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Average completion percentage across enrolled courses</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </TableHead>
              <TableHead>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <div>Goals</div>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Active | Completed goal counts</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </TableHead>
              <TableHead>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <SortButton field="timeWeek">Time (Week)</SortButton>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Learning time in current ISO week</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </TableHead>
              <TableHead>
                <SortButton field="createdAt">Created</SortButton>
              </TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.map((user) => (
              <TableRow key={user.id}>
                <TableCell>
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                      <User className="h-4 w-4 text-primary" />
                    </div>
                    <div>
                      <div className="font-medium">{user.name}</div>
                    </div>
                  </div>
                </TableCell>
                <TableCell className="text-sm text-muted-foreground">
                  {user.email}
                </TableCell>
                <TableCell>
                  <div className="flex flex-wrap gap-1">
                    {user.roles.map((role) => (
                      <Badge key={role} variant="secondary" className="text-xs">
                        {role}
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-auto p-0 ml-1 hover:bg-destructive/20"
                          onClick={() => onRemoveRole(user.id, role)}
                          disabled={isRemoving}
                        >
                          ×
                        </Button>
                      </Badge>
                    ))}
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center space-x-2">
                    {formatLastActive(user.lastActiveAt)}
                    {getActivityStatus(user.lastActiveAt)}
                  </div>
                </TableCell>
                <TableCell>
                  <Link
                    to={`/dashboard/admin/users/${user.id}/courses`}
                    className="hover:underline flex items-center space-x-1"
                  >
                    <BookOpen className="h-3 w-3" />
                    <span>{user.enrollmentCount}</span>
                  </Link>
                </TableCell>
                <TableCell>
                  <Link
                    to={`/dashboard/admin/users/${user.id}/analytics?tab=courses`}
                    className="hover:underline"
                  >
                    <div className="flex items-center space-x-2">
                      <Progress value={user.avgProgressPercent} className="w-12 h-2" />
                      <span className="text-sm">{user.avgProgressPercent}%</span>
                    </div>
                  </Link>
                </TableCell>
                <TableCell>
                  <Link
                    to={`/dashboard/admin/users/${user.id}/goals`}
                    className="hover:underline"
                  >
                    <Badge variant="outline" className="text-xs">
                      {user.goalsActive} | {user.goalsCompleted}
                    </Badge>
                  </Link>
                </TableCell>
                <TableCell>
                  <Link
                    to={`/dashboard/admin/users/${user.id}/analytics`}
                    className="hover:underline flex items-center space-x-1"
                  >
                    <Clock className="h-3 w-3" />
                    <span>{formatWeeklyTime(user.weeklySeconds)}</span>
                  </Link>
                </TableCell>
                <TableCell className="text-sm text-muted-foreground">
                  {format(new Date(user.createdAt), 'MMM d, yyyy')}
                </TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem>
                        <Select onValueChange={(role) => onAssignRole(user.id, role)}>
                          <SelectTrigger className="h-auto p-0 border-none bg-transparent">
                            <SelectValue placeholder="Add role" />
                          </SelectTrigger>
                          <SelectContent>
                            {AVAILABLE_ROLES.filter(role => !user.roles.includes(role)).map((role) => (
                              <SelectItem key={role} value={role}>
                                {role.charAt(0).toUpperCase() + role.slice(1)}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem asChild>
                        <Link to={`/dashboard/admin/users/${user.id}/analytics`}>
                          <BarChart3 className="h-4 w-4 mr-2" />
                          Analytics
                        </Link>
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between">
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
          <div className="text-sm">
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