
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Compass, Calendar, Users, Video } from 'lucide-react';
import DualLanguageText from '@/components/DualLanguageText';

const LiveLearningHub = () => {
  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">
          <DualLanguageText translationKey="liveHub.title" />
        </h1>
        <p className="text-gray-600">
          <DualLanguageText translationKey="liveHub.subtitle" />
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="fpk-card border-0 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Video className="h-5 w-5 text-red-600" />
              <DualLanguageText translationKey="liveHub.liveSessions" />
            </CardTitle>
          </CardHeader>
          <CardContent className="text-center py-12">
            <Video className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              <DualLanguageText translationKey="liveHub.noSessions" />
            </h3>
            <p className="text-gray-500 mb-4">
              <DualLanguageText translationKey="liveHub.noSessionsDesc" />
            </p>
            <Button className="fpk-gradient text-white">
              <DualLanguageText translationKey="liveHub.scheduleSession" />
            </Button>
          </CardContent>
        </Card>

        <Card className="fpk-card border-0 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5 text-blue-600" />
              <DualLanguageText translationKey="liveHub.upcomingEvents" />
            </CardTitle>
          </CardHeader>
          <CardContent className="text-center py-12">
            <Calendar className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              <DualLanguageText translationKey="liveHub.noEvents" />
            </h3>
            <p className="text-gray-500">
              <DualLanguageText translationKey="liveHub.noEventsDesc" />
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default LiveLearningHub;
