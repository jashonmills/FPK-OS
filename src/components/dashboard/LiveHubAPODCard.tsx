
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

  const truncateText = (text: string, maxLength: number = 80): string => {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength).trim() + '…';
  };

  const handleLearnMore = () => {
    trackClick();
    onLearnMore();
  };

  if (error) {
    return (
      <Card ref={elementRef} className="bg-gradient-to-br from-slate-800 to-blue-900 border-slate-700 h-80">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
          <CardTitle className="text-base font-medium text-blue-200">Today's Astronomy</CardTitle>
          <Telescope className="h-5 w-5 text-blue-400" />
        </CardHeader>
        <CardContent className="flex items-center justify-center flex-1">
          <div className="text-center">
            <RotateCcw className="h-12 w-12 text-blue-400 mx-auto mb-3" />
            <div className="text-xl font-bold text-white mb-2">
              Unable to Load
            </div>
            <p className="text-sm text-blue-200 mb-4">Failed to fetch astronomy content</p>
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
    <Card ref={elementRef} className="bg-gradient-to-br from-slate-800 to-blue-900 border-slate-700 h-80 flex flex-col">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3 flex-shrink-0">
        <CardTitle className="text-base font-medium text-blue-200">Today's Astronomy</CardTitle>
        <Telescope className="h-5 w-5 text-blue-400" />
      </CardHeader>
      <CardContent className="flex flex-col flex-1 min-h-0 p-4">
        {isLoading ? (
          <div className="space-y-3 flex-1">
            <Skeleton className="h-28 w-full rounded-lg bg-slate-700" />
            <Skeleton className="h-4 w-3/4 bg-slate-700" />
            <Skeleton className="h-4 w-1/2 bg-slate-700" />
            <Skeleton className="h-8 w-full bg-slate-700" />
          </div>
        ) : apod ? (
          <div className="flex flex-col h-full space-y-3">
            {/* Main Image Container - Fixed height to prevent overflow */}
            <div className="relative overflow-hidden rounded-lg h-24 flex-shrink-0">
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
              <div className="absolute bottom-2 left-3 right-3">
                <div className="text-sm font-bold text-white">
                  {format(new Date(apod.date), 'MMM dd')}
                </div>
              </div>
            </div>

            {/* Content Section - Flexible height */}
            <div className="flex-1 min-h-0 space-y-2">
              <h3 className="text-sm font-semibold text-white line-clamp-2">
                {apod.title}
              </h3>
              <p className="text-xs text-blue-200 line-clamp-2">
                {truncateText(apod.explanation)}
              </p>
            </div>

            {/* Learn More Button - Fixed at bottom */}
            <div className="flex-shrink-0 mt-3">
              <Button 
                onClick={handleLearnMore}
                size="default"
                className="w-full bg-blue-600 hover:bg-blue-700 text-white border-0 fpk-gradient"
              >
                Learn More
              </Button>
            </div>

            {/* Attribution - Bottom */}
            <div className="flex items-center justify-between text-xs text-blue-300 pt-1 flex-shrink-0">
              <span>NASA APOD</span>
              <span>{apod.media_type === 'video' ? 'Video' : 'Image'}</span>
            </div>
          </div>
        ) : (
          <div className="text-center flex-1 flex flex-col items-center justify-center">
            <Telescope className="h-12 w-12 text-blue-400 mx-auto mb-3" />
            <div className="text-lg font-semibold text-white mb-2">
              No Content Available
            </div>
            <p className="text-sm text-blue-200">Check back later for today's astronomy picture</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default LiveHubAPODCard;
