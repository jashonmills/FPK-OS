import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useFamily } from '@/contexts/FamilyContext';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useWeatherForLog } from '@/hooks/useWeatherForLog';

interface EducatorLogFormProps {
  onSuccess?: () => void;
}

const LOG_TYPES = [
  { value: 'therapy', label: 'Therapy Session' },
  { value: 'classroom', label: 'Classroom Observation' },
  { value: 'observation', label: 'General Observation' },
  { value: 'behavior', label: 'Behavior Support' },
];

export const EducatorLogForm = ({ onSuccess }: EducatorLogFormProps) => {
  const { selectedFamily, selectedStudent } = useFamily();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { register, handleSubmit, reset, setValue, watch } = useForm({
    defaultValues: {
      log_date: new Date().toISOString().split('T')[0],
      log_time: new Date().toTimeString().slice(0, 5),
      log_type: 'therapy',
      educator_name: '',
      educator_role: '',
      session_duration_minutes: '',
      progress_notes: '',
      behavioral_observations: '',
      challenges: '',
      goals_for_next_session: '',
    },
  });

  const logType = watch('log_type');

  const { getWeatherForLog } = useWeatherForLog();

  const onSubmit = async (data: any) => {
    if (!selectedFamily?.id || !selectedStudent?.id) {
      toast.error('Please select a family and student');
      return;
    }

    setIsSubmitting(true);
    try {
      const weatherData = await getWeatherForLog();

      const user = await supabase.auth.getUser();

      const { error } = await supabase.from('educator_logs').insert([{
        family_id: selectedFamily.id,
        student_id: selectedStudent.id,
        created_by: user.data.user?.id || '',
        log_date: data.log_date,
        log_time: data.log_time,
        log_type: data.log_type,
        educator_name: data.educator_name,
        educator_role: data.educator_role || null,
        session_duration_minutes: data.session_duration_minutes ? parseInt(data.session_duration_minutes) : null,
        progress_notes: data.progress_notes || null,
        behavioral_observations: data.behavioral_observations || null,
        challenges: data.challenges || null,
        goals_for_next_session: data.goals_for_next_session || null,
        weather_condition: weatherData.weather_condition,
        weather_temp_f: weatherData.weather_temp_f,
        weather_temp_c: weatherData.weather_temp_c ? parseFloat(weatherData.weather_temp_c) : null,
        weather_humidity: weatherData.weather_humidity,
        weather_pressure_mb: weatherData.weather_pressure_mb,
        weather_wind_speed: weatherData.weather_wind_speed,
        weather_fetched_at: weatherData.weather_fetched_at,
        aqi_us: weatherData.aqi_us,
        pm25: weatherData.pm25,
        pm10: weatherData.pm10,
      }]);

      if (error) throw error;

      toast.success('Educator log created successfully');
      reset();
      onSuccess?.();
    } catch (error) {
      console.error('Error creating educator log:', error);
      toast.error('Failed to create educator log');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="log_date">Date</Label>
          <Input
            id="log_date"
            type="date"
            {...register('log_date', { required: true })}
          />
        </div>
        <div>
          <Label htmlFor="log_time">Time</Label>
          <Input
            id="log_time"
            type="time"
            {...register('log_time', { required: true })}
          />
        </div>
      </div>

      <div>
        <Label htmlFor="log_type">Log Type</Label>
        <Select
          value={logType}
          onValueChange={(value) => setValue('log_type', value)}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select log type" />
          </SelectTrigger>
          <SelectContent>
            {LOG_TYPES.map((type) => (
              <SelectItem key={type.value} value={type.value}>
                {type.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="educator_name">Educator Name</Label>
          <Input
            id="educator_name"
            {...register('educator_name', { required: true })}
            placeholder="Your name"
          />
        </div>
        <div>
          <Label htmlFor="educator_role">Role (Optional)</Label>
          <Input
            id="educator_role"
            {...register('educator_role')}
            placeholder="e.g., Speech Therapist, Teacher"
          />
        </div>
      </div>

      <div>
        <Label htmlFor="session_duration_minutes">Session Duration (minutes)</Label>
        <Input
          id="session_duration_minutes"
          type="number"
          {...register('session_duration_minutes')}
          placeholder="e.g., 45"
        />
      </div>

      <div>
        <Label htmlFor="progress_notes">Progress Notes</Label>
        <Textarea
          id="progress_notes"
          {...register('progress_notes')}
          placeholder="Describe the student's progress during this session..."
          rows={3}
        />
      </div>

      <div>
        <Label htmlFor="behavioral_observations">Behavioral Observations</Label>
        <Textarea
          id="behavioral_observations"
          {...register('behavioral_observations')}
          placeholder="Note any behavioral patterns or observations..."
          rows={3}
        />
      </div>

      <div>
        <Label htmlFor="challenges">Challenges</Label>
        <Textarea
          id="challenges"
          {...register('challenges')}
          placeholder="Describe any challenges encountered..."
          rows={2}
        />
      </div>

      <div>
        <Label htmlFor="goals_for_next_session">Goals for Next Session</Label>
        <Textarea
          id="goals_for_next_session"
          {...register('goals_for_next_session')}
          placeholder="What to focus on next time..."
          rows={2}
        />
      </div>

      <Button type="submit" disabled={isSubmitting} className="w-full">
        {isSubmitting ? 'Saving...' : 'Save Educator Log'}
      </Button>
    </form>
  );
};
