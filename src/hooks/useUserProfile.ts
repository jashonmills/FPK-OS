
import { useState, useEffect } from 'react';
import { UserProfile } from '@/types/userProfile';

export const useUserProfile = () => {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate profile fetch
    setTimeout(() => {
      setProfile({
        display_name: 'John Doe',
        full_name: 'John Doe',
        avatar_url: '',
        dual_language_enabled: false,
        font_family: 'System',
        text_size: 3,
        line_spacing: 3,
        color_contrast: 'Normal',
        comfort_mode: 'Normal',
        total_xp: 0,
        current_streak: 0,
        level: 1,
        learning_styles: []
      });
      setLoading(false);
    }, 500);
  }, []);

  const updateProfile = async (updates: Partial<UserProfile>, silent: boolean = false) => {
    if (!profile) return;
    
    const updatedProfile = { ...profile, ...updates };
    setProfile(updatedProfile);
    
    if (!silent) {
      console.log('Profile updated:', updates);
    }
  };

  return { profile, loading, updateProfile };
};
