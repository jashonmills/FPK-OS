import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { InfoTooltip } from "@/components/shared/InfoTooltip";

export type FocusArea = 'comprehensive' | 'behavioral' | 'skill' | 'intervention' | 'sensory' | 'environmental';

interface FocusAreaSelectorProps {
  value: FocusArea;
  onChange: (value: FocusArea) => void;
}

const FOCUS_AREAS = [
  { 
    value: 'comprehensive' as FocusArea, 
    label: 'Comprehensive Overview',
    description: 'Balanced analysis across all domains (academics, behavior, social, sensory)'
  },
  { 
    value: 'behavioral' as FocusArea, 
    label: 'Behavioral Triggers & Patterns',
    description: 'Deep ABC analysis, function hypothesis, antecedent patterns'
  },
  { 
    value: 'skill' as FocusArea, 
    label: 'Skill Acquisition & Progress',
    description: 'Learning rates, mastery levels, IEP goal progress tracking'
  },
  { 
    value: 'intervention' as FocusArea, 
    label: 'Intervention Effectiveness',
    description: 'Strategy comparison, evidence ratings, what works vs. what doesn\'t'
  },
  { 
    value: 'sensory' as FocusArea, 
    label: 'Sensory & Physiological',
    description: 'Sleep-behavior correlation, sensory profile, regulation patterns'
  },
  { 
    value: 'environmental' as FocusArea, 
    label: 'Environmental & Contextual',
    description: 'Setting analysis, social dynamics, environmental triggers'
  },
];

export const FocusAreaSelector = ({ value, onChange }: FocusAreaSelectorProps) => {
  const selectedArea = FOCUS_AREAS.find(area => area.value === value);

  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2">
        <Label htmlFor="focus-area">Report Focus Area</Label>
        <InfoTooltip content="Choose the primary focus for the AI analysis. Each area uses specialized prompts and emphasizes different aspects of your student's data." />
      </div>
      
      <Select value={value} onValueChange={(val) => onChange(val as FocusArea)}>
        <SelectTrigger id="focus-area" className="w-full">
          <SelectValue placeholder="Select focus area" />
        </SelectTrigger>
        <SelectContent className="bg-background z-50">
          {FOCUS_AREAS.map((area) => (
            <SelectItem key={area.value} value={area.value} className="cursor-pointer">
              <div className="flex flex-col">
                <span className="font-medium">{area.label}</span>
                <span className="text-xs text-muted-foreground">{area.description}</span>
              </div>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {selectedArea && (
        <p className="text-sm text-muted-foreground">
          {selectedArea.description}
        </p>
      )}
    </div>
  );
};
