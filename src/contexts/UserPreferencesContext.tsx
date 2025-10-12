import React, { createContext, useContext, useEffect, useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { useQuery } from '@tanstack/react-query';

interface UserPreferences {
  ai_interaction_style: string;
  ai_voice_enabled: boolean;
  ai_autoplay_voice: boolean;
  ai_hint_aggressiveness: number;
  display_theme: string;
  display_font_size: string;
  display_high_contrast: boolean;
  display_reduce_motion: boolean;
  gamification_xp_notify: boolean;
  gamification_leaderboard_enabled: boolean;
  gamification_focus_mode: boolean;
}

interface UserPreferencesContextType {
  preferences: UserPreferences | null;
  isLoading: boolean;
}

const UserPreferencesContext = createContext<UserPreferencesContextType | undefined>(undefined);

export function UserPreferencesProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();

  const { data: preferences, isLoading } = useQuery({
    queryKey: ['user-preferences', user?.id],
    queryFn: async () => {
      if (!user?.id) return null;
      
      const { data, error } = await supabase
        .from('profiles')
        .select(`
          ai_interaction_style,
          ai_voice_enabled,
          ai_autoplay_voice,
          ai_hint_aggressiveness,
          display_theme,
          display_font_size,
          display_high_contrast,
          display_reduce_motion,
          gamification_xp_notify,
          gamification_leaderboard_enabled,
          gamification_focus_mode
        `)
        .eq('id', user.id)
        .single();
      
      if (error) {
        console.error('Error fetching user preferences:', error);
        return null;
      }
      
      return data as UserPreferences;
    },
    enabled: !!user?.id,
    staleTime: 5 * 60 * 1000 // Cache for 5 minutes
  });

  // Apply theme preferences to document
  useEffect(() => {
    if (!preferences) return;

    const root = document.documentElement;

    // FEATURE TEMPORARILY DISABLED: Dark Mode Application
    // Force light mode for all users until feature is re-enabled
    root.classList.remove('dark');
    
    // Original theme application logic (commented out):
    // if (preferences.display_theme === 'dark') {
    //   root.classList.add('dark');
    // } else if (preferences.display_theme === 'light') {
    //   root.classList.remove('dark');
    // } else {
    //   // System theme
    //   const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    //   if (prefersDark) {
    //     root.classList.add('dark');
    //   } else {
    //     root.classList.remove('dark');
    //   }
    // }

    // Apply font size
    root.classList.remove('font-size-small', 'font-size-medium', 'font-size-large');
    root.classList.add(`font-size-${preferences.display_font_size}`);

    // Apply high contrast
    if (preferences.display_high_contrast) {
      root.classList.add('high-contrast');
    } else {
      root.classList.remove('high-contrast');
    }

    // Apply reduce motion
    if (preferences.display_reduce_motion) {
      root.classList.add('reduce-motion');
    } else {
      root.classList.remove('reduce-motion');
    }
  }, [preferences]);

  return (
    <UserPreferencesContext.Provider value={{ preferences, isLoading }}>
      {children}
    </UserPreferencesContext.Provider>
  );
}

export function useUserPreferences() {
  const context = useContext(UserPreferencesContext);
  if (context === undefined) {
    throw new Error('useUserPreferences must be used within a UserPreferencesProvider');
  }
  return context;
}
