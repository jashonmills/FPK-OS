import { SidebarProvider } from '@/components/ui/sidebar';
import { AppSidebar } from './AppSidebar';
import { AppHeader } from './AppHeader';
import { AppBackground } from './AppBackground';
import { AIChatWidget } from '@/components/chat/AIChatWidget';
import { Footer } from './Footer';

interface AppLayoutProps {
  children: React.ReactNode;
}

export const AppLayout = ({ children }: AppLayoutProps) => {
  return (
    <>
      <AppBackground />
      <SidebarProvider>
        <div className="min-h-screen flex w-full">
          <AppSidebar />
        <div className="flex-1 flex flex-col min-w-0">
          <AppHeader />
          <main className="flex-1 p-3 sm:p-4 md:p-6">
            {children}
          </main>
          <Footer />
        </div>
        </div>
      </SidebarProvider>
      <AIChatWidget />
    </>
  );
};
