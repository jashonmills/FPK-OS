import { Button } from '@/components/ui/button';
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
} from '@/components/ui/drawer';
import { ThemeToggle } from '@/components/coach/ThemeToggle';
import { MessageSquare, History, Settings, BarChart2, LogOut, X } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

interface MobileNavigationDrawerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAnalyticsClick: () => void;
  currentView: 'chat' | 'history' | 'settings';
  onViewChange: (view: 'chat' | 'history' | 'settings') => void;
}

export function MobileNavigationDrawer({
  open,
  onOpenChange,
  onAnalyticsClick,
  currentView,
  onViewChange,
}: MobileNavigationDrawerProps) {
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    try {
      await supabase.auth.signOut();
      toast.success('Signed out successfully');
      navigate('/coach');
    } catch (error) {
      toast.error('Failed to sign out');
    }
  };

  const navItems = [
    { id: 'chat' as const, icon: MessageSquare, label: 'Chat' },
    { id: 'history' as const, icon: History, label: 'History' },
    { id: 'settings' as const, icon: Settings, label: 'Settings' },
  ];

  return (
    <Drawer open={open} onOpenChange={onOpenChange}>
      <DrawerContent className="h-[85vh]">
        <DrawerHeader className="border-b">
          <div className="flex items-center justify-between">
            <DrawerTitle>Menu</DrawerTitle>
            <DrawerClose asChild>
              <Button variant="ghost" size="icon">
                <X className="h-4 w-4" />
              </Button>
            </DrawerClose>
          </div>
        </DrawerHeader>

        <div className="flex flex-col h-full p-4 overflow-y-auto">
          {/* User Info */}
          <div className="mb-6 p-4 bg-muted/50 rounded-lg">
            <p className="text-sm text-muted-foreground mb-1">Welcome back,</p>
            <p className="font-semibold text-lg">{user?.email?.split('@')[0]}</p>
          </div>

          {/* Main Navigation */}
          <div className="space-y-2 mb-6">
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">
              Navigation
            </p>
            {navItems.map((item) => (
              <Button
                key={item.id}
                variant={currentView === item.id ? 'default' : 'ghost'}
                className={cn(
                  "w-full justify-start gap-3 h-12",
                  currentView === item.id && "bg-primary text-primary-foreground"
                )}
                onClick={() => {
                  onViewChange(item.id);
                  onOpenChange(false);
                }}
              >
                <item.icon className="h-5 w-5" />
                <span>{item.label}</span>
              </Button>
            ))}
          </div>

          {/* Actions */}
          <div className="space-y-2 mb-6">
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">
              Tools
            </p>
            <Button
              variant="ghost"
              className="w-full justify-start gap-3 h-12"
              onClick={() => {
                onAnalyticsClick();
                onOpenChange(false);
              }}
            >
              <BarChart2 className="h-5 w-5" />
              <span>Analytics Dashboard</span>
            </Button>
            <div className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
              <div className="flex items-center gap-3">
                <span className="text-sm font-medium">Dark Mode</span>
              </div>
              <ThemeToggle />
            </div>
          </div>

          {/* Sign Out - Push to bottom */}
          <div className="mt-auto pt-4 border-t">
            <Button
              variant="destructive"
              className="w-full justify-start gap-3 h-12"
              onClick={handleSignOut}
            >
              <LogOut className="h-5 w-5" />
              <span>Sign Out</span>
            </Button>
          </div>
        </div>
      </DrawerContent>
    </Drawer>
  );
}
