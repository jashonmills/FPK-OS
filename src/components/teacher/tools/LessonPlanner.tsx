import React, { useState } from 'react';
import { BookOpen, Save, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';

interface LessonPlannerProps {
  onBack: () => void;
}

const LessonPlanner: React.FC<LessonPlannerProps> = ({ onBack }) => {
  const [formData, setFormData] = useState({
    topic: '',
    grade: '',
    duration: '60',
    objectives: ''
  });
  const [generatedPlan, setGeneratedPlan] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  const handleGenerate = () => {
    if (!formData.topic) return;
    setIsGenerating(true);
    setTimeout(() => {
      setGeneratedPlan(`
# Lesson Plan: ${formData.topic}
## Grade Level: ${formData.grade} | Duration: ${formData.duration} mins

### Learning Objectives
1. Understand the core concepts of ${formData.topic}
2. Apply knowledge through interactive activities
3. Analyze real-world examples

### Materials Needed
- Whiteboard and markers
- Handout 1A (generated below)
- Projector

### Lesson Outline
**1. Introduction (10 mins)**
   - Hook: Ask students "Why does ${formData.topic} matter?"
   - Brief overview of key terms.

**2. Direct Instruction (20 mins)**
   - Presentation on main concepts.
   - Guided practice with examples.

**3. Activity: Group Work (20 mins)**
   - Divide class into groups of 4.
   - Task: Solve problem set B.

**4. Assessment & Closing (10 mins)**
   - Exit ticket: Write one thing learned and one question remaining.
      `);
      setIsGenerating(false);
    }, 2000);
  };

  return (
    <div className="h-full flex gap-6">
      <div className="w-[400px] flex flex-col gap-4 overflow-y-auto">
        <div className="bg-card p-6 rounded-xl border border-border shadow-sm">
          <div className="flex items-center gap-3 mb-6">
            <Button variant="ghost" size="sm" onClick={onBack}>Back</Button>
            <h2 className="text-lg font-bold text-foreground">Lesson Details</h2>
          </div>
          
          <div className="space-y-4">
            <div>
              <Label>Topic / Subject</Label>
              <Input 
                className="mt-1"
                placeholder="e.g., Photosynthesis, World War II"
                value={formData.topic}
                onChange={e => setFormData({...formData, topic: e.target.value})}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Grade Level</Label>
                <Input 
                  className="mt-1"
                  placeholder="e.g., 10th Grade"
                  value={formData.grade}
                  onChange={e => setFormData({...formData, grade: e.target.value})}
                />
              </div>
              <div>
                <Label>Duration (min)</Label>
                <Input 
                  className="mt-1"
                  type="number"
                  value={formData.duration}
                  onChange={e => setFormData({...formData, duration: e.target.value})}
                />
              </div>
            </div>
            <div>
              <Label>Key Objectives (Optional)</Label>
              <Textarea 
                className="mt-1 h-24 resize-none"
                placeholder="Specific goals for this lesson..."
                value={formData.objectives}
                onChange={e => setFormData({...formData, objectives: e.target.value})}
              />
            </div>
            <Button 
              className="w-full bg-blue-600 hover:bg-blue-700" 
              onClick={handleGenerate}
              disabled={isGenerating || !formData.topic}
            >
              {isGenerating ? (
                <>Generating Plan...</>
              ) : (
                <>
                  <Sparkles className="h-4 w-4 mr-2" /> Generate Lesson Plan
                </>
              )}
            </Button>
          </div>
        </div>
      </div>

      <div className="flex-1 bg-card rounded-xl border border-border shadow-sm overflow-hidden flex flex-col">
        {generatedPlan ? (
          <div className="flex-1 flex flex-col">
            <div className="p-4 border-b border-border bg-muted/50 flex justify-between items-center">
              <h3 className="font-semibold text-foreground">Generated Plan</h3>
              <div className="flex gap-2">
                <Button variant="outline" size="sm"><Save className="h-4 w-4 mr-2" /> Save</Button>
              </div>
            </div>
            <div className="flex-1 p-8 overflow-auto bg-card">
              <pre className="whitespace-pre-wrap font-sans text-muted-foreground leading-relaxed">{generatedPlan}</pre>
            </div>
          </div>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-muted-foreground p-8 text-center">
            <div className="bg-blue-500/10 p-4 rounded-full mb-4">
              <BookOpen className="h-12 w-12 text-blue-500/50" />
            </div>
            <h3 className="text-lg font-medium text-foreground mb-2">Ready to Plan</h3>
            <p className="max-w-md">Enter your lesson details on the left and let AI structure a complete lesson plan for you in seconds.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default LessonPlanner;
