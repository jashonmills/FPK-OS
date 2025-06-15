
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Telescope, Calendar, ExternalLink, Loader2 } from 'lucide-react';
import { useNASAAPOD } from '@/hooks/useNASAAPOD';
import { format } from 'date-fns';

interface APODCardProps {
  onOpenGallery: () => void;
}

const APODCard: React.FC<APODCardProps> = ({ onOpenGallery }) => {
  const { data: apod, isLoading, error, refetch } = useNASAAPOD();

  const truncateText = (text: string, maxLength: number = 100): string => {
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
      <Card className="w-full h-48 bg-gradient-to-br from-slate-900 to-blue-900 text-white border-0 shadow-lg hover:shadow-xl transition-all duration-300">
        <CardContent className="p-4 h-full flex flex-col justify-center items-center text-center">
          <Telescope className="h-8 w-8 text-blue-300 mb-2" />
          <h3 className="font-semibold text-sm mb-2">Unable to load today's astronomy image</h3>
          <p className="text-xs text-blue-200 mb-3">Please check your connection and try again</p>
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
    <Card className="w-full h-48 bg-gradient-to-br from-slate-900 to-blue-900 text-white border-0 shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300 cursor-pointer group">
      <CardContent className="p-0 h-full relative overflow-hidden rounded-lg">
        {isLoading ? (
          <div className="h-full flex flex-col justify-center items-center">
            <Loader2 className="h-8 w-8 text-blue-300 animate-spin mb-2" />
            <p className="text-sm text-blue-200">Loading today's astronomy image...</p>
          </div>
        ) : apod ? (
          <div className="h-full flex flex-col" onClick={onOpenGallery}>
            <div className="flex-1 relative overflow-hidden">
              <img
                src={getImageUrl(apod)}
                alt={apod.title}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.src = 'https://images.unsplash.com/photo-1470813740244-df37b8c1edcb?w=400&h=300&fit=crop';
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
              
              {apod.media_type === 'video' && (
                <div className="absolute top-2 right-2 bg-black/50 rounded-full p-1">
                  <ExternalLink className="h-3 w-3 text-white" />
                </div>
              )}
            </div>

            <div className="p-3 bg-gradient-to-t from-slate-900 to-transparent">
              <div className="flex items-center gap-1 text-blue-300 text-xs mb-1">
                <Calendar className="h-3 w-3" />
                <span>{format(new Date(apod.date), 'MMM dd, yyyy')}</span>
              </div>
              
              <h3 className="font-bold text-sm mb-1 line-clamp-1 group-hover:text-blue-200 transition-colors">
                {apod.title}
              </h3>
              
              <p className="text-xs text-gray-300 line-clamp-2 leading-relaxed">
                {truncateText(apod.explanation)}
              </p>

              <div className="flex items-center justify-between mt-2">
                <div className="flex items-center gap-1 text-blue-300">
                  <Telescope className="h-3 w-3" />
                  <span className="text-xs font-medium">NASA APOD</span>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-xs text-blue-200 hover:text-white hover:bg-blue-800/50 h-6 px-2"
                >
                  Learn More
                </Button>
              </div>
            </div>
          </div>
        ) : (
          <div className="h-full flex flex-col justify-center items-center text-center p-4">
            <Telescope className="h-8 w-8 text-blue-300 mb-2" />
            <h3 className="font-semibold text-sm mb-1">Discover Today's Astronomy</h3>
            <p className="text-xs text-blue-200">Loading NASA's daily space image...</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default APODCard;
