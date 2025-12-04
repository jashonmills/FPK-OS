import { useEffect } from 'react';
import { Routes, Route, Navigate, useLocation, useNavigate } from 'react-router-dom';
import { OrgLayout } from '@/components/layout/OrgLayout';
import { OrgDashboard } from './OrgDashboard';
import { OrgStudents } from './OrgStudents';
import { OrgStaff } from './OrgStaff';
import { OrgCreate } from './OrgCreate';
import OrgResetPassword from './OrgResetPassword';
import { OrganizationProvider, useOrganization } from '@/contexts/OrganizationContext';

const OnboardingGuard = ({ children }: { children: React.ReactNode }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { organizations, isLoading } = useOrganization();

  useEffect(() => {
    // Don't redirect while loading or if already on create page
    if (isLoading || location.pathname === '/org/create') return;

    // If user has no organizations, redirect to onboarding
    if (organizations.length === 0) {
      navigate('/org/create', { replace: true });
    }
  }, [organizations, isLoading, location.pathname, navigate]);

  // Show children while loading or on create page
  if (isLoading || location.pathname === '/org/create') {
    return <>{children}</>;
  }

  // Show children only if user has organizations
  return organizations.length > 0 ? <>{children}</> : null;
};

export const B2BRoutes = () => {
  return (
    <OrganizationProvider>
      <Routes>
        {/* Onboarding route - no layout wrapper */}
        <Route path="/create" element={<OrgCreate />} />
        <Route path="/reset-password" element={<OrgResetPassword />} />
        
        {/* Protected routes - require organization membership */}
        <Route
          path="/dashboard"
          element={
            <OnboardingGuard>
              <OrgLayout>
                <OrgDashboard />
              </OrgLayout>
            </OnboardingGuard>
          }
        />
        <Route
          path="/students"
          element={
            <OnboardingGuard>
              <OrgLayout>
                <OrgStudents />
              </OrgLayout>
            </OnboardingGuard>
          }
        />
        <Route
          path="/staff"
          element={
            <OnboardingGuard>
              <OrgLayout>
                <OrgStaff />
              </OrgLayout>
            </OnboardingGuard>
          }
        />
        <Route
          path="/*"
          element={<Navigate to="/org/dashboard" replace />}
        />
      </Routes>
    </OrganizationProvider>
  );
};
