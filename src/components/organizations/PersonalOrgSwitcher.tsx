import React from 'react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Badge } from '@/components/ui/badge';
import { ChevronDown, Building2, User, Check } from 'lucide-react';
import { useUserOrganizations } from '@/hooks/useUserOrganization';
import { useNavigate, useLocation } from 'react-router-dom';

/**
 * Personal Organization Switcher - Works without OrgProvider
 * Used in personal dashboard header to switch between personal and organization contexts
 */
export function PersonalOrgSwitcher() {
  const { data: organizations, isLoading } = useUserOrganizations();
  const navigate = useNavigate();
  const location = useLocation();

  // Determine if we're in organization mode based on URL
  const isInOrgMode = location.pathname.startsWith('/org/');
  const isPersonalMode = !isInOrgMode;

  if (isLoading) {
    return (
      <div className="flex items-center gap-2 px-3 py-2 bg-muted/50 rounded-md">
        <div className="w-4 h-4 bg-muted animate-pulse rounded" />
        <span className="text-sm text-muted-foreground">Loading...</span>
      </div>
    );
  }

  const switchToPersonal = () => {
    navigate('/dashboard/learner');
  };

  const switchToOrganization = (orgId: string) => {
    navigate(`/org/${orgId}`);
  };

  const currentContext = isPersonalMode ? 'Personal' : 'Organization';

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className="flex items-center gap-2 w-full sm:w-auto sm:min-w-[200px] justify-between">
          <div className="flex items-center gap-2">
            {isPersonalMode ? (
              <User className="h-4 w-4" />
            ) : (
              <Building2 className="h-4 w-4" />
            )}
            <div className="flex flex-col items-start">
              <span className="text-sm font-medium truncate max-w-[120px]">
                {currentContext}
              </span>
            </div>
          </div>
          <ChevronDown className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent 
        align="start" 
        className="w-[250px] mobile-dropdown-content" 
        sideOffset={5}
        avoidCollisions={true}
        sticky="always"
        onCloseAutoFocus={(e) => e.preventDefault()}
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
        
        {organizations && organizations.length > 0 && (
          <>
            <DropdownMenuSeparator />
            <DropdownMenuLabel>Organizations</DropdownMenuLabel>
            {organizations.map((org) => {
              // Sanitize org name - take only first line before error patterns
              const sanitizedName = org.organizations.name.split(/\n|at |https?:\/\//)[0].trim();
              const displayName = sanitizedName.length > 30 
                ? sanitizedName.substring(0, 30) + '...' 
                : sanitizedName;
              
              return (
                <DropdownMenuItem
                  key={org.organization_id}
                  onClick={() => switchToOrganization(org.organization_id)}
                  title={sanitizedName}
                >
                  <div className="flex items-center justify-between w-full">
                    <div className="flex items-center gap-2">
                      <Building2 className="h-4 w-4" />
                      <div className="flex flex-col">
                        <span className="truncate max-w-[150px]">
                          {displayName}
                        </span>
                        <Badge variant="outline" className="text-xs h-4 px-1 w-fit">
                          {org.role}
                        </Badge>
                      </div>
                    </div>
                  </div>
                </DropdownMenuItem>
              );
            })}
          </>
        )}

        {(!organizations || organizations.length === 0) && (
          <>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => navigate('/dashboard/organizations')}>
              <div className="flex items-center gap-2">
                <Building2 className="h-4 w-4" />
                <span className="text-muted-foreground">Join an organization</span>
              </div>
            </DropdownMenuItem>
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}