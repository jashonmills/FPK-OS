import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';

export interface AIRule {
  id?: string;
  name: string;
  category: 'Academic' | 'Technical' | 'Creative' | 'Communication';
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

const AIGovernanceRuleDialog: React.FC<AIGovernanceRuleDialogProps> = ({ 
  open, 
  onOpenChange, 
  rule, 
  onSave 
}) => {
  const [formData, setFormData] = useState<AIRule>({
    name: '',
    category: 'Academic',
    description: '',
    allowed: true,
    roles: ['student']
  });

  useEffect(() => {
    if (rule) {
      setFormData(rule);
    } else {
      setFormData({
        name: '',
        category: 'Academic',
        description: '',
        allowed: true,
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

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>{rule ? 'Edit AI Rule' : 'Create New AI Rule'}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="name">Rule Name</Label>
            <input
              id="name"
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-3 py-2 border border-border rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary mt-1"
              required
            />
          </div>

          <div>
            <Label htmlFor="category">Category</Label>
            <select
              id="category"
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value as AIRule['category'] })}
              className="w-full px-3 py-2 border border-border rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary mt-1"
            >
              <option value="Academic">Academic</option>
              <option value="Technical">Technical</option>
              <option value="Creative">Creative</option>
              <option value="Communication">Communication</option>
            </select>
          </div>

          <div>
            <Label htmlFor="description">Description</Label>
            <textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full px-3 py-2 border border-border rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary mt-1"
              rows={3}
              required
            />
          </div>

          <div>
            <Label>Apply to Roles</Label>
            <div className="space-y-2 mt-2">
              {['admin', 'teacher', 'student'].map(role => (
                <div key={role} className="flex items-center space-x-2">
                  <Checkbox
                    id={`role-${role}`}
                    checked={formData.roles.includes(role)}
                    onCheckedChange={() => toggleRole(role)}
                  />
                  <Label htmlFor={`role-${role}`} className="capitalize cursor-pointer">
                    {role}
                  </Label>
                </div>
              ))}
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox
              id="allowed"
              checked={formData.allowed}
              onCheckedChange={(checked) => setFormData({ ...formData, allowed: checked as boolean })}
            />
            <Label htmlFor="allowed" className="cursor-pointer">
              Allow this AI usage
            </Label>
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" className="bg-gradient-to-r from-indigo-500 to-purple-600">
              {rule ? 'Update Rule' : 'Create Rule'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AIGovernanceRuleDialog;
