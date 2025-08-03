import React from 'react';
import { Button } from '@/components/ui/button';
import { Save, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface SavePreviewFlashcardsButtonProps {
  uploadId: string;
  fileName: string;
  flashcardsCount: number;
  onSuccess?: () => void;
}

export const SavePreviewFlashcardsButton: React.FC<SavePreviewFlashcardsButtonProps> = ({
  uploadId,
  fileName,
  flashcardsCount,
  onSuccess
}) => {
  const [isSaving, setIsSaving] = React.useState(false);
  const { toast } = useToast();

  const saveFlashcards = async () => {
    setIsSaving(true);
    
    try {
      console.log('🔄 Attempting to save preview flashcards for upload:', uploadId);
      
      // Get current user first
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      if (userError || !user) {
        console.error('❌ User authentication failed:', userError);
        throw new Error('User not authenticated');
      }
      
      console.log('✅ User authenticated:', user.id);

      // Get the upload record
      console.log('🔍 Looking for upload record:', uploadId);
      const { data: upload, error: uploadError } = await supabase
        .from('file_uploads')
        .select('*')
        .eq('id', uploadId)
        .maybeSingle();

      console.log('📄 Upload query result:', { upload, uploadError });

      if (uploadError) {
        console.error('❌ Database error fetching upload:', uploadError);
        throw new Error(`Database error: ${uploadError.message}`);
      }

      if (!upload) {
        console.error('❌ Upload record not found for ID:', uploadId);
        throw new Error('Upload record not found. The file may have been deleted.');
      }

      console.log('✅ Found upload record:', upload);

      // Call the edge function to re-process with previewMode: false
      console.log('🚀 Calling process-file-flashcards edge function...');
      const { data, error } = await supabase.functions.invoke('process-file-flashcards', {
        body: {
          uploadId: upload.id,
          filePath: upload.storage_path,
          fileName: upload.file_name,
          fileType: upload.file_type,
          userId: user.id,
          previewMode: false // This will save to database
        }
      });

      console.log('📡 Edge function response:', { data, error });

      if (error) {
        console.error('❌ Edge function error:', error);
        throw new Error(`Edge function failed: ${error.message || 'Unknown error'}`);
      }

      console.log('✅ Flashcards saved successfully:', data);
      
      toast({
        title: "Flashcards Saved!",
        description: `Successfully saved ${data?.flashcardsGenerated || flashcardsCount} flashcards from ${fileName}. You can now use them in memory tests.`,
      });

      onSuccess?.();

    } catch (error) {
      console.error('❌ Complete error saving flashcards:', error);
      toast({
        title: "Save Failed",
        description: `${error.message || 'Failed to save flashcards. Please try again.'}`,
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Button 
      onClick={saveFlashcards}
      disabled={isSaving}
      className="bg-green-600 hover:bg-green-700 text-white"
      size="sm"
    >
      {isSaving ? (
        <Loader2 className="h-4 w-4 animate-spin mr-2" />
      ) : (
        <Save className="h-4 w-4 mr-2" />
      )}
      {isSaving ? 'Saving...' : `Save ${flashcardsCount} Flashcards`}
    </Button>
  );
};