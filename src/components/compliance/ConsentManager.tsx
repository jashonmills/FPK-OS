
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { useToast } from '@/hooks/use-toast';
import { Settings, Shield, Cookie, BarChart3, Mail } from 'lucide-react';

interface ConsentSettings {
  essential: boolean;
  analytics: boolean;
  marketing: boolean;
  personalization: boolean;
  communications: boolean;
}

const ConsentManager = () => {
  const { toast } = useToast();
  const [consents, setConsents] = useLocalStorage<ConsentSettings>('user-consents', {
    essential: true, // Always required
    analytics: false,
    marketing: false,
    personalization: false,
    communications: false,
  });

  const [hasChanged, setHasChanged] = useState(false);

  const consentCategories = [
    {
      id: 'essential',
      title: 'Essential Cookies',
      description: 'Required for the website to function properly. Cannot be disabled.',
      icon: Shield,
      required: true,
      enabled: consents.essential,
    },
    {
      id: 'analytics',
      title: 'Analytics & Performance',
      description: 'Help us understand how you use our platform to improve performance.',
      icon: BarChart3,
      required: false,
      enabled: consents.analytics,
    },
    {
      id: 'personalization',
      title: 'Personalization',
      description: 'Customize your learning experience based on your preferences.',
      icon: Settings,
      required: false,
      enabled: consents.personalization,
    },
    {
      id: 'marketing',
      title: 'Marketing & Advertising',
      description: 'Show you relevant content and promotional materials.',
      icon: Cookie,
      required: false,
      enabled: consents.marketing,
    },
    {
      id: 'communications',
      title: 'Email Communications',
      description: 'Send you updates, newsletters, and important notifications.',
      icon: Mail,
      required: false,
      enabled: consents.communications,
    },
  ];

  const handleConsentChange = (categoryId: keyof ConsentSettings, enabled: boolean) => {
    if (categoryId === 'essential' && !enabled) {
      toast({
        title: "Cannot Disable",
        description: "Essential cookies are required for the platform to function.",
        variant: "destructive",
      });
      return;
    }

    setConsents(prev => ({
      ...prev,
      [categoryId]: enabled,
    }));
    setHasChanged(true);
  };

  const handleSaveConsents = () => {
    // Log consent changes for compliance audit trail
    console.log('Consent preferences updated:', {
      timestamp: new Date().toISOString(),
      consents,
      userAgent: navigator.userAgent,
    });

    toast({
      title: "Preferences Saved",
      description: "Your consent preferences have been updated successfully.",
    });
    setHasChanged(false);
  };

  const handleAcceptAll = () => {
    const allEnabled = {
      essential: true,
      analytics: true,
      marketing: true,
      personalization: true,
      communications: true,
    };
    setConsents(allEnabled);
    setHasChanged(true);
  };

  const handleRejectAll = () => {
    const essentialOnly = {
      essential: true,
      analytics: false,
      marketing: false,
      personalization: false,
      communications: false,
    };
    setConsents(essentialOnly);
    setHasChanged(true);
  };

  return (
    <div className="max-w-2xl mx-auto p-6 space-y-6">
      <div className="text-center">
        <Shield className="h-12 w-12 text-primary mx-auto mb-4" />
        <h1 className="text-3xl font-bold">Privacy Preferences</h1>
        <p className="text-muted-foreground mt-2">
          Control how we collect and use your data
        </p>
      </div>

      <div className="flex gap-2 justify-center">
        <Button onClick={handleAcceptAll} variant="default">
          Accept All
        </Button>
        <Button onClick={handleRejectAll} variant="outline">
          Reject All (Essential Only)
        </Button>
      </div>

      <div className="space-y-4">
        {consentCategories.map((category) => {
          const IconComponent = category.icon;
          return (
            <Card key={category.id} className="relative">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-3 text-lg">
                    <IconComponent className="h-5 w-5 text-primary" />
                    {category.title}
                    {category.required && (
                      <Badge variant="secondary" className="text-xs">
                        Required
                      </Badge>
                    )}
                  </CardTitle>
                  <Switch
                    checked={category.enabled}
                    onCheckedChange={(enabled) => 
                      handleConsentChange(category.id as keyof ConsentSettings, enabled)
                    }
                    disabled={category.required}
                  />
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  {category.description}
                </p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {hasChanged && (
        <div className="sticky bottom-4 bg-background border rounded-lg p-4 shadow-lg">
          <div className="flex items-center justify-between">
            <p className="text-sm text-muted-foreground">
              You have unsaved changes to your privacy preferences.
            </p>
            <Button onClick={handleSaveConsents}>
              Save Preferences
            </Button>
          </div>
        </div>
      )}

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Need Help?</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground mb-3">
            Learn more about our data practices and your privacy rights.
          </p>
          <div className="space-y-2">
            <Button variant="outline" size="sm" asChild className="w-full">
              <a href="/privacy-policy" target="_blank">Privacy Policy</a>
            </Button>
            <Button variant="outline" size="sm" asChild className="w-full">
              <a href="/cookie-policy" target="_blank">Cookie Policy</a>
            </Button>
            <Button variant="outline" size="sm" asChild className="w-full">
              <a href="/data-protection" target="_blank">Data Protection Center</a>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ConsentManager;
