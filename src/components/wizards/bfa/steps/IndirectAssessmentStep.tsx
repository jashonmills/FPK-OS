import { WizardStepProps } from '@/lib/wizards/types';
import { AdvocateCommentary } from '@/components/wizards/shared/AdvocateCommentary';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

const SETTING_OPTIONS = {
  locations: [
    { id: 'home', label: 'Home' },
    { id: 'school', label: 'School' },
    { id: 'community', label: 'Community Settings' },
    { id: 'transitions', label: 'Transitions Between Locations' },
  ],
  times: [
    { id: 'morning', label: 'Morning (6-9am)' },
    { id: 'midday', label: 'Mid-day (9am-3pm)' },
    { id: 'afternoon', label: 'Afternoon (3-6pm)' },
    { id: 'evening', label: 'Evening (6-9pm)' },
    { id: 'night', label: 'Night (9pm+)' },
  ],
  people: [
    { id: 'parent', label: 'Parent' },
    { id: 'sibling', label: 'Sibling(s)' },
    { id: 'teacher', label: 'Teacher/Educator' },
    { id: 'peers', label: 'Peers/Classmates' },
    { id: 'strangers', label: 'Strangers/Unfamiliar People' },
    { id: 'alone', label: 'When Alone' },
  ],
};

const ANTECEDENT_OPTIONS = {
  demands: [
    { id: 'academic_work', label: 'Academic work presented' },
    { id: 'transition_requested', label: 'Transition requested' },
    { id: 'difficult_task', label: 'Difficult/non-preferred task' },
    { id: 'task_too_long', label: 'Task duration too long' },
  ],
  social: [
    { id: 'attention_removed', label: 'Attention removed or denied' },
    { id: 'told_no', label: 'Request denied ("told no")' },
    { id: 'peer_conflict', label: 'Peer conflict or teasing' },
    { id: 'crowding', label: 'Too many people/crowding' },
  ],
  environmental: [
    { id: 'loud_noises', label: 'Loud noises or unexpected sounds' },
    { id: 'bright_lights', label: 'Bright lights or visual overstimulation' },
    { id: 'routine_change', label: 'Change in routine or schedule' },
    { id: 'unstructured_time', label: 'Unstructured time' },
    { id: 'temperature', label: 'Temperature extremes' },
  ],
  internal: [
    { id: 'tired', label: 'Tired/fatigued' },
    { id: 'hungry', label: 'Hungry/thirsty' },
    { id: 'sick', label: 'Sick or in pain' },
    { id: 'anxious', label: 'Anxious or overwhelmed' },
  ],
};

const CONSEQUENCE_OPTIONS = {
  attention: [
    { id: 'adult_attention', label: 'Adult attention (correction, comfort, discussion)' },
    { id: 'peer_attention', label: 'Peer attention (laughter, shock, concern)' },
  ],
  escape: [
    { id: 'task_removed', label: 'Task removed or delayed' },
    { id: 'allowed_leave', label: 'Allowed to leave the situation' },
    { id: 'break_provided', label: 'Break provided' },
  ],
  tangible: [
    { id: 'item_provided', label: 'Item/activity provided' },
    { id: 'access_preferred', label: 'Access to preferred item/activity' },
  ],
  sensory: [
    { id: 'sensory_stimulation', label: 'Sensory stimulation (movement, sound, visual)' },
    { id: 'sensory_reduction', label: 'Sensory reduction (quieter, calmer environment)' },
  ],
};

const SKILLS_ASSESSMENT = [
  { id: 'request_break', label: 'Request a break appropriately' },
  { id: 'ask_help', label: 'Ask for help when frustrated' },
  { id: 'communicate_confusion', label: 'Communicate "I don\'t understand"' },
  { id: 'request_attention', label: 'Request attention appropriately' },
  { id: 'express_frustration', label: 'Express frustration with words' },
  { id: 'name_emotions', label: 'Identify and name emotions' },
  { id: 'self_calm', label: 'Use a self-calming strategy independently' },
  { id: 'wait_patiently', label: 'Wait patiently for preferred items' },
];

const SKILL_LEVELS = [
  { value: 'yes', label: 'Yes' },
  { value: 'sometimes', label: 'Sometimes' },
  { value: 'emerging', label: 'Emerging' },
  { value: 'no', label: 'No' },
];

export const IndirectAssessmentStep = ({ data, onUpdate }: WizardStepProps) => {
  const toggleSelection = (category: string, id: string) => {
    const current = data[category] || [];
    const updated = current.includes(id)
      ? current.filter((item: string) => item !== id)
      : [...current, id];
    onUpdate({ ...data, [category]: updated });
  };

  const setSkillLevel = (skillId: string, level: string) => {
    const skills = data.skillsDeficit || {};
    onUpdate({ ...data, skillsDeficit: { ...skills, [skillId]: level } });
  };

  const isSelected = (category: string, id: string) => {
    return (data[category] || []).includes(id);
  };

  const getSkillLevel = (skillId: string) => {
    return data.skillsDeficit?.[skillId] || '';
  };

  return (
    <div className="space-y-6">
      <AdvocateCommentary
        what="Gather background information through a structured interview."
        why="This step is like a clinical interview to capture your expert perspective as a parent. Your insights about patterns, triggers, and your child's skills are invaluable for understanding the behavior's function."
        how="Answer each section honestly based on your observations. The AI will pre-fill what it can from your logs, but your direct input fills in the gaps that data alone can't capture."
      />

      <Tabs defaultValue="setting" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="setting">Setting</TabsTrigger>
          <TabsTrigger value="antecedents">Triggers</TabsTrigger>
          <TabsTrigger value="consequences">Outcomes</TabsTrigger>
          <TabsTrigger value="skills">Skills</TabsTrigger>
        </TabsList>

        {/* Section 1: Setting & Environmental Analysis */}
        <TabsContent value="setting" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Setting & Environmental Analysis</CardTitle>
              <CardDescription>
                Where and when does this behavior most commonly occur? Who is typically present?
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-3">
                <Label className="text-base font-semibold">Locations</Label>
                <div className="grid grid-cols-2 gap-3">
                  {SETTING_OPTIONS.locations.map((option) => (
                    <div key={option.id} className="flex items-center space-x-2">
                      <Checkbox
                        id={`location-${option.id}`}
                        checked={isSelected('settingLocations', option.id)}
                        onCheckedChange={() => toggleSelection('settingLocations', option.id)}
                      />
                      <Label htmlFor={`location-${option.id}`} className="font-normal cursor-pointer">
                        {option.label}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-3">
                <Label className="text-base font-semibold">Times of Day</Label>
                <div className="grid grid-cols-2 gap-3">
                  {SETTING_OPTIONS.times.map((option) => (
                    <div key={option.id} className="flex items-center space-x-2">
                      <Checkbox
                        id={`time-${option.id}`}
                        checked={isSelected('settingTimes', option.id)}
                        onCheckedChange={() => toggleSelection('settingTimes', option.id)}
                      />
                      <Label htmlFor={`time-${option.id}`} className="font-normal cursor-pointer">
                        {option.label}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-3">
                <Label className="text-base font-semibold">People Present</Label>
                <div className="grid grid-cols-2 gap-3">
                  {SETTING_OPTIONS.people.map((option) => (
                    <div key={option.id} className="flex items-center space-x-2">
                      <Checkbox
                        id={`people-${option.id}`}
                        checked={isSelected('settingPeople', option.id)}
                        onCheckedChange={() => toggleSelection('settingPeople', option.id)}
                      />
                      <Label htmlFor={`people-${option.id}`} className="font-normal cursor-pointer">
                        {option.label}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Section 2: Antecedent Checklist */}
        <TabsContent value="antecedents" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Antecedent Checklist</CardTitle>
              <CardDescription>
                What typically happens RIGHT BEFORE the behavior? Select all triggers you've observed.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <Label className="text-base font-semibold">Demands/Tasks</Label>
                  <Badge variant="outline">What's being asked of them?</Badge>
                </div>
                <div className="grid grid-cols-1 gap-3">
                  {ANTECEDENT_OPTIONS.demands.map((option) => (
                    <div key={option.id} className="flex items-center space-x-2">
                      <Checkbox
                        id={`demand-${option.id}`}
                        checked={isSelected('antecedentDemands', option.id)}
                        onCheckedChange={() => toggleSelection('antecedentDemands', option.id)}
                      />
                      <Label htmlFor={`demand-${option.id}`} className="font-normal cursor-pointer">
                        {option.label}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <Label className="text-base font-semibold">Social Triggers</Label>
                  <Badge variant="outline">Interpersonal factors</Badge>
                </div>
                <div className="grid grid-cols-1 gap-3">
                  {ANTECEDENT_OPTIONS.social.map((option) => (
                    <div key={option.id} className="flex items-center space-x-2">
                      <Checkbox
                        id={`social-${option.id}`}
                        checked={isSelected('antecedentSocial', option.id)}
                        onCheckedChange={() => toggleSelection('antecedentSocial', option.id)}
                      />
                      <Label htmlFor={`social-${option.id}`} className="font-normal cursor-pointer">
                        {option.label}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <Label className="text-base font-semibold">Environmental Triggers</Label>
                  <Badge variant="outline">Physical surroundings</Badge>
                </div>
                <div className="grid grid-cols-1 gap-3">
                  {ANTECEDENT_OPTIONS.environmental.map((option) => (
                    <div key={option.id} className="flex items-center space-x-2">
                      <Checkbox
                        id={`env-${option.id}`}
                        checked={isSelected('antecedentEnvironmental', option.id)}
                        onCheckedChange={() => toggleSelection('antecedentEnvironmental', option.id)}
                      />
                      <Label htmlFor={`env-${option.id}`} className="font-normal cursor-pointer">
                        {option.label}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <Label className="text-base font-semibold">Internal State</Label>
                  <Badge variant="outline">Physical/emotional state</Badge>
                </div>
                <div className="grid grid-cols-1 gap-3">
                  {ANTECEDENT_OPTIONS.internal.map((option) => (
                    <div key={option.id} className="flex items-center space-x-2">
                      <Checkbox
                        id={`internal-${option.id}`}
                        checked={isSelected('antecedentInternal', option.id)}
                        onCheckedChange={() => toggleSelection('antecedentInternal', option.id)}
                      />
                      <Label htmlFor={`internal-${option.id}`} className="font-normal cursor-pointer">
                        {option.label}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Section 3: Consequence Checklist */}
        <TabsContent value="consequences" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Consequence Checklist</CardTitle>
              <CardDescription>
                What typically happens RIGHT AFTER the behavior? What does the child get or avoid?
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <Label className="text-base font-semibold">Attention Outcomes</Label>
                  <Badge variant="outline">Social response</Badge>
                </div>
                <div className="grid grid-cols-1 gap-3">
                  {CONSEQUENCE_OPTIONS.attention.map((option) => (
                    <div key={option.id} className="flex items-center space-x-2">
                      <Checkbox
                        id={`attn-${option.id}`}
                        checked={isSelected('consequenceAttention', option.id)}
                        onCheckedChange={() => toggleSelection('consequenceAttention', option.id)}
                      />
                      <Label htmlFor={`attn-${option.id}`} className="font-normal cursor-pointer">
                        {option.label}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <Label className="text-base font-semibold">Escape/Avoidance Outcomes</Label>
                  <Badge variant="outline">Getting out of something</Badge>
                </div>
                <div className="grid grid-cols-1 gap-3">
                  {CONSEQUENCE_OPTIONS.escape.map((option) => (
                    <div key={option.id} className="flex items-center space-x-2">
                      <Checkbox
                        id={`escape-${option.id}`}
                        checked={isSelected('consequenceEscape', option.id)}
                        onCheckedChange={() => toggleSelection('consequenceEscape', option.id)}
                      />
                      <Label htmlFor={`escape-${option.id}`} className="font-normal cursor-pointer">
                        {option.label}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <Label className="text-base font-semibold">Tangible Outcomes</Label>
                  <Badge variant="outline">Getting something</Badge>
                </div>
                <div className="grid grid-cols-1 gap-3">
                  {CONSEQUENCE_OPTIONS.tangible.map((option) => (
                    <div key={option.id} className="flex items-center space-x-2">
                      <Checkbox
                        id={`tangible-${option.id}`}
                        checked={isSelected('consequenceTangible', option.id)}
                        onCheckedChange={() => toggleSelection('consequenceTangible', option.id)}
                      />
                      <Label htmlFor={`tangible-${option.id}`} className="font-normal cursor-pointer">
                        {option.label}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <Label className="text-base font-semibold">Sensory Outcomes</Label>
                  <Badge variant="outline">Sensory experience</Badge>
                </div>
                <div className="grid grid-cols-1 gap-3">
                  {CONSEQUENCE_OPTIONS.sensory.map((option) => (
                    <div key={option.id} className="flex items-center space-x-2">
                      <Checkbox
                        id={`sensory-${option.id}`}
                        checked={isSelected('consequenceSensory', option.id)}
                        onCheckedChange={() => toggleSelection('consequenceSensory', option.id)}
                      />
                      <Label htmlFor={`sensory-${option.id}`} className="font-normal cursor-pointer">
                        {option.label}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Section 4: Skills Deficit Analysis */}
        <TabsContent value="skills" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Communication & Coping Skills Assessment</CardTitle>
              <CardDescription>
                This is critical: Does your child have reliable, functional ways to communicate these needs? 
                A skills deficit often explains why challenging behaviors occur.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {SKILLS_ASSESSMENT.map((skill) => (
                <div key={skill.id} className="space-y-2 pb-4 border-b last:border-0">
                  <Label className="font-medium">{skill.label}</Label>
                  <RadioGroup
                    value={getSkillLevel(skill.id)}
                    onValueChange={(value) => setSkillLevel(skill.id, value)}
                    className="flex gap-4"
                  >
                    {SKILL_LEVELS.map((level) => (
                      <div key={level.value} className="flex items-center space-x-2">
                        <RadioGroupItem value={level.value} id={`${skill.id}-${level.value}`} />
                        <Label htmlFor={`${skill.id}-${level.value}`} className="font-normal cursor-pointer">
                          {level.label}
                        </Label>
                      </div>
                    ))}
                  </RadioGroup>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};