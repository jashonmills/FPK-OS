import { WizardStepProps } from '@/lib/wizards/types';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { CalendarIcon } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';

interface DatePickerStepProps extends WizardStepProps {
  fields: Array<{
    id: string;
    label: string;
    required?: boolean;
    helperText?: string;
  }>;
}

export const DatePickerStep = ({ data, onUpdate, fields }: DatePickerStepProps) => {
  const handleDateChange = (fieldId: string, date: Date | undefined) => {
    onUpdate({
      ...data,
      [fieldId]: date?.toISOString(),
    });
  };

  return (
    <div className="space-y-6">
      {fields.map((field) => {
        const currentDate = data[field.id] ? new Date(data[field.id]) : undefined;
        
        return (
          <div key={field.id} className="space-y-2">
            <Label htmlFor={field.id}>
              {field.label}
              {field.required && <span className="text-destructive ml-1">*</span>}
            </Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    'w-full justify-start text-left font-normal',
                    !currentDate && 'text-muted-foreground'
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {currentDate ? format(currentDate, 'PPP') : <span>Pick a date</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={currentDate}
                  onSelect={(date) => handleDateChange(field.id, date)}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
            {field.helperText && (
              <p className="text-sm text-muted-foreground">{field.helperText}</p>
            )}
          </div>
        );
      })}
    </div>
  );
};
