import { SidebarProvider } from '@/components/ui/sidebar';
import { OrgSidebar } from './OrgSidebar';
import { AppHeader } from './AppHeader';
import { AppBackground } from './AppBackground';
import { Footer } from './Footer';

interface OrgLayoutProps {
  children: React.ReactNode;
}

export const OrgLayout = ({ children }: OrgLayoutProps) => {
  return (
    <>
      <AppBackground />
      <SidebarProvider>
        <div className="min-h-screen flex w-full">
          <OrgSidebar />
          <div className="flex-1 flex flex-col min-w-0">
            <AppHeader />
            <main className="flex-1 p-3 sm:p-4 md:p-6">
              {children}
            </main>
            <Footer />
          </div>
        </div>
      </SidebarProvider>
    </>
  );
};
