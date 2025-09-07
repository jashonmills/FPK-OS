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
import { useOrgContext } from './OrgContext';

export function OrgSwitcher() {
  const { 
    currentOrg, 
    organizations, 
    activeOrgId, 
    isPersonalMode, 
    switchOrganization, 
    switchToPersonal,
    isLoading 
  } = useOrgContext();

  if (isLoading) {
    return (
      <div className="flex items-center gap-2 px-3 py-2 bg-muted/50 rounded-md">
        <div className="w-4 h-4 bg-muted animate-pulse rounded" />
        <span className="text-sm text-muted-foreground">Loading...</span>
      </div>
    );
  }

  const currentContext = isPersonalMode ? 'Personal' : currentOrg?.organizations.name || 'No Organization';
  const currentRole = currentOrg?.role;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className="flex items-center gap-2 min-w-[200px] justify-between">
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
              {currentRole && (
                <Badge variant="secondary" className="text-xs h-4 px-1">
                  {currentRole}
                </Badge>
              )}
            </div>
          </div>
          <ChevronDown className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="w-[250px]">
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
      </DropdownMenuContent>
    </DropdownMenu>
  );
}