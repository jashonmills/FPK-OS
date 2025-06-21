
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { FileText, Upload, Zap, Brain } from 'lucide-react';
import NotesSection from '@/components/notes/NotesSection';
import FileUploadSection from '@/components/notes/FileUploadSection';
import FlashcardsSection from '@/components/notes/FlashcardsSection';
import ProgressSection from '@/components/notes/ProgressSection';
import RAGProcessingPanel from '@/components/notes/RAGProcessingPanel';
import RAGStatusIndicator from '@/components/ai-coach/RAGStatusIndicator';

const Notes = () => {
  const [activeTab, setActiveTab] = useState('notes');

  return (
    <div className="space-y-6">
      {/* Header with RAG Status */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Notes & Study Materials</h1>
          <p className="text-gray-600 mt-1">
            Organize your learning materials and enhance your AI coach with personal knowledge
          </p>
        </div>
        <RAGStatusIndicator compact />
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="notes" className="flex items-center gap-2">
            <FileText className="h-4 w-4" />
            Notes
          </TabsTrigger>
          <TabsTrigger value="upload" className="flex items-center gap-2">
            <Upload className="h-4 w-4" />
            Upload
          </TabsTrigger>
          <TabsTrigger value="flashcards" className="flex items-center gap-2">
            <Zap className="h-4 w-4" />
            Flashcards
          </TabsTrigger>
          <TabsTrigger value="rag" className="flex items-center gap-2">
            <Brain className="h-4 w-4" />
            AI Enhancement
          </TabsTrigger>
          <TabsTrigger value="progress" className="flex items-center gap-2">
            Progress
          </TabsTrigger>
        </TabsList>

        <TabsContent value="notes">
          <NotesSection />
        </TabsContent>

        <TabsContent value="upload">
          <FileUploadSection />
        </TabsContent>

        <TabsContent value="flashcards">
          <FlashcardsSection />
        </TabsContent>

        <TabsContent value="rag">
          <RAGProcessingPanel />
        </TabsContent>

        <TabsContent value="progress">
          <ProgressSection />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Notes;
