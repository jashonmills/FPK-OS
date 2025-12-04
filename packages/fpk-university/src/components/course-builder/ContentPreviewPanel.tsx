import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { 
  BookOpen, 
  Clock, 
  CheckCircle, 
  ChevronRight, 
  Edit, 
  RefreshCw, 
  Eye,
  FileText,
  Sparkles
} from 'lucide-react';
import { CourseContentManifest, LessonContentData, TextSection } from '@/types/lessonContent';

interface ContentPreviewPanelProps {
  manifest: CourseContentManifest;
  onEdit?: (lessonId: number) => void;
  onRegenerate?: (lessonId: number) => void;
  onAccept: () => void;
  onBack: () => void;
}

export const ContentPreviewPanel: React.FC<ContentPreviewPanelProps> = ({
  manifest,
  onEdit,
  onRegenerate,
  onAccept,
  onBack
}) => {
  const [selectedLesson, setSelectedLesson] = useState<LessonContentData | null>(null);

  // Group lessons by unit
  const lessonsByUnit = manifest.lessons.reduce((acc, lesson) => {
    const unit = lesson.unit || 'General';
    if (!acc[unit]) acc[unit] = [];
    acc[unit].push(lesson);
    return acc;
  }, {} as Record<string, LessonContentData[]>);

  const totalWords = manifest.lessons.reduce((acc, lesson) => {
    if (!lesson.sections) return acc;
    return acc + lesson.sections.reduce((sAcc, section) => {
      const content = 'content' in section ? (section as any).content : '';
      return sAcc + (content?.split?.(/\s+/).length || 0);
    }, 0);
  }, 0);

  const totalMinutes = manifest.lessons.reduce((acc, lesson) => {
    return acc + (lesson.estimatedMinutes || 5);
  }, 0);

  const renderSection = (section: TextSection, index: number) => {
    switch (section.type) {
      case 'heading':
        const HeadingTag = `h${section.level || 2}` as keyof JSX.IntrinsicElements;
        return (
          <HeadingTag key={index} className="font-semibold mt-4 mb-2">
            {section.content}
          </HeadingTag>
        );
      case 'paragraph':
        return <p key={index} className="mb-3 text-muted-foreground">{section.content}</p>;
      case 'list':
        return (
          <ul key={index} className="list-disc list-inside mb-3 space-y-1">
            {section.items?.map((item, i) => (
              <li key={i} className="text-muted-foreground">{item}</li>
            ))}
          </ul>
        );
      case 'callout':
        return (
          <div 
            key={index} 
            className={`p-3 rounded-lg mb-3 ${
              section.style === 'teaching' ? 'bg-primary/10 border-l-4 border-primary' :
              section.style === 'warning' ? 'bg-amber-500/10 border-l-4 border-amber-500' :
              section.style === 'success' ? 'bg-green-500/10 border-l-4 border-green-500' :
              'bg-muted'
            }`}
          >
            {section.content}
          </div>
        );
      case 'quote':
        return (
          <blockquote key={index} className="border-l-4 border-muted-foreground/30 pl-4 italic mb-3">
            {section.content}
          </blockquote>
        );
      default:
        return <p key={index} className="mb-3">{'content' in section ? (section as any).content : ''}</p>;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Sparkles className="w-5 h-5 text-primary" />
            <h3 className="text-lg font-semibold">AI Generated Content</h3>
          </div>
          <h2 className="text-2xl font-bold">{manifest.title}</h2>
          <p className="text-muted-foreground mt-1">{manifest.description}</p>
        </div>
      </div>

      {/* Stats */}
      <div className="flex flex-wrap gap-2">
        <Badge variant="secondary">
          <BookOpen className="w-3 h-3 mr-1" />
          {manifest.lessons.length} lessons
        </Badge>
        <Badge variant="secondary">
          <Clock className="w-3 h-3 mr-1" />
          {totalMinutes} min total
        </Badge>
        <Badge variant="secondary">
          <FileText className="w-3 h-3 mr-1" />
          ~{totalWords.toLocaleString()} words
        </Badge>
        <Badge variant="outline">
          {Object.keys(lessonsByUnit).length} units
        </Badge>
      </div>

      {/* Two-column layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Left: Lesson List */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Course Structure</CardTitle>
            <CardDescription>Click a lesson to preview content</CardDescription>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-[400px] pr-4">
              <Accordion type="multiple" defaultValue={Object.keys(lessonsByUnit)}>
                {Object.entries(lessonsByUnit).map(([unit, lessons]) => (
                  <AccordionItem key={unit} value={unit}>
                    <AccordionTrigger className="text-sm font-medium">
                      <div className="flex items-center gap-2">
                        <div 
                          className="w-2 h-2 rounded-full"
                          style={{ backgroundColor: lessons[0]?.unitColor || '#3B82F6' }}
                        />
                        {unit}
                        <Badge variant="secondary" className="ml-2 text-xs">
                          {lessons.length}
                        </Badge>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent>
                      <div className="space-y-1 pl-4">
                        {lessons.map((lesson) => (
                          <button
                            key={lesson.id}
                            onClick={() => setSelectedLesson(lesson)}
                            className={`w-full text-left p-2 rounded-lg text-sm transition-colors ${
                              selectedLesson?.id === lesson.id
                                ? 'bg-primary/10 text-primary'
                                : 'hover:bg-muted'
                            }`}
                          >
                            <div className="flex items-center justify-between">
                              <span className="truncate">{lesson.title}</span>
                              <ChevronRight className="w-4 h-4 flex-shrink-0" />
                            </div>
                            {lesson.estimatedMinutes && (
                              <span className="text-xs text-muted-foreground">
                                {lesson.estimatedMinutes} min
                              </span>
                            )}
                          </button>
                        ))}
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </ScrollArea>
          </CardContent>
        </Card>

        {/* Right: Content Preview */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center justify-between">
              <span>Content Preview</span>
              {selectedLesson && (
                <div className="flex gap-1">
                  {onEdit && (
                    <Button variant="ghost" size="sm" onClick={() => onEdit(selectedLesson.id)}>
                      <Edit className="w-3 h-3" />
                    </Button>
                  )}
                  {onRegenerate && (
                    <Button variant="ghost" size="sm" onClick={() => onRegenerate(selectedLesson.id)}>
                      <RefreshCw className="w-3 h-3" />
                    </Button>
                  )}
                </div>
              )}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-[400px] pr-4">
              {selectedLesson ? (
                <div className="space-y-4">
                  <div>
                    <h4 className="font-semibold text-lg">{selectedLesson.title}</h4>
                    {selectedLesson.description && (
                      <p className="text-sm text-muted-foreground">{selectedLesson.description}</p>
                    )}
                  </div>
                  
                  <div className="prose prose-sm max-w-none">
                    {selectedLesson.sections?.map((section, index) => 
                      renderSection(section, index)
                    )}
                  </div>
                </div>
              ) : (
                <div className="h-full flex items-center justify-center text-muted-foreground">
                  <div className="text-center">
                    <Eye className="w-8 h-8 mx-auto mb-2 opacity-50" />
                    <p>Select a lesson to preview</p>
                  </div>
                </div>
              )}
            </ScrollArea>
          </CardContent>
        </Card>
      </div>

      {/* Actions */}
      <div className="flex justify-between">
        <Button variant="outline" onClick={onBack}>
          Back to Generator
        </Button>
        <Button onClick={onAccept} className="gap-2">
          <CheckCircle className="w-4 h-4" />
          Accept & Continue
        </Button>
      </div>
    </div>
  );
};
