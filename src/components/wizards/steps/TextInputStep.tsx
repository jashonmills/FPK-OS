import { WizardStepProps } from '@/lib/wizards/types';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';

interface TextInputStepProps extends WizardStepProps {
  fields: Array<{
    id: string;
    label: string;
    placeholder?: string;
    type?: 'text' | 'textarea' | 'number' | 'email';
    required?: boolean;
    helperText?: string;
  }>;
}

export const TextInputStep = ({ data, onUpdate, fields }: TextInputStepProps) => {
  const handleChange = (fieldId: string, value: string) => {
    onUpdate({
      ...data,
      [fieldId]: value,
    });
  };

  return (
    <div className="space-y-6">
      {fields.map((field) => (
        <div key={field.id} className="space-y-2">
          <Label htmlFor={field.id}>
            {field.label}
            {field.required && <span className="text-destructive ml-1">*</span>}
          </Label>
          {field.type === 'textarea' ? (
            <Textarea
              id={field.id}
              value={data[field.id] || ''}
              onChange={(e) => handleChange(field.id, e.target.value)}
              placeholder={field.placeholder}
              rows={4}
              className="resize-none"
            />
          ) : (
            <Input
              id={field.id}
              type={field.type || 'text'}
              value={data[field.id] || ''}
              onChange={(e) => handleChange(field.id, e.target.value)}
              placeholder={field.placeholder}
            />
          )}
          {field.helperText && (
            <p className="text-sm text-muted-foreground">{field.helperText}</p>
          )}
        </div>
      ))}
    </div>
  );
};
