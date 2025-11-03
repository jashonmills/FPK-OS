import { ReactNode, lazy, Suspense, useEffect, useState } from 'react';
import { SidebarProvider, useSidebar } from '@/components/ui/sidebar';
import { AppSidebar } from './AppSidebar';
import { AppHeader } from './AppHeader';
import { cn } from '@/lib/utils';

// Lazy load help components to avoid context initialization issues
const HelpCenter = lazy(() => import('@/components/help/HelpCenter').then(m => ({ default: m.HelpCenter })));
const OnboardingTour = lazy(() => import('@/components/onboarding/OnboardingTour').then(m => ({ default: m.OnboardingTour })));

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
  const [mounted, setMounted] = useState(false);

  // Only mount help components after initial render to ensure all providers are ready
  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <SidebarProvider>
      {mounted && (
        <Suspense fallback={null}>
          <HelpCenter />
          <OnboardingTour />
        </Suspense>
      )}
      <div className="min-h-screen flex w-full md:overflow-x-visible overflow-x-hidden">
        <AppSidebar />
        <AppLayoutContent>{children}</AppLayoutContent>
      </div>
    </SidebarProvider>
  );
};
