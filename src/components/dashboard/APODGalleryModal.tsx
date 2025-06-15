
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
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
import { useIsMobile } from '@/hooks/use-mobile';

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
  const isMobile = useIsMobile();

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
          prevImage();
          break;
        case 'ArrowRight':
          event.preventDefault();
          nextImage();
          break;
      }
    };

    document.addEventListener('keydown', handleKeyPress);
    return () => document.removeEventListener('keydown', handleKeyPress);
  }, [isOpen, onClose, apods]);

  const currentAPOD = apods?.[currentIndex];

  const nextImage = () => {
    if (!apods || apods.length === 0) return;
    setCurrentIndex(prev => prev < (apods.length - 1) ? prev + 1 : 0);
  };

  const prevImage = () => {
    if (!apods || apods.length === 0) return;
    setCurrentIndex(prev => prev > 0 ? prev - 1 : (apods.length - 1));
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
            className="w-full aspect-video rounded-lg"
            frameBorder="0"
            allowFullScreen
            title={apod.title}
          />
        );
      } else if (vimeoMatch) {
        return (
          <iframe
            src={`https://player.vimeo.com/video/${vimeoMatch[1]}`}
            className="w-full aspect-video rounded-lg"
            frameBorder="0"
            allowFullScreen
            title={apod.title}
          />
        );
      } else {
        // Fallback for other video types
        return (
          <div className="w-full aspect-video flex flex-col items-center justify-center bg-slate-900 rounded-lg text-white">
            <ExternalLink className="h-12 w-12 mb-4 text-blue-400" />
            <h3 className="text-lg font-semibold mb-2">Video Content</h3>
            <p className="text-sm text-gray-300 mb-4 text-center max-w-md px-4">
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
        className="w-full h-auto max-h-[70vh] object-contain rounded-lg"
        onError={(e) => {
          const target = e.target as HTMLImageElement;
          target.src = 'https://images.unsplash.com/photo-1470813740244-df37b8c1edcb?w=1200&h=800&fit=crop';
        }}
      />
    );
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className={`
        ${isMobile 
          ? 'w-screen h-screen max-w-none max-h-none m-0 rounded-none' 
          : 'max-w-7xl w-full h-[90vh]'
        } 
        p-0 gap-0 bg-slate-950 flex flex-col
      `}>
        {/* Header */}
        <div className={`
          flex items-center justify-between p-4 bg-slate-900 border-b border-slate-700
          ${isMobile ? 'flex-col gap-3' : 'flex-row'}
        `}>
          <div className={`flex items-center gap-3 ${isMobile ? 'w-full' : ''}`}>
            <Telescope className="h-6 w-6 text-blue-400 flex-shrink-0" />
            <div className={isMobile ? 'flex-1' : ''}>
              <h2 className={`font-bold text-white ${isMobile ? 'text-base' : 'text-lg'}`}>
                {currentAPOD?.title || 'NASA Astronomy Picture of the Day'}
              </h2>
              {currentAPOD && (
                <div className="flex items-center gap-2 text-sm text-gray-300">
                  <Calendar className="h-4 w-4" />
                  <span>{format(new Date(currentAPOD.date), isMobile ? 'MMM dd, yyyy' : 'EEEE, MMMM dd, yyyy')}</span>
                </div>
              )}
            </div>
          </div>

          <div className={`flex items-center gap-2 ${isMobile ? 'w-full justify-between' : ''}`}>
            {/* Navigation */}
            {apods && apods.length > 1 && (
              <div className={`flex items-center gap-2 ${isMobile ? 'flex-1' : ''}`}>
                <Button
                  variant="ghost"
                  size={isMobile ? "default" : "sm"}
                  onClick={prevImage}
                  className={`text-gray-300 hover:text-white hover:bg-slate-700 ${
                    isMobile ? 'flex-1 min-h-[44px]' : ''
                  }`}
                >
                  <ChevronLeft className="h-4 w-4 mr-1" />
                  {isMobile ? 'Prev' : 'Previous'}
                </Button>
                <span className="text-sm text-gray-400 px-2 whitespace-nowrap">
                  {currentIndex + 1} of {apods.length}
                </span>
                <Button
                  variant="ghost"
                  size={isMobile ? "default" : "sm"}
                  onClick={nextImage}
                  className={`text-gray-300 hover:text-white hover:bg-slate-700 ${
                    isMobile ? 'flex-1 min-h-[44px]' : ''
                  }`}
                >
                  {isMobile ? 'Next' : 'Next'}
                  <ChevronRight className="h-4 w-4 ml-1" />
                </Button>
              </div>
            )}

            {/* Close Button */}
            <Button
              variant="ghost"
              size={isMobile ? "default" : "sm"}
              onClick={onClose}
              className={`text-gray-300 hover:text-white hover:bg-slate-700 ${
                isMobile ? 'min-h-[44px] min-w-[44px]' : ''
              }`}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Main Content */}
        <div className={`flex-1 overflow-hidden ${isMobile ? 'flex flex-col' : 'flex'}`}>
          {/* Media Display */}
          <div className={`bg-black flex items-center justify-center p-4 ${
            isMobile ? 'flex-1' : 'flex-1'
          }`}>
            {isLoading ? (
              <div className="flex flex-col items-center text-white">
                <Loader2 className="h-12 w-12 animate-spin mb-4 text-blue-400" />
                <p className={isMobile ? 'text-base' : 'text-lg'}>Loading astronomy images...</p>
              </div>
            ) : error ? (
              <div className="flex flex-col items-center text-white text-center px-4">
                <RotateCcw className="h-12 w-12 mb-4 text-red-400" />
                <h3 className={`font-semibold mb-2 ${isMobile ? 'text-lg' : 'text-xl'}`}>Unable to load images</h3>
                <p className="text-gray-300 mb-4">There was an error loading the astronomy images.</p>
                <Button
                  variant="outline"
                  onClick={() => refetch()}
                  className="bg-blue-600 border-blue-500 text-white hover:bg-blue-700 min-h-[44px]"
                >
                  <RotateCcw className="h-4 w-4 mr-2" />
                  Retry
                </Button>
              </div>
            ) : currentAPOD ? (
              <div className="w-full max-w-5xl">
                {renderMediaContent(currentAPOD)}
              </div>
            ) : (
              <div className="text-white text-center">
                <Telescope className="h-12 w-12 mb-4 text-blue-400 mx-auto" />
                <p className={isMobile ? 'text-base' : 'text-lg'}>No images available</p>
              </div>
            )}
          </div>

          {/* Info Panel */}
          <div className={`bg-slate-900 border-slate-700 ${
            isMobile 
              ? 'border-t overflow-y-auto max-h-[40vh]' 
              : 'w-80 border-l flex flex-col'
          }`}>
            <ScrollArea className={`${isMobile ? 'h-full' : 'flex-1'} p-4`}>
              {isMobile ? (
                // Mobile: Accordion Layout
                <Accordion type="single" collapsible className="w-full">
                  <AccordionItem value="about-apod" className="border-slate-700">
                    <AccordionTrigger className="text-blue-400 hover:text-blue-300">
                      <div className="flex items-center gap-2">
                        <Telescope className="h-4 w-4" />
                        What is APOD?
                      </div>
                    </AccordionTrigger>
                    <AccordionContent className="text-gray-300 leading-relaxed">
                      NASA's Astronomy Picture of the Day features a different image or photograph of our universe each day, 
                      along with a brief explanation written by a professional astronomer.
                    </AccordionContent>
                  </AccordionItem>

                  {currentAPOD && (
                    <AccordionItem value="current-image" className="border-slate-700">
                      <AccordionTrigger className="text-white hover:text-gray-200">
                        Today's Discovery
                      </AccordionTrigger>
                      <AccordionContent className="space-y-4">
                        <div>
                          <h4 className="font-semibold text-white mb-2">{currentAPOD.title}</h4>
                          <p className="text-sm text-gray-300 leading-relaxed">
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
                      </AccordionContent>
                    </AccordionItem>
                  )}
                </Accordion>
              ) : (
                // Desktop: Card Layout
                <>
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
                </>
              )}
            </ScrollArea>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default APODGalleryModal;
