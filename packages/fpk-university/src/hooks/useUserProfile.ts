import { useState, useEffect, useRef } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useTranslation } from 'react-i18next';
import { safeLocalStorage } from '@/utils/safeStorage';
import type { Database } from '@/integrations/supabase/types';

type Profile = Database['public']['Tables']['profiles']['Row'];
type ProfileUpdate = Database['public']['Tables']['profiles']['Update'];

// Singleton class to manage profile data globally
class ProfileManager {
  private static instance: ProfileManager;
  private profile: Profile | null = null;
  private loading: boolean = true;
  private loadingPromise: Promise<Profile | null> | null = null;
  private subscribers: Set<(profile: Profile | null, loading: boolean) => void> = new Set();

  private constructor() {}

  static getInstance(): ProfileManager {
    if (!ProfileManager.instance) {
      ProfileManager.instance = new ProfileManager();
    }
    return ProfileManager.instance;
  }

  subscribe(callback: (profile: Profile | null, loading: boolean) => void) {
    this.subscribers.add(callback);
    // Immediately notify with current state
    callback(this.profile, this.loading);
    
    return () => {
      this.subscribers.delete(callback);
    };
  }

  private notify() {
    this.subscribers.forEach(callback => {
      callback(this.profile, this.loading);
    });
  }

  async loadProfile(): Promise<Profile | null> {
    // If already loading, return existing promise
    if (this.loadingPromise) {
      return this.loadingPromise;
    }

    // If already loaded, return cached data
    if (this.profile && !this.loading) {
      return this.profile;
    }

    this.loading = true;
    this.notify();

    this.loadingPromise = this.fetchProfile();
    const result = await this.loadingPromise;
    
    this.loading = false;
    this.loadingPromise = null;
    this.notify();
    
    return result;
  }

  private async fetchProfile(): Promise<Profile | null> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        return null;
      }

      console.log('📊 ProfileManager: Loading profile for user:', user.id);

      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .maybeSingle();

      if (error) {
        console.error('❌ ProfileManager: Error loading profile:', error);
        return null;
      }

      if (!data) {
        console.log('📊 ProfileManager: No profile found, attempting to create or fetch existing');
        
        // First try to fetch again - the profile might have been created by a trigger
        const { data: retryData, error: retryError } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .maybeSingle();
        
        if (retryData) {
          console.log('📊 ProfileManager: Found existing profile on retry:', retryData);
          this.profile = retryData;
          return retryData;
        }
        
        // If still not found, create a default profile
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
          text_size: 3,
          line_spacing: 3,
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

        // Use UPSERT to avoid duplicate key errors if profile was created by trigger
        const { data: newProfile, error: createError } = await supabase
          .from('profiles')
          .upsert({
            id: user.id,
            ...defaultProfile
          }, {
            onConflict: 'id',
            ignoreDuplicates: false
          })
          .select()
          .single();

        if (createError) {
          // Silently handle errors and try to fetch existing profile
          console.warn('⚠️ ProfileManager: Error during profile upsert (likely already exists):', createError.message);
          
          // Try one more time to fetch the profile
          const { data: finalFetch } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', user.id)
            .maybeSingle();
          
          if (finalFetch) {
            console.log('✅ ProfileManager: Successfully fetched existing profile');
            this.profile = finalFetch;
            return finalFetch;
          }
          
          // Log error but don't show toast - this prevents spam on navigation
          console.error('❌ ProfileManager: Could not create or fetch profile');
          return null;
        }

        console.log('📊 ProfileManager: Created new profile:', newProfile);
        this.profile = newProfile;
        return newProfile;
      } else {
        console.log('📊 ProfileManager: Loaded existing profile:', data);
        this.profile = data;
        return data;
      }
    } catch (error) {
      console.error('❌ ProfileManager: Exception in fetchProfile:', error);
      return null;
    }
  }

  async updateProfile(updates: ProfileUpdate, toast?: any): Promise<void> {
    if (!this.profile) {
      console.error('❌ No profile to update');
      return;
    }

    console.log('💾 ProfileManager: Updating profile with:', updates);
    
    try {
      const { data, error } = await supabase
        .from('profiles')
        .update(updates)
        .eq('id', this.profile.id)
        .select()
        .single();

      if (error) {
        console.error('Error updating profile:', error);
        if (toast) {
          toast({
            title: "Error",
            description: "Failed to save settings.",
            variant: "destructive",
          });
        }
        return;
      }

      console.log('✅ ProfileManager: Profile updated successfully:', data);
      this.profile = data;
      this.notify();
      
      if (toast) {
        toast({
          title: "Settings saved",
          description: "Your preferences have been updated successfully.",
        });
      }
    } catch (error) {
      console.error('Error in ProfileManager.updateProfile:', error);
      if (toast) {
        toast({
          title: "Error",
          description: "Failed to save settings.",
          variant: "destructive",
        });
      }
    }
  }
}

export const useUserProfile = () => {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const { toast } = useToast();
  const { i18n } = useTranslation();
  const profileManager = ProfileManager.getInstance();

  useEffect(() => {
    // Subscribe to profile changes
    const unsubscribe = profileManager.subscribe((newProfile, isLoading) => {
      setProfile(newProfile);
      setLoading(isLoading);
    });

    // Load profile - don't pass toast to avoid showing errors on every navigation
    // The ProfileManager will cache the result
    profileManager.loadProfile();

    return unsubscribe;
  }, []);

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
        safeLocalStorage.setItem('fpk-language', languageCode);
      }
    }
  }, [profile, i18n]);

  const updateProfile = async (updates: ProfileUpdate, silent: boolean = false) => {
    setSaving(true);
    await profileManager.updateProfile(updates, silent ? undefined : toast);
    setSaving(false);
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

  const refetch = () => {
    return profileManager.loadProfile();
  };

  return {
    profile,
    loading,
    saving,
    updateProfile,
    changePassword,
    refetch,
  };
};