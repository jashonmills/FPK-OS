import { useQuery } from '@tanstack/react-query';

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

function formatRelativeTime(date: Date): string {
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  const diffWeeks = Math.floor(diffDays / 7);
  const diffMonths = Math.floor(diffDays / 30);
  
  if (diffDays === 0) return 'Today';
  if (diffDays === 1) return 'Yesterday';
  if (diffDays < 7) return `${diffDays} days ago`;
  if (diffWeeks === 1) return '1 week ago';
  if (diffWeeks < 4) return `${diffWeeks} weeks ago`;
  if (diffMonths === 1) return '1 month ago';
  if (diffMonths < 12) return `${diffMonths} months ago`;
  return date.toLocaleDateString();
}

export function useYouTubeVideos(channelId: string, maxResults = 12) {
  return useQuery({
    queryKey: ['youtube-videos', channelId, maxResults],
    queryFn: async () => {
      try {
        // Fetch YouTube RSS feed directly from client
        const rssUrl = `https://www.youtube.com/feeds/videos.xml?channel_id=${channelId}`;
        const response = await fetch(rssUrl);
        
        if (!response.ok) {
          throw new Error(`Failed to fetch YouTube feed: ${response.statusText}`);
        }

        const xmlText = await response.text();
        const parser = new DOMParser();
        const xmlDoc = parser.parseFromString(xmlText, 'text/xml');
        
        const entries = xmlDoc.querySelectorAll('entry');
        const videos: YouTubeVideo[] = [];

        entries.forEach((entry, index) => {
          if (index >= maxResults) return;
          
          const videoId = entry.querySelector('videoId')?.textContent;
          const title = entry.querySelector('title')?.textContent;
          const published = entry.querySelector('published')?.textContent;
          
          if (videoId && title) {
            videos.push({
              videoId,
              title,
              thumbnailUrl: `https://i.ytimg.com/vi/${videoId}/maxresdefault.jpg`,
              publishedAt: published ? formatRelativeTime(new Date(published)) : 'Recently',
              embedUrl: `https://www.youtube.com/embed/${videoId}`
            });
          }
        });

        return {
          videos,
          totalCount: videos.length,
          fetchedAt: new Date().toISOString()
        };
      } catch (error) {
        console.error('Error fetching YouTube videos:', error);
        return { videos: [], totalCount: 0, fetchedAt: new Date().toISOString() };
      }
    },
    staleTime: 1000 * 60 * 60, // 1 hour
    gcTime: 1000 * 60 * 120, // 2 hours
    retry: 2,
  });
}
