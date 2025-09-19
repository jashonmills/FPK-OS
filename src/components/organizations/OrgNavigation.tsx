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
  X
} from 'lucide-react';
import { useOrgContext } from './OrgContext';
import { useIsMobile } from '@/hooks/use-mobile';

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

  if (!currentOrg) return null;

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
      href: `/org/${currentOrg.organization_id}/goals`,
      label: 'Goals',
      icon: Target,
    },
    {
      href: `/org/${currentOrg.organization_id}/notes`,
      label: 'Notes',
      icon: FileText,
    },
    {
      href: `/org/${currentOrg.organization_id}/analytics`,
      label: 'Analytics',
      icon: BarChart3,
      roles: ['owner', 'instructor'],
    },
    {
      href: `/org/${currentOrg.organization_id}/invite`,
      label: 'Invite Members',
      icon: UserPlus,
      roles: ['owner', 'instructor'],
    },
    {
      href: `/org/${currentOrg.organization_id}/branding`,
      label: 'Branding',
      icon: Palette,
      roles: ['owner', 'instructor'],
    },
    {
      href: `/org/${currentOrg.organization_id}/settings`,
      label: 'Settings',
      icon: Settings,
      roles: ['owner'],
    },
  ];

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

  if (isMobile) {
    return (
      <>
        {/* Mobile Menu Button */}
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="fixed top-4 left-4 z-50 p-2 bg-purple-900/80 backdrop-blur-sm rounded-md text-white lg:hidden"
        >
          {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>

        {/* Mobile Menu Overlay */}
        {isMobileMenuOpen && (
          <div 
            className="fixed inset-0 bg-black/50 z-40 lg:hidden"
            onClick={() => setIsMobileMenuOpen(false)}
          />
        )}

        {/* Mobile Navigation */}
        <nav className={cn(
          "fixed top-0 left-0 w-80 h-full bg-purple-900/95 backdrop-blur-sm transform transition-transform duration-300 z-50 lg:hidden",
          isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"
        )}>
          <div className="pt-16 p-4 overflow-y-auto h-full">
            <div className="space-y-2">
              {filteredNavItems.map((item) => (
                <NavLink
                  key={item.href}
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
              ))}
            </div>
          </div>
        </nav>
      </>
    );
  }

  // Desktop Navigation
  return (
    <nav className="fixed top-16 left-0 w-64 h-[calc(100vh-4rem)] bg-purple-900/65 backdrop-blur-sm border-r overflow-y-auto z-40 hidden lg:block">
      <div className="p-4">
        <div className="space-y-2">
          {filteredNavItems.map((item) => (
            <NavLink
              key={item.href}
              to={item.href}
              end={item.href === `/org/${currentOrg.organization_id}`}
              className={({ isActive }) =>
                cn(
                  'flex items-center space-x-3 px-3 py-2 rounded-md text-sm font-medium transition-colors',
                  isActive
                    ? 'bg-orange-500/70 text-white'
                    : 'text-white/80 hover:text-white hover:bg-orange-500/40'
                )
              }
            >
              <item.icon className="h-4 w-4" />
              <span>{item.label}</span>
            </NavLink>
          ))}
        </div>
      </div>
    </nav>
  );
}