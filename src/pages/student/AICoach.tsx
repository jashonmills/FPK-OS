import { AICoachCommandCenter } from '@/components/AICoachCommandCenter';
import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { DocumentReader } from '@/components/ai-coach/DocumentReader';
import { CourseContentViewer } from '@/components/ai-coach/CourseContentViewer';
import { toast } from 'sonner';
import type { StudentAssignment } from '@/hooks/useStudentAssignments';
import { useAssignmentActions } from '@/hooks/useAssignmentActions';
import { fetchAndExtractMaterialText, truncateToTokenLimit } from '@/utils/documentTextExtractor';

interface AICoachProps {
  defaultTab?: string;
}

const AICoach = ({ defaultTab }: AICoachProps) => {
  const [searchParams] = useSearchParams();
  const initialTab = defaultTab || searchParams.get('tab') || 'chat';
  
  // State for standalone document reader (below chat module)
  const [activeDocument, setActiveDocument] = useState<any>(null);
  
  // State for assignment-guided study
  const [activeAssignment, setActiveAssignment] = useState<StudentAssignment | null>(null);
  const [assignmentContext, setAssignmentContext] = useState<{
    materialContent: string;
    educatorInstructions: string;
    materialTitle: string;
    assignmentId: string;
  } | null>(null);
  
  const { updateAssignmentProgress } = useAssignmentActions();

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

  // Handler to start guided study with an assignment
  const handleStartStudying = async (assignment: StudentAssignment) => {
    console.log('[AICoach] Starting guided study session for assignment:', assignment.id);
    
    try {
      toast.loading('Preparing your guided study session...');
      
      // 1. Mark assignment as "started" if it's still "pending"
      if (assignment.target.status === 'pending') {
        await updateAssignmentProgress({
          assignmentId: assignment.assignment_id,
          progress: 1 // 1% to mark as started
        });
      }
      
      // 2. Extract text content from the study material
      const extractedContent = await fetchAndExtractMaterialText(assignment.resource_id);
      
      if (extractedContent.error) {
        toast.error('Could not load study material');
        console.error('[AICoach] Material extraction error:', extractedContent.error);
        return;
      }
      
      // 3. Get educator instructions from assignment metadata
      const instructions = assignment.metadata?.instructions || 
        'Help the student understand and master this material.';
      
      // 4. Truncate content to fit AI context window
      const truncatedContent = truncateToTokenLimit(extractedContent.text, 2500);
      
      // 5. Set assignment context (will be passed to AI)
      setAssignmentContext({
        materialContent: truncatedContent,
        educatorInstructions: instructions,
        materialTitle: assignment.title,
        assignmentId: assignment.assignment_id
      });
      
      setActiveAssignment(assignment);
      
      // 6. Open the document viewer for reference
      setActiveDocument({
        id: assignment.resource_id,
        title: assignment.title,
        type: assignment.type,
        file_type: 'study_material'
      });
      
      toast.success(`Starting guided study: ${assignment.title}`);
      
      // Scroll to top to see the chat
      window.scrollTo({ top: 0, behavior: 'smooth' });
      
    } catch (error) {
      console.error('[AICoach] Error starting study session:', error);
      toast.error('Failed to start study session');
    }
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
          onStartStudying={handleStartStudying}
          assignmentContext={assignmentContext}
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
