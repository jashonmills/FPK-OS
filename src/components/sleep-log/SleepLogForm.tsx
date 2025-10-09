import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { format } from 'date-fns';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { useFamily } from '@/contexts/FamilyContext';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { TextareaWithVoice } from '@/components/shared/TextareaWithVoice';
import { useAuth } from '@/hooks/useAuth';
import { fetchWeatherData } from '@/utils/weatherService';

interface SleepLogFormProps {
  onSuccess?: () => void;
}

export const SleepLogForm = ({ onSuccess }: SleepLogFormProps) => {
  const { selectedFamily, selectedStudent } = useFamily();
  const { user } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm({
    defaultValues: {
      sleep_date: format(new Date(), 'yyyy-MM-dd'),
      bedtime: '20:00',
      wake_time: '07:00',
      sleep_quality_rating: 3,
      nighttime_awakenings: 0,
      disturbance_details: '',
      daytime_fatigue_level: 3,
      nap_taken: false,
      nap_duration_minutes: '',
      nap_time: '',
      sleep_medication: false,
      medication_details: '',
      notes: '',
    }
  });

  const calculateSleepHours = (bedtime: string, wakeTime: string) => {
    const bed = new Date(`2000-01-01 ${bedtime}`);
    let wake = new Date(`2000-01-01 ${wakeTime}`);
    
    if (wake < bed) {
      wake = new Date(`2000-01-02 ${wakeTime}`);
    }
    
    const hours = (wake.getTime() - bed.getTime()) / (1000 * 60 * 60);
    return Math.round(hours * 10) / 10;
  };

  const onSubmit = async (data: any) => {
    if (!selectedFamily || !selectedStudent || !user) {
      toast.error('Please select a family and student');
      return;
    }

    setIsSubmitting(true);
    try {
      // Fetch weather data
      const weatherData = await fetchWeatherData();
      const totalSleepHours = calculateSleepHours(data.bedtime, data.wake_time);

      const { error } = await supabase
        .from('sleep_records')
        .insert({
          family_id: selectedFamily.id,
          student_id: selectedStudent.id,
          created_by: user.id,
          ...data,
          total_sleep_hours: totalSleepHours,
          nighttime_awakenings: Number(data.nighttime_awakenings),
          nap_duration_minutes: data.nap_duration_minutes ? Number(data.nap_duration_minutes) : null,
          // Weather & air quality data
          weather_temp_f: weatherData.weather_temp_f,
          weather_temp_c: weatherData.weather_temp_c ? parseFloat(weatherData.weather_temp_c) : null,
          weather_humidity: weatherData.weather_humidity,
          weather_pressure_mb: weatherData.weather_pressure_mb,
          weather_wind_speed: weatherData.weather_wind_speed,
          weather_condition: weatherData.weather_condition,
          weather_fetched_at: weatherData.weather_fetched_at,
          aqi_us: weatherData.aqi_us,
          pm25: weatherData.pm25,
          pm10: weatherData.pm10,
        });

      if (error) throw error;

      toast.success('Sleep record saved successfully');
      form.reset();
      onSuccess?.();
    } catch (error) {
      console.error('Error saving sleep record:', error);
      toast.error('Failed to save sleep record');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="sleep_date"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Sleep Date</FormLabel>
              <FormControl>
                <Input type="date" {...field} />
              </FormControl>
            </FormItem>
          )}
        />

        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="bedtime"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Bedtime</FormLabel>
                <FormControl>
                  <Input type="time" {...field} />
                </FormControl>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="wake_time"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Wake Time</FormLabel>
                <FormControl>
                  <Input type="time" {...field} />
                </FormControl>
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="sleep_quality_rating"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Sleep Quality (1-5)</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  min={1}
                  max={5}
                  {...field}
                  onChange={(e) => field.onChange(Number(e.target.value))}
                />
              </FormControl>
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="nighttime_awakenings"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nighttime Awakenings</FormLabel>
              <FormControl>
                <Input type="number" min={0} {...field} />
              </FormControl>
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="disturbance_details"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Disturbance Details</FormLabel>
              <FormControl>
                <TextareaWithVoice
                  {...field}
                  placeholder="Nightmares, restlessness, etc."
                  rows={2}
                />
              </FormControl>
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="daytime_fatigue_level"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Daytime Fatigue Level (1-5)</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  min={1}
                  max={5}
                  {...field}
                  onChange={(e) => field.onChange(Number(e.target.value))}
                />
              </FormControl>
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="nap_taken"
          render={({ field }) => (
            <FormItem className="flex items-center gap-2">
              <FormControl>
                <Checkbox
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
              <FormLabel className="!mt-0">Nap taken today?</FormLabel>
            </FormItem>
          )}
        />

        {form.watch('nap_taken') && (
          <div className="grid grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="nap_duration_minutes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nap Duration (minutes)</FormLabel>
                  <FormControl>
                    <Input type="number" {...field} />
                  </FormControl>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="nap_time"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nap Time</FormLabel>
                  <FormControl>
                    <Input type="time" {...field} />
                  </FormControl>
                </FormItem>
              )}
            />
          </div>
        )}

        <FormField
          control={form.control}
          name="notes"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Additional Notes</FormLabel>
              <FormControl>
                <TextareaWithVoice
                  {...field}
                  placeholder="Any other observations..."
                  rows={2}
                />
              </FormControl>
            </FormItem>
          )}
        />

        <Button type="submit" disabled={isSubmitting} className="w-full">
          {isSubmitting ? 'Saving...' : 'Save Sleep Record'}
        </Button>
      </form>
    </Form>
  );
};
