import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Skeleton } from "@/components/ui/skeleton";
import { WidgetCard } from "./WidgetCard";
import { Calendar, MapPin, Video, Users as UsersIcon } from "lucide-react";
import { format } from "date-fns";

interface Event {
  id: string;
  title: string;
  description: string | null;
  event_date: string;
  location_type: string | null;
  location_url: string | null;
  location_address: string | null;
}

export const UpcomingEventsWidget = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      const { data, error } = await supabase
        .from("events")
        .select("*")
        .gte("event_date", new Date().toISOString())
        .order("event_date", { ascending: true })
        .limit(3);

      if (error) throw error;
      setEvents(data || []);
    } catch (error) {
      console.error("Error fetching events:", error);
    } finally {
      setLoading(false);
    }
  };

  const getLocationIcon = (type: string | null) => {
    switch (type) {
      case "VIRTUAL":
        return <Video className="h-3 w-3" />;
      case "IN_PERSON":
        return <MapPin className="h-3 w-3" />;
      case "HYBRID":
        return <UsersIcon className="h-3 w-3" />;
      default:
        return <MapPin className="h-3 w-3" />;
    }
  };

  if (loading) {
    return (
      <WidgetCard title="Upcoming Events" icon={<Calendar className="h-4 w-4" />}>
        <div className="space-y-3">
          {[1, 2].map((i) => (
            <div key={i} className="space-y-2">
              <Skeleton className="h-4 w-32" />
              <Skeleton className="h-3 w-24" />
            </div>
          ))}
        </div>
      </WidgetCard>
    );
  }

  if (events.length === 0) {
    return (
      <WidgetCard title="Upcoming Events" icon={<Calendar className="h-4 w-4" />}>
        <p className="text-sm text-muted-foreground">No upcoming events scheduled.</p>
      </WidgetCard>
    );
  }

  return (
    <WidgetCard
      title="Upcoming Events"
      icon={<Calendar className="h-4 w-4" />}
    >
      <div className="space-y-3">
        {events.map((event) => (
          <div
            key={event.id}
            className="p-3 rounded-lg hover:bg-accent transition-colors cursor-pointer border border-border"
          >
            <h4 className="font-semibold text-sm mb-1">{event.title}</h4>
            {event.description && (
              <p className="text-xs text-muted-foreground line-clamp-2 mb-2">
                {event.description}
              </p>
            )}
            <div className="flex items-center gap-3 text-xs text-muted-foreground">
              <div className="flex items-center gap-1">
                <Calendar className="h-3 w-3" />
                <span>{format(new Date(event.event_date), "MMM d, h:mm a")}</span>
              </div>
              {event.location_type && (
                <div className="flex items-center gap-1">
                  {getLocationIcon(event.location_type)}
                  <span className="capitalize">
                    {event.location_type.toLowerCase().replace("_", " ")}
                  </span>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </WidgetCard>
  );
};
