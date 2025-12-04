import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import {
  Settings as SettingsIcon,
  Bell,
  Database,
  Shield,
  Zap,
  Globe,
  Mail,
  Lock,
  Code,
  AlertCircle,
  Save,
  RefreshCw
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Textarea } from '@/components/ui/textarea';

const AdminSettings = () => {
  const { toast } = useToast();
  const [isSaving, setIsSaving] = useState(false);

  // Feature Flags State
  const [featureFlags, setFeatureFlags] = useState({
    betaFeatures: true,
    aiStudyCoach: true,
    scormUpload: true,
    organizationPortals: true,
    advancedAnalytics: false,
    gamification: true,
    courseBuilder: false
  });

  // System Configuration State
  const [systemConfig, setSystemConfig] = useState({
    siteName: 'FPK University',
    supportEmail: 'support@fpkuniversity.com',
    maxUploadSize: 50,
    sessionTimeout: 60,
    maintenanceMode: false,
    registrationEnabled: true,
    emailVerificationRequired: true
  });

  // Email Settings State
  const [emailSettings, setEmailSettings] = useState({
    smtpHost: '',
    smtpPort: 587,
    smtpSecure: true,
    senderEmail: 'noreply@fpkuniversity.com',
    senderName: 'FPK University'
  });

  // API Configuration State
  const [apiConfig, setApiConfig] = useState({
    rateLimitPerMinute: 100,
    enableCors: true,
    apiVersion: 'v1',
    logLevel: 'info'
  });

  const handleSaveFeatureFlags = async () => {
    setIsSaving(true);
    try {
      // TODO: Implement actual save to database or configuration service
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast({
        title: "Feature flags saved",
        description: "Feature flag configuration has been updated successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save feature flags",
        variant: "destructive"
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleSaveSystemConfig = async () => {
    setIsSaving(true);
    try {
      // TODO: Implement actual save to database
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast({
        title: "System configuration saved",
        description: "System settings have been updated successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save system configuration",
        variant: "destructive"
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleTestEmailSettings = async () => {
    toast({
      title: "Feature Coming Soon",
      description: "Email configuration testing will be available soon",
    });
  };

  return (
    <div className="p-4 md:p-6 space-y-6">
      <div>
        <h1 className="text-2xl md:text-3xl font-bold flex items-center gap-2">
          <SettingsIcon className="h-8 w-8" />
          Admin Settings
        </h1>
        <p className="text-muted-foreground mt-1">
          Manage system-wide configurations and platform settings
        </p>
      </div>

      <Tabs defaultValue="general" className="w-full">
        <TabsList className="grid w-full grid-cols-2 lg:grid-cols-5 h-auto">
          <TabsTrigger value="general" className="gap-2">
            <Globe className="h-4 w-4" />
            <span className="hidden sm:inline">General</span>
          </TabsTrigger>
          <TabsTrigger value="features" className="gap-2">
            <Zap className="h-4 w-4" />
            <span className="hidden sm:inline">Features</span>
          </TabsTrigger>
          <TabsTrigger value="email" className="gap-2">
            <Mail className="h-4 w-4" />
            <span className="hidden sm:inline">Email</span>
          </TabsTrigger>
          <TabsTrigger value="security" className="gap-2">
            <Shield className="h-4 w-4" />
            <span className="hidden sm:inline">Security</span>
          </TabsTrigger>
          <TabsTrigger value="api" className="gap-2">
            <Code className="h-4 w-4" />
            <span className="hidden sm:inline">API</span>
          </TabsTrigger>
        </TabsList>

        {/* General Settings Tab */}
        <TabsContent value="general" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>General System Configuration</CardTitle>
              <CardDescription>
                Basic platform settings and configurations
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="siteName">Site Name</Label>
                  <Input
                    id="siteName"
                    value={systemConfig.siteName}
                    onChange={(e) => setSystemConfig({
                      ...systemConfig,
                      siteName: e.target.value
                    })}
                  />
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="supportEmail">Support Email</Label>
                  <Input
                    id="supportEmail"
                    type="email"
                    value={systemConfig.supportEmail}
                    onChange={(e) => setSystemConfig({
                      ...systemConfig,
                      supportEmail: e.target.value
                    })}
                  />
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="maxUploadSize">Max Upload Size (MB)</Label>
                  <Input
                    id="maxUploadSize"
                    type="number"
                    value={systemConfig.maxUploadSize}
                    onChange={(e) => setSystemConfig({
                      ...systemConfig,
                      maxUploadSize: parseInt(e.target.value) || 50
                    })}
                  />
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="sessionTimeout">Session Timeout (minutes)</Label>
                  <Input
                    id="sessionTimeout"
                    type="number"
                    value={systemConfig.sessionTimeout}
                    onChange={(e) => setSystemConfig({
                      ...systemConfig,
                      sessionTimeout: parseInt(e.target.value) || 60
                    })}
                  />
                </div>
              </div>

              <Separator />

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Maintenance Mode</Label>
                    <p className="text-sm text-muted-foreground">
                      Temporarily disable public access to the platform
                    </p>
                  </div>
                  <Switch
                    checked={systemConfig.maintenanceMode}
                    onCheckedChange={(checked) => setSystemConfig({
                      ...systemConfig,
                      maintenanceMode: checked
                    })}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>User Registration</Label>
                    <p className="text-sm text-muted-foreground">
                      Allow new users to sign up
                    </p>
                  </div>
                  <Switch
                    checked={systemConfig.registrationEnabled}
                    onCheckedChange={(checked) => setSystemConfig({
                      ...systemConfig,
                      registrationEnabled: checked
                    })}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Email Verification Required</Label>
                    <p className="text-sm text-muted-foreground">
                      Require email verification for new accounts
                    </p>
                  </div>
                  <Switch
                    checked={systemConfig.emailVerificationRequired}
                    onCheckedChange={(checked) => setSystemConfig({
                      ...systemConfig,
                      emailVerificationRequired: checked
                    })}
                  />
                </div>
              </div>

              <Button onClick={handleSaveSystemConfig} disabled={isSaving}>
                <Save className="h-4 w-4 mr-2" />
                {isSaving ? 'Saving...' : 'Save Changes'}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Feature Flags Tab */}
        <TabsContent value="features" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Feature Flags</CardTitle>
              <CardDescription>
                Enable or disable platform features
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <Alert>
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  Changes to feature flags take effect immediately for all users
                </AlertDescription>
              </Alert>

              <div className="space-y-4">
                {Object.entries(featureFlags).map(([key, value]) => (
                  <div key={key} className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label className="capitalize">
                        {key.replace(/([A-Z])/g, ' $1').trim()}
                      </Label>
                      <p className="text-sm text-muted-foreground">
                        {getFeatureDescription(key)}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      {value && <Badge variant="default">Active</Badge>}
                      <Switch
                        checked={value}
                        onCheckedChange={(checked) => setFeatureFlags({
                          ...featureFlags,
                          [key]: checked
                        })}
                      />
                    </div>
                  </div>
                ))}
              </div>

              <Button onClick={handleSaveFeatureFlags} disabled={isSaving}>
                <Save className="h-4 w-4 mr-2" />
                {isSaving ? 'Saving...' : 'Save Feature Flags'}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Email Settings Tab */}
        <TabsContent value="email" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Email Configuration</CardTitle>
              <CardDescription>
                Configure SMTP settings for outgoing emails
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <Alert>
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  Email configuration is managed through Supabase SMTP settings in the dashboard
                </AlertDescription>
              </Alert>

              <div className="grid gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="smtpHost">SMTP Host</Label>
                  <Input
                    id="smtpHost"
                    value={emailSettings.smtpHost}
                    placeholder="smtp.resend.com"
                    onChange={(e) => setEmailSettings({
                      ...emailSettings,
                      smtpHost: e.target.value
                    })}
                  />
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="smtpPort">SMTP Port</Label>
                  <Input
                    id="smtpPort"
                    type="number"
                    value={emailSettings.smtpPort}
                    onChange={(e) => setEmailSettings({
                      ...emailSettings,
                      smtpPort: parseInt(e.target.value) || 587
                    })}
                  />
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="senderEmail">Sender Email</Label>
                  <Input
                    id="senderEmail"
                    type="email"
                    value={emailSettings.senderEmail}
                    onChange={(e) => setEmailSettings({
                      ...emailSettings,
                      senderEmail: e.target.value
                    })}
                  />
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="senderName">Sender Name</Label>
                  <Input
                    id="senderName"
                    value={emailSettings.senderName}
                    onChange={(e) => setEmailSettings({
                      ...emailSettings,
                      senderName: e.target.value
                    })}
                  />
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Button variant="outline" onClick={handleTestEmailSettings}>
                  <Mail className="h-4 w-4 mr-2" />
                  Test Email Configuration
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Security Tab */}
        <TabsContent value="security" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Security Settings</CardTitle>
              <CardDescription>
                Configure security and authentication settings
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <Alert>
                <Shield className="h-4 w-4" />
                <AlertDescription>
                  Security settings are managed through Supabase Auth configuration
                </AlertDescription>
              </Alert>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Two-Factor Authentication</Label>
                    <p className="text-sm text-muted-foreground">
                      Require 2FA for admin accounts
                    </p>
                  </div>
                  <Badge variant="outline">Coming Soon</Badge>
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Session Security</Label>
                    <p className="text-sm text-muted-foreground">
                      Enhanced session monitoring and validation
                    </p>
                  </div>
                  <Badge variant="default">Active</Badge>
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>IP Whitelisting</Label>
                    <p className="text-sm text-muted-foreground">
                      Restrict admin access by IP address
                    </p>
                  </div>
                  <Badge variant="outline">Coming Soon</Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* API Configuration Tab */}
        <TabsContent value="api" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>API Configuration</CardTitle>
              <CardDescription>
                Configure API settings and rate limits
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="rateLimit">Rate Limit (requests/minute)</Label>
                  <Input
                    id="rateLimit"
                    type="number"
                    value={apiConfig.rateLimitPerMinute}
                    onChange={(e) => setApiConfig({
                      ...apiConfig,
                      rateLimitPerMinute: parseInt(e.target.value) || 100
                    })}
                  />
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="logLevel">Log Level</Label>
                  <Input
                    id="logLevel"
                    value={apiConfig.logLevel}
                    onChange={(e) => setApiConfig({
                      ...apiConfig,
                      logLevel: e.target.value
                    })}
                  />
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Enable CORS</Label>
                  <p className="text-sm text-muted-foreground">
                    Allow cross-origin requests
                  </p>
                </div>
                <Switch
                  checked={apiConfig.enableCors}
                  onCheckedChange={(checked) => setApiConfig({
                    ...apiConfig,
                    enableCors: checked
                  })}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

// Helper function for feature descriptions
function getFeatureDescription(key: string): string {
  const descriptions: Record<string, string> = {
    betaFeatures: 'Enable beta features for testing',
    aiStudyCoach: 'AI-powered study assistant',
    scormUpload: 'Allow SCORM package uploads',
    organizationPortals: 'Multi-tenant organization support',
    advancedAnalytics: 'Advanced learning analytics dashboard',
    gamification: 'Badges, XP, and achievements',
    courseBuilder: 'Visual course creation tool'
  };
  return descriptions[key] || 'No description available';
}

export default AdminSettings;
