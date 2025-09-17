import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { X, Cookie, Settings, Shield } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useConsent, ConsentPreferences } from "@/hooks/useConsent";
import { useAuth } from "@/hooks/useAuth";
import { Badge } from "@/components/ui/badge";
import { safeLocalStorage } from "@/utils/safeStorage";

export function ConsentManager() {
  const { user } = useAuth();
  
  // Safely handle the case where ConsentProvider might not be ready
  let preferences: ConsentPreferences;
  let updateConsent: (preferences: ConsentPreferences) => Promise<void>;
  let withdrawConsent: (type: keyof ConsentPreferences) => Promise<void>;
  let isLoading: boolean;
  
  try {
    const consentData = useConsent();
    preferences = consentData.preferences;
    updateConsent = consentData.updateConsent;
    withdrawConsent = consentData.withdrawConsent;
    isLoading = consentData.isLoading;
  } catch (error) {
    // If ConsentProvider is not ready, provide default values
    preferences = {
      essential: true,
      analytics: false,
      marketing: false,
      functional: false,
    };
    updateConsent = async () => {};
    withdrawConsent = async () => {};
    isLoading = true;
  }
  
  const [showBanner, setShowBanner] = useState(false);
  const [showPreferences, setShowPreferences] = useState(false);
  const [localPreferences, setLocalPreferences] = useState<ConsentPreferences>(preferences);

  useEffect(() => {
    // Check if user has given consent
    const hasGivenConsent = safeLocalStorage.getItem<string>('cookie-consent', {
      fallbackValue: null,
      logErrors: false
    });
    if (!hasGivenConsent && !isLoading) {
      setShowBanner(true);
    }
  }, [isLoading]);

  useEffect(() => {
    setLocalPreferences(preferences);
  }, [preferences]);

  const handleAcceptAll = async () => {
    const allAccepted: ConsentPreferences = {
      essential: true,
      analytics: true,
      marketing: true,
      functional: true,
    };
    await updateConsent(allAccepted);
    setShowBanner(false);
  };

  const handleRejectAll = async () => {
    const onlyEssential: ConsentPreferences = {
      essential: true,
      analytics: false,
      marketing: false,
      functional: false,
    };
    await updateConsent(onlyEssential);
    setShowBanner(false);
  };

  const handleSavePreferences = async () => {
    await updateConsent(localPreferences);
    setShowBanner(false);
    setShowPreferences(false);
  };

  const handleWithdrawConsent = async (type: keyof ConsentPreferences) => {
    if (type === 'essential') return; // Cannot withdraw essential consent
    await withdrawConsent(type);
  };

  const updateLocalPreference = (key: keyof ConsentPreferences, value: boolean) => {
    setLocalPreferences(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const consentDetails = {
    essential: {
      title: "Essential Cookies",
      description: "Required for the platform to function properly. These cannot be disabled.",
      purposes: ["Authentication", "Security", "Basic functionality"],
      retention: "Session or until logout",
      legalBasis: "Legitimate interest (essential functionality)"
    },
    analytics: {
      title: "Analytics Cookies",
      description: "Help us understand how you use our platform to improve your experience.",
      purposes: ["Usage analytics", "Performance monitoring", "Error tracking"],
      retention: "26 months",
      legalBasis: "Consent"
    },
    functional: {
      title: "Functional Cookies",
      description: "Remember your preferences and settings to personalize your experience.",
      purposes: ["User preferences", "Theme settings", "Language preferences"],
      retention: "12 months",
      legalBasis: "Consent"
    },
    marketing: {
      title: "Marketing Cookies",
      description: "Used to deliver relevant advertisements and track campaign effectiveness.",
      purposes: ["Targeted advertising", "Campaign tracking", "Personalization"],
      retention: "24 months",
      legalBasis: "Consent"
    }
  };

  if (!showBanner) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 p-4">
      <Card className="mx-auto max-w-5xl border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <CardHeader className="pb-4">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-2">
              <Shield className="h-5 w-5 text-primary" />
              <div>
                <CardTitle className="text-lg">Privacy & Cookie Preferences</CardTitle>
                <CardDescription className="text-sm">
                  We respect your privacy and are committed to GDPR compliance
                </CardDescription>
              </div>
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
            We use cookies and similar technologies to enhance your experience, analyze usage, and personalize content. 
            Your choices are stored securely and you can change them at any time.
            {user && (
              <span className="block mt-1 text-xs text-primary">
                ✓ Authenticated user - preferences will be synced across devices
              </span>
            )}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-wrap gap-3">
            <Button onClick={handleAcceptAll} className="flex-1 sm:flex-none">
              <Cookie className="mr-2 h-4 w-4" />
              Accept All
            </Button>
            <Button variant="outline" onClick={handleRejectAll} className="flex-1 sm:flex-none">
              Reject Non-Essential
            </Button>
            <Dialog open={showPreferences} onOpenChange={setShowPreferences}>
              <DialogTrigger asChild>
                <Button variant="outline" className="flex-1 sm:flex-none">
                  <Settings className="mr-2 h-4 w-4" />
                  Customize
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle className="flex items-center gap-2">
                    <Shield className="h-5 w-5" />
                    Detailed Cookie Preferences
                  </DialogTitle>
                  <DialogDescription>
                    Manage your privacy settings. Each category explains what data is collected and why.
                    {user && (
                      <Badge variant="secondary" className="ml-2">
                        GDPR Compliant
                      </Badge>
                    )}
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-6">
                  {Object.entries(consentDetails).map(([key, details]) => (
                    <div key={key} className="p-4 rounded-lg border space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <h4 className="font-medium">{details.title}</h4>
                            {key === 'essential' && (
                              <Badge variant="secondary" className="text-xs">Required</Badge>
                            )}
                          </div>
                          <p className="text-sm text-muted-foreground">
                            {details.description}
                          </p>
                        </div>
                        <div className="flex items-center gap-2">
                          <Checkbox
                            checked={localPreferences[key as keyof ConsentPreferences]}
                            onCheckedChange={(checked) => 
                              updateLocalPreference(key as keyof ConsentPreferences, !!checked)
                            }
                            disabled={key === 'essential'}
                          />
                          {key !== 'essential' && preferences[key as keyof ConsentPreferences] && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleWithdrawConsent(key as keyof ConsentPreferences)}
                              className="text-xs"
                            >
                              Withdraw
                            </Button>
                          )}
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs text-muted-foreground">
                        <div>
                          <strong>Purposes:</strong>
                          <ul className="list-disc list-inside mt-1">
                            {details.purposes.map((purpose, idx) => (
                              <li key={idx}>{purpose}</li>
                            ))}
                          </ul>
                        </div>
                        <div>
                          <strong>Retention:</strong>
                          <p className="mt-1">{details.retention}</p>
                        </div>
                        <div>
                          <strong>Legal Basis:</strong>
                          <p className="mt-1">{details.legalBasis}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                  
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
          <div className="text-xs text-muted-foreground space-y-1">
            <p>
              Learn more in our{' '}
              <a href="/privacy-policy" className="underline hover:no-underline">
                Privacy Policy
              </a>
              {' '}and{' '}
              <a href="/terms-of-service" className="underline hover:no-underline">
                Terms of Service
              </a>
              .
            </p>
            {user && (
              <p className="text-primary">
                ✓ Your preferences are securely stored and linked to your account
              </p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}