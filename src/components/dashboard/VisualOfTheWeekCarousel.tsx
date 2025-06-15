import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { 
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  type CarouselApi
} from '@/components/ui/carousel';
import { Palette, ChevronLeft, ChevronRight, RotateCcw } from 'lucide-react';
import { useVisualOfTheWeek } from '@/hooks/useMuseumData';
import { useViewportAnalytics } from '@/hooks/useViewportAnalytics';
import { MuseumItem } from '@/services/MuseumService';

interface VisualOfTheWeekCarouselProps {
  onItemClick: (item: MuseumItem) => void;
}

const VisualOfTheWeekCarousel: React.FC<VisualOfTheWeekCarouselProps> = ({ onItemClick }) => {
  const { data: items, isLoading, error, refetch } = useVisualOfTheWeek();
  const { elementRef, trackClick } = useViewportAnalytics('visual3d');
  const [api, setApi] = useState<CarouselApi>();
  const [current, setCurrent] = useState(0);
  const [imageErrors, setImageErrors] = useState<Set<string>>(new Set());

  React.useEffect(() => {
    if (!api) return;

    const onSelect = () => {
      setCurrent(api.selectedScrollSnap());
    };

    setCurrent(api.selectedScrollSnap());
    api.on('select', onSelect);

    return () => {
      api.off('select', onSelect);
    };
  }, [api]);

  // Keyboard navigation
  React.useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (!api || !items?.length) return;
      
      if (event.key === 'ArrowLeft') {
        event.preventDefault();
        api.scrollPrev();
      } else if (event.key === 'ArrowRight') {
        event.preventDefault();
        api.scrollNext();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [api, items]);

  const handleItemClick = (item: MuseumItem) => {
    trackClick(item.id);
    onItemClick(item);
  };

  const handleImageError = (itemId: string, originalSrc: string) => {
    console.warn(`🏛️ Museum: Image failed to load for ${itemId}:`, originalSrc);
    setImageErrors(prev => new Set([...prev, itemId]));
  };

  const getImageSrc = (item: MuseumItem): string => {
    // If this image has errored, use the generic fallback
    if (imageErrors.has(item.id)) {
      return 'https://images.unsplash.com/photo-1578321272176-b7bbc0679853?w=400&h=300&fit=crop&auto=format';
    }
    
    // Otherwise use the thumbnail (which should be a real museum image)
    return item.thumbnail;
  };

  const handlePrevious = () => {
    if (!api) return;
    api.scrollPrev();
  };

  const handleNext = () => {
    if (!api) return;
    api.scrollNext();
  };

  const goToSlide = (index: number) => {
    if (!api) return;
    api.scrollTo(index);
  };

  if (error) {
    return (
      <Card ref={elementRef} className="bg-gradient-to-br from-purple-50 to-pink-100 border-purple-200">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-purple-800">Visual of the Week</CardTitle>
          <Palette className="h-4 w-4 text-purple-600" />
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <RotateCcw className="h-12 w-12 text-purple-400 mx-auto mb-4" />
            <div className="text-2xl font-bold text-purple-900 mb-2">
              Unable to Load
            </div>
            <p className="text-xs text-purple-700 mb-4">Failed to fetch visual content</p>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => refetch()}
              className="bg-purple-600 border-purple-500 text-white hover:bg-purple-700"
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
    <Card ref={elementRef} className="bg-gradient-to-br from-purple-50 to-pink-100 border-purple-200 h-full flex flex-col">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 flex-shrink-0">
        <CardTitle className="text-sm font-medium text-purple-800">Visual of the Week</CardTitle>
        <Palette className="h-4 w-4 text-purple-600" />
      </CardHeader>
      <CardContent className="flex-1 flex flex-col">
        {isLoading ? (
          <div className="space-y-3 flex-1">
            <Skeleton className="flex-1 w-full rounded-lg min-h-[200px]" />
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-3 w-1/2" />
          </div>
        ) : items && items.length > 0 ? (
          <div className="flex flex-col h-full space-y-4">
            {/* Carousel Container - Takes available space */}
            <div className="relative flex-1 min-h-[200px]">
              <Carousel 
                setApi={setApi} 
                className="w-full h-full"
                opts={{
                  align: "start",
                  loop: true,
                }}
              >
                <CarouselContent className="h-full">
                  {items.map((item, index) => (
                    <CarouselItem key={item.id} className="h-full">
                      <div 
                        className="cursor-pointer group h-full"
                        onClick={() => handleItemClick(item)}
                        role="button"
                        tabIndex={0}
                        aria-label={`View ${item.title}`}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' || e.key === ' ') {
                            e.preventDefault();
                            handleItemClick(item);
                          }
                        }}
                      >
                        <div className="relative overflow-hidden rounded-lg bg-white shadow-sm group-hover:shadow-md transition-shadow h-full flex flex-col">
                          <div className="flex-1 relative">
                            <img
                              src={getImageSrc(item)}
                              alt={item.title}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                              style={{ backgroundColor: '#000' }}
                              onError={(e) => {
                                handleImageError(item.id, item.thumbnail);
                                // Don't change src here, let getImageSrc handle it on next render
                              }}
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                            <div className="absolute bottom-2 left-2 right-2">
                              <h4 className="text-sm font-semibold text-white line-clamp-2">
                                {item.title}
                              </h4>
                              <p className="text-xs text-white/80 mt-1">
                                {item.source === 'smithsonian' ? 'Smithsonian' : 'Met Museum'}
                                {item.isThreeD && ' • 3D Model'}
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </CarouselItem>
                  ))}
                </CarouselContent>
                
                {/* Desktop Navigation Controls */}
                <CarouselPrevious 
                  className="hidden sm:flex absolute left-2 top-1/2 -translate-y-1/2 h-8 w-8 bg-white/90 hover:bg-white border-purple-200 text-purple-700 hover:text-purple-900"
                  onClick={handlePrevious}
                  aria-label="Previous image"
                />
                <CarouselNext 
                  className="hidden sm:flex absolute right-2 top-1/2 -translate-y-1/2 h-8 w-8 bg-white/90 hover:bg-white border-purple-200 text-purple-700 hover:text-purple-900"
                  onClick={handleNext}
                  aria-label="Next image"
                />
              </Carousel>
            </div>

            {/* Mobile Navigation and Indicators - Fixed at bottom */}
            <div className="flex sm:hidden items-center justify-between px-2 flex-shrink-0">
              <Button
                variant="ghost"
                size="sm"
                onClick={handlePrevious}
                className="text-purple-700 hover:text-purple-900 hover:bg-purple-100"
                aria-label="Previous image"
              >
                <ChevronLeft className="h-4 w-4 mr-1" />
                Prev
              </Button>
              
              <div className="flex space-x-1" role="tablist" aria-label="Image indicators">
                {items.map((_, index) => (
                  <button
                    key={index}
                    className={`w-2 h-2 rounded-full transition-colors ${
                      index === current ? 'bg-purple-600' : 'bg-purple-300'
                    }`}
                    onClick={() => goToSlide(index)}
                    aria-label={`Go to slide ${index + 1}`}
                    role="tab"
                    aria-selected={index === current}
                  />
                ))}
              </div>

              <Button
                variant="ghost"
                size="sm"
                onClick={handleNext}
                className="text-purple-700 hover:text-purple-900 hover:bg-purple-100"
                aria-label="Next image"
              >
                Next
                <ChevronRight className="h-4 w-4 ml-1" />
              </Button>
            </div>

            {/* Item Counter and Info - Fixed at bottom */}
            <div className="text-center space-y-1 flex-shrink-0">
              <div className="text-sm font-medium text-purple-800">
                {current + 1} of {items.length}
              </div>
              <p className="text-xs text-purple-600">
                {items.length} curated visuals • Updated weekly
              </p>
            </div>
          </div>
        ) : (
          <div className="text-center py-8">
            <Palette className="h-12 w-12 text-purple-400 mx-auto mb-4" />
            <div className="text-lg font-semibold text-purple-900 mb-2">
              No Visuals Available
            </div>
            <p className="text-xs text-purple-700">Check back later for new content</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default VisualOfTheWeekCarousel;
