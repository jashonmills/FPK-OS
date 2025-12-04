import { useState, useMemo } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Search, CalendarIcon, X } from "lucide-react";
import { format } from "date-fns";
import type { IUserFilters, AccountStatus, UserRole } from "@/types/admin/users";
import { Badge } from "@/components/ui/badge";

interface UserFilterBarProps {
  filters: IUserFilters;
  onFiltersChange: (filters: IUserFilters) => void;
  search: string;
  onSearchChange: (search: string) => void;
}

export function UserFilterBar({
  filters,
  onFiltersChange,
  search,
  onSearchChange,
}: UserFilterBarProps) {
  const [dateAfter, setDateAfter] = useState<Date | undefined>(filters.dateCreatedAfter);
  const [dateBefore, setDateBefore] = useState<Date | undefined>(filters.dateCreatedBefore);

  const activeFilterCount = useMemo(() => {
    let count = 0;
    if (filters.status && filters.status.length > 0) count++;
    if (filters.roles && filters.roles.length > 0) count++;
    if (filters.dateCreatedAfter) count++;
    if (filters.dateCreatedBefore) count++;
    if (search) count++;
    return count;
  }, [filters, search]);

  const handleApplyFilters = () => {
    onFiltersChange({
      ...filters,
      dateCreatedAfter: dateAfter,
      dateCreatedBefore: dateBefore,
    });
  };

  const handleClearFilters = () => {
    setDateAfter(undefined);
    setDateBefore(undefined);
    onSearchChange("");
    onFiltersChange({});
  };

  const toggleStatus = (status: AccountStatus) => {
    const currentStatuses = filters.status || [];
    const newStatuses = currentStatuses.includes(status)
      ? currentStatuses.filter(s => s !== status)
      : [...currentStatuses, status];
    
    onFiltersChange({ ...filters, status: newStatuses.length > 0 ? newStatuses : undefined });
  };

  const toggleRole = (role: UserRole) => {
    const currentRoles = filters.roles || [];
    const newRoles = currentRoles.includes(role)
      ? currentRoles.filter(r => r !== role)
      : [...currentRoles, role];
    
    onFiltersChange({ ...filters, roles: newRoles.length > 0 ? newRoles : undefined });
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by Name, Email, or User ID..."
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      <div className="flex flex-wrap gap-3 items-center">
        {/* Status Filter */}
        <div className="flex gap-2 items-center">
          <span className="text-sm text-muted-foreground">Status:</span>
          <div className="flex gap-2">
            {(['active', 'suspended', 'invited'] as AccountStatus[]).map((status) => (
              <Badge
                key={status}
                variant={filters.status?.includes(status) ? "default" : "outline"}
                className="cursor-pointer capitalize"
                onClick={() => toggleStatus(status)}
              >
                {status}
              </Badge>
            ))}
          </div>
        </div>

        {/* Role Filter */}
        <div className="flex gap-2 items-center">
          <span className="text-sm text-muted-foreground">Role:</span>
          <div className="flex gap-2">
            {(['admin', 'user', 'moderator'] as UserRole[]).map((role) => (
              <Badge
                key={role}
                variant={filters.roles?.includes(role) ? "default" : "outline"}
                className="cursor-pointer capitalize"
                onClick={() => toggleRole(role)}
              >
                {role}
              </Badge>
            ))}
          </div>
        </div>

        {/* Date Range */}
        <div className="flex gap-2 items-center">
          <span className="text-sm text-muted-foreground">Created:</span>
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" size="sm">
                <CalendarIcon className="h-4 w-4 mr-2" />
                {dateAfter ? format(dateAfter, "MMM d") : "After"}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={dateAfter}
                onSelect={setDateAfter}
              />
            </PopoverContent>
          </Popover>

          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" size="sm">
                <CalendarIcon className="h-4 w-4 mr-2" />
                {dateBefore ? format(dateBefore, "MMM d") : "Before"}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={dateBefore}
                onSelect={setDateBefore}
              />
            </PopoverContent>
          </Popover>
        </div>

        <div className="flex gap-2 ml-auto">
          <Button onClick={handleApplyFilters} size="sm">
            Apply Filters
            {activeFilterCount > 0 && (
              <Badge variant="secondary" className="ml-2">
                {activeFilterCount}
              </Badge>
            )}
          </Button>
          {activeFilterCount > 0 && (
            <Button onClick={handleClearFilters} variant="outline" size="sm">
              <X className="h-4 w-4 mr-2" />
              Clear
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
