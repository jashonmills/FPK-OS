import { Routes, Route, Navigate } from 'react-router-dom';
import { OrgLayout } from '@/components/layout/OrgLayout';
import { OrgDashboard } from './OrgDashboard';
import { OrgStudents } from './OrgStudents';
import { OrganizationProvider } from '@/contexts/OrganizationContext';

export const B2BRoutes = () => {
  return (
    <OrganizationProvider>
      <OrgLayout>
        <Routes>
          <Route path="/dashboard" element={<OrgDashboard />} />
          <Route path="/students" element={<OrgStudents />} />
          <Route path="/*" element={<Navigate to="/org/dashboard" replace />} />
        </Routes>
      </OrgLayout>
    </OrganizationProvider>
  );
};
