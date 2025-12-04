import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Compass, Calendar, Users, Video, HelpCircle } from 'lucide-react';
import DualLanguageText from '@/components/DualLanguageText';
import LiveHubAPODCard from '@/components/dashboard/LiveHubAPODCard';
import { LiveHubVideoModal } from '@/components/live-hub/LiveHubVideoModal';
import { useLiveHubVideoStorage } from '@/hooks/useLiveHubVideoStorage';
import VisualOfTheWeekCarousel from '@/components/dashboard/VisualOfTheWeekCarousel';
import WeatherScienceLabCard from '@/components/dashboard/WeatherScienceLabCard';
import ModelViewerModal from '@/components/dashboard/ModelViewerModal';
import APODGalleryModal from '@/components/dashboard/APODGalleryModal';
import { MuseumItem } from '@/services/MuseumService';
import { PageHeroWithTile } from '@/components/common/PageHeroWithTile';

const LiveLearningHub = () => {
  const [isAPODModalOpen, setIsAPODModalOpen] = useState(false);
  const [isModelViewerOpen, setIsModelViewerOpen] = useState(false);
  const [selectedMuseumItem, setSelectedMuseumItem] = useState<MuseumItem | null>(null);

  // Video guide storage and modal state
  const { shouldShowAuto, markVideoAsSeen } = useLiveHubVideoStorage();
  const [isVideoModalOpen, setIsVideoModalOpen] = useState(false);

  // Show video modal automatically on first visit
  useEffect(() => {
    if (shouldShowAuto()) {
      setIsVideoModalOpen(true);
    }
  }, [shouldShowAuto]);

  const handleCloseVideoModal = () => {
    setIsVideoModalOpen(false);
    markVideoAsSeen();
  };

  const handleShowVideoManually = () => {
    setIsVideoModalOpen(true);
  };

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
    <div className="space-y-6">
      {/* Hero Section with Contrast Tile */}
      <PageHeroWithTile
        title="Live Learning Hub"
        subtitle="Connect with teachers and peers in real-time learning sessions"
        className="mb-8"
      >
        <button
          onClick={handleShowVideoManually}
          className="flex items-center justify-center gap-1 text-sm text-primary hover:text-primary/80 transition-colors underline-offset-4 hover:underline mt-3 w-full"
          aria-label="Watch video guide about how this page works"
        >
          <HelpCircle className="h-4 w-4" />
          How this page works
        </button>
      </PageHeroWithTile>

      <div className="px-4 sm:px-6 space-y-6">

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
              <DualLanguageText translationKey="liveSessions" namespace="liveHub" />
            </CardTitle>
          </CardHeader>
          <CardContent className="text-center py-12">
            <Video className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              <DualLanguageText translationKey="noSessions" namespace="liveHub" />
            </h3>
            <p className="text-gray-500 mb-4">
              <DualLanguageText translationKey="noSessionsDesc" namespace="liveHub" />
            </p>
            <Button className="fpk-gradient text-white">
              <DualLanguageText translationKey="scheduleSession" namespace="liveHub" />
            </Button>
          </CardContent>
        </Card>

        <Card className="fpk-card border-0 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5 text-blue-600" />
              <DualLanguageText translationKey="upcomingEvents" namespace="liveHub" />
            </CardTitle>
          </CardHeader>
          <CardContent className="text-center py-12">
            <Calendar className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              <DualLanguageText translationKey="noEvents" namespace="liveHub" />
            </h3>
            <p className="text-gray-500">
              <DualLanguageText translationKey="noEventsDesc" namespace="liveHub" />
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

      {/* Video Guide Modal */}
      <LiveHubVideoModal
        isOpen={isVideoModalOpen}
        onClose={handleCloseVideoModal}
      />
      </div>
    </div>
  );
};

export default LiveLearningHub;
