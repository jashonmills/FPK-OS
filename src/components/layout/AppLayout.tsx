import { ReactNode } from 'react';
import { SidebarProvider, useSidebar } from '@/components/ui/sidebar';
import { AppSidebar } from './AppSidebar';
import { AppHeader } from './AppHeader';
import { cn } from '@/lib/utils';

interface AppLayoutProps {
  children: ReactNode;
}

const AppLayoutContent = ({ children }: AppLayoutProps) => {
  const { state } = useSidebar();
  const isCollapsed = state === 'collapsed';

  return (
    <div className="flex-1 flex flex-col">
      <AppHeader />
      <main 
        className={cn(
          "flex-1 overflow-auto transition-all duration-300 ease-in-out",
          isCollapsed ? "ml-14" : "ml-0"
        )}
      >
        {children}
      </main>
    </div>
  );
};

export const AppLayout = ({ children }: AppLayoutProps) => {
  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full md:overflow-x-visible overflow-x-hidden">
        <AppSidebar />
        <AppLayoutContent>{children}</AppLayoutContent>
      </div>
    </SidebarProvider>
  );
};
