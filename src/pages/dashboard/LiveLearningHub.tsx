import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useAccessibility } from '@/hooks/useAccessibility';
import { useGlobalTranslation } from '@/hooks/useGlobalTranslation';
import { 
  Video, 
  Users, 
  Calendar, 
  Clock, 
  Plus, 
  Play, 
  Mic, 
  MicOff, 
  Camera, 
  CameraOff,
  Share,
  MessageCircle,
  BookOpen,
  Globe
} from 'lucide-react';

const LiveLearningHub = () => {
  const { t, renderText, tString } = useGlobalTranslation('liveHub');
  const { getAccessibilityClasses } = useAccessibility();

  // Apply accessibility classes
  const containerClasses = getAccessibilityClasses('container');
  const textClasses = getAccessibilityClasses('text');
  const cardClasses = getAccessibilityClasses('card');

  // Mock data for live sessions
  const mockSessions = [
    {
      id: 'session1',
      title: 'Advanced React Patterns',
      instructor: 'Sarah Drasner',
      time: '14:00 - 15:30',
      attendees: 45,
      avatar: 'https://avatars1.githubusercontent.com/u/12679192?s=460&v=4',
    },
    {
      id: 'session2',
      title: 'AI and Machine Learning Basics',
      instructor: 'Andrej Karpathy',
      time: '16:00 - 17:00',
      attendees: 62,
      avatar: 'https://avatars4.githubusercontent.com/u/874851?s=460&v=4',
    },
  ];

  // Mock data for upcoming events
  const mockEvents = [
    {
      id: 'event1',
      title: 'React Native Workshop',
      date: 'July 22, 2024',
      time: '10:00 - 16:00',
    },
    {
      id: 'event2',
      title: 'GraphQL Deep Dive',
      date: 'July 28, 2024',
      time: '13:00 - 15:00',
    },
  ];

  const SessionCard = ({ session, textClasses }: any) => (
    <Card className={`fpk-card ${textClasses}`}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Avatar>
              <AvatarImage src={session.avatar} alt={session.instructor} />
              <AvatarFallback>{session.instructor.charAt(0)}</AvatarFallback>
            </Avatar>
            <div>
              <CardTitle className={textClasses}>{session.title}</CardTitle>
              <p className={`text-sm text-gray-600 ${textClasses}`}>{session.instructor}</p>
            </div>
          </div>
          <Badge variant="secondary" className={textClasses}>Live</Badge>
        </div>
      </CardHeader>
      <CardContent className="grid grid-cols-2 gap-4">
        <div className="flex items-center gap-2">
          <Clock className="h-4 w-4 text-gray-500" />
          <span className={`text-sm text-gray-600 ${textClasses}`}>{session.time}</span>
        </div>
        <div className="flex items-center gap-2">
          <Users className="h-4 w-4 text-gray-500" />
          <span className={`text-sm text-gray-600 ${textClasses}`}>{session.attendees}</span>
        </div>
        <Button variant="outline" size="sm" className={`col-span-2 w-full justify-center gap-2 ${textClasses}`}>
          <Play className="h-4 w-4" />
          Join Session
        </Button>
      </CardContent>
    </Card>
  );

  const EventCard = ({ event, textClasses }: any) => (
    <Card className={`fpk-card ${textClasses}`}>
      <CardHeader>
        <CardTitle className={textClasses}>{event.title}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        <div className="flex items-center gap-2">
          <Calendar className="h-4 w-4 text-gray-500" />
          <span className={`text-sm text-gray-600 ${textClasses}`}>{event.date}</span>
        </div>
        <div className="flex items-center gap-2">
          <Clock className="h-4 w-4 text-gray-500" />
          <span className={`text-sm text-gray-600 ${textClasses}`}>{event.time}</span>
        </div>
        <Button variant="outline" size="sm" className={`w-full justify-center gap-2 ${textClasses}`}>
          <BookOpen className="h-4 w-4" />
          View Details
        </Button>
      </CardContent>
    </Card>
  );

  return (
    <div className={`p-3 md:p-6 space-y-4 md:space-y-6 ${containerClasses}`}>
      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
        <div>
          <h1 className={`text-2xl md:text-3xl font-bold bg-gradient-to-r from-purple-700 to-amber-600 bg-clip-text text-transparent ${textClasses}`}>
            {renderText(t('title'))}
          </h1>
          <p className={`text-gray-600 mt-1 text-sm md:text-base ${textClasses}`}>
            {renderText(t('subtitle'))}
          </p>
        </div>
        
        <Button className={`gap-2 ${textClasses}`}>
          <Plus className="h-4 w-4" />
          {renderText(t('scheduleSession'))}
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6">
        {/* Live Sessions */}
        <div className="lg:col-span-2">
          <Card className={`fpk-card mb-6 ${cardClasses}`}>
            <CardHeader>
              <CardTitle className={`flex items-center gap-2 ${textClasses}`}>
                <Video className="h-5 w-5 text-red-600" />
                {renderText(t('liveSessions'))}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {mockSessions.length > 0 ? (
                <div className="space-y-4">
                  {mockSessions.map((session) => (
                    <SessionCard key={session.id} session={session} textClasses={textClasses} />
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <Video className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                  <h3 className={`text-lg font-semibold mb-2 ${textClasses}`}>
                    {renderText(t('noSessions'))}
                  </h3>
                  <p className={`text-gray-600 mb-4 ${textClasses}`}>
                    {renderText(t('noSessionsDesc'))}
                  </p>
                  <Button className={textClasses}>
                    {renderText(t('scheduleSession'))}
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-4 md:space-y-6">
          {/* Upcoming Events */}
          <Card className={`fpk-card ${cardClasses}`}>
            <CardHeader>
              <CardTitle className={`flex items-center gap-2 ${textClasses}`}>
                <Calendar className="h-5 w-5 text-blue-600" />
                {renderText(t('upcomingEvents'))}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {mockEvents.length > 0 ? (
                <div className="space-y-3">
                  {mockEvents.map((event) => (
                    <EventCard key={event.id} event={event} textClasses={textClasses} />
                  ))}
                </div>
              ) : (
                <div className="text-center py-4">
                  <Calendar className="h-8 w-8 mx-auto text-gray-400 mb-2" />
                  <p className={`text-sm text-gray-600 ${textClasses}`}>
                    {renderText(t('noEventsDesc'))}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card className={`fpk-card ${cardClasses}`}>
            <CardHeader>
              <CardTitle className={textClasses}>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button variant="outline" className={`w-full justify-start gap-2 ${textClasses}`}>
                <Video className="h-4 w-4" />
                Start Instant Session
              </Button>
              <Button variant="outline" className={`w-full justify-start gap-2 ${textClasses}`}>
                <Calendar className="h-4 w-4" />
                Schedule Session
              </Button>
              <Button variant="outline" className={`w-full justify-start gap-2 ${textClasses}`}>
                <Users className="h-4 w-4" />
                Join Study Group
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default LiveLearningHub;
