
import React from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Folder, FileText, Users } from 'lucide-react';

interface FlashcardSelectionHeaderProps {
  showIndividualCards: boolean;
  onToggleView: (showIndividual: boolean) => void;
  onSelectAll: () => void;
  selectedCount: number;
}

const FlashcardSelectionHeader: React.FC<FlashcardSelectionHeaderProps> = ({
  showIndividualCards,
  onToggleView,
  onSelectAll,
  selectedCount
}) => {
  return (
    <div className="space-y-4 mb-4">
      <div className="flex items-center justify-between">
        <div className="flex gap-2">
          <Button 
            variant={!showIndividualCards ? "default" : "outline"}
            size="sm"
            onClick={() => onToggleView(false)}
          >
            <Folder className="h-4 w-4 mr-1" />
            By Folders
          </Button>
          <Button 
            variant={showIndividualCards ? "default" : "outline"}
            size="sm"
            onClick={() => onToggleView(true)}
          >
            <FileText className="h-4 w-4 mr-1" />
            Individual Cards
          </Button>
        </div>
        
        {!showIndividualCards && (
          <Button variant="outline" size="sm" onClick={onSelectAll}>
            <Users className="h-4 w-4 mr-1" />
            Select All Folders
          </Button>
        )}
      </div>

      <div className="text-sm text-gray-600">
        Selected: <Badge variant="secondary">{selectedCount} cards</Badge>
      </div>
    </div>
  );
};

export default FlashcardSelectionHeader;
