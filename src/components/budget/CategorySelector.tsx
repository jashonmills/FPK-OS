import { useState } from 'react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { STANDARD_CATEGORIES, CUSTOM_CATEGORY_VALUE } from '@/lib/budgetCategories';

interface CategorySelectorProps {
  value: string;
  onChange: (value: string) => void;
  existingCategories?: string[];
}

export const CategorySelector = ({
  value,
  onChange,
  existingCategories = [],
}: CategorySelectorProps) => {
  const [isCustom, setIsCustom] = useState(() => {
    return value && !STANDARD_CATEGORIES.includes(value as any);
  });

  const handleSelectChange = (selectedValue: string) => {
    if (selectedValue === CUSTOM_CATEGORY_VALUE) {
      setIsCustom(true);
      onChange('');
    } else {
      setIsCustom(false);
      onChange(selectedValue);
    }
  };

  const handleCustomInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(e.target.value);
  };

  const isDisabled = (category: string) => {
    return existingCategories.some(
      (existing) => existing.toLowerCase() === category.toLowerCase()
    );
  };

  if (isCustom) {
    return (
      <div className="flex gap-2">
        <Input
          value={value}
          onChange={handleCustomInputChange}
          placeholder="Enter custom category name..."
          autoFocus
        />
        <button
          type="button"
          onClick={() => {
            setIsCustom(false);
            onChange('');
          }}
          className="text-sm text-muted-foreground hover:text-foreground whitespace-nowrap"
        >
          Cancel
        </button>
      </div>
    );
  }

  return (
    <Select value={value} onValueChange={handleSelectChange}>
      <SelectTrigger>
        <SelectValue placeholder="Select category" />
      </SelectTrigger>
      <SelectContent>
        {STANDARD_CATEGORIES.map((category) => (
          <SelectItem
            key={category}
            value={category}
            disabled={isDisabled(category)}
          >
            {category}
            {isDisabled(category) && (
              <span className="ml-2 text-xs text-muted-foreground">(already added)</span>
            )}
          </SelectItem>
        ))}
        <SelectItem value={CUSTOM_CATEGORY_VALUE} className="text-primary">
          Custom...
        </SelectItem>
      </SelectContent>
    </Select>
  );
};
