import { Button } from '@/components/ui/button';

interface QuickButtonsProps {
  options: string[];
  selected?: string | string[];
  onSelect: (value: string) => void;
  multiSelect?: boolean;
  className?: string;
}

export const QuickButtons = ({
  options,
  selected,
  onSelect,
  multiSelect = false,
  className = ''
}: QuickButtonsProps) => {
  const isSelected = (option: string) => {
    if (Array.isArray(selected)) {
      return selected.includes(option);
    }
    return selected === option;
  };

  return (
    <div className={`flex flex-wrap gap-2 ${className}`}>
      {options.map((option) => (
        <Button
          key={option}
          type="button"
          variant={isSelected(option) ? 'default' : 'outline'}
          size="sm"
          onClick={() => onSelect(option)}
        >
          {option}
        </Button>
      ))}
    </div>
  );
};
