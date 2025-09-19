import React, { useState } from 'react';
import { CourseDraft, ModuleDraft, LessonDraft } from '@/types/course-builder';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Plus, GripVertical, X, Book, FileText } from 'lucide-react';
import { toast } from 'sonner';

interface LessonPlanningStepProps {
  draft: CourseDraft;
  orgId: string;
  updateCourse: (updates: Partial<CourseDraft>) => void;
  addModule: (title: string) => string | undefined;
  addLesson: (moduleId: string, title: string, description?: string) => string | undefined;
}

export const LessonPlanningStep: React.FC<LessonPlanningStepProps> = ({
  draft,
  addModule,
  addLesson,
  updateCourse
}) => {
  const [newModuleTitle, setNewModuleTitle] = useState('');
  const [newLessonTitles, setNewLessonTitles] = useState<{ [moduleId: string]: string }>({});
  const [newLessonDescriptions, setNewLessonDescriptions] = useState<{ [moduleId: string]: string }>({});

  const handleAddModule = () => {
    if (newModuleTitle.trim()) {
      const moduleId = addModule(newModuleTitle.trim());
      if (moduleId) {
        setNewModuleTitle('');
        toast.success('Module added successfully');
      }
    }
  };

  const handleAddLesson = (moduleId: string) => {
    const title = newLessonTitles[moduleId]?.trim();
    const description = newLessonDescriptions[moduleId]?.trim();
    
    if (title) {
      const lessonId = addLesson(moduleId, title, description);
      if (lessonId) {
        setNewLessonTitles(prev => ({ ...prev, [moduleId]: '' }));
        setNewLessonDescriptions(prev => ({ ...prev, [moduleId]: '' }));
        toast.success('Lesson added successfully');
      }
    }
  };

  const removeModule = (moduleId: string) => {
    const updatedModules = draft.modules.filter(m => m.id !== moduleId);
    updateCourse({ modules: updatedModules });
    toast.success('Module removed');
  };

  const removeLesson = (moduleId: string, lessonId: string) => {
    const updatedModules = draft.modules.map(module =>
      module.id === moduleId
        ? { ...module, lessons: module.lessons.filter(l => l.id !== lessonId) }
        : module
    );
    updateCourse({ modules: updatedModules });
    toast.success('Lesson removed');
  };

  const updateModuleTitle = (moduleId: string, title: string) => {
    const updatedModules = draft.modules.map(module =>
      module.id === moduleId ? { ...module, title } : module
    );
    updateCourse({ modules: updatedModules });
  };

  const updateLessonTitle = (moduleId: string, lessonId: string, title: string) => {
    const updatedModules = draft.modules.map(module =>
      module.id === moduleId
        ? {
            ...module,
            lessons: module.lessons.map(lesson =>
              lesson.id === lessonId ? { ...lesson, title } : lesson
            )
          }
        : module
    );
    updateCourse({ modules: updatedModules });
  };

  const updateLessonDescription = (moduleId: string, lessonId: string, description: string) => {
    const updatedModules = draft.modules.map(module =>
      module.id === moduleId
        ? {
            ...module,
            lessons: module.lessons.map(lesson =>
              lesson.id === lessonId ? { ...lesson, description } : lesson
            )
          }
        : module
    );
    updateCourse({ modules: updatedModules });
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h3 className="text-lg font-semibold mb-2">Structure Your Course</h3>
        <p className="text-muted-foreground">
          Organize your course into modules and lessons. Each lesson will contain multiple interactive slides.
        </p>
      </div>

      {/* Add New Module */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Plus className="w-5 h-5" />
            <span>Add Module</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex space-x-2">
            <Input
              value={newModuleTitle}
              onChange={(e) => setNewModuleTitle(e.target.value)}
              placeholder="Module title (e.g., 'Introduction to Geometry')"
              onKeyPress={(e) => e.key === 'Enter' && handleAddModule()}
              className="flex-1"
            />
            <Button onClick={handleAddModule} disabled={!newModuleTitle.trim()}>
              Add Module
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Existing Modules */}
      <div className="space-y-4">
        {draft.modules.map((module, moduleIndex) => (
          <Card key={module.id} className="border-l-4 border-l-primary">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2 flex-1">
                  <GripVertical className="w-4 h-4 text-muted-foreground" />
                  <Book className="w-5 h-5 text-primary" />
                  <Input
                    value={module.title}
                    onChange={(e) => updateModuleTitle(module.id, e.target.value)}
                    className="font-semibold border-0 p-0 h-auto bg-transparent"
                    placeholder="Module title..."
                  />
                  <Badge variant="outline">{module.lessons.length} lessons</Badge>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => removeModule(module.id)}
                  className="text-destructive hover:text-destructive"
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
            </CardHeader>
            
            <CardContent className="space-y-3">
              {/* Existing Lessons */}
              {module.lessons.map((lesson, lessonIndex) => (
                <div key={lesson.id} className="flex items-start space-x-3 p-3 bg-muted/50 rounded-lg">
                  <GripVertical className="w-4 h-4 text-muted-foreground mt-1" />
                  <FileText className="w-4 h-4 text-muted-foreground mt-1" />
                  <div className="flex-1 space-y-2">
                    <Input
                      value={lesson.title}
                      onChange={(e) => updateLessonTitle(module.id, lesson.id, e.target.value)}
                      placeholder="Lesson title..."
                      className="font-medium bg-background"
                    />
                    <Textarea
                      value={lesson.description || ''}
                      onChange={(e) => updateLessonDescription(module.id, lesson.id, e.target.value)}
                      placeholder="Lesson description (optional)..."
                      rows={2}
                      className="bg-background"
                    />
                    <div className="flex items-center justify-between text-sm text-muted-foreground">
                      <span>{lesson.slides.length} slides</span>
                      <Badge variant="secondary">Lesson {lessonIndex + 1}</Badge>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => removeLesson(module.id, lesson.id)}
                    className="text-destructive hover:text-destructive"
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              ))}

              {/* Add New Lesson */}
              <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-4">
                <div className="space-y-2">
                  <Input
                    value={newLessonTitles[module.id] || ''}
                    onChange={(e) => setNewLessonTitles(prev => ({ ...prev, [module.id]: e.target.value }))}
                    placeholder="New lesson title..."
                    onKeyPress={(e) => e.key === 'Enter' && handleAddLesson(module.id)}
                  />
                  <Textarea
                    value={newLessonDescriptions[module.id] || ''}
                    onChange={(e) => setNewLessonDescriptions(prev => ({ ...prev, [module.id]: e.target.value }))}
                    placeholder="Lesson description (optional)..."
                    rows={2}
                  />
                  <Button
                    size="sm"
                    onClick={() => handleAddLesson(module.id)}
                    disabled={!newLessonTitles[module.id]?.trim()}
                    className="w-full"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Add Lesson to {module.title}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {draft.modules.length === 0 && (
        <div className="text-center py-12 text-muted-foreground">
          <Book className="w-12 h-12 mx-auto mb-4 opacity-50" />
          <p>Add your first module to get started</p>
        </div>
      )}
    </div>
  );
};
