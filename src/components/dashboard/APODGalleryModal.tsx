
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  X, 
  ChevronLeft, 
  ChevronRight, 
  Calendar, 
  User, 
  Telescope,
  Loader2,
  RotateCcw,
  ExternalLink
} from 'lucide-react';
import { useNASARecentAPODs } from '@/hooks/useNASAAPOD';
import { format } from 'date-fns';
import { APODData } from '@/services/NASAService';

interface APODGalleryModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialDate?: string;
}

const APODGalleryModal: React.FC<APODGalleryModalProps> = ({ 
  isOpen, 
  onClose, 
  initialDate 
}) => {
  const { data: apods, isLoading, error, refetch } = useNASARecentAPODs(7);
  const [currentIndex, setCurrentIndex] = useState(0);

  // Reset to first image when modal opens
  useEffect(() => {
    if (isOpen && apods && apods.length > 0) {
      if (initialDate) {
        const index = apods.findIndex(apod => apod.date === initialDate);
        setCurrentIndex(index >= 0 ? index : 0);
      } else {
        setCurrentIndex(0);
      }
    }
  }, [isOpen, apods, initialDate]);

  // Keyboard navigation
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyPress = (event: KeyboardEvent) => {
      switch (event.key) {
        case 'Escape':
          onClose();
          break;
        case 'ArrowLeft':
          event.preventDefault();
          setCurrentIndex(prev => 
            apods && prev > 0 ? prev - 1 : (apods?.length || 1) - 1
          );
          break;
        case 'ArrowRight':
          event.preventDefault();
          setCurrentIndex(prev => 
            apods && prev < (apods.length - 1) ? prev + 1 : 0
          );
          break;
      }
    };

    document.addEventListener('keydown', handleKeyPress);
    return () => document.removeEventListener('keydown', handleKeyPress);
  }, [isOpen, onClose, apods]);

  const currentAPOD = apods?.[currentIndex];

  const nextImage = () => {
    setCurrentIndex(prev => 
      apods && prev < (apods.length - 1) ? prev + 1 : 0
    );
  };

  const prevImage = () => {
    setCurrentIndex(prev => 
      apods && prev > 0 ? prev - 1 : (apods?.length || 1) - 1
    );
  };

  const renderMediaContent = (apod: APODData) => {
    if (apod.media_type === 'video') {
      // Extract YouTube video ID for embedding
      const youtubeMatch = apod.url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\n?#]+)/);
      const vimeoMatch = apod.url.match(/vimeo\.com\/(\d+)/);
      
      if (youtubeMatch) {
        return (
          <iframe
            src={`https://www.youtube.com/embed/${youtubeMatch[1]}`}
            className="w-full h-full rounded-lg"
            frameBorder="0"
            allowFullScreen
            title={apod.title}
          />
        );
      } else if (vimeoMatch) {
        return (
          <iframe
            src={`https://player.vimeo.com/video/${vimeoMatch[1]}`}
            className="w-full h-full rounded-lg"
            frameBorder="0"
            allowFullScreen
            title={apod.title}
          />
        );
      } else {
        // Fallback for other video types
        return (
          <div className="w-full h-full flex flex-col items-center justify-center bg-slate-900 rounded-lg text-white">
            <ExternalLink className="h-12 w-12 mb-4 text-blue-400" />
            <h3 className="text-lg font-semibold mb-2">Video Content</h3>
            <p className="text-sm text-gray-300 mb-4 text-center max-w-md">
              This content is a video. Click below to view it on the original site.
            </p>
            <Button
              variant="outline"
              onClick={() => window.open(apod.url, '_blank')}
              className="bg-blue-600 border-blue-500 text-white hover:bg-blue-700"
            >
              <ExternalLink className="h-4 w-4 mr-2" />
              View Video
            </Button>
          </div>
        );
      }
    }

    return (
      <img
        src={apod.url}
        alt={apod.title}
        className="w-full h-full object-contain rounded-lg"
        onError={(e) => {
          const target = e.target as HTMLImageElement;
          target.src = 'https://images.unsplash.com/photo-1470813740244-df37b8c1edcb?w=1200&h=800&fit=crop';
        }}
      />
    );
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-7xl w-full h-[90vh] p-0 gap-0 bg-slate-950">
        {/* Header */}
        <div className="flex items-center justify-between p-4 bg-slate-900 border-b border-slate-700">
          <div className="flex items-center gap-3">
            <Telescope className="h-6 w-6 text-blue-400" />
            <div>
              <h2 className="text-lg font-bold text-white">
                {currentAPOD?.title || 'NASA Astronomy Picture of the Day'}
              </h2>
              {currentAPOD && (
                <div className="flex items-center gap-2 text-sm text-gray-300">
                  <Calendar className="h-4 w-4" />
                  <span>{format(new Date(currentAPOD.date), 'EEEE, MMMM dd, yyyy')}</span>
                </div>
              )}
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Navigation */}
            {apods && apods.length > 1 && (
              <>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={prevImage}
                  className="text-gray-300 hover:text-white hover:bg-slate-700"
                >
                  <ChevronLeft className="h-4 w-4 mr-1" />
                  Previous
                </Button>
                <span className="text-sm text-gray-400 px-2">
                  {currentIndex + 1} of {apods.length}
                </span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={nextImage}
                  className="text-gray-300 hover:text-white hover:bg-slate-700"
                >
                  Next
                  <ChevronRight className="h-4 w-4 ml-1" />
                </Button>
              </>
            )}

            {/* Close Button */}
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="text-gray-300 hover:text-white hover:bg-slate-700"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 flex overflow-hidden">
          {/* Media Display */}
          <div className="flex-1 p-4 bg-black flex items-center justify-center">
            {isLoading ? (
              <div className="flex flex-col items-center text-white">
                <Loader2 className="h-12 w-12 animate-spin mb-4 text-blue-400" />
                <p className="text-lg">Loading astronomy images...</p>
              </div>
            ) : error ? (
              <div className="flex flex-col items-center text-white text-center">
                <RotateCcw className="h-12 w-12 mb-4 text-red-400" />
                <h3 className="text-xl font-semibold mb-2">Unable to load images</h3>
                <p className="text-gray-300 mb-4">There was an error loading the astronomy images.</p>
                <Button
                  variant="outline"
                  onClick={() => refetch()}
                  className="bg-blue-600 border-blue-500 text-white hover:bg-blue-700"
                >
                  <RotateCcw className="h-4 w-4 mr-2" />
                  Retry
                </Button>
              </div>
            ) : currentAPOD ? (
              <div className="max-w-5xl max-h-full">
                {renderMediaContent(currentAPOD)}
              </div>
            ) : (
              <div className="text-white text-center">
                <Telescope className="h-12 w-12 mb-4 text-blue-400 mx-auto" />
                <p className="text-lg">No images available</p>
              </div>
            )}
          </div>

          {/* Info Panel */}
          <div className="w-80 bg-slate-900 border-l border-slate-700 flex flex-col">
            <ScrollArea className="flex-1 p-4">
              {/* About APOD */}
              <Card className="mb-4 bg-slate-800 border-slate-700">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm text-blue-400 flex items-center gap-2">
                    <Telescope className="h-4 w-4" />
                    What is APOD?
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-0">
                  <p className="text-xs text-gray-300 leading-relaxed">
                    NASA's Astronomy Picture of the Day features a different image or photograph of our universe each day, 
                    along with a brief explanation written by a professional astronomer.
                  </p>
                </CardContent>
              </Card>

              {/* Current Image Details */}
              {currentAPOD && (
                <Card className="bg-slate-800 border-slate-700">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm text-white">Today's Discovery</CardTitle>
                  </CardHeader>
                  <CardContent className="pt-0 space-y-4">
                    <div>
                      <h4 className="font-semibold text-white mb-2 text-sm">{currentAPOD.title}</h4>
                      <p className="text-xs text-gray-300 leading-relaxed">
                        {currentAPOD.explanation}
                      </p>
                    </div>

                    {currentAPOD.copyright && (
                      <div className="pt-3 border-t border-slate-700">
                        <div className="flex items-start gap-2">
                          <User className="h-3 w-3 text-gray-400 mt-0.5 flex-shrink-0" />
                          <div>
                            <p className="text-xs text-gray-400 font-medium">Credits</p>
                            <p className="text-xs text-gray-300">{currentAPOD.copyright}</p>
                          </div>
                        </div>
                      </div>
                    )}

                    <div className="pt-3 border-t border-slate-700">
                      <div className="flex items-center gap-2 text-xs text-gray-400">
                        <Calendar className="h-3 w-3" />
                        <span>Published: {format(new Date(currentAPOD.date), 'MMM dd, yyyy')}</span>
                      </div>
                      <div className="flex items-center gap-2 text-xs text-gray-400 mt-1">
                        <span className="w-3 h-3 rounded-full bg-blue-500 flex-shrink-0"></span>
                        <span>Media Type: {currentAPOD.media_type === 'image' ? 'Image' : 'Video'}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}
            </ScrollArea>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default APODGalleryModal;
