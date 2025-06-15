
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Telescope, Calendar, ExternalLink, Loader2 } from 'lucide-react';
import { useNASAAPOD } from '@/hooks/useNASAAPOD';
import { format } from 'date-fns';

interface APODCardProps {
  onOpenGallery: () => void;
}

const APODCard: React.FC<APODCardProps> = ({ onOpenGallery }) => {
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
      <Card className="bg-gradient-to-br from-slate-800 to-blue-900 border-slate-700">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-blue-200">Today's Astronomy</CardTitle>
          <Telescope className="h-4 w-4 text-blue-400" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-white mb-2">
            Error
          </div>
          <p className="text-xs text-blue-200 mb-3">Unable to load image</p>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => refetch()}
            className="bg-blue-800 border-blue-600 text-white hover:bg-blue-700"
          >
            Retry
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-gradient-to-br from-slate-800 to-blue-900 border-slate-700 cursor-pointer hover:shadow-lg transition-shadow" onClick={onOpenGallery}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-blue-200">Today's Astronomy</CardTitle>
        <Telescope className="h-4 w-4 text-blue-400" />
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="flex flex-col items-center">
            <Loader2 className="h-8 w-8 text-blue-400 animate-spin mb-2" />
            <p className="text-xs text-blue-200">Loading...</p>
          </div>
        ) : apod ? (
          <>
            <div className="text-2xl font-bold text-white mb-1">
              {format(new Date(apod.date), 'MMM dd')}
            </div>
            <p className="text-xs text-blue-200 mb-2">
              {truncateText(apod.title)}
            </p>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1 text-blue-300">
                <span className="text-xs">NASA APOD</span>
              </div>
              <span className="text-xs text-blue-200">Learn More</span>
            </div>
          </>
        ) : (
          <div className="text-center">
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
