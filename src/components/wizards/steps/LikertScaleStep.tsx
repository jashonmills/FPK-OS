import { WizardStepProps } from '@/lib/wizards/types';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';

interface LikertScaleStepProps extends WizardStepProps {
  questions: Array<{
    id: string;
    text: string;
    helperText?: string;
  }>;
  scale: Array<{
    value: string;
    label: string;
  }>;
}

export const LikertScaleStep = ({ data, onUpdate, questions, scale }: LikertScaleStepProps) => {
  const handleChange = (questionId: string, value: string) => {
    onUpdate({
      ...data,
      [questionId]: value,
    });
  };

  return (
    <div className="space-y-8">
      {questions.map((question) => (
        <div key={question.id} className="space-y-3">
          <div>
            <Label className="text-base">{question.text}</Label>
            {question.helperText && (
              <p className="text-sm text-muted-foreground mt-1">{question.helperText}</p>
            )}
          </div>
          
          <RadioGroup
            value={data[question.id] || ''}
            onValueChange={(value) => handleChange(question.id, value)}
            className="flex flex-col space-y-2"
          >
            {scale.map((option) => (
              <div key={option.value} className="flex items-center space-x-2">
                <RadioGroupItem value={option.value} id={`${question.id}-${option.value}`} />
                <Label
                  htmlFor={`${question.id}-${option.value}`}
                  className="font-normal cursor-pointer"
                >
                  {option.label}
                </Label>
              </div>
            ))}
          </RadioGroup>
        </div>
      ))}
    </div>
  );
};
