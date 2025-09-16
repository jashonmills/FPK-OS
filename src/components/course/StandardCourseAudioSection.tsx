import React from 'react';
import { Headphones, Play } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useTextToSpeech } from '@/hooks/useTextToSpeech';
import { useVoiceSettings } from '@/contexts/VoiceSettingsContext';

interface StandardCourseAudioSectionProps {
  courseTitle: string;
  courseDescription: string;
  className?: string;
}

export const StandardCourseAudioSection: React.FC<StandardCourseAudioSectionProps> = ({
  courseTitle,
  courseDescription,
  className = ""
}) => {
  const { speak, stop, isSpeaking } = useTextToSpeech();
  const { settings } = useVoiceSettings();

  const handlePlayOverview = () => {
    if (isSpeaking) {
      stop();
      return;
    }

    const overviewText = `${courseTitle}. ${courseDescription}`;
    speak(overviewText, { interrupt: true });
  };

  return (
    <div className={`bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl p-6 ${className}`}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="bg-white/20 rounded-full p-3">
            <Headphones className="w-6 h-6 text-white" />
          </div>
          <div>
            <h3 className="text-white font-semibold text-lg">Listen to Course Overview</h3>
            <p className="text-white/80 text-sm">
              Hear an audio summary of this course and its key learning objectives
            </p>
          </div>
        </div>
        
        <Button
          onClick={handlePlayOverview}
          className="bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 text-white px-6 py-3 rounded-full font-medium transition-all duration-200 shadow-lg hover:shadow-xl"
          disabled={!settings.hasInteracted}
        >
          <Play className="w-4 h-4 mr-2" />
          {isSpeaking ? 'Stop Overview' : 'Play Overview'}
        </Button>
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