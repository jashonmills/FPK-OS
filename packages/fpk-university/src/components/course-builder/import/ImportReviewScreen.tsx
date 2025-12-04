import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  ChevronRight, 
  ChevronDown, 
  FileText, 
  AlertTriangle, 
  CheckCircle, 
  Edit,
  Eye,
  BookOpen,
  Clock,
  Users
} from 'lucide-react';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';

interface ImportReviewScreenProps {
  importData: any;
  onPublish: (overrides: any) => void;
  onEdit: () => void;
  onReImport: () => void;
  isPublishing?: boolean;
}

export const ImportReviewScreen: React.FC<ImportReviewScreenProps> = ({
  importData,
  onPublish,
  onEdit,
  onReImport,
  isPublishing = false
}) => {
  const [expandedModules, setExpandedModules] = useState<{ [key: string]: boolean }>({});
  const [overrides, setOverrides] = useState({
    title: importData.mapped_structure?.title || '',
    description: importData.mapped_structure?.description || '',
    level: importData.mapped_structure?.level || 'intermediate',
    durationEstimateMins: importData.mapped_structure?.durationEstimateMins || 60
  });

  const toggleModule = (moduleId: string) => {
    setExpandedModules(prev => ({
      ...prev,
      [moduleId]: !prev[moduleId]
    }));
  };

  const getCourseStats = () => {
    const structure = importData.mapped_structure;
    if (!structure?.modules) return { modules: 0, lessons: 0, slides: 0 };

    const modules = structure.modules.length;
    const lessons = structure.modules.reduce((acc: number, module: any) => acc + module.lessons.length, 0);
    const slides = structure.modules.reduce((acc: number, module: any) => 
      acc + module.lessons.reduce((lessonAcc: number, lesson: any) => lessonAcc + lesson.slides.length, 0), 0);

    return { modules, lessons, slides };
  };

  const stats = getCourseStats();
  const hasWarnings = importData.warnings && importData.warnings.length > 0;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Review & Preview</h2>
          <p className="text-muted-foreground">
            Review your imported course structure and make final adjustments
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Badge variant={importData.status === 'ready' ? 'default' : 'secondary'}>
            {importData.status === 'ready' ? 'Ready to Publish' : 'Partial Import'}
          </Badge>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Course Details & Issues */}
        <div className="space-y-6">
          {/* Course Overview */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <BookOpen className="w-5 h-5 mr-2" />
                Course Details
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="title">Course Title</Label>
                <Input
                  id="title"
                  value={overrides.title}
                  onChange={(e) => setOverrides(prev => ({ ...prev, title: e.target.value }))}
                  className="mt-1"
                />
              </div>

              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={overrides.description}
                  onChange={(e) => setOverrides(prev => ({ ...prev, description: e.target.value }))}
                  rows={3}
                  className="mt-1"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label htmlFor="level">Difficulty</Label>
                  <Select 
                    value={overrides.level} 
                    onValueChange={(value) => setOverrides(prev => ({ ...prev, level: value }))}
                  >
                    <SelectTrigger className="mt-1">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="intro">Introductory</SelectItem>
                      <SelectItem value="intermediate">Intermediate</SelectItem>
                      <SelectItem value="advanced">Advanced</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="duration">Duration (min)</Label>
                  <Input
                    id="duration"
                    type="number"
                    value={overrides.durationEstimateMins}
                    onChange={(e) => setOverrides(prev => ({ 
                      ...prev, 
                      durationEstimateMins: parseInt(e.target.value) || 0 
                    }))}
                    className="mt-1"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Course Statistics */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Users className="w-5 h-5 mr-2" />
                Course Statistics
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-3 gap-4 text-center">
                <div>
                  <div className="text-2xl font-bold text-primary">{stats.modules}</div>
                  <div className="text-xs text-muted-foreground">Modules</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-primary">{stats.lessons}</div>
                  <div className="text-xs text-muted-foreground">Lessons</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-primary">{stats.slides}</div>
                  <div className="text-xs text-muted-foreground">Screens</div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Warnings/Issues */}
          {hasWarnings && (
            <Alert>
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>
                <div className="space-y-2">
                  <p className="font-medium">Import Warnings:</p>
                  <ul className="list-disc list-inside space-y-1 text-sm">
                    {importData.warnings.map((warning: string, index: number) => (
                      <li key={index}>{warning}</li>
                    ))}
                  </ul>
                  <p className="text-xs text-muted-foreground mt-2">
                    These issues don't prevent publishing but may affect the learning experience.
                  </p>
                </div>
              </AlertDescription>
            </Alert>
          )}

          {/* Source Attribution */}
          <Card className="bg-muted/30">
            <CardContent className="p-4">
              <div className="flex items-center space-x-2 text-sm">
                <FileText className="w-4 h-4 text-muted-foreground" />
                <span className="text-muted-foreground">
                  Imported from: <span className="font-medium">{importData.file_name}</span>
                </span>
              </div>
              <div className="flex items-center space-x-2 text-xs text-muted-foreground mt-1">
                <Clock className="w-3 h-3" />
                <span>
                  {new Date(importData.created_at).toLocaleString()}
                </span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column - Structure Tree & Preview */}
        <div className="lg:col-span-2 space-y-6">
          {/* Structure Tree */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span className="flex items-center">
                  <Eye className="w-5 h-5 mr-2" />
                  Course Structure
                </span>
                <Button variant="outline" size="sm" onClick={onEdit}>
                  <Edit className="w-4 h-4 mr-2" />
                  Open in Editor
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {importData.mapped_structure?.modules?.map((module: any, moduleIndex: number) => (
                  <div key={module.id} className="border rounded-lg">
                    <Collapsible 
                      open={expandedModules[module.id]} 
                      onOpenChange={() => toggleModule(module.id)}
                    >
                      <CollapsibleTrigger asChild>
                        <div className="flex items-center justify-between p-3 hover:bg-muted/50 cursor-pointer">
                          <div className="flex items-center space-x-2">
                            <div className="w-6 h-6 rounded bg-primary/10 flex items-center justify-center text-xs font-medium text-primary">
                              {moduleIndex + 1}
                            </div>
                            <span className="font-medium">{module.title}</span>
                            <Badge variant="outline" className="text-xs">
                              {module.lessons.length} lessons
                            </Badge>
                          </div>
                          <ChevronDown className={`w-4 h-4 transition-transform ${
                            expandedModules[module.id] ? 'rotate-180' : ''
                          }`} />
                        </div>
                      </CollapsibleTrigger>
                      <CollapsibleContent>
                        <div className="px-3 pb-3 space-y-1">
                          {module.lessons.map((lesson: any, lessonIndex: number) => (
                            <div key={lesson.id} className="flex items-center space-x-2 py-2 px-3 bg-muted/30 rounded">
                              <div className="w-5 h-5 rounded-full bg-muted flex items-center justify-center text-xs">
                                {lessonIndex + 1}
                              </div>
                              <span className="text-sm">{lesson.title}</span>
                              <Badge variant="secondary" className="text-xs ml-auto">
                                {lesson.slides.length} screens
                              </Badge>
                            </div>
                          ))}
                        </div>
                      </CollapsibleContent>
                    </Collapsible>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Action Buttons */}
          <div className="flex justify-between">
            <Button variant="outline" onClick={onReImport}>
              Re-import
            </Button>
            
            <div className="flex space-x-3">
              <Button variant="outline" onClick={onEdit}>
                <Edit className="w-4 h-4 mr-2" />
                Open in Editor
              </Button>
              <Button 
                onClick={() => onPublish(overrides)}
                disabled={isPublishing}
                className="min-w-[120px]"
              >
                {isPublishing ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                    Publishing...
                  </>
                ) : (
                  <>
                    <CheckCircle className="w-4 h-4 mr-2" />
                    Publish Course
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};