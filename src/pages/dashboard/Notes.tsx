
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
import { cn } from '@/lib/utils';

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
    <div className="max-w-7xl mx-auto mobile-container viewport-constrain">
      {/* Mobile-Optimized Header with RAG Status */}
      <div className={cn(
        "flex flex-col items-center gap-2 mb-4",
        isMobile ? "px-3 py-2" : "px-6 py-4"
      )}>
        <h1 className={cn(
          "text-foreground text-center",
          isMobile ? "text-xl font-bold" : "text-2xl lg:text-3xl font-bold"
        )}>Notes & Study Materials</h1>
        <PageHelpTrigger onOpen={handleShowVideoManually} />
      </div>
      <p className={cn(
        "text-muted-foreground text-center mb-6",
        isMobile ? "text-sm px-4" : "text-base"
      )}>
        Organize your learning materials and study resources effectively
      </p>

      <FirstVisitVideoModal
        isOpen={showVideoModal}
        onClose={handleCloseVideo}
        title="How to Use Notes"
        videoUrl="https://www.youtube.com/embed/rWKlC4xFRn4?si=mzknY-IDkUaX3OEM"
      />

      <div className={cn(
        "mobile-container",
        isMobile ? "px-3" : "px-6"
      )}>
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
          <MobileTabsList isMobile={isMobile} />

          <div className="min-h-0 flex-1 mobile-content-width">
            <TabsContent value="notes" className="mt-4 mobile-safe-padding">
              <NotesSection />
            </TabsContent>

            <TabsContent value="upload" className="mt-4 mobile-safe-padding">
              <FileUploadSection />
            </TabsContent>

            <TabsContent value="flashcards" className="mt-4 mobile-safe-padding">
              <FlashcardsSection />
            </TabsContent>

            <TabsContent value="progress" className="mt-4 mobile-safe-padding">
              <ProgressSection />
            </TabsContent>
          </div>
        </Tabs>
      </div>
    </div>
  );
};

export default Notes;
