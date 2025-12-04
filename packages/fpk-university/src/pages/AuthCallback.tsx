import { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';

const AuthCallback = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  useEffect(() => {
    console.log('🔗 Auth Bridge: Callback page loaded');
    
    // Get the final destination URL from query parameters
    const redirectUri = searchParams.get('redirect_uri');
    
    if (redirectUri) {
      console.log(`🔗 Auth Bridge: Valid redirect_uri found: ${redirectUri}`);
      console.log('🔗 Auth Bridge: Performing clean redirect with window.location.replace()');
      
      // Use window.location.replace() for a clean redirect that doesn't add to history
      window.location.replace(redirectUri);
    } else {
      console.error('🔗 Auth Bridge ERROR: redirect_uri parameter is missing');
      console.log('🔗 Auth Bridge: Redirecting to homepage as fallback');
      
      // Fallback to homepage if no redirect URI is provided
      window.location.replace('/');
    }
  }, [searchParams, navigate]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/10 via-background to-secondary/10 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-card/80 backdrop-blur-sm rounded-2xl shadow-xl p-8 text-center border border-border">
        <div className="mb-6">
          <div className="w-16 h-16 mx-auto bg-primary/20 rounded-full flex items-center justify-center mb-4">
            <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
          </div>
        </div>
        
        <h1 className="text-2xl font-bold text-foreground mb-3">
          Finalizing Your Login
        </h1>
        
        <p className="text-muted-foreground mb-6">
          Please wait while we securely redirect you to your portal...
        </p>
        
        <div className="text-sm text-muted-foreground/70">
          This should only take a moment.
        </div>
      </div>
    </div>
  );
};

export default AuthCallback;
