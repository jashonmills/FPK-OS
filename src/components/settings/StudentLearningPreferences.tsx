import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Slider } from '@/components/ui/slider';
import { Loader2, Brain, Palette, Trophy, Sparkles } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useQuery, useQueryClient } from '@tanstack/react-query';

interface StudentLearningPreferencesProps {
  userId: string | null;
}

export default function StudentLearningPreferences({ userId }: StudentLearningPreferencesProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isUpdating, setIsUpdating] = useState<string | null>(null);

  // Fetch user preferences from profiles table
  const { data: preferences, isLoading } = useQuery({
    queryKey: ['student-preferences', userId],
    queryFn: async () => {
      if (!userId) return null;
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();
      
      if (error) throw error;
      return data;
    },
    enabled: !!userId
  });

  const updatePreference = async (field: string, value: any) => {
    if (!userId) return;
    
    setIsUpdating(field);
    try {
      const { error } = await supabase
        .from('profiles')
        .update({ [field]: value })
        .eq('id', userId);
      
      if (error) throw error;
      
      // Invalidate query to refetch
      queryClient.invalidateQueries({ queryKey: ['student-preferences', userId] });
      
      toast({
        title: "Preference Updated",
        description: "Your setting has been saved successfully"
      });
    } catch (error) {
      console.error('Error updating preference:', error);
      toast({
        title: "Error",
        description: "Failed to update preference. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsUpdating(null);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-8">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!preferences) {
    return (
      <div className="p-4 bg-destructive/10 border border-destructive/20 rounded-lg">
        <p className="text-sm text-muted-foreground">
          Unable to load preferences. Please try refreshing the page.
        </p>
      </div>
    );
  }

  const interactionStyles = [
    { value: 'encouraging_friendly', label: 'Encouraging & Friendly', description: 'Warm, supportive tone' },
    { value: 'direct_concise', label: 'Direct & Concise', description: 'Straight to the point' },
    { value: 'inquisitive_socratic', label: 'Inquisitive & Socratic', description: 'Guides through questions' }
  ];

  const themes = [
    { value: 'system', label: 'System', description: 'Follow device settings' },
    { value: 'light', label: 'Light', description: 'Bright mode' },
    { value: 'dark', label: 'Dark', description: 'Easy on the eyes' }
  ];

  const fontSizes = [
    { value: 'small', label: 'Small', description: 'Compact text' },
    { value: 'medium', label: 'Medium', description: 'Standard size' },
    { value: 'large', label: 'Large', description: 'Easier to read' }
  ];

  return (
    <div className="space-y-6">
      {/* AI Coach Preferences */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="h-5 w-5 text-purple-600" />
            AI Coach Preferences
          </CardTitle>
          <CardDescription>
            Customize how your AI learning assistant interacts with you
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Interaction Style */}
          <div className="space-y-3">
            <Label className="text-base font-medium">Interaction Style</Label>
            <div className="grid gap-3">
              {interactionStyles.map((style) => (
                <div
                  key={style.value}
                  onClick={() => updatePreference('ai_interaction_style', style.value)}
                  className={`
                    p-4 rounded-lg border-2 cursor-pointer transition-all
                    ${preferences.ai_interaction_style === style.value
                      ? 'border-primary bg-primary/5'
                      : 'border-border hover:border-primary/50'
                    }
                    ${isUpdating === 'ai_interaction_style' ? 'opacity-50' : ''}
                  `}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">{style.label}</p>
                      <p className="text-sm text-muted-foreground">{style.description}</p>
                    </div>
                    {preferences.ai_interaction_style === style.value && (
                      <Sparkles className="h-5 w-5 text-primary" />
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Voice Settings */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label className="text-base">Enable Voice Responses (TTS)</Label>
                <p className="text-sm text-muted-foreground">
                  Allow the AI to read responses aloud
                </p>
              </div>
              <Switch
                checked={preferences.ai_voice_enabled}
                onCheckedChange={(checked) => updatePreference('ai_voice_enabled', checked)}
                disabled={isUpdating === 'ai_voice_enabled'}
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label className="text-base">Auto-play AI Voice</Label>
                <p className="text-sm text-muted-foreground">
                  Automatically speak AI responses
                </p>
              </div>
              <Switch
                checked={preferences.ai_autoplay_voice}
                onCheckedChange={(checked) => updatePreference('ai_autoplay_voice', checked)}
                disabled={isUpdating === 'ai_autoplay_voice' || !preferences.ai_voice_enabled}
              />
            </div>
          </div>

          {/* Hint Preference */}
          <div className="space-y-3">
            <Label className="text-base font-medium">Hint Preference</Label>
            <p className="text-sm text-muted-foreground mb-4">
              How quickly should the AI offer hints during learning?
            </p>
            <div className="px-2">
              <Slider
                value={[preferences.ai_hint_aggressiveness]}
                onValueChange={(value) => updatePreference('ai_hint_aggressiveness', value[0])}
                max={2}
                step={1}
                className="w-full"
                disabled={isUpdating === 'ai_hint_aggressiveness'}
              />
              <div className="flex justify-between mt-2 text-xs text-muted-foreground">
                <span>Give me time</span>
                <span>Normal</span>
                <span>Help me quickly</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Content & Display Preferences */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Palette className="h-5 w-5 text-orange-600" />
            Content & Display
          </CardTitle>
          <CardDescription>
            Adjust visual settings to match your preferences
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Theme */}
          <div className="space-y-3">
            <Label className="text-base font-medium">Theme</Label>
            <div className="grid grid-cols-3 gap-3">
              {themes.map((theme) => (
                <div
                  key={theme.value}
                  onClick={() => updatePreference('display_theme', theme.value)}
                  className={`
                    p-3 rounded-lg border-2 cursor-pointer transition-all text-center
                    ${preferences.display_theme === theme.value
                      ? 'border-primary bg-primary/5'
                      : 'border-border hover:border-primary/50'
                    }
                    ${isUpdating === 'display_theme' ? 'opacity-50' : ''}
                  `}
                >
                  <p className="font-medium text-sm">{theme.label}</p>
                  <p className="text-xs text-muted-foreground mt-1">{theme.description}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Font Size */}
          <div className="space-y-3">
            <Label className="text-base font-medium">Font Size</Label>
            <div className="grid grid-cols-3 gap-3">
              {fontSizes.map((size) => (
                <div
                  key={size.value}
                  onClick={() => updatePreference('display_font_size', size.value)}
                  className={`
                    p-3 rounded-lg border-2 cursor-pointer transition-all text-center
                    ${preferences.display_font_size === size.value
                      ? 'border-primary bg-primary/5'
                      : 'border-border hover:border-primary/50'
                    }
                    ${isUpdating === 'display_font_size' ? 'opacity-50' : ''}
                  `}
                >
                  <p className="font-medium text-sm">{size.label}</p>
                  <p className="text-xs text-muted-foreground mt-1">{size.description}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Accessibility Toggles */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label className="text-base">High Contrast Mode</Label>
                <p className="text-sm text-muted-foreground">
                  Increase contrast for better readability
                </p>
              </div>
              <Switch
                checked={preferences.display_high_contrast}
                onCheckedChange={(checked) => updatePreference('display_high_contrast', checked)}
                disabled={isUpdating === 'display_high_contrast'}
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label className="text-base">Reduce Motion</Label>
                <p className="text-sm text-muted-foreground">
                  Minimize animations for accessibility
                </p>
              </div>
              <Switch
                checked={preferences.display_reduce_motion}
                onCheckedChange={(checked) => updatePreference('display_reduce_motion', checked)}
                disabled={isUpdating === 'display_reduce_motion'}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Motivation & Gamification */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Trophy className="h-5 w-5 text-yellow-600" />
            Motivation & Gamification
          </CardTitle>
          <CardDescription>
            Control your learning motivation and game-like features
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label className="text-base">XP & Level-Up Notifications</Label>
              <p className="text-sm text-muted-foreground">
                Show notifications when you earn XP and level up
              </p>
            </div>
            <Switch
              checked={preferences.gamification_xp_notify}
              onCheckedChange={(checked) => updatePreference('gamification_xp_notify', checked)}
              disabled={isUpdating === 'gamification_xp_notify'}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label className="text-base">Leaderboard Visibility</Label>
              <p className="text-sm text-muted-foreground">
                Show your progress on public leaderboards
              </p>
            </div>
            <Switch
              checked={preferences.gamification_leaderboard_enabled}
              onCheckedChange={(checked) => updatePreference('gamification_leaderboard_enabled', checked)}
              disabled={isUpdating === 'gamification_leaderboard_enabled'}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label className="text-base">Focus Mode</Label>
              <p className="text-sm text-muted-foreground">
                Hide all gamification elements for distraction-free study
              </p>
            </div>
            <Switch
              checked={preferences.gamification_focus_mode}
              onCheckedChange={(checked) => updatePreference('gamification_focus_mode', checked)}
              disabled={isUpdating === 'gamification_focus_mode'}
            />
          </div>

          {preferences.gamification_focus_mode && (
            <div className="p-4 bg-yellow-500/10 border border-yellow-500/20 rounded-lg">
              <p className="text-sm text-muted-foreground">
                <strong>Focus Mode Active:</strong> XP bars, badges, and other gamification elements are hidden.
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
