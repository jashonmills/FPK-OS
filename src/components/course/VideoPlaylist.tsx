import React from 'react';
import VideoPlaylistTile from './VideoPlaylistTile';

interface VideoPlaylistProps {
  currentMainVideoUrl: string;
  onVideoSelect: (videoUrl: string, title: string) => void;
}

const VideoPlaylist: React.FC<VideoPlaylistProps> = ({
  currentMainVideoUrl,
  onVideoSelect
}) => {
  const videos = [
    {
      url: 'https://zgcegkmqfgznbpdplscz.supabase.co/storage/v1/object/public/course-files/el-courses/module%200.v2.mp4',
      title: 'V0: Module 0 - Introduction'
    },
    {
      url: 'https://zgcegkmqfgznbpdplscz.supabase.co/storage/v1/object/public/course-files/el-courses/mod1.mp4',
      title: 'V1: Module 1 - Foundations'
    },
    {
      url: 'https://zgcegkmqfgznbpdplscz.supabase.co/storage/v1/object/public/course-files/el-courses/mod2.mp4',
      title: 'V2: Module 2 - Applications'
    }
  ];

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold text-white drop-shadow-lg bg-black/20 backdrop-blur-sm rounded-lg p-3 text-center">
        Course Video Modules
      </h2>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {videos.map((video, index) => (
          <VideoPlaylistTile
            key={index}
            videoUrl={video.url}
            title={video.title}
            onExpand={() => onVideoSelect(video.url, video.title)}
            isCurrentMain={currentMainVideoUrl === video.url}
          />
        ))}
      </div>
    </div>
  );
};

export default VideoPlaylist;