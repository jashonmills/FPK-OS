import { useState } from 'react';
import { usePartnerResources, usePartnerCategories } from '@/hooks/usePartnerResources';
import { PartnerCard } from './PartnerCard';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { Handshake } from 'lucide-react';

export function PartnerShowcase() {
  const [selectedCategory, setSelectedCategory] = useState<string | undefined>();
  const { data: partners, isLoading } = usePartnerResources(selectedCategory);
  const { data: categories } = usePartnerCategories();

  if (isLoading) {
    return (
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {[1, 2, 3].map(i => (
          <Skeleton key={i} className="h-96" />
        ))}
      </div>
    );
  }

  if (!partners || partners.length === 0) {
    return (
      <div className="text-center py-12 bg-card/70 backdrop-blur-sm rounded-lg">
        <Handshake className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
        <p className="text-muted-foreground">No partner resources available yet.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Category Filter (if multiple categories exist) */}
      {categories && categories.length > 1 && (
        <div className="flex flex-wrap gap-2">
          <Button
            variant={!selectedCategory ? 'default' : 'outline'}
            size="sm"
            onClick={() => setSelectedCategory(undefined)}
          >
            All
          </Button>
          {categories.map(category => (
            <Button
              key={category}
              variant={selectedCategory === category ? 'default' : 'outline'}
              size="sm"
              onClick={() => setSelectedCategory(category)}
            >
              {category}
            </Button>
          ))}
        </div>
      )}

      {/* Carousel */}
      <Carousel
        opts={{
          align: 'start',
          loop: false,
        }}
        className="w-full"
      >
        <CarouselContent className="-ml-4">
          {partners.map(partner => (
            <CarouselItem key={partner.id} className="pl-4 md:basis-1/2 lg:basis-1/3">
              <PartnerCard partner={partner} />
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious />
        <CarouselNext />
      </Carousel>
    </div>
  );
}
