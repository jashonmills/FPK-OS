import { WizardStepProps } from '@/lib/wizards/types';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';

interface MultiSelectStepProps extends WizardStepProps {
  title: string;
  description?: string;
  options: Array<{
    id: string;
    label: string;
    description?: string;
  }>;
  allowOther?: boolean;
}

export const MultiSelectStep = ({ data, onUpdate, title, description, options, allowOther }: MultiSelectStepProps) => {
  const selectedOptions = data.selected || [];
  const otherValue = data.other || '';

  const handleToggle = (optionId: string) => {
    const newSelected = selectedOptions.includes(optionId)
      ? selectedOptions.filter((id: string) => id !== optionId)
      : [...selectedOptions, optionId];
    
    onUpdate({
      ...data,
      selected: newSelected,
    });
  };

  const handleOtherChange = (value: string) => {
    onUpdate({
      ...data,
      other: value,
    });
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold">{title}</h3>
        {description && <p className="text-sm text-muted-foreground mt-1">{description}</p>}
      </div>

      <div className="space-y-3">
        {options.map((option) => (
          <div key={option.id} className="flex items-start space-x-3">
            <Checkbox
              id={option.id}
              checked={selectedOptions.includes(option.id)}
              onCheckedChange={() => handleToggle(option.id)}
            />
            <div className="grid gap-1.5 leading-none">
              <label
                htmlFor={option.id}
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
              >
                {option.label}
              </label>
              {option.description && (
                <p className="text-sm text-muted-foreground">{option.description}</p>
              )}
            </div>
          </div>
        ))}
      </div>

      {allowOther && (
        <div className="space-y-2 pt-2 border-t">
          <Label htmlFor="other">Other (please specify)</Label>
          <input
            id="other"
            type="text"
            value={otherValue}
            onChange={(e) => handleOtherChange(e.target.value)}
            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            placeholder="Enter other options..."
          />
        </div>
      )}
    </div>
  );
};
