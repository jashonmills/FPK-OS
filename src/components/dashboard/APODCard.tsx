
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Telescope, Calendar, ExternalLink, Loader2 } from 'lucide-react';
import { useNASAAPOD } from '@/hooks/useNASAAPOD';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';

interface APODCardProps {
  onOpenGallery: () => void;
  className?: string;
}

const APODCard: React.FC<APODCardProps> = ({ onOpenGallery, className }) => {
  const { data: apod, isLoading, error, refetch } = useNASAAPOD();

  const truncateText = (text: string, maxLength: number = 60): string => {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength).trim() + '…';
  };

  const getImageUrl = (apod: any): string => {
    if (apod.media_type === 'video' && apod.thumbnail_url) {
      return apod.thumbnail_url;
    }
    return apod.url;
  };

  if (error) {
    return (
      <Card className={cn("bg-gradient-to-br from-slate-800 to-blue-900 border-slate-700 h-full flex flex-col", className)}>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-blue-200">Today's Astronomy</CardTitle>
          <Telescope className="h-4 w-4 text-blue-400" />
        </CardHeader>
        <CardContent className="flex-1 flex flex-col justify-center">
          <div className="text-center py-8">
            <Telescope className="h-12 w-12 text-blue-400 mx-auto mb-4" />
            <div className="text-2xl font-bold text-white mb-2">
              Error
            </div>
            <p className="text-xs text-blue-200 mb-4">Unable to load image</p>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => refetch()}
              className="bg-blue-800 border-blue-600 text-white hover:bg-blue-700"
            >
              Retry
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={cn("bg-gradient-to-br from-slate-800 to-blue-900 border-slate-700 cursor-pointer hover:shadow-lg transition-shadow h-full flex flex-col", className)} onClick={onOpenGallery}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-blue-200">Today's Astronomy</CardTitle>
        <Telescope className="h-4 w-4 text-blue-400" />
      </CardHeader>
      <CardContent className="flex-1 flex flex-col justify-center">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center flex-1">
            <Loader2 className="h-8 w-8 text-blue-400 animate-spin mb-2" />
            <p className="text-xs text-blue-200">Loading...</p>
          </div>
        ) : apod ? (
          <div className="flex flex-col justify-center flex-1">
            <div className="text-2xl font-bold text-white mb-1">
              {format(new Date(apod.date), 'MMM dd')}
            </div>
            <p className="text-xs text-blue-200 mb-2">
              {truncateText(apod.title)}
            </p>
            <div className="flex items-center justify-between mt-auto">
              <div className="flex items-center gap-1 text-blue-300">
                <span className="text-xs">NASA APOD</span>
              </div>
              <span className="text-xs text-blue-200">Learn More</span>
            </div>
          </div>
        ) : (
          <div className="text-center flex-1 flex flex-col justify-center">
            <div className="text-2xl font-bold text-white mb-2">
              --
            </div>
            <p className="text-xs text-blue-200">No data available</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default APODCard;
