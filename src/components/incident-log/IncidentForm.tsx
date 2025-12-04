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
import { Checkbox } from '@/components/ui/checkbox';
import { useWeatherForLog } from '@/hooks/useWeatherForLog';
import { uploadLogImages } from '@/utils/imageUpload';
import { useAuth } from '@/hooks/useAuth';
import { MultiSelectButtons } from '@/components/shared/MultiSelectButtons';
import { ArrayTextInput } from '@/components/shared/ArrayTextInput';
import { InfoTooltip } from '@/components/shared/InfoTooltip';

interface IncidentFormProps {
  onSuccess?: () => void;
}

export const IncidentForm = ({ onSuccess }: IncidentFormProps) => {
  const { selectedFamily, selectedStudent } = useFamily();
  const { user } = useAuth();
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm({
    defaultValues: {
      incident_date: format(new Date(), 'yyyy-MM-dd'),
      incident_time: format(new Date(), 'HH:mm'),
      incident_type: '',
      severity: '',
      location: '',
      reporter_name: '',
      reporter_role: '',
      behavior_description: '',
      antecedent: '',
      consequence: '',
      intervention_used: '',
      duration_minutes: '',
      injuries: false,
      injury_details: '',
      parent_notified: false,
      notification_method: '',
      follow_up_required: false,
      follow_up_notes: '',
      environmental_factors: [] as string[],
      witnesses: [] as string[],
      tags: [] as string[],
    }
  });

  const { getWeatherForLog } = useWeatherForLog();

  const onSubmit = async (data: any) => {
    if (!selectedFamily || !selectedStudent || !user) {
      toast.error('Please select a family and student');
      return;
    }

    setIsSubmitting(true);
    try {
      const weather = await getWeatherForLog();
      
      const { data: incident, error: insertError } = await supabase
        .from('incident_logs')
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
          incident.id,
          'incident',
          selectedFamily.id,
          selectedStudent.id
        );

        await supabase
          .from('incident_logs')
          .update({ attachments: urls })
          .eq('id', incident.id);
      }

      toast.success('Incident logged successfully');
      form.reset();
      setSelectedFiles([]);
      setPreviewUrls([]);
      onSuccess?.();
    } catch (error) {
      console.error('Error saving incident:', error);
      toast.error('Failed to save incident');
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
            name="incident_date"
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
            name="incident_time"
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
          name="incident_type"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Incident Type</FormLabel>
              <QuickButtons
                options={['Aggression', 'Self-Injury', 'Elopement', 'Property Destruction', 'Refusal', 'Other']}
                selected={field.value}
                onSelect={field.onChange}
              />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="severity"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Severity</FormLabel>
              <QuickButtons
                options={['Low', 'Medium', 'High', 'Critical']}
                selected={field.value}
                onSelect={field.onChange}
              />
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
                options={['Home', 'School', 'Community', 'Therapy', 'Other']}
                selected={field.value}
                onSelect={field.onChange}
              />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="reporter_name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Reporter Name</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="Your name" />
                </FormControl>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="reporter_role"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Reporter Role</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="Parent, Teacher, etc." />
                </FormControl>
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="behavior_description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Behavior Description</FormLabel>
              <FormControl>
                <TextareaWithVoice
                  {...field}
                  placeholder="Describe what happened..."
                  rows={3}
                />
              </FormControl>
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="antecedent"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="flex items-center gap-2">
                Antecedent (What happened before?)
                <InfoTooltip content="What happened immediately before the behavior occurred? Examples: 'Was asked to switch activities,' 'Loud noise from outside,' 'Was left alone for a moment,' 'Presented with non-preferred task.'" />
              </FormLabel>
              <FormControl>
                <TextareaWithVoice
                  {...field}
                  placeholder="What triggered the behavior?"
                  rows={2}
                />
              </FormControl>
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="consequence"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="flex items-center gap-2">
                Consequence (What happened after?)
                <InfoTooltip content="What happened immediately after the behavior? This includes your reaction or the natural result. Examples: 'Verbal redirection was given,' 'Item was removed,' 'Gained access to preferred toy,' 'Received sensory break.'" />
              </FormLabel>
              <FormControl>
                <TextareaWithVoice
                  {...field}
                  placeholder="What was the result of the behavior?"
                  rows={2}
                />
              </FormControl>
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="intervention_used"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Intervention Used</FormLabel>
              <FormControl>
                <TextareaWithVoice
                  {...field}
                  placeholder="What strategies were used?"
                  rows={2}
                />
              </FormControl>
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="environmental_factors"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="flex items-center gap-2">
                Environmental Factors
                <InfoTooltip content="Environmental conditions present during the incident. These factors can trigger or worsen behavioral responses. Select all that apply." />
              </FormLabel>
              <FormControl>
                <MultiSelectButtons
                  options={['Loud Noise', 'Crowded Space', 'Bright Lights', 'Temperature Change', 'Transition', 'Schedule Change', 'New Person', 'Other']}
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
          name="witnesses"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Witnesses</FormLabel>
              <FormControl>
                <ArrayTextInput
                  values={field.value}
                  onChange={field.onChange}
                  placeholder="Add witness names..."
                />
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

        <FormField
          control={form.control}
          name="duration_minutes"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Duration (minutes)</FormLabel>
              <FormControl>
                <Input type="number" {...field} placeholder="How long did it last?" />
              </FormControl>
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="injuries"
          render={({ field }) => (
            <FormItem className="flex items-center gap-2">
              <FormControl>
                <Checkbox
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
              <FormLabel className="!mt-0">Were there any injuries?</FormLabel>
            </FormItem>
          )}
        />

        {form.watch('injuries') && (
          <FormField
            control={form.control}
            name="injury_details"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Injury Details</FormLabel>
                <FormControl>
                  <TextareaWithVoice
                    {...field}
                    placeholder="Describe the injuries..."
                    rows={2}
                  />
                </FormControl>
              </FormItem>
            )}
          />
        )}

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
          {isSubmitting ? 'Saving...' : 'Save Incident Report'}
        </Button>
      </form>
    </Form>
  );
};
