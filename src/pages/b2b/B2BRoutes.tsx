import { Routes, Route, Navigate } from 'react-router-dom';
import { OrgLayout } from '@/components/layout/OrgLayout';
import { OrgDashboard } from './OrgDashboard';
import { OrganizationProvider } from '@/contexts/OrganizationContext';

export const B2BRoutes = () => {
  return (
    <OrganizationProvider>
      <OrgLayout>
        <Routes>
          <Route path="/dashboard" element={<OrgDashboard />} />
          <Route path="/*" element={<Navigate to="/org/dashboard" replace />} />
        </Routes>
      </OrgLayout>
    </OrganizationProvider>
  );
};
