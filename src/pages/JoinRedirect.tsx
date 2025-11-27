import { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Loader2 } from 'lucide-react';

/**
 * Redirect handler for legacy /join route
 * Forwards all query params to /org/join
 */
export function JoinRedirect() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  
  useEffect(() => {
    // Preserve all query parameters
    const params = new URLSearchParams(searchParams);
    const queryString = params.toString();
    const targetPath = `/org/join${queryString ? `?${queryString}` : ''}`;
    
    console.log(`Redirecting from /join to ${targetPath}`);
    navigate(targetPath, { replace: true });
  }, [navigate, searchParams]);

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center space-y-4">
        <Loader2 className="h-8 w-8 animate-spin mx-auto" />
        <p className="text-muted-foreground">Redirecting...</p>
      </div>
    </div>
  );
}

export default JoinRedirect;
