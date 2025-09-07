import React from 'react';
import { OrgProvider } from './OrgContext';
import GlobalHeader from '@/components/GlobalHeader';

interface OrgPageLayoutProps {
  children: React.ReactNode;
}

export function OrgPageLayout({ children }: OrgPageLayoutProps) {
  return (
    <OrgProvider>
      <div className="min-h-screen bg-gray-50">
        <GlobalHeader />
        <main className="flex-1">
          <div className="container mx-auto px-4 py-8">
            {children}
          </div>
        </main>
      </div>
    </OrgProvider>
  );
}