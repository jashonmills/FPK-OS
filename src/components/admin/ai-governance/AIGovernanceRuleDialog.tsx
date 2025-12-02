import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { AICapability, CAPABILITY_LABELS, CAPABILITY_DESCRIPTIONS } from '@/hooks/useAIGovernanceRules';
import { Image, Code, FileText, Search, FileStack, Calculator, Pencil, BarChart3, MessageCircle } from 'lucide-react';

export interface AIRule {
  id?: string;
  name: string;
  capability: AICapability;
  description: string;
  allowed: boolean;
  roles: string[];
}

interface AIGovernanceRuleDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  rule: AIRule | null;
  onSave: (rule: AIRule) => void;
}

const CAPABILITY_ICONS: Record<AICapability, React.ComponentType<{ className?: string }>> = {
  image_generation: Image,
  code_generation: Code,
  document_creation: FileText,
  research_web_search: Search,
  content_summarization: FileStack,
  math_calculations: Calculator,
  creative_writing: Pencil,
  data_analysis: BarChart3,
  general_chat: MessageCircle,
};

const AVAILABLE_ROLES = [
  { value: 'owner', label: 'Owner' },
  { value: 'admin', label: 'Admin' },
  { value: 'instructor', label: 'Instructor' },
  { value: 'instructor_aide', label: 'Instructor Aide' },
  { value: 'student', label: 'Student' },
];

const AIGovernanceRuleDialog: React.FC<AIGovernanceRuleDialogProps> = ({ 
  open, 
  onOpenChange, 
  rule, 
  onSave 
}) => {
  const [formData, setFormData] = useState<AIRule>({
    name: '',
    capability: 'general_chat',
    description: '',
    allowed: false, // Default to blocked for new rules
    roles: ['student']
  });

  useEffect(() => {
    if (rule) {
      setFormData(rule);
    } else {
      setFormData({
        name: '',
        capability: 'general_chat',
        description: '',
        allowed: false,
        roles: ['student']
      });
    }
  }, [rule, open]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  const toggleRole = (role: string) => {
    setFormData(prev => ({
      ...prev,
      roles: prev.roles.includes(role)
        ? prev.roles.filter(r => r !== role)
        : [...prev.roles, role]
    }));
  };

  const SelectedIcon = CAPABILITY_ICONS[formData.capability];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[550px]" data-cy="rule-dialog">
        <DialogHeader>
          <DialogTitle>{rule ? 'Edit AI Rule' : 'Create New AI Rule'}</DialogTitle>
          <DialogDescription>
            Define which AI capabilities are allowed or blocked for specific roles.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-2">
            <Label htmlFor="name">Rule Name</Label>
            <Input
              id="name"
              data-cy="rule-name-input"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="e.g., Block Image Generation for Students"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="capability">AI Capability</Label>
            <Select
              value={formData.capability}
              onValueChange={(value: AICapability) => setFormData({ ...formData, capability: value })}
            >
              <SelectTrigger data-cy="rule-capability-select">
                <SelectValue placeholder="Select a capability" />
              </SelectTrigger>
              <SelectContent>
                {(Object.keys(CAPABILITY_LABELS) as AICapability[]).map((cap) => {
                  const Icon = CAPABILITY_ICONS[cap];
                  return (
                    <SelectItem key={cap} value={cap}>
                      <div className="flex items-center gap-2">
                        <Icon className="h-4 w-4" />
                        <span>{CAPABILITY_LABELS[cap]}</span>
                      </div>
                    </SelectItem>
                  );
                })}
              </SelectContent>
            </Select>
            <p className="text-xs text-muted-foreground flex items-center gap-2 mt-1">
              <SelectedIcon className="h-3 w-3" />
              {CAPABILITY_DESCRIPTIONS[formData.capability]}
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              data-cy="rule-description-input"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Describe when and why this rule applies..."
              rows={3}
            />
          </div>

          <div className="space-y-2">
            <Label>Apply to Roles</Label>
            <div className="grid grid-cols-2 gap-2 mt-2" data-cy="rule-roles-select">
              {AVAILABLE_ROLES.map(role => (
                <div key={role.value} className="flex items-center space-x-2 p-2 rounded-md border border-border hover:bg-muted/50 transition-colors">
                  <Checkbox
                    id={`role-${role.value}`}
                    checked={formData.roles.includes(role.value)}
                    onCheckedChange={() => toggleRole(role.value)}
                  />
                  <Label htmlFor={`role-${role.value}`} className="cursor-pointer flex-1">
                    {role.label}
                  </Label>
                </div>
              ))}
            </div>
          </div>

          <div className="flex items-center space-x-3 p-3 rounded-lg border border-border bg-muted/30">
            <Checkbox
              id="allowed"
              data-cy="rule-status-select"
              checked={formData.allowed}
              onCheckedChange={(checked) => setFormData({ ...formData, allowed: checked as boolean })}
            />
            <div className="flex-1">
              <Label htmlFor="allowed" className="cursor-pointer font-medium">
                {formData.allowed ? 'Allowed' : 'Blocked'}
              </Label>
              <p className="text-xs text-muted-foreground">
                {formData.allowed 
                  ? 'Users with selected roles CAN use this capability' 
                  : 'Users with selected roles CANNOT use this capability'}
              </p>
            </div>
            <div className={`w-3 h-3 rounded-full ${formData.allowed ? 'bg-green-500' : 'bg-red-500'}`} />
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" data-cy="save-rule-button" className="bg-gradient-to-r from-indigo-500 to-purple-600">
              {rule ? 'Update Rule' : 'Create Rule'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AIGovernanceRuleDialog;
