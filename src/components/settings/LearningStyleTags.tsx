
import React, { useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { X, Plus } from 'lucide-react';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';

interface LearningStyleTagsProps {
  selectedStyles: string[];
  onChange: (styles: string[]) => void;
}

const PRESET_STYLES = [
  'Visual', 'Kinesthetic', 'Analytical', 'Social', 'Independent',
  'Hands-on', 'Reading', 'Listening', 'Problem-solving', 'Creative'
];

const LearningStyleTags: React.FC<LearningStyleTagsProps> = ({
  selectedStyles,
  onChange
}) => {
  const [newStyle, setNewStyle] = useState('');
  const [isOpen, setIsOpen] = useState(false);

  const addStyle = (style: string) => {
    const trimmedStyle = style.trim();
    if (trimmedStyle && !selectedStyles.includes(trimmedStyle)) {
      onChange([...selectedStyles, trimmedStyle]);
    }
  };

  const removeStyle = (style: string) => {
    onChange(selectedStyles.filter(s => s !== style));
  };

  const handleAddCustom = () => {
    if (newStyle.trim()) {
      addStyle(newStyle);
      setNewStyle('');
      setIsOpen(false);
    }
  };

  return (
    <div className="space-y-3">
      <Label>Learning Styles</Label>
      
      <div className="flex flex-wrap gap-2">
        {selectedStyles.map((style) => (
          <Badge key={style} variant="secondary" className="gap-1">
            {style}
            <button
              onClick={() => removeStyle(style)}
              className="ml-1 hover:bg-gray-200 rounded-full p-0.5"
            >
              <X className="h-3 w-3" />
            </button>
          </Badge>
        ))}
        
        <Popover open={isOpen} onOpenChange={setIsOpen}>
          <PopoverTrigger asChild>
            <Button variant="outline" size="sm" className="h-6">
              <Plus className="h-3 w-3 mr-1" />
              Add Style
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-80">
            <div className="space-y-3">
              <div>
                <Label htmlFor="custom-style">Add Custom Style</Label>
                <div className="flex gap-2 mt-1">
                  <Input
                    id="custom-style"
                    placeholder="e.g., Collaborative"
                    value={newStyle}
                    onChange={(e) => setNewStyle(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleAddCustom()}
                  />
                  <Button size="sm" onClick={handleAddCustom}>
                    Add
                  </Button>
                </div>
              </div>
              
              <div>
                <Label>Quick Add</Label>
                <div className="flex flex-wrap gap-1 mt-1">
                  {PRESET_STYLES.filter(style => !selectedStyles.includes(style)).map((style) => (
                    <Button
                      key={style}
                      variant="ghost"
                      size="sm"
                      className="h-6 text-xs"
                      onClick={() => {
                        addStyle(style);
                        setIsOpen(false);
                      }}
                    >
                      {style}
                    </Button>
                  ))}
                </div>
              </div>
            </div>
          </PopoverContent>
        </Popover>
      </div>
    </div>
  );
};

export default LearningStyleTags;
