import React from 'react';
import { OrgProvider } from './OrgContext';
import { TourProvider } from '@/contexts/TourContext';
import OrgHeader from './OrgHeader';

interface OrgPageLayoutProps {
  children: React.ReactNode;
}

export function OrgPageLayout({ children }: OrgPageLayoutProps) {
  return (
    <OrgProvider>
      <TourProvider>
        <div className="min-h-screen bg-gray-50">
          <OrgHeader />
          <main className="flex-1 overflow-x-hidden w-full">
            <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
              {children}
            </div>
          </main>
        </div>
      </TourProvider>
    </OrgProvider>
  );
}