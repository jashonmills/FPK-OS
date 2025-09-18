import React from 'react';
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
  Palette
} from 'lucide-react';
import { useOrgContext } from './OrgContext';

interface NavItem {
  href: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  roles?: string[];
}

export function OrgNavigation() {
  const { currentOrg } = useOrgContext();

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
    return item.roles.includes(currentOrg.role);
  });

  return (
    <nav className="w-64 bg-card border-r sticky top-16 h-[calc(100vh-4rem)] overflow-y-auto">
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
                    ? 'bg-primary text-primary-foreground'
                    : 'text-muted-foreground hover:text-foreground hover:bg-muted'
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