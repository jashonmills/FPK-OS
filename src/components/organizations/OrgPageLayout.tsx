import React from 'react';
import { OrgProvider } from './OrgContext';
import OrgHeader from './OrgHeader';

interface OrgPageLayoutProps {
  children: React.ReactNode;
}

export function OrgPageLayout({ children }: OrgPageLayoutProps) {
  return (
    <OrgProvider>
      <div className="min-h-screen bg-gray-50">
        <OrgHeader />
        <main className="flex-1 overflow-x-hidden">
          <div className="w-full max-w-7xl mx-auto px-4 py-8 overflow-x-hidden">
            {children}
          </div>
        </main>
      </div>
    </OrgProvider>
  );
}