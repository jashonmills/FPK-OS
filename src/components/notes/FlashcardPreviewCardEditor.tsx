
import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Save, X } from 'lucide-react';

interface FlashcardPreviewCardEditorProps {
  editData: {
    title: string;
    front_content: string;
    back_content: string;
  };
  onEditDataChange: (data: { title: string; front_content: string; back_content: string }) => void;
  onSave: () => void;
  onCancel: () => void;
}

const FlashcardPreviewCardEditor: React.FC<FlashcardPreviewCardEditorProps> = ({
  editData,
  onEditDataChange,
  onSave,
  onCancel
}) => {
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-gray-700">Editing Flashcard</span>
        <div className="flex gap-2">
          <Button size="sm" onClick={onSave} className="bg-green-600 hover:bg-green-700">
            <Save className="h-3 w-3 mr-1" />
            Save
          </Button>
          <Button size="sm" variant="outline" onClick={onCancel}>
            <X className="h-3 w-3 mr-1" />
            Cancel
          </Button>
        </div>
      </div>
      
      <div className="space-y-2">
        <Input
          placeholder="Card title (optional)"
          value={editData.title}
          onChange={(e) => onEditDataChange({ ...editData, title: e.target.value })}
          className="text-sm"
        />
        <Textarea
          placeholder="Front content"
          value={editData.front_content}
          onChange={(e) => onEditDataChange({ ...editData, front_content: e.target.value })}
          className="min-h-[60px] text-sm"
        />
        <Textarea
          placeholder="Back content"
          value={editData.back_content}
          onChange={(e) => onEditDataChange({ ...editData, back_content: e.target.value })}
          className="min-h-[60px] text-sm"
        />
      </div>
    </div>
  );
};

export default FlashcardPreviewCardEditor;
