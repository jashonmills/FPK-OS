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

  const testVoice = (voiceName?: string) => {
    const testText = "Hello! This is how I sound when reading your AI responses.";
    
    if (voiceName) {
      // Temporarily test a specific voice
      const voice = availableVoices.find(v => v.name === voiceName);
      if (voice) {
        speak(testText, { voice, interrupt: true });
      }
    } else {
      // Test current selected voice
      speak(testText, { interrupt: true });
    }
    
    toast({
      title: "Voice Preview",
      description: "Playing voice sample...",
    });
  };

  const handleVoiceChange = (voiceName: string) => {
    setSelectedVoice(voiceName);
    toast({
      title: "Voice Updated",
      description: `Switched to ${voiceName}`,
    });
  };

  const englishVoices = availableVoices.filter(voice => 
    voice.lang.startsWith('en')
  );

  const femaleVoices = englishVoices.filter(voice => {
    const name = voice.name.toLowerCase();
    const femaleNames = ['zira', 'hazel', 'karen', 'samantha', 'victoria', 'susan', 'allison', 'kate', 'serena', 'tessa', 'moira', 'fiona', 'ava', 'emma', 'joanna', 'kendra', 'kimberly', 'salli', 'nicole', 'amy'];
    return femaleNames.some(femaleName => name.includes(femaleName));
  });

  const maleVoices = englishVoices.filter(voice => {
    const name = voice.name.toLowerCase();
    const maleNames = ['david', 'mark', 'daniel', 'alex', 'thomas', 'james', 'kevin', 'ryan'];
    return maleNames.some(maleName => name.includes(maleName));
  });

  const otherVoices = englishVoices.filter(voice => 
    !femaleVoices.includes(voice) && !maleVoices.includes(voice)
  );

  return (
    <Card className="w-full">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center justify-between text-lg">
          <div className="flex items-center gap-2">
            <Volume2 className="h-5 w-5" />
            Voice Settings
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
              className="h-8 w-8"
            >
              <Settings className="h-4 w-4" />
            </Button>
          </div>
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Quick Status */}
        <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
          <div className="flex items-center gap-2">
            {settings.enabled ? (
              <Volume2 className="h-4 w-4 text-green-500" />
            ) : (
              <VolumeX className="h-4 w-4 text-muted-foreground" />
            )}
            <span className="text-sm font-medium">
              {settings.enabled ? 'Voice Active' : 'Voice Disabled'}
            </span>
          </div>
          {settings.selectedVoice && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => testVoice()}
              className="h-7 text-xs"
            >
              <Play className="h-3 w-3 mr-1" />
              Test
            </Button>
          )}
        </div>

        {/* Current Voice Display */}
        {settings.selectedVoice && (
          <div className="text-sm text-muted-foreground">
            Current voice: <span className="font-medium text-foreground">{settings.selectedVoice}</span>
          </div>
        )}

        {/* Auto-read Setting */}
        <div className="flex items-center justify-between">
          <Label htmlFor="auto-read" className="text-sm font-medium">
            Auto-read AI responses
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
                  <Label className="text-xs text-muted-foreground mb-2 block">Female Voices (Recommended)</Label>
                  <Select value={settings.selectedVoice || ''} onValueChange={handleVoiceChange}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Choose a female voice..." />
                    </SelectTrigger>
                    <SelectContent>
                      {femaleVoices.map((voice) => (
                        <SelectItem key={voice.name} value={voice.name}>
                          <div className="flex items-center justify-between w-full">
                            <span>{voice.name}</span>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={(e) => {
                                e.stopPropagation();
                                testVoice(voice.name);
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
                  <Label className="text-xs text-muted-foreground mb-2 block">Male Voices</Label>
                  <Select value={settings.selectedVoice || ''} onValueChange={handleVoiceChange}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Choose a male voice..." />
                    </SelectTrigger>
                    <SelectContent>
                      {maleVoices.map((voice) => (
                        <SelectItem key={voice.name} value={voice.name}>
                          <div className="flex items-center justify-between w-full">
                            <span>{voice.name}</span>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={(e) => {
                                e.stopPropagation();
                                testVoice(voice.name);
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

              {/* Other Voices */}
              {otherVoices.length > 0 && (
                <div>
                  <Label className="text-xs text-muted-foreground mb-2 block">Other English Voices</Label>
                  <Select value={settings.selectedVoice || ''} onValueChange={handleVoiceChange}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Choose another voice..." />
                    </SelectTrigger>
                    <SelectContent>
                      {otherVoices.map((voice) => (
                        <SelectItem key={voice.name} value={voice.name}>
                          <div className="flex items-center justify-between w-full">
                            <span>{voice.name}</span>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={(e) => {
                                e.stopPropagation();
                                testVoice(voice.name);
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

        {/* Voice Count Info */}
        <div className="text-xs text-muted-foreground text-center pt-2 border-t">
          {englishVoices.length} English voices available
          {femaleVoices.length > 0 && ` • ${femaleVoices.length} female`}
          {maleVoices.length > 0 && ` • ${maleVoices.length} male`}
        </div>
      </CardContent>
    </Card>
  );
};

export default VoiceSettingsCard;
