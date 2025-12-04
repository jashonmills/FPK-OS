
import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ModuleData } from '@/types/common';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Upload, Plus, Edit2, Trash2, Eye, ArrowLeft, Package } from 'lucide-react';
import { useModules } from '@/hooks/useModules';
import { useCourse } from '@/hooks/useCourses';
import { useModuleMutations } from '@/hooks/useModuleMutations';
import { useFileUpload } from '@/hooks/useFileUpload';

const ModuleManager = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const { course, isLoading: courseLoading } = useCourse(slug || '');
  const { modules, isLoading: modulesLoading, refetch } = useModules(course?.id || '');
  const { createModule, updateModule, deleteModule } = useModuleMutations();
  const { uploadFile, isUploading } = useFileUpload();
  
  const [editingModule, setEditingModule] = useState<ModuleData | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    module_number: 1,
    content_type: 'video',
    duration_minutes: 0,
    is_published: false,
    video_url: '',
    audio_url: '',
    pdf_url: '',
    word_url: '',
    image_url: ''
  });

  const handleFileUpload = async (file: File, assetType: string) => {
    if (!course) return;
    
    const fileName = `${course.slug}/Module-${formData.module_number}/${file.name}`;
    const { data, error } = await uploadFile(file, fileName);
    
    if (error) {
      console.error('Upload error:', error);
      return;
    }

    const publicUrl = `https://zgcegkmqfgznbpdplscz.supabase.co/storage/v1/object/public/course-files/${fileName}`;
    
    setFormData(prev => ({
      ...prev,
      [`${assetType}_url`]: publicUrl
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!course) return;

    try {
      if (editingModule) {
        await updateModule({
          id: editingModule.id,
          ...formData,
          course_id: course.id
        });
      } else {
        await createModule({
          ...formData,
          course_id: course.id
        });
      }
      
      resetForm();
      refetch();
    } catch (error) {
      console.error('Error saving module:', error);
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      module_number: 1,
      content_type: 'video',
      duration_minutes: 0,
      is_published: false,
      video_url: '',
      audio_url: '',
      pdf_url: '',
      word_url: '',
      image_url: ''
    });
    setEditingModule(null);
    setIsCreating(false);
  };

interface ModuleData {
  id?: string;
  title: string;
  description?: string;
  module_number: number;
  content_type: string;
  duration_minutes?: number;
  is_published?: boolean;
  video_url?: string;
  audio_url?: string;
  pdf_url?: string;
  word_url?: string;
  image_url?: string;
}

const handleEdit = (module: ModuleData) => {
  setEditingModule(module);
  setFormData({
    title: module.title || '',
    description: module.description || '',
    module_number: module.module_number || 1,
    content_type: module.content_type || 'video',
    duration_minutes: module.duration_minutes || 0,
    is_published: module.is_published || false,
    video_url: module.video_url || '',
    audio_url: module.audio_url || '',
    pdf_url: module.pdf_url || '',
    word_url: module.word_url || '',
    image_url: module.image_url || ''
  });
  setIsCreating(true);
};

  const handleDelete = async (moduleId: string) => {
    if (window.confirm('Are you sure you want to delete this module?')) {
      try {
        await deleteModule(moduleId);
        refetch();
      } catch (error) {
        console.error('Error deleting module:', error);
      }
    }
  };

  if (courseLoading || modulesLoading) {
    return (
      <div className="flex items-center justify-center p-4 md:p-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-sm md:text-base text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="flex items-center justify-center p-4 md:p-8">
        <div className="text-center">
          <h2 className="text-lg md:text-xl font-semibold text-red-600 mb-2">Course Not Found</h2>
          <p className="text-sm md:text-base text-gray-600 mb-4">The requested course could not be found.</p>
          <Button 
            onClick={() => navigate('/dashboard/admin/modules')}
            className="min-h-[44px] text-sm md:text-base touch-manipulation"
          >
            Select a Course
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-6 space-y-4 md:space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center gap-4">
        <Button 
          variant="ghost" 
          onClick={() => navigate('/dashboard/admin/courses')}
          className="w-fit"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Courses
        </Button>
        <div className="flex-1">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
            Module Manager
            {modules.length > 0 && (
              <Badge variant="secondary" className="ml-2 text-base font-normal">
                {modules.length} {modules.length === 1 ? 'Module' : 'Modules'}
              </Badge>
            )}
          </h1>
          <p className="text-sm md:text-base text-gray-600">Managing modules for: {course.title}</p>
        </div>
        {!isCreating && (
          <Button 
            onClick={() => setIsCreating(true)}
            className="w-full sm:w-auto min-h-[44px] text-sm md:text-base touch-manipulation"
          >
            <Plus className="h-4 w-4 mr-2" />
            New Module
          </Button>
        )}
      </div>

      {/* Existing Modules List - Show FIRST */}
      {!isCreating && modules.length > 0 && (
        <div className="space-y-4 md:space-y-6">
          {modules.map((module) => (
            <Card key={module.id}>
              <CardHeader>
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4">
                  <div className="flex-1">
                    <CardTitle className="flex flex-col sm:flex-row sm:items-center gap-2 text-base md:text-lg">
                      <Badge variant="outline" className="w-fit">Module {module.module_number}</Badge>
                      {module.title}
                    </CardTitle>
                    <CardDescription className="text-sm md:text-base mt-2">
                      {module.description || 'No description provided'}
                    </CardDescription>
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => handleEdit(module)}
                      className="h-9 w-9 p-0 touch-manipulation"
                    >
                      <Edit2 className="h-4 w-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => handleDelete(module.id)}
                      className="h-9 w-9 p-0 touch-manipulation"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  <div>
                    <span className="text-xs text-muted-foreground">Type</span>
                    <p className="text-sm font-medium capitalize">{module.content_type}</p>
                  </div>
                  <div>
                    <span className="text-xs text-muted-foreground">Duration</span>
                    <p className="text-sm font-medium">{module.duration_minutes || 0} mins</p>
                  </div>
                  <div>
                    <span className="text-xs text-muted-foreground">Status</span>
                    <Badge variant={module.is_published ? "default" : "secondary"} className="text-xs">
                      {module.is_published ? "Published" : "Draft"}
                    </Badge>
                  </div>
                  <div>
                    <span className="text-xs text-muted-foreground">Assets</span>
                    <div className="flex gap-1 mt-1">
                      {module.video_url && <Badge variant="outline" className="text-[10px] px-1">Video</Badge>}
                      {module.audio_url && <Badge variant="outline" className="text-[10px] px-1">Audio</Badge>}
                      {module.pdf_url && <Badge variant="outline" className="text-[10px] px-1">PDF</Badge>}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Empty State */}
      {!isCreating && modules.length === 0 && (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Package className="h-16 w-16 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">No modules yet</h3>
            <p className="text-sm text-muted-foreground mb-4 text-center">
              Create your first module to start building course content.
            </p>
            <Button onClick={() => setIsCreating(true)} className="min-h-[44px]">
              <Plus className="h-4 w-4 mr-2" />
              Create First Module
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Create/Edit Form - Show when isCreating is true */}
      {isCreating && (
        <Card className="border-2 border-primary/20">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-lg md:text-xl flex items-center gap-2">
                  {editingModule ? (
                    <>
                      <Badge variant="outline" className="bg-primary/10">Editing</Badge>
                      Module {editingModule.module_number}
                    </>
                  ) : (
                    'Create New Module'
                  )}
                </CardTitle>
                <CardDescription className="text-sm md:text-base">
                  {editingModule ? 'Update module information and assets' : 'Add a new module to this course'}
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4 md:space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="title" className="text-sm md:text-base">Module Title</Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    required
                    className="mt-1 min-h-[44px] text-sm md:text-base"
                  />
                </div>
                <div>
                  <Label htmlFor="module_number" className="text-sm md:text-base">Module Number</Label>
                  <Input
                    id="module_number"
                    type="number"
                    value={formData.module_number}
                    onChange={(e) => setFormData({ ...formData, module_number: parseInt(e.target.value) || 1 })}
                    required
                    className="mt-1 min-h-[44px] text-sm md:text-base"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="description" className="text-sm md:text-base">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={3}
                  className="mt-1 text-sm md:text-base"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="content_type" className="text-sm md:text-base">Content Type</Label>
                  <Select value={formData.content_type} onValueChange={(value) => setFormData({ ...formData, content_type: value })}>
                    <SelectTrigger className="mt-1 min-h-[44px] text-sm md:text-base">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="video">Video</SelectItem>
                      <SelectItem value="audio">Audio</SelectItem>
                      <SelectItem value="pdf">PDF</SelectItem>
                      <SelectItem value="text">Text</SelectItem>
                      <SelectItem value="interactive">Interactive</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="duration" className="text-sm md:text-base">Duration (minutes)</Label>
                  <Input
                    id="duration"
                    type="number"
                    value={formData.duration_minutes}
                    onChange={(e) => setFormData({ ...formData, duration_minutes: parseInt(e.target.value) || 0 })}
                    className="mt-1 min-h-[44px] text-sm md:text-base"
                  />
                </div>
                <div className="flex items-center space-x-3 sm:mt-6">
                  <Switch
                    id="published"
                    checked={formData.is_published}
                    onCheckedChange={(checked) => setFormData({ ...formData, is_published: checked })}
                  />
                  <Label htmlFor="published" className="text-sm md:text-base">Published</Label>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-base md:text-lg font-semibold">Module Assets</h3>
                
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                  {/* Video File */}
                  <div>
                    <Label htmlFor="video" className="text-sm md:text-base">Video File</Label>
                    <div className="flex gap-2 mt-1">
                      <Input
                        id="video"
                        value={formData.video_url}
                        onChange={(e) => setFormData({ ...formData, video_url: e.target.value })}
                        placeholder="Video URL or upload file"
                        className="min-h-[44px] text-sm md:text-base"
                      />
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        disabled={isUploading}
                        className="min-h-[44px] min-w-[44px] touch-manipulation"
                        onClick={() => {
                          const input = document.createElement('input');
                          input.type = 'file';
                          input.accept = 'video/*';
                          input.onchange = (e) => {
                            const file = (e.target as HTMLInputElement).files?.[0];
                            if (file) handleFileUpload(file, 'video');
                          };
                          input.click();
                        }}
                      >
                        <Upload className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>

                  {/* Audio File */}
                  <div>
                    <Label htmlFor="audio" className="text-sm md:text-base">Audio File</Label>
                    <div className="flex gap-2 mt-1">
                      <Input
                        id="audio"
                        value={formData.audio_url}
                        onChange={(e) => setFormData({ ...formData, audio_url: e.target.value })}
                        placeholder="Audio URL or upload file"
                        className="min-h-[44px] text-sm md:text-base"
                      />
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        disabled={isUploading}
                        className="min-h-[44px] min-w-[44px] touch-manipulation"
                        onClick={() => {
                          const input = document.createElement('input');
                          input.type = 'file';
                          input.accept = 'audio/*';
                          input.onchange = (e) => {
                            const file = (e.target as HTMLInputElement).files?.[0];
                            if (file) handleFileUpload(file, 'audio');
                          };
                          input.click();
                        }}
                      >
                        <Upload className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>

                  {/* PDF File */}
                  <div>
                    <Label htmlFor="pdf" className="text-sm md:text-base">PDF File</Label>
                    <div className="flex gap-2 mt-1">
                      <Input
                        id="pdf"
                        value={formData.pdf_url}
                        onChange={(e) => setFormData({ ...formData, pdf_url: e.target.value })}
                        placeholder="PDF URL or upload file"
                        className="min-h-[44px] text-sm md:text-base"
                      />
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        disabled={isUploading}
                        className="min-h-[44px] min-w-[44px] touch-manipulation"
                        onClick={() => {
                          const input = document.createElement('input');
                          input.type = 'file';
                          input.accept = '.pdf';
                          input.onchange = (e) => {
                            const file = (e.target as HTMLInputElement).files?.[0];
                            if (file) handleFileUpload(file, 'pdf');
                          };
                          input.click();
                        }}
                      >
                        <Upload className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>

                  {/* Word Document */}
                  <div>
                    <Label htmlFor="word" className="text-sm md:text-base">Word Document</Label>
                    <div className="flex gap-2 mt-1">
                      <Input
                        id="word"
                        value={formData.word_url}
                        onChange={(e) => setFormData({ ...formData, word_url: e.target.value })}
                        placeholder="Word doc URL or upload file"
                        className="min-h-[44px] text-sm md:text-base"
                      />
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        disabled={isUploading}
                        className="min-h-[44px] min-w-[44px] touch-manipulation"
                        onClick={() => {
                          const input = document.createElement('input');
                          input.type = 'file';
                          input.accept = '.doc,.docx';
                          input.onchange = (e) => {
                            const file = (e.target as HTMLInputElement).files?.[0];
                            if (file) handleFileUpload(file, 'word');
                          };
                          input.click();
                        }}
                      >
                        <Upload className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row sm:justify-end gap-2 sm:space-x-2 pt-4">
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={resetForm}
                  className="min-h-[44px] text-sm md:text-base touch-manipulation"
                >
                  Cancel
                </Button>
                <Button 
                  type="submit" 
                  disabled={isUploading}
                  className="min-h-[44px] text-sm md:text-base touch-manipulation"
                >
                  {editingModule ? 'Update Module' : 'Create Module'}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default ModuleManager;
