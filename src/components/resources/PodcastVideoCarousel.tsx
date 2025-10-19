import { useState } from 'react';
import { useYouTubeVideos } from '@/hooks/useYouTubeVideos';
import { YouTubeVideoModal } from './YouTubeVideoModal';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel';
import { Skeleton } from '@/components/ui/skeleton';
import { PlayCircle } from 'lucide-react';

interface PodcastVideoCarouselProps {
  channelId: string;
}

export function PodcastVideoCarousel({ channelId }: PodcastVideoCarouselProps) {
  const { data, isLoading, error } = useYouTubeVideos(channelId);
  const [selectedVideoId, setSelectedVideoId] = useState<string | null>(null);
  const [selectedVideoTitle, setSelectedVideoTitle] = useState<string>('');

  const handleVideoClick = (videoId: string, title: string) => {
    setSelectedVideoId(videoId);
    setSelectedVideoTitle(title);
  };

  const handleCloseModal = () => {
    setSelectedVideoId(null);
    setSelectedVideoTitle('');
  };

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="space-y-3">
            <Skeleton className="aspect-video w-full rounded-lg" />
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-3 w-1/2" />
          </div>
        ))}
      </div>
    );
  }

  if (error || !data?.videos || data.videos.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        <p>No videos available at the moment</p>
      </div>
    );
  }

  return (
    <>
      <Carousel
        opts={{
          align: 'start',
          loop: false,
        }}
        className="w-full"
      >
        <CarouselContent className="-ml-4">
          {data.videos.map((video) => (
            <CarouselItem key={video.videoId} className="pl-4 md:basis-1/2 lg:basis-1/3">
              <div
                className="group cursor-pointer space-y-3"
                onClick={() => handleVideoClick(video.videoId, video.title)}
              >
                <div className="relative aspect-video w-full overflow-hidden rounded-lg bg-muted">
                  <img
                    src={video.thumbnailUrl}
                    alt={video.title}
                    className="h-full w-full object-cover transition-transform group-hover:scale-105"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 flex items-center justify-center bg-black/20 transition-opacity group-hover:bg-black/30">
                    <div className="rounded-full bg-red-600 p-3 transition-transform group-hover:scale-110">
                      <PlayCircle className="h-8 w-8 text-white fill-current" />
                    </div>
                  </div>
                </div>
                <div className="space-y-1">
                  <h3 className="line-clamp-2 font-medium leading-tight group-hover:text-fpk-orange transition-colors">
                    {video.title}
                  </h3>
                  <p className="text-sm text-muted-foreground">{video.publishedAt}</p>
                </div>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious className="hidden md:flex" />
        <CarouselNext className="hidden md:flex" />
      </Carousel>

      <YouTubeVideoModal
        videoId={selectedVideoId}
        title={selectedVideoTitle}
        onClose={handleCloseModal}
      />
    </>
  );
}
