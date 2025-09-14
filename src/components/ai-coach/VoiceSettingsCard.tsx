import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Volume2, VolumeX, Play, Settings } from 'lucide-react';
import { useVoiceSettings } from '@/contexts/VoiceSettingsContext';
import { useTextToSpeech } from '@/hooks/useTextToSpeech';
import { useToast } from '@/hooks/use-toast';

const VoiceSettingsCard: React.FC = () => {
  const { settings, updateSettings, availableVoices, toggle, setSelectedVoice } = useVoiceSettings();
  const { speak } = useTextToSpeech();
  const { toast } = useToast();
  const [isExpanded, setIsExpanded] = useState(false);

  const testVoice = (voiceId?: string) => {
    const testText = "Hello! This is how I sound when reading your AI responses using ElevenLabs.";
    
    speak(testText, { 
      voice: voiceId || settings.selectedVoice || 'EXAVITQu4vr4xnSDxMaL',
      interrupt: true 
    });
    
    toast({
      title: "Voice Preview",
      description: "Playing ElevenLabs voice sample...",
    });
  };

  const handleVoiceChange = (voiceId: string) => {
    setSelectedVoice(voiceId);
    const voice = availableVoices.find(v => v.id === voiceId);
    toast({
      title: "Voice Updated",
      description: `Switched to ${voice?.name || voiceId}`,
    });
  };

  const femaleVoices = availableVoices.filter(voice => voice.gender === 'female');
  const maleVoices = availableVoices.filter(voice => voice.gender === 'male');

  return (
    <Card className="mobile-card w-full">
      <CardHeader className="mobile-card-compact">
        <CardTitle className="flex items-center justify-between mobile-heading-md">
          <div className="flex items-center gap-2">
            <Volume2 className="h-4 w-4 sm:h-5 sm:w-5" />
            <span className="hidden sm:inline">Voice Settings</span>
            <span className="sm:hidden">Voice</span>
          </div>
          <div className="flex items-center gap-2">
            <Switch
              checked={settings.enabled}
              onCheckedChange={toggle}
              className="data-[state=checked]:bg-green-500"
            />
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsExpanded(!isExpanded)}
              className="h-7 w-7 sm:h-8 sm:w-8"
            >
              <Settings className="h-3 w-3 sm:h-4 sm:w-4" />
            </Button>
          </div>
        </CardTitle>
      </CardHeader>

      <CardContent className="mobile-card-compact space-y-3">
        {/* Quick Status - Mobile Optimized */}
        <div className="flex items-center justify-between p-2 sm:p-3 bg-muted rounded-lg">
          <div className="flex items-center gap-2">
            {settings.enabled ? (
              <Volume2 className="h-4 w-4 text-green-500" />
            ) : (
              <VolumeX className="h-4 w-4 text-muted-foreground" />
            )}
            <span className="mobile-text-sm font-medium">
              {settings.enabled ? 'Active' : 'Disabled'}
            </span>
          </div>
          {settings.selectedVoice && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => testVoice()}
              className="h-6 mobile-text-xs px-2"
            >
              <Play className="h-3 w-3 mr-1" />
              Test
            </Button>
          )}
        </div>

        {/* Current Voice Display - Mobile Compact */}
        {settings.selectedVoice && (
          <div className="mobile-text-xs text-muted-foreground">
            Current: <span className="font-medium text-foreground">
              {availableVoices.find(v => v.id === settings.selectedVoice)?.name || 'ElevenLabs Voice'}
            </span>
          </div>
        )}

        {/* Auto-read Setting - Mobile Optimized */}
        <div className="flex items-center justify-between">
          <Label htmlFor="auto-read" className="mobile-text-sm font-medium">
            Auto-read responses
          </Label>
          <Switch
            id="auto-read"
            checked={settings.autoRead}
            onCheckedChange={(checked) => updateSettings({ autoRead: checked })}
            disabled={!settings.enabled}
          />
        </div>

        {/* Expanded Settings */}
        {isExpanded && (
          <>
            <Separator />
            
            {/* Voice Selection */}
            <div className="space-y-3">
              <Label className="text-sm font-medium">Select Voice</Label>
              
              {/* Female Voices */}
              {femaleVoices.length > 0 && (
                <div>
                  <Label className="text-xs text-muted-foreground mb-2 block">Female Voices (ElevenLabs)</Label>
                  <Select value={settings.selectedVoice || ''} onValueChange={handleVoiceChange}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Choose a female voice..." />
                    </SelectTrigger>
                    <SelectContent>
                      {femaleVoices.map((voice) => (
                        <SelectItem key={voice.id} value={voice.id}>
                          <div className="flex items-center justify-between w-full">
                            <span>{voice.name}</span>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={(e) => {
                                e.stopPropagation();
                                testVoice(voice.id);
                              }}
                              className="h-6 w-12 ml-2 text-xs"
                            >
                              <Play className="h-3 w-3" />
                            </Button>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}

              {/* Male Voices */}
              {maleVoices.length > 0 && (
                <div>
                  <Label className="text-xs text-muted-foreground mb-2 block">Male Voices (ElevenLabs)</Label>
                  <Select value={settings.selectedVoice || ''} onValueChange={handleVoiceChange}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Choose a male voice..." />
                    </SelectTrigger>
                    <SelectContent>
                      {maleVoices.map((voice) => (
                        <SelectItem key={voice.id} value={voice.id}>
                          <div className="flex items-center justify-between w-full">
                            <span>{voice.name}</span>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={(e) => {
                                e.stopPropagation();
                                testVoice(voice.id);
                              }}
                              className="h-6 w-12 ml-2 text-xs"
                            >
                              <Play className="h-3 w-3" />
                            </Button>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}
            </div>

            <Separator />

            {/* Voice Controls */}
            <div className="space-y-4">
              <div>
                <Label className="text-sm font-medium">Speed: {settings.rate.toFixed(1)}x</Label>
                <Slider
                  value={[settings.rate]}
                  onValueChange={([value]) => updateSettings({ rate: value })}
                  min={0.5}
                  max={2.0}
                  step={0.1}
                  className="mt-2"
                />
              </div>

              <div>
                <Label className="text-sm font-medium">Pitch: {settings.pitch.toFixed(1)}</Label>
                <Slider
                  value={[settings.pitch]}
                  onValueChange={([value]) => updateSettings({ pitch: value })}
                  min={0.5}
                  max={2.0}
                  step={0.1}
                  className="mt-2"
                />
              </div>

              <div>
                <Label className="text-sm font-medium">Volume: {Math.round(settings.volume * 100)}%</Label>
                <Slider
                  value={[settings.volume]}
                  onValueChange={([value]) => updateSettings({ volume: value })}
                  min={0}
                  max={1}
                  step={0.1}
                  className="mt-2"
                />
              </div>
            </div>
          </>
        )}

        {/* Voice Count Info - Mobile Compact */}
        <div className="mobile-text-xs text-muted-foreground text-center pt-2 border-t">
          {availableVoices.length} ElevenLabs voices
          {femaleVoices.length > 0 && (
            <span className="hidden sm:inline"> • {femaleVoices.length} female</span>
          )}
          {maleVoices.length > 0 && (
            <span className="hidden sm:inline"> • {maleVoices.length} male</span>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default VoiceSettingsCard;
