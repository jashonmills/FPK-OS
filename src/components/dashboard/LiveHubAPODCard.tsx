
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Telescope, RotateCcw } from 'lucide-react';
import { useNASAAPOD } from '@/hooks/useNASAAPOD';
import { useViewportAnalytics } from '@/hooks/useViewportAnalytics';
import { format } from 'date-fns';

interface LiveHubAPODCardProps {
  onLearnMore: () => void;
}

const LiveHubAPODCard: React.FC<LiveHubAPODCardProps> = ({ onLearnMore }) => {
  const { data: apod, isLoading, error, refetch } = useNASAAPOD();
  const { elementRef, trackClick } = useViewportAnalytics('apod');

  const truncateText = (text: string, maxLength: number = 60): string => {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength).trim() + '…';
  };

  const handleLearnMore = () => {
    trackClick();
    onLearnMore();
  };

  if (error) {
    return (
      <Card ref={elementRef} className="bg-gradient-to-br from-slate-800 to-blue-900 border-slate-700 h-64">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-blue-200">Today's Astronomy</CardTitle>
          <Telescope className="h-4 w-4 text-blue-400" />
        </CardHeader>
        <CardContent className="h-48 flex items-center justify-center">
          <div className="text-center">
            <RotateCcw className="h-8 w-8 text-blue-400 mx-auto mb-2" />
            <div className="text-lg font-bold text-white mb-1">
              Unable to Load
            </div>
            <p className="text-xs text-blue-200 mb-3">Failed to fetch astronomy content</p>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => refetch()}
              className="bg-blue-600 border-blue-500 text-white hover:bg-blue-700"
            >
              <RotateCcw className="h-4 w-4 mr-2" />
              Retry
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card ref={elementRef} className="bg-gradient-to-br from-slate-800 to-blue-900 border-slate-700 h-64">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-blue-200">Today's Astronomy</CardTitle>
        <Telescope className="h-4 w-4 text-blue-400" />
      </CardHeader>
      <CardContent className="h-48 flex flex-col">
        {isLoading ? (
          <div className="space-y-2 flex-1">
            <Skeleton className="h-16 w-full rounded-lg bg-slate-700" />
            <Skeleton className="h-3 w-3/4 bg-slate-700" />
            <Skeleton className="h-3 w-1/2 bg-slate-700" />
            <Skeleton className="h-6 w-full bg-slate-700" />
          </div>
        ) : apod ? (
          <div className="space-y-2 h-full flex flex-col">
            {/* Compact Thumbnail */}
            <div className="relative overflow-hidden rounded-lg h-16 flex-shrink-0">
              <img
                src={apod.media_type === 'video' && apod.thumbnail_url ? apod.thumbnail_url : apod.url}
                alt={apod.title}
                className="w-full h-full object-cover"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.src = 'https://images.unsplash.com/photo-1470813740244-df37b8c1edcb?w=400&h=300&fit=crop';
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
              <div className="absolute bottom-1 left-2 right-2">
                <div className="text-sm font-bold text-white">
                  {format(new Date(apod.date), 'MMM dd')}
                </div>
              </div>
            </div>

            {/* Compact Content */}
            <div className="flex-1 min-h-0">
              <h3 className="text-sm font-semibold text-white mb-1 line-clamp-1">
                {apod.title}
              </h3>
              <p className="text-xs text-blue-200 mb-2 line-clamp-2">
                {truncateText(apod.explanation)}
              </p>
            </div>

            {/* Compact Button */}
            <Button 
              onClick={handleLearnMore}
              size="sm"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white border-0 h-8"
            >
              Learn More
            </Button>

            {/* Compact Attribution */}
            <div className="flex items-center justify-between text-xs text-blue-300">
              <span>NASA APOD</span>
              <span>{apod.media_type === 'video' ? 'Video' : 'Image'}</span>
            </div>
          </div>
        ) : (
          <div className="text-center py-4 flex-1 flex flex-col items-center justify-center">
            <Telescope className="h-8 w-8 text-blue-400 mx-auto mb-2" />
            <div className="text-sm font-semibold text-white mb-1">
              No Content Available
            </div>
            <p className="text-xs text-blue-200">Check back later for today's astronomy picture</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default LiveHubAPODCard;
