import React from 'react';
import { OrgCard, OrgCardContent, OrgCardDescription, OrgCardHeader, OrgCardTitle } from '@/components/organizations/OrgCard';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Building2, Users, Settings, Crown } from 'lucide-react';
import { useOrgContext } from '@/components/organizations/OrgContext';
import { useOrgCan } from '@/hooks/useOrgCan';

export default function OrganizationSettings() {
  const { currentOrg, getEffectiveRole } = useOrgContext();
  const { canAccessDangerZone } = useOrgCan();

  if (!currentOrg) {
    return (
      <div className="container max-w-4xl mx-auto py-8">
        <OrgCard>
          <OrgCardContent className="p-8 text-center">
            <p className="text-muted-foreground">No organization selected</p>
          </OrgCardContent>
        </OrgCard>
      </div>
    );
  }

  return (
    <div className="container max-w-4xl mx-auto py-8 space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Organization Settings</h1>
        <p className="text-muted-foreground mt-2">
          Manage your organization's details and configuration
        </p>
      </div>

      {/* Organization Overview */}
      <OrgCard>
        <OrgCardHeader>
          <OrgCardTitle className="flex items-center gap-2">
            <Building2 className="w-5 h-5" />
            Organization Overview
          </OrgCardTitle>
          <OrgCardDescription>
            Basic information about your organization
          </OrgCardDescription>
        </OrgCardHeader>
        <OrgCardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="org-name">Organization Name</Label>
              <Input 
                id="org-name" 
                value={currentOrg.organizations.name} 
                readOnly 
                className="mt-2"
              />
            </div>
            <div>
              <Label>Plan</Label>
              <div className="mt-2">
                <Badge variant="secondary" className="capitalize">
                  {currentOrg.organizations.plan}
                </Badge>
              </div>
            </div>
          </div>
          
          <div>
            <Label htmlFor="org-description">Description</Label>
            <Textarea 
              id="org-description"
              placeholder="Add a description for your organization..."
              className="mt-2"
              rows={3}
            />
          </div>
        </OrgCardContent>
      </OrgCard>

      {/* Capacity Overview */}
      <OrgCard>
        <OrgCardHeader>
          <OrgCardTitle className="flex items-center gap-2">
            <Users className="w-5 h-5" />
            Capacity & Usage
          </OrgCardTitle>
          <OrgCardDescription>
            Monitor your organization's seat usage and limits
          </OrgCardDescription>
        </OrgCardHeader>
        <OrgCardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center p-4 bg-muted/50 rounded-lg">
              <div className="text-2xl font-bold text-primary">
                12
              </div>
              <div className="text-sm text-muted-foreground">Students</div>
            </div>
            <div className="text-center p-4 bg-muted/50 rounded-lg">
              <div className="text-2xl font-bold text-primary">
                2
              </div>
              <div className="text-sm text-muted-foreground">Instructors</div>
            </div>
            <div className="text-center p-4 bg-muted/50 rounded-lg">
              <div className="text-2xl font-bold text-primary">
                50
              </div>
              <div className="text-sm text-muted-foreground">Total Capacity</div>
            </div>
          </div>
        </OrgCardContent>
      </OrgCard>

      {/* Settings */}
      <OrgCard>
        <OrgCardHeader>
          <OrgCardTitle className="flex items-center gap-2">
            <Settings className="w-5 h-5" />
            Organization Settings
          </OrgCardTitle>
          <OrgCardDescription>
            Configure organization-wide preferences and policies
          </OrgCardDescription>
        </OrgCardHeader>
        <OrgCardContent className="space-y-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <Label>Public Organization</Label>
                <p className="text-sm text-muted-foreground">
                  Allow your organization to be discoverable by others
                </p>
              </div>
              <Button variant="outline" size="sm">
                Configure
              </Button>
            </div>
            
            <Separator />
            
            <div className="flex items-center justify-between">
              <div>
                <Label>Auto-enrollment</Label>
                <p className="text-sm text-muted-foreground">
                  Automatically enroll new members in default courses
                </p>
              </div>
              <Button variant="outline" size="sm">
                Configure
              </Button>
            </div>
            
            <Separator />
            
            <div className="flex items-center justify-between">
              <div>
                <Label>Progress Tracking</Label>
                <p className="text-sm text-muted-foreground">
                  Enable detailed progress tracking for all members
                </p>
              </div>
              <Button variant="outline" size="sm">
                Configure
              </Button>
            </div>
          </div>
        </OrgCardContent>
      </OrgCard>

      {/* Danger Zone - Owner only */}
      {canAccessDangerZone() && (
        <OrgCard className="border-destructive/20">
          <OrgCardHeader>
            <OrgCardTitle className="flex items-center gap-2 text-destructive">
              <Crown className="w-5 h-5" />
              Danger Zone
            </OrgCardTitle>
            <OrgCardDescription>
              Irreversible actions that affect your entire organization
            </OrgCardDescription>
          </OrgCardHeader>
          <OrgCardContent>
            <Button variant="destructive" className="w-full">
              Delete Organization
            </Button>
          </OrgCardContent>
        </OrgCard>
      )}
    </div>
  );
}