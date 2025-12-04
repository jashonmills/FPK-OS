import React from 'react';
import { Volume2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useTextToSpeech } from '@/hooks/useTextToSpeech';
import { useVoiceSettings } from '@/contexts/VoiceSettingsContext';

interface Lesson {
  id: number;
  title: string;
  description: string;
}

interface StandardLessonAudioButtonsProps {
  lessons: Lesson[];
  className?: string;
}

export const StandardLessonAudioButtons: React.FC<StandardLessonAudioButtonsProps> = ({
  lessons,
  className = ""
}) => {
  const { speak, stop, isSpeaking } = useTextToSpeech();
  const { settings } = useVoiceSettings();

  const handlePlayLesson = (lesson: Lesson) => {
    if (isSpeaking) {
      stop();
    }
    
    const lessonText = `Lesson ${lesson.id}: ${lesson.title}. ${lesson.description}`;
    speak(lessonText, { interrupt: true });
  };

  return (
    <div className={`course-glass-tile rounded-xl p-6 ${className}`}>
      <div className="text-center mb-4">
        <h3 className="course-hero-text font-semibold text-lg mb-2">
          Or listen to individual lesson descriptions:
        </h3>
        <p className="course-hero-text text-sm">
          Click any lesson below to hear its description
        </p>
      </div>
      
      <div className="flex flex-wrap gap-3 justify-center">
        {lessons.map((lesson) => (
          <Button
            key={lesson.id}
            onClick={() => handlePlayLesson(lesson)}
            disabled={!settings.hasInteracted}
            variant="outline"
            size="sm"
            className="bg-white/10 border-white/20 text-white hover:bg-white/20 rounded-full transition-all duration-200 disabled:opacity-50"
          >
            <Volume2 className="w-4 h-4 mr-2" />
            Lesson {lesson.id}
          </Button>
        ))}
      </div>
      
      {!settings.hasInteracted && (
        <div className="mt-4 text-center">
          <span className="inline-block bg-yellow-500/20 text-yellow-200 px-3 py-1 rounded-full text-xs">
            Click anywhere first to enable audio
          </span>
        </div>
      )}
    </div>
  );
};