import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { logger } from '@/utils/logger';

interface PhoenixSettings {
  showWelcomeMessage: boolean;
  audioEnabled: boolean;
}

const DEFAULT_SETTINGS: PhoenixSettings = {
  showWelcomeMessage: true,
  audioEnabled: true,
};

export const usePhoenixSettings = () => {
  const { user } = useAuth();
  const [settings, setSettings] = useState<PhoenixSettings>(DEFAULT_SETTINGS);
  const [isLoading, setIsLoading] = useState(true);

  // Load settings from database
  useEffect(() => {
    const loadSettings = async () => {
      if (!user) {
        setIsLoading(false);
        return;
      }

      try {
        const { data, error } = await supabase
          .from('profiles')
          .select('phoenix_settings')
          .eq('id', user.id)
          .single();

        if (error) {
          logger.error('Failed to load Phoenix settings', 'PHOENIX_SETTINGS', error);
          setSettings(DEFAULT_SETTINGS);
        } else if (data?.phoenix_settings) {
          // Parse the JSONB data safely
          const phoenixSettings = typeof data.phoenix_settings === 'object' 
            ? data.phoenix_settings as Record<string, any>
            : {};
          
          setSettings({
            showWelcomeMessage: phoenixSettings.showWelcomeMessage ?? true,
            audioEnabled: phoenixSettings.audioEnabled ?? true,
          });
        }
      } catch (error) {
        logger.error('Error loading Phoenix settings', 'PHOENIX_SETTINGS', error);
        setSettings(DEFAULT_SETTINGS);
      } finally {
        setIsLoading(false);
      }
    };

    loadSettings();
  }, [user]);

  // Update setting in database
  const updateSetting = async <K extends keyof PhoenixSettings>(
    key: K,
    value: PhoenixSettings[K]
  ): Promise<boolean> => {
    if (!user) {
      logger.warn('Cannot update settings: User not authenticated', 'PHOENIX_SETTINGS');
      return false;
    }

    try {
      const newSettings = { ...settings, [key]: value };
      
      const { error } = await supabase
        .from('profiles')
        .update({ phoenix_settings: newSettings })
        .eq('id', user.id);

      if (error) {
        logger.error('Failed to update Phoenix setting', 'PHOENIX_SETTINGS', error);
        return false;
      }

      setSettings(newSettings);
      logger.info(`Phoenix setting updated: ${key} = ${value}`, 'PHOENIX_SETTINGS');
      return true;
    } catch (error) {
      logger.error('Error updating Phoenix setting', 'PHOENIX_SETTINGS', error);
      return false;
    }
  };

  const toggleWelcomeMessage = () => updateSetting('showWelcomeMessage', !settings.showWelcomeMessage);
  const toggleAudio = () => updateSetting('audioEnabled', !settings.audioEnabled);

  return {
    settings,
    isLoading,
    updateSetting,
    toggleWelcomeMessage,
    toggleAudio,
  };
};
