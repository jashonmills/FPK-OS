import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { useIsMobile } from '@/hooks/use-mobile';
import { Shield, MapPin, CheckCircle } from 'lucide-react';
import { IEPAccommodation } from '@/hooks/useStudentIEP';

interface IEPAccommodationsCardProps {
  accommodations: IEPAccommodation[];
}

export function IEPAccommodationsCard({ accommodations }: IEPAccommodationsCardProps) {
  const isMobile = useIsMobile();
  if (!accommodations || accommodations.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            IEP Accommodations
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground text-sm">No accommodations defined yet.</p>
        </CardContent>
      </Card>
    );
  }

  const groupedAccommodations = accommodations.reduce((acc, accommodation) => {
    const category = accommodation.accommodation_type;
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(accommodation);
    return acc;
  }, {} as Record<string, IEPAccommodation[]>);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Shield className="h-5 w-5" />
          IEP Accommodations ({accommodations.length})
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {Object.entries(groupedAccommodations).map(([category, categoryAccommodations]) => (
          <div key={category}>
            <div className="flex items-center gap-2 mb-3">
              <Badge variant="outline">{category}</Badge>
              <span className="text-sm text-muted-foreground">
                {categoryAccommodations.length} accommodation{categoryAccommodations.length !== 1 ? 's' : ''}
              </span>
            </div>
            
            <div className="space-y-3">
              {categoryAccommodations.map((accommodation) => (
                <div key={accommodation.id} className="border rounded-lg p-4 space-y-3">
                  <div className="flex items-start gap-3">
                    <div className="flex items-center gap-2">
                      {accommodation.is_modification ? (
                        <Badge variant="destructive">Modification</Badge>
                      ) : (
                        <Badge variant="default">Accommodation</Badge>
                      )}
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="font-medium text-sm mb-1">Description</h4>
                    <p className="text-sm text-muted-foreground">{accommodation.description}</p>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">
                      <span className="font-medium">Context:</span> {accommodation.context}
                    </span>
                  </div>
                  
                  {accommodation.notes && (
                    <div>
                      <h4 className="font-medium text-sm mb-1">Notes</h4>
                      <p className="text-sm text-muted-foreground">{accommodation.notes}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
            
            {Object.keys(groupedAccommodations).length > 1 && category !== Object.keys(groupedAccommodations)[Object.keys(groupedAccommodations).length - 1] && (
              <Separator className="mt-4" />
            )}
          </div>
        ))}
      </CardContent>
    </Card>
  );
}