import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Sparkles, Plus, X, Loader2, CheckCircle, Clock, BookOpen, AlertCircle } from 'lucide-react';
import { useAICourseGeneration } from '@/hooks/useAICourseGeneration';
import { CourseContentManifest } from '@/types/lessonContent';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface AIGenerationPanelProps {
  onGenerated: (manifest: CourseContentManifest) => void;
  onCancel: () => void;
}

export const AIGenerationPanel: React.FC<AIGenerationPanelProps> = ({
  onGenerated,
  onCancel
}) => {
  const [topic, setTopic] = useState('');
  const [objectives, setObjectives] = useState<string[]>(['']);
  const [targetAudience, setTargetAudience] = useState('middle-school');
  const [lessonCount, setLessonCount] = useState(8);
  const [framework, setFramework] = useState<'sequential' | 'interactive_micro_learning'>('sequential');

  const { generateFullCourse, isGenerating, progress, error, reset } = useAICourseGeneration();

  const addObjective = () => {
    setObjectives([...objectives, '']);
  };

  const removeObjective = (index: number) => {
    setObjectives(objectives.filter((_, i) => i !== index));
  };

  const updateObjective = (index: number, value: string) => {
    const updated = [...objectives];
    updated[index] = value;
    setObjectives(updated);
  };

  const handleGenerate = async () => {
    const filteredObjectives = objectives.filter(o => o.trim());
    if (!topic.trim() || filteredObjectives.length === 0) return;

    const manifest = await generateFullCourse({
      topic: topic.trim(),
      objectives: filteredObjectives,
      targetAudience,
      lessonCount,
      framework
    });

    if (manifest) {
      onGenerated(manifest);
    }
  };

  const isValid = topic.trim() && objectives.some(o => o.trim());
  const progressPercent = progress.total > 0 
    ? Math.round((progress.current / progress.total) * 100) 
    : 0;

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <div className="p-2 rounded-lg bg-primary/10">
          <Sparkles className="w-5 h-5 text-primary" />
        </div>
        <div>
          <h3 className="text-lg font-semibold">AI Course Generator</h3>
          <p className="text-sm text-muted-foreground">
            Generate full course content with AI assistance
          </p>
        </div>
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* Input Form */}
      <Card>
        <CardContent className="pt-6 space-y-4">
          {/* Topic */}
          <div className="space-y-2">
            <Label htmlFor="topic">Course Topic *</Label>
            <Input
              id="topic"
              placeholder="e.g., Introduction to Climate Change"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              disabled={isGenerating}
            />
          </div>

          {/* Learning Objectives */}
          <div className="space-y-2">
            <Label>Learning Objectives *</Label>
            <div className="space-y-2">
              {objectives.map((obj, index) => (
                <div key={index} className="flex gap-2">
                  <Input
                    placeholder={`Objective ${index + 1}`}
                    value={obj}
                    onChange={(e) => updateObjective(index, e.target.value)}
                    disabled={isGenerating}
                  />
                  {objectives.length > 1 && (
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => removeObjective(index)}
                      disabled={isGenerating}
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  )}
                </div>
              ))}
              <Button
                variant="outline"
                size="sm"
                onClick={addObjective}
                disabled={isGenerating}
                className="mt-2"
              >
                <Plus className="w-4 h-4 mr-1" />
                Add Objective
              </Button>
            </div>
          </div>

          {/* Settings Row */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Target Audience */}
            <div className="space-y-2">
              <Label>Target Audience</Label>
              <Select value={targetAudience} onValueChange={setTargetAudience} disabled={isGenerating}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="elementary">Elementary School</SelectItem>
                  <SelectItem value="middle-school">Middle School</SelectItem>
                  <SelectItem value="high-school">High School</SelectItem>
                  <SelectItem value="college">College/University</SelectItem>
                  <SelectItem value="professional">Professional/Adult</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Lesson Count */}
            <div className="space-y-2">
              <Label>Number of Lessons</Label>
              <Select 
                value={lessonCount.toString()} 
                onValueChange={(v) => setLessonCount(parseInt(v))}
                disabled={isGenerating}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="4">4 lessons</SelectItem>
                  <SelectItem value="6">6 lessons</SelectItem>
                  <SelectItem value="8">8 lessons</SelectItem>
                  <SelectItem value="10">10 lessons</SelectItem>
                  <SelectItem value="12">12 lessons</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Framework */}
            <div className="space-y-2">
              <Label>Framework</Label>
              <Select 
                value={framework} 
                onValueChange={(v: any) => setFramework(v)}
                disabled={isGenerating}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="sequential">Sequential Learning</SelectItem>
                  <SelectItem value="interactive_micro_learning">Micro-Learning</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Progress */}
      {isGenerating && (
        <Card className="border-primary/20 bg-primary/5">
          <CardContent className="pt-6 space-y-4">
            <div className="flex items-center gap-3">
              <Loader2 className="w-5 h-5 animate-spin text-primary" />
              <div className="flex-1">
                <p className="font-medium">
                  {progress.stage === 'structure' && 'Generating course structure...'}
                  {progress.stage === 'lessons' && `Generating lesson content (${progress.current}/${progress.total})...`}
                  {progress.stage === 'complete' && 'Generation complete!'}
                </p>
                {progress.currentLesson && (
                  <p className="text-sm text-muted-foreground">{progress.currentLesson}</p>
                )}
              </div>
            </div>
            <Progress value={progressPercent} className="h-2" />
            <div className="flex items-center justify-between text-sm text-muted-foreground">
              <span>{progressPercent}% complete</span>
              <span>
                <Clock className="w-3 h-3 inline mr-1" />
                ~{Math.max(1, Math.ceil((progress.total - progress.current) * 0.5))} min remaining
              </span>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Preview Stats */}
      {!isGenerating && isValid && (
        <div className="flex flex-wrap gap-2">
          <Badge variant="secondary">
            <BookOpen className="w-3 h-3 mr-1" />
            {lessonCount} lessons
          </Badge>
          <Badge variant="secondary">
            <Clock className="w-3 h-3 mr-1" />
            ~{lessonCount * 5} min total
          </Badge>
          <Badge variant="outline">
            {framework === 'sequential' ? 'Sequential' : 'Micro-Learning'}
          </Badge>
        </div>
      )}

      {/* Actions */}
      <div className="flex justify-between">
        <Button variant="outline" onClick={onCancel} disabled={isGenerating}>
          Cancel
        </Button>
        <Button 
          onClick={handleGenerate} 
          disabled={!isValid || isGenerating}
          className="gap-2"
        >
          {isGenerating ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Generating...
            </>
          ) : (
            <>
              <Sparkles className="w-4 h-4" />
              Generate Course
            </>
          )}
        </Button>
      </div>
    </div>
  );
};
