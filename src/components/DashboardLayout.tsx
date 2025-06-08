
import React from 'react';
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from '@/components/AppSidebar';
import LanguageSwitcher from '@/components/LanguageSwitcher';
import { useTranslation } from 'react-i18next';
import { useAccessibility } from '@/hooks/useAccessibility';

interface DashboardLayoutProps {
  children: React.ReactNode;
}

const DashboardLayout = ({ children }: DashboardLayoutProps) => {
  const { t } = useTranslation();
  const { getAccessibilityClasses } = useAccessibility();
  
  return (
    <SidebarProvider>
      <div className={`min-h-screen flex w-full ${getAccessibilityClasses('container')}`}>
        <AppSidebar />
        <main className="flex-1">
          <div className={`border-b px-6 py-4 ${getAccessibilityClasses('card')}`}>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <SidebarTrigger className="hover:text-primary" />
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 fpk-gradient rounded-md flex items-center justify-center">
                    <span className="text-white font-bold text-xs">FPK</span>
                  </div>
                  <span className={`font-semibold ${getAccessibilityClasses('text')}`}>
                    {t('common.learnerPortal')}
                  </span>
                </div>
              </div>
              <LanguageSwitcher />
            </div>
          </div>
          <div className="overflow-auto">
            {children}
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
};

export default DashboardLayout;
