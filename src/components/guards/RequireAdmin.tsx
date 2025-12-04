import { Navigate, useLocation } from 'react-router-dom';
import { useAppUser } from '@/hooks/useAppUser';
import { Skeleton } from '@/components/ui/skeleton';

interface RequireAdminProps {
  children: React.ReactElement;
  fallback?: React.ReactElement;
}

export default function RequireAdmin({ children, fallback }: RequireAdminProps) {
  const { isAdmin, loading, user } = useAppUser();
  const location = useLocation();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="space-y-4">
          <Skeleton className="h-8 w-64" />
          <Skeleton className="h-4 w-48" />
          <Skeleton className="h-4 w-32" />
        </div>
      </div>
    );
  }

  // If not authenticated, redirect to login
  if (!user) {
    return <Navigate to="/auth" state={{ from: location }} replace />;
  }

  // If not admin, show 403 or custom fallback
  if (!isAdmin) {
    return fallback || <Navigate to="/403" state={{ from: location }} replace />;
  }

  return children;
}