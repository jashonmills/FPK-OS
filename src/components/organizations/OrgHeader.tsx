import React from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { ChevronDown, Users, Settings, LogOut } from 'lucide-react';
import { useOrgContext } from './OrgContext';
import { useAuth } from '@/hooks/useAuth';

export function OrgHeader() {
  const { currentOrg, organizations, switchOrganization } = useOrgContext();
  const { signOut } = useAuth();

  if (!currentOrg) {
    return (
      <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="text-lg font-semibold text-muted-foreground">
              No Organization Selected
            </div>
          </div>
        </div>
      </header>
    );
  }

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'owner': return 'bg-primary';
      case 'instructor': return 'bg-blue-500';
      case 'student': return 'bg-green-500';
      default: return 'bg-gray-500';
    }
  };

  return (
    <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Avatar className="h-8 w-8">
              <AvatarFallback className="text-sm">
                {currentOrg.organizations.name.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            
            <div className="flex items-center space-x-2">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="flex items-center space-x-2">
                    <span className="font-medium">{currentOrg.organizations.name}</span>
                    <ChevronDown className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start" className="w-64">
                  {organizations.map((org) => (
                    <DropdownMenuItem
                      key={org.organization_id}
                      onClick={() => switchOrganization(org.organization_id)}
                      className="flex items-center space-x-2"
                    >
                      <Avatar className="h-6 w-6">
                        <AvatarFallback className="text-xs">
                          {org.organizations.name.charAt(0).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <div className="font-medium">{org.organizations.name}</div>
                        <div className="text-sm text-muted-foreground capitalize">
                          {org.role} • {org.organizations.subscription_tier}
                        </div>
                      </div>
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
              
              <Badge variant="secondary" className={getRoleColor(currentOrg.role)}>
                {currentOrg.role}
              </Badge>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <Button variant="ghost" size="sm">
              <Users className="h-4 w-4 mr-2" />
              Members
            </Button>
            <Button variant="ghost" size="sm">
              <Settings className="h-4 w-4 mr-2" />
              Settings
            </Button>
            <Button variant="ghost" size="sm" onClick={signOut}>
              <LogOut className="h-4 w-4 mr-2" />
              Sign Out
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
}