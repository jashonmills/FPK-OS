import { WizardStepProps } from '@/lib/wizards/types';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { TextareaWithVoice } from '@/components/shared/TextareaWithVoice';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { CalendarIcon } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';

const DISABILITY_CATEGORIES = [
  { value: 'autism', label: 'Autism Spectrum Disorder' },
  { value: 'specific-learning-disability', label: 'Specific Learning Disability' },
  { value: 'speech-language-impairment', label: 'Speech or Language Impairment' },
  { value: 'intellectual-disability', label: 'Intellectual Disability' },
  { value: 'emotional-disturbance', label: 'Emotional Disturbance' },
  { value: 'other-health-impairment', label: 'Other Health Impairment (ADHD, etc.)' },
  { value: 'developmental-delay', label: 'Developmental Delay' },
  { value: 'hearing-impairment', label: 'Hearing Impairment' },
  { value: 'visual-impairment', label: 'Visual Impairment' },
  { value: 'orthopedic-impairment', label: 'Orthopedic Impairment' },
  { value: 'traumatic-brain-injury', label: 'Traumatic Brain Injury' },
  { value: 'multiple-disabilities', label: 'Multiple Disabilities' },
  { value: 'other', label: 'Other (specify below)' },
];

const GRADE_LEVELS = [
  'Pre-K', 'Kindergarten', '1st', '2nd', '3rd', '4th', '5th', '6th', 
  '7th', '8th', '9th', '10th', '11th', '12th', 'Post-Secondary'
];

export const StudentOverviewStep = ({ data, onUpdate }: WizardStepProps) => {
  const dateOfBirth = data.dateOfBirth ? new Date(data.dateOfBirth) : undefined;

  const handleDateSelect = (date: Date | undefined) => {
    onUpdate({
      ...data,
      dateOfBirth: date?.toISOString(),
    });
  };

  return (
    <div className="space-y-6">
      {/* Student Name */}
      <div className="space-y-2">
        <Label htmlFor="studentName">
          Student Name <span className="text-destructive">*</span>
        </Label>
        <Input
          id="studentName"
          value={data.studentName || ''}
          onChange={(e) => onUpdate({ ...data, studentName: e.target.value })}
          placeholder="Enter student's full name"
        />
      </div>

      {/* Current Grade */}
      <div className="space-y-2">
        <Label htmlFor="grade">
          Current Grade <span className="text-destructive">*</span>
        </Label>
        <Select
          value={data.grade || ''}
          onValueChange={(value) => onUpdate({ ...data, grade: value })}
        >
          <SelectTrigger id="grade">
            <SelectValue placeholder="Select grade level" />
          </SelectTrigger>
          <SelectContent>
            {GRADE_LEVELS.map((grade) => (
              <SelectItem key={grade} value={grade}>
                {grade}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Date of Birth */}
      <div className="space-y-2">
        <Label>
          Date of Birth <span className="text-destructive">*</span>
        </Label>
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className={cn(
                "w-full justify-start text-left font-normal",
                !dateOfBirth && "text-muted-foreground"
              )}
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {dateOfBirth ? format(dateOfBirth, "PPP") : <span>Pick a date</span>}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              mode="single"
              selected={dateOfBirth}
              onSelect={handleDateSelect}
              disabled={(date) =>
                date > new Date() || date < new Date("1900-01-01")
              }
              initialFocus
              className={cn("p-3 pointer-events-auto")}
            />
          </PopoverContent>
        </Popover>
      </div>

      {/* Primary Disability */}
      <div className="space-y-2">
        <Label htmlFor="primaryDisability">
          Primary Disability Category <span className="text-destructive">*</span>
        </Label>
        <Select
          value={data.primaryDisability || ''}
          onValueChange={(value) => onUpdate({ ...data, primaryDisability: value })}
        >
          <SelectTrigger id="primaryDisability">
            <SelectValue placeholder="Select primary disability" />
          </SelectTrigger>
          <SelectContent>
            {DISABILITY_CATEGORIES.map((category) => (
              <SelectItem key={category.value} value={category.value}>
                {category.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Secondary Disabilities */}
      <div className="space-y-2">
        <Label htmlFor="secondaryDisabilities">
          Secondary Disabilities (if any)
        </Label>
        <TextareaWithVoice
          id="secondaryDisabilities"
          value={data.secondaryDisabilities || ''}
          onChange={(e) => onUpdate({ ...data, secondaryDisabilities: e.target.value })}
          placeholder="Describe any secondary disabilities or related conditions..."
          rows={4}
        />
      </div>
    </div>
  );
};
