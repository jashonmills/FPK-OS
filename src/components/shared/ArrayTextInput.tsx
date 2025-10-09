import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { X, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ArrayTextInputProps {
  values: string[];
  onChange: (values: string[]) => void;
  placeholder?: string;
}

export const ArrayTextInput = ({ values, onChange, placeholder }: ArrayTextInputProps) => {
  const [inputValue, setInputValue] = useState('');

  const addItem = () => {
    if (inputValue.trim() && !values.includes(inputValue.trim())) {
      onChange([...values, inputValue.trim()]);
      setInputValue('');
    }
  };

  const removeItem = (index: number) => {
    onChange(values.filter((_, i) => i !== index));
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addItem();
    }
  };

  return (
    <div className="space-y-3">
      <div className="flex gap-2">
        <Input
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder || 'Type and press Enter to add...'}
        />
        <Button
          type="button"
          variant="outline"
          size="icon"
          onClick={addItem}
          disabled={!inputValue.trim()}
        >
          <Plus className="h-4 w-4" />
        </Button>
      </div>
      {values.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {values.map((item, index) => (
            <Badge key={index} variant="secondary" className="gap-1">
              {item}
              <X 
                className="h-3 w-3 cursor-pointer" 
                onClick={() => removeItem(index)}
              />
            </Badge>
          ))}
        </div>
      )}
    </div>
  );
};
