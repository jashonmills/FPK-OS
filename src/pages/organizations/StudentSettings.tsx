import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { User, Settings, Shield, Loader2 } from 'lucide-react';
import { useStudentPortalContext } from '@/hooks/useStudentPortalContext';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import EnhancedAvatarUpload from '@/components/settings/EnhancedAvatarUpload';
import StudentLearningPreferences from '@/components/settings/StudentLearningPreferences';

export default function StudentSettings() {
  const [searchParams] = useSearchParams();
  const defaultTab = searchParams.get('tab') || 'profile';
  const { studentId } = useStudentPortalContext();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  // PIN state
  const [newPin, setNewPin] = useState('');
  const [confirmPin, setConfirmPin] = useState('');
  const [isChangingPin, setIsChangingPin] = useState(false);
  
  // Profile state
  const [fullName, setFullName] = useState('');
  const [dateOfBirth, setDateOfBirth] = useState('');
  const [avatarUrl, setAvatarUrl] = useState('');
  const [isSavingProfile, setIsSavingProfile] = useState(false);

  // Fetch student profile data with linked_user_id
  const { data: studentRecord, isLoading } = useQuery({
    queryKey: ['org-student-profile', studentId],
    queryFn: async () => {
      if (!studentId) return null;
      const { data, error } = await supabase
        .from('org_students')
        .select('full_name, org_id, avatar_url, date_of_birth, linked_user_id, organizations(name)')
        .eq('id', studentId)
        .single();
      
      if (error) throw error;
      return data;
    },
    enabled: !!studentId
  });
  
  // Initialize form with fetched data
  useEffect(() => {
    if (studentRecord) {
      setFullName(studentRecord.full_name || '');
      setDateOfBirth(studentRecord.date_of_birth || '');
      setAvatarUrl(studentRecord.avatar_url || '');
    }
  }, [studentRecord]);

  const handlePinChange = async () => {
    if (newPin.length !== 6) {
      toast({
        title: "Invalid PIN",
        description: "PIN must be exactly 6 digits",
        variant: "destructive"
      });
      return;
    }

    if (newPin !== confirmPin) {
      toast({
        title: "PINs don't match",
        description: "Please make sure both PINs match",
        variant: "destructive"
      });
      return;
    }

    setIsChangingPin(true);
    try {
      // Call edge function to update PIN
      const { data, error } = await supabase.functions.invoke('update-student-pin', {
        body: { student_id: studentId, new_pin: newPin }
      });

      if (error) throw error;

      toast({
        title: "PIN Updated",
        description: "Your PIN has been successfully changed"
      });
      
      setNewPin('');
      setConfirmPin('');
    } catch (error) {
      console.error('Error updating PIN:', error);
      toast({
        title: "Error",
        description: "Failed to update PIN. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsChangingPin(false);
    }
  };
  
  const handleProfileUpdate = async () => {
    if (!studentId) return;
    
    setIsSavingProfile(true);
    try {
      const { error } = await supabase
        .from('org_students')
        .update({
          full_name: fullName,
          date_of_birth: dateOfBirth || null,
          avatar_url: avatarUrl || null,
        })
        .eq('id', studentId);
        
      if (error) throw error;
      
      // Invalidate query to refetch data
      queryClient.invalidateQueries({ queryKey: ['org-student-profile', studentId] });
      
      toast({
        title: "Profile Updated",
        description: "Your profile has been successfully updated"
      });
    } catch (error) {
      console.error('Error updating profile:', error);
      toast({
        title: "Error",
        description: "Failed to update profile. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSavingProfile(false);
    }
  };
  
  const handleAvatarUpload = (url: string) => {
    setAvatarUrl(url);
  };

  if (isLoading) {
    return (
      <div className="container mx-auto py-8 flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 px-4 max-w-4xl">
      <Card className="border-0 shadow-lg">
        <CardHeader className="bg-brand-accent/10 border-b border-brand-accent/20">
          <CardTitle className="text-2xl flex items-center gap-2">
            <Settings className="h-6 w-6" />
            Student Settings
          </CardTitle>
          <CardDescription>
            Manage your learning preferences and account settings
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-6">
          <Tabs defaultValue={defaultTab} className="space-y-6">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="profile">
                <User className="h-4 w-4 mr-2" />
                Profile
              </TabsTrigger>
              <TabsTrigger value="preferences">
                <Settings className="h-4 w-4 mr-2" />
                Preferences
              </TabsTrigger>
              <TabsTrigger value="security">
                <Shield className="h-4 w-4 mr-2" />
                Security
              </TabsTrigger>
            </TabsList>

            <TabsContent value="profile" className="space-y-6">
              <div className="space-y-6">
                {/* Avatar Upload */}
                <div className="flex flex-col items-center space-y-4">
                  <EnhancedAvatarUpload
                    currentUrl={avatarUrl}
                    onUpload={handleAvatarUpload}
                    userName={fullName}
                  />
                </div>
                
                <div>
                  <Label htmlFor="full-name">Full Name</Label>
                  <Input
                    id="full-name"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="Enter your full name"
                    className="mt-2"
                  />
                </div>
                
                <div>
                  <Label htmlFor="date-of-birth">Date of Birth</Label>
                  <Input
                    id="date-of-birth"
                    type="date"
                    value={dateOfBirth}
                    onChange={(e) => setDateOfBirth(e.target.value)}
                    className="mt-2"
                  />
                </div>

                <div>
                  <Label htmlFor="student-id">Student ID</Label>
                  <Input
                    id="student-id"
                    value={studentId || 'Not available'}
                    disabled
                    className="mt-2 bg-muted"
                  />
                </div>

                <div>
                  <Label htmlFor="organization">Organization</Label>
                  <Input
                    id="organization"
                    value={(studentRecord?.organizations as any)?.name || 'Unknown'}
                    disabled
                    className="mt-2 bg-muted"
                  />
                </div>
                
                <Button 
                  onClick={handleProfileUpdate}
                  disabled={isSavingProfile}
                  className="w-full"
                >
                  {isSavingProfile ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Saving Changes...
                    </>
                  ) : (
                    'Save Changes'
                  )}
                </Button>
              </div>
            </TabsContent>

            <TabsContent value="preferences" className="space-y-6">
              <StudentLearningPreferences userId={studentRecord?.linked_user_id || null} />
            </TabsContent>

            <TabsContent value="security" className="space-y-6">
              <div className="space-y-4">
                <div>
                  <h3 className="font-medium mb-4">Change Your PIN</h3>
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="new-pin">New PIN (6 digits)</Label>
                      <Input
                        id="new-pin"
                        type="password"
                        inputMode="numeric"
                        maxLength={6}
                        value={newPin}
                        onChange={(e) => setNewPin(e.target.value.replace(/\D/g, ''))}
                        placeholder="Enter 6-digit PIN"
                        className="mt-2"
                      />
                    </div>

                    <div>
                      <Label htmlFor="confirm-pin">Confirm New PIN</Label>
                      <Input
                        id="confirm-pin"
                        type="password"
                        inputMode="numeric"
                        maxLength={6}
                        value={confirmPin}
                        onChange={(e) => setConfirmPin(e.target.value.replace(/\D/g, ''))}
                        placeholder="Confirm 6-digit PIN"
                        className="mt-2"
                      />
                    </div>

                    <Button 
                      onClick={handlePinChange}
                      disabled={isChangingPin || !newPin || !confirmPin}
                      className="w-full"
                    >
                      {isChangingPin ? (
                        <>
                          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                          Updating PIN...
                        </>
                      ) : (
                        'Update PIN'
                      )}
                    </Button>
                  </div>
                </div>

                <div className="p-4 bg-brand-accent/10 border border-brand-accent/20 rounded-lg backdrop-blur-sm">
                  <p className="text-sm text-muted-foreground">
                    <strong>Security tip:</strong> Choose a PIN that you can remember but others can't easily guess. Never share your PIN with anyone.
                  </p>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
