
import React, { useState } from 'react';
import { useFlashcardPreview, type PreviewFlashcard } from '@/hooks/useFlashcardPreview';
import { useToast } from '@/hooks/use-toast';
import FlashcardPreviewCardEditor from './FlashcardPreviewCardEditor';
import FlashcardPreviewCardView from './FlashcardPreviewCardView';

interface FlashcardPreviewCardProps {
  card: PreviewFlashcard;
}

const FlashcardPreviewCard: React.FC<FlashcardPreviewCardProps> = ({ card }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({
    title: card.title || '',
    front_content: card.front_content,
    back_content: card.back_content,
  });
  const { updatePreviewCard, deletePreviewCard, approveCard } = useFlashcardPreview();
  const { toast } = useToast();

  const handleEdit = () => {
    setIsEditing(true);
    setEditData({
      title: card.title || '',
      front_content: card.front_content,
      back_content: card.back_content,
    });
  };

  const handleSaveEdit = () => {
    updatePreviewCard(card.id, {
      title: editData.title,
      front_content: editData.front_content,
      back_content: editData.back_content,
    });
    setIsEditing(false);
    toast({
      title: "✏️ Card updated",
      description: "Your changes have been saved to the preview.",
    });
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setEditData({
      title: card.title || '',
      front_content: card.front_content,
      back_content: card.back_content,
    });
  };

  const handleDelete = () => {
    if (window.confirm('Are you sure you want to delete this flashcard?')) {
      deletePreviewCard(card.id);
      toast({
        title: "🗑️ Card deleted",
        description: "The flashcard has been removed from preview.",
      });
    }
  };

  const handleApprove = async () => {
    const success = await approveCard(card.id);
    if (success) {
      toast({
        title: "✅ Card approved!",
        description: "Flashcard saved to your collection and ready for study.",
      });
    } else {
      toast({
        title: "❌ Approval failed",
        description: "Failed to save the flashcard. Please try again.",
        variant: "destructive"
      });
    }
  };

  const getStatusColor = () => {
    switch (card.status) {
      case 'new': return 'bg-blue-50 border-blue-200';
      case 'edited': return 'bg-orange-50 border-orange-200';
      case 'ready': return 'bg-green-50 border-green-200';
      default: return 'bg-gray-50 border-gray-200';
    }
  };

  return (
    <div className={`p-4 rounded-lg border-2 transition-all duration-200 ${getStatusColor()}`}>
      {isEditing ? (
        <FlashcardPreviewCardEditor
          editData={editData}
          onEditDataChange={setEditData}
          onSave={handleSaveEdit}
          onCancel={handleCancelEdit}
        />
      ) : (
        <FlashcardPreviewCardView
          card={card}
          onEdit={handleEdit}
          onDelete={handleDelete}
          onApprove={handleApprove}
        />
      )}
    </div>
  );
};

export default FlashcardPreviewCard;
