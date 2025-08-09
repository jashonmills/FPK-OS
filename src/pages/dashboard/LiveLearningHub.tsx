import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Compass, Calendar, Users, Video } from 'lucide-react';
import DualLanguageText from '@/components/DualLanguageText';
import LiveHubAPODCard from '@/components/dashboard/LiveHubAPODCard';
import VisualOfTheWeekCarousel from '@/components/dashboard/VisualOfTheWeekCarousel';
import WeatherScienceLabCard from '@/components/dashboard/WeatherScienceLabCard';
import ModelViewerModal from '@/components/dashboard/ModelViewerModal';
import APODGalleryModal from '@/components/dashboard/APODGalleryModal';
import { MuseumItem } from '@/services/MuseumService';

const LiveLearningHub = () => {
  const [isAPODModalOpen, setIsAPODModalOpen] = useState(false);
  const [isModelViewerOpen, setIsModelViewerOpen] = useState(false);
  const [selectedMuseumItem, setSelectedMuseumItem] = useState<MuseumItem | null>(null);

  const handleAPODLearnMore = () => {
    setIsAPODModalOpen(true);
  };

  const handleCloseAPODModal = () => {
    setIsAPODModalOpen(false);
  };

  const handleMuseumItemClick = (item: MuseumItem) => {
    setSelectedMuseumItem(item);
    setIsModelViewerOpen(true);
  };

  const handleCloseModelViewer = () => {
    setIsModelViewerOpen(false);
    setSelectedMuseumItem(null);
  };

  return (
    <div className="p-4 sm:p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">
          <DualLanguageText translationKey="liveHub.title" />
        </h1>
        <p className="text-gray-600">
          <DualLanguageText translationKey="liveHub.subtitle" />
        </p>
      </div>

      {/* Daily Discovery Section */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold text-gray-800">Daily Discovery</h2>
        
        {/* Top Row: Weather spans full width */}
        <div className="w-full">
          <WeatherScienceLabCard />
        </div>

        {/* Second Row: NASA APOD and Visual of the Week side by side */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <LiveHubAPODCard onLearnMore={handleAPODLearnMore} />
          <VisualOfTheWeekCarousel onItemClick={handleMuseumItemClick} />
        </div>
      </div>

      {/* Existing Live Sessions Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="fpk-card border-0 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Video className="h-5 w-5 text-red-600" />
              <DualLanguageText translationKey="liveHub.liveSessions" namespace="liveHub" />
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

      {/* Modals */}
      <APODGalleryModal
        isOpen={isAPODModalOpen}
        onClose={handleCloseAPODModal}
      />

      <ModelViewerModal
        isOpen={isModelViewerOpen}
        onClose={handleCloseModelViewer}
        item={selectedMuseumItem}
      />
    </div>
  );
};

export default LiveLearningHub;
