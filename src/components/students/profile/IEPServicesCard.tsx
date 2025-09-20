import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Stethoscope, Clock, MapPin, User, Calendar } from 'lucide-react';
import { IEPService } from '@/hooks/useStudentIEP';

interface IEPServicesCardProps {
  services: IEPService[];
}

export function IEPServicesCard({ services }: IEPServicesCardProps) {
  if (!services || services.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Stethoscope className="h-5 w-5" />
            IEP Services
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground text-sm">No services defined yet.</p>
        </CardContent>
      </Card>
    );
  }

  const groupedServices = services.reduce((acc, service) => {
    const type = service.service_type;
    if (!acc[type]) {
      acc[type] = [];
    }
    acc[type].push(service);
    return acc;
  }, {} as Record<string, IEPService[]>);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Stethoscope className="h-5 w-5" />
          IEP Services ({services.length})
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {Object.entries(groupedServices).map(([serviceType, typeServices]) => (
          <div key={serviceType}>
            <div className="flex items-center gap-2 mb-3">
              <Badge variant="secondary">{serviceType}</Badge>
              <span className="text-sm text-muted-foreground">
                {typeServices.length} service{typeServices.length !== 1 ? 's' : ''}
              </span>
            </div>
            
            <div className="space-y-4">
              {typeServices.map((service) => (
                <div key={service.id} className="border rounded-lg p-4 space-y-3">
                  {service.notes && (
                    <div>
                      <h4 className="font-medium text-sm mb-1">Service Notes</h4>
                      <p className="text-sm text-muted-foreground">{service.notes}</p>
                    </div>
                  )}
                  
                  <div className="grid md:grid-cols-2 gap-4">
                    {service.minutes_per_week && (
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm">
                          <span className="font-medium">Per Week:</span> {service.minutes_per_week} minutes
                        </span>
                      </div>
                    )}
                    
                    {service.frequency && (
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm">
                          <span className="font-medium">Frequency:</span> {service.frequency}
                        </span>
                      </div>
                    )}
                  </div>
                  
                  <div className="grid md:grid-cols-2 gap-4">
                    {service.setting_type && (
                      <div className="flex items-center gap-2">
                        <MapPin className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm">
                          <span className="font-medium">Setting:</span> {service.setting_type}
                        </span>
                      </div>
                    )}
                    
                    <div className="flex items-center gap-2">
                      <User className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">
                        <span className="font-medium">Provider:</span> {service.provider_role}
                      </span>
                    </div>
                  </div>
                  
                  {(service.start_date || service.end_date) && (
                    <div className="flex items-center gap-4">
                      {service.start_date && (
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4 text-muted-foreground" />
                          <span className="text-sm">
                            <span className="font-medium">Start:</span>{' '}
                            {new Date(service.start_date).toLocaleDateString()}
                          </span>
                        </div>
                      )}
                      {service.end_date && (
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4 text-muted-foreground" />
                          <span className="text-sm">
                            <span className="font-medium">End:</span>{' '}
                            {new Date(service.end_date).toLocaleDateString()}
                          </span>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
            
            {Object.keys(groupedServices).length > 1 && serviceType !== Object.keys(groupedServices)[Object.keys(groupedServices).length - 1] && (
              <Separator className="mt-4" />
            )}
          </div>
        ))}
      </CardContent>
    </Card>
  );
}