
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Shield, Cookie, Info } from 'lucide-react';
import { useLocalStorage } from '@/hooks/useLocalStorage';

const PrivacyBanner = () => {
  const [consentGiven, setConsentGiven] = useLocalStorage('privacy-consent', false);
  const [showBanner, setShowBanner] = useState(false);

  useEffect(() => {
    if (!consentGiven) {
      setShowBanner(true);
    }
  }, [consentGiven]);

  const handleAccept = () => {
    setConsentGiven(true);
    setShowBanner(false);
    // Track consent acceptance
    console.log('Privacy consent accepted at:', new Date().toISOString());
  };

  const handleDecline = () => {
    setConsentGiven(false);
    setShowBanner(false);
    // Redirect to limited functionality or homepage
    window.location.href = '/privacy-declined';
  };

  if (!showBanner) return null;

  return (
    <Card className="fixed bottom-4 left-4 right-4 z-50 shadow-lg border-2 border-primary/20 max-w-4xl mx-auto">
      <CardContent className="p-4">
        <div className="flex items-start gap-3">
          <Shield className="h-6 w-6 text-primary mt-1 flex-shrink-0" />
          <div className="flex-1 space-y-3">
            <div>
              <h3 className="font-semibold text-lg">Privacy & Data Protection</h3>
              <p className="text-sm text-muted-foreground mt-1">
                We are committed to protecting your privacy in compliance with GDPR and HIPAA regulations. 
                We use essential cookies and process your data to provide our learning services.
              </p>
            </div>
            
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <Cookie className="h-4 w-4" />
              <span>Essential cookies only</span>
              <Info className="h-4 w-4" />
              <span>Data encrypted and secured</span>
            </div>

            <div className="flex flex-col sm:flex-row gap-2 pt-2">
              <Button onClick={handleAccept} className="bg-primary text-primary-foreground">
                Accept & Continue
              </Button>
              <Button variant="outline" onClick={handleDecline}>
                Decline
              </Button>
              <Button variant="ghost" size="sm" asChild>
                <a href="/privacy-policy" target="_blank">Privacy Policy</a>
              </Button>
              <Button variant="ghost" size="sm" asChild>
                <a href="/data-protection" target="_blank">Data Protection</a>
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default PrivacyBanner;
