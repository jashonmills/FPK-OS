import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { X, Cookie, Settings } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

interface CookiePreferences {
  essential: boolean;
  analytics: boolean;
  marketing: boolean;
  functional: boolean;
}

export function CookieConsent() {
  const [showBanner, setShowBanner] = useState(false);
  const [showPreferences, setShowPreferences] = useState(false);
  const [preferences, setPreferences] = useState<CookiePreferences>({
    essential: true,
    analytics: false,
    marketing: false,
    functional: false,
  });

  useEffect(() => {
    const consent = localStorage.getItem('cookie-consent');
    if (!consent) {
      setShowBanner(true);
    }
  }, []);

  const handleAcceptAll = () => {
    const allAccepted = {
      essential: true,
      analytics: true,
      marketing: true,
      functional: true,
    };
    localStorage.setItem('cookie-consent', JSON.stringify(allAccepted));
    setShowBanner(false);
  };

  const handleRejectAll = () => {
    const onlyEssential = {
      essential: true,
      analytics: false,
      marketing: false,
      functional: false,
    };
    localStorage.setItem('cookie-consent', JSON.stringify(onlyEssential));
    setShowBanner(false);
  };

  const handleSavePreferences = () => {
    localStorage.setItem('cookie-consent', JSON.stringify(preferences));
    setShowBanner(false);
    setShowPreferences(false);
  };

  const updatePreference = (key: keyof CookiePreferences, value: boolean) => {
    setPreferences(prev => ({
      ...prev,
      [key]: value
    }));
  };

  if (!showBanner) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 p-4">
      <Card className="mx-auto max-w-4xl border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <CardHeader className="pb-4">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-2">
              <Cookie className="h-5 w-5" />
              <CardTitle className="text-lg">Cookie Preferences</CardTitle>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowBanner(false)}
              className="h-8 w-8 p-0"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
          <CardDescription>
            We use cookies to enhance your experience on our platform. You can choose which cookies to accept.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-wrap gap-3">
            <Button onClick={handleAcceptAll} className="flex-1 sm:flex-none">
              Accept All
            </Button>
            <Button variant="outline" onClick={handleRejectAll} className="flex-1 sm:flex-none">
              Reject All
            </Button>
            <Dialog open={showPreferences} onOpenChange={setShowPreferences}>
              <DialogTrigger asChild>
                <Button variant="outline" className="flex-1 sm:flex-none">
                  <Settings className="mr-2 h-4 w-4" />
                  Customize
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>Cookie Preferences</DialogTitle>
                  <DialogDescription>
                    Choose which types of cookies you'd like to allow. Essential cookies are required for the platform to function properly.
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-6">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 rounded-lg border">
                      <div className="space-y-1">
                        <h4 className="font-medium">Essential Cookies</h4>
                        <p className="text-sm text-muted-foreground">
                          Required for the platform to function properly. These cannot be disabled.
                        </p>
                      </div>
                      <Checkbox checked={true} disabled />
                    </div>
                    
                    <div className="flex items-center justify-between p-4 rounded-lg border">
                      <div className="space-y-1">
                        <h4 className="font-medium">Analytics Cookies</h4>
                        <p className="text-sm text-muted-foreground">
                          Help us understand how you use our platform to improve your experience.
                        </p>
                      </div>
                      <Checkbox
                        checked={preferences.analytics}
                        onCheckedChange={(checked) => updatePreference('analytics', !!checked)}
                      />
                    </div>
                    
                    <div className="flex items-center justify-between p-4 rounded-lg border">
                      <div className="space-y-1">
                        <h4 className="font-medium">Functional Cookies</h4>
                        <p className="text-sm text-muted-foreground">
                          Remember your preferences and settings to personalize your experience.
                        </p>
                      </div>
                      <Checkbox
                        checked={preferences.functional}
                        onCheckedChange={(checked) => updatePreference('functional', !!checked)}
                      />
                    </div>
                    
                    <div className="flex items-center justify-between p-4 rounded-lg border">
                      <div className="space-y-1">
                        <h4 className="font-medium">Marketing Cookies</h4>
                        <p className="text-sm text-muted-foreground">
                          Used to deliver relevant advertisements and track campaign effectiveness.
                        </p>
                      </div>
                      <Checkbox
                        checked={preferences.marketing}
                        onCheckedChange={(checked) => updatePreference('marketing', !!checked)}
                      />
                    </div>
                  </div>
                  
                  <div className="flex gap-3 pt-4">
                    <Button onClick={handleSavePreferences} className="flex-1">
                      Save Preferences
                    </Button>
                    <Button 
                      variant="outline" 
                      onClick={() => setShowPreferences(false)}
                      className="flex-1"
                    >
                      Cancel
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>
          <p className="text-xs text-muted-foreground">
            Learn more about our use of cookies in our{' '}
            <a href="/privacy-policy" className="underline hover:no-underline">
              Privacy Policy
            </a>
            .
          </p>
        </CardContent>
      </Card>
    </div>
  );
}