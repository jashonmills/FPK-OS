
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { FileText, Sparkles, Edit, CheckCircle } from 'lucide-react';
import { type PreviewFlashcard } from '@/hooks/useFlashcardPreview';
import FlashcardPreviewCardActions from './FlashcardPreviewCardActions';

interface FlashcardPreviewCardViewProps {
  card: PreviewFlashcard;
  onEdit: () => void;
  onDelete: () => void;
  onApprove: () => void;
}

const FlashcardPreviewCardView: React.FC<FlashcardPreviewCardViewProps> = ({
  card,
  onEdit,
  onDelete,
  onApprove
}) => {
  console.log('🎴 FlashcardPreviewCardView rendering card:', card);

  const getStatusBadge = () => {
    switch (card.status) {
      case 'new': 
        return (
          <Badge className="bg-blue-100 text-blue-800 border-blue-200">
            <Sparkles className="h-3 w-3 mr-1" />
            New
          </Badge>
        );
      case 'edited': 
        return (
          <Badge className="bg-orange-100 text-orange-800 border-orange-200">
            <Edit className="h-3 w-3 mr-1" />
            Edited
          </Badge>
        );
      case 'ready': 
        return (
          <Badge className="bg-green-100 text-green-800 border-green-200">
            <CheckCircle className="h-3 w-3 mr-1" />
            Ready
          </Badge>
        );
      default: 
        return null;
    }
  };

  const truncateText = (text: string | undefined | null, maxLength: number = 100) => {
    if (!text || typeof text !== 'string') {
      console.log('⚠️ truncateText received invalid text:', text);
      return '';
    }
    return text.length > maxLength ? text.substring(0, maxLength) + '...' : text;
  };

  const frontContent = truncateText(card.front_content);
  const backContent = truncateText(card.back_content);

  console.log('📝 Card content for display:', {
    originalFront: card.front_content,
    originalBack: card.back_content,
    truncatedFront: frontContent,
    truncatedBack: backContent
  });

  return (
    <div className="space-y-3">
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-2">
          <FileText className="h-4 w-4 text-gray-500 flex-shrink-0" />
          <div className="min-w-0 flex-1">
            {card.title && (
              <h4 className="font-medium text-sm text-gray-900 truncate">
                {card.title}
              </h4>
            )}
            <p className="text-xs text-gray-500">
              Source: {card.source} • {new Date(card.created_at).toLocaleTimeString()}
            </p>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          {getStatusBadge()}
          <FlashcardPreviewCardActions
            onEdit={onEdit}
            onDelete={onDelete}
            onApprove={onApprove}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <div className="p-3 bg-white rounded border">
          <h5 className="text-xs font-medium text-gray-600 mb-1">FRONT</h5>
          <p className="text-sm text-gray-900">{frontContent || '(No content)'}</p>
        </div>
        <div className="p-3 bg-white rounded border">
          <h5 className="text-xs font-medium text-gray-600 mb-1">BACK</h5>
          <p className="text-sm text-gray-900">{backContent || '(No content)'}</p>
        </div>
      </div>
    </div>
  );
};

export default FlashcardPreviewCardView;
