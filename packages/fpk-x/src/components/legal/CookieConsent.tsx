import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Cookie } from 'lucide-react';
import { Link } from 'react-router-dom';

const COOKIE_CONSENT_KEY = 'fpx-cookie-consent';

export const CookieConsent = () => {
  const [showBanner, setShowBanner] = useState(false);

  useEffect(() => {
    // Check if user has already given consent
    const consent = localStorage.getItem(COOKIE_CONSENT_KEY);
    if (!consent) {
      // Show banner after a short delay for better UX
      setTimeout(() => setShowBanner(true), 1000);
    }
  }, []);

  const handleAcceptAll = () => {
    localStorage.setItem(COOKIE_CONSENT_KEY, JSON.stringify({
      essential: true,
      functional: true,
      analytics: true,
      timestamp: new Date().toISOString()
    }));
    setShowBanner(false);
  };

  const handleAcceptEssential = () => {
    localStorage.setItem(COOKIE_CONSENT_KEY, JSON.stringify({
      essential: true,
      functional: false,
      analytics: false,
      timestamp: new Date().toISOString()
    }));
    setShowBanner(false);
  };

  if (!showBanner) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 p-4 animate-in slide-in-from-bottom duration-300">
      <Card className="max-w-4xl mx-auto border-2 shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Cookie className="h-5 w-5" />
            Cookie Preferences
          </CardTitle>
          <CardDescription>
            We use cookies to enhance your experience and provide essential functionality.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="text-sm text-muted-foreground space-y-2">
            <p>
              We use cookies and similar technologies to:
            </p>
            <ul className="list-disc pl-6 space-y-1">
              <li><strong>Essential:</strong> Keep you logged in and secure (required)</li>
              <li><strong>Functional:</strong> Remember your preferences and settings</li>
              <li><strong>Analytics:</strong> Understand how you use the app to improve it</li>
            </ul>
            <p>
              We respect your privacy and comply with GDPR and HIPAA regulations. 
              Read our{' '}
              <Link to="/cookie-policy" className="text-primary hover:underline">
                Cookie Policy
              </Link>
              {' '}and{' '}
              <Link to="/privacy-policy" className="text-primary hover:underline">
                Privacy Policy
              </Link>
              {' '}for more details.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <Button 
              onClick={handleAcceptAll}
              className="flex-1"
            >
              Accept All Cookies
            </Button>
            <Button 
              onClick={handleAcceptEssential}
              variant="outline"
              className="flex-1"
            >
              Essential Only
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};