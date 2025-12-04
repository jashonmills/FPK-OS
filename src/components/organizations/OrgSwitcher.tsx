import React from 'react';
import { Button } from '@/components/ui/button';
import { useIsMobile } from '@/hooks/use-mobile';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Badge } from '@/components/ui/badge';
import { ChevronDown, Building2, User, Check, Eye, Crown, Shield, GraduationCap, Users } from 'lucide-react';
import { useOrgContext, MemberRole } from './OrgContext';

const ROLE_CONFIG: Record<MemberRole, { label: string; icon: React.ElementType; color: string }> = {
  owner: { label: 'Owner', icon: Crown, color: 'text-amber-500' },
  admin: { label: 'Admin', icon: Shield, color: 'text-blue-500' },
  instructor: { label: 'Instructor', icon: GraduationCap, color: 'text-green-500' },
  instructor_aide: { label: 'Instructor Aide', icon: Users, color: 'text-teal-500' },
  viewer: { label: 'Viewer', icon: Eye, color: 'text-gray-500' },
  student: { label: 'Student', icon: User, color: 'text-purple-500' },
};

export function OrgSwitcher() {
  const { 
    currentOrg, 
    organizations, 
    activeOrgId, 
    isPersonalMode, 
    switchOrganization, 
    switchToPersonal,
    isLoading,
    viewAsRole,
    setViewAsRole,
    getEffectiveRole,
    isImpersonating,
    canImpersonate,
  } = useOrgContext();
  const isMobile = useIsMobile();

  if (isLoading) {
    return (
      <div className="flex items-center gap-2 px-3 py-2 bg-muted/50 rounded-md">
        <div className="w-4 h-4 bg-muted animate-pulse rounded" />
        <span className="text-sm text-muted-foreground">Loading...</span>
      </div>
    );
  }

  const currentContext = isPersonalMode ? 'Personal' : currentOrg?.organizations.name || 'No Organization';
  const effectiveRole = getEffectiveRole();
  const actualRole = currentOrg?.role;

  const handleViewAsRole = (role: MemberRole | null) => {
    setViewAsRole(role);
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button 
          variant="outline" 
          className={`flex items-center gap-1 sm:gap-2 sm:min-w-[200px] justify-between h-9 px-2 sm:px-3 max-w-[180px] sm:max-w-none ${isImpersonating ? 'border-amber-500/50 bg-amber-500/10' : ''}`}
        >
          <div className="flex items-center gap-1 sm:gap-2 min-w-0">
            {isPersonalMode ? (
              <User className="h-4 w-4 flex-shrink-0" />
            ) : (
              <Building2 className="h-4 w-4 flex-shrink-0" />
            )}
            <div className="flex flex-col items-start min-w-0">
              <span className="text-xs sm:text-sm font-medium truncate max-w-[100px] sm:max-w-[140px]">
                {currentContext}
              </span>
              {effectiveRole && !isMobile && (
                <div className="flex items-center gap-1">
                  <Badge 
                    variant={isImpersonating ? "outline" : "secondary"} 
                    className={`text-xs h-4 px-1 ${isImpersonating ? 'border-amber-500 text-amber-600' : ''}`}
                  >
                    {isImpersonating && <Eye className="h-2.5 w-2.5 mr-0.5" />}
                    {ROLE_CONFIG[effectiveRole]?.label || effectiveRole}
                  </Badge>
                </div>
              )}
            </div>
          </div>
          <ChevronDown className="h-3 w-3 sm:h-4 sm:w-4 flex-shrink-0" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent 
        align="start" 
        className="w-[280px] z-[100]"
        sideOffset={8}
        collisionPadding={8}
      >
        <DropdownMenuLabel>Switch Context</DropdownMenuLabel>
        <DropdownMenuSeparator />
        
        {/* Personal Mode */}
        <DropdownMenuItem onClick={switchToPersonal}>
          <div className="flex items-center justify-between w-full">
            <div className="flex items-center gap-2">
              <User className="h-4 w-4" />
              <span>Personal</span>
            </div>
            {isPersonalMode && <Check className="h-4 w-4" />}
          </div>
        </DropdownMenuItem>
        
        {organizations.length > 0 && (
          <>
            <DropdownMenuSeparator />
            <DropdownMenuLabel>Organizations</DropdownMenuLabel>
            {organizations.map((org) => (
              <DropdownMenuItem
                key={org.organization_id}
                onClick={() => switchOrganization(org.organization_id)}
              >
                <div className="flex items-center justify-between w-full">
                  <div className="flex items-center gap-2">
                    <Building2 className="h-4 w-4" />
                    <div className="flex flex-col">
                      <span className="truncate max-w-[150px]">
                        {org.organizations.name}
                      </span>
                      <Badge variant="outline" className="text-xs h-4 px-1 w-fit">
                        {org.role}
                      </Badge>
                    </div>
                  </div>
                  {activeOrgId === org.organization_id && <Check className="h-4 w-4" />}
                </div>
              </DropdownMenuItem>
            ))}
          </>
        )}

        {/* View As Role Section - Only for owners/admins */}
        {!isPersonalMode && canImpersonate && (
          <>
            <DropdownMenuSeparator />
            <DropdownMenuLabel className="flex items-center gap-2">
              <Eye className="h-3.5 w-3.5" />
              View As (Dev Mode)
            </DropdownMenuLabel>
            
            {/* Clear impersonation option */}
            <DropdownMenuItem 
              onClick={() => handleViewAsRole(null)}
              className={!viewAsRole ? 'bg-accent' : ''}
            >
              <div className="flex items-center justify-between w-full">
                <div className="flex items-center gap-2">
                  <Crown className={`h-4 w-4 ${ROLE_CONFIG.owner.color}`} />
                  <span>My Actual Role ({actualRole})</span>
                </div>
                {!viewAsRole && <Check className="h-4 w-4" />}
              </div>
            </DropdownMenuItem>

            {/* Role options */}
            {(['owner', 'admin', 'instructor', 'student'] as MemberRole[]).map((role) => {
              const config = ROLE_CONFIG[role];
              const Icon = config.icon;
              const isSelected = viewAsRole === role;
              
              return (
                <DropdownMenuItem
                  key={role}
                  onClick={() => handleViewAsRole(role)}
                  className={isSelected ? 'bg-accent' : ''}
                >
                  <div className="flex items-center justify-between w-full">
                    <div className="flex items-center gap-2">
                      <Icon className={`h-4 w-4 ${config.color}`} />
                      <span>{config.label}</span>
                    </div>
                    {isSelected && <Check className="h-4 w-4" />}
                  </div>
                </DropdownMenuItem>
              );
            })}
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
