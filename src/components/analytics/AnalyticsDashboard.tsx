/**
 * Analytics Dashboard Component
 * Displays real-time analytics data and stored events
 */

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  BarChart3, 
  Activity, 
  Users, 
  Clock, 
  Download,
  Eye,
  PlayCircle,
  CheckCircle,
  TrendingUp
} from 'lucide-react';
import { analytics } from '@/utils/analytics';

interface AnalyticsEvent {
  event_name: string;
  parameters: {
    course_id?: string;
    module_id?: string;
    timestamp: string;
    [key: string]: any;
  };
}

interface AnalyticsDashboardProps {
  courseId?: string;
  moduleId?: string;
}

export const AnalyticsDashboard: React.FC<AnalyticsDashboardProps> = ({
  courseId,
  moduleId
}) => {
  const [storedEvents, setStoredEvents] = useState<AnalyticsEvent[]>([]);
  const [eventStats, setEventStats] = useState({
    totalEvents: 0,
    moduleViews: 0,
    mediaPlays: 0,
    completions: 0,
    downloads: 0
  });

  useEffect(() => {
    const loadStoredEvents = () => {
      const events = analytics.getStoredEvents();
      setStoredEvents(events as AnalyticsEvent[]);
      
      // Calculate stats
      const stats = events.reduce((acc, event) => {
        acc.totalEvents++;
        
        switch (event.event_name) {
          case 'module_viewed':
            acc.moduleViews++;
            break;
          case 'audio_played':
          case 'video_played':
            acc.mediaPlays++;
            break;
          case 'module_completed':
            acc.completions++;
            break;
          case 'pdf_downloaded':
            acc.downloads++;
            break;
        }
        
        return acc;
      }, {
        totalEvents: 0,
        moduleViews: 0,
        mediaPlays: 0,
        completions: 0,
        downloads: 0
      });
      
      setEventStats(stats);
    };

    loadStoredEvents();
    
    // Use cleanupManager for safe timer management
    import('../../utils/cleanupManager').then(({ cleanupManager }) => {
      const intervalId = cleanupManager.setInterval(loadStoredEvents, 5000, 'analytics-dashboard');
      return () => cleanupManager.cleanup(intervalId);
    });
  }, []);

  const clearEvents = () => {
    analytics.clearStoredEvents();
    setStoredEvents([]);
    setEventStats({
      totalEvents: 0,
      moduleViews: 0,
      mediaPlays: 0,
      completions: 0,
      downloads: 0
    });
  };

  const getEventIcon = (eventName: string) => {
    switch (eventName) {
      case 'module_viewed': return <Eye className="h-4 w-4" />;
      case 'audio_played':
      case 'video_played': return <PlayCircle className="h-4 w-4" />;
      case 'module_completed': return <CheckCircle className="h-4 w-4" />;
      case 'pdf_downloaded': return <Download className="h-4 w-4" />;
      default: return <Activity className="h-4 w-4" />;
    }
  };

  const getEventColor = (eventName: string) => {
    switch (eventName) {
      case 'module_viewed': return 'bg-blue-100 text-blue-700';
      case 'audio_played': return 'bg-green-100 text-green-700';
      case 'video_played': return 'bg-purple-100 text-purple-700';
      case 'module_completed': return 'bg-emerald-100 text-emerald-700';
      case 'pdf_downloaded': return 'bg-orange-100 text-orange-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const filteredEvents = courseId 
    ? storedEvents.filter(event => event.parameters?.course_id === courseId)
    : storedEvents;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold flex items-center gap-2">
          <BarChart3 className="h-6 w-6" />
          Analytics Dashboard
        </h2>
        <Button variant="outline" onClick={clearEvents} size="sm">
          Clear Events
        </Button>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Activity className="h-4 w-4 text-muted-foreground" />
              <div>
                <p className="text-sm text-muted-foreground">Total Events</p>
                <p className="text-2xl font-bold">{eventStats.totalEvents}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Eye className="h-4 w-4 text-blue-600" />
              <div>
                <p className="text-sm text-muted-foreground">Module Views</p>
                <p className="text-2xl font-bold">{eventStats.moduleViews}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <PlayCircle className="h-4 w-4 text-purple-600" />
              <div>
                <p className="text-sm text-muted-foreground">Media Plays</p>
                <p className="text-2xl font-bold">{eventStats.mediaPlays}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-green-600" />
              <div>
                <p className="text-sm text-muted-foreground">Completions</p>
                <p className="text-2xl font-bold">{eventStats.completions}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Download className="h-4 w-4 text-orange-600" />
              <div>
                <p className="text-sm text-muted-foreground">Downloads</p>
                <p className="text-2xl font-bold">{eventStats.downloads}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Event Details */}
      <Tabs defaultValue="recent" className="w-full">
        <TabsList>
          <TabsTrigger value="recent">Recent Events</TabsTrigger>
          <TabsTrigger value="details">Event Details</TabsTrigger>
        </TabsList>

        <TabsContent value="recent" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                Recent Activity
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 max-h-96 overflow-y-auto">
                {filteredEvents.slice(-20).reverse().map((event, index) => (
                  <div key={index} className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                    <div className={`p-2 rounded ${getEventColor(event.event_name as string)}`}>
                      {getEventIcon(event.event_name as string)}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <span className="font-medium">{event.event_name as string}</span>
                        <Badge variant="outline" className="text-xs">
                          {event.parameters?.course_id || 'Unknown Course'}
                        </Badge>
                        {event.parameters?.module_id && (
                          <Badge variant="secondary" className="text-xs">
                            {event.parameters.module_id as string}
                          </Badge>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {new Date(event.parameters?.timestamp || Date.now()).toLocaleString()}
                      </p>
                    </div>
                  </div>
                ))}
                {filteredEvents.length === 0 && (
                  <p className="text-center text-muted-foreground py-8">
                    No events recorded yet. Start interacting with course content to see analytics.
                  </p>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="details" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Event Details</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 max-h-96 overflow-y-auto">
                {filteredEvents.slice(-10).reverse().map((event, index) => (
                  <details key={index} className="bg-muted/50 rounded-lg p-3">
                    <summary className="cursor-pointer font-medium">
                      {event.event_name as string} - {new Date(event.parameters?.timestamp || Date.now()).toLocaleTimeString()}
                    </summary>
                    <pre className="mt-2 text-xs bg-background p-2 rounded overflow-auto">
                      {JSON.stringify(event.parameters, null, 2)}
                    </pre>
                  </details>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AnalyticsDashboard;