import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { OrgLogo } from './OrgLogo';
import { OrgBanner } from './OrgBanner';
import { EnhancedOrgBranding } from '@/hooks/useEnhancedOrgBranding';
import { Building2, Users, BookOpen, TrendingUp } from 'lucide-react';

interface BrandingPreviewProps {
  branding: Partial<EnhancedOrgBranding> | null;
  orgName: string;
}

export function BrandingPreview({ branding, orgName }: BrandingPreviewProps) {
  // Apply preview theme temporarily
  React.useEffect(() => {
    if (!branding?.accent_hex) return;

    const root = document.documentElement;
    const originalAccent = root.style.getPropertyValue('--accent');
    const originalAccentForeground = root.style.getPropertyValue('--accent-foreground');

    // Apply preview colors
    root.style.setProperty('--accent', branding.accent_hex);
    root.style.setProperty('--accent-foreground', '0 0% 98%');

    return () => {
      // Restore original colors
      if (originalAccent) {
        root.style.setProperty('--accent', originalAccent);
      } else {
        root.style.removeProperty('--accent');
      }
      
      if (originalAccentForeground) {
        root.style.setProperty('--accent-foreground', originalAccentForeground);
      } else {
        root.style.removeProperty('--accent-foreground');
      }
    };
  }, [branding?.accent_hex]);

  return (
    <div className="space-y-6">
      <div className="text-lg font-semibold mb-4">Live Preview</div>
      
      {/* Hero Section Preview */}
      <div className="relative">
        <OrgBanner className="h-32 rounded-lg">
          <div className="p-6 flex items-center gap-4">
            <OrgLogo size="lg" />
            <div>
              <h1 className="text-2xl font-bold text-foreground">{orgName}</h1>
              <p className="text-muted-foreground">Organization Dashboard</p>
            </div>
          </div>
        </OrgBanner>
      </div>

      {/* Component Previews */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Navigation Preview */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm">Navigation</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="flex items-center gap-2 p-2 rounded-md bg-accent text-accent-foreground">
              <Building2 className="w-4 h-4" />
              <span className="text-sm">Dashboard</span>
            </div>
            <div className="flex items-center gap-2 p-2 rounded-md hover:bg-muted">
              <Users className="w-4 h-4" />
              <span className="text-sm">Students</span>
            </div>
            <div className="flex items-center gap-2 p-2 rounded-md hover:bg-muted">
              <BookOpen className="w-4 h-4" />
              <span className="text-sm">Courses</span>
            </div>
          </CardContent>
        </Card>

        {/* Button Previews */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm">Buttons & Elements</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button className="w-full">Primary Action</Button>
            <Button variant="outline" className="w-full">Secondary Action</Button>
            <div className="flex gap-2">
              <Badge>Active</Badge>
              <Badge variant="secondary">Progress</Badge>
              <Badge variant="outline">Complete</Badge>
            </div>
          </CardContent>
        </Card>

        {/* Stats Card Preview */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm">Statistics</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-3">
              <div className="p-2 bg-accent/10 rounded-lg">
                <TrendingUp className="w-5 h-5 text-accent" />
              </div>
              <div>
                <div className="text-2xl font-bold">127</div>
                <div className="text-sm text-muted-foreground">Active Students</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Progress Preview */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm">Progress Indicators</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Course Completion</span>
                <span>73%</span>
              </div>
              <Progress value={73} className="h-2" />
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Assignment Progress</span>
                <span>85%</span>
              </div>
              <Progress value={85} className="h-2" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Dark Mode Preview */}
      <Card className="bg-slate-900 text-slate-100 border-slate-800">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm">Dark Mode Preview</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-3">
            <div className="p-2 bg-accent/20 rounded-lg">
              <OrgLogo size="sm" variant="light" />
            </div>
            <div>
              <div className="font-semibold">{orgName}</div>
              <div className="text-sm text-slate-400">Dark theme appearance</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}