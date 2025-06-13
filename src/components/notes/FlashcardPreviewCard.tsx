
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { useFlashcardPreview, type PreviewFlashcard } from '@/hooks/useFlashcardPreview';
import { Edit, Trash2, CheckCircle, X, Save, FileText, Sparkles } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

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

  const truncateText = (text: string, maxLength: number = 100) => {
    return text.length > maxLength ? text.substring(0, maxLength) + '...' : text;
  };

  return (
    <div className={`p-4 rounded-lg border-2 transition-all duration-200 ${getStatusColor()}`}>
      {isEditing ? (
        // Edit Mode
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-gray-700">Editing Flashcard</span>
            <div className="flex gap-2">
              <Button size="sm" onClick={handleSaveEdit} className="bg-green-600 hover:bg-green-700">
                <Save className="h-3 w-3 mr-1" />
                Save
              </Button>
              <Button size="sm" variant="outline" onClick={handleCancelEdit}>
                <X className="h-3 w-3 mr-1" />
                Cancel
              </Button>
            </div>
          </div>
          
          <div className="space-y-2">
            <Input
              placeholder="Card title (optional)"
              value={editData.title}
              onChange={(e) => setEditData({ ...editData, title: e.target.value })}
              className="text-sm"
            />
            <Textarea
              placeholder="Front content"
              value={editData.front_content}
              onChange={(e) => setEditData({ ...editData, front_content: e.target.value })}
              className="min-h-[60px] text-sm"
            />
            <Textarea
              placeholder="Back content"
              value={editData.back_content}
              onChange={(e) => setEditData({ ...editData, back_content: e.target.value })}
              className="min-h-[60px] text-sm"
            />
          </div>
        </div>
      ) : (
        // View Mode
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
              <div className="flex gap-1">
                <Button size="sm" variant="ghost" onClick={handleEdit} className="h-8 w-8 p-0">
                  <Edit className="h-3 w-3" />
                </Button>
                <Button size="sm" variant="ghost" onClick={handleDelete} className="h-8 w-8 p-0 text-red-600 hover:text-red-700">
                  <Trash2 className="h-3 w-3" />
                </Button>
                <Button size="sm" onClick={handleApprove} className="bg-green-600 hover:bg-green-700 text-white">
                  <CheckCircle className="h-3 w-3 mr-1" />
                  Approve
                </Button>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div className="p-3 bg-white rounded border">
              <h5 className="text-xs font-medium text-gray-600 mb-1">FRONT</h5>
              <p className="text-sm text-gray-900">{truncateText(card.front_content)}</p>
            </div>
            <div className="p-3 bg-white rounded border">
              <h5 className="text-xs font-medium text-gray-600 mb-1">BACK</h5>
              <p className="text-sm text-gray-900">{truncateText(card.back_content)}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FlashcardPreviewCard;
