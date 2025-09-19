import React, { useState, useEffect, useRef } from 'react';
import { CourseDraft } from '@/types/course-builder';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Upload, X, Plus } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { courseBackgroundPath } from '@/utils/storagePaths';
import { toast } from 'sonner';

interface CourseOverviewStepProps {
  draft: CourseDraft;
  orgId: string;
  updateCourse: (updates: Partial<CourseDraft>) => void;
  setBackgroundImageUrl: (url: string) => void;
}

export const CourseOverviewStep: React.FC<CourseOverviewStepProps> = ({
  draft,
  orgId,
  updateCourse,
  setBackgroundImageUrl
}) => {
  // Local state to prevent input focus loss
  const [localTitle, setLocalTitle] = useState(draft.title || '');
  const [localDescription, setLocalDescription] = useState(draft.description || '');
  const [uploading, setUploading] = useState(false);
  const [newObjective, setNewObjective] = useState('');
  const [newPrerequisite, setNewPrerequisite] = useState('');
  
  // Refs for debouncing
  const titleTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const descriptionTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Update local state when draft changes externally (but not during typing)
  useEffect(() => {
    if (draft.title !== localTitle && !titleTimeoutRef.current) {
      setLocalTitle(draft.title || '');
    }
  }, [draft.title, localTitle]);

  useEffect(() => {
    if (draft.description !== localDescription && !descriptionTimeoutRef.current) {
      setLocalDescription(draft.description || '');
    }
  }, [draft.description, localDescription]);

  // Debounced update functions
  const updateTitle = (value: string) => {
    setLocalTitle(value);
    
    if (titleTimeoutRef.current) {
      clearTimeout(titleTimeoutRef.current);
    }
    
    titleTimeoutRef.current = setTimeout(() => {
      updateCourse({ title: value });
      titleTimeoutRef.current = null;
    }, 300);
  };

  const updateDescription = (value: string) => {
    setLocalDescription(value);
    
    if (descriptionTimeoutRef.current) {
      clearTimeout(descriptionTimeoutRef.current);
    }
    
    descriptionTimeoutRef.current = setTimeout(() => {
      updateCourse({ description: value });
      descriptionTimeoutRef.current = null;
    }, 300);
  };

  const handleBackgroundUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      toast.error('Please select an image file');
      return;
    }

    setUploading(true);
    try {
      const filePath = courseBackgroundPath(orgId, draft.id, file.name);
      
      const { data, error } = await supabase.storage
        .from('org-assets')
        .upload(filePath, file);

      if (error) throw error;

      const { data: { publicUrl } } = supabase.storage
        .from('org-assets')
        .getPublicUrl(data.path);

      setBackgroundImageUrl(publicUrl);
      toast.success('Background image uploaded successfully');
    } catch (error) {
      console.error('Error uploading background:', error);
      toast.error('Failed to upload background image');
    } finally {
      setUploading(false);
    }
  };

  const addObjective = () => {
    if (newObjective.trim()) {
      updateCourse({
        objectives: [...(draft.objectives || []), newObjective.trim()]
      });
      setNewObjective('');
    }
  };

  const removeObjective = (index: number) => {
    updateCourse({
      objectives: draft.objectives?.filter((_, i) => i !== index) || []
    });
  };

  const addPrerequisite = () => {
    if (newPrerequisite.trim()) {
      updateCourse({
        prerequisites: [...(draft.prerequisites || []), newPrerequisite.trim()]
      });
      setNewPrerequisite('');
    }
  };

  const removePrerequisite = (index: number) => {
    updateCourse({
      prerequisites: draft.prerequisites?.filter((_, i) => i !== index) || []
    });
  };

  return (
    <div className="space-y-6">
      {/* Background Preview */}
      {draft.backgroundImageUrl && (
        <div className="space-y-2">
          <Label>Background Preview</Label>
          <div 
            className="w-full h-32 rounded-lg bg-cover bg-center bg-no-repeat border"
            style={{ backgroundImage: `url(${draft.backgroundImageUrl})` }}
          />
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div>
            <Label htmlFor="title">Course Title *</Label>
            <Input
              id="title"
              value={localTitle}
              onChange={(e) => updateTitle(e.target.value)}
              placeholder="Enter course title..."
              className="mt-1"
            />
          </div>

          <div>
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={localDescription}
              onChange={(e) => updateDescription(e.target.value)}
              placeholder="Describe what students will learn..."
              rows={4}
              className="mt-1"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="level">Difficulty Level</Label>
              <Select 
                value={draft.level || 'intro'} 
                onValueChange={(value) => updateCourse({ level: value as any })}
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
              <Label htmlFor="duration">Duration (minutes)</Label>
              <Input
                id="duration"
                type="number"
                value={draft.durationEstimateMins || ''}
                onChange={(e) => updateCourse({ durationEstimateMins: parseInt(e.target.value) || undefined })}
                placeholder="60"
                className="mt-1"
              />
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <Label>Background Image</Label>
            <div className="mt-1 border-2 border-dashed border-muted-foreground/25 rounded-lg p-4">
              <input
                type="file"
                accept="image/*"
                onChange={handleBackgroundUpload}
                disabled={uploading}
                className="hidden"
                id="background-upload"
              />
              <label 
                htmlFor="background-upload"
                className="cursor-pointer flex flex-col items-center space-y-2"
              >
                <Upload className="w-8 h-8 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">
                  {uploading ? 'Uploading...' : 'Click to upload background image'}
                </span>
              </label>
            </div>
          </div>

          <div>
            <Label>Learning Objectives</Label>
            <div className="space-y-2 mt-1">
              <div className="flex space-x-2">
                <Input
                  value={newObjective}
                  onChange={(e) => setNewObjective(e.target.value)}
                  placeholder="Add learning objective..."
                  onKeyPress={(e) => e.key === 'Enter' && addObjective()}
                />
                <Button type="button" size="sm" onClick={addObjective}>
                  <Plus className="w-4 h-4" />
                </Button>
              </div>
              {draft.objectives?.map((objective, index) => (
                <Badge key={index} variant="secondary" className="flex items-center justify-between">
                  <span className="flex-1">{objective}</span>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => removeObjective(index)}
                    className="ml-2 p-0 h-4 w-4"
                  >
                    <X className="w-3 h-3" />
                  </Button>
                </Badge>
              ))}
            </div>
          </div>

          <div>
            <Label>Prerequisites</Label>
            <div className="space-y-2 mt-1">
              <div className="flex space-x-2">
                <Input
                  value={newPrerequisite}
                  onChange={(e) => setNewPrerequisite(e.target.value)}
                  placeholder="Add prerequisite..."
                  onKeyPress={(e) => e.key === 'Enter' && addPrerequisite()}
                />
                <Button type="button" size="sm" onClick={addPrerequisite}>
                  <Plus className="w-4 h-4" />
                </Button>
              </div>
              {draft.prerequisites?.map((prerequisite, index) => (
                <Badge key={index} variant="outline" className="flex items-center justify-between">
                  <span className="flex-1">{prerequisite}</span>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => removePrerequisite(index)}
                    className="ml-2 p-0 h-4 w-4"
                  >
                    <X className="w-3 h-3" />
                  </Button>
                </Badge>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};