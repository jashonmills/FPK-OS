import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import { Edit, Mail, Phone, Briefcase, Building2 } from 'lucide-react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { UserProfileEditModal } from './UserProfileEditModal';

interface UserProfileCardProps {
  user: {
    id: string;
    email?: string;
  };
}

export const UserProfileCard = ({ user }: UserProfileCardProps) => {
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const queryClient = useQueryClient();

  // Fetch user profile
  const { data: profile, isLoading } = useQuery({
    queryKey: ['profile', user.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .maybeSingle();
      
      if (error) throw error;
      return data;
    },
    enabled: !!user.id,
  });

  const handleProfileUpdated = () => {
    queryClient.invalidateQueries({ queryKey: ['profile', user.id] });
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Your Profile</CardTitle>
          <CardDescription>Loading...</CardDescription>
        </CardHeader>
      </Card>
    );
  }

  return (
    <>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
          <div>
            <CardTitle>Your Profile</CardTitle>
            <CardDescription>Your account information and settings</CardDescription>
          </div>
          <Button variant="outline" size="sm" onClick={() => setIsEditModalOpen(true)}>
            <Edit className="w-4 h-4 mr-2" />
            Edit
          </Button>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-6">
            {/* Avatar Section */}
            <div className="flex-shrink-0">
              <Avatar className="h-24 w-24">
                <AvatarImage src={profile?.avatar_url || ''} alt={profile?.full_name || 'User'} />
                <AvatarFallback className="text-2xl">
                  {profile?.full_name?.charAt(0)?.toUpperCase() || user?.email?.charAt(0)?.toUpperCase() || 'U'}
                </AvatarFallback>
              </Avatar>
            </div>

            {/* Profile Information */}
            <div className="flex-1 space-y-4">
              {/* Name and Title */}
              <div>
                <h3 className="text-2xl font-semibold">
                  {profile?.full_name || profile?.display_name || 'No name set'}
                </h3>
                {profile?.professional_title && (
                  <p className="text-muted-foreground">{profile.professional_title}</p>
                )}
              </div>

              {/* Contact Information Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div className="flex items-center gap-3 p-3 border rounded-lg bg-muted/30">
                  <Mail className="h-5 w-5 text-muted-foreground flex-shrink-0" />
                  <div className="min-w-0">
                    <p className="text-sm font-medium">Email</p>
                    <p className="text-sm text-muted-foreground truncate">{user?.email}</p>
                  </div>
                </div>

                {profile?.phone && (
                  <div className="flex items-center gap-3 p-3 border rounded-lg bg-muted/30">
                    <Phone className="h-5 w-5 text-muted-foreground flex-shrink-0" />
                    <div className="min-w-0">
                      <p className="text-sm font-medium">Phone</p>
                      <p className="text-sm text-muted-foreground">{profile.phone}</p>
                    </div>
                  </div>
                )}

                {profile?.organization_name && (
                  <div className="flex items-center gap-3 p-3 border rounded-lg bg-muted/30">
                    <Building2 className="h-5 w-5 text-muted-foreground flex-shrink-0" />
                    <div className="min-w-0">
                      <p className="text-sm font-medium">Organization</p>
                      <p className="text-sm text-muted-foreground truncate">{profile.organization_name}</p>
                    </div>
                  </div>
                )}

                {profile?.professional_title && (
                  <div className="flex items-center gap-3 p-3 border rounded-lg bg-muted/30">
                    <Briefcase className="h-5 w-5 text-muted-foreground flex-shrink-0" />
                    <div className="min-w-0">
                      <p className="text-sm font-medium">Title</p>
                      <p className="text-sm text-muted-foreground truncate">{profile.professional_title}</p>
                    </div>
                  </div>
                )}
              </div>

              {/* Bio Section */}
              {profile?.bio && (
                <div className="pt-2">
                  <p className="text-sm font-medium mb-1">About</p>
                  <p className="text-sm text-muted-foreground">{profile.bio}</p>
                </div>
              )}

              {/* Empty State Message */}
              {!profile?.full_name && !profile?.professional_title && !profile?.phone && !profile?.organization_name && (
                <p className="text-sm text-muted-foreground italic">
                  Click Edit to complete your profile with more information.
                </p>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      <UserProfileEditModal
        open={isEditModalOpen}
        onOpenChange={setIsEditModalOpen}
        profile={profile}
        onProfileUpdated={handleProfileUpdated}
      />
    </>
  );
};
