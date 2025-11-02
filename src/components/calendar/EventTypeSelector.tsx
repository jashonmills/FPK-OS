import { Card } from '@/components/ui/card';
import { getAllEventTypes, getEventTypeConfig, CalendarEventType } from './EventTypeIcon';

interface EventTypeSelectorProps {
  onSelect: (type: CalendarEventType) => void;
}

export const EventTypeSelector = ({ onSelect }: EventTypeSelectorProps) => {
  const eventTypes = getAllEventTypes();

  return (
    <div className="grid grid-cols-2 gap-4">
      {eventTypes.map((type) => {
        const config = getEventTypeConfig(type);
        const Icon = config.icon;
        
        return (
          <Card
            key={type}
            className="p-6 cursor-pointer hover:shadow-lg transition-all hover:scale-105 border-2"
            onClick={() => onSelect(type)}
          >
            <div className="flex flex-col items-center text-center space-y-3">
              <div
                className="p-4 rounded-full"
                style={{ backgroundColor: `${config.color}20` }}
              >
                <Icon 
                  className="h-8 w-8" 
                  style={{ color: config.color }}
                />
              </div>
              <div>
                <h3 className="font-semibold text-lg">{config.label}</h3>
                <p className="text-sm text-muted-foreground mt-1">
                  {config.description}
                </p>
              </div>
            </div>
          </Card>
        );
      })}
    </div>
  );
};
