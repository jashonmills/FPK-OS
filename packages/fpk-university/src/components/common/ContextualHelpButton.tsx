/**
 * Contextual Help Button
 * Provides direct link to specific Platform Guide section
 */

import React from 'react';
import { HelpCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { getActiveOrgId } from '@/lib/org/context';
import { shouldShowPlatformGuide } from '@/lib/featureFlags';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

interface ContextualHelpButtonProps {
  section?: string; // e.g., 'dashboard', 'students', 'courses'
  label?: string;
  variant?: 'default' | 'ghost' | 'outline';
  size?: 'default' | 'sm' | 'lg' | 'icon';
  className?: string;
  viewMode?: 'org-owner' | 'student';
}

export function ContextualHelpButton({
  section,
  label = 'Help',
  variant = 'ghost',
  size = 'sm',
  className = '',
  viewMode = 'org-owner'
}: ContextualHelpButtonProps) {
  const navigate = useNavigate();
  
  // Don't render if feature is disabled
  if (!shouldShowPlatformGuide()) {
    return null;
  }

  const handleClick = () => {
    // Navigate to platform guide with section and view mode parameters
    const params = new URLSearchParams();
    if (section) params.append('section', section);
    if (viewMode) params.append('view', viewMode);
    
    // Check if we're in org context
    const orgId = getActiveOrgId();
    const basePath = orgId ? `/org/${orgId}/platform-guide` : '/dashboard/platform-guide';
    const guidePath = `${basePath}${params.toString() ? '?' + params.toString() : ''}`;
    navigate(guidePath);
  };

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant={variant}
            size={size}
            onClick={handleClick}
            className={`flex items-center gap-2 ${className}`}
          >
            <HelpCircle className="h-4 w-4" />
            {size !== 'icon' && <span className="hidden sm:inline">{label}</span>}
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <p>View help documentation for this page</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
