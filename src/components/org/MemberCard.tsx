import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Mail, Phone, UserCircle, Briefcase, Building2 } from 'lucide-react';
import { OrgMember } from '@/hooks/useOrgMembers';

interface MemberCardProps {
  member: OrgMember;
  onViewProfile?: (member: OrgMember) => void;
}

export function MemberCard({ member, onViewProfile }: MemberCardProps) {
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
        </div>
      </CardHeader>

      <CardContent className="space-y-3">
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
              <Phone className="w-4 h-4 text-orange-300 shrink-0" />
              <span>
                {member.profiles.phone_number}
                {member.profiles.phone_extension && ` ext. ${member.profiles.phone_extension}`}
              </span>
            </div>
          )}
        </div>

        {/* View Profile Button */}
        <Button
          variant="outline"
          size="sm"
          onClick={() => onViewProfile?.(member)}
          className="w-full mt-3 bg-white/10 border-white/30 text-white hover:bg-white/20"
        >
          <UserCircle className="h-4 w-4 mr-2" />
          View Full Profile
        </Button>

        {/* Member Since */}
        <div className="text-xs text-orange-200/60 text-center pt-2">
          Member since {new Date(member.joined_at).toLocaleDateString()}
        </div>
      </CardContent>
    </Card>
  );
}
