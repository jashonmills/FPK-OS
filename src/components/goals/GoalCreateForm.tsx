
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger 
} from '@/components/ui/dialog';
import { Target, Calendar, Flag, BookOpen, Heart, Trophy, Briefcase, Brain } from 'lucide-react';
import { useGoals } from '@/hooks/useGoals';
import { useToast } from '@/hooks/use-toast';
import { useCleanup } from '@/utils/cleanupManager';
import DualLanguageText from '@/components/DualLanguageText';

interface GoalCreateFormProps {
  onGoalCreated?: () => void;
}

const GoalCreateForm: React.FC<GoalCreateFormProps> = ({ onGoalCreated }) => {
  const { createGoal, saving } = useGoals();
  const { toast } = useToast();
  const navigate = useNavigate();
  const cleanup = useCleanup('GoalCreateForm');
  const [open, setOpen] = useState(false);
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'learning',
    priority: 'medium',
    target_date: '',
  });

  // Updated categories to be relevant to Learning State course
  const categories = [
    { id: 'learning', label: 'Learning State Mastery', icon: Brain, color: 'bg-purple-100 text-purple-700' },
    { id: 'skills', label: 'Cognitive Skills', icon: BookOpen, color: 'bg-blue-100 text-blue-700' },
    { id: 'wellness', label: 'Mental Wellness', icon: Heart, color: 'bg-red-100 text-red-700' },
    { id: 'achievement', label: 'Achievement Goals', icon: Trophy, color: 'bg-green-100 text-green-700' },
  ];

  const priorities = [
    { id: 'low', label: 'Low Priority', color: 'text-gray-600', description: 'Something to work on when I have time' },
    { id: 'medium', label: 'Medium Priority', color: 'text-amber-600', description: 'Important but not urgent' },
    { id: 'high', label: 'High Priority', color: 'text-red-600', description: 'Very important to me right now' },
  ];

  const handleSubmit = async () => {
    if (!formData.title.trim()) {
      toast({
        title: "Error",
        description: "Please enter a goal title.",
        variant: "destructive",
      });
      return;
    }

    try {
      const goal = await createGoal({
        title: formData.title.trim(),
        description: formData.description.trim() || null,
        category: formData.category,
        priority: formData.priority as 'low' | 'medium' | 'high',
        target_date: formData.target_date || null,
      });

      if (goal) {
        toast({
          title: "Success!",
          description: "Your learning goal has been created successfully.",
        });
        
        setOpen(false);
        setStep(1);
        setFormData({
          title: '',
          description: '',
          category: 'learning',
          priority: 'medium',
          target_date: '',
        });
        
        // Small delay to ensure UI updates smoothly
        cleanup.setTimeout(() => {
          if (onGoalCreated) {
            onGoalCreated();
          }
        }, 100);
      }
    } catch (error) {
      console.error('Error creating goal:', error);
      
      // Show specific error message if available
      const errorMessage = error instanceof Error ? error.message : "Failed to create goal. Please try again.";
      
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
      
      // If it's an authentication error, redirect to login
      if (errorMessage.includes('Authentication')) {
        cleanup.setTimeout(() => {
          navigate('/login');
        }, 2000);
      }
    }
  };

  const nextStep = () => setStep(step + 1);
  const prevStep = () => setStep(step - 1);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="fpk-gradient text-white">
          <Target className="h-4 w-4 mr-2" />
          <DualLanguageText translationKey="dashboard.insights.createGoal" fallback="Create Goal" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="text-xl flex items-center gap-2">
            <Target className="h-5 w-5 text-purple-600" />
            Create a New Learning Goal
            <span className="text-sm font-normal text-gray-500">
              (Step {step} of 4)
            </span>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Progress indicator */}
          <div className="flex gap-2">
            {[1, 2, 3, 4].map((s) => (
              <div
                key={s}
                className={`h-2 flex-1 rounded-full ${
                  s <= step ? 'fpk-gradient' : 'bg-gray-200'
                }`}
              />
            ))}
          </div>

          {/* Step 1: Goal Title */}
          {step === 1 && (
            <div className="space-y-4">
              <div className="text-center py-4">
                <Target className="h-12 w-12 text-purple-600 mx-auto mb-3" />
                <h3 className="text-lg font-semibold mb-2">What's your Learning State goal?</h3>
                <p className="text-gray-600 text-sm">Keep it simple and clear!</p>
              </div>
              
              <div className="space-y-3">
                <Label htmlFor="title" className="text-base font-medium">
                  Goal Title *
                </Label>
                <Input
                  id="title"
                  placeholder="e.g., Complete all Learning State modules, Master focus techniques..."
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="text-base p-3 h-12"
                  maxLength={100}
                />
                <div className="text-right text-sm text-gray-500">
                  {formData.title.length}/100
                </div>
              </div>

              <Button 
                onClick={nextStep} 
                disabled={!formData.title.trim()}
                className="w-full fpk-gradient text-white h-12"
              >
                Next: Choose Category →
              </Button>
            </div>
          )}

          {/* Step 2: Category */}
          {step === 2 && (
            <div className="space-y-4">
              <div className="text-center py-4">
                <h3 className="text-lg font-semibold mb-2">What type of Learning State goal is this?</h3>
                <p className="text-gray-600 text-sm">This helps us give you better suggestions</p>
              </div>

              <div className="grid grid-cols-2 gap-3">
                {categories.map((category) => {
                  const Icon = category.icon;
                  return (
                    <button
                      key={category.id}
                      onClick={() => setFormData({ ...formData, category: category.id })}
                      className={`p-4 rounded-lg border-2 transition-all ${
                        formData.category === category.id
                          ? 'border-purple-500 bg-purple-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <div className={`w-10 h-10 rounded-lg ${category.color} flex items-center justify-center mx-auto mb-2`}>
                        <Icon className="h-5 w-5" />
                      </div>
                      <div className="text-sm font-medium text-center">
                        {category.label}
                      </div>
                    </button>
                  );
                })}
              </div>

              <div className="flex gap-3">
                <Button variant="outline" onClick={prevStep} className="flex-1">
                  ← Back
                </Button>
                <Button onClick={nextStep} className="flex-1 fpk-gradient text-white">
                  Next: Set Priority →
                </Button>
              </div>
            </div>
          )}

          {/* Step 3: Priority */}
          {step === 3 && (
            <div className="space-y-4">
              <div className="text-center py-4">
                <Flag className="h-12 w-12 text-amber-600 mx-auto mb-3" />
                <h3 className="text-lg font-semibold mb-2">How important is this goal?</h3>
                <p className="text-gray-600 text-sm">This helps you focus on what matters most</p>
              </div>

              <RadioGroup 
                value={formData.priority} 
                onValueChange={(value) => setFormData({ ...formData, priority: value })}
              >
                {priorities.map((priority) => (
                  <div 
                    key={priority.id}
                    className={`flex items-start space-x-3 p-4 rounded-lg border ${
                      formData.priority === priority.id ? 'border-purple-500 bg-purple-50' : 'border-gray-200'
                    }`}
                  >
                    <RadioGroupItem value={priority.id} id={priority.id} className="mt-1" />
                    <div className="flex-1">
                      <Label htmlFor={priority.id} className={`font-medium ${priority.color} cursor-pointer`}>
                        {priority.label}
                      </Label>
                      <p className="text-sm text-gray-600 mt-1">{priority.description}</p>
                    </div>
                  </div>
                ))}
              </RadioGroup>

              <div className="flex gap-3">
                <Button variant="outline" onClick={prevStep} className="flex-1">
                  ← Back
                </Button>
                <Button onClick={nextStep} className="flex-1 fpk-gradient text-white">
                  Next: Add Details →
                </Button>
              </div>
            </div>
          )}

          {/* Step 4: Details */}
          {step === 4 && (
            <div className="space-y-4">
              <div className="text-center py-4">
                <Calendar className="h-12 w-12 text-blue-600 mx-auto mb-3" />
                <h3 className="text-lg font-semibold mb-2">Add some details</h3>
                <p className="text-gray-600 text-sm">These are optional but helpful!</p>
              </div>

              <div className="space-y-4">
                <div>
                  <Label htmlFor="description" className="text-base font-medium">
                    Description (Optional)
                  </Label>
                  <Textarea
                    id="description"
                    placeholder="Describe your Learning State goal and why it's important for your development..."
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="mt-2 min-h-20"
                    maxLength={500}
                  />
                  <div className="text-right text-sm text-gray-500 mt-1">
                    {formData.description.length}/500
                  </div>
                </div>

                <div>
                  <Label htmlFor="target_date" className="text-base font-medium">
                    Target Date (Optional)
                  </Label>
                  <Input
                    id="target_date"
                    type="date"
                    value={formData.target_date}
                    onChange={(e) => setFormData({ ...formData, target_date: e.target.value })}
                    className="mt-2"
                    min={new Date().toISOString().split('T')[0]}
                  />
                </div>
              </div>

              <div className="flex gap-3">
                <Button variant="outline" onClick={prevStep} className="flex-1">
                  ← Back
                </Button>
                <Button 
                  onClick={handleSubmit}
                  disabled={saving}
                  className="flex-1 fpk-gradient text-white"
                >
                  {saving ? 'Creating...' : 'Create Learning Goal! 🎯'}
                </Button>
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default GoalCreateForm;
