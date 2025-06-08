
import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';
import { Globe, Check } from 'lucide-react';
import { supportedLanguages } from '@/i18n';
import { useUserProfile } from '@/hooks/useUserProfile';

const LanguageSwitcher = () => {
  const { i18n, t } = useTranslation();
  const { profile, updateProfile } = useUserProfile();
  const [dualLanguageEnabled, setDualLanguageEnabled] = useState(false);

  const currentLanguage = supportedLanguages.find(
    (lang) => lang.code === i18n.language
  ) || supportedLanguages[0];

  // Sync state with profile when it loads
  useEffect(() => {
    if (profile) {
      setDualLanguageEnabled(profile.dual_language_enabled || false);
    } else {
      // Fallback to localStorage if profile isn't loaded yet
      const savedDualLanguage = localStorage.getItem('fpk-dual-language');
      if (savedDualLanguage) {
        setDualLanguageEnabled(savedDualLanguage === 'true');
      }
    }
  }, [profile]);

  const handleLanguageChange = async (languageCode: string) => {
    // Update i18n
    await i18n.changeLanguage(languageCode);
    
    // Save to localStorage for persistence
    localStorage.setItem('fpk-language', languageCode);
    
    // Update user profile if available
    if (profile) {
      const languageName = supportedLanguages.find(
        (lang) => lang.code === languageCode
      )?.name || 'English';
      
      await updateProfile(
        { 
          primary_language: languageName 
        },
        true // silent update
      );
    }
  };

  const handleDualLanguageToggle = async (enabled: boolean) => {
    console.log('Toggling dual language to:', enabled);
    
    setDualLanguageEnabled(enabled);
    
    // Save to localStorage immediately
    localStorage.setItem('fpk-dual-language', enabled.toString());
    
    // Trigger a storage event to notify other components
    window.dispatchEvent(new StorageEvent('storage', {
      key: 'fpk-dual-language',
      newValue: enabled.toString(),
      oldValue: localStorage.getItem('fpk-dual-language')
    }));
    
    // Update user profile if available
    if (profile) {
      try {
        await updateProfile(
          { 
            dual_language_enabled: enabled 
          },
          true // silent update
        );
        console.log('Profile updated with dual language:', enabled);
      } catch (error) {
        console.error('Failed to update dual language setting:', error);
        // Revert local state if update fails
        setDualLanguageEnabled(!enabled);
        localStorage.setItem('fpk-dual-language', (!enabled).toString());
      }
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm" className="gap-2">
          <Globe className="h-4 w-4" />
          <span className="hidden sm:inline">{currentLanguage.native}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-64">
        <div className="px-3 py-2">
          <h4 className="font-medium text-sm">{t('settings.language.primaryLanguage')}</h4>
        </div>
        {supportedLanguages.map((language) => (
          <DropdownMenuItem
            key={language.code}
            onClick={() => handleLanguageChange(language.code)}
            className="cursor-pointer"
          >
            <div className="flex items-center justify-between w-full">
              <div className="flex flex-col">
                <span className="font-medium">{language.native}</span>
                <span className="text-xs text-gray-500">{language.name}</span>
              </div>
              {i18n.language === language.code && (
                <Check className="h-4 w-4 text-green-600" />
              )}
            </div>
          </DropdownMenuItem>
        ))}
        
        <DropdownMenuSeparator />
        
        <div className="px-3 py-2">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="dual-language" className="text-sm font-medium">
                {t('settings.language.dualLanguageMode')}
              </Label>
              <p className="text-xs text-gray-500">
                {t('settings.language.dualLanguageDescription')}
              </p>
            </div>
            <Switch
              id="dual-language"
              checked={dualLanguageEnabled}
              onCheckedChange={handleDualLanguageToggle}
            />
          </div>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default LanguageSwitcher;
