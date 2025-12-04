import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface YouTubeVideo {
  title: string;
  channel: string;
  url: string;
  views: string;
  description: string;
}

interface RedditPost {
  title: string;
  subreddit: string;
  url: string;
  score: number;
  numComments: number;
  selftext: string;
  topComments: string[];
}

interface TEDTalk {
  title: string;
  speaker: string;
  url: string;
  description: string;
}

interface SocialIntelligenceResult {
  youtubeResults: YouTubeVideo[];
  redditResults: RedditPost[];
  tedResults: TEDTalk[];
}

// Helper to extract YouTube search results
async function scrapeYouTube(topic: string): Promise<YouTubeVideo[]> {
  try {
    const searchQuery = encodeURIComponent(topic);
    const searchUrl = `https://www.youtube.com/results?search_query=${searchQuery}`;
    
    console.log(`📺 Searching YouTube for: ${topic}`);
    
    const response = await fetch(searchUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
      },
    });

    if (!response.ok) {
      throw new Error(`YouTube search failed: ${response.status}`);
    }

    const html = await response.text();
    
    // Extract video data from initial data JSON
    const ytInitialDataMatch = html.match(/var ytInitialData = ({.+?});/);
    if (!ytInitialDataMatch) {
      console.warn('Could not find YouTube initial data');
      return [];
    }

    const ytData = JSON.parse(ytInitialDataMatch[1]);
    const videoRenderers = ytData?.contents?.twoColumnSearchResultsRenderer
      ?.primaryContents?.sectionListRenderer?.contents?.[0]
      ?.itemSectionRenderer?.contents || [];

    const videos: YouTubeVideo[] = [];
    
    for (const item of videoRenderers.slice(0, 8)) {
      const video = item?.videoRenderer;
      if (!video) continue;

      videos.push({
        title: video.title?.runs?.[0]?.text || 'Unknown',
        channel: video.ownerText?.runs?.[0]?.text || 'Unknown',
        url: `https://www.youtube.com/watch?v=${video.videoId}`,
        views: video.viewCountText?.simpleText || '0 views',
        description: video.descriptionSnippet?.runs?.map((r: any) => r.text).join('') || '',
      });
    }

    console.log(`✅ Found ${videos.length} YouTube videos`);
    return videos;
  } catch (error) {
    console.error('YouTube scraping error:', error);
    return [];
  }
}

// Helper to scrape Reddit using .json endpoint
async function scrapeReddit(topic: string): Promise<RedditPost[]> {
  try {
    const subreddits = ['specialed', 'autism', 'ADHD', 'dyslexia', 'Parenting'];
    const searchQuery = encodeURIComponent(topic);
    const searchUrl = `https://www.reddit.com/r/${subreddits.join('+')}/search.json?q=${searchQuery}&sort=relevance&t=year&limit=10`;
    
    console.log(`🔍 Searching Reddit for: ${topic}`);
    
    const response = await fetch(searchUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; FPK-Social-Intelligence-Bot/1.0)',
      },
    });

    if (!response.ok) {
      throw new Error(`Reddit search failed: ${response.status}`);
    }

    const data = await response.json();
    const posts = data?.data?.children || [];

    const results: RedditPost[] = [];

    for (const post of posts.slice(0, 8)) {
      const postData = post.data;
      
      // Fetch top comments for this post
      const topComments: string[] = [];
      try {
        const commentsUrl = `https://www.reddit.com${postData.permalink}.json?limit=5&sort=top`;
        const commentsResponse = await fetch(commentsUrl, {
          headers: {
            'User-Agent': 'Mozilla/5.0 (compatible; FPK-Social-Intelligence-Bot/1.0)',
          },
        });

        if (commentsResponse.ok) {
          const commentsData = await commentsResponse.json();
          const comments = commentsData?.[1]?.data?.children || [];
          
          for (const comment of comments.slice(0, 3)) {
            const commentBody = comment?.data?.body;
            if (commentBody && commentBody.length > 20) {
              topComments.push(commentBody.substring(0, 300));
            }
          }
        }
        
        // Rate limit between comment fetches
        await new Promise(resolve => setTimeout(resolve, 500));
      } catch (err) {
        console.warn('Failed to fetch comments for post:', postData.id);
      }

      results.push({
        title: postData.title || 'Untitled',
        subreddit: postData.subreddit || 'Unknown',
        url: `https://www.reddit.com${postData.permalink}`,
        score: postData.score || 0,
        numComments: postData.num_comments || 0,
        selftext: postData.selftext?.substring(0, 500) || '',
        topComments,
      });
    }

    console.log(`✅ Found ${results.length} Reddit posts with comments`);
    return results;
  } catch (error) {
    console.error('Reddit scraping error:', error);
    return [];
  }
}

// Helper to scrape TED talks
async function scrapeTED(topic: string): Promise<TEDTalk[]> {
  try {
    const searchQuery = encodeURIComponent(topic);
    const searchUrl = `https://www.ted.com/search?q=${searchQuery}`;
    
    console.log(`🎤 Searching TED for: ${topic}`);
    
    const response = await fetch(searchUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
      },
    });

    if (!response.ok) {
      throw new Error(`TED search failed: ${response.status}`);
    }

    const html = await response.text();
    
    // Extract talk data from the page (simplified parsing)
    const talks: TEDTalk[] = [];
    const talkMatches = html.matchAll(/<div class="search__result"[\s\S]*?href="([^"]+)"[\s\S]*?<h3[^>]*>([^<]+)<\/h3>[\s\S]*?<h4[^>]*>([^<]+)<\/h4>[\s\S]*?<p[^>]*>([^<]+)<\/p>/g);
    
    for (const match of talkMatches) {
      talks.push({
        url: `https://www.ted.com${match[1]}`,
        title: match[2]?.trim() || 'Unknown',
        speaker: match[3]?.trim() || 'Unknown',
        description: match[4]?.trim() || '',
      });
      
      if (talks.length >= 5) break;
    }

    console.log(`✅ Found ${talks.length} TED talks`);
    return talks;
  } catch (error) {
    console.error('TED scraping error:', error);
    return [];
  }
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const { topic } = await req.json();
    
    if (!topic) {
      throw new Error('Topic is required');
    }

    console.log(`🚀 Gathering social intelligence for topic: ${topic}`);

    // Scrape all platforms in parallel for speed
    const [youtubeResults, redditResults, tedResults] = await Promise.all([
      scrapeYouTube(topic),
      scrapeReddit(topic),
      scrapeTED(topic),
    ]);

    const result: SocialIntelligenceResult = {
      youtubeResults,
      redditResults,
      tedResults,
    };

    console.log(`✅ Social intelligence gathered successfully`);
    console.log(`   YouTube: ${youtubeResults.length} videos`);
    console.log(`   Reddit: ${redditResults.length} posts`);
    console.log(`   TED: ${tedResults.length} talks`);

    return new Response(
      JSON.stringify(result),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    );
  } catch (error) {
    console.error('Error in fetch-open-source-intelligence:', error);
    return new Response(
      JSON.stringify({ 
        error: error.message,
        youtubeResults: [],
        redditResults: [],
        tedResults: [],
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      }
    );
  }
});