import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Share2, Calendar, Clock } from 'lucide-react';
import { toast } from 'sonner';
import { format } from 'date-fns';

import type { Database } from '@/integrations/supabase/types';

type PodcastEpisode = Database['public']['Tables']['podcast_episodes']['Row'];

export function PodcastGallery() {
  const [episodes, setEpisodes] = useState<PodcastEpisode[]>([]);
  const [loading, setLoading] = useState(true);
  const [playingId, setPlayingId] = useState<string | null>(null);

  useEffect(() => {
    loadEpisodes();
  }, []);

  async function loadEpisodes() {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from('podcast_episodes')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Database error:', error);
        throw error;
      }

      setEpisodes((data as PodcastEpisode[]) || []);
    } catch (error) {
      console.error('Error loading podcast episodes:', error);
      toast.error('Failed to load podcast episodes');
    } finally {
      setLoading(false);
    }
  }

  function handleShare(episode: PodcastEpisode) {
    const shareUrl = `${window.location.origin}/podcast/${episode.id}`;
    navigator.clipboard.writeText(shareUrl);
    toast.success('Share link copied to clipboard!');
  }

  function formatDuration(seconds: number | null): string {
    if (!seconds) return '0:00';
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-muted-foreground">Loading your podcast episodes...</div>
      </div>
    );
  }

  if (episodes.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Your Learning Moments Podcast</CardTitle>
          <CardDescription>
            When you have a breakthrough moment in your learning journey, we'll automatically create a special podcast episode celebrating your achievement!
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-muted-foreground">
            <p>No podcast episodes yet.</p>
            <p className="text-sm mt-2">Keep learning with our AI coaches - your first "Aha!" moment will be captured here!</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Your Learning Moments</h2>
        <p className="text-muted-foreground mt-1">
          {episodes.length} {episodes.length === 1 ? 'episode' : 'episodes'} celebrating your breakthroughs
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {episodes.map((episode) => (
          <Card key={episode.id} className="overflow-hidden hover:shadow-lg transition-shadow">
            <CardHeader className="bg-gradient-to-br from-primary/10 to-primary/5">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <CardTitle className="text-lg line-clamp-2">{episode.title}</CardTitle>
                  {episode.description && (
                    <CardDescription className="mt-2 line-clamp-2">
                      {episode.description}
                    </CardDescription>
                  )}
                </div>
              </div>
            </CardHeader>
            <CardContent className="pt-4">
              <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4">
                <div className="flex items-center gap-1">
                  <Calendar className="h-3 w-3" />
                  <span>{format(new Date(episode.created_at), 'MMM d, yyyy')}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  <span>{formatDuration(episode.duration_seconds)}</span>
                </div>
              </div>

              {episode.audio_url && (
                <audio
                  src={episode.audio_url}
                  controls
                  className="w-full mb-4"
                  onPlay={() => setPlayingId(episode.id)}
                  onPause={() => setPlayingId(null)}
                />
              )}

              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="flex-1"
                  onClick={() => handleShare(episode)}
                >
                  <Share2 className="h-4 w-4 mr-2" />
                  Share
                </Button>
              </div>

              {episode.tags && episode.tags.length > 0 && (
                <div className="mt-3 pt-3 border-t">
                  <div className="text-xs text-muted-foreground">
                    Tags: <span className="font-medium">
                      {episode.tags.join(', ')}
                    </span>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
