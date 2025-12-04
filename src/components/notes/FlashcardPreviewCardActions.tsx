
import React from 'react';
import { Button } from '@/components/ui/button';
import { Edit, Trash2, CheckCircle } from 'lucide-react';

interface FlashcardPreviewCardActionsProps {
  onEdit: () => void;
  onDelete: () => void;
  onApprove: () => void;
}

const FlashcardPreviewCardActions: React.FC<FlashcardPreviewCardActionsProps> = ({
  onEdit,
  onDelete,
  onApprove
}) => {
  return (
    <div className="flex gap-1">
      <Button size="sm" variant="ghost" onClick={onEdit} className="h-8 w-8 p-0">
        <Edit className="h-3 w-3" />
      </Button>
      <Button size="sm" variant="ghost" onClick={onDelete} className="h-8 w-8 p-0 text-red-600 hover:text-red-700">
        <Trash2 className="h-3 w-3" />
      </Button>
      <Button size="sm" onClick={onApprove} className="bg-green-600 hover:bg-green-700 text-white">
        <CheckCircle className="h-3 w-3 mr-1" />
        Approve
      </Button>
    </div>
  );
};

export default FlashcardPreviewCardActions;
