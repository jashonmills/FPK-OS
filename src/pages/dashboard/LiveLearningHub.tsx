
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Compass, Calendar, Users, Video } from 'lucide-react';

const LiveLearningHub = () => {
  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Live Learning Hub</h1>
        <p className="text-gray-600">Join live sessions, webinars, and interactive learning experiences</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="fpk-card border-0 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Video className="h-5 w-5 text-red-600" />
              Live Sessions
            </CardTitle>
          </CardHeader>
          <CardContent className="text-center py-12">
            <Video className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No Live Sessions</h3>
            <p className="text-gray-500 mb-4">Live learning sessions will appear here</p>
            <Button className="fpk-gradient text-white">
              Schedule Session
            </Button>
          </CardContent>
        </Card>

        <Card className="fpk-card border-0 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5 text-blue-600" />
              Upcoming Events
            </CardTitle>
          </CardHeader>
          <CardContent className="text-center py-12">
            <Calendar className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No Events Scheduled</h3>
            <p className="text-gray-500">Upcoming learning events will be shown here</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default LiveLearningHub;
