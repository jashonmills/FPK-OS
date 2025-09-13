
import React, { useState, useEffect } from 'react';
import { Tabs, TabsContent } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import NotesSection from '@/components/notes/NotesSection';
import FileUploadSection from '@/components/notes/FileUploadSection';
import FlashcardsSection from '@/components/notes/FlashcardsSection';
import ProgressSection from '@/components/notes/ProgressSection';
import MobileTabsList from '@/components/notes/MobileTabsList';
import { useFirstVisitVideo } from '@/hooks/useFirstVisitVideo';
import { FirstVisitVideoModal } from '@/components/common/FirstVisitVideoModal';
import { PageHelpTrigger } from '@/components/common/PageHelpTrigger';
import { useIsMobile } from '@/hooks/use-mobile';

const Notes = () => {
  const [activeTab, setActiveTab] = useState('notes');
  const [showVideoModal, setShowVideoModal] = useState(false);
  const isMobile = useIsMobile();
  
  // Video storage hook
  const { shouldShowAuto, markVideoAsSeen } = useFirstVisitVideo('notes_intro_seen');

  // Show video modal on first visit
  useEffect(() => {
    if (shouldShowAuto()) {
      setShowVideoModal(true);
    }
  }, [shouldShowAuto]);

  const handleCloseVideo = () => {
    setShowVideoModal(false);
    markVideoAsSeen();
  };

  const handleShowVideoManually = () => {
    setShowVideoModal(true);
  };

  return (
    <div className="max-w-7xl mx-auto mobile-section-spacing">
      {/* Mobile-Optimized Header with RAG Status */}
      <div className="flex flex-col items-center gap-2 mb-4">
        <h1 className="mobile-heading-xl text-foreground">Notes & Study Materials</h1>
        <PageHelpTrigger onOpen={handleShowVideoManually} />
      </div>
      <p className="text-muted-foreground text-center mb-6 mobile-text-base">
        Organize your learning materials and study resources effectively
      </p>

      <FirstVisitVideoModal
        isOpen={showVideoModal}
        onClose={handleCloseVideo}
        title="How to Use Notes"
        videoUrl="https://www.youtube.com/embed/rWKlC4xFRn4?si=mzknY-IDkUaX3OEM"
      />

      <Tabs value={activeTab} onValueChange={setActiveTab} className="mobile-section-spacing">
        <MobileTabsList isMobile={isMobile} />

        <div className="min-h-0 flex-1">
          <TabsContent value="notes" className="mt-0">
            <NotesSection />
          </TabsContent>

          <TabsContent value="upload" className="mt-0">
            <FileUploadSection />
          </TabsContent>

          <TabsContent value="flashcards" className="mt-0">
            <FlashcardsSection />
          </TabsContent>

          <TabsContent value="progress" className="mt-0">
            <ProgressSection />
          </TabsContent>
        </div>
      </Tabs>
    </div>
  );
};

export default Notes;
