import React, { useState } from 'react';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { Button } from "@/components/ui/button"
import {
  Home,
  Book,
  BookOpen,
  GraduationCap,
  Settings,
  CreditCard,
  Shield,
  Menu,
  LogOut,
  LayoutDashboard,
  HelpCircle,
  MessageSquare,
  Users,
  Brain,
  Lightbulb,
  FileText,
} from "lucide-react"
import { Separator } from "@/components/ui/separator"
import { useAuth } from '@/hooks/useAuth';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useUserProfile } from '@/hooks/useUserProfile';
import { getRoleBadgeVariant } from '@/types/user';
import { Badge } from '@/components/ui/badge';

interface SidebarProps {
  className?: string;
}

const AppSidebar = ({ className }: SidebarProps) => {
  const { user, signOut } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();
  const { profile } = useUserProfile();
  const [open, setOpen] = useState(false);

  const handleSignOut = async () => {
    await signOut();
    toast({
      title: "Signed out",
      description: "You have been successfully signed out.",
    });
    navigate('/login');
  };

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  const mainItems = [
    {
      title: 'Dashboard',
      url: "/dashboard/learner",
      icon: LayoutDashboard,
    },
    {
      title: 'Home',
      url: "/dashboard/home",
      icon: Home,
    },
    {
      title: 'Library',
      url: "/dashboard/library",
      icon: Book,
    },
    {
      title: 'Browse',
      url: "/dashboard/browse",
      icon: BookOpen,
    },
    {
      title: 'Courses',
      url: "/dashboard/courses",
      icon: GraduationCap,
    },
  ];

  const aiTools = [
    {
      title: 'AI Study Chat',
      url: "/dashboard/ai-chat",
      icon: MessageSquare,
    },
    {
      title: 'AI Knowledge Base',
      url: "/dashboard/ai-knowledge",
      icon: Brain,
    },
    {
      title: 'AI Prompts',
      url: "/dashboard/ai-prompts",
      icon: Lightbulb,
    },
  ];

  const adminTools = [
    {
      title: 'User Management',
      url: "/admin/users",
      icon: Users,
    },
    {
      title: 'Content Management',
      url: "/admin/content",
      icon: FileText,
    },
  ];

  const footerItems = [
    {
      title: 'Subscription',
      url: "/dashboard/subscription",
      icon: CreditCard,
    },
    {
      title: 'Privacy',
      url: "/privacy-preferences",
      icon: Shield,
    },
    {
      title: 'Settings',
      url: "/dashboard/settings",
      icon: Settings,
    },
    {
      title: 'Help',
      url: "/dashboard/help",
      icon: HelpCircle,
    },
    {
      title: 'Sign Out',
      onClick: handleSignOut,
      icon: LogOut,
    },
  ];

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className={`md:hidden ${className}`}>
          <Menu className="h-4 w-4" />
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="p-0">
        <SheetHeader className="px-6 pt-6 pb-2">
          <SheetTitle>
            <div className="flex items-center gap-2">
              <Avatar className="h-8 w-8">
                <AvatarImage src={profile?.avatar_url} />
                <AvatarFallback>{profile?.display_name?.charAt(0) || 'U'}</AvatarFallback>
              </Avatar>
              <div>
                <div className="font-semibold">{profile?.display_name || user?.email}</div>
                {user?.roles?.map((role) => (
                  <Badge
                    key={role}
                    variant={getRoleBadgeVariant(role)}
                    className="mr-1"
                  >
                    {role}
                  </Badge>
                ))}
              </div>
            </div>
          </SheetTitle>
          <SheetDescription>
            Manage your account settings and set preferences.
          </SheetDescription>
        </SheetHeader>

        <div className="py-4">
          <Separator />
        </div>

        <div className="flex flex-col gap-1">
          {mainItems.map((item) => (
            <Button
              key={item.title}
              variant="ghost"
              className={`w-full justify-start ${isActive(item.url) ? 'bg-secondary' : ''}`}
              asChild
            >
              <Link to={item.url} onClick={() => setOpen(false)}>
                <item.icon className="mr-2 h-4 w-4" />
                <span>{item.title}</span>
              </Link>
            </Button>
          ))}
        </div>

        <div className="py-4">
          <Separator />
        </div>

        <Accordion type="single" collapsible className="w-full">
          <AccordionItem value="ai-tools">
            <AccordionTrigger className="hover:no-underline">
              <MessageSquare className="mr-2 h-4 w-4" />
              AI Tools
            </AccordionTrigger>
            <AccordionContent>
              <div className="flex flex-col gap-1">
                {aiTools.map((item) => (
                  <Button
                    key={item.title}
                    variant="ghost"
                    className={`w-full justify-start pl-8 ${isActive(item.url) ? 'bg-secondary' : ''}`}
                    asChild
                  >
                    <Link to={item.url} onClick={() => setOpen(false)}>
                      <item.icon className="mr-2 h-4 w-4" />
                      <span>{item.title}</span>
                    </Link>
                  </Button>
                ))}
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>

        {user?.roles?.includes('admin') && (
          <>
            <div className="py-4">
              <Separator />
            </div>

            <Accordion type="single" collapsible className="w-full">
              <AccordionItem value="admin-tools">
                <AccordionTrigger className="hover:no-underline">
                  <Users className="mr-2 h-4 w-4" />
                  Admin Tools
                </AccordionTrigger>
                <AccordionContent>
                  <div className="flex flex-col gap-1">
                    {adminTools.map((item) => (
                      <Button
                        key={item.title}
                        variant="ghost"
                        className={`w-full justify-start pl-8 ${isActive(item.url) ? 'bg-secondary' : ''}`}
                        asChild
                      >
                        <Link to={item.url} onClick={() => setOpen(false)}>
                          <item.icon className="mr-2 h-4 w-4" />
                          <span>{item.title}</span>
                        </Link>
                      </Button>
                    ))}
                  </div>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </>
        )}

        <div className="mt-auto py-4">
          <Separator />
        </div>

        <div className="flex flex-col gap-1 pb-4">
          {footerItems.map((item) => (
            <Button
              key={item.title}
              variant="ghost"
              className="w-full justify-start"
              onClick={item.onClick}
              asChild={item.url ? true : false}
            >
              {item.url ? (
                <Link to={item.url} onClick={() => setOpen(false)}>
                  <item.icon className="mr-2 h-4 w-4" />
                  <span>{item.title}</span>
                </Link>
              ) : (
                <>
                  <item.icon className="mr-2 h-4 w-4" />
                  <span>{item.title}</span>
                </>
              )}
            </Button>
          ))}
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default AppSidebar;
