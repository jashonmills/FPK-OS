import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { 
  Home, 
  Users, 
  BookOpen, 
  Target, 
  FileText, 
  BarChart3,
  Settings,
  UserPlus,
  Palette,
  Menu,
  X,
  Brain,
  Clipboard,
  ExternalLink,
  ChevronLeft,
  ChevronRight,
  Gamepad2,
  HelpCircle
} from 'lucide-react';
import { useOrgContext } from './OrgContext';
import { useIsMobile } from '@/hooks/use-mobile';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface NavItem {
  href: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  roles?: string[];
}

export function OrgNavigation() {
  const { currentOrg } = useOrgContext();
  const isMobile = useIsMobile();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useLocalStorage('orgNavCollapsed', false);

  if (!currentOrg) return null;

  const toggleCollapse = () => {
    const newValue = !isCollapsed;
    setIsCollapsed(newValue);
    // Dispatch custom event to sync with OrgLayout
    window.dispatchEvent(new CustomEvent('orgNavCollapsedChange', { detail: newValue }));
  };

  const navItems: NavItem[] = [
    {
      href: `/org/${currentOrg.organization_id}`,
      label: 'Dashboard',
      icon: Home,
    },
    {
      href: `/org/${currentOrg.organization_id}/students`,
      label: 'Students',
      icon: Users,
      roles: ['owner', 'instructor'],
    },
    {
      href: `/org/${currentOrg.organization_id}/groups`,
      label: 'Groups',
      icon: Users,
      roles: ['owner', 'instructor'],
    },
    {
      href: `/org/${currentOrg.organization_id}/courses`,
      label: 'Courses',
      icon: BookOpen,
    },
    {
      href: `/org/${currentOrg.organization_id}/iep`,
      label: 'Interactive IEP',
      icon: Clipboard,
      roles: ['owner', 'instructor'],
    },
    {
      href: `/org/${currentOrg.organization_id}/goals-notes`,
      label: 'Goals & Notes',
      icon: Target,
    },
    {
      href: `/org/${currentOrg.organization_id}/ai-coach`,
      label: currentOrg.role === 'student' ? 'AI Learning Coach' : 'AI Org Assistant',
      icon: Brain,
    },
    {
      href: `/org/${currentOrg.organization_id}/games`,
      label: 'Games',
      icon: Gamepad2,
    },
    {
      href: `/org/${currentOrg.organization_id}/website`,
      label: 'Website',
      icon: ExternalLink,
      roles: ['owner', 'instructor'],
    },
    {
      href: currentOrg.role === 'student' 
        ? `/org/${currentOrg.organization_id}/student-settings`
        : `/org/${currentOrg.organization_id}/settings`,
      label: 'Settings',
      icon: Settings,
      // Allow all roles to access settings (students get their own settings page)
    },
  ];

  // Add Platform Guide link - available to all roles
  const platformGuideItem: NavItem = {
    href: '/dashboard/platform-guide',
    label: 'Platform Guide',
    icon: HelpCircle,
  };

  const filteredNavItems = navItems.filter(item => {
    if (!item.roles) return true;
    const hasPermission = item.roles.includes(currentOrg.role);
    
    // Debug logging for Settings button
    if (item.label === 'Settings') {
      console.log('Settings button debug:', {
        userRole: currentOrg.role,
        requiredRoles: item.roles,
        hasPermission,
        orgData: currentOrg
      });
    }
    
    return hasPermission;
  });

  // Add Platform Guide at the end with a separator visual
  const allNavItems = [...filteredNavItems, platformGuideItem];

  if (isMobile) {
    return (
      <>
        {/* Mobile Menu Button */}
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="fixed top-20 left-4 z-50 p-3 bg-purple-900/90 backdrop-blur-sm rounded-lg text-white shadow-lg md:hidden hover:bg-purple-800/90 transition-colors"
          aria-label="Toggle navigation menu"
        >
          {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>

        {/* Mobile Menu Overlay */}
        {isMobileMenuOpen && (
          <div 
            className="fixed inset-0 bg-black/50 z-40 md:hidden"
            onClick={() => setIsMobileMenuOpen(false)}
          />
        )}

        {/* Mobile Navigation */}
        <nav className={cn(
          "fixed top-0 left-0 w-80 h-full bg-purple-900/95 backdrop-blur-sm transform transition-transform duration-300 z-50 md:hidden",
          isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"
        )}>
          <div className="pt-16 p-4 overflow-y-auto h-full">
            <div className="space-y-2">
              {allNavItems.map((item, index) => (
                <React.Fragment key={item.href}>
                  {/* Add separator before Platform Guide */}
                  {index === allNavItems.length - 1 && (
                    <div className="my-3 border-t border-white/20" />
                  )}
                  <NavLink
                    to={item.href}
                    end={item.href === `/org/${currentOrg.organization_id}`}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={({ isActive }) =>
                      cn(
                        'flex items-center space-x-3 px-4 py-3 rounded-md text-base font-medium transition-colors',
                        isActive
                          ? 'bg-orange-500/70 text-white'
                          : 'text-white/80 hover:text-white hover:bg-orange-500/40'
                      )
                    }
                  >
                    <item.icon className="h-5 w-5" />
                    <span>{item.label}</span>
                  </NavLink>
                </React.Fragment>
              ))}
            </div>
          </div>
        </nav>
      </>
    );
  }

  // Desktop Navigation - Shows on tablets and up (768px+)
  return (
    <TooltipProvider>
      <nav className={cn(
        "fixed top-16 left-0 h-[calc(100vh-4rem)] bg-purple-900/65 backdrop-blur-sm border-r z-40 hidden md:flex flex-col transition-all duration-300",
        isCollapsed ? "w-16" : "w-64"
      )}>
        {/* Collapse Toggle Button - Always visible at top */}
        <div className={cn("p-2 border-b border-white/10 flex-shrink-0", isCollapsed && "px-1")}>
          <button
            onClick={toggleCollapse}
            className="w-full flex items-center justify-center px-3 py-2 rounded-md text-white/80 hover:text-white hover:bg-orange-500/40 transition-colors"
            aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            {isCollapsed ? (
              <ChevronRight className="h-4 w-4" />
            ) : (
              <>
                <ChevronLeft className="h-4 w-4 mr-2" />
                <span className="text-sm font-medium">Collapse</span>
              </>
            )}
          </button>
        </div>

        <div className={cn("p-4 flex-1 overflow-y-auto", isCollapsed && "px-2")}>
          <div className="space-y-2">
            {allNavItems.map((item, index) => {
              // Add separator before Platform Guide
              const showSeparator = index === allNavItems.length - 1;
              const navContent = (
                <>
                  {showSeparator && !isCollapsed && (
                    <div className="my-3 border-t border-white/20" />
                  )}
                  <NavLink
                    to={item.href}
                    end={item.href === `/org/${currentOrg.organization_id}`}
                    className={({ isActive }) =>
                      cn(
                        'flex items-center rounded-md text-sm font-medium transition-colors',
                        isCollapsed ? 'justify-center px-3 py-2' : 'space-x-3 px-3 py-2',
                        isActive
                          ? 'bg-orange-500/70 text-white'
                          : 'text-white/80 hover:text-white hover:bg-orange-500/40'
                      )
                    }
                  >
                    <item.icon className="h-4 w-4 flex-shrink-0" />
                    {!isCollapsed && <span className="transition-opacity duration-300">{item.label}</span>}
                  </NavLink>
                </>
              );

              if (isCollapsed) {
                return (
                  <Tooltip key={item.href} delayDuration={300}>
                    <TooltipTrigger asChild>
                      {navContent}
                    </TooltipTrigger>
                    <TooltipContent side="right" className="bg-purple-900 text-white border-purple-700">
                      <p>{item.label}</p>
                    </TooltipContent>
                  </Tooltip>
                );
              }

              return navContent;
            })}
          </div>
        </div>
      </nav>
    </TooltipProvider>
  );
}