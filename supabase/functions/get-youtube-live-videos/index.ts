import { corsHeaders } from '../_shared/cors.ts';

interface YouTubeVideo {
  videoId: string;
  title: string;
  thumbnailUrl: string;
  publishedAt: string;
  embedUrl: string;
}

Deno.serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { channelId, maxResults = 12 } = await req.json();

    if (!channelId) {
      return new Response(
        JSON.stringify({ error: 'Channel ID is required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Fetch YouTube RSS feed
    const rssUrl = `https://www.youtube.com/feeds/videos.xml?channel_id=${channelId}`;
    const response = await fetch(rssUrl);
    
    if (!response.ok) {
      throw new Error(`Failed to fetch YouTube feed: ${response.statusText}`);
    }

    const xmlText = await response.text();
    
    // Parse XML to extract video data
    const videos: YouTubeVideo[] = [];
    const entryRegex = /<entry>([\s\S]*?)<\/entry>/g;
    const matches = xmlText.matchAll(entryRegex);

    for (const match of matches) {
      if (videos.length >= maxResults) break;
      
      const entryContent = match[1];
      
      // Extract video ID
      const videoIdMatch = entryContent.match(/<yt:videoId>(.*?)<\/yt:videoId>/);
      const videoId = videoIdMatch ? videoIdMatch[1] : null;
      
      // Extract title
      const titleMatch = entryContent.match(/<title>(.*?)<\/title>/);
      const title = titleMatch ? titleMatch[1].replace(/<!\[CDATA\[(.*?)\]\]>/g, '$1') : '';
      
      // Extract published date
      const publishedMatch = entryContent.match(/<published>(.*?)<\/published>/);
      const publishedAt = publishedMatch ? formatRelativeTime(new Date(publishedMatch[1])) : '';
      
      if (videoId && title) {
        videos.push({
          videoId,
          title,
          thumbnailUrl: `https://i.ytimg.com/vi/${videoId}/maxresdefault.jpg`,
          publishedAt,
          embedUrl: `https://www.youtube.com/embed/${videoId}`
        });
      }
    }

    return new Response(
      JSON.stringify({
        videos,
        totalCount: videos.length,
        fetchedAt: new Date().toISOString()
      }),
      { 
        status: 200, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );

  } catch (error) {
    console.error('Error fetching YouTube videos:', error);
    return new Response(
      JSON.stringify({ 
        error: 'Failed to fetch YouTube videos',
        videos: [],
        totalCount: 0,
        fetchedAt: new Date().toISOString()
      }),
      { 
        status: 200, // Return 200 with empty array instead of error
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});

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
