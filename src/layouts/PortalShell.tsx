import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { 
  Home, 
  BookOpen, 
  Layers, 
  Users, 
  MessageSquare, 
  Package, 
  Box, 
  BarChart3,
  Menu,
  X,
  Settings,
  LogOut,
  ChevronRight
} from 'lucide-react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { cn } from '@/lib/utils';

interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface PortalShellProps {
  children: React.ReactNode;
  title?: string;
  breadcrumb?: BreadcrumbItem[];
}

interface NavItem {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  to: string;
  activePattern?: RegExp;
  divider?: boolean;
  heading?: boolean;
}

const navigationItems: (NavItem | { divider: true } | { heading: string })[] = [
  { icon: Home, label: 'Admin Dashboard', to: '/dashboard' },
  { icon: BookOpen, label: 'Course Manager', to: '/courses' },
  { icon: Layers, label: 'Module Manager', to: '/modules' },
  { icon: Users, label: 'User Management', to: '/users' },
  { icon: MessageSquare, label: 'Beta Management', to: '/beta' },
  { divider: true },
  { heading: 'SCORM' },
  { 
    icon: Box, 
    label: 'SCORM Studio', 
    to: '/scorm/studio', 
    activePattern: /^\/scorm\/(studio|packages|qa)/ 
  },
  { icon: Package, label: 'Packages', to: '/scorm/studio?tab=packages' },
  { divider: true },
  { heading: 'Learning Dashboard' },
  { icon: Home, label: 'Home', to: '/' },
  { icon: BookOpen, label: 'Courses', to: '/courses' },
  { icon: BarChart3, label: 'Analytics', to: '/analytics' },
];

function Sidebar({ collapsed, onToggle }: { collapsed: boolean; onToggle: () => void }) {
  const navigate = useNavigate();
  const { user } = useAuth();

  return (
    <div className={cn(
      "bg-gradient-to-b from-purple-700 to-purple-900 text-white transition-all duration-300 flex flex-col",
      collapsed ? "w-16" : "w-64"
    )}>
      {/* Header */}
      <div className="p-4 border-b border-purple-600">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-gradient-to-br from-orange-400 to-pink-500 rounded-full flex items-center justify-center text-white font-bold text-sm">
            FPK
          </div>
          {!collapsed && (
            <div>
              <h1 className="font-bold text-lg">FPK University</h1>
              <p className="text-purple-200 text-sm">Learner Portal (Admin)</p>
            </div>
          )}
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto py-4">
        {navigationItems.map((item, index) => {
          if ('divider' in item) {
            return !collapsed ? <hr key={index} className="my-4 border-purple-600" /> : null;
          }
          
          if ('heading' in item) {
            return !collapsed ? (
              <div key={index} className="px-4 py-2 text-xs font-semibold text-purple-300 uppercase tracking-wide">
                {item.heading}
              </div>
            ) : null;
          }

          const Icon = item.icon;
          const isActive = item.activePattern 
            ? item.activePattern.test(window.location.pathname)
            : window.location.pathname === item.to;

          return (
            <NavLink
              key={index}
              to={item.to}
              className={({ isActive: navLinkActive }) => cn(
                "flex items-center gap-3 px-4 py-3 text-sm transition-colors",
                (isActive || navLinkActive) 
                  ? "bg-purple-800 text-white border-r-4 border-orange-400" 
                  : "text-purple-200 hover:bg-purple-800 hover:text-white"
              )}
            >
              <Icon className="w-5 h-5 flex-shrink-0" />
              {!collapsed && <span>{item.label}</span>}
            </NavLink>
          );
        })}
      </nav>

      {/* User Section */}
      <div className="border-t border-purple-600 p-4">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center text-white font-bold text-sm">
            {user?.email?.[0]?.toUpperCase() || 'U'}
          </div>
          {!collapsed && (
            <div className="flex-1 min-w-0">
              <p className="font-medium text-sm truncate">
                {user?.email || 'Admin User'}
              </p>
              <p className="text-purple-200 text-xs">
                {user?.email || 'admin@fpkuniversity.com'}
              </p>
            </div>
          )}
        </div>
        {!collapsed && (
          <div className="mt-3 flex gap-2">
            <Button
              variant="ghost"
              size="sm"
              className="text-purple-200 hover:text-white hover:bg-purple-800"
            >
              <Settings className="w-4 h-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="text-purple-200 hover:text-white hover:bg-purple-800"
              onClick={() => navigate('/auth/sign-out')}
            >
              <LogOut className="w-4 h-4" />
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}

function Topbar({ onMenuToggle }: { onMenuToggle: () => void }) {
  return (
    <div className="bg-white border-b border-gray-200 px-6 py-4">
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          size="sm"
          onClick={onMenuToggle}
          className="lg:hidden"
        >
          <Menu className="w-5 h-5" />
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={onMenuToggle}
          className="hidden lg:flex"
        >
          <Menu className="w-5 h-5" />
        </Button>
      </div>
    </div>
  );
}

export default function PortalShell({ children, title, breadcrumb }: PortalShellProps) {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  const handleToggleSidebar = () => {
    if (window.innerWidth < 1024) {
      setMobileSidebarOpen(!mobileSidebarOpen);
    } else {
      setSidebarCollapsed(!sidebarCollapsed);
    }
  };

  return (
    <div className="flex min-h-screen bg-background text-foreground w-full">
      {/* Desktop Sidebar */}
      <div className="hidden lg:block">
        <Sidebar collapsed={sidebarCollapsed} onToggle={handleToggleSidebar} />
      </div>

      {/* Mobile Sidebar Overlay */}
      {mobileSidebarOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-black bg-opacity-50" onClick={() => setMobileSidebarOpen(false)} />
          <div className="absolute left-0 top-0 h-full">
            <Sidebar collapsed={false} onToggle={handleToggleSidebar} />
            <Button
              variant="ghost"
              size="sm"
              className="absolute top-4 right-4 text-white hover:bg-purple-800"
              onClick={() => setMobileSidebarOpen(false)}
            >
              <X className="w-5 h-5" />
            </Button>
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        <Topbar onMenuToggle={handleToggleSidebar} />
        
        <div className="flex-1 px-6 py-4">
          {/* Breadcrumbs */}
          {breadcrumb && breadcrumb.length > 0 && (
            <nav className="mb-4">
              <ol className="flex items-center space-x-2 text-sm text-muted-foreground">
                {breadcrumb.map((item, index) => (
                  <li key={index} className="flex items-center">
                    {index > 0 && <ChevronRight className="w-4 h-4 mx-2" />}
                    {item.href ? (
                      <NavLink 
                        to={item.href} 
                        className="hover:text-foreground transition-colors"
                      >
                        {item.label}
                      </NavLink>
                    ) : (
                      <span className={index === breadcrumb.length - 1 ? "text-foreground font-medium" : ""}>
                        {item.label}
                      </span>
                    )}
                  </li>
                ))}
              </ol>
            </nav>
          )}

          {/* Page Title */}
          {title && (
            <div className="mb-6">
              <h1 className="text-2xl font-semibold text-foreground">{title}</h1>
            </div>
          )}

          {/* Page Content */}
          {children}
        </div>
      </div>
    </div>
  );
}