import React, { useState, useRef } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Upload, X, Palette, Eye } from 'lucide-react';
import { useOrgContext } from '@/components/organizations/OrgContext';
import { useOrgBranding, useUpdateOrgBranding, useUploadBrandingFile } from '@/hooks/useOrgBranding';
import { useToast } from '@/hooks/use-toast';

const ACCENT_PRESETS = [
  { name: 'FPK Purple', value: '280 100% 70%', hex: '#a855f7' },
  { name: 'Ocean Blue', value: '210 100% 60%', hex: '#3b82f6' },
  { name: 'Forest Green', value: '142 76% 36%', hex: '#16a34a' },
  { name: 'Sunset Orange', value: '25 95% 53%', hex: '#ea580c' },
  { name: 'Rose Pink', value: '330 81% 60%', hex: '#ec4899' },
  { name: 'Amber Gold', value: '45 93% 47%', hex: '#d97706' },
];

export default function OrgBrandingSettings() {
  const { currentOrg } = useOrgContext();
  const { data: branding, isLoading } = useOrgBranding(currentOrg?.organization_id || null);
  const updateBranding = useUpdateOrgBranding();
  const uploadFile = useUploadBrandingFile();
  const { toast } = useToast();
  
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [bannerFile, setBannerFile] = useState<File | null>(null);
  const [customAccent, setCustomAccent] = useState(branding?.theme_accent || '');
  const [selectedPreset, setSelectedPreset] = useState<string | null>(null);
  
  const logoInputRef = useRef<HTMLInputElement>(null);
  const bannerInputRef = useRef<HTMLInputElement>(null);

  if (!currentOrg) {
    return (
      <div className="container max-w-4xl mx-auto py-8">
        <Card>
          <CardContent className="p-8 text-center">
            <p className="text-muted-foreground">No organization selected</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const handleFileSelect = (file: File, type: 'logo' | 'banner') => {
    if (type === 'logo') {
      setLogoFile(file);
    } else {
      setBannerFile(file);
    }
  };

  const handleSave = async () => {
    if (!currentOrg) return;

    try {
      let logoUrl = branding?.logo_url;
      let bannerUrl = branding?.banner_url;

      // Upload logo if changed
      if (logoFile) {
        const result = await uploadFile.mutateAsync({
          orgId: currentOrg.organization_id,
          file: logoFile,
          type: 'logo'
        });
        logoUrl = result.publicUrl;
      }

      // Upload banner if changed
      if (bannerFile) {
        const result = await uploadFile.mutateAsync({
          orgId: currentOrg.organization_id,
          file: bannerFile,
          type: 'banner'
        });
        bannerUrl = result.publicUrl;
      }

      // Update branding
      await updateBranding.mutateAsync({
        orgId: currentOrg.organization_id,
        branding: {
          logo_url: logoUrl,
          banner_url: bannerUrl,
          theme_accent: selectedPreset || customAccent || branding?.theme_accent,
        }
      });

      // Reset form state
      setLogoFile(null);
      setBannerFile(null);
    } catch (error) {
      console.error('Error saving branding:', error);
    }
  };

  const currentAccent = selectedPreset || branding?.theme_accent || ACCENT_PRESETS[0].value;

  if (isLoading) {
    return (
      <div className="container max-w-4xl mx-auto py-8">
        <Card>
          <CardContent className="p-8">
            <div className="animate-pulse space-y-4">
              <div className="h-8 bg-muted rounded w-1/3"></div>
              <div className="h-4 bg-muted rounded w-2/3"></div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container max-w-4xl mx-auto py-8 space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Organization Branding</h1>
        <p className="text-muted-foreground mt-2">
          Customize your organization's appearance with logos and theme colors
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Settings Panel */}
        <div className="space-y-6">
          {/* Logo Upload */}
          <Card>
            <CardHeader>
              <CardTitle>Logo</CardTitle>
              <CardDescription>
                Upload a square logo (recommended 64x64px or larger, max 2MB)
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-4">
                {(logoFile || branding?.logo_url) && (
                  <div className="w-16 h-16 border rounded-lg overflow-hidden bg-muted">
                    <img
                      src={logoFile ? URL.createObjectURL(logoFile) : branding?.logo_url}
                      alt="Logo preview"
                      className="w-full h-full object-contain"
                    />
                  </div>
                )}
                <div className="flex-1">
                  <Button
                    variant="outline"
                    onClick={() => logoInputRef.current?.click()}
                    className="w-full"
                  >
                    <Upload className="w-4 h-4 mr-2" />
                    {logoFile ? 'Change Logo' : 'Upload Logo'}
                  </Button>
                  <input
                    ref={logoInputRef}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) handleFileSelect(file, 'logo');
                    }}
                  />
                </div>
                {logoFile && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setLogoFile(null)}
                  >
                    <X className="w-4 h-4" />
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Banner Upload */}
          <Card>
            <CardHeader>
              <CardTitle>Banner (Optional)</CardTitle>
              <CardDescription>
                Upload a wide banner image (recommended 1200x300px, max 2MB)
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {(bannerFile || branding?.banner_url) && (
                <div className="w-full h-20 border rounded-lg overflow-hidden bg-muted">
                  <img
                    src={bannerFile ? URL.createObjectURL(bannerFile) : branding?.banner_url}
                    alt="Banner preview"
                    className="w-full h-full object-cover"
                  />
                </div>
              )}
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  onClick={() => bannerInputRef.current?.click()}
                  className="flex-1"
                >
                  <Upload className="w-4 h-4 mr-2" />
                  {bannerFile ? 'Change Banner' : 'Upload Banner'}
                </Button>
                <input
                  ref={bannerInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) handleFileSelect(file, 'banner');
                  }}
                />
                {bannerFile && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setBannerFile(null)}
                  >
                    <X className="w-4 h-4" />
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Theme Accent */}
          <Card>
            <CardHeader>
              <CardTitle>Accent Color</CardTitle>
              <CardDescription>
                Choose a color that represents your organization
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Preset Colors */}
              <div>
                <Label className="text-sm font-medium">Presets</Label>
                <div className="grid grid-cols-3 gap-2 mt-2">
                  {ACCENT_PRESETS.map((preset) => (
                    <button
                      key={preset.name}
                      onClick={() => {
                        setSelectedPreset(preset.value);
                        setCustomAccent('');
                      }}
                      className={`p-3 rounded-lg border text-left hover:bg-muted/50 transition-colors ${
                        selectedPreset === preset.value ? 'ring-2 ring-primary' : ''
                      }`}
                    >
                      <div
                        className="w-full h-6 rounded mb-2"
                        style={{ backgroundColor: preset.hex }}
                      />
                      <div className="text-xs font-medium">{preset.name}</div>
                    </button>
                  ))}
                </div>
              </div>

              <Separator />

              {/* Custom Color */}
              <div>
                <Label htmlFor="custom-accent" className="text-sm font-medium">
                  Custom Color (HSL format)
                </Label>
                <Input
                  id="custom-accent"
                  placeholder="e.g. 280 100% 70%"
                  value={customAccent}
                  onChange={(e) => {
                    setCustomAccent(e.target.value);
                    setSelectedPreset(null);
                  }}
                  className="mt-2"
                />
                <p className="text-xs text-muted-foreground mt-1">
                  Use HSL format without "hsl()" wrapper. Example: 280 100% 70%
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Save Button */}
          <Button 
            onClick={handleSave}
            disabled={updateBranding.isPending || uploadFile.isPending}
            className="w-full"
            size="lg"
          >
            {(updateBranding.isPending || uploadFile.isPending) ? 'Saving...' : 'Save Changes'}
          </Button>
        </div>

        {/* Preview Panel */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Eye className="w-5 h-5" />
                Live Preview
              </CardTitle>
              <CardDescription>
                See how your branding will look in the application
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Header Preview */}
              <div className="border rounded-lg p-4 bg-background">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-8 h-8 fpk-gradient rounded-lg flex items-center justify-center">
                    <span className="text-white font-bold text-sm">FPK</span>
                  </div>
                  <span className="font-semibold text-lg">{currentOrg.organizations.name}</span>
                </div>
                
                {/* Org Badge Preview */}
                <div className="flex items-center gap-2 px-3 py-1.5 bg-muted/50 rounded-full border w-fit">
                  {(logoFile || branding?.logo_url) ? (
                    <img 
                      src={logoFile ? URL.createObjectURL(logoFile) : branding?.logo_url}
                      alt="Logo preview"
                      className="w-5 h-5 object-contain rounded"
                    />
                  ) : (
                    <div className="w-5 h-5 bg-muted rounded flex items-center justify-center">
                      <Palette className="w-3 h-3 text-muted-foreground" />
                    </div>
                  )}
                  <span className="text-sm font-medium">{currentOrg.organizations.name}</span>
                  <Badge variant="secondary" className="text-xs h-4 px-2">
                    Org mode
                  </Badge>
                </div>
              </div>

              {/* Accent Color Preview */}
              <div className="border rounded-lg p-4 bg-background">
                <h4 className="font-medium mb-3">Accent Color Usage</h4>
                <div className="space-y-3">
                  <Button 
                    style={{ 
                      backgroundColor: `hsl(${currentAccent})`,
                      color: 'white'
                    }}
                    className="w-full"
                  >
                    Primary Button
                  </Button>
                  <div 
                    className="w-full h-8 rounded border"
                    style={{ backgroundColor: `hsl(${currentAccent} / 0.1)` }}
                  >
                    <div className="flex items-center justify-center h-full text-sm">
                      Accent Background
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <div 
                      className="w-4 h-4 rounded-full"
                      style={{ backgroundColor: `hsl(${currentAccent})` }}
                    />
                    <span className="text-sm">Accent Indicators</span>
                  </div>
                </div>
              </div>

              {/* Banner Preview */}
              {(bannerFile || branding?.banner_url) && (
                <div className="border rounded-lg overflow-hidden">
                  <img
                    src={bannerFile ? URL.createObjectURL(bannerFile) : branding?.banner_url}
                    alt="Banner preview"
                    className="w-full h-24 object-cover"
                  />
                  <div className="p-3 bg-muted/50">
                    <p className="text-sm text-muted-foreground">
                      Banner will appear subtly behind page titles
                    </p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}