
import { useQuery } from '@tanstack/react-query';
import { useAuth } from '@/hooks/useAuth';
import { useFlashcards } from '@/hooks/useFlashcards';
import { useFileUploads } from '@/hooks/useFileUploads';
import { useNotes } from '@/hooks/useNotes';

export interface FlashcardSet {
  id: string;
  user_id: string;
  name: string;
  description: string | null;
  source_type: 'upload' | 'manual' | 'notes';
  source_id: string | null;
  created_at: string;
  updated_at: string;
  flashcard_count: number;
}

export const useFlashcardSets = () => {
  const { user } = useAuth();
  const { flashcards } = useFlashcards();
  const { uploads } = useFileUploads();
  const { notes } = useNotes();

  const { data: sets = [], isLoading } = useQuery({
    queryKey: ['flashcard-sets', user?.id, flashcards.length, uploads.length, notes.length],
    queryFn: async () => {
      if (!user) return [];
      
      const virtualSets: FlashcardSet[] = [];

      // Create sets from file uploads
      uploads.forEach(upload => {
        const uploadFlashcards = flashcards.filter(card => 
          card.note_id === null && // Assume cards from uploads don't have note_id
          card.created_at >= upload.created_at // Cards created after upload
        );
        
        if (uploadFlashcards.length > 0) {
          virtualSets.push({
            id: `upload_${upload.id}`,
            user_id: user.id,
            name: upload.file_name.replace(/\.[^/.]+$/, ""), // Remove file extension
            description: `Flashcards from ${upload.file_name}`,
            source_type: 'upload',
            source_id: upload.id,
            created_at: upload.created_at,
            updated_at: upload.updated_at,
            flashcard_count: uploadFlashcards.length
          });
        }
      });

      // Create sets from notes
      notes.forEach(note => {
        const noteFlashcards = flashcards.filter(card => card.note_id === note.id);
        
        if (noteFlashcards.length > 0) {
          virtualSets.push({
            id: `note_${note.id}`,
            user_id: user.id,
            name: note.title,
            description: `Flashcards from note: ${note.title}`,
            source_type: 'notes',
            source_id: note.id,
            created_at: note.created_at,
            updated_at: note.updated_at,
            flashcard_count: noteFlashcards.length
          });
        }
      });

      // Sort by created_at descending
      return virtualSets.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
    },
    enabled: !!user,
  });

  // Mock functions for compatibility (since we can't create actual sets in DB)
  const createSet = () => {
    console.warn('Creating sets not supported with current database schema');
  };

  const updateSet = () => {
    console.warn('Updating sets not supported with current database schema');
  };

  const deleteSet = () => {
    console.warn('Deleting sets not supported with current database schema');
  };

  return {
    sets,
    isLoading,
    createSet,
    updateSet,
    deleteSet,
    isCreating: false,
    isUpdating: false,
    isDeleting: false,
  };
};
