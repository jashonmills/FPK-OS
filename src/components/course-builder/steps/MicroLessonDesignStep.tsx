import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CourseDraft, SlideDraft, SlideKind } from '@/types/course-builder';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Plus, Upload, FileText, Image, Video, FileIcon, X, SidebarOpen, SidebarClose, Eye, ExternalLink } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { slideAssetPath } from '@/utils/storagePaths';
import { toast } from 'sonner';
import { htmlToText, cleanScormContent, extractContentSummary } from '@/utils/htmlToText';
import { ProgressOverviewCard } from '../progress/ProgressOverviewCard';
import { ProgressSidebar } from '../progress/ProgressSidebar';
import { EnhancedSelectDropdowns } from '../progress/EnhancedSelectDropdowns';

interface MicroLessonDesignStepProps {
  draft: CourseDraft;
  orgId: string;
  updateCourse: (updates: Partial<CourseDraft>) => void;
  addSlide: (moduleId: string, lessonId: string, slide: Omit<SlideDraft, 'id'>) => string | undefined;
}

const slideKindIcons = {
  content: FileText,
  image: Image,
  video: Video,
  pdf: FileIcon,
  embed: FileText,
  quiz: FileText,
  activity: FileText,
};

const slideKindLabels = {
  content: 'Text Content',
  image: 'Image',
  video: 'Video',
  pdf: 'PDF Document',
  embed: 'Embed',
  quiz: 'Quiz',
  activity: 'Activity',
};

export const MicroLessonDesignStep: React.FC<MicroLessonDesignStepProps> = ({
  draft,
  orgId,
  updateCourse,
  addSlide
}) => {
  const navigate = useNavigate();
  const [selectedModule, setSelectedModule] = useState(draft.modules[0]?.id || '');
  const [selectedLesson, setSelectedLesson] = useState('');
  const [newSlide, setNewSlide] = useState<Omit<SlideDraft, 'id'>>({
    kind: 'content',
    title: '',
    html: '',
    assets: []
  });
  const [uploading, setUploading] = useState(false);
  const [showProgressSidebar, setShowProgressSidebar] = useState(true);

  const currentModule = draft.modules.find(m => m.id === selectedModule);
  const currentLesson = currentModule?.lessons.find(l => l.id === selectedLesson);

  React.useEffect(() => {
    // Only auto-select first lesson if no lesson is selected and we have a valid module with lessons
    if (currentModule && currentModule.lessons.length > 0) {
      // Check if the currently selected lesson exists in the current module
      const lessonExists = currentModule.lessons.some(l => l.id === selectedLesson);
      if (!selectedLesson || !lessonExists) {
        setSelectedLesson(currentModule.lessons[0].id);
      }
    }
  }, [currentModule, selectedLesson]);

  const handleSelectLesson = (moduleId: string, lessonId: string) => {
    setSelectedModule(moduleId);
    setSelectedLesson(lessonId);
  };

  const handleAddSlide = () => {
    if (!selectedModule || !selectedLesson || !newSlide.title.trim()) {
      toast.error('Please fill in all required fields');
      return;
    }

    const slideId = addSlide(selectedModule, selectedLesson, newSlide);
    if (slideId) {
      setNewSlide({
        kind: 'content',
        title: '',
        html: '',
        assets: []
      });
      toast.success('Slide added successfully');
    }
  };

  const handleAssetUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file || !selectedModule || !selectedLesson) return;

    setUploading(true);
    try {
      const slideId = `temp-${Date.now()}`;
      const filePath = slideAssetPath(orgId, draft.id, slideId, file.name);
      
      const { data, error } = await supabase.storage
        .from('org-assets')
        .upload(filePath, file);

      if (error) throw error;

      const { data: { publicUrl } } = supabase.storage
        .from('org-assets')
        .getPublicUrl(data.path);

      const assetKind = file.type.startsWith('image/') ? 'image' :
                      file.type.startsWith('video/') ? 'video' :
                      file.type === 'application/pdf' ? 'pdf' : 'other';

      const newAsset = {
        name: file.name,
        url: publicUrl,
        kind: assetKind as 'image' | 'video' | 'pdf' | 'other'
      };

      if (newSlide.kind === assetKind && !newSlide.mediaUrl) {
        setNewSlide(prev => ({
          ...prev,
          mediaUrl: publicUrl,
          assets: [...(prev.assets || []), newAsset]
        }));
      } else {
        setNewSlide(prev => ({
          ...prev,
          assets: [...(prev.assets || []), newAsset]
        }));
      }

      toast.success('Asset uploaded successfully');
    } catch (error) {
      console.error('Error uploading asset:', error);
      toast.error('Failed to upload asset');
    } finally {
      setUploading(false);
    }
  };

  const removeSlideAsset = (index: number) => {
    setNewSlide(prev => ({
      ...prev,
      assets: prev.assets?.filter((_, i) => i !== index) || []
    }));
  };

  const updateSlide = (moduleId: string, lessonId: string, slideId: string, updates: Partial<SlideDraft>) => {
    const updatedModules = draft.modules.map(module =>
      module.id === moduleId
        ? {
            ...module,
            lessons: module.lessons.map(lesson =>
              lesson.id === lessonId
                ? {
                    ...lesson,
                    slides: lesson.slides.map(slide =>
                      slide.id === slideId ? { ...slide, ...updates } : slide
                    )
                  }
                : lesson
            )
          }
        : module
    );
    updateCourse({ modules: updatedModules });
  };

  const removeSlide = (moduleId: string, lessonId: string, slideId: string) => {
    const updatedModules = draft.modules.map(module =>
      module.id === moduleId
        ? {
            ...module,
            lessons: module.lessons.map(lesson =>
              lesson.id === lessonId
                ? { ...lesson, slides: lesson.slides.filter(s => s.id !== slideId) }
                : lesson
            )
          }
        : module
    );
    updateCourse({ modules: updatedModules });
    toast.success('Slide removed');
  };

  return (
    <div className="flex gap-6 min-h-[600px]">
      {/* Progress Sidebar */}
      {showProgressSidebar && (
        <ProgressSidebar
          draft={draft}
          selectedModule={selectedModule}
          selectedLesson={selectedLesson}
          onSelectLesson={handleSelectLesson}
          className="flex-shrink-0"
        />
      )}

      {/* Main Content */}
      <div className="flex-1 space-y-6">
        {/* Header with Progress Toggle */}
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-3">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowProgressSidebar(!showProgressSidebar)}
                className="flex-shrink-0"
              >
                {showProgressSidebar ? <SidebarClose className="w-4 h-4" /> : <SidebarOpen className="w-4 h-4" />}
              </Button>
              <div>
                <h3 className="text-lg font-semibold">Design Your Content</h3>
                 <p className="text-muted-foreground text-sm">
                   Create interactive slides for each lesson. Mix content types for engaging micro-learning experiences.
                 </p>
              </div>
            </div>
          </div>
        </div>

        {/* Progress Overview */}
        <ProgressOverviewCard draft={draft} />

        {/* Enhanced Module/Lesson Selection */}
        <EnhancedSelectDropdowns
          draft={draft}
          selectedModule={selectedModule}
          selectedLesson={selectedLesson}
          onModuleChange={setSelectedModule}
          onLessonChange={setSelectedLesson}
        />

      {currentLesson && (
        <Tabs defaultValue={currentLesson.slides.length > 0 ? "existing" : "create"} className="space-y-4">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="create">Create New Slide</TabsTrigger>
            <TabsTrigger value="existing" className={currentLesson.slides.length > 0 ? "bg-green-50 text-green-700 border-green-200" : ""}>
              Manage Existing ({currentLesson.slides.length})
              {currentLesson.slides.length > 0 && <span className="ml-1 text-green-600">•</span>}
            </TabsTrigger>
          </TabsList>

          <TabsContent value="create" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Create New Slide</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label>Slide Type</Label>
                    <Select 
                      value={newSlide.kind} 
                      onValueChange={(value) => setNewSlide(prev => ({ ...prev, kind: value as SlideKind }))}
                    >
                      <SelectTrigger className="mt-1">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {Object.entries(slideKindLabels).map(([value, label]) => {
                          const Icon = slideKindIcons[value as SlideKind];
                          return (
                            <SelectItem key={value} value={value}>
                              <div className="flex items-center space-x-2">
                                <Icon className="w-4 h-4" />
                                <span>{label}</span>
                              </div>
                            </SelectItem>
                          );
                        })}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label>Slide Title *</Label>
                    <Input
                      value={newSlide.title || ''}
                      onChange={(e) => setNewSlide(prev => ({ ...prev, title: e.target.value }))}
                      placeholder="Enter slide title..."
                      className="mt-1"
                    />
                  </div>
                </div>

                {newSlide.kind === 'content' && (
                  <div>
                    <Label>Content</Label>
                     <Textarea
                       value={htmlToText(newSlide.html || '')}
                       onChange={(e) => setNewSlide(prev => ({ ...prev, html: e.target.value }))}
                       placeholder="Enter slide content..."
                       rows={6}
                       className="mt-1"
                     />
                  </div>
                )}

                <div>
                  <Label>Assets</Label>
                  <div className="mt-1 space-y-2">
                    <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-4">
                      <input
                        type="file"
                        onChange={handleAssetUpload}
                        disabled={uploading}
                        className="hidden"
                        id="asset-upload"
                        accept="image/*,video/*,.pdf"
                      />
                      <label 
                        htmlFor="asset-upload"
                        className="cursor-pointer flex flex-col items-center space-y-2"
                      >
                        <Upload className="w-6 h-6 text-muted-foreground" />
                        <span className="text-sm text-muted-foreground">
                          {uploading ? 'Uploading...' : 'Click to upload assets'}
                        </span>
                      </label>
                    </div>

                    {newSlide.assets && newSlide.assets.length > 0 && (
                      <div className="space-y-2">
                        {newSlide.assets.map((asset, index) => (
                          <div key={index} className="flex items-center justify-between p-2 bg-muted rounded">
                            <div className="flex items-center space-x-2">
                              <Badge variant="outline">{asset.kind}</Badge>
                              <span className="text-sm">{asset.name}</span>
                            </div>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => removeSlideAsset(index)}
                            >
                              <X className="w-4 h-4" />
                            </Button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                <Button 
                  onClick={handleAddSlide} 
                  disabled={!newSlide.title?.trim()}
                  className="w-full"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add Slide
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="existing" className="space-y-4">
            {currentLesson.slides.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground">
                <FileText className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p>No slides created yet</p>
                <p className="text-sm">Switch to "Create New Slide" to get started</p>
              </div>
            ) : (
              <div className="space-y-4">
                {currentLesson.slides.map((slide, index) => {
                  const Icon = slideKindIcons[slide.kind];
                  return (
                    <Card key={slide.id}>
                      <CardHeader>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-2">
                            <Icon className="w-5 h-5" />
                            <span className="font-medium">{slide.title}</span>
                            <Badge variant="outline">{slideKindLabels[slide.kind]}</Badge>
                            <Badge variant="secondary">Slide {index + 1}</Badge>
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => removeSlide(selectedModule, selectedLesson, slide.id)}
                            className="text-destructive hover:text-destructive"
                          >
                            <X className="w-4 h-4" />
                          </Button>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-3">
                          <Input
                            value={slide.title || ''}
                            onChange={(e) => updateSlide(selectedModule, selectedLesson, slide.id, { title: e.target.value })}
                            placeholder="Slide title..."
                          />
                          
                          {slide.kind === 'content' && (
                             <Textarea
                               value={htmlToText(slide.html || '')}
                               onChange={(e) => updateSlide(selectedModule, selectedLesson, slide.id, { html: e.target.value })}
                               placeholder="Slide content..."
                               rows={3}
                             />
                          )}
                          
                          {slide.assets && slide.assets.length > 0 && (
                            <div>
                              <Label className="text-sm">Assets ({slide.assets.length})</Label>
                              <div className="mt-1 space-y-1">
                                {slide.assets.map((asset, assetIndex) => (
                                  <div key={assetIndex} className="flex items-center space-x-2 text-sm">
                                    <Badge variant="outline" className="text-xs">{asset.kind}</Badge>
                                    <span className="flex-1">{asset.name}</span>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            )}
          </TabsContent>
        </Tabs>
      )}

      {!currentLesson && draft.modules.length > 0 && (
        <div className="text-center py-12 text-muted-foreground">
          <FileText className="w-12 h-12 mx-auto mb-4 opacity-50" />
          <p>Select a lesson to start creating slides</p>
        </div>
      )}

      {/* Quick Preview Button */}
      <div className="mt-6 flex justify-center">
        <Button 
          variant="outline"
          onClick={() => navigate(`/draft-preview/${draft.id}`)}
          className="w-full max-w-sm"
        >
          <Eye className="w-4 h-4 mr-2" />
          Preview Course
          <ExternalLink className="w-3 h-3 ml-2" />
        </Button>
      </div>

        {draft.modules.length === 0 && (
          <div className="text-center py-12 text-muted-foreground">
            <FileText className="w-12 h-12 mx-auto mb-4 opacity-50" />
            <p>Create modules and lessons first</p>
            <p className="text-sm">Go back to the Lesson Planning step</p>
          </div>
        )}
      </div>
    </div>
  );
};