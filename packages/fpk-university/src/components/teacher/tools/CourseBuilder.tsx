import React, { useState } from 'react';
import { PlusCircle, Sparkles, Loader2, ChevronDown, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface CourseBuilderProps {
  onBack: () => void;
}

interface Lesson {
  title: string;
  objectives: string[];
  activities: string[];
  estimatedMinutes: number;
}

interface Unit {
  title: string;
  duration: string;
  lessons: Lesson[];
  isExpanded?: boolean;
}

const CourseBuilder: React.FC<CourseBuilderProps> = ({ onBack }) => {
  const [units, setUnits] = useState<Unit[]>([
    {
      title: 'Unit 1: Introduction to AI',
      duration: '2 Weeks',
      isExpanded: true,
      lessons: [
        { title: 'History of Artificial Intelligence', objectives: [], activities: [], estimatedMinutes: 45 },
        { title: 'Types of Machine Learning', objectives: [], activities: [], estimatedMinutes: 45 },
        { title: 'Ethics in AI', objectives: [], activities: [], estimatedMinutes: 45 }
      ]
    }
  ]);
  
  const [newUnitTopic, setNewUnitTopic] = useState('');
  const [newUnitDuration, setNewUnitDuration] = useState('2 weeks');
  const [newUnitGoals, setNewUnitGoals] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [showNewUnitForm, setShowNewUnitForm] = useState(false);

  const handleGenerateUnit = async () => {
    if (!newUnitTopic) {
      toast.error('Please enter a unit topic');
      return;
    }

    setIsGenerating(true);

    try {
      const { data, error } = await supabase.functions.invoke('teacher-ai-tools', {
        body: {
          toolType: 'course-outline',
          topic: newUnitTopic,
          duration: newUnitDuration,
          goals: newUnitGoals
        }
      });

      if (error) throw error;

      if (data?.result?.units) {
        const generatedUnits = data.result.units.map((u: Unit) => ({
          ...u,
          isExpanded: true
        }));
        setUnits([...units, ...generatedUnits]);
        setNewUnitTopic('');
        setNewUnitGoals('');
        setShowNewUnitForm(false);
        toast.success('Course structure generated!');
      } else {
        throw new Error('No course structure generated');
      }
    } catch (error) {
      console.error('Course generation error:', error);
      toast.error('Failed to generate course structure. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  const toggleUnit = (idx: number) => {
    const newUnits = [...units];
    newUnits[idx].isExpanded = !newUnits[idx].isExpanded;
    setUnits(newUnits);
  };

  const addLesson = (unitIdx: number) => {
    const newUnits = [...units];
    newUnits[unitIdx].lessons.push({
      title: 'New Lesson',
      objectives: [],
      activities: [],
      estimatedMinutes: 45
    });
    setUnits(newUnits);
  };

  return (
    <div className="h-full flex flex-col bg-card rounded-xl border border-border shadow-sm">
      <div className="p-6 border-b border-border flex justify-between items-center">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="sm" onClick={onBack}>Back</Button>
          <h2 className="text-xl font-bold text-foreground">Course Builder</h2>
        </div>
        <Button className="bg-primary" onClick={() => setShowNewUnitForm(!showNewUnitForm)}>
          <PlusCircle className="h-4 w-4 mr-2" /> New Unit
        </Button>
      </div>
      
      <div className="flex-1 p-8 bg-muted/30 overflow-y-auto">
        <div className="max-w-4xl mx-auto space-y-6">
          {/* New Unit Form */}
          {showNewUnitForm && (
            <div className="bg-card rounded-lg border border-primary/30 shadow-sm p-6 space-y-4">
              <h3 className="font-bold text-foreground">Generate New Unit with AI</h3>
              <div>
                <Label>Unit Topic</Label>
                <Input
                  className="mt-1"
                  placeholder="e.g., Neural Networks, Climate Change"
                  value={newUnitTopic}
                  onChange={(e) => setNewUnitTopic(e.target.value)}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Duration</Label>
                  <Input
                    className="mt-1"
                    placeholder="e.g., 2 weeks"
                    value={newUnitDuration}
                    onChange={(e) => setNewUnitDuration(e.target.value)}
                  />
                </div>
              </div>
              <div>
                <Label>Learning Goals (Optional)</Label>
                <Textarea
                  className="mt-1 h-20 resize-none"
                  placeholder="What should students learn from this unit?"
                  value={newUnitGoals}
                  onChange={(e) => setNewUnitGoals(e.target.value)}
                />
              </div>
              <div className="flex gap-2">
                <Button
                  className="bg-primary"
                  onClick={handleGenerateUnit}
                  disabled={isGenerating || !newUnitTopic}
                >
                  {isGenerating ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" /> Generating...
                    </>
                  ) : (
                    <>
                      <Sparkles className="h-4 w-4 mr-2" /> Generate Structure
                    </>
                  )}
                </Button>
                <Button variant="outline" onClick={() => setShowNewUnitForm(false)}>
                  Cancel
                </Button>
              </div>
            </div>
          )}

          {/* Existing Units */}
          {units.map((unit, unitIdx) => (
            <div key={unitIdx} className="bg-card rounded-lg border border-border shadow-sm overflow-hidden">
              <div 
                className="p-4 bg-primary/10 border-b border-primary/20 flex justify-between items-center cursor-pointer"
                onClick={() => toggleUnit(unitIdx)}
              >
                <div className="flex items-center gap-2">
                  {unit.isExpanded ? <ChevronDown className="h-4 w-4 text-primary" /> : <ChevronRight className="h-4 w-4 text-primary" />}
                  <h3 className="font-bold text-primary">{unit.title}</h3>
                </div>
                <span className="text-xs font-medium text-primary bg-card px-2 py-1 rounded border border-primary/20">
                  {unit.duration}
                </span>
              </div>
              
              {unit.isExpanded && (
                <div className="p-4 space-y-3">
                  {unit.lessons.map((lesson, lessonIdx) => (
                    <div key={lessonIdx} className="flex items-start gap-3 p-3 border border-border rounded hover:bg-muted/50">
                      <div className="h-8 w-8 rounded-full bg-muted flex items-center justify-center text-muted-foreground font-medium text-sm flex-shrink-0">
                        {lessonIdx + 1}
                      </div>
                      <div className="flex-1 min-w-0">
                        <span className="text-foreground font-medium block">{lesson.title}</span>
                        {lesson.objectives.length > 0 && (
                          <p className="text-xs text-muted-foreground mt-1">
                            {lesson.objectives.slice(0, 2).join(' • ')}
                          </p>
                        )}
                        {lesson.estimatedMinutes > 0 && (
                          <span className="text-xs text-muted-foreground">
                            ~{lesson.estimatedMinutes} min
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                  <Button 
                    variant="ghost" 
                    className="w-full text-muted-foreground hover:text-primary border border-dashed border-border hover:border-primary"
                    onClick={() => addLesson(unitIdx)}
                  >
                    <PlusCircle className="h-4 w-4 mr-2" /> Add Lesson
                  </Button>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CourseBuilder;
