import { Badge } from '@/components/ui/badge';
import { X } from 'lucide-react';

interface MultiSelectButtonsProps {
  options: string[];
  selected: string[];
  onSelect: (values: string[]) => void;
  placeholder?: string;
}

export const MultiSelectButtons = ({ options, selected, onSelect, placeholder }: MultiSelectButtonsProps) => {
  const toggleOption = (option: string) => {
    if (selected.includes(option)) {
      onSelect(selected.filter(item => item !== option));
    } else {
      onSelect([...selected, option]);
    }
  };

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap gap-2">
        {options.map((option) => (
          <button
            key={option}
            type="button"
            onClick={() => toggleOption(option)}
            className={`px-4 py-2 rounded-lg border-2 transition-all ${
              selected.includes(option)
                ? 'border-primary bg-primary text-primary-foreground'
                : 'border-input hover:border-primary/50'
            }`}
          >
            {option}
          </button>
        ))}
      </div>
      {selected.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {selected.map((item) => (
            <Badge key={item} variant="secondary" className="gap-1">
              {item}
              <X 
                className="h-3 w-3 cursor-pointer" 
                onClick={() => toggleOption(item)}
              />
            </Badge>
          ))}
        </div>
      )}
      {selected.length === 0 && placeholder && (
        <p className="text-sm text-muted-foreground">{placeholder}</p>
      )}
    </div>
  );
};
