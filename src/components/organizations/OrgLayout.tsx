import React from 'react';
import { Outlet, Navigate, useParams } from 'react-router-dom';
import { OrgProvider } from './OrgContext';
import OrgHeader from './OrgHeader';
import { OrgNavigation } from './OrgNavigation';
import { useAuth } from '@/hooks/useAuth';
import { Loader2 } from 'lucide-react';
import { OrgNavigationDebugger } from './OrgNavigationDebugger';

export default function OrgLayout() {
  const { user, loading } = useAuth();
  const { orgId } = useParams();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  return (
    <OrgProvider orgId={orgId}>
      <div className="min-h-screen flex flex-col">
        <OrgHeader />
        <div className="flex flex-1">
          <OrgNavigation />
          <main className="flex-1 p-6">
            <OrgNavigationDebugger />
            <Outlet />
          </main>
        </div>
      </div>
    </OrgProvider>
  );
}