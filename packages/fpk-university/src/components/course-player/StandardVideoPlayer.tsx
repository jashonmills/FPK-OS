/**
 * Standard Video Player Component
 * 
 * Universal video rendering component for the Lesson Engine.
 * Ensures consistent video presentation across all courses.
 */

import React from 'react';
import MediaPlayer from '@/components/course/MediaPlayer';
import { VideoContent } from '@/types/lessonContent';

interface StandardVideoPlayerProps {
  video: VideoContent;
  courseId: string;
  lessonId: number;
}

export const StandardVideoPlayer: React.FC<StandardVideoPlayerProps> = ({ 
  video, 
  courseId, 
  lessonId 
}) => {
  return (
    <div className="w-full mb-6">
      <MediaPlayer
        src={video.url}
        type="video"
        title={video.title || `Lesson ${lessonId} Video`}
        mediaId={`${courseId}-lesson-${lessonId}-video`}
        courseId={courseId}
        moduleId={lessonId.toString()}
      />
    </div>
  );
};
