import { useState, useEffect, useRef } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useTranslation } from 'react-i18next';
import type { Database } from '@/integrations/supabase/types';

type Profile = Database['public']['Tables']['profiles']['Row'];
type ProfileUpdate = Database['public']['Tables']['profiles']['Update'];

// Global cache to prevent multiple simultaneous loads
let globalProfileCache: Profile | null = null;
let globalLoadingPromise: Promise<Profile | null> | null = null;

export const useUserProfile = () => {
  const [profile, setProfile] = useState<Profile | null>(globalProfileCache);
  const [loading, setLoading] = useState(!globalProfileCache);
  const [saving, setSaving] = useState(false);
  const { toast } = useToast();
  const { i18n } = useTranslation();
  const loadingRef = useRef(false);

  useEffect(() => {
    // Don't load if already loading or if we have cached data
    if (loadingRef.current || globalProfileCache) {
      if (globalProfileCache && !profile) {
        setProfile(globalProfileCache);
        setLoading(false);
      }
      return;
    }
    
    loadProfile();
  }, [profile]);

  // Sync language when profile loads
  useEffect(() => {
    if (profile && profile.primary_language) {
      const languageMap: { [key: string]: string } = {
        'English': 'en',
        'Spanish': 'es',
        'Chinese': 'zh',
        'Hindi': 'hi',
        'French': 'fr',
        'German': 'de',
      };
      
      const languageCode = languageMap[profile.primary_language] || 'en';
      if (languageCode !== i18n.language) {
        i18n.changeLanguage(languageCode);
        localStorage.setItem('fpk-language', languageCode);
      }
    }
  }, [profile, i18n]);

  const loadProfile = async () => {
    // Prevent multiple simultaneous loads
    if (loadingRef.current) {
      console.log('📊 Profile load already in progress, skipping');
      return;
    }
    
    // Use cached data if available
    if (globalProfileCache) {
      console.log('📊 Using cached profile data');
      setProfile(globalProfileCache);
      setLoading(false);
      return;
    }
    
    // If there's already a loading promise, wait for it
    if (globalLoadingPromise) {
      console.log('📊 Waiting for existing profile load promise');
      const result = await globalLoadingPromise;
      if (result) {
        setProfile(result);
        setLoading(false);
      }
      return;
    }
    
    loadingRef.current = true;
    setLoading(true);
    
    // Create the loading promise
    globalLoadingPromise = (async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        
        if (!user) {
          setLoading(false);
          loadingRef.current = false;
          globalLoadingPromise = null;
          return null;
        }

        console.log('📊 Loading profile for user:', user.id);

      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .maybeSingle();

      if (error) {
        console.error('Error loading profile:', error);
        toast({
          title: "Error",
          description: "Failed to load profile data.",
          variant: "destructive",
        });
        return;
      }

      if (!data) {
        console.log('📊 No profile found, creating default profile');
        // Create default profile if it doesn't exist with correct accessibility defaults
        const defaultProfile: ProfileUpdate = {
          full_name: user.user_metadata?.full_name || '',
          display_name: user.user_metadata?.display_name || user.email?.split('@')[0] || '',
          primary_language: 'English',
          comfort_mode: 'Normal',
          time_format: '12h',
          date_format: 'US',
          font_family: 'System',
          color_contrast: 'Standard',
          dual_language_enabled: false,
          text_size: 3, // Medium (3)
          line_spacing: 3, // Normal (3)
          push_notifications_enabled: false,
          two_factor_enabled: false,
          speech_to_text_enabled: false,
          email_notifications: {
            new_courses: true,
            weekly_summary: true,
            ai_prompts: false
          },
          app_reminders: {
            study_streak: true,
            module_nudges: true
          },
          calendar_sync: {
            google: false,
            outlook: false
          },
          learning_styles: []
        };

        const { data: newProfile, error: createError } = await supabase
          .from('profiles')
          .insert({
            id: user.id,
            ...defaultProfile
          })
          .select()
          .single();

        if (createError) {
          console.error('Error creating profile:', createError);
          toast({
            title: "Error",
            description: "Failed to create profile.",
            variant: "destructive",
          });
          return;
        }

        console.log('📊 Created new profile:', newProfile);
        globalProfileCache = newProfile;
        setProfile(newProfile);
        return newProfile;
      } else {
        console.log('📊 Loaded existing profile:', data);
        globalProfileCache = data;
        setProfile(data);
        return data;
      }
    } catch (error) {
      console.error('Error in loadProfile:', error);
      toast({
        title: "Error",
        description: "Failed to load profile data.",
        variant: "destructive",
      });
      return null;
    } finally {
      setLoading(false);
      loadingRef.current = false;
      globalLoadingPromise = null;
    }
  })();
  
  return globalLoadingPromise;
};

  const updateProfile = async (updates: ProfileUpdate, silent: boolean = false) => {
    if (!profile) {
      console.error('❌ No profile to update');
      return;
    }

    console.log('💾 Updating profile with:', updates);
    setSaving(true);
    
    try {
      const { data, error } = await supabase
        .from('profiles')
        .update(updates)
        .eq('id', profile.id)
        .select()
        .single();

      if (error) {
        console.error('Error updating profile:', error);
        toast({
          title: "Error",
          description: "Failed to save settings.",
          variant: "destructive",
        });
        return;
      }

      console.log('✅ Profile updated successfully:', data);
      globalProfileCache = data; // Update cache
      setProfile(data);
      
      // Only show success toast for manual saves, not auto-saves
      if (!silent) {
        toast({
          title: "Settings saved",
          description: "Your preferences have been updated successfully.",
        });
      }
    } catch (error) {
      console.error('Error in updateProfile:', error);
      toast({
        title: "Error",
        description: "Failed to save settings.",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  const changePassword = async (currentPassword: string, newPassword: string) => {
    try {
      const { error } = await supabase.auth.updateUser({
        password: newPassword
      });

      if (error) {
        toast({
          title: "Error",
          description: error.message,
          variant: "destructive",
        });
        return false;
      }

      toast({
        title: "Password updated",
        description: "Your password has been changed successfully.",
      });
      return true;
    } catch (error) {
      console.error('Error changing password:', error);
      toast({
        title: "Error",
        description: "Failed to change password.",
        variant: "destructive",
      });
      return false;
    }
  };

  return {
    profile,
    loading,
    saving,
    updateProfile,
    changePassword,
    refetch: loadProfile,
  };
};
