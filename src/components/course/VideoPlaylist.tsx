import React from 'react';
import VideoPlaylistTile from './VideoPlaylistTile';

interface VideoPlaylistProps {
  currentMainVideoUrl: string;
  onVideoSwap: (videoUrl: string, title: string) => void;
  videos: Array<{ url: string; title: string }>;
}

const VideoPlaylist: React.FC<VideoPlaylistProps> = ({
  currentMainVideoUrl,
  onVideoSwap,
  videos
}) => {

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
            onWatch={() => onVideoSwap(video.url, video.title)}
            isCurrentMain={currentMainVideoUrl === video.url}
          />
        ))}
      </div>
    </div>
  );
};

export default VideoPlaylist;