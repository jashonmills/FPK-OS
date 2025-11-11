import { AICoachCommandCenter } from '@/components/AICoachCommandCenter';
import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { DocumentReader } from '@/components/ai-coach/DocumentReader';
import { CourseContentViewer } from '@/components/ai-coach/CourseContentViewer';
import { toast } from 'sonner';

const AICoach = () => {
  const [searchParams] = useSearchParams();
  const initialTab = searchParams.get('tab') || 'chat';
  
  // State for standalone document reader (below chat module)
  const [activeDocument, setActiveDocument] = useState<any>(null);

  // Handler to open document viewer
  const handleViewDocument = (material: any) => {
    console.log('[AICoach] Opening document viewer:', material.title);
    setActiveDocument(material);
    toast.success(`Now viewing: ${material.title}`);
  };

  // Handler to close document viewer
  const handleCloseDocumentViewer = () => {
    console.log('[AICoach] Closing document viewer');
    setActiveDocument(null);
  };

  return (
    <div 
      className="min-h-screen"
      style={{
        backgroundImage: 'url(https://zgcegkmqfgznbpdplscz.supabase.co/storage/v1/object/public/home-page/home-page-background.png)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed'
      }}
    >
      <div className="flex flex-col gap-6 pb-4">
        {/* Student AI Command Center */}
        <AICoachCommandCenter 
          initialTab={initialTab} 
          onViewDocument={handleViewDocument}
        />
        
        {/* Standalone Document/Course Reader - Below Chat Module */}
        {activeDocument && (
          <div className="w-full max-w-7xl mx-auto px-4">
            <div className="h-[600px]">
              {activeDocument.type === 'course' ? (
                <CourseContentViewer
                  course={activeDocument}
                  onClose={handleCloseDocumentViewer}
                />
              ) : (
                <DocumentReader
                  document={activeDocument}
                  onClose={handleCloseDocumentViewer}
                />
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AICoach;
