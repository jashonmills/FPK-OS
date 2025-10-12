import React, { useState, useRef } from 'react';
import { OrgCard, OrgCardContent, OrgCardDescription, OrgCardHeader, OrgCardTitle } from '@/components/organizations/OrgCard';
import { OrgButton as Button } from '@/components/org/OrgButton';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Settings, Palette, UserPlus, Upload, X, Eye, Mail, Link2, Copy, RefreshCw, Plus, Check, Info, Users, Calendar, UserCircle, LayoutGrid, LayoutList, Grid3x3 } from 'lucide-react';
import { useOrgContext } from '@/components/organizations/OrgContext';
import { useOrgBranding, useUpdateOrgBranding, useUploadBrandingFile } from '@/hooks/useOrgBranding';
import { useEmailInvitation } from '@/hooks/useInvitationSystem';
import { useToast } from '@/hooks/use-toast';
import { format } from 'date-fns';
import { supabase } from '@/integrations/supabase/client';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { ManualStaffAddDialog } from '@/components/org/ManualStaffAddDialog';
import { useOrgMembers, OrgMember } from '@/hooks/useOrgMembers';
import { useOrgMemberActions } from '@/hooks/useOrgMemberActions';
import { MemberProfileDialog } from '@/components/org/MemberProfileDialog';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { InstructorProfileSection } from '@/components/instructor/InstructorProfileSection';
import { MemberCard } from '@/components/org/MemberCard';
import { PendingInvitationsList } from '@/components/org/PendingInvitationsList';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { useNavigate } from 'react-router-dom';

const ACCENT_PRESETS = [
  { name: 'FPK Purple', value: '280 100% 70%', hex: '#a855f7' },
  { name: 'Ocean Blue', value: '210 100% 60%', hex: '#3b82f6' },
  { name: 'Forest Green', value: '142 76% 36%', hex: '#16a34a' },
  { name: 'Sunset Orange', value: '25 95% 53%', hex: '#ea580c' },
  { name: 'Rose Pink', value: '330 81% 60%', hex: '#ec4899' },
  { name: 'Amber Gold', value: '45 93% 47%', hex: '#d97706' },
];

const roleDescriptions = {
  owner: 'Full org management (members, courses, settings, subscriptions)',
  instructor: 'Create/assign courses, view analytics for their students',
  instructor_aide: 'Assist instructors (no org settings)',
  student: 'Access assigned courses and complete learning activities',
  viewer: 'Read-only analytics and rosters'
};

export default function OrganizationSettingsTabs() {
  const { currentOrg } = useOrgContext();
  const { toast } = useToast();
  const navigate = useNavigate();

  // Branding state
  const { data: branding, isLoading: brandingLoading } = useOrgBranding(currentOrg?.organization_id || null);
  const updateBranding = useUpdateOrgBranding();
  const uploadFile = useUploadBrandingFile();
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [bannerFile, setBannerFile] = useState<File | null>(null);
  const [customAccent, setCustomAccent] = useState(branding?.theme_accent || '');
  const [selectedPreset, setSelectedPreset] = useState<string | null>(null);
  const logoInputRef = useRef<HTMLInputElement>(null);
  const bannerInputRef = useRef<HTMLInputElement>(null);

  // Invitation state
  const [emails, setEmails] = useState(['']);
  const [selectedRole, setSelectedRole] = useState('instructor');
  const [inviteMessage, setInviteMessage] = useState('');
  const [expiresIn, setExpiresIn] = useState('7');
  const [manualAddDialogOpen, setManualAddDialogOpen] = useState(false);
  const emailInviteMutation = useEmailInvitation();
  
  // Members state
  const { members, isLoading: membersLoading, refetch: refetchMembers } = useOrgMembers();
  const { removeMember, changeRole, isRemovingMember, isChangingRole } = useOrgMemberActions();
  const [selectedMember, setSelectedMember] = useState<OrgMember | null>(null);
  const [memberProfileOpen, setMemberProfileOpen] = useState(false);
  const [viewMode, setViewMode] = useState<'list' | 'large-tiles' | 'small-tiles'>('large-tiles');
  const [removeConfirmOpen, setRemoveConfirmOpen] = useState(false);
  const [memberToRemove, setMemberToRemove] = useState<string | null>(null);

  const handleRemoveMember = (userId: string) => {
    setMemberToRemove(userId);
    setRemoveConfirmOpen(true);
  };

  const confirmRemoveMember = () => {
    if (memberToRemove) {
      removeMember(memberToRemove);
      setRemoveConfirmOpen(false);
      setMemberToRemove(null);
    }
  };

  const handleChangeRole = (userId: string, newRole: 'owner' | 'instructor' | 'instructor_aide' | 'viewer' | 'student') => {
    changeRole({ userId, newRole });
  };

  if (!currentOrg) {
    return (
      <div className="container max-w-6xl mx-auto py-8">
        <OrgCard>
          <OrgCardContent className="p-8 text-center">
            <p className="text-white/80">No organization selected</p>
          </OrgCardContent>
        </OrgCard>
      </div>
    );
  }

  const sanitizeOrgName = (name: string) => {
    const firstLine = name.split(/\n|at |https?:\/\//)[0].trim();
    return firstLine.length > 50 ? firstLine.substring(0, 50) + '...' : firstLine;
  };

  const displayName = sanitizeOrgName(currentOrg.organizations.name);
  const currentAccent = selectedPreset || branding?.theme_accent || ACCENT_PRESETS[0].value;

  // Branding handlers
  const handleFileSelect = (file: File, type: 'logo' | 'banner') => {
    if (type === 'logo') {
      setLogoFile(file);
    } else {
      setBannerFile(file);
    }
  };

  const handleSaveBranding = async () => {
    if (!currentOrg) return;

    try {
      let logoUrl = branding?.logo_url;
      let bannerUrl = branding?.banner_url;

      if (logoFile) {
        const result = await uploadFile.mutateAsync({
          orgId: currentOrg.organization_id,
          file: logoFile,
          type: 'logo'
        });
        logoUrl = result.publicUrl;
      }

      if (bannerFile) {
        const result = await uploadFile.mutateAsync({
          orgId: currentOrg.organization_id,
          file: bannerFile,
          type: 'banner'
        });
        bannerUrl = result.publicUrl;
      }

      await updateBranding.mutateAsync({
        orgId: currentOrg.organization_id,
        branding: {
          logo_url: logoUrl,
          banner_url: bannerUrl,
          theme_accent: selectedPreset || customAccent || branding?.theme_accent,
        }
      });

      setLogoFile(null);
      setBannerFile(null);
    } catch (error) {
      console.error('Error saving branding:', error);
    }
  };

  // Invitation handlers
  const handleAddEmail = () => setEmails([...emails, '']);
  const handleRemoveEmail = (index: number) => {
    if (emails.length > 1) setEmails(emails.filter((_, i) => i !== index));
  };
  const handleEmailChange = (index: number, value: string) => {
    const newEmails = [...emails];
    newEmails[index] = value;
    setEmails(newEmails);
  };

  const handleSendInvites = async () => {
    const validEmails = emails.filter(email => email.trim() && email.includes('@'));
    
    if (validEmails.length === 0) {
      toast({ title: 'Please enter at least one valid email.', variant: 'destructive' });
      return;
    }

    try {
      for (const email of validEmails) {
        await emailInviteMutation.mutateAsync({
          orgId: currentOrg.organization_id,
          email: email.trim(),
          role: selectedRole as 'owner' | 'instructor' | 'student' | 'instructor_aide' | 'viewer'
        });
      }
      
      toast({ title: `Invite sent to ${validEmails.length} recipient${validEmails.length > 1 ? 's' : ''}.` });
      setEmails(['']);
      setInviteMessage('');
    } catch (error: any) {
      console.error('Error sending invites:', error);
    }
  };

  // Removed join code functionality - use email invitations only

  return (
    <div className="container max-w-6xl mx-auto py-8 space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-white drop-shadow-lg">Organization Settings</h1>
        <p className="text-white/80 mt-2 drop-shadow">
          Manage your organization's configuration, branding, and member invitations
        </p>
      </div>

      <Tabs defaultValue="general" className="space-y-6">
        <TabsList className="bg-orange-500/65 border border-orange-400/50 text-white">
          <TabsTrigger value="general" className="flex items-center gap-2">
            <Settings className="h-4 w-4" />
            General
          </TabsTrigger>
          <TabsTrigger value="branding" className="flex items-center gap-2">
            <Palette className="h-4 w-4" />
            Branding
          </TabsTrigger>
          <TabsTrigger value="invites" className="flex items-center gap-2">
            <UserPlus className="h-4 w-4" />
            Invite Members
          </TabsTrigger>
          <TabsTrigger value="members" className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            Members
          </TabsTrigger>
          <TabsTrigger value="profile" className="flex items-center gap-2">
            <UserCircle className="h-4 w-4" />
            My Profile
          </TabsTrigger>
        </TabsList>

        {/* General Settings Tab */}
        <TabsContent value="general" className="space-y-6">
          <OrgCard className="bg-orange-500/65 border-orange-400/50">
            <OrgCardHeader>
              <OrgCardTitle className="text-white">Organization Overview</OrgCardTitle>
              <OrgCardDescription className="text-white/80">
                Basic information about your organization
              </OrgCardDescription>
            </OrgCardHeader>
            <OrgCardContent className="space-y-4">
              <div>
                <Label htmlFor="org-name" className="text-white">Organization Name</Label>
                <Input 
                  id="org-name" 
                  value={displayName} 
                  disabled
                  className="mt-2 bg-white/20 border-white/30 text-white"
                />
              </div>
              <div>
                <Label className="text-white">Plan</Label>
                <div className="mt-2">
                  <Badge className="bg-white/20 text-white border-white/30">
                    {currentOrg.organizations.subscription_tier || 'Free'}
                  </Badge>
                </div>
              </div>
              <div>
                <Label htmlFor="description" className="text-white">Description</Label>
                <Textarea
                  id="description"
                  placeholder="Organization description..."
                  className="mt-2 bg-white/20 border-white/30 text-white placeholder:text-white/50"
                  rows={3}
                />
              </div>
            </OrgCardContent>
          </OrgCard>

          <OrgCard className="bg-orange-500/65 border-orange-400/50">
            <OrgCardHeader>
              <OrgCardTitle className="text-white">Organization Settings</OrgCardTitle>
              <OrgCardDescription className="text-white/80">
                Configure organization features and capabilities
              </OrgCardDescription>
            </OrgCardHeader>
            <OrgCardContent className="space-y-3">
              <Button variant="outline" className="w-full justify-start bg-white/10 border-white/30 text-white hover:bg-white/20">
                Public Organization
              </Button>
              <Button variant="outline" className="w-full justify-start bg-white/10 border-white/30 text-white hover:bg-white/20">
                Auto-enrollment
              </Button>
              <Button variant="outline" className="w-full justify-start bg-white/10 border-white/30 text-white hover:bg-white/20">
                Progress Tracking
              </Button>
            </OrgCardContent>
          </OrgCard>

          {currentOrg.role === 'owner' && (
            <OrgCard className="bg-red-500/20 border-red-400/50">
              <OrgCardHeader>
                <OrgCardTitle className="text-red-300">Danger Zone</OrgCardTitle>
                <OrgCardDescription className="text-red-200">
                  Irreversible actions for this organization
                </OrgCardDescription>
              </OrgCardHeader>
              <OrgCardContent>
                <Button variant="destructive">Delete Organization</Button>
              </OrgCardContent>
            </OrgCard>
          )}
        </TabsContent>

        {/* Branding Tab */}
        <TabsContent value="branding" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Branding Settings */}
            <div className="space-y-6">
              {/* Logo Upload */}
              <OrgCard className="bg-orange-500/65 border-orange-400/50">
                <OrgCardHeader>
                  <OrgCardTitle className="text-white">Logo</OrgCardTitle>
                  <OrgCardDescription className="text-white/80">
                    Upload a square logo (recommended 64x64px or larger, max 2MB)
                  </OrgCardDescription>
                </OrgCardHeader>
                <OrgCardContent className="space-y-4">
                  <div className="flex items-center gap-4">
                    {(logoFile || branding?.logo_url) && (
                      <div className="w-16 h-16 border border-white/30 rounded-lg overflow-hidden bg-white/20">
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
                        className="text-white hover:bg-white/20"
                      >
                        <X className="w-4 w-4" />
                      </Button>
                    )}
                  </div>
                </OrgCardContent>
              </OrgCard>

              {/* Banner Upload */}
              <OrgCard className="bg-orange-500/65 border-orange-400/50">
                <OrgCardHeader>
                  <OrgCardTitle className="text-white">Banner (Optional)</OrgCardTitle>
                  <OrgCardDescription className="text-white/80">
                    Upload a wide banner image (recommended 1200x300px, max 2MB)
                  </OrgCardDescription>
                </OrgCardHeader>
                <OrgCardContent className="space-y-4">
                  {(bannerFile || branding?.banner_url) && (
                    <div className="w-full h-20 border border-white/30 rounded-lg overflow-hidden bg-white/20">
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
                        className="text-white hover:bg-white/20"
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    )}
                  </div>
                </OrgCardContent>
              </OrgCard>

              {/* Theme Accent */}
              <OrgCard className="bg-orange-500/65 border-orange-400/50">
                <OrgCardHeader>
                  <OrgCardTitle className="text-white">Accent Color</OrgCardTitle>
                  <OrgCardDescription className="text-white/80">
                    Choose a color that represents your organization
                  </OrgCardDescription>
                </OrgCardHeader>
                <OrgCardContent className="space-y-4">
                  <div>
                    <Label className="text-sm font-medium text-white">Presets</Label>
                    <div className="grid grid-cols-3 gap-2 mt-2">
                      {ACCENT_PRESETS.map((preset) => (
                        <button
                          key={preset.name}
                          onClick={() => {
                            setSelectedPreset(preset.value);
                            setCustomAccent('');
                          }}
                          className={`p-3 rounded-lg border border-white/30 text-left hover:bg-white/20 transition-colors ${
                            selectedPreset === preset.value ? 'ring-2 ring-white' : ''
                          }`}
                        >
                          <div
                            className="w-full h-6 rounded mb-2"
                            style={{ backgroundColor: preset.hex }}
                          />
                          <div className="text-xs font-medium text-white">{preset.name}</div>
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="border-t border-white/30 my-4" />

                  <div>
                    <Label htmlFor="custom-accent" className="text-sm font-medium text-white">
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
                      className="mt-2 bg-white/20 border-white/30 text-white placeholder:text-white/70"
                    />
                  </div>
                </OrgCardContent>
              </OrgCard>

              <Button 
                onClick={handleSaveBranding}
                disabled={updateBranding.isPending || uploadFile.isPending}
                className="w-full bg-white/20 hover:bg-white/30 text-white border-white/30"
                size="lg"
              >
                {(updateBranding.isPending || uploadFile.isPending) ? 'Saving...' : 'Save Branding'}
              </Button>
            </div>

            {/* Preview Panel */}
            <div>
              <OrgCard className="bg-orange-500/65 border-orange-400/50">
                <OrgCardHeader>
                  <OrgCardTitle className="flex items-center gap-2 text-white">
                    <Eye className="w-5 h-5" />
                    Live Preview
                  </OrgCardTitle>
                  <OrgCardDescription className="text-white/80">
                    See how your branding will look in the application
                  </OrgCardDescription>
                </OrgCardHeader>
                <OrgCardContent className="space-y-4">
                  <div className="border border-white/30 rounded-lg p-4 bg-white/10">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-8 h-8 rounded-lg flex items-center justify-center">
                        <img 
                          src="/assets/fpk-character-logo.png" 
                          alt="FPK University"
                          className="w-8 h-8 object-contain rounded-lg"
                        />
                      </div>
                      <span className="font-semibold text-lg text-white">{displayName}</span>
                    </div>
                    
                    <div className="flex items-center gap-2 px-3 py-1.5 bg-white/20 rounded-full border border-white/30 w-fit">
                      {(logoFile || branding?.logo_url) ? (
                        <img 
                          src={logoFile ? URL.createObjectURL(logoFile) : branding?.logo_url}
                          alt="Logo preview"
                          className="w-5 h-5 object-contain rounded"
                        />
                      ) : (
                        <div className="w-5 h-5 bg-white/20 rounded flex items-center justify-center">
                          <Palette className="w-3 h-3 text-white/70" />
                        </div>
                      )}
                      <span className="text-sm font-medium text-white">{displayName}</span>
                      <Badge variant="secondary" className="text-xs h-4 px-2 bg-white/20 text-white border-white/30">
                        Org mode
                      </Badge>
                    </div>
                  </div>

                  <div className="border border-white/30 rounded-lg p-4 bg-white/10">
                    <h4 className="font-medium mb-3 text-white">Accent Color Usage</h4>
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
                        className="w-full h-8 rounded border border-white/30"
                        style={{ backgroundColor: `hsl(${currentAccent} / 0.1)` }}
                      >
                        <div className="flex items-center justify-center h-full text-sm text-white">
                          Accent Background
                        </div>
                      </div>
                    </div>
                  </div>

                  {(bannerFile || branding?.banner_url) && (
                    <div className="border border-white/30 rounded-lg overflow-hidden">
                      <img
                        src={bannerFile ? URL.createObjectURL(bannerFile) : branding?.banner_url}
                        alt="Banner preview"
                        className="w-full h-24 object-cover"
                      />
                      <div className="p-3 bg-white/20">
                        <p className="text-sm text-white/80">
                          Banner will appear subtly behind page titles
                        </p>
                      </div>
                    </div>
                  )}
                </OrgCardContent>
              </OrgCard>
            </div>
          </div>
        </TabsContent>

        {/* Invite Members Tab */}
        <TabsContent value="invites" className="space-y-6">
          {/* Single Column Layout */}
          <div className="max-w-3xl mx-auto space-y-6">
            
            {/* Contextual Alert */}
            <Alert className="bg-blue-500/20 border-blue-400/50">
              <Info className="h-4 w-4 text-white" />
              <AlertTitle className="text-white">Staff Invitations Only</AlertTitle>
              <AlertDescription className="text-white/80">
                Looking to add students? Use the{' '}
                <button
                  onClick={() => navigate(`/org/${currentOrg?.organization_id}/students`)}
                  className="underline font-medium hover:text-white"
                >
                  Students tab
                </button>
                {' '}for student rostering. This page is for inviting staff members.
              </AlertDescription>
            </Alert>

            {/* Email Invites */}
            <OrgCard className="bg-orange-500/65 border-orange-400/50">
              <OrgCardHeader>
                <OrgCardTitle className="flex items-center gap-2 text-white">
                  <Mail className="h-5 w-5" />
                  Invite by Email
                </OrgCardTitle>
                <OrgCardDescription className="text-white/80">
                  Send personalized invitations directly to email addresses
                </OrgCardDescription>
              </OrgCardHeader>
              <OrgCardContent className="space-y-4">
                <div>
                  <Label className="text-white">Email addresses</Label>
                  {emails.map((email, index) => (
                    <div key={index} className="flex gap-2 mt-2">
                      <Input
                        type="email"
                        placeholder="colleague@example.com"
                        value={email}
                        onChange={(e) => handleEmailChange(index, e.target.value)}
                        className="flex-1 bg-white/20 border-white/30 text-white placeholder:text-white/50"
                      />
                      {emails.length > 1 && (
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => handleRemoveEmail(index)}
                          className="bg-white/10 border-white/30 text-white hover:bg-white/20"
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  ))}
                  <Button
                    variant="outline"
                    onClick={handleAddEmail}
                    className="w-full mt-2 bg-white/10 border-white/30 text-white hover:bg-white/20"
                    size="sm"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add Another Email
                  </Button>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="role" className="text-white">Role</Label>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <div className="flex items-center gap-2 mt-1">
                            <Select value={selectedRole} onValueChange={setSelectedRole}>
                              <SelectTrigger className="bg-white/20 border-white/30 text-white">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="owner">Owner</SelectItem>
                                <SelectItem value="instructor">Instructor</SelectItem>
                                <SelectItem value="instructor_aide">Instructor Aide</SelectItem>
                                <SelectItem value="viewer">Viewer</SelectItem>
                              </SelectContent>
                            </Select>
                            <Info className="h-4 w-4 text-white/70" />
                          </div>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p className="text-sm max-w-xs">{roleDescriptions[selectedRole as keyof typeof roleDescriptions]}</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>

                  <div>
                    <Label htmlFor="expires" className="text-white">Expires in</Label>
                    <Select value={expiresIn} onValueChange={setExpiresIn}>
                      <SelectTrigger className="mt-1 bg-white/20 border-white/30 text-white">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1">1 day</SelectItem>
                        <SelectItem value="3">3 days</SelectItem>
                        <SelectItem value="7">7 days</SelectItem>
                        <SelectItem value="14">14 days</SelectItem>
                        <SelectItem value="30">30 days</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <Button
                  onClick={handleSendInvites}
                  disabled={emailInviteMutation.isPending}
                  className="w-full bg-white/20 hover:bg-white/30 text-white border-white/30"
                >
                  {emailInviteMutation.isPending ? 'Sending...' : 'Send Invitations'}
                </Button>
              </OrgCardContent>
            </OrgCard>

            {/* Manual Add Staff */}
            <OrgCard className="bg-orange-500/65 border-orange-400/50">
              <OrgCardHeader>
                <OrgCardTitle className="flex items-center gap-2 text-white">
                  <UserPlus className="h-5 w-5" />
                  Add Staff Manually
                </OrgCardTitle>
                <OrgCardDescription className="text-white/80">
                  Directly add instructors, aides, or viewers without sending an invite
                </OrgCardDescription>
              </OrgCardHeader>
              <OrgCardContent>
                <Button
                  onClick={() => setManualAddDialogOpen(true)}
                  className="w-full bg-white/20 hover:bg-white/30 text-white border-white/30"
                >
                  <UserPlus className="h-4 w-4 mr-2" />
                  Add Staff Member
                </Button>
                <p className="text-xs text-white/70 mt-3">
                  Staff members will receive a welcome email with account setup instructions.
                </p>
              </OrgCardContent>
            </OrgCard>

            {/* Pending Invitations List */}
            <PendingInvitationsList />

          </div>

          {/* Manual Staff Add Dialog */}
          <ManualStaffAddDialog
            open={manualAddDialogOpen}
            onOpenChange={setManualAddDialogOpen}
            organizationId={currentOrg.organization_id}
            onSuccess={() => {
              toast({ title: 'Staff member added successfully' });
              refetchMembers();
            }}
          />
        </TabsContent>

        {/* Members Tab */}
        <TabsContent value="members" className="space-y-6">
          <OrgCard className="bg-orange-500/65 border-orange-400/50">
            <OrgCardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <OrgCardTitle className="flex items-center gap-2 text-white">
                    <Users className="h-5 w-5" />
                    Organization Members
                  </OrgCardTitle>
                  <OrgCardDescription className="text-white/80">
                    View and manage all members in your organization
                  </OrgCardDescription>
                </div>
                
                {/* View Mode Toggle */}
                <div className="flex items-center gap-1 bg-white/10 rounded-lg p-1">
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          variant={viewMode === 'list' ? 'secondary' : 'ghost'}
                          size="sm"
                          onClick={() => setViewMode('list')}
                          className="h-8 w-8 p-0"
                        >
                          <LayoutList className="h-4 w-4" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>List View</TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                  
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          variant={viewMode === 'large-tiles' ? 'secondary' : 'ghost'}
                          size="sm"
                          onClick={() => setViewMode('large-tiles')}
                          className="h-8 w-8 p-0"
                        >
                          <LayoutGrid className="h-4 w-4" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>Large Tiles</TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                  
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          variant={viewMode === 'small-tiles' ? 'secondary' : 'ghost'}
                          size="sm"
                          onClick={() => setViewMode('small-tiles')}
                          className="h-8 w-8 p-0"
                        >
                          <Grid3x3 className="h-4 w-4" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>Small Tiles</TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
              </div>
            </OrgCardHeader>
            <OrgCardContent>
              {membersLoading ? (
                <div className="text-center py-8">
                  <RefreshCw className="h-8 w-8 text-white/70 mx-auto mb-4 animate-spin" />
                  <p className="text-white/80">Loading members...</p>
                </div>
              ) : members && members.length > 0 ? (
                <div className={
                  viewMode === 'list' 
                    ? 'space-y-2' 
                    : viewMode === 'small-tiles'
                    ? 'grid gap-3 md:grid-cols-2 lg:grid-cols-4'
                    : 'grid gap-4 md:grid-cols-2 lg:grid-cols-3'
                }>
                  {members.map((member) => (
                    <MemberCard 
                      key={member.user_id}
                      member={member}
                      viewMode={viewMode}
                      canManage={true}
                      onViewProfile={(member) => {
                        setSelectedMember(member);
                        setMemberProfileOpen(true);
                      }}
                      onRemoveMember={handleRemoveMember}
                      onChangeRole={handleChangeRole}
                    />
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <Users className="h-12 w-12 text-white/70 mx-auto mb-4" />
                  <p className="text-white/80">
                    No members found. Invite members to get started.
                  </p>
                </div>
              )}
            </OrgCardContent>
          </OrgCard>
        </TabsContent>

        {/* Instructor Profile Tab */}
        <TabsContent value="profile" className="space-y-6">
          <InstructorProfileSection />
        </TabsContent>

        {/* Member Profile Dialog */}
        <MemberProfileDialog
          member={selectedMember}
          open={memberProfileOpen}
          onOpenChange={setMemberProfileOpen}
        />

        {/* Remove Member Confirmation Dialog */}
        <AlertDialog open={removeConfirmOpen} onOpenChange={setRemoveConfirmOpen}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Remove Member?</AlertDialogTitle>
              <AlertDialogDescription>
                Are you sure you want to remove{' '}
                <span className="font-semibold">
                  {members.find(m => m.user_id === memberToRemove)?.full_name || 'this member'}
                </span>{' '}
                from the organization? This action cannot be undone. They will immediately lose access to all organization resources.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel onClick={() => {
                setRemoveConfirmOpen(false);
                setMemberToRemove(null);
              }}>
                Cancel
              </AlertDialogCancel>
              <AlertDialogAction
                onClick={confirmRemoveMember}
                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              >
                Remove Member
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </Tabs>
    </div>
  );
}
