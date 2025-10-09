import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useFamily } from '@/contexts/FamilyContext';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { fetchWeatherData } from '@/utils/weatherService';
import { TextareaWithVoice } from '@/components/shared/TextareaWithVoice';
import { MultiSelectButtons } from '@/components/shared/MultiSelectButtons';
import { ArrayTextInput } from '@/components/shared/ArrayTextInput';
import { ImageUploadPreview } from '@/components/shared/ImageUploadPreview';
import { uploadLogImages } from '@/utils/imageUpload';
import { QuickButtons } from '@/components/shared/QuickButtons';
import { Separator } from '@/components/ui/separator';

interface EducatorLogFormProps {
  onSuccess?: () => void;
}

const LOG_TYPES = [
  { value: 'therapy', label: 'Therapy Session' },
  { value: 'classroom', label: 'Classroom Observation' },
  { value: 'observation', label: 'General Observation' },
  { value: 'behavior', label: 'Behavior Support' },
];

export const EducatorLogFormComplete = ({ onSuccess }: EducatorLogFormProps) => {
  const { selectedFamily, selectedStudent } = useFamily();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);
  
  const form = useForm({
    defaultValues: {
      // Section 1: Session Information
      log_date: new Date().toISOString().split('T')[0],
      log_time: new Date().toTimeString().slice(0, 5),
      session_start_time: '',
      session_end_time: '',
      log_type: 'therapy',
      educator_name: '',
      educator_role: '',
      session_duration_minutes: '',
      subject_area: '',
      lesson_topic: '',
      teaching_method: '',
      materials_used: [] as string[],
      
      // Section 2: IEP & Skills
      iep_goal_addressed: '',
      skills_practiced: [] as string[],
      activities_completed: [] as string[],
      
      // Section 3: Performance Data
      performance_level: '',
      engagement_level: '',
      prompting_level: '',
      
      // Section 4: Trial Data
      correct_responses: '',
      total_attempts: '',
      
      // Section 5: Observations & Notes
      progress_notes: '',
      behavioral_observations: '',
      strengths_observed: '',
      areas_for_improvement: '',
      challenges: '',
      modifications_used: [] as string[],
      
      // Section 6: Next Steps & Communication
      next_steps: '',
      goals_for_next_session: '',
      parent_communication: '',
      
      // Section 7: Attachments & Tags
      tags: [] as string[],
    },
  });

  const calculateDuration = () => {
    const start = form.watch('session_start_time');
    const end = form.watch('session_end_time');
    if (start && end) {
      const [startH, startM] = start.split(':').map(Number);
      const [endH, endM] = end.split(':').map(Number);
      const duration = (endH * 60 + endM) - (startH * 60 + startM);
      if (duration > 0) {
        form.setValue('session_duration_minutes', duration.toString());
      }
    }
  };

  const calculateAccuracy = () => {
    const correct = Number(form.watch('correct_responses') || 0);
    const total = Number(form.watch('total_attempts') || 0);
    return total > 0 ? ((correct / total) * 100).toFixed(1) : '0';
  };

  const onSubmit = async (data: any) => {
    if (!selectedFamily?.id || !selectedStudent?.id) {
      toast.error('Please select a family and student');
      return;
    }

    setIsSubmitting(true);
    try {
      const weatherData = await fetchWeatherData();
      const user = await supabase.auth.getUser();
      
      const accuracy = calculateAccuracy();

      const { data: log, error } = await supabase.from('educator_logs').insert([{
        family_id: selectedFamily.id,
        student_id: selectedStudent.id,
        created_by: user.data.user?.id || '',
        log_date: data.log_date,
        log_time: data.log_time,
        session_start_time: data.session_start_time || null,
        session_end_time: data.session_end_time || null,
        log_type: data.log_type,
        educator_name: data.educator_name,
        educator_role: data.educator_role || null,
        session_duration_minutes: data.session_duration_minutes ? parseInt(data.session_duration_minutes) : null,
        subject_area: data.subject_area || null,
        lesson_topic: data.lesson_topic || null,
        teaching_method: data.teaching_method || null,
        materials_used: data.materials_used.length > 0 ? data.materials_used : null,
        iep_goal_addressed: data.iep_goal_addressed || null,
        skills_practiced: data.skills_practiced.length > 0 ? data.skills_practiced : null,
        activities_completed: data.activities_completed.length > 0 ? data.activities_completed : null,
        performance_level: data.performance_level || null,
        engagement_level: data.engagement_level || null,
        prompting_level: data.prompting_level || null,
        correct_responses: data.correct_responses ? parseFloat(data.correct_responses) : null,
        total_attempts: data.total_attempts ? parseFloat(data.total_attempts) : null,
        accuracy_percentage: accuracy !== '0' ? parseFloat(accuracy) : null,
        progress_notes: data.progress_notes || null,
        behavioral_observations: data.behavioral_observations || null,
        strengths_observed: data.strengths_observed || null,
        areas_for_improvement: data.areas_for_improvement || null,
        challenges: data.challenges || null,
        modifications_used: data.modifications_used.length > 0 ? data.modifications_used : null,
        next_steps: data.next_steps || null,
        goals_for_next_session: data.goals_for_next_session || null,
        parent_communication: data.parent_communication || null,
        tags: data.tags.length > 0 ? data.tags : null,
        weather_condition: weatherData.weather_condition,
        weather_temp_f: weatherData.weather_temp_f,
        weather_temp_c: weatherData.weather_temp_c ? parseFloat(weatherData.weather_temp_c) : null,
        weather_humidity: weatherData.weather_humidity,
        weather_pressure_mb: weatherData.weather_pressure_mb,
        weather_wind_speed: weatherData.weather_wind_speed,
        weather_fetched_at: weatherData.weather_fetched_at,
        aqi_us: weatherData.aqi_us,
        aqi_european: weatherData.aqi_european,
        pm25: weatherData.pm25,
        pm10: weatherData.pm10,
        o3: weatherData.o3,
        no2: weatherData.no2,
        so2: weatherData.so2,
        co: weatherData.co,
        pollen_alder: weatherData.pollen_alder,
        pollen_birch: weatherData.pollen_birch,
        pollen_grass: weatherData.pollen_grass,
        pollen_mugwort: weatherData.pollen_mugwort,
        pollen_olive: weatherData.pollen_olive,
        pollen_ragweed: weatherData.pollen_ragweed,
        air_quality_fetched_at: weatherData.air_quality_fetched_at,
        attachments: []
      }]).select().single();

      if (error) throw error;

      if (selectedFiles.length > 0) {
        const urls = await uploadLogImages(
          selectedFiles,
          log.id,
          'educator',
          selectedFamily.id,
          selectedStudent.id
        );
        await supabase.from('educator_logs').update({ attachments: urls }).eq('id', log.id);
      }

      toast.success('Educator log created successfully');
      form.reset();
      setSelectedFiles([]);
      setPreviewUrls([]);
      onSuccess?.();
    } catch (error) {
      console.error('Error creating educator log:', error);
      toast.error('Failed to create educator log');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        {/* Section 1: Session Information */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Session Information</h3>
          
          <div className="grid grid-cols-2 gap-4">
            <FormField control={form.control} name="log_date" render={({ field }) => (
              <FormItem>
                <FormLabel>Date</FormLabel>
                <FormControl><Input type="date" {...field} /></FormControl>
              </FormItem>
            )} />
            <FormField control={form.control} name="log_time" render={({ field }) => (
              <FormItem>
                <FormLabel>Time</FormLabel>
                <FormControl><Input type="time" {...field} /></FormControl>
              </FormItem>
            )} />
          </div>

          <div className="grid grid-cols-3 gap-4">
            <FormField control={form.control} name="session_start_time" render={({ field }) => (
              <FormItem>
                <FormLabel>Start Time</FormLabel>
                <FormControl><Input type="time" {...field} onBlur={calculateDuration} /></FormControl>
              </FormItem>
            )} />
            <FormField control={form.control} name="session_end_time" render={({ field }) => (
              <FormItem>
                <FormLabel>End Time</FormLabel>
                <FormControl><Input type="time" {...field} onBlur={calculateDuration} /></FormControl>
              </FormItem>
            )} />
            <FormField control={form.control} name="session_duration_minutes" render={({ field }) => (
              <FormItem>
                <FormLabel>Duration (min)</FormLabel>
                <FormControl><Input type="number" {...field} placeholder="Auto-calculated" /></FormControl>
              </FormItem>
            )} />
          </div>

          <FormField control={form.control} name="log_type" render={({ field }) => (
            <FormItem>
              <FormLabel>Log Type</FormLabel>
              <Select value={field.value} onValueChange={field.onChange}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {LOG_TYPES.map(t => <SelectItem key={t.value} value={t.value}>{t.label}</SelectItem>)}
                </SelectContent>
              </Select>
            </FormItem>
          )} />

          <div className="grid grid-cols-2 gap-4">
            <FormField control={form.control} name="educator_name" render={({ field }) => (
              <FormItem>
                <FormLabel>Educator Name</FormLabel>
                <FormControl><Input {...field} placeholder="Your name" /></FormControl>
              </FormItem>
            )} />
            <FormField control={form.control} name="educator_role" render={({ field }) => (
              <FormItem>
                <FormLabel>Role</FormLabel>
                <FormControl><Input {...field} placeholder="Speech Therapist, Teacher, etc." /></FormControl>
              </FormItem>
            )} />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <FormField control={form.control} name="subject_area" render={({ field }) => (
              <FormItem>
                <FormLabel>Subject Area</FormLabel>
                <Select value={field.value} onValueChange={field.onChange}>
                  <SelectTrigger><SelectValue placeholder="Select..." /></SelectTrigger>
                  <SelectContent>
                    {['Math', 'Reading', 'Writing', 'Speech', 'OT', 'PT', 'Social Skills', 'Life Skills', 'Other'].map(s => 
                      <SelectItem key={s} value={s}>{s}</SelectItem>
                    )}
                  </SelectContent>
                </Select>
              </FormItem>
            )} />
            <FormField control={form.control} name="lesson_topic" render={({ field }) => (
              <FormItem>
                <FormLabel>Lesson Topic</FormLabel>
                <FormControl><Input {...field} placeholder="What was taught?" /></FormControl>
              </FormItem>
            )} />
          </div>

          <FormField control={form.control} name="teaching_method" render={({ field }) => (
            <FormItem>
              <FormLabel>Teaching Method</FormLabel>
              <Select value={field.value} onValueChange={field.onChange}>
                <SelectTrigger><SelectValue placeholder="Select..." /></SelectTrigger>
                <SelectContent>
                  {['Direct Instruction', 'Visual Supports', 'Task Analysis', 'Modeling', 'Peer Learning', 'Hands-On', 'Technology-Based', 'Other'].map(m => 
                    <SelectItem key={m} value={m}>{m}</SelectItem>
                  )}
                </SelectContent>
              </Select>
            </FormItem>
          )} />

          <FormField control={form.control} name="materials_used" render={({ field }) => (
            <FormItem>
              <FormLabel>Materials Used</FormLabel>
              <FormControl>
                <ArrayTextInput values={field.value} onChange={field.onChange} placeholder="Add materials..." />
              </FormControl>
            </FormItem>
          )} />
        </div>

        <Separator />

        {/* Section 2: IEP & Skills */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">IEP & Skills</h3>
          
          <FormField control={form.control} name="iep_goal_addressed" render={({ field }) => (
            <FormItem>
              <FormLabel>IEP Goal Addressed</FormLabel>
              <FormControl><TextareaWithVoice {...field} placeholder="Which IEP goal was worked on?" rows={2} /></FormControl>
            </FormItem>
          )} />

          <FormField control={form.control} name="skills_practiced" render={({ field }) => (
            <FormItem>
              <FormLabel>Skills Practiced</FormLabel>
              <FormControl>
                <ArrayTextInput values={field.value} onChange={field.onChange} placeholder="Add skills..." />
              </FormControl>
            </FormItem>
          )} />

          <FormField control={form.control} name="activities_completed" render={({ field }) => (
            <FormItem>
              <FormLabel>Activities Completed</FormLabel>
              <FormControl>
                <ArrayTextInput values={field.value} onChange={field.onChange} placeholder="Add activities..." />
              </FormControl>
            </FormItem>
          )} />
        </div>

        <Separator />

        {/* Section 3: Performance Data */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Performance Data</h3>
          
          <FormField control={form.control} name="performance_level" render={({ field }) => (
            <FormItem>
              <FormLabel>Performance Level *</FormLabel>
              <QuickButtons
                options={['Mastered', 'Independent', 'Emerging', 'Needs Support']}
                selected={field.value}
                onSelect={field.onChange}
              />
            </FormItem>
          )} />

          <FormField control={form.control} name="engagement_level" render={({ field }) => (
            <FormItem>
              <FormLabel>Engagement Level *</FormLabel>
              <QuickButtons
                options={['Highly Engaged', 'Engaged', 'Somewhat Engaged', 'Disengaged']}
                selected={field.value}
                onSelect={field.onChange}
              />
            </FormItem>
          )} />

          <FormField control={form.control} name="prompting_level" render={({ field }) => (
            <FormItem>
              <FormLabel>Prompting Level *</FormLabel>
              <QuickButtons
                options={['Independent', 'Verbal Prompt', 'Visual Prompt', 'Physical Prompt', 'Hand-over-Hand']}
                selected={field.value}
                onSelect={field.onChange}
              />
            </FormItem>
          )} />
        </div>

        <Separator />

        {/* Section 4: Trial Data */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Trial Data (Optional)</h3>
          
          <div className="grid grid-cols-3 gap-4">
            <FormField control={form.control} name="correct_responses" render={({ field }) => (
              <FormItem>
                <FormLabel>Correct Responses</FormLabel>
                <FormControl><Input type="number" {...field} /></FormControl>
              </FormItem>
            )} />
            <FormField control={form.control} name="total_attempts" render={({ field }) => (
              <FormItem>
                <FormLabel>Total Attempts</FormLabel>
                <FormControl><Input type="number" {...field} /></FormControl>
              </FormItem>
            )} />
            <FormItem>
              <FormLabel>Accuracy %</FormLabel>
              <div className="h-10 flex items-center px-3 rounded-md border bg-muted">
                {calculateAccuracy()}%
              </div>
            </FormItem>
          </div>
        </div>

        <Separator />

        {/* Section 5: Observations & Notes */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Observations & Notes</h3>
          
          <FormField control={form.control} name="progress_notes" render={({ field }) => (
            <FormItem>
              <FormLabel>Progress Notes</FormLabel>
              <FormControl><TextareaWithVoice {...field} placeholder="Describe progress..." rows={3} /></FormControl>
            </FormItem>
          )} />

          <FormField control={form.control} name="behavioral_observations" render={({ field }) => (
            <FormItem>
              <FormLabel>Behavioral Observations</FormLabel>
              <FormControl><TextareaWithVoice {...field} placeholder="Note behaviors..." rows={2} /></FormControl>
            </FormItem>
          )} />

          <FormField control={form.control} name="strengths_observed" render={({ field }) => (
            <FormItem>
              <FormLabel>Strengths Observed</FormLabel>
              <FormControl><TextareaWithVoice {...field} placeholder="What went well?" rows={2} /></FormControl>
            </FormItem>
          )} />

          <FormField control={form.control} name="areas_for_improvement" render={({ field }) => (
            <FormItem>
              <FormLabel>Areas for Improvement</FormLabel>
              <FormControl><TextareaWithVoice {...field} placeholder="What needs work?" rows={2} /></FormControl>
            </FormItem>
          )} />

          <FormField control={form.control} name="challenges" render={({ field }) => (
            <FormItem>
              <FormLabel>Challenges</FormLabel>
              <FormControl><TextareaWithVoice {...field} placeholder="Difficulties encountered..." rows={2} /></FormControl>
            </FormItem>
          )} />

          <FormField control={form.control} name="modifications_used" render={({ field }) => (
            <FormItem>
              <FormLabel>Modifications/Accommodations Used</FormLabel>
              <FormControl>
                <MultiSelectButtons
                  options={['Visual Supports', 'Extended Time', 'Reduced Workload', 'Breaks', 'Alternative Seating', 'Assistive Technology', 'Other']}
                  selected={field.value}
                  onSelect={field.onChange}
                />
              </FormControl>
            </FormItem>
          )} />
        </div>

        <Separator />

        {/* Section 6: Next Steps & Communication */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Next Steps & Communication</h3>
          
          <FormField control={form.control} name="next_steps" render={({ field }) => (
            <FormItem>
              <FormLabel>Next Steps</FormLabel>
              <FormControl><TextareaWithVoice {...field} placeholder="What's next?" rows={2} /></FormControl>
            </FormItem>
          )} />

          <FormField control={form.control} name="goals_for_next_session" render={({ field }) => (
            <FormItem>
              <FormLabel>Goals for Next Session</FormLabel>
              <FormControl><TextareaWithVoice {...field} placeholder="Future goals..." rows={2} /></FormControl>
            </FormItem>
          )} />

          <FormField control={form.control} name="parent_communication" render={({ field }) => (
            <FormItem>
              <FormLabel>Parent Communication</FormLabel>
              <FormControl><TextareaWithVoice {...field} placeholder="Notes to share with parents..." rows={2} /></FormControl>
            </FormItem>
          )} />
        </div>

        <Separator />

        {/* Section 7: Attachments & Tags */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Attachments & Tags</h3>
          
          <FormField control={form.control} name="tags" render={({ field }) => (
            <FormItem>
              <FormLabel>Tags</FormLabel>
              <FormControl>
                <ArrayTextInput values={field.value} onChange={field.onChange} placeholder="Add tags..." />
              </FormControl>
            </FormItem>
          )} />

          <div>
            <FormLabel>Attachments</FormLabel>
            <ImageUploadPreview
              files={selectedFiles}
              previewUrls={previewUrls}
              onFilesChange={setSelectedFiles}
              onPreviewsChange={setPreviewUrls}
            />
          </div>
        </div>

        <Button type="submit" disabled={isSubmitting} className="w-full">
          {isSubmitting ? 'Saving...' : 'Save Educator Log'}
        </Button>
      </form>
    </Form>
  );
};
