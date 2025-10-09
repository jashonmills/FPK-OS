import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Mail, Phone, BookOpen, Briefcase, Building2, User } from 'lucide-react';
import { OrgMember } from '@/hooks/useOrgMembers';

interface MemberProfileDialogProps {
  member: OrgMember | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function MemberProfileDialog({ member, open, onOpenChange }: MemberProfileDialogProps) {
  if (!member) return null;

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

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl bg-background/95 border-border">
        <DialogHeader>
          <DialogTitle className="text-2xl text-foreground">Member Profile</DialogTitle>
          <DialogDescription className="text-muted-foreground">
            View detailed information about this organization member
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Profile Header */}
          <div className="flex items-start gap-4 p-4 bg-accent/50 rounded-lg border border-border">
            <Avatar className="h-20 w-20 border-2 border-border">
              <AvatarImage src={member.profiles?.avatar_url} />
              <AvatarFallback className="bg-primary text-primary-foreground text-xl">
                {getInitials(member.display_name || member.full_name || 'User')}
              </AvatarFallback>
            </Avatar>
            
            <div className="flex-1">
              <h3 className="text-xl font-semibold text-foreground">
                {member.full_name || member.display_name || 'Unnamed User'}
              </h3>
              <Badge className={`mt-2 ${getRoleBadgeColor(member.role)}`}>
                {member.role.charAt(0).toUpperCase() + member.role.slice(1).replace('-', ' ')}
              </Badge>
            </div>
          </div>

          {/* Contact Information */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold text-foreground flex items-center gap-2">
              <User className="h-5 w-5" />
              Contact Information
            </h4>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-3 bg-accent/30 rounded-lg border border-border">
                <div className="flex items-center gap-2 text-muted-foreground text-sm mb-1">
                  <Mail className="h-4 w-4" />
                  Email
                </div>
                <p className="text-foreground font-medium">
                  {member.profiles?.email || 'Not provided'}
                </p>
              </div>

              <div className="p-3 bg-accent/30 rounded-lg border border-border">
                <div className="flex items-center gap-2 text-muted-foreground text-sm mb-1">
                  <Phone className="h-4 w-4" />
                  Phone Number
                </div>
                <p className="text-foreground font-medium">
                  {(member.profiles as any)?.phone_number || 'Not provided'}
                </p>
              </div>

              <div className="p-3 bg-accent/30 rounded-lg border border-border">
                <div className="flex items-center gap-2 text-muted-foreground text-sm mb-1">
                  <Phone className="h-4 w-4" />
                  Extension
                </div>
                <p className="text-foreground font-medium">
                  {(member.profiles as any)?.phone_extension || 'N/A'}
                </p>
              </div>

              <div className="p-3 bg-accent/30 rounded-lg border border-border">
                <div className="flex items-center gap-2 text-muted-foreground text-sm mb-1">
                  <BookOpen className="h-4 w-4" />
                  Subject/What They Teach
                </div>
                <p className="text-foreground font-medium">
                  {(member.profiles as any)?.subject_taught || 'Not specified'}
                </p>
              </div>
            </div>
          </div>

          {/* Professional Information */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold text-foreground flex items-center gap-2">
              <Briefcase className="h-5 w-5" />
              Professional Information
            </h4>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-3 bg-accent/30 rounded-lg border border-border">
                <div className="flex items-center gap-2 text-muted-foreground text-sm mb-1">
                  <Briefcase className="h-4 w-4" />
                  Job Title
                </div>
                <p className="text-foreground font-medium">
                  {(member.profiles as any)?.job_title || 'Not specified'}
                </p>
              </div>

              <div className="p-3 bg-accent/30 rounded-lg border border-border">
                <div className="flex items-center gap-2 text-muted-foreground text-sm mb-1">
                  <Building2 className="h-4 w-4" />
                  Department
                </div>
                <p className="text-foreground font-medium">
                  {(member.profiles as any)?.department || 'Not specified'}
                </p>
              </div>
            </div>
          </div>

          {/* Membership Information */}
          <div className="p-4 bg-accent/30 rounded-lg border border-border">
            <h4 className="text-lg font-semibold text-foreground mb-3">Membership Information</h4>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-muted-foreground">Status</p>
                <Badge variant="outline" className="mt-1 bg-green-500/20 text-green-300 border-green-400/30">
                  {member.status}
                </Badge>
              </div>
              <div>
                <p className="text-muted-foreground">Joined</p>
                <p className="text-foreground font-medium mt-1">
                  {new Date(member.joined_at).toLocaleDateString()}
                </p>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
