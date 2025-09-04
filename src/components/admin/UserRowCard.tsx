import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { MoreVertical, BarChart3, User } from 'lucide-react';
import { Link } from 'react-router-dom';
import { format, formatDistanceToNow } from 'date-fns';

interface UserRowCardProps {
  id: string;
  name: string;
  email: string;
  roles: string[];
  lastActiveAt: string | null;
  enrollmentCount: number;
  avgProgressPercent: number;
  goalsActive: number;
  goalsCompleted: number;
  weeklySeconds: number;
  createdAt: string;
}

export default function UserRowCard({
  id,
  name,
  email,
  roles,
  lastActiveAt,
  enrollmentCount,
  avgProgressPercent,
  goalsActive,
  goalsCompleted,
  weeklySeconds,
  createdAt,
}: UserRowCardProps) {
  const formatLastActive = (lastActiveAt: string | null) => {
    if (!lastActiveAt) return 'Never';
    
    const lastActive = new Date(lastActiveAt);
    const now = new Date();
    const diffMinutes = (now.getTime() - lastActive.getTime()) / (1000 * 60);
    
    if (diffMinutes <= 5) {
      return 'Active now';
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

  const formatCreatedDate = (createdAt: string) => {
    return format(new Date(createdAt), 'MMM dd, yyyy');
  };

  return (
    <div
      className={`
        w-full max-w-full overflow-x-hidden
        rounded-xl border bg-white/70 shadow-sm
        p-4 md:p-3
        grid gap-3
        /* Desktop: 9 columns */
        xl:grid-cols-9
        xl:[grid-template-columns:minmax(180px,2fr),minmax(120px,1fr),minmax(120px,1fr),minmax(140px,1fr),minmax(120px,1fr),minmax(120px,1fr),minmax(120px,1fr),minmax(100px,1fr),minmax(120px,1fr)]
        /* Tablet: 4 columns */
        md:grid-cols-4
        md:[grid-template-columns:minmax(160px,2fr),minmax(120px,1fr),minmax(140px,1fr),minmax(100px,1fr)]
        /* Mobile: 2 columns */
        grid-cols-2
        [grid-auto-rows:auto]
      `}
    >
      {/* Name & Email */}
      <div className="min-w-0">
        <div className="flex items-center space-x-3 mb-1">
          <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
            <User className="h-4 w-4 text-primary" />
          </div>
          <div className="min-w-0 flex-1">
            <div className="text-sm font-medium whitespace-normal break-words">{name}</div>
          </div>
        </div>
        <div className="text-xs text-muted-foreground whitespace-normal break-all md:break-words ml-11">
          {email}
        </div>
        {/* Show roles on mobile/tablet in this column */}
        <div className="flex flex-wrap gap-1 mt-2 ml-11 md:hidden">
          {roles.map((role) => (
            <Badge key={role} variant="secondary" className="text-xs">
              {role}
            </Badge>
          ))}
        </div>
      </div>

      {/* Roles - hidden on mobile */}
      <div className="min-w-0 hidden md:block">
        <div className="text-[11px] uppercase tracking-wide text-muted-foreground mb-1">Roles</div>
        <div className="flex flex-wrap gap-1">
          {roles.map((role) => (
            <Badge key={role} variant="secondary" className="text-xs">
              {role}
            </Badge>
          ))}
        </div>
      </div>

      {/* Last Active */}
      <div className="min-w-0">
        <div className="text-[11px] uppercase tracking-wide text-muted-foreground mb-1">Last Active</div>
        <div className="text-sm whitespace-normal break-words">{formatLastActive(lastActiveAt)}</div>
      </div>

      {/* Courses - hidden on mobile */}
      <div className="min-w-0 hidden md:block">
        <div className="text-[11px] uppercase tracking-wide text-muted-foreground mb-1">Courses</div>
        <div className="text-sm">{enrollmentCount}</div>
      </div>

      {/* Avg Progress - hidden on mobile, shown on tablet+ */}
      <div className="min-w-0 hidden xl:block">
        <div className="text-[11px] uppercase tracking-wide text-muted-foreground mb-1">Progress</div>
        <div className="flex items-center gap-2">
          <div className="h-2 w-full max-w-[80px] rounded bg-muted">
            <div
              className="h-2 rounded bg-primary"
              style={{ width: `${avgProgressPercent}%` }}
            />
          </div>
          <span className="text-xs whitespace-nowrap">{avgProgressPercent}%</span>
        </div>
      </div>

      {/* Goals - hidden on mobile */}
      <div className="min-w-0 hidden md:block">
        <div className="text-[11px] uppercase tracking-wide text-muted-foreground mb-1">Goals</div>
        <div className="text-sm flex flex-wrap gap-1">
          <span className="rounded-full bg-amber-50 px-2 py-0.5 text-amber-700 text-xs whitespace-nowrap">
            {goalsActive} Active
          </span>
          <span className="rounded-full bg-emerald-50 px-2 py-0.5 text-emerald-700 text-xs whitespace-nowrap">
            {goalsCompleted} Done
          </span>
        </div>
      </div>

      {/* Time (Week) - hidden on mobile */}
      <div className="min-w-0 hidden xl:block">
        <div className="text-[11px] uppercase tracking-wide text-muted-foreground mb-1">Time (Week)</div>
        <div className="text-sm">{formatWeeklyTime(weeklySeconds)}</div>
      </div>

      {/* Created - hidden on mobile */}
      <div className="min-w-0 hidden xl:block">
        <div className="text-[11px] uppercase tracking-wide text-muted-foreground mb-1">Created</div>
        <div className="text-sm whitespace-normal break-words">{formatCreatedDate(createdAt)}</div>
      </div>

      {/* Actions */}
      <div className="min-w-0 flex items-start justify-end">
        <Button asChild variant="outline" size="sm" className="text-xs px-2 py-1 h-auto mr-2">
          <Link to={`/dashboard/admin/users/${id}/analytics`}>
            <BarChart3 className="h-3 w-3 mr-1" />
            <span className="hidden sm:inline">Analytics</span>
          </Link>
        </Button>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm" className="p-1 h-auto">
              <MoreVertical className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem asChild>
              <Link to={`/dashboard/admin/users/${id}/analytics`}>
                <BarChart3 className="h-4 w-4 mr-2" />
                View Analytics
              </Link>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Mobile-only summary row - spans full width on mobile */}
      <div className="min-w-0 col-span-2 md:hidden">
        <div className="bg-muted/50 rounded-lg p-3 mt-2">
          <div className="text-xs text-muted-foreground mb-2">Quick Stats</div>
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div>
              <span className="text-muted-foreground">Courses:</span> {enrollmentCount}
            </div>
            <div>
              <span className="text-muted-foreground">Progress:</span> {avgProgressPercent}%
            </div>
            <div>
              <span className="text-muted-foreground">Goals:</span> {goalsActive}/{goalsCompleted}
            </div>
            <div>
              <span className="text-muted-foreground">This week:</span> {formatWeeklyTime(weeklySeconds)}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}