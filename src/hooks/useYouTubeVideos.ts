import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

interface YouTubeVideo {
  videoId: string;
  title: string;
  thumbnailUrl: string;
  publishedAt: string;
  embedUrl: string;
}

interface YouTubeVideosResponse {
  videos: YouTubeVideo[];
  totalCount: number;
  fetchedAt: string;
}

export function useYouTubeVideos(channelId: string, maxResults = 12) {
  return useQuery({
    queryKey: ['youtube-videos', channelId, maxResults],
    queryFn: async () => {
      const { data, error } = await supabase.functions.invoke<YouTubeVideosResponse>(
        'get-youtube-live-videos',
        {
          body: { channelId, maxResults }
        }
      );
      
      if (error) {
        console.error('Error fetching YouTube videos:', error);
        return { videos: [], totalCount: 0, fetchedAt: new Date().toISOString() };
      }
      
      return data || { videos: [], totalCount: 0, fetchedAt: new Date().toISOString() };
    },
    staleTime: 1000 * 60 * 60, // 1 hour
    gcTime: 1000 * 60 * 120, // 2 hours (renamed from cacheTime in v5)
    retry: 2,
  });
}
