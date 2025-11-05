import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { OrgLayout } from '@/components/layout/OrgLayout';
import { OrgDashboard } from './OrgDashboard';
import { OrgStudents } from './OrgStudents';
import { OrgCreate } from './OrgCreate';
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
        
        {/* Protected routes - require organization membership */}
        <Route
          path="/*"
          element={
            <OnboardingGuard>
              <OrgLayout>
                <Routes>
                  <Route path="/dashboard" element={<OrgDashboard />} />
                  <Route path="/students" element={<OrgStudents />} />
                  <Route path="/*" element={<Navigate to="/org/dashboard" replace />} />
                </Routes>
              </OrgLayout>
            </OnboardingGuard>
          }
        />
      </Routes>
    </OrganizationProvider>
  );
};
