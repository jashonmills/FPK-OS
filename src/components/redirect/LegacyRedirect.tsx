import { useEffect } from 'react';
import { Navigate, useParams } from 'react-router-dom';

interface LegacyRedirectProps {
  toOrgCourses?: boolean;
  to?: string;
}

export default function LegacyRedirect({ toOrgCourses = false, to }: LegacyRedirectProps) {
  const { orgId } = useParams();

  useEffect(() => {
    // Log redirect for debugging
    console.warn('Legacy route accessed, redirecting to new route');
  }, []);

  if (to) {
    return <Navigate to={to} replace />;
  }

  if (toOrgCourses && orgId) {
    return <Navigate to={`/org/${orgId}/courses`} replace />;
  }

  // Fallback to dashboard
  return <Navigate to="/dashboard" replace />;
}