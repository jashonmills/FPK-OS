import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Volume2, VolumeX, Play, Pause, Square, Settings } from 'lucide-react';
import { useTextToSpeech } from '@/hooks/useTextToSpeech';
import { useVoiceSettings } from '@/contexts/VoiceSettingsContext';
import { extractReadableText, convertMathToSpeech, generateIntroText, generateOutroText } from '@/utils/courseTextExtractor';

interface LessonTTSControlsProps {
  lessonTitle: string;
  lessonNumber: number;
  totalLessons: number;
  contentRef: React.RefObject<HTMLElement>;
  className?: string;
}

const LessonTTSControls: React.FC<LessonTTSControlsProps> = ({
  lessonTitle,
  lessonNumber,
  totalLessons,
  contentRef,
  className = ""
}) => {
  const [isReading, setIsReading] = useState(false);
  const [currentSection, setCurrentSection] = useState<string>('');
  const { speak, stop, isSpeaking, isSupported } = useTextToSpeech();
  const { settings, isSupported: voiceSupported } = useVoiceSettings();
  const [showControls, setShowControls] = useState(false);

  const handleReadLesson = () => {
    if (!contentRef.current || !isSupported || !settings.hasInteracted) {
      console.warn('TTS not available');
      return;
    }

    if (isSpeaking) {
      stop();
      setIsReading(false);
      setCurrentSection('');
      return;
    }

    try {
      // Extract and prepare content for reading
      const content = extractReadableText(contentRef.current);
      const mathContent = convertMathToSpeech(content);
      const introText = generateIntroText(lessonTitle, lessonNumber, totalLessons);
      const outroText = generateOutroText(lessonTitle);
      
      let fullContent = `${introText} ${mathContent} ${outroText}`;
      
      // Limit content length to prevent stack overflow (max ~800 characters for TTS)
      if (fullContent.length > 800) {
        const truncatedContent = mathContent.substring(0, 500);
        fullContent = `${introText} ${truncatedContent}... This lesson continues with more detailed content. ${outroText}`;
      }

      console.log('🔊 Lesson TTS - Content length:', fullContent.length, 'Preview:', fullContent.substring(0, 100));

      setIsReading(true);
      setCurrentSection('Reading lesson content...');
      
      speak(fullContent, { interrupt: true }).then(success => {
        if (!success) {
          console.error('🔊 Lesson TTS failed');
          setIsReading(false);
          setCurrentSection('');
        }
      }).catch(error => {
        console.error('🔊 Lesson TTS error:', error);
        setIsReading(false);
        setCurrentSection('');
      });
    } catch (error) {
      console.error('🔊 Error in handleReadLesson:', error);
      setIsReading(false);
      setCurrentSection('');
    }
  };

  const handleReadSection = (sectionElement: HTMLElement, sectionTitle: string) => {
    if (!isSupported || !settings.hasInteracted) return;

    if (isSpeaking) {
      stop();
      return;
    }

    const content = extractReadableText(sectionElement);
    const mathContent = convertMathToSpeech(content);
    
    setCurrentSection(sectionTitle);
    speak(mathContent, { interrupt: true });
  };

  // Update reading state based on speech synthesis state
  useEffect(() => {
    if (!isSpeaking && isReading) {
      setIsReading(false);
      setCurrentSection('');
    }
  }, [isSpeaking, isReading]);

  if (!voiceSupported) {
    return null;
  }

  return (
    <Card className={`border-primary/20 ${className}`}>
      <CardContent className="p-4">
        {/* Main TTS Controls */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <Volume2 className="h-5 w-5 text-primary" />
              <span className="font-medium">Listen to Lesson</span>
            </div>
            {!settings.hasInteracted && (
              <Badge variant="outline" className="text-xs">
                Requires user interaction
              </Badge>
            )}
          </div>
          
          <div className="flex items-center gap-2">
            <Button
              variant={showControls ? "default" : "outline"}
              size="sm"
              onClick={() => setShowControls(!showControls)}
            >
              <Settings className="h-4 w-4" />
            </Button>
            
            <Button
              onClick={handleReadLesson}
              disabled={!settings.hasInteracted}
              variant={isSpeaking ? "destructive" : "default"}
              className={isSpeaking ? "" : "fpk-gradient text-white"}
            >
              {isSpeaking ? (
                <>
                  <Square className="h-4 w-4 mr-2" />
                  Stop Reading
                </>
              ) : (
                <>
                  <Play className="h-4 w-4 mr-2" />
                  Read Lesson
                </>
              )}
            </Button>
          </div>
        </div>

        {/* Reading Status */}
        {currentSection && (
          <div className="mt-3 p-2 bg-primary/10 rounded-lg">
            <div className="flex items-center gap-2">
              <div className="animate-pulse">
                <Volume2 className="h-4 w-4 text-primary" />
              </div>
              <span className="text-sm text-primary font-medium">
                {currentSection}
              </span>
            </div>
          </div>
        )}

        {/* Voice Settings Info */}
        {showControls && (
          <div className="mt-4 pt-4 border-t border-border">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
              <div className="text-center">
                <div className="text-muted-foreground">Rate</div>
                <div className="font-medium">{settings.rate}x</div>
              </div>
              <div className="text-center">
                <div className="text-muted-foreground">Pitch</div>
                <div className="font-medium">{settings.pitch}</div>
              </div>
              <div className="text-center">
                <div className="text-muted-foreground">Volume</div>
                <div className="font-medium">{Math.round(settings.volume * 100)}%</div>
              </div>
              <div className="text-center">
                <div className="text-muted-foreground">Voice</div>
                <div className="font-medium text-xs">
                  {settings.selectedVoice ? 'Custom' : 'Default'}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Usage Hint */}
        {!settings.hasInteracted && (
          <div className="mt-3 text-xs text-muted-foreground text-center">
            Click anywhere on the page first to enable text-to-speech
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default LessonTTSControls;