
import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import LoadingSpinner from '@/components/ui/loading-spinner';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: string;
  redirectTo?: string;
}

const ProtectedRoute = ({ children, requiredRole, redirectTo = '/login' }: ProtectedRouteProps) => {
  const { user, loading, session } = useAuth();
  const location = useLocation();

  console.log('ProtectedRoute check:', { user: !!user, loading, session: !!session });

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  if (!user || !session) {
    console.log('Redirecting to login - no user or session');
    return <Navigate to={redirectTo} state={{ from: location }} replace />;
  }

  // For now, we'll skip role checking until user_roles table is properly set up
  // This can be enhanced once the database schema is confirmed
  if (requiredRole) {
    console.log('Role checking not implemented yet, allowing access');
  }

  return <>{children}</>;
};

export default ProtectedRoute;
