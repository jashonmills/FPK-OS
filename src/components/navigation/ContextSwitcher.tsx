import React from 'react';
import { Button } from '@/components/ui/button';
import { useNavigate, useLocation } from 'react-router-dom';
import { Building2, User, ArrowLeftRight } from 'lucide-react';
import { safeLocalStorage } from '@/utils/safeStorage';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuLabel
} from '@/components/ui/dropdown-menu';

/**
 * Context Switcher - Allows users to switch between Personal and Organization contexts
 */
export function ContextSwitcher() {
  const navigate = useNavigate();
  const location = useLocation();
  
  const isPersonalMode = location.pathname.startsWith('/dashboard');
  const isOrgMode = location.pathname.startsWith('/org/');
  
  // Get active org from localStorage (safe fallback)
  const activeOrgId = safeLocalStorage.getItem<string>('fpk.activeOrgId', {
    fallbackValue: null,
    logErrors: false
  });

  const handleSwitchToPersonal = () => {
    // Add intent parameter to prevent aggressive redirects
    navigate('/dashboard/learner?intent=personal', { replace: true });
  };

  const handleSwitchToOrg = () => {
    if (activeOrgId) {
      navigate(`/org/${activeOrgId}?intent=org`, { replace: true });
    } else {
      // Redirect to organizations hub if no active org
      navigate('/dashboard/organizations', { replace: true });
    }
  };

  // Don't show switcher if user has no org context available (only show in personal mode if they have an org)
  if (!activeOrgId && isPersonalMode) {
    return null;
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2">
          {isPersonalMode ? (
            <>
              <User className="h-4 w-4" />
              Personal
            </>
          ) : (
            <>
              <Building2 className="h-4 w-4" />
              Organization
            </>
          )}
          <ArrowLeftRight className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel>Switch Context</DropdownMenuLabel>
        <DropdownMenuSeparator />
        
        <DropdownMenuItem 
          onClick={handleSwitchToPersonal}
          className={isPersonalMode ? "bg-muted" : ""}
        >
          <User className="h-4 w-4 mr-2" />
          Personal Dashboard
          {isPersonalMode && <span className="ml-auto text-xs">Current</span>}
        </DropdownMenuItem>
        
        {activeOrgId && (
          <DropdownMenuItem 
            onClick={handleSwitchToOrg}
            className={isOrgMode ? "bg-muted" : ""}
          >
            <Building2 className="h-4 w-4 mr-2" />
            Organization
            {isOrgMode && <span className="ml-auto text-xs">Current</span>}
          </DropdownMenuItem>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}