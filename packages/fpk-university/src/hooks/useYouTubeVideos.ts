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
      try {
        // 15 second timeout using Promise.race
        const fetchPromise = supabase.functions.invoke('get-youtube-live-videos', {
          body: { channelId, maxResults }
        });

        const timeoutPromise = new Promise((_, reject) => 
          setTimeout(() => reject(new Error('Request timeout')), 15000)
        );

        const { data, error } = await Promise.race([fetchPromise, timeoutPromise]) as any;

        if (error) {
          console.error('Error fetching YouTube videos:', error);
          return { videos: [], totalCount: 0, fetchedAt: new Date().toISOString() };
        }

        return data as YouTubeVideosResponse;
      } catch (error) {
        console.error('Error fetching YouTube videos:', error);
        return { videos: [], totalCount: 0, fetchedAt: new Date().toISOString() };
      }
    },
    staleTime: 1000 * 60 * 60, // 1 hour
    gcTime: 1000 * 60 * 120, // 2 hours
    retry: 1, // Reduced from 2 to 1 for faster failure
  });
}
