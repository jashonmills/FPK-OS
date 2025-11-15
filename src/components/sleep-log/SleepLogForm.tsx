import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { format } from 'date-fns';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { useFamily } from '@/contexts/FamilyContext';
import { useClient } from '@/hooks/useClient';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { TextareaWithVoice } from '@/components/shared/TextareaWithVoice';
import { useAuth } from '@/hooks/useAuth';
import { useWeatherForLog } from '@/hooks/useWeatherForLog';
import { MultiSelectButtons } from '@/components/shared/MultiSelectButtons';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface SleepLogFormProps {
  onSuccess?: () => void;
}

export const SleepLogForm = ({ onSuccess }: SleepLogFormProps) => {
  const { selectedFamily, selectedStudent } = useFamily();
  const { selectedClient, isNewModel } = useClient();
  const { user } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm({
    defaultValues: {
      sleep_date: format(new Date(), 'yyyy-MM-dd'),
      bedtime: '20:00',
      fell_asleep_time: '',
      wake_time: '07:00',
      sleep_quality_rating: 3,
      nighttime_awakenings: 0,
      disturbances: [] as string[],
      pre_bed_activities: [] as string[],
      daytime_fatigue_level: 3,
      nap_taken: false,
      nap_start_time: '',
      nap_end_time: '',
      fell_asleep_in_school: false,
      asleep_location: '',
      daytime_medication_taken: false,
      daytime_medication_details: '',
      daytime_notes: '',
      notes: '',
    }
  });

  const calculateSleepHours = (fellAsleepTime: string, wakeTime: string) => {
    if (!fellAsleepTime || !wakeTime) return 0;
    const sleep = new Date(`2000-01-01 ${fellAsleepTime}`);
    let wake = new Date(`2000-01-01 ${wakeTime}`);
    
    if (wake < sleep) {
      wake = new Date(`2000-01-02 ${wakeTime}`);
    }
    
    const hours = (wake.getTime() - sleep.getTime()) / (1000 * 60 * 60);
    return Math.round(hours * 10) / 10;
  };

  const calculateNapDuration = () => {
    const start = form.watch('nap_start_time');
    const end = form.watch('nap_end_time');
    if (!start || !end) return 0;
    const [startH, startM] = start.split(':').map(Number);
    const [endH, endM] = end.split(':').map(Number);
    return Math.max(0, (endH * 60 + endM) - (startH * 60 + startM));
  };

  const { getWeatherForLog } = useWeatherForLog();

  const onSubmit = async (data: any) => {
    if (!selectedFamily || !selectedStudent || !user) {
      toast.error('Please select a family and student');
      return;
    }

    setIsSubmitting(true);
    try {
      const weatherData = await getWeatherForLog();
      const fellAsleep = data.fell_asleep_time || data.bedtime;
      const totalSleepHours = calculateSleepHours(fellAsleep, data.wake_time);
      const napDuration = data.nap_taken ? calculateNapDuration() : null;

      const sleepData = {
        sleep_date: data.sleep_date,
        bedtime: data.bedtime,
        fell_asleep_time: data.fell_asleep_time || null,
        wake_time: data.wake_time,
        total_sleep_hours: totalSleepHours,
        sleep_quality_rating: data.sleep_quality_rating,
        nighttime_awakenings: Number(data.nighttime_awakenings),
        disturbances: data.disturbances.length > 0 ? data.disturbances : null,
        pre_bed_activities: data.pre_bed_activities.length > 0 ? data.pre_bed_activities : null,
        daytime_fatigue_level: data.daytime_fatigue_level,
        nap_taken: data.nap_taken,
        nap_start_time: data.nap_taken ? data.nap_start_time : null,
        nap_end_time: data.nap_taken ? data.nap_end_time : null,
        nap_duration_minutes: napDuration,
        fell_asleep_in_school: data.fell_asleep_in_school,
        asleep_location: data.fell_asleep_in_school ? data.asleep_location : null,
        daytime_medication_taken: data.daytime_medication_taken,
        daytime_medication_details: data.daytime_medication_details || null,
        daytime_notes: data.daytime_notes || null,
        notes: data.notes || null,
        ...weatherData,
      };

      let error;
      if (isNewModel && selectedClient) {
        const { error: rpcError } = await supabase.rpc('log_sleep_record', {
          p_client_id: selectedClient.id,
          p_sleep_data: sleepData
        });
        error = rpcError;
      } else {
        const { error: insertError } = await supabase
          .from('sleep_records')
          .insert([{
            family_id: selectedFamily.id,
            student_id: selectedStudent.id,
            created_by: user.id,
            ...sleepData
          }]);
        error = insertError;
      }

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

        <div className="grid grid-cols-3 gap-4">
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
            name="fell_asleep_time"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Fell Asleep (optional)</FormLabel>
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
          name="pre_bed_activities"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Pre-Bed Activities</FormLabel>
              <FormControl>
                <MultiSelectButtons
                  options={['Screen Time', 'Reading', 'Bath', 'Medication', 'Physical Activity', 'Meal', 'Other']}
                  selected={field.value}
                  onSelect={field.onChange}
                />
              </FormControl>
            </FormItem>
          )}
        />

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
          name="disturbances"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Sleep Disturbances</FormLabel>
              <FormControl>
                <MultiSelectButtons
                  options={['Nightmares', 'Night Terrors', 'Restlessness', 'Sleep Walking', 'Bed Wetting', 'Snoring', 'Other']}
                  selected={field.value}
                  onSelect={field.onChange}
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
          <div className="space-y-4">
            <div className="grid grid-cols-3 gap-4">
              <FormField
                control={form.control}
                name="nap_start_time"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nap Start</FormLabel>
                    <FormControl>
                      <Input type="time" {...field} />
                    </FormControl>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="nap_end_time"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nap End</FormLabel>
                    <FormControl>
                      <Input type="time" {...field} />
                    </FormControl>
                  </FormItem>
                )}
              />
              <FormItem>
                <FormLabel>Duration</FormLabel>
                <div className="h-10 flex items-center px-3 rounded-md border bg-muted">
                  {calculateNapDuration()} min
                </div>
              </FormItem>
            </div>
          </div>
        )}

        <FormField
          control={form.control}
          name="fell_asleep_in_school"
          render={({ field }) => (
            <FormItem className="flex items-center gap-2">
              <FormControl>
                <Checkbox
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
              <FormLabel className="!mt-0">Fell asleep in school?</FormLabel>
            </FormItem>
          )}
        />

        {form.watch('fell_asleep_in_school') && (
          <FormField
            control={form.control}
            name="asleep_location"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Where?</FormLabel>
                <Select value={field.value} onValueChange={field.onChange}>
                  <SelectTrigger><SelectValue placeholder="Select location..." /></SelectTrigger>
                  <SelectContent>
                    {['Classroom', 'Bus', 'Therapy Session', 'Cafeteria', 'Other'].map(loc => 
                      <SelectItem key={loc} value={loc}>{loc}</SelectItem>
                    )}
                  </SelectContent>
                </Select>
              </FormItem>
            )}
          />
        )}

        <FormField
          control={form.control}
          name="daytime_medication_taken"
          render={({ field }) => (
            <FormItem className="flex items-center gap-2">
              <FormControl>
                <Checkbox
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
              <FormLabel className="!mt-0">Daytime medication taken?</FormLabel>
            </FormItem>
          )}
        />

        {form.watch('daytime_medication_taken') && (
          <FormField
            control={form.control}
            name="daytime_medication_details"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Medication Details</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="Name and dosage..." />
                </FormControl>
              </FormItem>
            )}
          />
        )}

        <FormField
          control={form.control}
          name="daytime_notes"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Daytime Notes</FormLabel>
              <FormControl>
                <TextareaWithVoice
                  {...field}
                  placeholder="Daytime observations..."
                  rows={2}
                />
              </FormControl>
            </FormItem>
          )}
        />

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
