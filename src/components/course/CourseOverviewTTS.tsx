import React, { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Volume2, Play, Square, Headphones } from 'lucide-react';
import { useTextToSpeech } from '@/hooks/useTextToSpeech';
import { useVoiceSettings } from '@/contexts/VoiceSettingsContext';
import { convertMathToSpeech } from '@/utils/courseTextExtractor';

interface CourseOverviewTTSProps {
  courseTitle: string;
  courseDescription: string;
  lessons: Array<{
    id: number;
    title: string;
    description: string;
  }>;
  className?: string;
}

const CourseOverviewTTS: React.FC<CourseOverviewTTSProps> = ({
  courseTitle,
  courseDescription,
  lessons,
  className = ""
}) => {
  const [isReadingOverview, setIsReadingOverview] = useState(false);
  const { speak, stop, isSpeaking, isSupported } = useTextToSpeech();
  const { settings } = useVoiceSettings();

  const handleReadOverview = () => {
    if (!isSupported || !settings.hasInteracted) {
      console.warn('TTS not available');
      return;
    }

    if (isSpeaking) {
      stop();
      setIsReadingOverview(false);
      return;
    }

    // Generate concise overview content (avoid very long text)
    const overviewText = `
      Welcome to the ${courseTitle} course. 
      ${courseDescription}
      
      This course contains ${lessons.length} lessons covering topics like: ${lessons.slice(0, 3).map(lesson => lesson.title).join(', ')}${lessons.length > 3 ? ' and more' : ''}. 
      
      You can start with any unlocked lesson. Good luck with your learning journey!
    `;

    const mathContent = convertMathToSpeech(overviewText);
    
    // Ensure text isn't too long (max ~300 characters for TTS)
    const finalText = mathContent.length > 300 ? mathContent.substring(0, 297) + '...' : mathContent;
    
    console.log('🔊 Overview TTS - Text length:', finalText.length, 'Text preview:', finalText.substring(0, 100));
    
    setIsReadingOverview(true);
    
    speak(finalText, { interrupt: true }).then(success => {
      if (!success) {
        console.error('🔊 Overview TTS failed');
        setIsReadingOverview(false);
      }
    }).catch(error => {
      console.error('🔊 Overview TTS error:', error);
      setIsReadingOverview(false);
    });
  };

  const handleReadLesson = (lesson: { title: string; description: string }) => {
    if (!isSupported || !settings.hasInteracted) return;

    if (isSpeaking) {
      stop();
      return;
    }

    const lessonText = `${lesson.title}. ${lesson.description}`;
    const mathContent = convertMathToSpeech(lessonText);
    
    speak(mathContent, { interrupt: true });
  };

  // Update reading state
  React.useEffect(() => {
    if (!isSpeaking && isReadingOverview) {
      setIsReadingOverview(false);
    }
  }, [isSpeaking, isReadingOverview]);

  if (!isSupported) {
    return null;
  }

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Course Overview TTS */}
      <div className="flex items-center justify-center gap-4 p-4 bg-gradient-to-r from-primary/5 to-secondary/5 rounded-lg border border-primary/10">
        <div className="flex items-center gap-2">
          <Headphones className="h-5 w-5 text-primary" />
          <span className="font-medium">Listen to Course Overview</span>
        </div>
        
        {!settings.hasInteracted && (
          <Badge variant="outline" className="text-xs">
            Click anywhere first
          </Badge>
        )}
        
        <Button
          onClick={handleReadOverview}
          disabled={!settings.hasInteracted}
          variant={isSpeaking && isReadingOverview ? "destructive" : "default"}
          className={isSpeaking && isReadingOverview ? "" : "fpk-gradient text-white"}
        >
          {isSpeaking && isReadingOverview ? (
            <>
              <Square className="h-4 w-4 mr-2" />
              Stop
            </>
          ) : (
            <>
              <Play className="h-4 w-4 mr-2" />
              Play Overview
            </>
          )}
        </Button>
      </div>

      {/* Individual Lesson TTS Buttons */}
      <div className="text-center">
        <p className="text-sm text-muted-foreground mb-2">
          Or listen to individual lesson descriptions:
        </p>
        <div className="flex flex-wrap justify-center gap-2">
          {lessons.map((lesson) => (
            <Button
              key={lesson.id}
              variant="outline"
              size="sm"
              onClick={() => handleReadLesson(lesson)}
              disabled={!settings.hasInteracted}
              className="text-xs"
            >
              <Volume2 className="h-3 w-3 mr-1" />
              Lesson {lesson.id}
            </Button>
          ))}
        </div>
      </div>

      {/* Reading Status */}
      {isSpeaking && (
        <div className="text-center">
          <Badge variant="default" className="animate-pulse">
            <Volume2 className="h-3 w-3 mr-1" />
            {isReadingOverview ? 'Reading course overview...' : 'Reading lesson...'}
          </Badge>
        </div>
      )}
    </div>
  );
};

export default CourseOverviewTTS;