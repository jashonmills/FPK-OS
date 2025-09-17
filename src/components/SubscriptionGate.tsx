import { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useSubscriptionGate } from '@/hooks/useSubscriptionGate';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Loader2, Lock } from 'lucide-react';
import { logger } from '@/utils/logger';

interface SubscriptionGateProps {
  children: React.ReactNode;
  allowedPaths?: string[];
}

export function SubscriptionGate({ children, allowedPaths = [] }: SubscriptionGateProps) {
  const { isLoading, hasAccess, shouldRedirectToPlanSelection } = useSubscriptionGate();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // Only redirect if subscription check is complete and we have definitive status
    if (!isLoading && shouldRedirectToPlanSelection && 
        !allowedPaths.includes(location.pathname) && 
        location.pathname !== '/choose-plan' &&
        !location.pathname.startsWith('/subscription')) {
      // Debounce navigation to prevent conflicts
      const timer = setTimeout(() => {
        logger.info('SubscriptionGate: Redirecting to choose-plan', 'SUBSCRIPTION', { from: location.pathname });
        navigate('/choose-plan');
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [isLoading, shouldRedirectToPlanSelection, navigate, location.pathname, allowedPaths]);

  // Show loading while checking subscription status
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary via-primary-variant to-accent flex items-center justify-center">
        <Card className="w-full max-w-md bg-white/10 backdrop-blur border-white/20">
          <CardContent className="flex flex-col items-center justify-center p-8">
            <Loader2 className="h-8 w-8 animate-spin text-white mb-4" />
            <p className="text-white/80">Checking your subscription status...</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  // If user has access or is on an allowed path, render children
  if (hasAccess || allowedPaths.includes(location.pathname)) {
    return <>{children}</>;
  }

  // Show subscription required message if user doesn't have access
  return (
    <div className="min-h-screen bg-gradient-to-br from-primary via-primary-variant to-accent flex items-center justify-center p-4">
      <Card className="w-full max-w-md bg-white/10 backdrop-blur border-white/20">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 p-3 rounded-full bg-white/10">
            <Lock className="h-8 w-8 text-white" />
          </div>
          <CardTitle className="text-white">Subscription Required</CardTitle>
          <CardDescription className="text-white/70">
            You need an active subscription to access this area. Please choose a plan to continue.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button 
            onClick={() => navigate('/choose-plan')}
            className="w-full bg-accent hover:bg-accent/90"
          >
            Choose Your Plan
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}