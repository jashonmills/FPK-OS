import { useUATAccess } from '@/hooks/useUATAccess';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Lock, Loader2 } from 'lucide-react';

interface UATAccessGateProps {
  children: React.ReactNode;
}

export function UATAccessGate({ children }: UATAccessGateProps) {
  const { isUATTester, isLoading, error } = useUATAccess();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="flex items-center gap-3">
          <Loader2 className="h-6 w-6 animate-spin" />
          <span>Checking access permissions...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen p-4">
        <Card className="max-w-md mx-auto">
          <CardHeader className="text-center">
            <div className="mx-auto mb-4 w-12 h-12 rounded-full bg-destructive/10 flex items-center justify-center">
              <Lock className="w-6 h-6 text-destructive" />
            </div>
            <CardTitle>Access Error</CardTitle>
            <CardDescription>
              Unable to verify access permissions. Please try again later.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground text-center">
              Error: {error}
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!isUATTester) {
    return (
      <div className="flex items-center justify-center min-h-screen p-4">
        <Card className="max-w-md mx-auto">
          <CardHeader className="text-center">
            <div className="mx-auto mb-4 w-12 h-12 rounded-full bg-warning/10 flex items-center justify-center">
              <Lock className="w-6 h-6 text-warning" />
            </div>
            <CardTitle>Beta Access Required</CardTitle>
            <CardDescription>
              This platform is currently in private beta testing.
            </CardDescription>
          </CardHeader>
          <CardContent className="text-center space-y-4">
            <p className="text-sm text-muted-foreground">
              You need to be invited to access this application during the beta phase.
            </p>
            <p className="text-sm text-muted-foreground">
              If you believe you should have access, please contact the development team.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return <>{children}</>;
}