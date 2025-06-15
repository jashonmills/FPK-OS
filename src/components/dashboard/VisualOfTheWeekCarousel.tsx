
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

  React.useEffect(() => {
    if (!api) return;

    setCurrent(api.selectedScrollSnap());

    api.on('select', () => {
      setCurrent(api.selectedScrollSnap());
    });
  }, [api]);

  const handleItemClick = (item: MuseumItem) => {
    trackClick(item.id);
    onItemClick(item);
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
    <Card ref={elementRef} className="bg-gradient-to-br from-purple-50 to-pink-100 border-purple-200">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-purple-800">Visual of the Week</CardTitle>
        <Palette className="h-4 w-4 text-purple-600" />
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="space-y-3">
            <Skeleton className="h-32 w-full rounded-lg" />
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-3 w-1/2" />
          </div>
        ) : items && items.length > 0 ? (
          <div className="space-y-4">
            <Carousel setApi={setApi} className="w-full">
              <CarouselContent>
                {items.map((item, index) => (
                  <CarouselItem key={item.id}>
                    <div 
                      className="cursor-pointer group"
                      onClick={() => handleItemClick(item)}
                    >
                      <div className="relative overflow-hidden rounded-lg bg-white shadow-sm group-hover:shadow-md transition-shadow">
                        <img
                          src={item.thumbnail}
                          alt={item.title}
                          className="w-full h-32 object-cover group-hover:scale-105 transition-transform duration-200"
                          onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            target.src = 'https://images.unsplash.com/photo-1578321272176-b7bbc0679853?w=400&h=300&fit=crop';
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
                  </CarouselItem>
                ))}
              </CarouselContent>
              <CarouselPrevious className="hidden sm:flex -left-4" />
              <CarouselNext className="hidden sm:flex -right-4" />
            </Carousel>

            {/* Mobile navigation */}
            <div className="flex sm:hidden items-center justify-between">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => api?.scrollPrev()}
                disabled={current === 0}
                className="text-purple-700 hover:text-purple-900 hover:bg-purple-100"
              >
                <ChevronLeft className="h-4 w-4 mr-1" />
                Prev
              </Button>
              
              <div className="flex space-x-1">
                {items.map((_, index) => (
                  <button
                    key={index}
                    className={`w-2 h-2 rounded-full transition-colors ${
                      index === current ? 'bg-purple-600' : 'bg-purple-300'
                    }`}
                    onClick={() => api?.scrollTo(index)}
                    aria-label={`Go to slide ${index + 1}`}
                  />
                ))}
              </div>

              <Button
                variant="ghost"
                size="sm"
                onClick={() => api?.scrollNext()}
                disabled={current === items.length - 1}
                className="text-purple-700 hover:text-purple-900 hover:bg-purple-100"
              >
                Next
                <ChevronRight className="h-4 w-4 ml-1" />
              </Button>
            </div>

            <div className="text-center">
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
