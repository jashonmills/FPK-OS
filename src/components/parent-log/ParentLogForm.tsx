import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { format } from 'date-fns';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { useFamily } from '@/contexts/FamilyContext';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { QuickButtons } from '@/components/shared/QuickButtons';
import { TextareaWithVoice } from '@/components/shared/TextareaWithVoice';
import { ImageUploadPreview } from '@/components/shared/ImageUploadPreview';
import { fetchWeatherData } from '@/utils/weatherService';
import { uploadLogImages } from '@/utils/imageUpload';
import { useAuth } from '@/hooks/useAuth';
import { MultiSelectButtons } from '@/components/shared/MultiSelectButtons';
import { ArrayTextInput } from '@/components/shared/ArrayTextInput';

interface ParentLogFormProps {
  onSuccess?: () => void;
}

export const ParentLogForm = ({ onSuccess }: ParentLogFormProps) => {
  const { selectedFamily, selectedStudent } = useFamily();
  const { user } = useAuth();
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm({
    defaultValues: {
      log_date: format(new Date(), 'yyyy-MM-dd'),
      log_time: format(new Date(), 'HH:mm'),
      reporter_name: '',
      location: '',
      activity_type: '',
      observation: '',
      mood: '',
      sensory_factors: [] as string[],
      communication_attempts: '',
      successes: '',
      challenges: '',
      strategies_used: '',
      duration_minutes: '',
      notes: '',
      tags: [] as string[],
    }
  });

  const onSubmit = async (data: any) => {
    if (!selectedFamily || !selectedStudent || !user) {
      toast.error('Please select a family and student');
      return;
    }

    setIsSubmitting(true);
    try {
      const weather = await fetchWeatherData();
      
      const { data: parentLog, error: insertError } = await supabase
        .from('parent_logs')
        .insert({
          family_id: selectedFamily.id,
          student_id: selectedStudent.id,
          created_by: user.id,
          ...data,
          duration_minutes: data.duration_minutes ? Number(data.duration_minutes) : null,
          ...weather,
          attachments: []
        })
        .select()
        .single();

      if (insertError) throw insertError;

      if (selectedFiles.length > 0) {
        const urls = await uploadLogImages(
          selectedFiles,
          parentLog.id,
          'parent',
          selectedFamily.id,
          selectedStudent.id
        );

        await supabase
          .from('parent_logs')
          .update({ attachments: urls })
          .eq('id', parentLog.id);
      }

      toast.success('Parent log saved successfully');
      form.reset();
      setSelectedFiles([]);
      setPreviewUrls([]);
      onSuccess?.();
    } catch (error) {
      console.error('Error saving parent log:', error);
      toast.error('Failed to save parent log');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="log_date"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Date</FormLabel>
                <FormControl>
                  <Input type="date" {...field} />
                </FormControl>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="log_time"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Time</FormLabel>
                <FormControl>
                  <Input type="time" {...field} />
                </FormControl>
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="reporter_name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Your Name</FormLabel>
              <FormControl>
                <Input {...field} placeholder="Your name" />
              </FormControl>
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="location"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Location</FormLabel>
              <QuickButtons
                options={['Home', 'School', 'Park', 'Community', 'Therapy', 'Other']}
                selected={field.value}
                onSelect={field.onChange}
              />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="activity_type"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Activity Type</FormLabel>
              <QuickButtons
                options={['Play', 'Mealtime', 'Bedtime Routine', 'Community Outing', 'Therapy Activity', 'School Work', 'Other']}
                selected={field.value}
                onSelect={field.onChange}
              />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="observation"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Observation</FormLabel>
              <FormControl>
                <TextareaWithVoice
                  {...field}
                  placeholder="What did you observe today?"
                  rows={3}
                />
              </FormControl>
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="mood"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Mood</FormLabel>
              <QuickButtons
                options={['Happy', 'Calm', 'Frustrated', 'Anxious', 'Excited', 'Tired', 'Other']}
                selected={field.value}
                onSelect={field.onChange}
              />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="sensory_factors"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Sensory Factors</FormLabel>
              <FormControl>
                <MultiSelectButtons
                  options={['Seeking Input', 'Avoiding Touch', 'Sound Sensitive', 'Visual Sensitivity', 'Oral/Taste Seeking', 'Movement Seeking', 'Other']}
                  selected={field.value}
                  onSelect={field.onChange}
                  placeholder="Select all that apply"
                />
              </FormControl>
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="communication_attempts"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Communication Attempts</FormLabel>
              <FormControl>
                <TextareaWithVoice
                  {...field}
                  placeholder="How did the student attempt to communicate?"
                  rows={2}
                />
              </FormControl>
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="successes"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Successes & Wins</FormLabel>
              <FormControl>
                <TextareaWithVoice
                  {...field}
                  placeholder="What went well?"
                  rows={2}
                />
              </FormControl>
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="challenges"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Challenges</FormLabel>
              <FormControl>
                <TextareaWithVoice
                  {...field}
                  placeholder="What was difficult?"
                  rows={2}
                />
              </FormControl>
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="strategies_used"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Strategies Used</FormLabel>
              <FormControl>
                <TextareaWithVoice
                  {...field}
                  placeholder="What techniques or strategies did you use?"
                  rows={2}
                />
              </FormControl>
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="duration_minutes"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Duration (minutes)</FormLabel>
              <FormControl>
                <Input type="number" {...field} placeholder="How long?" />
              </FormControl>
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="tags"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Tags</FormLabel>
              <FormControl>
                <ArrayTextInput
                  values={field.value}
                  onChange={field.onChange}
                  placeholder="Add custom tags..."
                />
              </FormControl>
            </FormItem>
          )}
        />

        <div>
          <FormLabel>Attachments</FormLabel>
          <ImageUploadPreview
            files={selectedFiles}
            previewUrls={previewUrls}
            onFilesChange={setSelectedFiles}
            onPreviewsChange={setPreviewUrls}
          />
        </div>

        <Button type="submit" disabled={isSubmitting} className="w-full">
          {isSubmitting ? 'Saving...' : 'Save Parent Log'}
        </Button>
      </form>
    </Form>
  );
};
