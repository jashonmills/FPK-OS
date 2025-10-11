import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Mail, Phone, UserCircle, Briefcase, Building2, MoreVertical, UserMinus, UserCog } from 'lucide-react';
import { OrgMember } from '@/hooks/useOrgMembers';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuLabel,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
} from '@/components/ui/dropdown-menu';
import { useAuth } from '@/hooks/useAuth';

interface MemberCardProps {
  member: OrgMember;
  viewMode?: 'list' | 'large-tiles' | 'small-tiles';
  onViewProfile?: (member: OrgMember) => void;
  onRemoveMember?: (userId: string) => void;
  onChangeRole?: (userId: string, newRole: 'owner' | 'admin' | 'instructor' | 'instructor_aide' | 'viewer' | 'student') => void;
  canManage?: boolean;
}

export function MemberCard({ 
  member, 
  viewMode = 'large-tiles', 
  onViewProfile,
  onRemoveMember,
  onChangeRole,
  canManage = false
}: MemberCardProps) {
  const { user } = useAuth();
  const isCurrentUser = user?.id === member.user_id;

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case 'owner':
        return 'bg-purple-500/20 text-purple-300 border-purple-400/30';
      case 'instructor':
        return 'bg-blue-500/20 text-blue-300 border-blue-400/30';
      case 'instructor-aide':
        return 'bg-cyan-500/20 text-cyan-300 border-cyan-400/30';
      case 'student':
        return 'bg-green-500/20 text-green-300 border-green-400/30';
      default:
        return 'bg-gray-500/20 text-gray-300 border-gray-400/30';
    }
  };

  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-500/20 text-green-300 border-green-400/30';
      case 'pending':
        return 'bg-yellow-500/20 text-yellow-300 border-yellow-400/30';
      case 'inactive':
        return 'bg-gray-500/20 text-gray-300 border-gray-400/30';
      default:
        return 'bg-gray-500/20 text-gray-300 border-gray-400/30';
    }
  };

  const displayName = member.full_name || member.display_name || 'Unnamed User';

  const ActionsMenu = () => {
    if (!canManage || isCurrentUser) return null;

    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-white hover:bg-white/20">
            <MoreVertical className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>Member Actions</DropdownMenuLabel>
          <DropdownMenuSeparator />
          
          {onChangeRole && (
            <DropdownMenuSub>
              <DropdownMenuSubTrigger>
                <UserCog className="h-4 w-4 mr-2" />
                Change Role
              </DropdownMenuSubTrigger>
              <DropdownMenuSubContent>
                <DropdownMenuItem 
                  onClick={() => onChangeRole(member.user_id, 'instructor')}
                  disabled={member.role === 'instructor'}
                >
                  Instructor
                </DropdownMenuItem>
                <DropdownMenuItem 
                  onClick={() => onChangeRole(member.user_id, 'student')}
                  disabled={member.role === 'student'}
                >
                  Student
                </DropdownMenuItem>
              </DropdownMenuSubContent>
            </DropdownMenuSub>
          )}
          
          {onRemoveMember && (
            <>
              <DropdownMenuSeparator />
              <DropdownMenuItem 
                onClick={() => onRemoveMember(member.user_id)}
                className="text-destructive focus:text-destructive"
              >
                <UserMinus className="h-4 w-4 mr-2" />
                Remove from Organization
              </DropdownMenuItem>
            </>
          )}
        </DropdownMenuContent>
      </DropdownMenu>
    );
  };

  // List View - Compact horizontal layout
  if (viewMode === 'list') {
    return (
      <div className="flex items-center justify-between p-3 border border-orange-400/50 rounded-lg bg-orange-500/80 backdrop-blur-sm hover:bg-orange-500/85 transition-colors">
        <div className="flex items-center gap-3 flex-1 min-w-0">
          <Avatar className="h-10 w-10 border-2 border-orange-300/30 shrink-0">
            <AvatarImage src={member.profiles?.avatar_url} />
            <AvatarFallback className="bg-orange-500 text-white text-sm">
              {getInitials(displayName)}
            </AvatarFallback>
          </Avatar>
          
          <div className="flex-1 min-w-0">
            <h4 className="font-semibold text-orange-200 truncate">
              {displayName}
              {isCurrentUser && <Badge variant="outline" className="ml-2 text-xs">You</Badge>}
            </h4>
            <div className="flex items-center gap-2 flex-wrap">
              <Badge className={getRoleBadgeColor(member.role) + ' text-xs'}>
                {member.role.charAt(0).toUpperCase() + member.role.slice(1).replace('-', ' ')}
              </Badge>
              {member.profiles?.job_title && (
                <span className="text-xs text-orange-100/80 truncate">{member.profiles.job_title}</span>
              )}
            </div>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onViewProfile?.(member)}
            className="shrink-0 bg-white/10 border-white/30 text-white hover:bg-white/20"
          >
            <UserCircle className="h-4 w-4" />
          </Button>
          <ActionsMenu />
        </div>
      </div>
    );
  }

  // Small Tiles View - Compact card
  if (viewMode === 'small-tiles') {
    return (
      <Card className="bg-orange-500/80 backdrop-blur-sm border border-orange-400/50 hover:bg-orange-500/85 transition-colors">
        <CardContent className="p-4 space-y-3">
          <div className="flex items-start justify-between">
            <div className="flex flex-col items-center text-center flex-1">
              <Avatar className="h-12 w-12 border-2 border-orange-300/30 mb-2">
                <AvatarImage src={member.profiles?.avatar_url} />
                <AvatarFallback className="bg-orange-500 text-white">
                  {getInitials(displayName)}
                </AvatarFallback>
              </Avatar>
              
              <h4 className="font-semibold text-orange-200 truncate w-full text-sm">
                {displayName}
              </h4>
              {isCurrentUser && <Badge variant="outline" className="text-xs mt-1">You</Badge>}
              
              <Badge className={getRoleBadgeColor(member.role) + ' text-xs mt-1'}>
                {member.role}
              </Badge>
            </div>
            <ActionsMenu />
          </div>
          
          {member.profiles?.email && (
            <a 
              href={`mailto:${member.profiles.email}`}
              className="flex items-center justify-center gap-1 text-xs text-orange-200 hover:text-orange-100 transition-colors"
            >
              <Mail className="w-3 h-3 shrink-0" />
              <span className="truncate">{member.profiles.email}</span>
            </a>
          )}
          
          <Button
            variant="outline"
            size="sm"
            onClick={() => onViewProfile?.(member)}
            className="w-full bg-white/10 border-white/30 text-white hover:bg-white/20 text-xs"
          >
            <UserCircle className="h-3 w-3 mr-1" />
            View
          </Button>
        </CardContent>
      </Card>
    );
  }

  // Large Tiles View - Full detail card (default)
  return (
    <Card className="bg-orange-500/80 backdrop-blur-sm border border-orange-400/50 hover:bg-orange-500/85 transition-colors">
      <CardHeader className="pb-3">
        <div className="flex items-center gap-4">
          <Avatar className="h-16 w-16 border-2 border-orange-300/30">
            <AvatarImage src={member.profiles?.avatar_url} />
            <AvatarFallback className="bg-orange-500 text-white text-lg">
              {getInitials(displayName)}
            </AvatarFallback>
          </Avatar>
          
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-orange-200 truncate text-lg">
              {displayName}
              {isCurrentUser && <Badge variant="outline" className="ml-2">You</Badge>}
            </h3>
            <div className="flex items-center gap-2 mt-2 flex-wrap">
              <Badge className={getRoleBadgeColor(member.role)}>
                {member.role.charAt(0).toUpperCase() + member.role.slice(1).replace('-', ' ')}
              </Badge>
              <Badge className={getStatusBadgeColor(member.status)}>
                {member.status}
              </Badge>
            </div>
          </div>
          
          <ActionsMenu />
        </div>
      </CardHeader>

      <CardContent className="flex flex-col h-full">
        {/* Content wrapper with flex-1 to push button to bottom */}
        <div className="space-y-3 flex-1">
          {/* Job Title / Department */}
          {(member.profiles?.job_title || member.profiles?.department) && (
            <div className="space-y-2">
              {member.profiles?.job_title && (
                <div className="flex items-center gap-2 text-sm text-orange-100">
                  <Briefcase className="w-4 h-4 text-orange-300 shrink-0" />
                  <span className="truncate">{member.profiles.job_title}</span>
                </div>
              )}
              {member.profiles?.department && (
                <div className="flex items-center gap-2 text-sm text-orange-100">
                  <Building2 className="w-4 h-4 text-orange-300 shrink-0" />
                  <span className="truncate">{member.profiles.department}</span>
                </div>
              )}
            </div>
          )}

          {/* Subject Taught (for instructors) */}
          {member.profiles?.subject_taught && (
            <div className="text-sm text-orange-100/90">
              <span className="font-medium">Subject: </span>
              {member.profiles.subject_taught}
            </div>
          )}

          {/* Contact Information */}
          <div className="space-y-2 pt-2 border-t border-orange-400/30">
            {member.profiles?.email && (
              <a 
                href={`mailto:${member.profiles.email}`}
                className="flex items-center gap-2 text-sm text-orange-200 hover:text-orange-100 transition-colors group"
              >
                <Mail className="w-4 h-4 text-orange-300 shrink-0 group-hover:text-orange-200" />
                <span className="truncate">{member.profiles.email}</span>
              </a>
            )}
            
            {member.profiles?.phone_number && (
              <div className="flex items-center gap-2 text-sm text-orange-100">
                <Phone className="w-4 w-4 text-orange-300 shrink-0" />
                <span>
                  {member.profiles.phone_number}
                  {member.profiles.phone_extension && ` ext. ${member.profiles.phone_extension}`}
                </span>
              </div>
            )}
          </div>
        </div>

        {/* View Profile Button - always at bottom */}
        <div className="mt-auto pt-3 space-y-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onViewProfile?.(member)}
            className="w-full bg-white/10 border-white/30 text-white hover:bg-white/20"
          >
            <UserCircle className="h-4 w-4 mr-2" />
            View Full Profile
          </Button>

          {/* Member Since */}
          <div className="text-xs text-orange-200/60 text-center">
            Member since {new Date(member.joined_at).toLocaleDateString()}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
