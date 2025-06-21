
import React, { useState } from 'react';
import { Tabs, TabsContent } from '@/components/ui/tabs';
import NotesSection from '@/components/notes/NotesSection';
import FileUploadSection from '@/components/notes/FileUploadSection';
import FlashcardsSection from '@/components/notes/FlashcardsSection';
import ProgressSection from '@/components/notes/ProgressSection';
import RAGProcessingPanel from '@/components/notes/RAGProcessingPanel';
import RAGStatusIndicator from '@/components/ai-coach/RAGStatusIndicator';
import MobileTabsList from '@/components/notes/MobileTabsList';
import { useIsMobile } from '@/hooks/use-mobile';

const Notes = () => {
  const [activeTab, setActiveTab] = useState('notes');
  const isMobile = useIsMobile();

  return (
    <div className="max-w-7xl mx-auto mobile-section-spacing">
      {/* Mobile-Optimized Header with RAG Status */}
      <div className="flex flex-col gap-3 sm:flex-row sm:justify-between sm:items-start sm:gap-4">
        <div>
          <h1 className="mobile-heading-xl text-gray-900">Notes & Study Materials</h1>
          <p className="text-gray-600 mt-1 mobile-text-base">
            Organize your learning materials and enhance your AI coach with personal knowledge
          </p>
        </div>
        <div className="flex-shrink-0">
          <RAGStatusIndicator compact />
        </div>
      </div>

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

          <TabsContent value="rag" className="mt-0">
            <RAGProcessingPanel />
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
